"use client";

import React, { useRef, useState } from "react";
import { Download, ZoomIn, ZoomOut, RotateCcw, FileText, Printer, Sparkles, Check, AlertCircle } from "lucide-react";
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

  // Parse structured text sections from LaTeX for clean visual preview
  const plainText = extractPlainTextFromLatex(latex);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 140));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 70));
  const handleResetZoom = () => setZoom(100);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setPdfSuccess(false);

    try {
      // 1. Try server compile API first
      const safeName = `${companyName || "Company"}_${jobTitle || "Resume"}_Resume`
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

      // 2. High fidelity HTML to Canvas to jsPDF fallback
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
      alert("Failed to export PDF automatically. Please use the Print button or Download .tex.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadTex = () => {
    const safeName = `${companyName || "Company"}_${jobTitle || "Resume"}_Resume`
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    const blob = new Blob([latex], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-3">
      {/* Viewer Action Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/80 dark:bg-neutral-900/80 apple-glass rounded-2xl border border-black/[0.08] dark:border-white/[0.1]">
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-neutral-500 w-10 text-center">
            {zoom}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Download & Print Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadTex}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-200 transition-colors border border-black/[0.06] dark:border-white/[0.08]"
          >
            <FileText className="w-3.5 h-3.5" />
            .tex Source
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-apple-blue hover:bg-apple-blue-hover text-white text-xs font-medium shadow-md shadow-apple-blue/20 transition-all duration-150 disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Compiling...
              </>
            ) : pdfSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
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

      {/* Scaled PDF Document Container */}
      <div className="w-full overflow-auto p-4 sm:p-8 bg-neutral-200/60 dark:bg-black/50 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] flex justify-center min-h-[680px]">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          className="transition-transform duration-150 ease-out"
        >
          {/* Printable A4 Resume Container */}
          <div
            ref={printRef}
            id="printable-resume-page"
            className="w-[210mm] min-h-[297mm] bg-white text-neutral-900 shadow-2xl p-[18mm] rounded-sm font-sans select-text leading-snug tracking-normal"
            style={{ boxSizing: "border-box" }}
          >
            {/* Formatted Resume Body */}
            <div className="space-y-4 text-[12px] text-neutral-800">
              {plainText.split("\n\n").map((block, idx) => {
                const trimmed = block.trim();
                if (!trimmed) return null;

                // Section Headers
                if (trimmed.startsWith("===") && trimmed.endsWith("===")) {
                  const title = trimmed.replace(/===/g, "").trim();
                  return (
                    <div key={idx} className="mt-4 pt-1 border-b border-neutral-800 pb-0.5">
                      <h3 className="font-bold text-[13px] tracking-wider uppercase text-neutral-900">
                        {title}
                      </h3>
                    </div>
                  );
                }

                // Heading / Name block (first block)
                if (idx === 0) {
                  return (
                    <div key={idx} className="text-center pb-2 border-b border-neutral-300">
                      <h1 className="text-[20px] font-bold tracking-tight text-neutral-900 uppercase">
                        {trimmed.split("\n")[0]}
                      </h1>
                      <p className="text-[11px] text-neutral-600 mt-1">
                        {trimmed.split("\n").slice(1).join(" · ")}
                      </p>
                    </div>
                  );
                }

                // Bullet item lines
                const lines = trimmed.split("\n");
                return (
                  <div key={idx} className="space-y-1">
                    {lines.map((line, lIdx) => {
                      if (line.startsWith("•") || line.startsWith("-")) {
                        return (
                          <div key={lIdx} className="flex items-start gap-2 pl-2">
                            <span className="text-neutral-700 font-bold select-none">•</span>
                            <span className="leading-relaxed">{line.replace(/^[•-]\s*/, "")}</span>
                          </div>
                        );
                      }
                      // Role / Company / Education Header Line
                      return (
                        <div key={lIdx} className="font-medium text-neutral-900 leading-snug">
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
