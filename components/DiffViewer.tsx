"use client";

import React, { useMemo } from "react";
import { calculateDiff, DiffPart } from "@/lib/latex-utils";

interface DiffViewerProps {
  originalLatex: string;
  tailoredLatex: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ originalLatex, tailoredLatex }) => {
  const diffParts = useMemo(() => {
    return calculateDiff(originalLatex, tailoredLatex);
  }, [originalLatex, tailoredLatex]);

  return (
    <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.1] overflow-hidden bg-neutral-900 text-neutral-100 font-mono text-xs leading-relaxed">
      {/* Diff Legend Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-950 border-b border-white/[0.08] text-[11px]">
        <span className="font-semibold text-neutral-400">LaTeX Code Modifications</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            Tailored Additions / Keyword Enhancements (+)
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
            Removed / Replaced (-)
          </span>
        </div>
      </div>

      {/* Code Body */}
      <div className="p-4 max-h-[580px] overflow-y-auto space-y-0.5">
        {diffParts.map((part: DiffPart, index: number) => {
          const lines = part.value.replace(/\n$/, "").split("\n");

          if (part.added) {
            return (
              <div key={index} className="bg-emerald-950/40 border-l-2 border-emerald-500 text-emerald-300 px-2 py-0.5 my-0.5 rounded-r">
                {lines.map((line, lIdx) => (
                  <div key={lIdx} className="flex">
                    <span className="select-none text-emerald-600 dark:text-emerald-500 font-semibold w-5 shrink-0">+</span>
                    <span className="whitespace-pre-wrap break-all">{line || " "}</span>
                  </div>
                ))}
              </div>
            );
          }

          if (part.removed) {
            return (
              <div key={index} className="bg-rose-950/40 border-l-2 border-rose-500 text-rose-300/80 line-through opacity-70 px-2 py-0.5 my-0.5 rounded-r">
                {lines.map((line, lIdx) => (
                  <div key={lIdx} className="flex">
                    <span className="select-none text-rose-500 font-semibold w-5 shrink-0">-</span>
                    <span className="whitespace-pre-wrap break-all">{line || " "}</span>
                  </div>
                ))}
              </div>
            );
          }

          // Unchanged lines
          return (
            <div key={index} className="text-neutral-400 px-2 py-0.2">
              {lines.map((line, lIdx) => (
                <div key={lIdx} className="flex hover:bg-white/[0.03]">
                  <span className="select-none text-neutral-600 w-5 shrink-0"> </span>
                  <span className="whitespace-pre-wrap break-all">{line || " "}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
