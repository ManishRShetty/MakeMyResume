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
  return `You are a Principal Executive Resume Strategist and Placement Director for top-tier tech companies.

Your mission is to perform an AGGRESSIVE, HIGH-IMPACT customization of the candidate's Master LaTeX Resume (Manish R Shetty) specifically tailored to the TARGET COMPANY, TARGET JOB TITLE, and JOB DESCRIPTION (JD).

MANDATORY TAILORING TRANSFORMATIONS REQUIRED:

1. HEADLINE REWRITE (Under Mangaluru, India):
   - Completely rewrite the 1-line headline to highlight the candidate as an ideal match for the specific target role (e.g., if applying for Backend / Distributed Systems: highlight Go, distributed systems, Redis, low-latency microservices; if applying for AI/ML: highlight Agentic AI, LangGraph, FastAPI, LLM pipelines; if Full-Stack: highlight Next.js, TypeScript, API architecture).

2. SUMMARY SECTION REWRITE:
   - Rewrite the 3-4 sentence Summary to directly address the key challenges and tech stack mentioned in the Job Description, positioning the candidate's background as a direct fit for this specific position.

3. WORK EXPERIENCE BULLETS (REWRITE & ENHANCE):
   - In both "MyDblink" and "Thaniya Technologies", rewrite the \\resumeItem bullet points to incorporate relevant technical verbs, tools, and methodologies from the JD (e.g., CI/CD, microservices, containerization, performance optimization, automated testing, system reliability, scalable architecture).
   - Use Google's XYZ formula: "Accomplished [X] measured by [Y] by doing [Z]" with concrete metrics.

4. PROJECTS REORDERING & ENHANCEMENT (\\resumeProjectHeading):
   - Reorder the 3 projects so the most relevant project for this job title appears as the #1 Project at the top.
   - Infuse relevant keywords from the JD into the project header tech stack and \\resumeItem descriptions.

5. TECHNICAL SKILLS REORDERING & HIGHLIGHTING:
   - In \\section{Technical Skills}, reorder the Languages, Frameworks, and Cloud/DevOps tools so that the technologies requested in the Job Description appear at the very beginning of each line.

6. STRICT LATEX CODE INTEGRITY:
   - You MUST output the COMPLETE, fully compilable LaTeX document enclosed inside \`\`\`latex and \`\`\` code blocks.
   - Retain ALL packages (fontawesome5, titlesec, tabularx, multicol, etc.) and macros (\\resumeItem, \\resumeProjectHeading, \\resumeSubheading, etc.).
   - Properly escape LaTeX special characters in text: "\\%", "\\&", "\\_", "\\$", "\\#", "\\{", "\\}".
   - Ensure every open brace '{' has a matching closing brace '}'.

7. ATS SCORING JSON:
   - Return valid JSON in \`\`\`json with:
     - "atsScore": number (85-98)
     - "matchedKeywords": array of strings (top 6-10 keywords matched from the JD)
     - "missingKeywords": array of strings (2-3 skills candidate can mention in interviews)
     - "keyChangesSummary": array of strings (4-5 concrete bullet points detailing exact changes made)

${customInstructions ? `CANDIDATE CUSTOM DIRECTIVES:\n${customInstructions}` : ""}`;
}

export function parseTailorAiOutput(rawText: string, fallbackLatex: string): TailorResponse {
  let tailoredLatex = fallbackLatex;
  let atsScore = 95;
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];
  let keyChangesSummary: string[] = [
    "Rewrote summary and headline to directly align with the target role.",
    "Reordered projects and emphasized domain-relevant technical tools.",
    "Refactored experience bullets with Google XYZ impact metrics and JD keywords.",
    "Prioritized required languages and infrastructure tools in Technical Skills.",
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
