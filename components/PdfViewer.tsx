"use client";

import React, { useRef, useState } from "react";
import { Download, ZoomIn, ZoomOut, RotateCcw, FileText, Check } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { extractPlainTextFromLatex } from "@/lib/latex-utils";

interface PdfViewerProps {
  latex: string;
  companyName: string;
  jobTitle: string;
  isCompiling?: boolean;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  latex,
  companyName,
  jobTitle,
  isCompiling = false,
}) => {
  const [zoom, setZoom] = useState(100);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const plainText = extractPlainTextFromLatex(latex);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 140));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 70));
  const handleResetZoom = () => setZoom(100);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setPdfSuccess(false);

    try {
      const safeName = `Manish_R_Shetty_${companyName || "Tailored"}_Resume`
        .replace(/[^a-zA-Z0-9_-]/g, "_");

      const res = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latex, filename: safeName }),
      });

      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/pdf")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${safeName}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        setPdfSuccess(true);
        setTimeout(() => setPdfSuccess(false), 3000);
        setIsGeneratingPdf(false);
        return;
      }

      if (printRef.current) {
        const element = printRef.current;
        const canvas = await html2canvas(element, {
          scale: 2.5,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${safeName}.pdf`);
        setPdfSuccess(true);
        setTimeout(() => setPdfSuccess(false), 3000);
      }
    } catch (e) {
      console.error("PDF generation error:", e);
      alert("Failed to export PDF automatically. You can download the .tex source file directly.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadTex = () => {
    const safeName = `Manish_R_Shetty_${companyName || "Tailored"}_Resume`
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    const blob = new Blob([latex], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-full border border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-[#86868b] w-10 text-center">
            {zoom}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadTex}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium apple-button-secondary flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-[#86868b]" />
            .tex Code
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-1.5 rounded-full apple-button-primary text-xs font-medium flex items-center gap-1.5 shadow-md shadow-[#0071e3]/20 disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Compiling...
              </>
            ) : pdfSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* PDF Document Canvas */}
      <div className="w-full overflow-auto p-4 sm:p-8 bg-[#f5f5f7] dark:bg-[#121214] rounded-3xl border border-black/[0.06] dark:border-white/[0.08] flex justify-center min-h-[660px]">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          className="transition-transform duration-150 ease-out"
        >
          {/* A4 Paper replicating Manish's Jake's Resume style */}
          <div
            ref={printRef}
            id="printable-resume-page"
            className="w-[210mm] min-h-[297mm] bg-white text-[#1d1d1f] shadow-2xl p-[14mm] rounded-sm font-sans select-text leading-snug"
            style={{ boxSizing: "border-box" }}
          >
            <div className="space-y-3 text-[11.5px] text-neutral-900 leading-normal">
              {plainText.split("\n\n").map((block, idx) => {
                const trimmed = block.trim();
                if (!trimmed) return null;

                // Section Headers
                if (trimmed.startsWith("===") && trimmed.endsWith("===")) {
                  const title = trimmed.replace(/===/g, "").trim();
                  return (
                    <div key={idx} className="mt-3 pt-1 border-b border-black pb-0.5">
                      <h3 className="font-bold text-[12.5px] tracking-wide uppercase text-neutral-900">
                        {title}
                      </h3>
                    </div>
                  );
                }

                // Heading / Contact Header block (First block)
                if (idx === 0) {
                  const headerLines = trimmed.split("\n");
                  const name = headerLines[0].replace(/\*\*/g, "").trim();
                  const location = headerLines.length > 1 ? headerLines[1] : "";
                  const headline = headerLines.length > 2 ? headerLines[2] : "";
                  const contacts = headerLines.length > 3 ? headerLines.slice(3).join(" · ") : "";

                  return (
                    <div key={idx} className="text-center pb-2">
                      <h1 className="text-[22px] font-bold tracking-tight text-neutral-900 uppercase">
                        {name || "Manish R Shetty"}
                      </h1>
                      {location && <p className="text-[11px] text-neutral-700">{location}</p>}
                      {headline && (
                        <p className="text-[10.5px] text-neutral-800 italic mt-0.5 max-w-xl mx-auto">
                          {headline}
                        </p>
                      )}
                      {contacts && (
                        <p className="text-[10.5px] text-neutral-700 mt-1 space-x-1">
                          {contacts}
                        </p>
                      )}
                    </div>
                  );
                }

                // Project heading format
                if (trimmed.startsWith("[PROJ]")) {
                  const content = trimmed.replace(/^\[PROJ\]\s*/, "");
                  const [projTitle, projDate] = content.split(" | ");
                  return (
                    <div key={idx} className="flex justify-between items-baseline font-bold text-neutral-900 mt-1">
                      <span>{projTitle}</span>
                      <span className="text-[10.5px] text-neutral-700 font-semibold">{projDate}</span>
                    </div>
                  );
                }

                // Subheading format
                if (trimmed.startsWith("[SUBHEAD]")) {
                  const content = trimmed.replace(/^\[SUBHEAD\]\s*/, "");
                  return (
                    <div key={idx} className="font-semibold text-neutral-900 mt-1">
                      {content}
                    </div>
                  );
                }

                // Bullet item lines & text
                const lines = trimmed.split("\n");
                return (
                  <div key={idx} className="space-y-0.5">
                    {lines.map((line, lIdx) => {
                      if (line.startsWith("•") || line.startsWith("-")) {
                        return (
                          <div key={lIdx} className="flex items-start gap-2 pl-2">
                            <span className="text-neutral-800 font-bold select-none">•</span>
                            <span className="leading-tight text-[11px]">
                              {line.replace(/^[•-]\s*/, "")}
                            </span>
                          </div>
                        );
                      }

                      // Sub-bold sections
                      return (
                        <div key={lIdx} className="text-[11px] leading-tight">
                          {line}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
