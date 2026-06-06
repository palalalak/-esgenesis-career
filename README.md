# EsGenesis.Career — CASPA Career Intelligence Platform

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment Variables

Create a `.env.local` file:
```
ANTHROPIC_API_KEY=your_key_here
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add `ANTHROPIC_API_KEY` in Vercel Environment Variables
4. Deploy

## Pages

- `/` — Landing page
- `/assessment` — 3-step assessment (Info → Subjects → Personality)
- `/report` — Full 13-section career intelligence report
- `/report?demo=true` — Sample report (Madhav Pandey demo)
