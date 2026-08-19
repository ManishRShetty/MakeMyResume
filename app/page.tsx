"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { TailorStudioTab } from "@/components/TailorStudioTab";
import { MasterResumeTab } from "@/components/MasterResumeTab";
import { ApplicationsVaultTab } from "@/components/ApplicationsVaultTab";
import { SettingsModal } from "@/components/SettingsModal";
import { getMasterLatex, getApplications, getSettings, saveSettings, TailoredApplication, UserSettings } from "@/lib/storage";
import { Sparkles, FileCode, CheckCircle, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"studio" | "master" | "vault">("studio");
  const [masterLatex, setMasterLatex] = useState<string>("");
  const [vaultCount, setVaultCount] = useState<number>(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const loadedMaster = getMasterLatex();
    setMasterLatex(loadedMaster);
    setVaultCount(getApplications().length);

    // Load theme preference
    const settings = getSettings();
    if (settings.theme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add("dark");
      saveSettings({ theme: "dark" });
    } else {
      document.documentElement.classList.remove("dark");
      saveSettings({ theme: "light" });
    }
  };

  const handleUpdateVaultCount = () => {
    setVaultCount(getApplications().length);
  };

  const handleLoadAppIntoStudio = (app: TailoredApplication) => {
    setActiveTab("studio");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Translucent Frosted Glass Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        vaultCount={vaultCount}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Subtle Minimalist Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-neutral-200/40 dark:bg-neutral-900/40 border border-black/[0.04] dark:border-white/[0.06] text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-neutral-800 dark:text-neutral-200">
              Placement Season Mode Active
            </span>
            <span className="hidden sm:inline text-neutral-400">|</span>
            <span className="hidden sm:inline">
              Instant LaTeX parsing & STAR formula optimization ready.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              Gemini AI Tailoring
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-apple-blue" />
              LaTeX Syntax Guard
            </span>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === "studio" && (
          <TailorStudioTab
            masterLatex={masterLatex}
            onNavigateToVault={() => setActiveTab("vault")}
            onUpdateVaultCount={handleUpdateVaultCount}
          />
        )}

        {activeTab === "master" && (
          <MasterResumeTab
            masterLatex={masterLatex}
            setMasterLatex={setMasterLatex}
          />
        )}

        {activeTab === "vault" && (
          <ApplicationsVaultTab
            onLoadIntoStudio={handleLoadAppIntoStudio}
            onUpdateVaultCount={handleUpdateVaultCount}
          />
        )}

      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsUpdated={(updatedSettings) => {
          if (updatedSettings.theme === "light") {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
          } else {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
          }
        }}
      />

      {/* Apple-style Minimalist Footer */}
      <footer className="w-full border-t border-black/[0.04] dark:border-white/[0.06] py-6 text-center text-xs text-neutral-500 dark:text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            MakeMyResume · Designed for High-Impact Campus & Off-Campus Placements.
          </p>
          <p className="text-[11px]">
            LaTeX + TypeScript + Apple Minimalist Aesthetic
          </p>
        </div>
      </footer>
    </div>
  );
}
