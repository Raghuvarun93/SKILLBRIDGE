# 🚀 SkillBridge - Quick Command Reference

## Git Commands (Copy & Paste)

### 1. Push to GitHub
After creating your repository on GitHub, copy its URL and run:

```bash
git remote add origin YOUR_GITHUB_URL_HERE
git branch -M main
git push -u origin main
```

Example:
```bash
git remote add origin https://github.com/yourusername/skillbridge.git
git branch -M main
git push -u origin main
```

### If you need to change the remote URL:
```bash
git remote remove origin
git remote add origin YOUR_NEW_GITHUB_URL
git push -u origin main
```

## Development Commands

### Run in development mode:
```bash
npm run dev
```
Opens at http://localhost:3000

### Build for production:
```bash
npm run build
```

### Run production build:
```bash
npm start
```

### Check for code issues:
```bash
npm run lint
```

## Testing Your Deploy

### After deploying to Vercel, test these:
1. Open your live URL
2. Check demo mode banner shows
3. Try the sample data from SAMPLE_DATA.md
4. Test on mobile (use DevTools or real device)

## Quick File Reference

| File | Purpose |
|------|---------|
| `QUICKSTART.md` | Step-by-step deployment guide ⭐ START HERE |
| `DEPLOYMENT.md` | Detailed deployment instructions |
| `SUBMISSION_CHECKLIST.md` | Complete submission checklist |
| `SAMPLE_DATA.md` | Test data for demos |
| `PROJECT_SUMMARY.md` | Technical overview |
| `README.md` | Project documentation |

## Submission Form

**URL:** https://forms.gle/FgDL1icZLZjQeqff9

**What you need:**
- Live demo URL (from Vercel)
- GitHub repository URL
- Project description (see SUBMISSION_CHECKLIST.md)
- Screenshots or demo video

## Help Commands

### Check if Git is initialized:
```bash
git status
```

### See your commits:
```bash
git log --oneline
```

### Check remote URL:
```bash
git remote -v
```

### See what files are staged:
```bash
git status
```

## Vercel CLI (Optional)

If you want to use Vercel CLI instead of the web interface:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Troubleshooting

### Port already in use:
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (use PID from above)
taskkill /PID <PID> /F
```

### Clear npm cache:
```bash
npm cache clean --force
```

### Reinstall dependencies:
```bash
rmdir /s node_modules
del package-lock.json
npm install
```

## Environment Variables

For local development, edit `.env.local`:
```env
OPENAI_API_KEY=your_key_here
```

For Vercel:
1. Go to Project Settings
2. Environment Variables
3. Add `OPENAI_API_KEY`
4. Redeploy

**Note:** Demo mode works without API key!

## Time Estimates

| Task | Time |
|------|------|
| Create GitHub repo | 2 min |
| Push code | 1 min |
| Deploy to Vercel | 3-5 min |
| Test deployment | 2 min |
| Fill submission form | 5 min |
| **Total** | **~15 min** |

## Important URLs

- **Submission Form:** https://forms.gle/FgDL1icZLZjQeqff9
- **GitHub:** https://github.com/new
- **Vercel:** https://vercel.com/new
- **Netlify:** https://app.netlify.com/
- **Railway:** https://railway.app/

## Last Checklist

Before submitting:
- [ ] Code pushed to GitHub
- [ ] Repository is PUBLIC
- [ ] Deployed and live
- [ ] Tested the live site
- [ ] Screenshots taken
- [ ] Form filled out
- [ ] Submitted before 7:00 PM

## You're Ready! 🎉

Open `QUICKSTART.md` and follow the steps!
