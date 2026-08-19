import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { latex, filename } = await req.json();

    if (!latex) {
      return NextResponse.json({ error: "No LaTeX content provided." }, { status: 400 });
    }

    const safeFilename = (filename || "resume").replace(/[^a-zA-Z0-9_-]/g, "_");

    // 1. Try local pdflatex / tectonic if installed
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "resume-compile-"));
    const texPath = path.join(tempDir, "document.tex");
    const pdfPath = path.join(tempDir, "document.pdf");

    fs.writeFileSync(texPath, latex, "utf8");

    try {
      // Try pdflatex command
      await execAsync(`pdflatex -interaction=nonstopmode -output-directory="${tempDir}" "${texPath}"`, {
        timeout: 15000,
      });

      if (fs.existsSync(pdfPath)) {
        const pdfBuffer = fs.readFileSync(pdfPath);
        // Clean up temp
        try {
          fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (_) {}

        return new NextResponse(pdfBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${safeFilename}.pdf"`,
          },
        });
      }
    } catch (localCompileErr) {
      // Local pdflatex not available or failed; fallback to online compilation or client renderer
      console.log("Local pdflatex not available, trying remote LaTeX compilation service...");
    } finally {
      try {
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
        }
      } catch (_) {}
    }

    // 2. Try remote latexonline compilation service fallback
    try {
      const remoteRes = await fetch("https://latexonline.cc/compile?text=" + encodeURIComponent(latex), {
        method: "GET",
        headers: {
          "User-Agent": "MakeMyResume/1.0",
        },
      });

      if (remoteRes.ok) {
        const pdfArrayBuffer = await remoteRes.arrayBuffer();
        return new NextResponse(Buffer.from(pdfArrayBuffer), {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${safeFilename}.pdf"`,
          },
        });
      }
    } catch (remoteErr) {
      console.warn("Remote LaTeX compilation failed:", remoteErr);
    }

    return NextResponse.json(
      {
        success: false,
        message: "LaTeX compiler not running locally. Client will render high-fidelity PDF preview and provide source .tex.",
        latexSource: latex,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Compilation error:", error);
    return NextResponse.json({ error: error.message || "Failed to compile LaTeX" }, { status: 500 });
  }
}
