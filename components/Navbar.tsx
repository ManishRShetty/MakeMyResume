"use client";

import React from "react";
import Image from "next/image";
import { Settings, Sun, Moon } from "lucide-react";

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
    <header className="sticky top-0 z-50 w-full apple-nav-blur border-b border-black/[0.06] dark:border-white/[0.08] transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        
        {/* Brand / Logo (Large prominent size) */}
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => setActiveTab("studio")}
        >
          <div className="relative h-10 sm:h-12 w-44 sm:w-56 transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="MakeMyResume"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </div>

        {/* Center Pill Segmented Control */}
        <nav className="hidden md:flex items-center apple-segment-wrapper">
          <button
            onClick={() => setActiveTab("studio")}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
              activeTab === "studio"
                ? "apple-segment-active font-semibold"
                : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
            }`}
          >
            Tailor Studio
          </button>

          <button
            onClick={() => setActiveTab("master")}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
              activeTab === "master"
                ? "apple-segment-active font-semibold"
                : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
            }`}
          >
            Master Resume & Editor
          </button>

          <button
            onClick={() => setActiveTab("vault")}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
              activeTab === "vault"
                ? "apple-segment-active font-semibold"
                : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
            }`}
          >
            <span>Applications Vault</span>
            {vaultCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-black/10 dark:bg-white/20 text-[#1d1d1f] dark:text-white font-semibold">
                {vaultCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-[#86868b]" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>

      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden px-4 py-2 border-t border-black/[0.04] dark:border-white/[0.06] justify-center bg-white/40 dark:bg-black/40">
        <div className="apple-segment-wrapper flex w-full justify-around">
          <button
            onClick={() => setActiveTab("studio")}
            className={`flex-1 py-1 text-xs font-medium rounded-full text-center ${
              activeTab === "studio" ? "apple-segment-active font-semibold" : "text-[#86868b]"
            }`}
          >
            Studio
          </button>
          <button
            onClick={() => setActiveTab("master")}
            className={`flex-1 py-1 text-xs font-medium rounded-full text-center ${
              activeTab === "master" ? "apple-segment-active font-semibold" : "text-[#86868b]"
            }`}
          >
            Master
          </button>
          <button
            onClick={() => setActiveTab("vault")}
            className={`flex-1 py-1 text-xs font-medium rounded-full text-center ${
              activeTab === "vault" ? "apple-segment-active font-semibold" : "text-[#86868b]"
            }`}
          >
            Vault ({vaultCount})
          </button>
        </div>
      </div>
    </header>
  );
};
