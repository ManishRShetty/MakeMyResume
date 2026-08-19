"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { TailorStudioTab } from "@/components/TailorStudioTab";
import { MasterResumeTab } from "@/components/MasterResumeTab";
import { ApplicationsVaultTab } from "@/components/ApplicationsVaultTab";
import { SettingsModal } from "@/components/SettingsModal";
import { getMasterLatex, getApplications, getSettings, saveSettings, TailoredApplication } from "@/lib/storage";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"studio" | "master" | "vault">("studio");
  const [masterLatex, setMasterLatex] = useState<string>("");
  const [vaultCount, setVaultCount] = useState<number>(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  // Default to light mode for that crisp Apple white aesthetic, or dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const loadedMaster = getMasterLatex();
    setMasterLatex(loadedMaster);
    setVaultCount(getApplications().length);

    // Check saved settings
    const settings = getSettings();
    if (settings.theme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
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

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-300 selection:bg-[#0071e3] selection:text-white">
      {/* Apple Floating Island Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        vaultCount={vaultCount}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        
        {/* Apple Iconic Hero Header */}
        <div className="text-center space-y-3 pt-2 pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0071e3] dark:text-[#2997ff]">
            Placement Resume Engine
          </p>
          <h1 className="apple-headline text-4xl sm:text-6xl md:text-7xl text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight leading-[1.08]">
            One resume. <br className="hidden sm:inline" />
            <span className="text-[#86868b]">Tailored for every company.</span>
          </h1>
          <p className="apple-subheadline text-base sm:text-lg text-[#86868b] max-w-2xl mx-auto font-normal leading-relaxed pt-1">
            Feed any job description. AI refines your master LaTeX code with STAR metrics, analyzes ATS keyword density, and compiles your company PDF instantly.
          </p>
        </div>

        {/* View Content */}
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
          if (updatedSettings.theme === "dark") {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
          } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
          }
        }}
      />

      {/* Apple Minimalist Footer */}
      <footer className="w-full border-t border-black/[0.06] dark:border-white/[0.08] mt-20 py-8 text-xs text-[#86868b]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-normal">
            MakeMyResume. Designed for Campus & Off-Campus Technical Placements.
          </p>
          <div className="flex items-center gap-4 text-[#86868b]">
            <span>LaTeX Safe</span>
            <span>·</span>
            <span>STAR Formula</span>
            <span>·</span>
            <span>ATS Optimized</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
