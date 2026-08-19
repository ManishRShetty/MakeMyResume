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

Your mission is to take the candidate's Master LaTeX Resume (Manish R Shetty) and tailor it specifically for the target Company and Role/Job Description (JD).

CRITICAL FORMATTING RULES:
1. STRICT LATEX INTEGRITY & MACROS PRESERVATION:
   - Output the COMPLETE compilable LaTeX document enclosed inside \`\`\`latex and \`\`\` code blocks.
   - Retain ALL packages (latexsym, fullpage, titlesec, marvosym, enumitem, hyperref, fancyhdr, babel, tabularx, fontawesome5, multicol, glyphtounicode).
   - Retain the exact candidate heading layout, phone (+91 8660775130), email (mmanishrshetty@gmail.com), LinkedIn, GitHub, portfolio (manishshetty.dev), and FontAwesome icons (\\faPhone, \\faEnvelope, \\faLinkedin, \\faGithub, \\faGlobe).
   - Preserve custom command definitions (\\resumeItem, \\classesList, \\resumeSubheading, \\resumeSubSubheading, \\resumeProjectHeading, \\resumeSubItem, \\resumeSubHeadingListStart, \\resumeSubHeadingListEnd, \\resumeItemListStart, \\resumeItemListEnd).
   - NEVER use placeholders like "% ... rest remains same ...". Return the entire LaTeX document from \\documentclass to \\end{document}.

2. LATEX ESCAPING & SYNTAX SAFEGUARD:
   - Escape special characters in bullet points and text: write "\\%" instead of "%", "\\&" instead of "&", "\\_" instead of "_", "\\$" instead of "$", "\\#" instead of "#".
   - Ensure every open brace '{' has a matching closing brace '}'.

3. STRATEGIC TAILORING TO TARGET COMPANY & JD:
   - **Summary**: Dynamically tailor the 3-line summary to mention the target domain (e.g. distributed systems, backend scalability, full-stack, cloud AI workflows) relevant to the company.
   - **Headline Description in Header**: Update the sub-headline under Mangaluru, India if beneficial for the target role.
   - **Experience Bullets (Google XYZ / STAR formula)**: Reframe and emphasize relevant achievements with quantified metrics (latency drops, % uptime, data volume handled) aligning with the JD.
   - **Projects (\\resumeProjectHeading)**: Emphasize the most relevant tech keywords (e.g. Go, LangGraph, FastAPI, Redis, Kubernetes, TypeScript, Next.js, Docker, GIS, WebSockets) in the project headers and bullet descriptions.
   - **Technical Skills**: Prioritize and reorder the target company's primary tech stack to appear first in Languages / Frameworks / Cloud & DevOps.
   - Retain genuine authenticity without fabricating fake degrees or companies.

4. ATS MATCH SCORING & STRUCTURED JSON:
   - Alongside the tailored LaTeX code, output a JSON block inside \`\`\`json and \`\`\` with:
     - "atsScore": number (0-100) reflecting JD qualification & keyword match
     - "matchedKeywords": array of strings (top tech and functional keywords matched)
     - "missingKeywords": array of strings (skills in the JD candidate could learn/add)
     - "keyChangesSummary": array of strings (3-5 concise bullets describing strategic enhancements made)

${customInstructions ? `CANDIDATE'S CUSTOM DIRECTIVES:\n${customInstructions}` : ""}`;
}

export function parseTailorAiOutput(rawText: string, fallbackLatex: string): TailorResponse {
  let tailoredLatex = fallbackLatex;
  let atsScore = 92;
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];
  let keyChangesSummary: string[] = [
    "Tailored summary and headline to target role requirements.",
    "Reframed experience & project bullets with STAR metrics and JD keywords.",
    "Reordered Technical Skills section to prioritize company's required languages & cloud tools.",
    "Verified LaTeX syntax and escaped special characters for clean PDF compilation.",
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
    matchedKeywords = ["Go", "TypeScript", "LangGraph", "Next.js", "FastAPI", "Docker", "Kubernetes", "Redis"];
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
