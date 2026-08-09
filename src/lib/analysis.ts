export interface MatchedSkill {
  skill: string;
  evidenceLevel: "strong" | "partial";
  evidence: string;
}

export interface SkillGap {
  skill: string;
  importance: "critical" | "important" | "nice-to-have";
  evidenceLevel: "missing" | "partial";
  evidence: string;
  why: string;
  projectedLift: number;
}

export interface ProjectRecommendation {
  title: string;
  outcome: string;
  skills: string[];
  effort: string;
  closesGaps: string[];
}

export interface RoadmapStep {
  week: number;
  focus: string;
  tasks: string[];
}

export interface AnalysisResult {
  matchScore: number;
  headline: string;
  matchedSkills: MatchedSkill[];
  gaps: SkillGap[];
  roadmap: RoadmapStep[];
  projects: ProjectRecommendation[];
}

const evidenceSchema = {
  type: "object",
  properties: {
    skill: { type: "string" },
    evidenceLevel: { type: "string", enum: ["strong", "partial"] },
    evidence: { type: "string" },
  },
  required: ["skill", "evidenceLevel", "evidence"],
  additionalProperties: false,
};

const gapSchema = {
  type: "object",
  properties: {
    skill: { type: "string" },
    importance: { type: "string", enum: ["critical", "important", "nice-to-have"] },
    evidenceLevel: { type: "string", enum: ["missing", "partial"] },
    evidence: { type: "string" },
    why: { type: "string" },
    projectedLift: { type: "integer", minimum: 1, maximum: 15 },
  },
  required: ["skill", "importance", "evidenceLevel", "evidence", "why", "projectedLift"],
  additionalProperties: false,
};

const projectSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    outcome: { type: "string" },
    skills: { type: "array", items: { type: "string" } },
    effort: { type: "string" },
    closesGaps: { type: "array", items: { type: "string" } },
  },
  required: ["title", "outcome", "skills", "effort", "closesGaps"],
  additionalProperties: false,
};

const roadmapSchema = {
  type: "object",
  properties: {
    week: { type: "integer", minimum: 1, maximum: 4 },
    focus: { type: "string" },
    tasks: { type: "array", items: { type: "string" } },
  },
  required: ["week", "focus", "tasks"],
  additionalProperties: false,
};

export const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    matchScore: { type: "integer", minimum: 0, maximum: 100 },
    headline: { type: "string" },
    matchedSkills: { type: "array", items: evidenceSchema },
    gaps: { type: "array", items: gapSchema },
    roadmap: { type: "array", items: roadmapSchema },
    projects: { type: "array", items: projectSchema, minItems: 1, maxItems: 2 },
  },
  required: ["matchScore", "headline", "matchedSkills", "gaps", "roadmap", "projects"],
  additionalProperties: false,
};

export function buildPrompt(resumeText: string, jobDescription: string) {
  return `You are SkillBridge's career gap intelligence engine. Compare a candidate's resume against one specific target job and turn the comparison into an evidence-based, actionable career plan.

RESUME:
"""
${resumeText.slice(0, 9000)}
"""

TARGET JOB DESCRIPTION:
"""
${jobDescription.slice(0, 7000)}
"""

Rules:
- Judge readiness for THIS job, not employability in general.
- Separate demonstrated evidence from skills merely claimed without evidence.
- matchScore is an honest 0-100 estimate of job readiness today. Do not inflate it.
- matchedSkills: include 4-10 important requirements already supported by the resume. evidenceLevel is strong when the resume gives concrete project/work/course evidence; partial when evidence is weak or indirect. Evidence must mention where the resume supports the skill, without inventing details.
- gaps: include at most 6 highest-impact missing or under-demonstrated requirements. importance must reflect the job description. evidence must say whether the resume is missing the skill or only shows weak evidence. why must explain why the requirement matters for this role. projectedLift estimates how much readiness could improve if the gap were credibly closed; keep the total realistic.
- roadmap: 3-4 weeks, ordered by impact. Use concrete actions, not vague advice. Prefer building one portfolio project that closes multiple gaps.
- projects: recommend 1-2 realistic portfolio projects tailored to the target job. Each project must close multiple gaps where possible. Include the concrete outcome, skills practiced, approximate effort, and which gap names it addresses.
- Never claim the candidate has a certification, job, project, or skill that is not supported by the resume.
- Never give generic motivational filler.
- Return only the JSON object matching the provided schema.`;
}
