import * as Diff from "diff";

export interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

/**
 * Safely escape LaTeX special characters in user-provided or AI-generated text.
 */
export function escapeLatex(text: string): string {
  if (!text) return "";
  
  // Characters that need escaping in standard LaTeX text
  return text
    // Replace unescaped & with \&
    .replace(/(?<!\\)&/g, "\\&")
    // Replace unescaped % with \%
    .replace(/(?<!\\)%/g, "\\%")
    // Replace unescaped $ with \$
    .replace(/(?<!\\)\$/g, "\\$")
    // Replace unescaped # with \#
    .replace(/(?<!\\)#/g, "\\#")
    // Replace unescaped _ with \_
    .replace(/(?<!\\)_/g, "\\_")
    // Replace unescaped { with \{
    .replace(/(?<!\\)\{/g, "\\{")
    // Replace unescaped } with \}
    .replace(/(?<!\\)\}/g, "\\}");
}

/**
 * Calculates line-by-line diff between original LaTeX and tailored LaTeX
 */
export function calculateDiff(originalLatex: string, tailoredLatex: string): DiffPart[] {
  return Diff.diffLines(originalLatex || "", tailoredLatex || "");
}

/**
 * Basic syntax validation for LaTeX
 */
export function validateLatexSyntax(latex: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!latex.includes("\\begin{document}")) {
    errors.push("Missing \\begin{document}");
  }
  if (!latex.includes("\\end{document}")) {
    errors.push("Missing \\end{document}");
  }

  // Check balanced braces count (simple heuristic)
  let braceCount = 0;
  for (let i = 0; i < latex.length; i++) {
    if (latex[i] === "{" && (i === 0 || latex[i - 1] !== "\\")) {
      braceCount++;
    } else if (latex[i] === "}" && (i === 0 || latex[i - 1] !== "\\")) {
      braceCount--;
    }
  }

  if (braceCount !== 0) {
    errors.push(`Unbalanced curly braces detected (diff: ${braceCount > 0 ? "+" + braceCount : braceCount})`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Extract plain text summary from LaTeX code for ATS score comparisons and quick previews
 */
export function extractPlainTextFromLatex(latex: string): string {
  if (!latex) return "";

  let text = latex;

  // Remove preamble
  const docStart = text.indexOf("\\begin{document}");
  if (docStart !== -1) {
    text = text.substring(docStart + 16);
  }
  const docEnd = text.indexOf("\\end{document}");
  if (docEnd !== -1) {
    text = text.substring(0, docEnd);
  }

  // Strip LaTeX comments
  text = text.replace(/%.*$/gm, "");

  // Strip common commands while retaining their content
  text = text
    .replace(/\\textbf\{([^}]+)\}/g, "$1")
    .replace(/\\textit\{([^}]+)\}/g, "$1")
    .replace(/\\emph\{([^}]+)\}/g, "$1")
    .replace(/\\underline\{([^}]+)\}/g, "$1")
    .replace(/\\href\{[^}]+\}\{([^}]+)\}/g, "$1")
    .replace(/\\resumeItem\{([^}]+)\}/g, "• $1\n")
    .replace(/\\item\s*/g, "• ")
    .replace(/\\section\*?\{([^}]+)\}/g, "\n\n=== $1 ===\n")
    .replace(/\\resumeSubheading\{([^}]+)\}\{([^}]+)\}\{([^}]+)\}\{([^}]+)\}/g, "\n$1 ($2)\n$3 - $4\n")
    .replace(/\\\w+(\[[^\]]*\])?(\{([^}]*)\})?/g, " ")
    .replace(/[{}]/g, "")
    .replace(/\\\\/g, "\n")
    .replace(/\\&/g, "&")
    .replace(/\\%/g, "%")
    .replace(/\\_/g, "_")
    .replace(/\\\$/g, "$")
    .replace(/\\#/g, "#");

  // Normalize spacing
  return text.replace(/\n\s*\n\s*\n/g, "\n\n").trim();
}

/**
 * Parse sections from LaTeX to allow targeted replacement
 */
export interface ResumeSections {
  heading?: string;
  education?: string;
  skills?: string;
  experience?: string;
  projects?: string;
  achievements?: string;
  rawPreamble: string;
  rawClosing: string;
}

export function parseLatexSections(latex: string): ResumeSections {
  const docStart = latex.indexOf("\\begin{document}");
  const docEnd = latex.indexOf("\\end{document}");

  const rawPreamble = docStart !== -1 ? latex.substring(0, docStart + 16) : "";
  const rawClosing = docEnd !== -1 ? latex.substring(docEnd) : "\\end{document}";
  
  return {
    rawPreamble,
    rawClosing,
  };
}
