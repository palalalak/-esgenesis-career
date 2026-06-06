import { NextRequest, NextResponse } from 'next/server'

// ── MBTI CALCULATION ─────────────────────────────────────────────────────────
function calculateMBTI(personality: Record<string, string>) {
  const dims = ['EI', 'SN', 'TF', 'JP']
  const first = ['E', 'S', 'T', 'J']
  const result: string[] = []

  dims.forEach((dim, i) => {
    const qs = Object.entries(personality).filter(([k]) => k.startsWith(dim.toLowerCase()))
    const score = qs.filter(([, v]) => v === first[i]).length
    result.push(score >= 2 ? first[i] : dim[1])
  })

  return result.join('')
}

// ── PERSONALITY WEIGHTS ───────────────────────────────────────────────────────
const mbtiWeights: Record<string, Record<string, number>> = {
  // High analytical profiles
  INTJ: { Mathematics: 1.3, Physics: 1.2, Chemistry: 1.1, 'Computer Science': 1.3, Economics: 1.2, Biology: 1.0, 'Data Science': 1.3 },
  INTP: { Mathematics: 1.3, Physics: 1.3, 'Computer Science': 1.3, Chemistry: 1.1, 'Data Science': 1.2, Economics: 1.1 },
  ENTJ: { Economics: 1.3, Mathematics: 1.2, 'Business Studies': 1.2, Accountancy: 1.2, 'Political Science': 1.1 },
  ENTP: { Economics: 1.2, Mathematics: 1.1, 'Computer Science': 1.2, Physics: 1.1, 'Business Studies': 1.1 },
  ISTJ: { Mathematics: 1.2, Accountancy: 1.3, 'Business Studies': 1.1, Economics: 1.2, Chemistry: 1.1 },
  ESTJ: { Mathematics: 1.1, Accountancy: 1.2, Economics: 1.3, 'Business Studies': 1.2, 'Physical Education': 1.0 },
  ISFJ: { Biology: 1.2, Chemistry: 1.1, Psychology: 1.2, 'Fine Arts': 1.0, History: 1.1 },
  ESFJ: { Psychology: 1.2, Sociology: 1.2, Biology: 1.1, History: 1.1, 'Business Studies': 1.0 },
  INFJ: { Psychology: 1.3, Sociology: 1.2, History: 1.2, 'Fine Arts': 1.1, 'Political Science': 1.2 },
  ENFJ: { Psychology: 1.3, Sociology: 1.2, History: 1.1, Biology: 1.1, 'Political Science': 1.2 },
  INFP: { 'Fine Arts': 1.3, Psychology: 1.2, Sociology: 1.1, History: 1.2, French: 1.1 },
  ENFP: { Psychology: 1.2, Sociology: 1.1, 'Fine Arts': 1.2, Economics: 1.0, History: 1.1 },
  ISTP: { Physics: 1.3, Mathematics: 1.2, Chemistry: 1.2, 'Computer Science': 1.2, 'Physical Education': 1.1 },
  ESTP: { Mathematics: 1.1, 'Business Studies': 1.2, Economics: 1.1, 'Physical Education': 1.2 },
  ISFP: { 'Fine Arts': 1.3, Biology: 1.2, Psychology: 1.1, Chemistry: 1.0, French: 1.1 },
  ESFP: { 'Fine Arts': 1.2, 'Physical Education': 1.3, Psychology: 1.1, Sociology: 1.1 },
}

// ── SUBJECT SCORING ────────────────────────────────────────────────────────
function scoreSubjects(subjects: { name: string; marks: number; interest: number }[], mbti: string) {
  const weights = mbtiWeights[mbti] || {}
  return subjects.map(s => {
    const personalityMult = weights[s.name] || 1.0
    const interestMult = 0.8 + (s.interest / 5) * 0.5
    const score = parseFloat((s.marks * interestMult * personalityMult).toFixed(1))
    const label = score >= 95 ? 'Superpower Asset' : score >= 80 ? 'Recommended' : score >= 60 ? 'Moderate Fit' : 'Review Required'
    return { ...s, score, label, personalityMult }
  }).sort((a, b) => b.score - a.score)
}

