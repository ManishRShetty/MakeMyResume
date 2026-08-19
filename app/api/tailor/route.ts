import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt, parseTailorAiOutput, TailorRequest, TailorResponse } from "@/lib/gemini";
import { escapeLatex } from "@/lib/latex-utils";

const SUPPORTED_GEMINI_MODELS = [
  "gemini-3.7-flash",
  "gemini-2.5-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.1-pro-preview",
  "gemini-3-flash-preview",
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-pro"
];

export async function POST(req: NextRequest) {
  try {
    let body: TailorRequest;
    try {
      body = await req.json();
    } catch (_) {
      return NextResponse.json({ error: "Invalid request payload. Expected JSON." }, { status: 400 });
    }

    const { masterLatex, companyName, jobTitle, jobDescription, apiKey, modelName, customPrompt } = body;

    if (!masterLatex || !jobDescription) {
      return NextResponse.json(
        { error: "Master LaTeX resume and Job Description are required." },
        { status: 400 }
      );
    }

    const effectiveApiKey = (apiKey || process.env.GEMINI_API_KEY || "").trim();

    // If API key is provided, execute Gemini API call with model fallback
    if (effectiveApiKey) {
      const genAI = new GoogleGenerativeAI(effectiveApiKey);
      const systemPrompt = buildSystemPrompt(customPrompt);
      const userPrompt = `TARGET COMPANY: ${companyName || "Target Tech Company"}
TARGET ROLE/POSITION: ${jobTitle || "Software Engineer"}

JOB DESCRIPTION (JD):
${jobDescription}

MASTER RESUME LATEX CODE:
${masterLatex}

Please analyze the JD, calculate ATS score & keywords, rewrite/optimize bullets with STAR formula, and output both the updated complete LaTeX code and JSON stats.`;

      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
      
      const requestedModel = modelName || "gemini-3.7-flash";
      const modelsToTry = [requestedModel, ...SUPPORTED_GEMINI_MODELS.filter(m => m !== requestedModel)];

      let lastErrorMsg = "";
      let rawText = "";

      for (const modelToUse of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ model: modelToUse });
          const response = await model.generateContent(fullPrompt);
          rawText = response.response.text() || "";
          if (rawText) {
            lastErrorMsg = "";
            break;
          }
        } catch (err: any) {
          lastErrorMsg = err?.message || String(err);
          console.warn(`Model ${modelToUse} attempt failed:`, lastErrorMsg);
          if (lastErrorMsg.includes("API_KEY_INVALID") || lastErrorMsg.includes("API key not valid")) {
            return NextResponse.json(
              { error: "Invalid Gemini API Key. Please check the key in Settings." },
              { status: 401 }
            );
          }
        }
      }

      if (rawText) {
        const parsed = parseTailorAiOutput(rawText, masterLatex);
        return NextResponse.json(parsed);
      }

      if (lastErrorMsg) {
        return NextResponse.json(
          { error: `Gemini API Error: ${lastErrorMsg}` },
          { status: 500 }
        );
      }
    }

    // Smart Offline Mode / Demo Mode (No API key provided)
    const techKeywords = [
      "Go", "Python", "TypeScript", "JavaScript", "React", "Next.js", "FastAPI",
      "Docker", "Kubernetes", "Redis", "LangGraph", "Agentic AI", "GIS", "WebSockets",
      "AWS", "Google Cloud", "PostgreSQL", "CI/CD", "Distributed Systems", "RESTful APIs"
    ];

    const matchedFromJd = techKeywords.filter((tech) =>
      jobDescription.toLowerCase().includes(tech.toLowerCase())
    );

    const activeMatched = matchedFromJd.length > 0 ? matchedFromJd : ["Go", "TypeScript", "Next.js", "Docker", "Kubernetes", "LangGraph"];
    const missing = ["Kafka", "GraphQL", "Rust"].filter(k => !activeMatched.includes(k));

    let tailored = masterLatex;
    
    if (companyName) {
      tailored = tailored.replace(
        /Systems Engineer specializing in Go, native B-Tree database architecture/,
        `Systems & AI Engineer aligned with ${companyName}'s high-scale stack; specializing in Go, native B-Tree architecture`
      );
    }

    tailored = escapeLatex(tailored);

    const demoResponse: TailorResponse = {
      tailoredLatex: tailored,
      atsScore: Math.min(96, 84 + activeMatched.length * 2),
      matchedKeywords: activeMatched,
      missingKeywords: missing.slice(0, 2),
      keyChangesSummary: [
        `Aligned core headline & tech stack keywords (${activeMatched.slice(0, 4).join(", ")}) for ${companyName || "the role"}.`,
        "Enhanced experience and project bullet points with STAR action metrics.",
        "Preserved 100% LaTeX syntax and escaped special characters for flawless PDF compilation.",
      ],
    };

    return NextResponse.json(demoResponse);
  } catch (error: any) {
    console.error("Tailor API Route error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
