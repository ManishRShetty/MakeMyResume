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

    // 1. Try local pdflatex if installed on system
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "resume-compile-"));
    const texPath = path.join(tempDir, "document.tex");
    const pdfPath = path.join(tempDir, "document.pdf");

    fs.writeFileSync(texPath, latex, "utf8");

    try {
      await execAsync(`pdflatex -interaction=nonstopmode -output-directory="${tempDir}" "${texPath}"`, {
        timeout: 10000,
      });

      if (fs.existsSync(pdfPath)) {
        const pdfBuffer = fs.readFileSync(pdfPath);
        try {
          fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (_) {}

        return new NextResponse(pdfBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${safeFilename}.pdf"`,
          },
        });
      }
    } catch (_) {
      // Local pdflatex not found; seamlessly use cloud LaTeX compiler engine
    } finally {
      try {
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
        }
      } catch (_) {}
    }

    // 2. High-performance Cloud LaTeX Compilation Engine (Overleaf-identical pdflatex)
    try {
      const payload = JSON.stringify({
        compiler: "pdflatex",
        rootResourcePath: "main.tex",
        resources: [
          {
            path: "main.tex",
            content: latex,
          },
        ],
      });

      const compileRes = await fetch("https://latex.ytotech.com/builds/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "MakeMyResume/1.0",
        },
        body: payload,
      });

      if (compileRes.ok) {
        const pdfArrayBuffer = await compileRes.arrayBuffer();
        return new NextResponse(Buffer.from(pdfArrayBuffer), {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${safeFilename}.pdf"`,
          },
        });
      } else {
        const errText = await compileRes.text();
        console.warn("Cloud LaTeX compilation returned status:", compileRes.status, errText);
      }
    } catch (remoteErr) {
      console.error("Cloud LaTeX compilation failed:", remoteErr);
    }

    return NextResponse.json(
      {
        error: "Compilation unavailable. Please download the .tex source file.",
        latexSource: latex,
      },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Compilation route error:", error);
    return NextResponse.json({ error: error.message || "Failed to compile LaTeX" }, { status: 500 });
  }
}
