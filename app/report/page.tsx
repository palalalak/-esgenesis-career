'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { runCASPA, type CASPAResult, type AssessmentInput, type PersonalityAnswers } from '@/lib/caspa'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Cell, Tooltip,
  ScatterChart, Scatter, CartesianGrid
} from 'recharts'

const NAVY = '#1a2744'
const GREEN = '#10b981'
const MUTED = '#6b7280'
const BG = '#f0f4f8'

// Demo data for sample report (matches Madhav's report)
const DEMO_INPUT: AssessmentInput = {
  name: 'Madhav Pandey', age: '16', city: 'Lucknow', currentClass: 'Class 10',
  aspirations: 'Finance and business',
  subjects: [
    { name: 'Economics', marks: 88, interest: 5 },
    { name: 'Accountancy', marks: 82, interest: 4 },
    { name: 'Mathematics', marks: 78, interest: 4 },
    { name: 'Data Science', marks: 70, interest: 3 },
    { name: 'Business Studies', marks: 74, interest: 3 },
  ],
  personality: {
    ei1:'E',ei2:'E',ei3:'E',ei4:'I',
    sn1:'S',sn2:'S',sn3:'S',sn4:'N',
    tf1:'T',tf2:'T',tf3:'T',tf4:'F',
    jp1:'J',jp2:'J',jp3:'J',jp4:'J',
  } as PersonalityAnswers,
}

