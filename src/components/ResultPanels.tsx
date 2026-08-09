import type { AnalysisResult } from "@/lib/analysis";
import { ArrowUpRight, Check, CircleAlert, FolderKanban, Sparkles, Target } from "lucide-react";

const importanceStyle: Record<string, { label: string; color: string }> = {
  critical: { label: "Critical", color: "#EF7C6B" },
  important: { label: "Important", color: "#F2A93B" },
  "nice-to-have": { label: "Nice to have", color: "#4FD1C5" },
};

export function MatchedSkills({ skills }: { skills: AnalysisResult["matchedSkills"] }) {
  if (!skills.length) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Check size={15} style={{ color: "#4FD1C5" }} />
        <h3 className="font-display text-sm tracking-wide text-muted uppercase">Evidence you already have</h3>
      </div>
      <div className="grid gap-2.5 md:grid-cols-2">
        {skills.map((item) => (
          <div key={item.skill} className="rounded-xl border p-4" style={{ borderColor: "#2A3446", background: "#161D2CAA" }}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">{item.skill}</span>
              <span className="text-[10px] uppercase tracking-wider rounded-full px-2 py-1" style={{ color: "#4FD1C5", border: "1px solid #4FD1C566", background: "#4FD1C512" }}>
                {item.evidenceLevel}
              </span>
            </div>
            <p className="text-sm text-muted mt-2 leading-relaxed">{item.evidence}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GapList({ gaps }: { gaps: AnalysisResult["gaps"] }) {
  if (!gaps.length) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <CircleAlert size={15} style={{ color: "#EF7C6B" }} />
        <h3 className="font-display text-sm tracking-wide text-muted uppercase">The gaps holding you back</h3>
      </div>
      <ul className="space-y-2.5">
        {gaps.map((g) => {
          const style = importanceStyle[g.importance] ?? importanceStyle.important;
          return (
            <li key={g.skill} className="rounded-xl border p-4" style={{ borderColor: "#2A3446", background: "#161D2CAA" }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{g.skill}</span>
                  <span className="text-[10px] uppercase tracking-wider rounded-full px-2 py-1" style={{ color: g.evidenceLevel === "missing" ? "#EF7C6B" : "#F2A93B", border: `1px solid ${g.evidenceLevel === "missing" ? "#EF7C6B" : "#F2A93B"}66` }}>
                    {g.evidenceLevel}
                  </span>
                </div>
                <span className="text-xs font-mono-num px-2 py-0.5 rounded-full shrink-0" style={{ color: style.color, border: `1px solid ${style.color}66` }}>
                  {style.label}
                </span>
              </div>
              <p className="text-sm mt-2 leading-relaxed">{g.why}</p>
              <p className="text-xs text-muted mt-2 leading-relaxed"><span className="text-white/70">Resume evidence:</span> {g.evidence}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted">Potential readiness lift</span>
                <span className="font-mono-num" style={{ color: "#4FD1C5" }}>+{g.projectedLift}%</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ProjectBridge({ projects }: { projects: AnalysisResult["projects"] }) {
  if (!projects.length) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <FolderKanban size={15} style={{ color: "#F2A93B" }} />
        <h3 className="font-display text-sm tracking-wide text-muted uppercase">Projects that close the gap</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {projects.map((project) => (
          <article key={project.title} className="rounded-2xl border p-5" style={{ borderColor: "#F2A93B44", background: "linear-gradient(135deg,#1A2232,#171D29)" }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted">Portfolio bridge</p>
                <h4 className="font-display text-lg font-semibold mt-1">{project.title}</h4>
              </div>
              <ArrowUpRight size={18} style={{ color: "#F2A93B" }} />
            </div>
            <p className="text-sm leading-relaxed mt-3">{project.outcome}</p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {project.skills.map((skill) => <span key={skill} className="text-xs rounded-full px-2 py-1 border" style={{ borderColor: "#2A3446", color: "#B8C1D2" }}>{skill}</span>)}
            </div>
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: "#2A3446" }}>
              <span className="text-muted">Effort</span>
              <span>{project.effort}</span>
            </div>
            {project.closesGaps.length > 0 && (
              <p className="text-xs text-muted mt-2">Closes: {project.closesGaps.join(" · ")}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

export function ReadinessSimulator({ result }: { result: AnalysisResult }) {
  const lift = result.gaps.reduce((sum, gap) => sum + gap.projectedLift, 0);
  const projected = Math.min(96, Math.max(result.matchScore, result.matchScore + Math.min(lift, 28)));
  const criticalLift = result.gaps.filter((g) => g.importance === "critical").reduce((sum, g) => sum + g.projectedLift, 0);
  const firstStep = Math.min(95, result.matchScore + Math.min(criticalLift, 12));

  return (
    <div className="rounded-2xl border p-6 md:p-7" style={{ borderColor: "#4FD1C544", background: "linear-gradient(135deg,#122329,#171D29)" }}>
      <div className="flex items-start gap-3">
        <div className="rounded-lg p-2" style={{ background: "#4FD1C51A" }}><Target size={17} style={{ color: "#4FD1C5" }} /></div>
        <div>
          <h3 className="font-display text-lg font-semibold">Readiness simulator</h3>
          <p className="text-sm text-muted mt-1">A realistic projection if you close the highest-impact gaps.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="rounded-xl border p-4" style={{ borderColor: "#2A3446", background: "#0E142088" }}>
          <p className="text-xs text-muted uppercase tracking-wider">Today</p>
          <p className="font-mono-num text-3xl mt-1">{result.matchScore}%</p>
        </div>
        <div className="rounded-xl border p-4" style={{ borderColor: "#4FD1C544", background: "#0E142088" }}>
          <p className="text-xs text-muted uppercase tracking-wider">Projected</p>
          <p className="font-mono-num text-3xl mt-1" style={{ color: "#4FD1C5" }}>{projected}%</p>
        </div>
      </div>
      <div className="mt-5 h-3 rounded-full overflow-hidden" style={{ background: "#1F2838" }}>
        <div className="h-full rounded-full" style={{ width: `${projected}%`, background: "linear-gradient(90deg,#4FD1C5,#F2A93B)" }} />
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm">
        <Sparkles size={15} style={{ color: "#F2A93B" }} />
        <span>Close the critical gaps first → approximately <strong>{firstStep}%</strong> readiness, then build the remaining skills.</span>
      </div>
    </div>
  );
}

export function RoadmapTimeline({ roadmap }: { roadmap: AnalysisResult["roadmap"] }) {
  if (!roadmap.length) return null;
  return (
    <div>
      <h3 className="font-display text-sm tracking-wide text-muted uppercase mb-3">Your build-out plan</h3>
      <ol className="relative border-l pl-6 space-y-6" style={{ borderColor: "#2A3446" }}>
        {roadmap.map((step) => (
          <li key={step.week} className="relative">
            <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border-2" style={{ background: "#0E1420", borderColor: "#F2A93B" }} />
            <div className="flex items-baseline gap-2">
              <span className="font-mono-num text-xs" style={{ color: "#F2A93B" }}>WEEK {step.week}</span>
              <span className="font-medium">{step.focus}</span>
            </div>
            <ul className="mt-2 space-y-1">
              {step.tasks.map((t, i) => <li key={i} className="text-sm text-muted flex gap-2"><span style={{ color: "#4FD1C5" }}>—</span><span>{t}</span></li>)}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
