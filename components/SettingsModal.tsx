"use client";

import React, { useState, useEffect } from "react";
import { X, Key, Cpu, Sparkles, Check, Download, Upload, Sliders } from "lucide-react";
import { getSettings, saveSettings, UserSettings, getApplications, saveApplications } from "@/lib/storage";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsUpdated: (settings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsUpdated,
}) => {
  const [settings, setLocalSettings] = useState<UserSettings>(getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(getSettings());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated = saveSettings(settings);
    onSettingsUpdated(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  const handleExportData = () => {
    const data = {
      settings: getSettings(),
      applications: getApplications(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MakeMyResume_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.settings) {
          saveSettings(parsed.settings);
          setLocalSettings(parsed.settings);
        }
        if (parsed.applications) {
          saveApplications(parsed.applications);
        }
        alert("Backup imported successfully!");
        onClose();
      } catch (err) {
        alert("Invalid backup JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-all duration-300">
      <div className="w-full max-w-lg bg-[#ffffff] dark:bg-[#1c1c1e] rounded-[32px] p-6 sm:p-8 shadow-2xl border border-black/[0.08] dark:border-white/[0.1] animate-fade-in relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              Settings & Preferences
            </h2>
            <p className="text-xs text-[#86868b] mt-0.5">
              Customize AI models and placement preferences.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          
          {/* Gemini API Key */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
              <span>Google Gemini API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#0071e3] dark:text-[#2997ff] hover:underline"
              >
                Get Free API Key →
              </a>
            </label>
            <input
              type="password"
              value={settings.geminiApiKey}
              onChange={(e) => setLocalSettings({ ...settings, geminiApiKey: e.target.value })}
              placeholder="AIzaSy... (Leave empty for smart offline demo mode)"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-black/[0.06] dark:border-white/[0.08] text-xs font-mono text-[#1d1d1f] dark:text-[#f5f5f7] apple-focus"
            />
            <p className="text-[11px] text-[#86868b]">
              Your key is saved locally in your browser.
            </p>
          </div>

          {/* AI Model Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
              AI Tailoring Model
            </label>
            <select
              value={settings.modelName}
              onChange={(e) => setLocalSettings({ ...settings, modelName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] apple-focus"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra Fast & Concise)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Technical STAR Optimization)</option>
              <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash</option>
            </select>
          </div>

          {/* Custom Tailoring Prompt Instruction */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
              Custom Tailoring Directives (Optional)
            </label>
            <textarea
              rows={3}
              value={settings.customSystemPrompt || ""}
              onChange={(e) => setLocalSettings({ ...settings, customSystemPrompt: e.target.value })}
              placeholder="E.g. Highlight backend scalability, Docker, and quantitative metrics over frontend."
              className="w-full p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] apple-focus"
            />
          </div>

          {/* Backup & Data Controls */}
          <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
            <span className="text-xs text-[#86868b]">Vault Backup</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportData}
                className="px-3.5 py-1.5 text-xs rounded-full apple-button-secondary flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#86868b]" />
                Export
              </button>
              <label className="px-3.5 py-1.5 text-xs rounded-full apple-button-secondary flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[#86868b]" />
                Import
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
              </label>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-full apple-button-primary text-xs font-medium flex items-center gap-2 shadow-md shadow-[#0071e3]/20"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Saved
              </>
            ) : (
              "Done"
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
