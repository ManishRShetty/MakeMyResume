"use client";

import React, { useState, useEffect, useRef } from "react";
import { Download, RefreshCw, FileText, Check, AlertCircle, ExternalLink } from "lucide-react";

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
}) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isCompilingPdf, setIsCompilingPdf] = useState<boolean>(true);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const lastCompiledLatex = useRef<string>("");

  const compileToPdf = async (latexCode: string) => {
    if (!latexCode.trim()) return;
    setIsCompilingPdf(true);
    setCompileError(null);

    try {
      const safeName = `Manish_R_Shetty_${companyName || "Tailored"}_Resume`
        .replace(/[^a-zA-Z0-9_-]/g, "_");

      const res = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latex: latexCode, filename: safeName }),
      });

      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/pdf")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        // Revoke old url
        if (pdfBlobUrl) {
          URL.revokeObjectURL(pdfBlobUrl);
        }
        setPdfBlobUrl(url);
        lastCompiledLatex.current = latexCode;
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to compile LaTeX into PDF");
      }
    } catch (err: any) {
      console.error("PDF Compilation Error:", err);
      setCompileError(err.message || "Failed to compile LaTeX. Please verify syntax.");
    } finally {
      setIsCompilingPdf(false);
    }
  };

  useEffect(() => {
    if (latex && latex !== lastCompiledLatex.current) {
      compileToPdf(latex);
    }
  }, [latex]);

  const handleDownloadPdf = () => {
    if (!pdfBlobUrl) return;
    const safeName = `Manish_R_Shetty_${companyName || "Tailored"}_Resume`
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    const a = document.createElement("a");
    a.href = pdfBlobUrl;
    a.download = `${safeName}.pdf`;
    a.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
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

  const handleOpenInNewTab = () => {
    if (pdfBlobUrl) {
      window.open(pdfBlobUrl, "_blank");
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-full border border-black/[0.06] dark:border-white/[0.08]">
        
        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs">
          {isCompilingPdf ? (
            <span className="flex items-center gap-1.5 text-[#0071e3] font-medium">
              <div className="w-3.5 h-3.5 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin" />
              Compiling LaTeX (pdflatex)...
            </span>
          ) : pdfBlobUrl ? (
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Overleaf-Grade PDF Ready
            </span>
          ) : (
            <span className="text-[#86868b]">Ready to compile</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => compileToPdf(latex)}
            disabled={isCompilingPdf}
            className="p-1.5 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="Recompile PDF"
          >
            <RefreshCw className={`w-4 h-4 ${isCompilingPdf ? "animate-spin" : ""}`} />
          </button>

          {pdfBlobUrl && (
            <button
              onClick={handleOpenInNewTab}
              className="p-1.5 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Open Fullscreen PDF in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleDownloadTex}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium apple-button-secondary flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-[#86868b]" />
            .tex Source
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={!pdfBlobUrl || isCompilingPdf}
            className="px-4 py-1.5 rounded-full apple-button-primary text-xs font-medium flex items-center gap-1.5 shadow-md shadow-[#0071e3]/20 disabled:opacity-50"
          >
            {downloadSuccess ? (
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

      {/* Real Compiled PDF Container */}
      <div className="w-full h-[760px] bg-[#f5f5f7] dark:bg-[#121214] rounded-3xl border border-black/[0.06] dark:border-white/[0.08] overflow-hidden flex flex-col items-center justify-center relative shadow-inner">
        
        {isCompilingPdf && !pdfBlobUrl && (
          <div className="flex flex-col items-center gap-3 text-center p-8">
            <div className="w-8 h-8 border-3 border-[#0071e3] border-t-transparent rounded-full animate-spin" />
            <div>
              <h4 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Compiling Genuine LaTeX PDF
              </h4>
              <p className="text-xs text-[#86868b] mt-1">
                Applying Computer Modern typography, tabular alignments, and FontAwesome icons...
              </p>
            </div>
          </div>
        )}

        {compileError && !pdfBlobUrl && (
          <div className="p-8 max-w-md text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              Compilation Issue
            </h4>
            <p className="text-xs text-[#86868b]">{compileError}</p>
            <button
              onClick={() => compileToPdf(latex)}
              className="px-4 py-2 rounded-full apple-button-primary text-xs font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {pdfBlobUrl && (
          <iframe
            src={`${pdfBlobUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
            className="w-full h-full border-none rounded-3xl"
            title="Compiled LaTeX PDF Preview"
          />
        )}

      </div>
    </div>
  );
};
