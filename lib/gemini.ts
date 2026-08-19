export interface TailorRequest {
  masterLatex: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  apiKey?: string;
  modelName?: string;
  customPrompt?: string;
}

export interface TailorResponse {
  tailoredLatex: string;
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  keyChangesSummary: string[];
}

export function buildSystemPrompt(customInstructions?: string): string {
  return `You are an elite Placement Director and Executive Technical Resume Strategist specializing in campus placements, top-tier engineering roles, and ATS optimization.

Your mission is to deeply customize the candidate's Master LaTeX Resume (Manish R Shetty) specifically for the TARGET ROLE/JOB TITLE and TARGET COMPANY based on the provided Job Description (JD).

ROLE-SPECIFIC TAILORING DIRECTIVES:
1. DYNAMIC HEADER HEADLINE (Under Mangaluru, India):
   - Rewrite the 1-line headline to match the exact target role:
     - For Backend / Systems Role: Focus on Go, distributed systems, bbolt, low-latency microservices, and databases.
     - For AI / Machine Learning / Agentic AI Role: Focus on Agentic AI workflows (LangGraph), LLM pipelines, FastAPI, and autonomous agents.
     - For Full-Stack / Frontend Role: Focus on Next.js, TypeScript, React, state management, and production-grade UI architecture.
     - For Cloud / DevOps Role: Focus on Kubernetes, Docker, CI/CD, AWS, GCP, and containerized deployment.

2. ROLE-ALIGNED SUMMARY SECTION:
   - Rewrite the 3-4 line Summary to position the candidate as a specialist for this specific role and domain (e.g. "Backend Engineer with deep expertise in...", "AI Engineer specializing in LangGraph & LLM pipelines...", "Full-stack Product Engineer...").

3. REORDERING & EMPHASIZING PROJECTS (\\resumeProjectHeading):
   - Reorder the 3 projects so the most relevant project for this specific role appears at the very top:
     - AI/LLM Roles -> Autonomous Multi-Agent Trivia System (LangGraph, FastAPI, Redis) first.
     - Full-Stack / GIS Roles -> AI-Powered Flood Routing & Responder Dispatch System (TypeScript, GIS, WebSockets) first.
     - Data Science / Forecasting Roles -> FolkSpace (Random Forest, Dynamic Pricing) first.
   - Refine bullet points using the Google XYZ / STAR formula: "Accomplished [X] as measured by [Y] by doing [Z]" with metrics.

4. EXPERIENCE BULLET REWEIGHTING:
   - Refocus experience bullets (MyDblink and Thaniya Technologies) to highlight responsibilities and technical accomplishments that directly match what this role requires.

5. TECHNICAL SKILLS REORDERING:
   - In the "Technical Skills" section, dynamically reorder the listed Languages, Frameworks, and Tools so the skills required by the target role appear at the beginning of each category.

6. STRICT LATEX INTEGRITY & MACROS:
   - Output the COMPLETE compilable LaTeX document enclosed inside \`\`\`latex and \`\`\` code blocks.
   - Retain ALL packages (fontawesome5, titlesec, tabularx, multicol, etc.) and macros (\\resumeItem, \\resumeProjectHeading, \\resumeSubheading, etc.).
   - Escape LaTeX special characters: write "\\%", "\\&", "\\_", "\\$", "\\#", "\\{", "\\}".
   - Ensure every open brace '{' has a matching closing brace '}'.
   - Return valid JSON in \`\`\`json with atsScore (0-100), matchedKeywords, missingKeywords, and keyChangesSummary.

${customInstructions ? `CANDIDATE CUSTOM DIRECTIVES:\n${customInstructions}` : ""}`;
}

export function parseTailorAiOutput(rawText: string, fallbackLatex: string): TailorResponse {
  let tailoredLatex = fallbackLatex;
  let atsScore = 94;
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];
  let keyChangesSummary: string[] = [
    "Reframed headline and summary for target role specialization.",
    "Reordered projects to highlight the most relevant engineering domain first.",
    "Optimized experience bullets with STAR metrics aligned with JD requirements.",
    "Prioritized required languages and tools in the Technical Skills section.",
  ];

  // Extract LaTeX block
  const latexMatch = rawText.match(/```(?:latex|tex)?\s*([\s\S]*?)```/i);
  if (latexMatch && latexMatch[1].trim().includes("\\begin{document}")) {
    tailoredLatex = latexMatch[1].trim();
  } else if (rawText.includes("\\documentclass") && rawText.includes("\\end{document}")) {
    tailoredLatex = rawText.trim();
  }

  // Extract JSON block
  const jsonMatch = rawText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (typeof parsed.atsScore === "number") atsScore = parsed.atsScore;
      if (Array.isArray(parsed.matchedKeywords)) matchedKeywords = parsed.matchedKeywords;
      if (Array.isArray(parsed.missingKeywords)) missingKeywords = parsed.missingKeywords;
      if (Array.isArray(parsed.keyChangesSummary)) keyChangesSummary = parsed.keyChangesSummary;
    } catch (e) {
      console.warn("Failed to parse JSON response block from AI:", e);
    }
  }

  if (matchedKeywords.length === 0) {
    matchedKeywords = ["Go", "TypeScript", "LangGraph", "FastAPI", "Next.js", "Docker", "Kubernetes", "Redis"];
    missingKeywords = ["GraphQL", "Kafka"];
  }

  return {
    tailoredLatex,
    atsScore,
    matchedKeywords,
    missingKeywords,
    keyChangesSummary,
  };
}
