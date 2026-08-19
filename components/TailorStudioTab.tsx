"use client";

import React, { useState } from "react";
import { Sparkles, Building2, Briefcase, FileCode, CheckCircle, ArrowRight, Download, Save, Eye, GitCompare, RefreshCw, AlertCircle } from "lucide-react";
import { TailorResponse } from "@/lib/gemini";
import { DiffViewer } from "./DiffViewer";
import { PdfViewer } from "./PdfViewer";
import { getSettings, addOrUpdateApplication, TailoredApplication } from "@/lib/storage";

interface TailorStudioTabProps {
  masterLatex: string;
  onNavigateToVault: () => void;
  onUpdateVaultCount: () => void;
}

const SAMPLE_JDS = [
  {
    company: "Google",
    role: "Software Engineer (University Graduate)",
    text: `Responsibilities:
- Design, develop, test, deploy, maintain, and enhance large-scale distributed software solutions.
- Work on high-performance cloud infrastructure using Go, C++, Python, and Java.
- Optimize database performance, low-latency RPC services with gRPC and Protocol Buffers.
- Collaborate with cross-functional teams in agile CI/CD development environments.

Requirements:
- Bachelor's degree in Computer Science, related technical field, or equivalent practical experience.
- Strong foundation in Data Structures, Algorithms, System Design, and Concurrency.
- Experience with Unix/Linux environments, Docker containerization, and automated testing.`
  },
  {
    company: "Stripe",
    role: "Full-Stack Backend Engineer",
    text: `About the Role:
We are looking for engineers to build world-class payment APIs, developer tooling, and financial infrastructure.

What you'll do:
- Architect reliable microservices handling millions of financial transactions daily with 99.999% uptime.
- Implement type-safe web applications using TypeScript, React, Next.js, and Node.js.
- Work with PostgreSQL, Redis caching, and Kafka streaming pipelines.
- Ensure strict security compliance, OAuth2 authentication, and end-to-end integration testing.`
  },
  {
    company: "Amazon",
    role: "Software Development Engineer (SDE 1)",
    text: `Job Description:
Amazon is seeking passionate Software Development Engineers to solve complex e-commerce, cloud, and logistics problems.

Basic Qualifications:
- Proficiency in Java, Python, C++, or TypeScript.
- Strong object-oriented design and distributed microservices experience.
- Experience working with AWS (EC2, S3, Lambda, SQS, DynamoDB).
- Dedication to operational excellence, code reviews, and high-quality unit/integration testing.`
  }
];