function ReportContent() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'
  const [result, setResult] = useState<CASPAResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [narrative, setNarrative] = useState<Record<string, string>>({})
  const [printMode, setPrintMode] = useState(false)

  useEffect(() => {
    const input = isDemo ? DEMO_INPUT : (() => {
      try { return JSON.parse(localStorage.getItem('caspa_input') || '') } catch { return DEMO_INPUT }
    })()
    const computed = runCASPA(input)
    setResult(computed)
    setLoading(false)
    // Fetch AI narrative
    generateNarrative(computed)
  }, [isDemo])

  const generateNarrative = async (r: CASPAResult) => {
    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: r }),
      })
      const data = await res.json()
      if (data.narrative) setNarrative(data.narrative)
    } catch {
      // fallback: use default texts
    }
  }

  if (loading || !result) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 48, height: 48, border: '4px solid #10b981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: MUTED }}>Generating your report...</p>
    </div>
  )

  const safe = result.careerPaths.filter(c => c.tier === 'Safe' && c.fitScore >= 70).slice(0, 5)
  const balanced = result.careerPaths.filter(c => c.tier === 'Balanced' && c.fitScore >= 50).slice(0, 5)
  const aspirational = result.careerPaths.filter(c => c.tier === 'Aspirational').slice(0, 8)

  const radarData = [
    { axis: 'Practical', value: result.personalityProfile.weights.practical },
    { axis: 'Analytical', value: result.personalityProfile.weights.analytical },
    { axis: 'Social', value: result.personalityProfile.weights.social },
    { axis: 'Creative', value: result.personalityProfile.weights.creative },
  ]

  const barData = result.scoredSubjects.slice(0, 6).map(s => ({
    name: s.name, score: s.weightedScore, classification: s.classification
  }))

  const scatterData = [
    ...balanced.map(c => ({ name: c.title, fitScore: c.fitScore, sectorScore: 70 + Math.random() * 15, tier: 'Balanced' })),
    ...aspirational.slice(0, 6).map(c => ({ name: c.title, fitScore: c.fitScore, sectorScore: 20 + Math.random() * 45, tier: 'Aspirational' })),
  ]

  const S = { // shared styles
    page: { background: 'white', borderRadius: 12, padding: '48px 56px', marginBottom: 24, boxShadow: '0 1px 4px rgba(26,39,68,0.08)' } as React.CSSProperties,
    title: { fontSize: '1.75rem', fontWeight: 800, color: NAVY, marginBottom: 8, fontFamily: 'var(--font-sora)' } as React.CSSProperties,
    divider: { height: 2, background: NAVY, opacity: 0.12, margin: '0 0 32px' } as React.CSSProperties,
    label: { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: MUTED },
    greenBig: { fontSize: '3rem', fontWeight: 900, color: GREEN, fontFamily: 'var(--font-sora)', lineHeight: 1 },
    navyBig: { fontSize: '3rem', fontWeight: 900, color: NAVY, fontFamily: 'var(--font-sora)', lineHeight: 1 },
    card: { border: '1px solid #e5e7eb', borderRadius: 10, padding: '20px 24px' } as React.CSSProperties,
    insightBox: { border: `1.5px solid ${GREEN}`, borderRadius: 8, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(16,185,129,0.04)' } as React.CSSProperties,
  }

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      {/* Fixed nav */}
      <nav style={{ background: NAVY, padding: '0 48px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 24, height: 24, background: GREEN, borderRadius: 4 }}/>
          <span style={{ color: 'white', fontFamily: 'var(--font-sora)', fontWeight: 700 }}>EsGenesis<span style={{ color: GREEN }}>.Career</span></span>
        </a>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => window.print()} style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: 6, fontSize: '0.8rem', cursor: 'pointer' }}>Print / PDF</button>
          <a href="/assessment" style={{ background: GREEN, color: 'white', border: 'none', padding: '6px 16px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>New Assessment</a>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '32px auto', padding: '0 24px' }}>

        {/* ===== SLIDE 1: COVER ===== */}
        <div style={{ ...S.page, background: BG, border: '2px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(26,39,68,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(26,39,68,0.025) 1px, transparent 1px)', backgroundSize: '40px 40px' }}/>
          <div style={{ position: 'relative' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" style={{ marginBottom: 40 }}>
              <rect x="2" y="24" width="10" height="14" fill={NAVY}/>
              <rect x="15" y="14" width="10" height="24" fill={NAVY}/>
              <rect x="28" y="4" width="10" height="34" fill={NAVY}/>
            </svg>
            <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(2.5rem,5vw,3.25rem)', fontWeight: 900, color: NAVY, lineHeight: 1.1, marginBottom: 16 }}>
              Strategic Career<br />Analysis & Roadmap
            </h1>
            <p style={{ fontSize: '1.1rem', color: MUTED, marginBottom: 8 }}>Prepared for {result.studentName} | {result.stream} & Analytics Pathway</p>
            <div style={{ width: 80, height: 2, background: NAVY, opacity: 0.2, margin: '24px 0' }}/>
            <p style={{ color: MUTED, fontSize: '0.9rem', maxWidth: 500 }}>An evaluation of human capital assets, subject performance data, and market alignment for the {result.stream} Stream.</p>
            <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(26,39,68,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: MUTED, letterSpacing: '0.05em' }}>REPORT ID: {result.reportId} | DATE: {result.date}</span>
              <div style={{ width: 80, height: 4, background: GREEN, borderRadius: 2 }}/>
            </div>
          </div>
        </div>

        {/* ===== SLIDE 2: EXECUTIVE DASHBOARD ===== */}
        <div style={S.page}>
          <h2 style={S.title}>Executive Dashboard: The Strategic Bottom Line</h2>
          <div style={S.divider}/>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
            {/* Archetype */}
            <div style={{ padding: '28px', borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', border: `2px solid ${NAVY}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={NAVY} strokeWidth="1.5"><path d="M14 3 L14 8 L10 5 Z M6 8 h16 v4 l-3 3 v6 h-10 v-6 l-3-3 z"/><rect x="11" y="21" width="6" height="4"/></svg>
              </div>
              <div>
                <div style={S.label}>ARCHETYPE</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: NAVY, fontFamily: 'var(--font-sora)', marginTop: 4 }}>{result.personalityProfile.type} ({result.personalityProfile.archetype})</div>
                <div style={{ fontSize: '0.875rem', color: MUTED, marginTop: 6, lineHeight: 1.5 }}>{result.personalityProfile.description}</div>
              </div>
            </div>
            {/* Signal Detection */}
            <div style={{ padding: '28px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', border: `2px solid ${NAVY}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={NAVY} strokeWidth="1.5"><circle cx="14" cy="14" r="10"/><circle cx="14" cy="14" r="5"/><circle cx="14" cy="14" r="2" fill={NAVY}/></svg>
              </div>
              <div>
                <div style={S.label}>SIGNAL DETECTION</div>
                <div style={{ fontSize: '0.9rem', color: MUTED, marginTop: 4, marginBottom: 8 }}>High Alignment Detected:</div>
                {result.signalDetection.map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7 L5.5 10.5 L12 3" stroke={GREEN} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: NAVY }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Opportunity Filter */}
            <div style={{ padding: '28px', borderRight: '1px solid #e5e7eb', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', border: `2px solid ${NAVY}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={NAVY} strokeWidth="1.5"><polygon points="4,4 24,4 17,14 17,24 11,24 11,14"/></svg>
              </div>
              <div>
                <div style={S.label}>OPPORTUNITY FILTER</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                  <div>
                    <div style={S.navyBig}>{result.safeCount + result.balancedCount + result.aspirationalCount}</div>
                    <div style={{ fontSize: '0.8rem', color: MUTED }}>Total Paths</div>
                  </div>
                  <span style={{ fontSize: '1.5rem', color: MUTED }}>→</span>
                  <div>
                    <div style={S.greenBig}>{result.safeCount}</div>
                    <div style={{ fontSize: '0.8rem', color: GREEN, fontWeight: 600 }}>High-Fit 'Safe' Careers</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Avg Subject Fit */}
            <div style={{ padding: '28px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', border: `2px solid ${NAVY}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={NAVY} strokeWidth="1.5"><circle cx="14" cy="14" r="11"/><path d="M4 17 Q14 4 24 17" strokeLinecap="round"/></svg>
              </div>
              <div>
                <div style={S.label}>AVERAGE SUBJECT FIT</div>
                <div style={{ ...S.greenBig, marginTop: 8 }}>{result.avgSubjectFit}</div>
                <div style={{ fontSize: '0.8rem', color: MUTED, marginTop: 4 }}>Classification: {result.avgSubjectFit >= 90 ? 'Superior Alignment' : result.avgSubjectFit >= 70 ? 'Strong Alignment' : 'Developing Alignment'}</div>
              </div>
            </div>
          </div>
          {/* Bottom insight */}
          <div style={{ marginTop: 24, background: '#f8fafc', borderRadius: 8, padding: '14px 20px' }}>
            <p style={{ fontSize: '0.9rem', color: NAVY }}>
              {narrative.executive || `${result.studentName} possesses strong capability in ${result.signalDetection.slice(0,2).join(' and ')} domains. The data strongly recommends a trajectory toward ${safe[0]?.title || 'high-level analytical'} and related roles.`}
            </p>
          </div>
        </div>

        {/* ===== SLIDE 3: PERSONALITY DNA ===== */}
        <div style={S.page}>
          <h2 style={S.title}>Asset Profile: Personality & Academic DNA</h2>
          <div style={S.divider}/>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: NAVY, marginBottom: 12 }}>Core Traits: {result.personalityProfile.type}</h3>
              <p style={{ color: MUTED, lineHeight: 1.7, marginBottom: 20 }}>{result.personalityProfile.archetype}. {result.personalityProfile.description}</p>
              <div style={S.insightBox}>
                <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="9" cy="9" r="8" stroke={GREEN} strokeWidth="1.5" fill="none"/><path d="M5 9 L7.5 11.5 L13 6" stroke={GREEN} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                <p style={{ fontSize: '0.875rem', color: NAVY, lineHeight: 1.6 }}>
                  <strong>Insight:</strong> {narrative.personality || `You possess a rare balance of ${result.personalityProfile.weights.practical > 1.1 ? 'administrative organization' : 'creative thinking'} and ${result.personalityProfile.weights.analytical > 1.1 ? 'analytical capability' : 'social intelligence'}.`}
                </p>
              </div>
            </div>
            <div>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid strokeDasharray="4 4" stroke="#e5e7eb"/>
                  <PolarAngleAxis dataKey="axis" tick={{ fill: NAVY, fontSize: 12, fontWeight: 600 }}/>
                  <Radar dataKey="value" stroke={NAVY} fill={NAVY} fillOpacity={0.18} strokeWidth={2}/>
                </RadarChart>
              </ResponsiveContainer>
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: MUTED }}>Data points are relative to an average benchmark of 1.0.</p>
            </div>
          </div>
        </div>

        {/* ===== SLIDE 4: SUBJECT INTELLIGENCE ===== */}
        <div style={S.page}>
          <h2 style={S.title}>Subject Intelligence: The Data Core</h2>
          <div style={S.divider}/>
          <div style={{ marginBottom: 8 }}>
            {result.scoredSubjects.slice(0, 6).map((s, i) => (
              <div key={s.name} style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', alignItems: 'center', gap: 16, marginBottom: 4, padding: '14px 0', borderBottom: i < result.scoredSubjects.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: NAVY }}>{s.name}</span>
                <div>
                  <div style={{ height: 24, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, s.weightedScore)}%`, background: i === 0 ? GREEN : NAVY, borderRadius: 4, transition: 'width 1s ease' }}/>
                  </div>
                  {s.classification === 'Superpower Asset' && (
                    <div style={{ fontSize: '0.7rem', color: MUTED, marginTop: 3 }}>Driven by {s.interest}/5 Interest & Personality Multiplier</div>
                  )}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: i === 0 ? GREEN : NAVY, whiteSpace: 'nowrap' }}>{s.weightedScore} ({s.classification})</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, background: '#f8fafc', borderRadius: 8, padding: '14px 20px' }}>
            <p style={{ fontSize: '0.875rem', color: NAVY }}>
              {narrative.subjects || `Your foundation is solid across the board${result.scoredSubjects.some(s => s.classification === 'High Risk') ? ' with some high-risk areas to address.' : ' with zero High Risk subjects.'} ${result.scoredSubjects[0]?.name} (${result.scoredSubjects[0]?.weightedScore}) is a standout outlier, functioning as your primary academic asset.`}
            </p>
          </div>
        </div>

        {/* ===== SLIDE 5: ACADEMIC FORMULA ===== */}
        <div style={S.page}>
          <h2 style={S.title}>Optimizing the Academic Formula</h2>
          <div style={S.divider}/>
          {result.topCombinations.slice(0, 2).map((combo, i) => (
            <div key={i} style={{ ...(i === 0 ? { border: `2px solid ${GREEN}`, borderRadius: 10, padding: '24px', marginBottom: 16 } : { padding: '16px 0', borderTop: '1px solid #f3f4f6' }) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {combo.subjects.map((s, si) => (
                    <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 48, height: 48, border: `2px solid ${i === 0 ? GREEN : NAVY}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: i === 0 ? GREEN : NAVY, textAlign: 'center', lineHeight: 1.1 }}>{s.slice(0,4)}</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: i === 0 ? NAVY : MUTED }}>{s}</span>
                      </div>
                      {si < combo.subjects.length - 1 && <span style={{ fontSize: '1.25rem', color: MUTED, marginBottom: 16 }}>+</span>}
                    </span>
                  ))}
                  <span style={{ fontSize: '1.25rem', color: MUTED, marginBottom: 16 }}>=</span>
                  <div style={{ ...(i === 0 ? { border: `2px solid ${GREEN}`, borderRadius: 8, padding: '12px 16px', textAlign: 'center' } : { textAlign: 'center' }) }}>
                    <div style={{ fontSize: i === 0 ? '1.5rem' : '1rem', fontWeight: 900, color: GREEN, fontFamily: 'var(--font-sora)' }}>Fit Score {combo.fitScore}</div>
                    {i === 0 && <div style={{ fontSize: '0.7rem', fontWeight: 700, color: GREEN, letterSpacing: '0.06em' }}>{combo.label}</div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20, background: '#f8fafc', borderRadius: 8, padding: '14px 20px' }}>
            <p style={{ fontSize: '0.875rem', color: NAVY }}>
              {narrative.formula || `Integrating ${result.topCombinations[0]?.subjects[2] || 'your top subjects'} with the ${result.stream} core (${result.topCombinations[0]?.subjects.slice(0,2).join(' & ')}) creates your strongest academic leverage.`}
            </p>
          </div>
        </div>

        {/* ===== SLIDE 6: OPPORTUNITY LANDSCAPE ===== */}
        <div style={S.page}>
          <h2 style={S.title}>The Opportunity Landscape: Risk vs. Fit</h2>
          <div style={S.divider}/>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 0, maxWidth: 440, margin: '0 auto 24px' }}>
            {/* Inverted triangle funnel */}
            <div style={{ width: '100%' }}>
              {[
                { label: 'Aspirational / Stretch', count: result.aspirationalCount, scoreRange: '', examples: aspirational.slice(0, 3).map(c => c.title).join(', '), color: '#94a3b8', width: '100%' },
                { label: 'Balanced', count: result.balancedCount, scoreRange: '', examples: balanced.slice(0, 2).map(c => c.title).join(', '), color: '#64748b', width: '70%' },
                { label: 'SAFE / HIGH FIT', count: result.safeCount, scoreRange: '', examples: '', color: GREEN, width: '40%', isBottom: true },
              ].map((tier, i) => (
                <div key={tier.label} style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{
                    width: tier.width, background: tier.color, padding: i === 2 ? '20px' : '16px',
                    clipPath: i === 0 ? 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)' : i === 1 ? 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)' : 'polygon(0 0, 100% 0, 50% 100%)',
                    textAlign: 'center', marginBottom: -1,
                  }}>
                    <div style={{ fontWeight: 700, color: 'white', fontSize: i === 2 ? '0.9rem' : '0.875rem', letterSpacing: '0.02em' }}>{tier.label}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-sora)', lineHeight: 1 }}>{tier.count}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Paths</div>
                    {tier.examples && <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>{tier.examples}</div>}
                    {tier.isBottom && <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.9)', fontWeight: 700, marginTop: 4 }}>Strategic Focus Area</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 8, padding: '14px 20px' }}>
            <p style={{ fontSize: '0.875rem', color: NAVY }}>
              We identified {result.safeCount + result.balancedCount + result.aspirationalCount} potential paths. The strategy is to secure the 'Safe' zone first, where natural aptitude ensures the highest probability of success.
            </p>
          </div>
        </div>

        {/* ===== SLIDE 7: HIGH-FIT CAREERS ===== */}
        <div style={S.page}>
          <h2 style={S.title}>High-Fit Opportunities: The 'Safe' Zone</h2>
          <div style={S.divider}/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
            {safe.map(c => (
              <div key={c.title} style={S.card}>
                <div style={{ fontWeight: 800, color: NAVY, fontFamily: 'var(--font-sora)', marginBottom: 6, lineHeight: 1.3 }}>{c.title}</div>
                <div style={{ fontSize: '0.8rem', color: MUTED, marginBottom: 12, lineHeight: 1.5 }}>{c.domain}</div>
                <div style={{ fontSize: '0.75rem', color: MUTED, marginBottom: 4 }}>Score</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: GREEN, fontFamily: 'var(--font-sora)' }}>{c.fitScore}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
            <p style={{ fontSize: '0.875rem', color: MUTED }}>
              {narrative.safeCareers || `These are not just jobs; these are careers where the ${result.personalityProfile.type} personality type and ${result.stream} proficiency converge perfectly.`}
            </p>
          </div>
        </div>

        {/* ===== SLIDE 8: EXPANSION TARGETS ===== */}
        <div style={S.page}>
          <h2 style={S.title}>Expansion Targets: Balanced & Aspirational</h2>
          <div style={S.divider}/>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6"/>
                  <XAxis dataKey="fitScore" type="number" name="Fit Score" domain={[0,100]} label={{ value: 'Fit Score (Low to High)', position: 'insideBottom', offset: -5, fontSize: 11, fill: MUTED }}/>
                  <YAxis dataKey="sectorScore" type="number" name="Sector" domain={[0,100]} label={{ value: 'Sector Type', angle: -90, position: 'insideLeft', fontSize: 11, fill: MUTED }}/>
                  <Tooltip content={({ active, payload }) => active && payload?.[0] ? <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 6, padding: '8px 12px', fontSize: '0.8rem' }}><strong>{(payload[0].payload as {name: string}).name}</strong><br/>Score: {(payload[0].payload as {fitScore: number}).fitScore}</div> : null}/>
                  <Scatter data={scatterData.filter(d => d.tier === 'Balanced')} fill={GREEN} r={10}/>
                  <Scatter data={scatterData.filter(d => d.tier === 'Aspirational')} fill={NAVY} r={8} fillOpacity={0.7}/>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div style={{ maxWidth: 220 }}>
              <p style={{ fontSize: '0.875rem', color: MUTED, lineHeight: 1.7 }}>
                {narrative.expansion || `While ${result.stream} is "Home Turf", your ${result.personalityProfile.type} profile allows for pivots into adjacent domains as you build expertise.`}
              </p>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: GREEN }}/>
                  <span style={{ fontSize: '0.8rem', color: MUTED }}>Balanced</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: NAVY }}/>
                  <span style={{ fontSize: '0.8rem', color: MUTED }}>Aspirational</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SLIDE 9: EDUCATIONAL BRIDGE ===== */}
        <div style={S.page}>
          <h2 style={S.title}>The Educational Bridge: Degree Pathways</h2>
          <div style={S.divider}/>
          {result.educationPathways.map((pathway, i) => (
            <div key={i} style={{ marginBottom: 32 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: NAVY, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>{pathway.type}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: MUTED, flexShrink: 0 }}/>
                <div style={{ flex: 1, height: 2, background: '#d1d5db' }}/>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: MUTED, flexShrink: 0 }}/>
                <div style={{ flex: 1, height: 2, background: '#d1d5db' }}/>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: MUTED, flexShrink: 0 }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <div style={{ border: '1.5px solid #d1d5db', borderRadius: 6, padding: '10px 16px', fontSize: '0.875rem', fontWeight: 600, color: NAVY, maxWidth: '45%' }}>{pathway.primary}</div>
                <div style={{ border: '1.5px solid #d1d5db', borderRadius: 6, padding: '10px 16px', fontSize: '0.875rem', fontWeight: 600, color: MUTED, maxWidth: '45%' }}>Alt: {pathway.alternative}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 16, borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', color: MUTED, marginBottom: 8 }}>TARGET INSTITUTIONS</div>
            <p style={{ fontSize: '0.875rem', color: MUTED }}>• Primary Targets: Government Universities (e.g., SRCC, Delhi University, IIMs)</p>
            <p style={{ fontSize: '0.875rem', color: MUTED }}>• Secondary Targets: Recognized Private Institutions</p>
          </div>
        </div>

        {/* ===== SLIDE 10: RISKS ===== */}
        <div style={S.page}>
          <h2 style={S.title}>Critical Analysis: Risks & Realities</h2>
          <div style={S.divider}/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 24 }}>
            {result.risks.map(risk => (
              <div key={risk.title} style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: `1.5px solid ${NAVY}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={NAVY} strokeWidth="1.5"><path d="M11 3 L20 19 H2 Z"/><line x1="11" y1="10" x2="11" y2="14"/><circle cx="11" cy="17" r="1" fill={NAVY}/></svg>
                </div>
                <div style={{ fontWeight: 700, color: NAVY, marginBottom: 8 }}>{risk.title}</div>
                <p style={{ fontSize: '0.85rem', color: MUTED, lineHeight: 1.6 }}>{risk.description}</p>
              </div>
            ))}
          </div>
          <div style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '16px 20px' }}>
            <div style={{ fontWeight: 600, color: NAVY, marginBottom: 10 }}>Unresolved Variables</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 16, height: 16, border: '1.5px solid #d1d5db', borderRadius: 3, flexShrink: 0, marginTop: 2 }}/>
              <span style={{ fontSize: '0.875rem', color: MUTED }}>Pending Decision: Specialization Selection — confirm primary stream focus.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ width: 16, height: 16, border: '1.5px solid #d1d5db', borderRadius: 3, flexShrink: 0, marginTop: 2 }}/>
              <span style={{ fontSize: '0.875rem', color: MUTED }}>Pending Decision: Backup Plan formulation for 'Safe' path rejection scenarios.</span>
            </div>
          </div>
        </div>

        {/* ===== SLIDE 11: EXECUTION STRATEGY ===== */}
        <div style={S.page}>
          <h2 style={S.title}>Execution Strategy: T-Minus 12 Months</h2>
          <div style={S.divider}/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {result.actionPlan.map((phase, i) => (
              <div key={phase.phase} style={{ borderRight: i < result.actionPlan.length - 1 ? '1.5px dashed #e5e7eb' : 'none', paddingRight: i < result.actionPlan.length - 1 ? 24 : 0, paddingLeft: i > 0 ? 24 : 0 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: NAVY, letterSpacing: '0.07em', marginBottom: 4 }}>{phase.phase}</div>
                <div style={{ fontSize: '0.75rem', color: MUTED, marginBottom: 16, fontWeight: 500 }}>{phase.timeframe}</div>
                {phase.actions.map(action => (
                  <div key={action} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: '0.825rem', color: NAVY, lineHeight: 1.4, marginBottom: 4 }}>{action}</div>
                    <div style={{ height: 3, background: i === result.actionPlan.length - 1 ? GREEN : NAVY, borderRadius: 2, width: '80%' }}/>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ===== SLIDE 12: SCOPE & LIMITATIONS ===== */}
        <div style={S.page}>
          <h2 style={S.title}>Scope & Limitations</h2>
          <div style={S.divider}/>
          <p style={{ fontSize: '1rem', color: NAVY, lineHeight: 1.8, marginBottom: 24 }}>This report is directional. The granular details — specifically costs and exact cut-offs — represent the next layer of data required for your operational plan.</p>
          {['Detailed college cost breakdowns.', 'Exact year-over-year cut-offs.', 'Step-by-step preparation drills.', 'Specific scholarship opportunities.', 'Granular subject-wise improvement strategies.'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f9fafb' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid #d1d5db', flexShrink: 0 }}/>
              <span style={{ fontSize: '0.95rem', color: MUTED }}>{item}</span>
            </div>
          ))}
        </div>

        {/* ===== SLIDE 13: CTA / CLOSING ===== */}
        <div style={{ ...S.page, background: '#f8fafc', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '2rem', fontWeight: 900, color: NAVY, lineHeight: 1.2, marginBottom: 16 }}>Your Journey<br />Begins Now.</h2>
            <p style={{ color: MUTED, lineHeight: 1.7, marginBottom: 24 }}>We have identified the destination and the vehicle. The next step is driving the route.</p>
            <div style={{ border: `2px solid ${NAVY}`, borderRadius: 8, padding: '16px 24px', display: 'inline-block', cursor: 'pointer' }}>
              <div style={{ fontWeight: 800, color: NAVY, textAlign: 'center', fontFamily: 'var(--font-sora)' }}>Schedule the Deep-Dive<br />Counselling Session</div>
            </div>
            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: '0.875rem', color: MUTED }}>Palak Pandey</p>
              <p style={{ fontSize: '0.875rem', color: MUTED }}>CASPA Intelligence</p>
              <p style={{ fontSize: '0.875rem', color: NAVY, fontWeight: 600 }}>palakpandey.esg@outlook.com</p>
            </div>
          </div>
          <div style={{ background: NAVY, borderRadius: 10, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="4" y="44" width="20" height="32" fill="rgba(255,255,255,0.15)" rx="2"/>
              <rect x="30" y="28" width="20" height="48" fill="rgba(255,255,255,0.25)" rx="2"/>
              <rect x="56" y="12" width="20" height="64" fill={GREEN} rx="2"/>
            </svg>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', padding: '32px 0 48px' }}>
          <p style={{ color: MUTED, marginBottom: 16, fontSize: '0.875rem' }}>Want the full deep-dive session?</p>
          <a href="mailto:palakpandey.esg@outlook.com" style={{ background: NAVY, color: 'white', padding: '12px 32px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontFamily: 'var(--font-sora)', fontSize: '0.95rem' }}>
            Email for Detailed Counselling →
          </a>
        </div>

      </div>

      <style>{`
        @media print {
          nav { display: none !important; }
          body { background: white !important; }
          .report-slide, [style*="border-radius: 12px"] { box-shadow: none !important; margin-bottom: 0 !important; page-break-after: always; }
        }
      `}</style>
    </div>
  )
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p>Loading...</p></div>}>
      <ReportContent />
    </Suspense>
  )
}