// ── STREAM DETECTION ───────────────────────────────────────────────────────
function detectStream(subjects: { name: string }[]) {
  const scienceSubjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'Data Science']
  const commerceSubjects = ['Economics', 'Accountancy', 'Business Studies', 'Mathematics', 'Entrepreneurship']
  const artsSubjects = ['History', 'Geography', 'Political Science', 'Psychology', 'Sociology', 'Fine Arts', 'French']

  const names = subjects.map(s => s.name)
  const sciScore = names.filter(n => scienceSubjects.includes(n)).length
  const comScore = names.filter(n => commerceSubjects.includes(n)).length
  const artScore = names.filter(n => artsSubjects.includes(n)).length

  if (sciScore >= comScore && sciScore >= artScore) return 'Science'
  if (comScore >= sciScore && comScore >= artScore) return 'Commerce'
  return 'Arts'
}

// ── UNIQUE REPORT ID ───────────────────────────────────────────────────────
function genReportId() {
  return `CASPA-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
}

// ── GLOBAL IN-MEMORY REPORT STORE (edge-compatible simple cache) ───────────
const reportStore: Record<string, unknown> = {}

// ── MAIN HANDLER ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { name, email, grade, personality, subjects } = await req.json()

    const mbti = calculateMBTI(personality)
    const scoredSubjects = scoreSubjects(subjects.filter((s: { name: string; marks: number }) => s.name && s.marks > 0), mbti)
    const stream = detectStream(scoredSubjects)
    const avgScore = parseFloat((scoredSubjects.reduce((a: number, b: { score: number }) => a + b.score, 0) / scoredSubjects.length).toFixed(1))
    const topSubjectCombo = scoredSubjects.slice(0, 3).map((s: { name: string }) => s.name)
    const comboScore = parseFloat((scoredSubjects.slice(0, 3).reduce((a: number, b: { score: number }) => a + b.score, 0) / 3).toFixed(1))

    // Personality multipliers for radar
    const { T, S } = {
      T: (personality['tf_1'] === 'T' ? 1 : 0) + (personality['tf_2'] === 'T' ? 1 : 0) + (personality['tf_3'] === 'T' ? 1 : 0) + (personality['tf_4'] === 'T' ? 1 : 0),
      S: (personality['sn_1'] === 'S' ? 1 : 0) + (personality['sn_2'] === 'S' ? 1 : 0) + (personality['sn_3'] === 'S' ? 1 : 0) + (personality['sn_4'] === 'S' ? 1 : 0)
    }
    const analyticalMult = parseFloat((1.0 + (T / 4) * 0.4).toFixed(1))
    const creativeMult = parseFloat((1.0 + ((4 - T) / 4) * 0.4).toFixed(1))
    const practicalMult = parseFloat((1.0 + (S / 4) * 0.4).toFixed(1))
    const socialMult = parseFloat((1.0 + ((4 - S) / 4) * 0.3).toFixed(1))

    // Build prompt for Claude
    const prompt = `You are CASPA — a career intelligence system. Generate a comprehensive career analysis for this student.

STUDENT DATA:
Name: ${name}
Grade: ${grade}
MBTI Type: ${mbti}
Stream: ${stream}
Scored Subjects: ${JSON.stringify(scoredSubjects)}
Average Subject Fit Score: ${avgScore}
Top Subject Combination: ${topSubjectCombo.join(' + ')} = ${comboScore}

Generate a JSON response with EXACTLY this structure (no markdown, pure JSON):
{
  "mbtiTitle": "<MBTI archetype title e.g. 'The Executive'>",
  "mbtiDesc": "<2 sentence description of this MBTI in career context>",
  "personalityInsight": "<1 unique insight about this specific student's profile>",
  "signalDetection": ["<top subject 1>", "<top subject 2>", "<top subject 3>"],
  "topCombination": {
    "subjects": ["<sub1>", "<sub2>", "<sub3>"],
    "score": ${comboScore},
    "label": "THE SAFE TRIPLE (Highest Leverage)",
    "insight": "<why this combination is powerful>"
  },
  "altCombination": {
    "subjects": ["<sub1>", "<sub2>", "<sub3 different>"],
    "score": <number slightly lower>,
    "label": "Strong Alternative Path"
  },
  "safeCareers": [
    {"title": "<career>", "domain": "<2 word domain>", "score": ${avgScore}},
    {"title": "<career>", "domain": "<domain>", "score": ${avgScore}},
    {"title": "<career>", "domain": "<domain>", "score": ${avgScore}},
    {"title": "<career>", "domain": "<domain>", "score": ${avgScore}},
    {"title": "<career>", "domain": "<domain>", "score": ${avgScore}}
  ],
  "balancedCareers": [
    {"title": "<career>", "score": <65-75>, "sector": "<sector type>"},
    {"title": "<career>", "score": <60-70>, "sector": "<sector>"},
    {"title": "<career>", "score": <55-68>, "sector": "<sector>"}
  ],
  "aspirationalCareers": [
    {"title": "<career>", "score": <30-55>},
    {"title": "<career>", "score": <29-50>},
    {"title": "<career>", "score": <25-45>},
    {"title": "<career>", "score": <20-40>}
  ],
  "totalPaths": 26,
  "classification": "Superior Alignment",
  "risks": [
    {"title": "Financial Planning", "desc": "<specific risk for this profile>"},
    {"title": "Competition Density", "desc": "<specific risk>"},
    {"title": "Academic Readiness", "desc": "<specific risk>"}
  ],
  "unresolvedVariables": ["<pending decision 1>", "<pending decision 2>"],
  "degreePathways": {
    "professional": {"primary": "<e.g. Chartered Accountancy (CA)>", "alt": "<e.g. CMA / CS>"},
    "academic": {"primary": "<e.g. B.Com Hons>", "alt": "<e.g. Economics B.A>"},
    "institutions": ["<target institution 1>", "<target institution 2>"],
    "insight": "<optimal path insight>"
  },
  "executionTimeline": {
    "immediate": ["<action 1>", "<action 2>"],
    "shortTerm": ["<action 1>", "<action 2>", "<action 3>"],
    "mediumTerm": ["<action 1>", "<action 2>", "<action 3>"],
    "longTerm": ["<action 1>", "<action 2>"]
  },
  "limitations": [
    "Detailed college cost breakdowns.",
    "Exact year-over-year cut-offs.",
    "Step-by-step preparation drills.",
    "Specific scholarship opportunities.",
    "Granular subject-wise improvement strategies."
  ],
  "summaryStatement": "<2 sentence strategic summary of this student's profile and recommended trajectory>"
}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const aiData = await response.json()
    let aiReport: Record<string, unknown> = {}

    try {
      const raw = aiData.content?.[0]?.text || '{}'
      const clean = raw.replace(/```json|```/g, '').trim()
      aiReport = JSON.parse(clean)
    } catch {
      aiReport = { mbtiTitle: 'The Analyst', summaryStatement: 'Profile analysis complete.' }
    }

    const reportId = genReportId()
    const report = {
      reportId,
      name, email, grade, mbti, stream,
      avgScore, comboScore, topSubjectCombo,
      scoredSubjects,
      personalityMultipliers: { analytical: analyticalMult, creative: creativeMult, practical: practicalMult, social: socialMult },
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase(),
      ...aiReport
    }

    reportStore[reportId] = report
    return NextResponse.json({ reportId, report })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id || !reportStore[id]) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 })
  }
  return NextResponse.json(reportStore[id])
}
