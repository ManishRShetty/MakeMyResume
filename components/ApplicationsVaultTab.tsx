"use client";

import React, { useState, useEffect } from "react";
import { Search, Trash2, Download, Briefcase, FileCode, CheckCircle } from "lucide-react";
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
      <div className="apple-bento-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff]">
              Placement Archives
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight mt-1">
              Company Applications Vault
            </h2>
            <p className="text-xs text-[#86868b] mt-1">
              Manage your company-specific tailored LaTeX resumes and interview stages in one place.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
              <input
                type="text"
                placeholder="Search company or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-full bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] apple-focus w-48 sm:w-60"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-full bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] apple-focus"
            >
              <option value="all">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer 🎉</option>
              <option value="Draft">Draft</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredApps.length === 0 ? (
        <div className="apple-bento-card p-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e] flex items-center justify-center mx-auto text-[#86868b]">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
            No Resumes in Vault Yet
          </h3>
          <p className="text-xs text-[#86868b] max-w-sm mx-auto">
            Generate your first company-specific resume in the Tailor Studio and it will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              onClick={() => onLoadIntoStudio(app)}
              className="apple-bento-card p-6 cursor-pointer flex flex-col justify-between space-y-5 group"
            >
              <div>
                {/* Company Name & ATS Score */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-base text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:text-[#0071e3] transition-colors">
                      {app.companyName || "Target Company"}
                    </h3>
                    <p className="text-xs text-[#86868b] mt-0.5 line-clamp-1">
                      {app.jobTitle || "Software Engineer"}
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#0071e3]/10 text-[#0071e3] dark:bg-[#2997ff]/20 dark:text-[#2997ff]">
                    {app.atsScore}% ATS
                  </span>
                </div>

                {/* Keywords Chips */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {app.matchedKeywords.slice(0, 4).map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full text-[10px] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[#86868b] font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                  {app.matchedKeywords.length > 4 && (
                    <span className="text-[10px] text-[#86868b] px-1 py-0.5">
                      +{app.matchedKeywords.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: Status Selector & Actions */}
              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                <select
                  value={app.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleStatusChange(app, e.target.value as any, e)}
                  className="px-3 py-1 text-xs rounded-full bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] font-medium"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer 🎉</option>
                  <option value="Draft">Draft</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDownloadTex(app, e)}
                    title="Download LaTeX"
                    className="p-2 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(app.id, e)}
                    title="Delete"
                    className="p-2 rounded-full text-[#86868b] hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
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
