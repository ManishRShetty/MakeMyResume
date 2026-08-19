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
  
  return text
    .replace(/(?<!\\)&/g, "\\&")
    .replace(/(?<!\\)%/g, "\\%")
    .replace(/(?<!\\)\$/g, "\\$")
    .replace(/(?<!\\)#/g, "\\#")
    .replace(/(?<!\\)_/g, "\\_")
    .replace(/(?<!\\)\{/g, "\\{")
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
 * Extract clean, structured preview blocks from Manish's LaTeX format
 */
export function extractPlainTextFromLatex(latex: string): string {
  if (!latex) return "";

  let text = latex;

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

  // Transform project headings
  text = text.replace(/\\resumeProjectHeading\{([^}]+)\}\{([^}]+)\}/g, "\n[PROJ] $1 | $2\n");

  // Transform subheadings
  text = text.replace(/\\resumeSubheading\{([^}]+)\}\{([^}]+)\}\{([^}]+)\}\{([^}]+)\}/g, "\n[SUBHEAD] $1 ($2) --- $3 ($4)\n");

  // Clean fontawesome / raisebox
  text = text
    .replace(/\\raisebox\{[^}]+\}\{\\fa\w+\\?\s*/g, "")
    .replace(/\\fa\w+\\?\s*/g, "");

  // Clean markup
  text = text
    .replace(/\\textbf\{([^}]+)\}/g, "**$1**")
    .replace(/\\textit\{([^}]+)\}/g, "*$1*")
    .replace(/\\emph\{([^}]+)\}/g, "*$1*")
    .replace(/\\underline\{([^}]+)\}/g, "$1")
    .replace(/\\href\{[^}]+\}\{([^}]+)\}/g, "$1")
    .replace(/\\resumeItem\{([^}]+)\}/g, "• $1\n")
    .replace(/\\item\s*/g, "• ")
    .replace(/\\section\*?\{([^}]+)\}/g, "\n\n=== $1 ===\n")
    .replace(/\\small\{([^}]+)\}/g, "$1")
    .replace(/\\Huge\s*/g, "")
    .replace(/\\scshape\s*/g, "")
    .replace(/\\\w+(\[[^\]]*\])?(\{([^}]*)\})?/g, " ")
    .replace(/[{}]/g, "")
    .replace(/\\\\/g, "\n")
    .replace(/\\&/g, "&")
    .replace(/\\%/g, "%")
    .replace(/\\_/g, "_")
    .replace(/\\\$/g, "$")
    .replace(/\\#/g, "#")
    .replace(/~/g, " ");

  return text.replace(/\n\s*\n\s*\n/g, "\n\n").trim();
}
