import { DEFAULT_TEMPLATES, MANISH_MASTER_LATEX } from "./templates/default-templates";

export interface TailoredApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  tailoredLatex: string;
  originalLatex: string;
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  keyChangesSummary: string[];
  status: "Draft" | "Applied" | "Interview" | "Offer" | "Rejected";
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  geminiApiKey: string;
  modelName: string;
  temperature: number;
  customSystemPrompt?: string;
  theme: "dark" | "light" | "system";
}

const STORAGE_KEYS = {
  MASTER_LATEX: "makemyresume_master_latex_v2",
  APPLICATIONS: "makemyresume_applications_v2",
  SETTINGS: "makemyresume_settings_v2",
};

export const defaultSettings: UserSettings = {
  geminiApiKey: "",
  modelName: "gemini-1.5-flash",
  temperature: 0.2,
  theme: "light",
};

export function getMasterLatex(): string {
  if (typeof window === "undefined") return MANISH_MASTER_LATEX;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.MASTER_LATEX);
    if (!saved || saved.includes("Alex Morgan")) {
      localStorage.setItem(STORAGE_KEYS.MASTER_LATEX, MANISH_MASTER_LATEX);
      return MANISH_MASTER_LATEX;
    }
    return saved;
  } catch (e) {
    console.error("Failed to read master latex", e);
    return MANISH_MASTER_LATEX;
  }
}

export function saveMasterLatex(latex: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.MASTER_LATEX, latex);
  } catch (e) {
    console.error("Failed to save master latex", e);
  }
}

export function getApplications(): TailoredApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Failed to read applications", e);
    return [];
  }
}

export function saveApplications(apps: TailoredApplication[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
  } catch (e) {
    console.error("Failed to save applications", e);
  }
}

export function addOrUpdateApplication(app: TailoredApplication): void {
  const current = getApplications();
  const index = current.findIndex((a) => a.id === app.id);
  if (index >= 0) {
    current[index] = { ...app, updatedAt: new Date().toISOString() };
  } else {
    current.unshift(app);
  }
  saveApplications(current);
}

export function deleteApplication(id: string): void {
  const current = getApplications();
  saveApplications(current.filter((a) => a.id !== id));
}

export function getSettings(): UserSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  } catch (e) {
    return defaultSettings;
  }
}

export function saveSettings(settings: Partial<UserSettings>): UserSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return defaultSettings;
  }
}
