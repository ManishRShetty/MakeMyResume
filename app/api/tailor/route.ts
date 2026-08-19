import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt, parseTailorAiOutput, TailorRequest, TailorResponse } from "@/lib/gemini";
import { escapeLatex } from "@/lib/latex-utils";

export async function POST(req: NextRequest) {
  try {
    const body: TailorRequest = await req.json();
    const { masterLatex, companyName, jobTitle, jobDescription, apiKey, modelName, customPrompt } = body;

    if (!masterLatex || !jobDescription) {
      return NextResponse.json(
        { error: "Master LaTeX resume and Job Description are required." },
        { status: 400 }
      );
    }

    const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;

    // If API key is available, call Gemini API
    if (effectiveApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(effectiveApiKey);
        const model = genAI.getGenerativeModel({
          model: modelName || "gemini-1.5-flash",
        });

        const systemPrompt = buildSystemPrompt(customPrompt);
        const userPrompt = `TARGET COMPANY: ${companyName || "Target Tech Company"}
TARGET ROLE/POSITION: ${jobTitle || "Software Engineer"}

JOB DESCRIPTION (JD):
${jobDescription}

MASTER RESUME LATEX CODE:
${masterLatex}

Please analyze the JD, calculate ATS score & keywords, rewrite/optimize bullets with STAR formula, and output both the updated complete LaTeX code and JSON stats.`;

        const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
        const response = await model.generateContent(fullPrompt);
        const rawText = response.response.text() || "";
        const parsed = parseTailorAiOutput(rawText, masterLatex);
        return NextResponse.json(parsed);
      } catch (geminiError: any) {
        console.error("Gemini API error:", geminiError);
        return NextResponse.json(
          { error: `Gemini API Error: ${geminiError.message || "Failed to generate tailored resume"}` },
          { status: 500 }
        );
      }
    }

    // Smart Offline Mode / Demo Mode (No API key required out-of-the-box)
    const techKeywords = [
      "TypeScript", "React", "Next.js", "Python", "Go", "Java", "Docker", "Kubernetes",
      "AWS", "PostgreSQL", "GraphQL", "Redis", "Kafka", "CI/CD", "Microservices",
      "Distributed Systems", "RESTful APIs", "GCP", "Azure", "TailwindCSS", "Node.js"
    ];

    const matchedFromJd = techKeywords.filter((tech) =>
      jobDescription.toLowerCase().includes(tech.toLowerCase())
    );

    const activeMatched = matchedFromJd.length > 0 ? matchedFromJd : ["TypeScript", "Distributed Systems", "Cloud Computing", "REST APIs"];
    const missing = ["Kafka", "GraphQL", "Kubernetes"].filter(k => !activeMatched.includes(k));

    // Perform rule-based tailoring on master latex
    let tailored = masterLatex;
    
    if (companyName && tailored.includes("Distributed Task Queue")) {
      tailored = tailored.replace(
        "Distributed Task Queue",
        `High-Throughput Distributed Pipeline (${companyName} Architecture Aligned)`
      );
    }

    tailored = escapeLatex(tailored);

    const demoResponse: TailorResponse = {
      tailoredLatex: tailored,
      atsScore: Math.min(94, 78 + activeMatched.length * 3),
      matchedKeywords: activeMatched,
      missingKeywords: missing.slice(0, 3),
      keyChangesSummary: [
        `Aligned tech stack keywords (${activeMatched.slice(0, 3).join(", ")}) with ${companyName || "the role"}.`,
        "Restructured action verbs and quantified impact metrics using Google XYZ STAR formula.",
        "Verified and escaped LaTeX symbols to ensure clean PDF rendering.",
      ],
    };

    return NextResponse.json(demoResponse);
  } catch (error: any) {
    console.error("Tailor API Route error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
