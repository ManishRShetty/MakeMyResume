"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, Check, User, Briefcase, FolderGit2, GraduationCap, Award, Cpu, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { MasterProfile, INITIAL_MANISH_PROFILE, generateLatexFromProfile, ProjectItem, ExperienceItem } from "@/lib/profile-schema";
import { saveMasterLatex } from "@/lib/storage";

interface VisualProfileEditorProps {
  onSaveLatex: (latex: string) => void;
}

const PROFILE_STORAGE_KEY = "makemyresume_visual_profile_v1";

export const VisualProfileEditor: React.FC<VisualProfileEditorProps> = ({ onSaveLatex }) => {
  const [profile, setProfile] = useState<MasterProfile>(INITIAL_MANISH_PROFILE);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("projects");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch (_) {}
  }, []);

  const handleSaveAll = () => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      const generated = generateLatexFromProfile(profile);
      saveMasterLatex(generated);
      onSaveLatex(generated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error("Save error:", e);
    }
  };

  // Projects handlers
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: "proj_" + Date.now(),
      title: "New Scalable Project",
      techStack: "Go, TypeScript, Docker, Redis",
      dates: "2026",
      bullets: [
        "Architected and deployed high-performance distributed service with sub-10ms response latency.",
      ],
    };
    setProfile({ ...profile, projects: [newProj, ...profile.projects] });
  };

  const handleUpdateProject = (index: number, updated: Partial<ProjectItem>) => {
    const updatedProjects = [...profile.projects];
    updatedProjects[index] = { ...updatedProjects[index], ...updated };
    setProfile({ ...profile, projects: updatedProjects });
  };

  const handleDeleteProject = (index: number) => {
    if (confirm("Delete this project from your master resume?")) {
      const updatedProjects = profile.projects.filter((_, i) => i !== index);
      setProfile({ ...profile, projects: updatedProjects });
    }
  };

  const handleAddProjectBullet = (projIndex: number) => {
    const updatedProjects = [...profile.projects];
    updatedProjects[projIndex].bullets.push("Implemented new feature with quantified metric improvement.");
    setProfile({ ...profile, projects: updatedProjects });
  };

  const handleUpdateProjectBullet = (projIndex: number, bulletIndex: number, text: string) => {
    const updatedProjects = [...profile.projects];
    updatedProjects[projIndex].bullets[bulletIndex] = text;
    setProfile({ ...profile, projects: updatedProjects });
  };

  const handleDeleteProjectBullet = (projIndex: number, bulletIndex: number) => {
    const updatedProjects = [...profile.projects];
    updatedProjects[projIndex].bullets = updatedProjects[projIndex].bullets.filter((_, i) => i !== bulletIndex);
    setProfile({ ...profile, projects: updatedProjects });
  };

  // Experience handlers
  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: "exp_" + Date.now(),
      company: "New Company",
      location: "Remote",
      role: "Software Engineering Intern",
      dates: "2026",
      bullets: ["Developed backend APIs and automated tests."],
    };
    setProfile({ ...profile, experiences: [newExp, ...profile.experiences] });
  };

  const handleUpdateExperience = (index: number, updated: Partial<ExperienceItem>) => {
    const updatedExp = [...profile.experiences];
    updatedExp[index] = { ...updatedExp[index], ...updated };
    setProfile({ ...profile, experiences: updatedExp });
  };

  const handleDeleteExperience = (index: number) => {
    if (confirm("Delete this work experience?")) {
      const updatedExp = profile.experiences.filter((_, i) => i !== index);
      setProfile({ ...profile, experiences: updatedExp });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Controls Banner */}
      <div className="apple-bento-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff]">
            Visual Resume Manager
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight mt-1">
            Direct Profile & Project Editor
          </h2>
          <p className="text-xs text-[#86868b] mt-1">
            Add or edit your personal details, internships, and projects directly without writing LaTeX code.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-6 py-3 rounded-full apple-button-primary text-xs font-medium flex items-center justify-center gap-2 shadow-lg shadow-[#0071e3]/20 shrink-0"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              Synced & Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save & Sync to LaTeX
            </>
          )}
        </button>
      </div>

      {/* Sections Accordion Grid */}
      <div className="space-y-4">
        
        {/* 1. Personal Info Section */}
        <div className="apple-bento-card overflow-hidden">
          <button
            onClick={() => setActiveSection(activeSection === "personal" ? "" : "personal")}
            className="w-full px-6 py-4 flex items-center justify-between bg-[#f5f5f7] dark:bg-[#1c1c1e] text-left"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-[#0071e3]" />
              <span className="font-semibold text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                Personal & Contact Details
              </span>
            </div>
            {activeSection === "personal" ? <ChevronUp className="w-4 h-4 text-[#86868b]" /> : <ChevronDown className="w-4 h-4 text-[#86868b]" />}
          </button>

          {activeSection === "personal" && (
            <div className="p-6 space-y-4 bg-white dark:bg-[#161617] border-t border-black/[0.06] dark:border-white/[0.08]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#86868b]">Full Name</label>
                  <input
                    type="text"
                    value={profile.personalInfo.fullName}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, fullName: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#86868b]">Location</label>
                  <input
                    type="text"
                    value={profile.personalInfo.location}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, location: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#86868b]">Phone</label>
                  <input
                    type="text"
                    value={profile.personalInfo.phone}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, phone: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#86868b]">Email</label>
                  <input
                    type="email"
                    value={profile.personalInfo.email}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, email: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#86868b]">LinkedIn Username / URL</label>
                  <input
                    type="text"
                    value={profile.personalInfo.linkedin}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, linkedin: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#86868b]">GitHub Username / URL</label>
                  <input
                    type="text"
                    value={profile.personalInfo.github}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, github: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#86868b]">Portfolio Website</label>
                  <input
                    type="text"
                    value={profile.personalInfo.website}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, website: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-medium text-[#86868b]">Headline / Specialization Description</label>
                <textarea
                  rows={2}
                  value={profile.personalInfo.headline}
                  onChange={(e) => setProfile({
                    ...profile,
                    personalInfo: { ...profile.personalInfo, headline: e.target.value }
                  })}
                  className="w-full p-3 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. Projects Section (Interactive Manager) */}
        <div className="apple-bento-card overflow-hidden">
          <div className="w-full px-6 py-4 flex items-center justify-between bg-[#f5f5f7] dark:bg-[#1c1c1e]">
            <button
              onClick={() => setActiveSection(activeSection === "projects" ? "" : "projects")}
              className="flex items-center gap-2.5 text-left flex-1"
            >
              <FolderGit2 className="w-4 h-4 text-purple-500" />
              <span className="font-semibold text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                Projects ({profile.projects.length})
              </span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddProject}
                className="px-3 py-1 rounded-full text-xs font-medium bg-[#0071e3] text-white flex items-center gap-1 hover:opacity-90 transition-opacity shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Project
              </button>
              <button onClick={() => setActiveSection(activeSection === "projects" ? "" : "projects")}>
                {activeSection === "projects" ? <ChevronUp className="w-4 h-4 text-[#86868b]" /> : <ChevronDown className="w-4 h-4 text-[#86868b]" />}
              </button>
            </div>
          </div>

          {activeSection === "projects" && (
            <div className="p-6 space-y-6 bg-white dark:bg-[#161617] border-t border-black/[0.06] dark:border-white/[0.08]">
              {profile.projects.map((proj, pIdx) => (
                <div key={proj.id} className="p-5 rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e] space-y-4 border border-black/[0.04] dark:border-white/[0.06]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#86868b]">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => handleUpdateProject(pIdx, { title: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#2c2c2e] text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#86868b]">Tech Stack</label>
                        <input
                          type="text"
                          value={proj.techStack}
                          onChange={(e) => handleUpdateProject(pIdx, { techStack: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#2c2c2e] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#86868b]">Dates / Duration</label>
                        <input
                          type="text"
                          value={proj.dates}
                          onChange={(e) => handleUpdateProject(pIdx, { dates: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#2c2c2e] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteProject(pIdx)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-[#86868b]">Project Bullet Points</label>
                      <button
                        onClick={() => handleAddProjectBullet(pIdx)}
                        className="text-[11px] text-[#0071e3] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>

                    {proj.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => handleUpdateProjectBullet(pIdx, bIdx, e.target.value)}
                          className="flex-1 p-2.5 rounded-xl bg-white dark:bg-[#2c2c2e] text-xs leading-relaxed text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                        />
                        <button
                          onClick={() => handleDeleteProjectBullet(pIdx, bIdx)}
                          className="p-1 text-[#86868b] hover:text-rose-500 transition-colors mt-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Work Experience Section */}
        <div className="apple-bento-card overflow-hidden">
          <div className="w-full px-6 py-4 flex items-center justify-between bg-[#f5f5f7] dark:bg-[#1c1c1e]">
            <button
              onClick={() => setActiveSection(activeSection === "experience" ? "" : "experience")}
              className="flex items-center gap-2.5 text-left flex-1"
            >
              <Briefcase className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                Work Experience ({profile.experiences.length})
              </span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddExperience}
                className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-600 text-white flex items-center gap-1 hover:opacity-90 transition-opacity shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Experience
              </button>
              <button onClick={() => setActiveSection(activeSection === "experience" ? "" : "experience")}>
                {activeSection === "experience" ? <ChevronUp className="w-4 h-4 text-[#86868b]" /> : <ChevronDown className="w-4 h-4 text-[#86868b]" />}
              </button>
            </div>
          </div>

          {activeSection === "experience" && (
            <div className="p-6 space-y-6 bg-white dark:bg-[#161617] border-t border-black/[0.06] dark:border-white/[0.08]">
              {profile.experiences.map((exp, eIdx) => (
                <div key={exp.id} className="p-5 rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e] space-y-4 border border-black/[0.04] dark:border-white/[0.06]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 flex-1">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#86868b]">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleUpdateExperience(eIdx, { company: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#2c2c2e] text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#86868b]">Role / Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => handleUpdateExperience(eIdx, { role: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#2c2c2e] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#86868b]">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => handleUpdateExperience(eIdx, { location: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#2c2c2e] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#86868b]">Dates</label>
                        <input
                          type="text"
                          value={exp.dates}
                          onChange={(e) => handleUpdateExperience(eIdx, { dates: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#2c2c2e] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteExperience(eIdx)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete experience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-2 pt-1">
                    <label className="text-[11px] font-semibold text-[#86868b]">Experience Bullets</label>
                    {exp.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => {
                            const updatedExp = [...profile.experiences];
                            updatedExp[eIdx].bullets[bIdx] = e.target.value;
                            setProfile({ ...profile, experiences: updatedExp });
                          }}
                          className="flex-1 p-2.5 rounded-xl bg-white dark:bg-[#2c2c2e] text-xs leading-relaxed text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Technical Skills Section */}
        <div className="apple-bento-card overflow-hidden">
          <button
            onClick={() => setActiveSection(activeSection === "skills" ? "" : "skills")}
            className="w-full px-6 py-4 flex items-center justify-between bg-[#f5f5f7] dark:bg-[#1c1c1e] text-left"
          >
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                Technical Skills
              </span>
            </div>
            {activeSection === "skills" ? <ChevronUp className="w-4 h-4 text-[#86868b]" /> : <ChevronDown className="w-4 h-4 text-[#86868b]" />}
          </button>

          {activeSection === "skills" && (
            <div className="p-6 space-y-4 bg-white dark:bg-[#161617] border-t border-black/[0.06] dark:border-white/[0.08]">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#86868b]">Programming Languages</label>
                <input
                  type="text"
                  value={profile.skills.languages}
                  onChange={(e) => setProfile({
                    ...profile,
                    skills: { ...profile.skills, languages: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#86868b]">Frameworks & Libraries</label>
                <input
                  type="text"
                  value={profile.skills.frameworks}
                  onChange={(e) => setProfile({
                    ...profile,
                    skills: { ...profile.skills, frameworks: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#86868b]">Cloud & DevOps Tools</label>
                <input
                  type="text"
                  value={profile.skills.cloudDevops}
                  onChange={(e) => setProfile({
                    ...profile,
                    skills: { ...profile.skills, cloudDevops: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#86868b]">Other Concepts & Spoken Languages</label>
                <input
                  type="text"
                  value={profile.skills.other}
                  onChange={(e) => setProfile({
                    ...profile,
                    skills: { ...profile.skills, other: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] apple-focus"
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
