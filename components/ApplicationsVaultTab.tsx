"use client";

import React, { useState, useEffect } from "react";
import { Search, Trash2, Download, FileText, ExternalLink, Calendar, CheckCircle2, Clock, Sparkles, Building2, Briefcase } from "lucide-react";
import { getApplications, deleteApplication, addOrUpdateApplication, TailoredApplication } from "@/lib/storage";

interface ApplicationsVaultTabProps {
  onLoadIntoStudio: (app: TailoredApplication) => void;
  onUpdateVaultCount: () => void;
}

export const ApplicationsVaultTab: React.FC<ApplicationsVaultTabProps> = ({
  onLoadIntoStudio,
  onUpdateVaultCount,
}) => {
  const [apps, setApps] = useState<TailoredApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const refreshApps = () => {
    setApps(getApplications());
    onUpdateVaultCount();
  };

  useEffect(() => {
    refreshApps();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this tailored resume from your vault?")) {
      deleteApplication(id);
      refreshApps();
    }
  };

  const handleStatusChange = (app: TailoredApplication, newStatus: TailoredApplication["status"], e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const updated = { ...app, status: newStatus };
    addOrUpdateApplication(updated);
    refreshApps();
  };

  const handleDownloadTex = (app: TailoredApplication, e: React.MouseEvent) => {
    e.stopPropagation();
    const safeName = `${app.companyName}_${app.jobTitle}_Resume`.replace(/[^a-zA-Z0-9_-]/g, "_");
    const blob = new Blob([app.tailoredLatex], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.matchedKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner & Filters */}
      <div className="apple-card p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-500" />
              Company Applications Vault
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Access and manage all your tailored LaTeX resumes and application statuses across companies.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search company or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-black/[0.08] dark:border-white/[0.1] text-xs text-neutral-900 dark:text-white apple-focus w-48 sm:w-60"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-black/[0.08] dark:border-white/[0.1] text-xs text-neutral-900 dark:text-white apple-focus"
            >
              <option value="all">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Draft">Draft</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredApps.length === 0 ? (
        <div className="apple-card p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            No Tailored Resumes Found
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Generate your first company-specific resume in the Tailor Studio to track it here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              onClick={() => onLoadIntoStudio(app)}
              className="apple-card p-5 hover:scale-[1.01] hover:shadow-apple-card-dark cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Card Top: Company & ATS Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-apple-blue/10 to-purple-500/10 dark:from-apple-blue/20 dark:to-purple-500/20 flex items-center justify-center text-apple-blue dark:text-apple-blue-light font-bold text-sm border border-apple-blue/20">
                      {app.companyName ? app.companyName.charAt(0).toUpperCase() : "C"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-neutral-900 dark:text-white group-hover:text-apple-blue transition-colors">
                        {app.companyName || "Target Company"}
                      </h3>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                        {app.jobTitle || "Software Engineer"}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-apple-blue/10 text-apple-blue dark:bg-apple-blue/20 dark:text-apple-blue-light border border-apple-blue/20">
                    {app.atsScore}% ATS
                  </span>
                </div>

                {/* Keywords Chips */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {app.matchedKeywords.slice(0, 4).map((kw, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.2 rounded text-[9px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                    >
                      {kw}
                    </span>
                  ))}
                  {app.matchedKeywords.length > 4 && (
                    <span className="text-[9px] text-neutral-400 px-1 py-0.2">
                      +{app.matchedKeywords.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: Status Selector & Actions */}
              <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                <select
                  value={app.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleStatusChange(app, e.target.value as any, e)}
                  className="px-2 py-1 text-[11px] rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-black/[0.06] dark:border-white/[0.08] text-neutral-700 dark:text-neutral-300 font-medium"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer 🎉</option>
                  <option value="Draft">Draft</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleDownloadTex(app, e)}
                    title="Download LaTeX Source"
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(app.id, e)}
                    title="Delete resume"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
