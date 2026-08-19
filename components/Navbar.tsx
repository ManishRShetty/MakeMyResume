"use client";

import React from "react";
import { Sparkles, FileText, Briefcase, Settings, Moon, Sun, Download, ShieldCheck } from "lucide-react";

interface NavbarProps {
  activeTab: "studio" | "master" | "vault";
  setActiveTab: (tab: "studio" | "master" | "vault") => void;
  vaultCount: number;
  onOpenSettings: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  vaultCount,
  onOpenSettings,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full apple-glass border-b border-black/[0.06] dark:border-white/[0.08] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-apple-blue to-apple-blue-light flex items-center justify-center shadow-md shadow-apple-blue/20 text-white font-semibold">
            <Sparkles className="w-5 h-5 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base tracking-tight text-neutral-900 dark:text-white">
                MakeMyResume
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-apple-blue/10 text-apple-blue dark:bg-apple-blue/20 dark:text-apple-blue-light border border-apple-blue/20">
                AI Pro
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 -mt-0.5">
              Placement LaTeX Tailor
            </p>
          </div>
        </div>

        {/* Apple-style Sliding Navigation */}
        <nav className="hidden md:flex items-center p-1 rounded-xl bg-neutral-200/60 dark:bg-neutral-800/60 backdrop-blur-md border border-black/[0.04] dark:border-white/[0.06]">
          <button
            onClick={() => setActiveTab("studio")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
              activeTab === "studio"
                ? "bg-white dark:bg-neutral-700/90 text-neutral-900 dark:text-white shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
            Tailor Studio
          </button>

          <button
            onClick={() => setActiveTab("master")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
              activeTab === "master"
                ? "bg-white dark:bg-neutral-700/90 text-neutral-900 dark:text-white shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            Master LaTeX
          </button>

          <button
            onClick={() => setActiveTab("vault")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
              activeTab === "vault"
                ? "bg-white dark:bg-neutral-700/90 text-neutral-900 dark:text-white shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-500" />
            Applications Vault
            {vaultCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-semibold rounded-full bg-apple-blue text-white">
                {vaultCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Actions: Theme Toggle & Settings */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/70 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-200/60 dark:bg-neutral-800/80 hover:bg-neutral-300/60 dark:hover:bg-neutral-700/80 text-xs font-medium text-neutral-700 dark:text-neutral-200 transition-all border border-black/[0.04] dark:border-white/[0.08]"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings & API</span>
          </button>
        </div>

      </div>

      {/* Mobile Navigation Row */}
      <div className="flex md:hidden px-4 py-2 border-t border-black/[0.04] dark:border-white/[0.06] bg-neutral-100/50 dark:bg-neutral-900/50 justify-around">
        <button
          onClick={() => setActiveTab("studio")}
          className={`flex items-center gap-1.5 py-1 text-xs font-medium ${
            activeTab === "studio" ? "text-apple-blue font-semibold" : "text-neutral-500"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Studio
        </button>
        <button
          onClick={() => setActiveTab("master")}
          className={`flex items-center gap-1.5 py-1 text-xs font-medium ${
            activeTab === "master" ? "text-emerald-500 font-semibold" : "text-neutral-500"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Master
        </button>
        <button
          onClick={() => setActiveTab("vault")}
          className={`flex items-center gap-1.5 py-1 text-xs font-medium ${
            activeTab === "vault" ? "text-amber-500 font-semibold" : "text-neutral-500"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Vault ({vaultCount})
        </button>
      </div>
    </header>
  );
};
