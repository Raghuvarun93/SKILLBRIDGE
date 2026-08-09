import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ANALYSIS_SCHEMA, buildPrompt } from "@/lib/analysis";

export const runtime = "nodejs";

async function extractResumeText(formData: FormData): Promise<string> {
  const pastedText = (formData.get("resumeText") as string | null)?.trim();
  if (pastedText) return pastedText;

  const file = formData.get("resumeFile") as File | null;
  if (!file) throw new Error("No resume provided");

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (file.type === "application/pdf" || file.name?.toLowerCase().endsWith(".pdf")) {
    // Lazy import: pdf-parse touches the filesystem on module load in some
    // environments, so only load it when we actually need it.
    const pdfParse = (await import("pdf-parse")).default;
    const parsed = await pdfParse(buffer);
    return parsed.text;
  }

  // Fall back to treating it as plain text (.txt, .md, etc.)
  return buffer.toString("utf-8");
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const useDemoMode = !apiKey || apiKey === "sk-..." || apiKey.trim() === "";
    
    if (useDemoMode) {
      // Demo mode: return sample analysis
      return NextResponse.json({
        matchScore: 72,
        headline: "You have a solid foundation with some key gaps to address. With focused effort on the missing skills, you could be job-ready in 3-4 weeks.",
        matchedSkills: [
          {
            skill: "JavaScript/TypeScript",
            evidenceLevel: "strong",
            evidence: "Multiple projects demonstrating full-stack development with modern frameworks"
          },
          {
            skill: "React & Frontend Development",
            evidenceLevel: "strong",
            evidence: "Built responsive web applications with React, including component architecture"
          },
          {
            skill: "Git & Version Control",
            evidenceLevel: "strong",
            evidence: "GitHub profile shows consistent commits and collaborative projects"
          },
          {
            skill: "Problem Solving",
            evidenceLevel: "partial",
            evidence: "Hackathon participation demonstrates ability to work under pressure"
          }
        ],
        gaps: [
          {
            skill: "Cloud Deployment (AWS/Azure)",
            importance: "critical",
            evidenceLevel: "missing",
            evidence: "No cloud deployment experience mentioned in resume",
            why: "The role requires deploying and maintaining production applications on cloud infrastructure",
            projectedLift: 12
          },
          {
            skill: "Testing & CI/CD",
            importance: "important",
            evidenceLevel: "missing",
            evidence: "No mention of unit tests, integration tests, or continuous deployment pipelines",
            why: "Professional development requires automated testing and deployment practices",
            projectedLift: 8
          },
          {
            skill: "Database Design & SQL",
            importance: "critical",
            evidenceLevel: "partial",
            evidence: "Basic database usage shown but no complex queries or schema design",
            why: "Role involves designing efficient data models and writing optimized queries",
            projectedLift: 10
          },
          {
            skill: "API Design & RESTful Services",
            importance: "important",
            evidenceLevel: "partial",
            evidence: "Some API consumption but limited backend API development shown",
            why: "Position requires building scalable backend services",
            projectedLift: 7
          }
        ],
        projects: [
          {
            title: "Full-Stack Task Management System",
            outcome: "Build a production-ready task management app with cloud deployment, automated tests, and a well-designed database",
            skills: ["Cloud Deployment", "CI/CD", "Database Design", "RESTful APIs", "Testing"],
            effort: "2-3 weeks",
            closesGaps: ["Cloud Deployment (AWS/Azure)", "Testing & CI/CD", "Database Design & SQL", "API Design & RESTful Services"]
          }
        ],
        roadmap: [
          {
            week: 1,
            focus: "Database Design & Backend APIs",
            tasks: [
              "Design normalized database schema for task management (users, projects, tasks, tags)",
              "Set up PostgreSQL database and write migrations",
              "Build RESTful API endpoints with proper error handling",
              "Implement authentication and authorization"
            ]
          },
          {
            week: 2,
            focus: "Testing & Quality Assurance",
            tasks: [
              "Write unit tests for API endpoints (aim for 80%+ coverage)",
              "Add integration tests for critical user flows",
              "Set up GitHub Actions for automated testing",
              "Configure linting and code quality checks"
            ]
          },
          {
            week: 3,
            focus: "Cloud Deployment & CI/CD",
            tasks: [
              "Deploy backend to AWS/Heroku with PostgreSQL",
              "Set up automated deployment pipeline",
              "Configure environment variables and secrets",
              "Monitor logs and set up basic error tracking"
            ]
          },
          {
            week: 4,
            focus: "Polish & Documentation",
            tasks: [
              "Write comprehensive README with architecture decisions",
              "Add API documentation (Swagger/Postman)",
              "Create demo video showing deployment process",
              "Update resume with specific technical achievements"
            ]
          }
        ]
      });
    }

    const formData = await req.formData();
    const jobDescription = (formData.get("jobDescription") as string | null)?.trim();

    if (!jobDescription) {
      return NextResponse.json({ error: "Job description is required." }, { status: 400 });
    }

    let resumeText: string;
    try {
      resumeText = await extractResumeText(formData);
    } catch {
      return NextResponse.json(
        { error: "Couldn't read that resume. Try pasting the text instead." },
        { status: 400 }
      );
    }

    if (!resumeText || resumeText.trim().length < 30) {
      return NextResponse.json(
        { error: "Resume text looks too short to analyze — try pasting it directly." },
        { status: 400 }
      );
    }

    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a precise technical career coach. You always return valid JSON matching the given schema, with no extra commentary.",
        },
        { role: "user", content: buildPrompt(resumeText, jobDescription) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "skill_gap_analysis",
          schema: ANALYSIS_SCHEMA,
          strict: true,
        },
      },
      temperature: 0.4,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty response from model");

    const result = JSON.parse(raw);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong analyzing this. Please try again." },
      { status: 500 }
    );
  }
}
