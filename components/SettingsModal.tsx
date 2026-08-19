"use client";

import React, { useState, useEffect } from "react";
import { X, Key, Cpu, Sparkles, Check, Download, Upload, Shield, Sliders } from "lucide-react";
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
    }, 800);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md transition-all duration-300">
      <div className="w-full max-w-xl bg-white/95 dark:bg-neutral-900/95 rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/[0.08] dark:border-white/[0.12] backdrop-blur-xl animate-fade-in relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-apple-blue/10 dark:bg-apple-blue/20 flex items-center justify-center text-apple-blue dark:text-apple-blue-light">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Preferences & AI Engine
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Configure your Gemini API key and AI tailoring parameters.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          
          {/* Gemini API Key */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-apple-blue" />
                Google Gemini API Key
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-apple-blue hover:underline"
              >
                Get Free API Key →
              </a>
            </label>
            <input
              type="password"
              value={settings.geminiApiKey}
              onChange={(e) => setLocalSettings({ ...settings, geminiApiKey: e.target.value })}
              placeholder="AIzaSy... (Leave blank for smart built-in demo mode)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-black/[0.08] dark:border-white/[0.1] text-xs font-mono text-neutral-900 dark:text-white apple-focus"
            />
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Your API key is stored securely in your browser&apos;s local storage and is never saved to any external database.
            </p>
          </div>

          {/* AI Model Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              <Cpu className="w-3.5 h-3.5 text-purple-500" />
              AI Model
            </label>
            <select
              value={settings.modelName}
              onChange={(e) => setLocalSettings({ ...settings, modelName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-black/[0.08] dark:border-white/[0.1] text-xs text-neutral-900 dark:text-white apple-focus"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fastest & Best for Instant Tailoring)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Technical Reasoning & Detailed Metrics)</option>
              <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Next-Gen Ultra Fast)</option>
            </select>
          </div>

          {/* Custom Tailoring Prompt Instruction */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Custom Placement Tailoring Instructions (Optional)
            </label>
            <textarea
              rows={3}
              value={settings.customSystemPrompt || ""}
              onChange={(e) => setLocalSettings({ ...settings, customSystemPrompt: e.target.value })}
              placeholder="E.g., Emphasize backend scalability, low-latency microservices, and leadership. Always prioritize Go and Kubernetes over Python."
              className="w-full p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-black/[0.08] dark:border-white/[0.1] text-xs text-neutral-900 dark:text-white apple-focus"
            />
          </div>

          {/* Backup & Data Controls */}
          <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
            <div className="text-xs text-neutral-500">
              Data Backup & Vault
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportData}
                className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
              <label className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
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
            className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-apple-blue hover:bg-apple-blue-hover text-white text-xs font-medium shadow-md shadow-apple-blue/20 transition-all duration-150"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : (
              "Save Preferences"
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
