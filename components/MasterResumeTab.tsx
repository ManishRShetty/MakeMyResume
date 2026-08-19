"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Download, Layers, CheckCircle2, AlertTriangle, FileCode } from "lucide-react";
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
      <div className="apple-bento-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff]">
              Master Template
            </span>
            {validation.isValid ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> Valid
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                <AlertTriangle className="w-3 h-3" /> Syntax Alert
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight mt-1">
            Core Career Resume (LaTeX)
          </h2>
          <p className="text-xs text-[#86868b] mt-1 max-w-xl">
            Contains your complete, authoritative list of internships, projects, and skills. The Tailor Studio adapts from this code for each job posting.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="apple-segment-wrapper flex items-center shrink-0">
          {DEFAULT_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleApplyPreset(tmpl)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                selectedTemplateId === tmpl.id
                  ? "apple-segment-active font-semibold"
                  : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
              }`}
              title={tmpl.description}
            >
              {tmpl.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Container */}
      <div className="apple-bento-card overflow-hidden">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#f5f5f7] dark:bg-[#1c1c1e] border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-mono text-[#1d1d1f] dark:text-[#f5f5f7] font-medium">
              <FileCode className="w-4 h-4 text-[#0071e3]" />
              master_resume.tex
            </span>
            <span className="text-[11px] text-[#86868b]">
              {linesCount} lines · {charsCount.toLocaleString()} chars
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[#86868b]" />}
              {copied ? "Copied" : "Copy Code"}
            </button>

            <button
              onClick={handleDownloadTex}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#86868b]" />
              Download .tex
            </button>
          </div>
        </div>

        {/* Syntax Error Box */}
        {!validation.isValid && validation.errors.length > 0 && (
          <div className="px-6 py-2.5 bg-rose-500/10 border-b border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Syntax Check:</span> {validation.errors.join(", ")}
            </div>
          </div>
        )}

        {/* Text Area */}
        <textarea
          value={masterLatex}
          onChange={handleTextChange}
          spellCheck={false}
          className="w-full h-[620px] p-6 font-mono text-[13px] leading-relaxed bg-[#ffffff] dark:bg-[#121214] text-[#1d1d1f] dark:text-[#f5f5f7] resize-y apple-focus border-none"
          placeholder="Paste or write your full LaTeX resume here..."
        />
      </div>
    </div>
  );
};
