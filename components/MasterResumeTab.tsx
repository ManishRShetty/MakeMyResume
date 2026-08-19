"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Download, Layers, CheckCircle2, AlertTriangle, FileCode, SlidersHorizontal, Edit3 } from "lucide-react";
import { DEFAULT_TEMPLATES, ResumeTemplate } from "@/lib/templates/default-templates";
import { validateLatexSyntax } from "@/lib/latex-utils";
import { saveMasterLatex } from "@/lib/storage";
import { VisualProfileEditor } from "./VisualProfileEditor";

interface MasterResumeTabProps {
  masterLatex: string;
  setMasterLatex: (latex: string) => void;
}

export const MasterResumeTab: React.FC<MasterResumeTabProps> = ({
  masterLatex,
  setMasterLatex,
}) => {
  const [editorMode, setEditorMode] = useState<"visual" | "latex">("visual");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("manish-shetty-master");
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
      !confirm(`Replace current master resume with '${template.name}' preset?`)
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
      
      {/* Mode Switcher Pill */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="apple-segment-wrapper flex items-center">
          <button
            onClick={() => setEditorMode("visual")}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
              editorMode === "visual"
                ? "apple-segment-active font-semibold"
                : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-[#0071e3]" />
            Visual Details & Projects Editor
          </button>

          <button
            onClick={() => setEditorMode("latex")}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
              editorMode === "latex"
                ? "apple-segment-active font-semibold"
                : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-purple-500" />
            Raw LaTeX Code
          </button>
        </div>

        <div className="flex items-center gap-2">
          {validation.isValid ? (
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> Valid LaTeX
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              <AlertTriangle className="w-3 h-3" /> Syntax Issue
            </span>
          )}
        </div>
      </div>

      {/* Visual Form Mode */}
      {editorMode === "visual" && (
        <VisualProfileEditor
          onSaveLatex={(newLatex) => {
            setMasterLatex(newLatex);
            saveMasterLatex(newLatex);
          }}
        />
      )}

      {/* Raw LaTeX Editor Mode */}
      {editorMode === "latex" && (
        <div className="space-y-6">
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
      )}

    </div>
  );
};
