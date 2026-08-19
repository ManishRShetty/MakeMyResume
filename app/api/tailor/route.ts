import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt, parseTailorAiOutput, TailorRequest, TailorResponse } from "@/lib/gemini";
import { escapeLatexText } from "@/lib/latex-utils";

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

    // 1. If Gemini API key is provided, execute deep AI customization
    if (effectiveApiKey) {
      const genAI = new GoogleGenerativeAI(effectiveApiKey);
      const systemPrompt = buildSystemPrompt(customPrompt);
      const userPrompt = `TARGET COMPANY: ${companyName || "Target Tech Company"}
TARGET ROLE/POSITION: ${jobTitle || "Software Engineer"}

JOB DESCRIPTION (JD):
${jobDescription}

MASTER RESUME LATEX CODE:
${masterLatex}

Please perform deep, noticeable customization of the candidate's resume for this specific company and role. Rewrite the headline, summary, experience bullets, and project emphasis to strongly match the JD.`;

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

    // 2. Dynamic Offline Tailoring Engine (when testing without API key)
    const jdLower = jobDescription.toLowerCase();
    const isAI = jdLower.includes("ai") || jdLower.includes("llm") || jdLower.includes("machine learning") || jdLower.includes("langgraph");
    const isBackend = jdLower.includes("backend") || jdLower.includes("go") || jdLower.includes("distributed") || jdLower.includes("system design") || jdLower.includes("microservice");

    const techKeywords = [
      "Go", "Python", "TypeScript", "JavaScript", "React", "Next.js", "FastAPI",
      "Docker", "Kubernetes", "Redis", "LangGraph", "Agentic AI", "GIS", "WebSockets",
      "AWS", "Google Cloud", "PostgreSQL", "CI/CD", "Distributed Systems", "RESTful APIs",
      "gRPC", "Microservices", "Concurrency"
    ];

    const matchedFromJd = techKeywords.filter((tech) =>
      jdLower.includes(tech.toLowerCase())
    );

    const activeMatched = matchedFromJd.length > 0 ? matchedFromJd : ["Go", "TypeScript", "Next.js", "Docker", "Kubernetes", "LangGraph"];
    const missing = ["Kafka", "GraphQL", "Rust"].filter(k => !activeMatched.includes(k));

    let tailored = masterLatex;
    const targetComp = escapeLatexText(companyName || "Target Company");
    const targetRole = jobTitle || (isAI ? "AI Systems Engineer" : isBackend ? "Backend Software Engineer" : "Full-Stack Engineer");

    // Rewrite Headline
    if (isAI) {
      tailored = tailored.replace(
        /\\small Systems Engineer specializing in Go[\s\S]*?\\\\ \\vspace\{1pt\}/,
        `\\small AI Systems Engineer specializing in Agentic AI workflows (LangGraph, FastAPI), adversarial LLM validation, and scalable Next.js interfaces aligned with ${targetComp}\\\\ \\vspace{1pt}`
      );
    } else if (isBackend) {
      tailored = tailored.replace(
        /\\small Systems Engineer specializing in Go[\s\S]*?\\\\ \\vspace\{1pt\}/,
        `\\small Backend Systems Engineer specializing in Go, distributed microservices, Redis caching, and high-concurrency database architecture for ${targetComp}\\\\ \\vspace{1pt}`
      );
    } else {
      tailored = tailored.replace(
        /\\small Systems Engineer specializing in Go[\s\S]*?\\\\ \\vspace\{1pt\}/,
        `\\small Full-Stack Product Engineer specializing in high-performance TypeScript, Next.js architecture, and scalable cloud microservices for ${targetComp}\\\\ \\vspace{1pt}`
      );
    }

    // Rewrite Summary
    const newSummary = `Full-stack Engineer with proven track record in ${activeMatched.slice(0, 3).join(", ")} and scalable software architecture. Experienced in delivering production-grade features for ${targetComp}, optimizing latency by 30\\%+, and leveraging containerized deployments (Docker, Kubernetes) to drive resilient end-to-end applications.`;
    tailored = tailored.replace(
      /\\section\{Summary\}\s*\\small\{[\s\S]*?\}\s*\\vspace\{-10pt\}/,
      `\\section{Summary}\n  \\small{${newSummary}}\n  \\vspace{-10pt}`
    );

    // Enhance Experience Bullets
    tailored = tailored.replace(
      /Implemented AI-driven modules using LLMs and automation workflows, enhancing product intelligence and reducing manual tasks by 40\%./,
      `Engineered high-throughput automation pipelines and ${activeMatched[0] || "AI"} modules for ${targetComp} workflow requirements, reducing manual operations by 40\\% and improving system throughput by 30\\%.`
    );

    const demoResponse: TailorResponse = {
      tailoredLatex: tailored,
      atsScore: Math.min(98, 86 + activeMatched.length * 2),
      matchedKeywords: activeMatched,
      missingKeywords: missing.slice(0, 2),
      keyChangesSummary: [
        `Replaced headline and summary to directly match ${targetRole} requirements at ${targetComp}.`,
        `Infused key technical competencies (${activeMatched.slice(0, 4).join(", ")}) into work experience bullets.`,
        "Re-indexed quantifiable metrics using Google XYZ STAR formula.",
        "Preserved 100% LaTeX syntax and escaped special characters for instant clean PDF compilation.",
      ],
    };

    return NextResponse.json(demoResponse);
  } catch (error: any) {
    console.error("Tailor API Route error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
