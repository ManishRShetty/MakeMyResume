"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Download, RotateCcw, AlertTriangle, CheckCircle2, FileCode, Layers, Info } from "lucide-react";
import { DEFAULT_TEMPLATES, ResumeTemplate } from "@/lib/templates/default-templates";
import { validateLatexSyntax } from "@/lib/latex-utils";
import { saveMasterLatex } from "@/lib/storage";

interface MasterResumeTabProps {
  masterLatex: string;
  setMasterLatex: (latex: string) => void;
}

export const MasterResumeTab: React.FC<MasterResumeTabProps> = ({
  masterLatex,
  setMasterLatex,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("jakes-resume");
  const [copied, setCopied] = useState(false);
  const [validation, setValidation] = useState(validateLatexSyntax(masterLatex));

  useEffect(() => {
    setValidation(validateLatexSyntax(masterLatex));
  }, [masterLatex]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setMasterLatex(val);
    saveMasterLatex(val);
  };

  const handleApplyPreset = (template: ResumeTemplate) => {
    if (
      masterLatex !== template.latex &&
      !confirm(`Replace current LaTeX code with '${template.name}' preset?`)
    ) {
      return;
    }
    setSelectedTemplateId(template.id);
    setMasterLatex(template.latex);
    saveMasterLatex(template.latex);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(masterLatex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTex = () => {
    const blob = new Blob([masterLatex], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Master_Resume.tex";
    a.click();
    URL.revokeObjectURL(url);
  };

  const linesCount = masterLatex.split("\n").length;
  const charsCount = masterLatex.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner / Template Selector */}
      <div className="apple-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
              Master Placement Resume Template
            </h2>
            {validation.isValid ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> Valid LaTeX
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                <AlertTriangle className="w-3 h-3" /> Syntax Issue
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
            This is your primary master resume with all your career experiences, projects, and skills. When you tailor for a specific company in the Tailor Studio, the AI will adapt from this source.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800/80 p-1.5 rounded-xl border border-black/[0.06] dark:border-white/[0.08]">
            <Layers className="w-3.5 h-3.5 text-neutral-500 ml-1" />
            <span className="text-xs text-neutral-500 hidden sm:inline">Templates:</span>
            {DEFAULT_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleApplyPreset(tmpl)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  selectedTemplateId === tmpl.id
                    ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
                title={tmpl.description}
              >
                {tmpl.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Container */}
      <div className="apple-card overflow-hidden">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-100/70 dark:bg-neutral-900/70 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-600 dark:text-neutral-400 font-medium">
              <FileCode className="w-4 h-4 text-apple-blue" />
              master_resume.tex
            </span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
              {linesCount} lines · {charsCount.toLocaleString()} chars
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy Code"}
            </button>

            <button
              onClick={handleDownloadTex}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download .tex
            </button>
          </div>
        </div>

        {/* Syntax Error Box (if any) */}
        {!validation.isValid && validation.errors.length > 0 && (
          <div className="px-4 py-2 bg-rose-500/10 border-b border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">LaTeX Syntax Warning:</span> {validation.errors.join(", ")}
            </div>
          </div>
        )}

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={masterLatex}
            onChange={handleTextChange}
            spellCheck={false}
            className="w-full h-[620px] p-5 font-mono text-[13px] leading-relaxed bg-neutral-50/50 dark:bg-black/40 text-neutral-900 dark:text-neutral-100 resize-y apple-focus border-none"
            placeholder="Paste or write your full LaTeX resume here..."
          />
        </div>

        {/* Bottom Helper Bar */}
        <div className="px-4 py-2.5 bg-neutral-100/50 dark:bg-neutral-900/50 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-apple-blue" />
            <span>Changes are automatically saved to your browser&apos;s storage.</span>
          </div>
          <div>
            Format: UTF-8 LaTeX / pdflatex
          </div>
        </div>
      </div>
    </div>
  );
};
