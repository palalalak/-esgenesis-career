'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ReportViewer from '@/components/report/ReportViewer'

export default function ReportPage() {
  const { id } = useParams()
  const [report, setReport] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id || id === 'sample') {
      setReport(getSampleReport())
      setLoading(false)
      return
    }

    // Check sessionStorage first (passed from assessment)
    try {
      const stored = sessionStorage.getItem(`report_${id}`)
      if (stored) {
        setReport(JSON.parse(stored))
        setLoading(false)
        return
      }
    } catch {}

    // Fetch from API
    fetch(`/api/analyze?id=${id}`)
      .then(r => r.json())
      .then(data => { setReport(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--navy-900)', gap: 20 }}>
      <div style={{ width: 48, height: 48, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: 'var(--emerald)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <div style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Generating your Career Intelligence Report…</div>
      <div style={{ color: '#64748B', fontSize: '0.875rem' }}>Analysing 200+ career paths against your profile</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (error || !report) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--navy-900)' }}>Report not found</div>
      <Link href="/assessment" style={{ color: 'var(--emerald)', textDecoration: 'none', fontWeight: 600 }}>Start a new assessment →</Link>
    </div>
  )

  return <ReportViewer report={report} />
}

// ── SAMPLE REPORT ─────────────────────────────────────────────────────────
function getSampleReport() {
  return {
    reportId: 'CASPA-SAMPLE-DEMO01',
    name: 'Madhav Pandey',
    email: 'demo@esgenesis.career',
    grade: 'Class 12',
    mbti: 'ESTJ',
    stream: 'Commerce',
    avgScore: 97.7,
    comboScore: 97.7,
    topSubjectCombo: ['Economics', 'Accountancy', 'Mathematics'],
    date: 'JANUARY 30, 2026',
    mbtiTitle: 'The Executive',
    mbtiDesc: 'Organized, practical, and a natural manager with high administrative capability. Values tradition, order, and clear hierarchy.',
    personalityInsight: 'You possess a rare balance of administrative organization and analytical capability.',
    signalDetection: ['Finance', 'Economics', 'Mathematics'],
    scoredSubjects: [
      { name: 'Economics', marks: 82, interest: 5, score: 107.4, label: 'Superpower Asset', personalityMult: 1.3 },
      { name: 'Accountancy', marks: 85, interest: 4, score: 97.0, label: 'Recommended', personalityMult: 1.2 },
      { name: 'Mathematics', marks: 78, interest: 4, score: 88.7, label: 'Recommended', personalityMult: 1.1 },
      { name: 'Data Science', marks: 72, interest: 3, score: 79.9, label: 'Recommended', personalityMult: 1.0 }
    ],
    personalityMultipliers: { analytical: 1.1, creative: 0.8, practical: 1.3, social: 1.0 },
    topCombination: {
      subjects: ['Economics', 'Accountancy', 'Mathematics'],
      score: 97.7,
      label: 'THE SAFE TRIPLE (Highest Leverage)',
      insight: 'Integrating Mathematics with the Commerce core creates your strongest academic leverage.'
    },
    altCombination: {
      subjects: ['Economics', 'Accountancy', 'Data Science'],
      score: 94.8,
      label: 'Strong Alternative Path'
    },
    safeCareers: [
      { title: 'Chartered Accountant', domain: 'Accounting, Audit, Tax', score: 97.7 },
      { title: 'Investment Banker', domain: 'Corp Finance, Mergers', score: 97.7 },
      { title: 'Financial Analyst', domain: 'Investment Data Analysis', score: 97.7 },
      { title: 'Actuary', domain: 'Financial Risk & Math', score: 97.7 },
      { title: 'Stock Broker', domain: 'Securities Trading', score: 97.7 }
    ],
    balancedCareers: [
      { title: 'Tax Consultant', score: 68.1, sector: 'Finance & Legal' },
      { title: 'Supply Chain Manager', score: 85.4, sector: 'Operations' },
      { title: 'Management Consultant', score: 53.7, sector: 'Strategy' }
    ],
    aspirationalCareers: [
      { title: 'Entrepreneur', score: 35.8 },
      { title: 'Operations Manager', score: 44.4 },
      { title: 'Cybersecurity / Blockchain', score: 44.4 },
      { title: 'Management Consultant', score: 53.7 }
    ],
    totalPaths: 26,
    classification: 'Superior Alignment',
    summaryStatement: 'Madhav possesses a strong capability in analytical and organizational domains. The data strongly recommends a trajectory toward high-level financial and analytical roles.',
    risks: [
      { title: 'Financial Planning', desc: 'Education pathways (especially CA coaching) require robust financial modeling. Scholarship availability must be assessed.' },
      { title: 'Competition Density', desc: 'High density in top commerce colleges (SRCC, etc.) creates a bottleneck. Acceptance rates are <1%.' },
      { title: 'Academic Readiness', desc: 'Gap exists between current readiness and entrance exam requirements. Immediate drill-down on weak areas is required.' }
    ],
    unresolvedVariables: [
      'Pending Decision: Specialization Selection (Pure Econ vs. Accounts focus).',
      'Pending Decision: Backup Plan formulation for \'Safe\' path rejection.'
    ],
    degreePathways: {
      professional: { primary: 'Chartered Accountancy (CA)', alt: 'CMA / CS' },
      academic: { primary: 'Bachelor of Commerce (B.Com Hons)', alt: 'Economics (B.A./B.Sc)' },
      institutions: ['Government Universities (e.g., SRCC, Hindu College)', 'Recognized Private Institutions'],
      insight: 'Your optimal path involves running a Professional Qualification (like CA) alongside a robust Academic Degree.'
    },
    executionTimeline: {
      immediate: ['Review top 10 career options', 'Research 3-5 colleges'],
      shortTerm: ['Open houses / Webinars', 'Connect with professionals', 'Begin Entrance Prep'],
      mediumTerm: ['Exam Registrations', 'Financial Planning', 'Finalize Shortlist'],
      longTerm: ['Admissions', 'Undergraduate Start']
    },
    limitations: [
      'Detailed college cost breakdowns.',
      'Exact year-over-year cut-offs.',
      'Step-by-step preparation drills.',
      'Specific scholarship opportunities.',
      'Granular subject-wise improvement strategies.'
    ]
  }
}
