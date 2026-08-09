"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import BridgeHero from "@/components/BridgeHero";
import ScoreGauge from "@/components/ScoreGauge";
import { MatchedSkills, GapList, ProjectBridge, ReadinessSimulator, RoadmapTimeline } from "@/components/ResultPanels";
import type { AnalysisResult } from "@/lib/analysis";

type Mode = "file" | "paste";

export default function Home() {
  const [mode, setMode] = useState<Mode>("file");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setResumeFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    },
  });

  const canSubmit =
    jobDescription.trim().length > 20 &&
    ((mode === "file" && resumeFile) || (mode === "paste" && resumeText.trim().length > 30));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      if (mode === "file" && resumeFile) formData.append("resumeFile", resumeFile);
      if (mode === "paste") formData.append("resumeText", resumeText);

      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-14 md:py-20">
      <div className="max-w-3xl mx-auto">
        {/* Demo Mode Banner */}
        <div className="mb-6 rounded-xl border p-4 text-sm" style={{ borderColor: "#F2A93B", background: "#F2A93B15" }}>
          <p className="text-center" style={{ color: "#F2A93B" }}>
            ⚡ Demo Mode: Showing sample analysis results. Add OPENAI_API_KEY for live AI analysis.
          </p>
        </div>
        
        {/* Hero */}
        <header className="mb-10">
          <p
            className="font-mono-num text-xs tracking-[0.2em] mb-4"
            style={{ color: "#F2A93B" }}
          >
            SKILLBRIDGE
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight max-w-xl">
            See exactly what stands between you and the role.
          </h1>
          <p className="text-muted mt-4 max-w-lg leading-relaxed">
            Drop in your resume and a job description. Get an honest match score, the
            specific skills you&apos;re missing, and a plan to close the gap in weeks, not
            months.
          </p>
          <div className="mt-8">
            <BridgeHero />
          </div>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border p-6 md:p-8 space-y-6"
          style={{ borderColor: "#2A3446", background: "#161D2C88" }}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-sm tracking-wide text-muted uppercase">
                Your resume
              </h2>
              <div className="flex text-xs rounded-full border overflow-hidden" style={{ borderColor: "#2A3446" }}>
                <button
                  type="button"
                  onClick={() => setMode("file")}
                  className="px-3 py-1.5 cursor-pointer"
                  style={{
                    background: mode === "file" ? "#F2A93B" : "transparent",
                    color: mode === "file" ? "#10131A" : "#8A93A6",
                  }}
                >
                  Upload PDF
                </button>
                <button
                  type="button"
                  onClick={() => setMode("paste")}
                  className="px-3 py-1.5 cursor-pointer"
                  style={{
                    background: mode === "paste" ? "#F2A93B" : "transparent",
                    color: mode === "paste" ? "#10131A" : "#8A93A6",
                  }}
                >
                  Paste text
                </button>
              </div>
            </div>

            {mode === "file" ? (
              <div
                {...getRootProps()}
                className="rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors"
                style={{
                  borderColor: isDragActive ? "#F2A93B" : "#2A3446",
                  background: isDragActive ? "#F2A93B0D" : "transparent",
                }}
              >
                <input {...getInputProps()} />
                {resumeFile ? (
                  <p className="text-sm">
                    <span style={{ color: "#4FD1C5" }}>✓</span> {resumeFile.name}
                  </p>
                ) : (
                  <p className="text-sm text-muted">
                    Drag your resume here, or click to browse (PDF or .txt)
                  </p>
                )}
              </div>
            ) : (
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                rows={6}
                className="w-full rounded-xl border p-4 text-sm resize-none outline-none"
                style={{ borderColor: "#2A3446", background: "#0E1420" }}
              />
            )}
          </div>

          <div>
            <h2 className="font-display text-sm tracking-wide text-muted uppercase mb-3">
              Target job description
            </h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description you're aiming for..."
              rows={8}
              className="w-full rounded-xl border p-4 text-sm resize-none outline-none"
              style={{ borderColor: "#2A3446", background: "#0E1420" }}
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full rounded-xl py-3.5 font-medium transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{ background: "#F2A93B", color: "#10131A" }}
          >
            {loading ? "Building your bridge..." : "Analyze the gap"}
          </button>

          {error && (
            <p className="text-sm text-center" style={{ color: "#EF7C6B" }}>
              {error}
            </p>
          )}
        </form>

        {/* Results */}
        {result && (
          <section className="mt-10 space-y-10">
            <div
              className="rounded-2xl border p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6"
              style={{ borderColor: "#2A3446", background: "#161D2C88" }}
            >
              <ScoreGauge score={result.matchScore} />
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted mb-2">AI assessment</p>
                <p className="text-lg leading-relaxed">{result.headline}</p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              <MatchedSkills skills={result.matchedSkills} />
              <GapList gaps={result.gaps} />
            </div>
            <ProjectBridge projects={result.projects} />
            <ReadinessSimulator result={result} />
            <RoadmapTimeline roadmap={result.roadmap} />
          </section>
        )}

        <footer className="mt-16 text-center text-xs text-muted">
          Built for HackDevengers 1.0 — SkillBridge
        </footer>
      </div>
    </main>
  );
}
