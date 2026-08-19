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
    role: "Software Engineer (New Grad)",
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
    company: "Apple",
    role: "Full-Stack Software Engineer",
    text: `About the Role:
Apple is seeking an exceptional Software Engineer to craft user-centric web applications and robust distributed cloud services.

Key Qualifications:
- Proficiency in TypeScript, React, Node.js, and modern CSS architecture.
- Experience architecting microservices, REST/GraphQL APIs, and relational databases (PostgreSQL).
- Deep passion for performance optimization, UI responsiveness, and code quality.
- Familiarity with containerization (Docker, Kubernetes) and CI/CD automation.`
  },
  {
    company: "Goldman Sachs",
    role: "Quantitative Technology Analyst / SDE",
    text: `Job Description:
Join our global engineering team building mission-critical financial platforms and low-latency algorithmic trading systems.

Requirements:
- Strong programming skills in Java, Python, C++, or TypeScript.
- Solid understanding of distributed computing, caching architectures (Redis), and SQL databases.
- Analytical problem solving and ability to deliver resilient, highly secure software.`
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

      const responseText = await res.text();
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(`Server returned unexpected response (${res.status}): ${responseText.substring(0, 150)}`);
      }

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
      console.error("Tailor Error:", err);
      setErrorMessage(err.message || "An error occurred during resume tailoring.");
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
    <div className="space-y-8 animate-fade-in">
      {/* Split Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Job Input & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="apple-bento-card p-6 sm:p-8 space-y-6">
            
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff]">
                  Target Opportunity
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight mt-1">
                Job Description
              </h2>
              <p className="text-xs text-[#86868b] mt-1">
                Paste the company&apos;s JD. The engine extracts tech requirements and aligns your resume.
              </p>

              {/* Sample JDs quick pills */}
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-[#86868b]">Sample Roles:</span>
                {SAMPLE_JDS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplySample(s)}
                    className="text-xs px-3 py-1 rounded-full bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] transition-colors border border-black/[0.04] dark:border-white/[0.06] font-medium"
                  >
                    {s.company}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs: Company & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google, Apple, Stripe"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] apple-focus"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Software Engineer (SDE 1)"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] apple-focus"
                />
              </div>
            </div>

            {/* Job Description Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                Job Description & Qualifications
              </label>
              <textarea
                rows={9}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job post, responsibilities, tech stack, and qualifications..."
                className="w-full p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] text-xs leading-relaxed text-[#1d1d1f] dark:text-[#f5f5f7] apple-focus resize-y"
              />
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Tailor Action Button */}
            <button
              onClick={handleTailorResume}
              disabled={isLoading || !jobDescription.trim()}
              className="w-full py-3.5 px-6 rounded-full apple-button-primary text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#0071e3]/20 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Optimizing LaTeX for {companyName || "Company"}...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  <span>Tailor Resume for {companyName || "Target Company"}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

          </div>

          {/* AI Intelligence & ATS Report Card */}
          {tailorResult && (
            <div className="apple-bento-card p-6 sm:p-8 space-y-5 animate-slide-up">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff]">
                  ATS Intelligence
                </span>
                <span className="text-xs font-medium text-[#86868b]">
                  {companyName || "Target Company"}
                </span>
              </div>

              {/* ATS Score Progress Meter */}
              <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e]">
                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
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
                      className="text-[#0071e3] dark:text-[#2997ff] score-circle"
                    />
                  </svg>
                  <span className="absolute text-sm font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {tailorResult.atsScore}%
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    ATS Keyword Compatibility
                  </h4>
                  <p className="text-[11px] text-[#86868b] mt-0.5">
                    {tailorResult.atsScore >= 85
                      ? "Exceptional match! High recruiter screening pass rate."
                      : "Strong alignment. Review matched skills below."}
                  </p>
                </div>
              </div>

              {/* Matched Keywords */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                  Target Tech Keywords ({tailorResult.matchedKeywords.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tailorResult.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Enhancements Summary */}
              {tailorResult.keyChangesSummary.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <span className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Strategic Enhancements
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#86868b]">
                    {tailorResult.keyChangesSummary.map((change, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#0071e3] font-bold">•</span>
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
                  className="px-4 py-2 rounded-full text-xs font-medium apple-button-secondary flex items-center gap-1.5"
                >
                  {savedToVault ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      Saved in Vault
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-[#86868b]" />
                      Save to Vault
                    </>
                  )}
                </button>

                <button
                  onClick={onNavigateToVault}
                  className="text-xs text-[#0071e3] hover:underline font-medium"
                >
                  View All Saved Resumes →
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Output Viewer */}
        <div className="lg:col-span-7 space-y-6">
          <div className="apple-bento-card p-6 sm:p-8 space-y-6">
            
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="apple-segment-wrapper flex items-center">
                <button
                  onClick={() => setActiveOutputTab("pdf")}
                  className={`flex items-center gap-1.5 px-4 py-1 text-xs font-medium rounded-full transition-all ${
                    activeOutputTab === "pdf"
                      ? "apple-segment-active font-semibold"
                      : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-[#0071e3]" />
                  PDF Preview
                </button>

                <button
                  onClick={() => setActiveOutputTab("diff")}
                  className={`flex items-center gap-1.5 px-4 py-1 text-xs font-medium rounded-full transition-all ${
                    activeOutputTab === "diff"
                      ? "apple-segment-active font-semibold"
                      : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                  }`}
                >
                  <GitCompare className="w-3.5 h-3.5 text-purple-500" />
                  Diff
                </button>

                <button
                  onClick={() => setActiveOutputTab("latex")}
                  className={`flex items-center gap-1.5 px-4 py-1 text-xs font-medium rounded-full transition-all ${
                    activeOutputTab === "latex"
                      ? "apple-segment-active font-semibold"
                      : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-emerald-500" />
                  LaTeX Code
                </button>
              </div>

              {tailorResult && (
                <span className="text-xs text-[#86868b] font-medium">
                  {companyName ? `${companyName} Version` : "Tailored Version"}
                </span>
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
                <div className="flex items-center justify-between text-xs text-[#86868b] px-1">
                  <span>Editable Tailored LaTeX Source</span>
                  <span>{currentTailoredLatex ? currentTailoredLatex.split("\n").length : 0} lines</span>
                </div>
                <textarea
                  value={currentTailoredLatex || masterLatex}
                  onChange={(e) => setCurrentTailoredLatex(e.target.value)}
                  spellCheck={false}
                  className="w-full h-[600px] p-5 font-mono text-xs leading-relaxed rounded-2xl bg-[#f5f5f7] dark:bg-[#161617] text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                />
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