export const TailorStudioTab: React.FC<TailorStudioTabProps> = ({
  masterLatex,
  onNavigateToVault,
  onUpdateVaultCount,
}) => {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [tailorResult, setTailorResult] = useState<TailorResponse | null>(null);
  const [currentTailoredLatex, setCurrentTailoredLatex] = useState<string>("");
  const [activeOutputTab, setActiveOutputTab] = useState<"pdf" | "diff" | "latex">("pdf");
  const [savedToVault, setSavedToVault] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleApplySample = (sample: typeof SAMPLE_JDS[0]) => {
    setCompanyName(sample.company);
    setJobTitle(sample.role);
    setJobDescription(sample.text);
  };

  const handleTailorResume = async () => {
    if (!jobDescription.trim()) {
      alert("Please paste a Job Description first.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSavedToVault(false);

    try {
      const settings = getSettings();
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          masterLatex,
          companyName: companyName || "Target Company",
          jobTitle: jobTitle || "Software Engineer",
          jobDescription,
          apiKey: settings.geminiApiKey,
          modelName: settings.modelName,
          customPrompt: settings.customSystemPrompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to tailor resume");
      }

      setTailorResult(data);
      setCurrentTailoredLatex(data.tailoredLatex);

      // Auto-save to Applications Vault
      const newApp: TailoredApplication = {
        id: "app_" + Date.now(),
        companyName: companyName || "Target Company",
        jobTitle: jobTitle || "Software Engineer",
        jobDescription,
        tailoredLatex: data.tailoredLatex,
        originalLatex: masterLatex,
        atsScore: data.atsScore,
        matchedKeywords: data.matchedKeywords,
        missingKeywords: data.missingKeywords,
        keyChangesSummary: data.keyChangesSummary,
        status: "Applied",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addOrUpdateApplication(newApp);
      onUpdateVaultCount();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred during tailoring.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToVaultManual = () => {
    if (!tailorResult) return;
    const newApp: TailoredApplication = {
      id: "app_" + Date.now(),
      companyName: companyName || "Target Company",
      jobTitle: jobTitle || "Software Engineer",
      jobDescription,
      tailoredLatex: currentTailoredLatex,
      originalLatex: masterLatex,
      atsScore: tailorResult.atsScore,
      matchedKeywords: tailorResult.matchedKeywords,
      missingKeywords: tailorResult.missingKeywords,
      keyChangesSummary: tailorResult.keyChangesSummary,
      status: "Applied",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addOrUpdateApplication(newApp);
    onUpdateVaultCount();
    setSavedToVault(true);
    setTimeout(() => setSavedToVault(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Studio Top Controls & Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Job Input & AI Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="apple-card p-5 space-y-4">
            
            {/* Header & Quick Sample Buttons */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-apple-blue/10 dark:bg-apple-blue/20 flex items-center justify-center text-apple-blue dark:text-apple-blue-light font-semibold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                    Target Job Description
                  </h2>
                </div>
              </div>

              {/* Sample JDs quick pills */}
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-neutral-500 mr-1">Quick Samples:</span>
                {SAMPLE_JDS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplySample(s)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-apple-blue/10 hover:text-apple-blue dark:hover:bg-apple-blue/20 dark:hover:text-apple-blue-light transition-all border border-black/[0.04] dark:border-white/[0.06]"
                  >
                    {s.company}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs: Company & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google, Apple, Microsoft"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-black/[0.08] dark:border-white/[0.1] text-xs text-neutral-900 dark:text-white apple-focus"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                  Role / Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Software Engineer (SDE 1)"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-black/[0.08] dark:border-white/[0.1] text-xs text-neutral-900 dark:text-white apple-focus"
                />
              </div>
            </div>

            {/* Job Description Textarea */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                Paste Job Description (JD) & Requirements
              </label>
              <textarea
                rows={10}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job post, responsibilities, tech stack, and qualifications here..."
                className="w-full p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-black/[0.08] dark:border-white/[0.1] text-xs leading-relaxed text-neutral-900 dark:text-white apple-focus resize-y"
              />
            </div>

            {/* Error message banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Tailor Action Button */}
            <button
              onClick={handleTailorResume}
              disabled={isLoading || !jobDescription.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-apple-blue to-apple-blue-light hover:opacity-95 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-apple-blue/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Optimizing LaTeX for {companyName || "Company"}...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Tailor Resume for {companyName || "Target Role"}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </div>

          {/* AI Intelligence & ATS Breakdown Card (when results available) */}
          {tailorResult && (
            <div className="apple-card p-5 space-y-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  ATS Match & Intelligence Report
                </h3>
                <span className="text-[11px] text-emerald-500 font-medium">
                  {companyName || "Target Company"}
                </span>
              </div>

              {/* ATS Score Circular Meter */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-black/[0.04] dark:border-white/[0.06]">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="5"
                      fill="transparent"
                      className="text-neutral-300 dark:text-neutral-700"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray={163.3}
                      strokeDashoffset={163.3 - (163.3 * tailorResult.atsScore) / 100}
                      className="text-apple-blue stroke-circle"
                    />
                  </svg>
                  <span className="absolute text-sm font-bold text-neutral-900 dark:text-white">
                    {tailorResult.atsScore}%
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white">
                    ATS Keyword Compatibility
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {tailorResult.atsScore >= 85
                      ? "Excellent placement alignment! High ATS pass rate."
                      : "Good alignment. Review missing skills to further boost score."}
                  </p>
                </div>
              </div>

              {/* Matched Keywords */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                  Aligned Tech Keywords ({tailorResult.matchedKeywords.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tailorResult.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Enhancements Summary */}
              {tailorResult.keyChangesSummary.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    Strategic Improvements
                  </span>
                  <ul className="space-y-1 text-[11px] text-neutral-600 dark:text-neutral-300">
                    {tailorResult.keyChangesSummary.map((change, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-apple-blue font-bold">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Save / Vault Action */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handleSaveToVaultManual}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                >
                  {savedToVault ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      Saved to Vault!
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-amber-500" />
                      Update in Vault
                    </>
                  )}
                </button>

                <button
                  onClick={onNavigateToVault}
                  className="text-xs text-apple-blue hover:underline"
                >
                  View All Resumes →
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Output Viewer (PDF Preview / Diff / LaTeX Code) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="apple-card p-4 sm:p-5 space-y-4">
            
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center p-1 rounded-xl bg-neutral-200/60 dark:bg-neutral-800/60 border border-black/[0.04] dark:border-white/[0.06]">
                <button
                  onClick={() => setActiveOutputTab("pdf")}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    activeOutputTab === "pdf"
                      ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-apple-blue" />
                  PDF Preview
                </button>

                <button
                  onClick={() => setActiveOutputTab("diff")}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    activeOutputTab === "diff"
                      ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <GitCompare className="w-3.5 h-3.5 text-purple-500" />
                  Changes Diff
                </button>

                <button
                  onClick={() => setActiveOutputTab("latex")}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    activeOutputTab === "latex"
                      ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-emerald-500" />
                  Tailored LaTeX
                </button>
              </div>

              {tailorResult && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-500">
                    Ready for {companyName || "application"}
                  </span>
                </div>
              )}
            </div>

            {/* Active Output View */}
            {activeOutputTab === "pdf" && (
              <PdfViewer
                latex={currentTailoredLatex || masterLatex}
                companyName={companyName}
                jobTitle={jobTitle}
                isCompiling={isLoading}
              />
            )}

            {activeOutputTab === "diff" && (
              <DiffViewer
                originalLatex={masterLatex}
                tailoredLatex={currentTailoredLatex || masterLatex}
              />
            )}

            {activeOutputTab === "latex" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
                  <span>Editable Tailored LaTeX Source</span>
                  <span>{currentTailoredLatex ? currentTailoredLatex.split("\n").length : 0} lines</span>
                </div>
                <textarea
                  value={currentTailoredLatex || masterLatex}
                  onChange={(e) => setCurrentTailoredLatex(e.target.value)}
                  spellCheck={false}
                  className="w-full h-[600px] p-4 font-mono text-xs leading-relaxed rounded-2xl bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-black/[0.08] dark:border-white/[0.1] apple-focus"
                />
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
