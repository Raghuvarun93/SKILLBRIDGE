# SkillBridge

**See exactly what stands between you and the role — then build the bridge.**

SkillBridge is an AI career-gap intelligence platform built for HackDevengers 1.0. Upload a resume and paste a target job description. SkillBridge produces an evidence-based readiness score, explains which requirements are demonstrated or missing, recommends portfolio projects that close the gaps, generates a focused roadmap, and simulates how closing those gaps can improve readiness.

## The core idea

Most resume tools stop at a score. SkillBridge turns the comparison into an action loop:

**Resume + Job Description → Evidence → Gaps → Projects → Roadmap → Readiness Projection**

## Key features

- PDF or pasted-resume input
- Job-specific AI readiness score
- Evidence-based skill matching (strong vs partial evidence)
- Ranked missing / under-demonstrated requirements
- Estimated readiness lift for each gap
- Tailored portfolio project recommendations
- 3–4 week action roadmap
- Readiness simulator showing a realistic improvement projection
- Responsive, demo-focused UI

## Tech stack

- **Next.js 16** (App Router, TypeScript)
- **OpenAI API** (`gpt-4o-mini`, structured JSON output)
- **pdf-parse** for resume PDF extraction
- **Tailwind CSS v4**
- **react-dropzone** for resume upload

## Run locally

```bash
npm install
cp .env.example .env.local
# Add OPENAI_API_KEY to .env.local
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push this folder to a public GitHub repository.
2. Import the repository into Vercel.
3. Add `OPENAI_API_KEY` under Environment Variables.
4. Deploy.

## Demo flow

1. Upload a resume.
2. Paste a real target job description.
3. Show the readiness score.
4. Open the evidence cards to show why skills match.
5. Show the highest-impact gaps.
6. Show a tailored portfolio project that closes multiple gaps.
7. Show the readiness simulator.
8. Finish on the roadmap.

## Project structure

```text
src/
  app/
    page.tsx
    api/analyze/route.ts
    globals.css
    layout.tsx
  components/
    BridgeHero.tsx
    ResultPanels.tsx
    ScoreGauge.tsx
  lib/
    analysis.ts
```

## Important security note

Never commit `.env.local` or expose `OPENAI_API_KEY` in client-side code. The key is used only by the server-side `/api/analyze` route.
