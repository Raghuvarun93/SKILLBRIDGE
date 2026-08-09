# SkillBridge - Deployment Guide

## 🚀 Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - SkillBridge project"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

3. **Add Environment Variable (Optional)**
   - Go to Project Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your OpenAI API key
   - **Note:** The app works in demo mode without this key

4. **Done!**
   - Your app is live at `https://your-project.vercel.app`

## 🎯 Alternative: Deploy to Netlify

1. Push code to GitHub (same as above)
2. Go to https://app.netlify.com/
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variable `OPENAI_API_KEY` (optional)
7. Deploy!

## 📦 Alternative: Deploy to Railway

1. Go to https://railway.app/
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Next.js
5. Add `OPENAI_API_KEY` in Variables tab (optional)
6. Deploy!

## 🏠 Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 🔑 About API Key

The app works in **demo mode** without an OpenAI API key, showing sample analysis results. To enable live AI analysis:

1. Get an API key from https://platform.openai.com/api-keys
2. Add it as an environment variable in your deployment platform
3. Or add it to `.env.local` for local development

## 📸 Screenshots for Submission

Make sure to capture:
1. Landing page with the bridge hero
2. Form with resume upload and job description
3. Results page showing:
   - Match score gauge
   - Matched skills evidence
   - Gap analysis
   - Project recommendations
   - Readiness simulator
   - Roadmap timeline

## 🎥 Demo Tips

For your hackathon demo:
1. Upload a sample resume (or paste text)
2. Paste a real job description from LinkedIn/Indeed
3. Show the complete analysis flow
4. Highlight the actionable insights (gaps, projects, roadmap)
5. Show the mobile responsiveness

Good luck with your submission! 🚀
