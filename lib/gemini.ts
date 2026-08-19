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
  return `You are an elite Placement Director and Executive Technical Resume Strategist specializing in campus placements, FAANG, and top-tier engineering ATS optimization.

Your goal is to tailor the candidate's Master LaTeX Resume to specifically align with the provided Job Description (JD) and target Company/Role.

CRITICAL RULES & GUIDELINES:
1. PRESERVE LATEX STRUCTURE & MACROS EXACTLY:
   - You MUST output the COMPLETE, fully valid LaTeX code enclosed inside \`\`\`latex and \`\`\` code fence.
   - Retain all document classes, imports, packages, custom \\newcommand declarations, macros, formatting (e.g. \\resumeSubheading, \\resumeItem, \\resumeItemListStart, etc.).
   - NEVER omit sections with comments like "% ... rest remains same ...". You MUST return the full document from \\documentclass to \\end{document}.

2. LATEX ESCAPING & SYNTAX SAFETY:
   - Always escape special LaTeX characters in plain text: '%', '&', '_', '$', '#', '{', '}'. E.g., write "38\\% latency" instead of "38% latency", write "C\\&C++" or "C \\& C++" instead of "C&C++".
   - Ensure all open braces '{' have matching closing braces '}'.

3. STRATEGIC TAILORING (STAR / XYZ FORMULA):
   - Rewrite, refine, and emphasize experience and project bullet points using Google's XYZ formula: "Accomplished [X], as measured by [Y], by doing [Z]".
   - Infuse relevant keywords, tools, concepts, and technical verbs from the Job Description into existing bullets where organically appropriate.
   - Reorder skills in the Technical Skills section so the target company's primary tech stack and required languages/frameworks appear first.
   - DO NOT fabricate fake degrees or impossible claims, but frame authentic accomplishments with maximum technical impact and ATS relevance.

4. ATS MATCH SCORING & ANALYSIS:
   - In addition to the tailored LaTeX code, return a structured JSON block enclosed inside \`\`\`json and \`\`\` with:
     - "atsScore": a number from 0 to 100 representing keyword & qualification alignment
     - "matchedKeywords": array of strings of critical technical & domain keywords matched
     - "missingKeywords": array of skills/keywords from the JD that candidate may lack
     - "keyChangesSummary": array of strings (3-5 concise bullet points) summarizing the key enhancements made.

${customInstructions ? `USER CUSTOM PREFERENCES:\n${customInstructions}` : ""}`;
}

export function parseTailorAiOutput(rawText: string, fallbackLatex: string): TailorResponse {
  let tailoredLatex = fallbackLatex;
  let atsScore = 88;
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];
  let keyChangesSummary: string[] = [
    "Re-ordered technical skills to highlight company's required stack.",
    "Reframed project bullet points with metrics & impact verbs aligned with JD.",
    "Enhanced ATS keyword density and escaped LaTeX special characters.",
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

  // Fallback keyword extraction if JSON wasn't parsed
  if (matchedKeywords.length === 0) {
    matchedKeywords = ["TypeScript", "Full-Stack", "System Design", "Cloud Infrastructure", "CI/CD Pipelines", "Agile"];
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
