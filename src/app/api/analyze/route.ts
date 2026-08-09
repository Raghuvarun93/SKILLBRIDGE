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
        matchScore: 78,
        headline: "Strong technical foundation with a few key gaps. You're closer than you think — addressing the missing production skills could make you job-ready in 3-4 weeks.",
        matchedSkills: [
          {
            skill: "Python & ML Fundamentals",
            evidenceLevel: "strong",
            evidence: "Built Crop Yield Prediction System with Scikit-learn achieving 87% accuracy, shows hands-on ML experience"
          },
          {
            skill: "Pandas, NumPy, Scikit-learn",
            evidenceLevel: "strong",
            evidence: "Used in Crop Yield Prediction project for data processing and model training"
          },
          {
            skill: "FastAPI & Backend Development",
            evidenceLevel: "strong",
            evidence: "Deployed FastAPI backend for Crop Yield app and EventSync platform with JWT authentication"
          },
          {
            skill: "Full-Stack Development",
            evidenceLevel: "strong",
            evidence: "EventSync platform (Next.js + MongoDB + FastAPI) used by 200+ students, shows end-to-end capability"
          },
          {
            skill: "REST APIs",
            evidenceLevel: "strong",
            evidence: "Built RESTful APIs for multiple projects including EventSync event management"
          },
          {
            skill: "Git & Version Control",
            evidenceLevel: "strong",
            evidence: "Active GitHub usage across multiple projects and hackathon participation"
          },
          {
            skill: "Computer Vision (Bonus)",
            evidenceLevel: "strong",
            evidence: "YOLOv8 Food Detection project shows practical CV experience, directly matches bonus requirement"
          }
        ],
        gaps: [
          {
            skill: "Docker & Containerization",
            importance: "critical",
            evidenceLevel: "missing",
            evidence: "No Docker experience mentioned in resume or projects",
            why: "Role requires containerizing ML services for consistent deployment across environments",
            projectedLift: 10
          },
          {
            skill: "Cloud Deployment (AWS/GCP/Azure)",
            importance: "critical",
            evidenceLevel: "missing",
            evidence: "Projects deployed locally or basic hosting, no AWS/GCP/Azure experience shown",
            why: "Position requires deploying and scaling ML models on cloud infrastructure",
            projectedLift: 12
          },
          {
            skill: "System Design for ML Services",
            importance: "important",
            evidenceLevel: "partial",
            evidence: "Built full-stack apps but no mention of distributed systems or scalability patterns",
            why: "Role involves designing scalable ML pipelines that handle production traffic",
            projectedLift: 8
          },
          {
            skill: "Production ML Monitoring",
            importance: "important",
            evidenceLevel: "missing",
            evidence: "ML models built and evaluated but no production monitoring, drift detection, or logging shown",
            why: "Maintaining ML models in production requires monitoring performance degradation and data drift",
            projectedLift: 6
          }
        ],
        projects: [
          {
            title: "Production ML Service with Docker & AWS",
            outcome: "Build and deploy a complete ML API service using Docker containers on AWS, with monitoring and CI/CD. Take your existing Crop Yield model (or similar) to production-grade deployment.",
            skills: ["Docker", "AWS (EC2/ECS/Lambda)", "System Design", "ML Monitoring", "CI/CD"],
            effort: "2-3 weeks",
            closesGaps: ["Docker & Containerization", "Cloud Deployment (AWS/GCP/Azure)", "System Design for ML Services", "Production ML Monitoring"]
          },
          {
            title: "Scalable Food Detection API",
            outcome: "Containerize your YOLOv8 Food Detection model, deploy it as a scalable REST API on GCP/AWS with load balancing, and add performance monitoring. Document the architecture.",
            skills: ["Docker", "Cloud Deployment", "Model Serving", "API Optimization", "Monitoring"],
            effort: "2 weeks",
            closesGaps: ["Docker & Containerization", "Cloud Deployment (AWS/GCP/Azure)", "Production ML Monitoring"]
          }
        ],
        roadmap: [
          {
            week: 1,
            focus: "Docker & Containerization Basics",
            tasks: [
              "Learn Docker fundamentals (images, containers, volumes, networks)",
              "Dockerize your existing Crop Yield Prediction FastAPI app",
              "Write Dockerfile with multi-stage builds for smaller images",
              "Test locally with docker-compose for FastAPI + database"
            ]
          },
          {
            week: 2,
            focus: "AWS/GCP Deployment & Cloud Basics",
            tasks: [
              "Set up AWS free tier account (or GCP)",
              "Deploy your Dockerized ML API to AWS EC2 or App Runner",
              "Configure environment variables and secrets management",
              "Set up basic monitoring with CloudWatch logs"
            ]
          },
          {
            week: 3,
            focus: "System Design & Scalability",
            tasks: [
              "Add caching layer (Redis) for prediction results",
              "Implement async task queue for batch predictions",
              "Set up load balancer and auto-scaling",
              "Document your architecture with diagrams"
            ]
          },
          {
            week: 4,
            focus: "Production ML Best Practices",
            tasks: [
              "Add model versioning and A/B testing capability",
              "Set up monitoring dashboards (prediction latency, accuracy drift)",
              "Implement CI/CD pipeline with GitHub Actions",
              "Write comprehensive README with deployment guide and resume bullet points"
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
