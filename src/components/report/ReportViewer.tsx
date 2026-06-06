'use client'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ScatterChart, Scatter, XAxis as SX, YAxis as SY, ZAxis, Tooltip as ST
} from 'recharts'

// ── TYPES ─────────────────────────────────────────────────────────────────
interface Report {
  reportId: string; name: string; grade: string; date: string; mbti: string; stream: string;
  mbtiTitle: string; mbtiDesc: string; personalityInsight: string;
  signalDetection: string[]; avgScore: number; totalPaths: number; classification: string;
  scoredSubjects: { name: string; score: number; label: string }[];
  personalityMultipliers: { analytical: number; creative: number; practical: number; social: number };
  topCombination: { subjects: string[]; score: number; label: string; insight: string };
  altCombination: { subjects: string[]; score: number; label: string };
  safeCareers: { title: string; domain: string; score: number }[];
  balancedCareers: { title: string; score: number; sector: string }[];
  aspirationalCareers: { title: string; score: number }[];
  risks: { title: string; desc: string }[];
  unresolvedVariables: string[];
  degreePathways: { professional: { primary: string; alt: string }; academic: { primary: string; alt: string }; institutions: string[]; insight: string };
  executionTimeline: { immediate: string[]; shortTerm: string[]; mediumTerm: string[]; longTerm: string[] };
  limitations: string[];
  summaryStatement: string;
}

// ── COLORS ────────────────────────────────────────────────────────────────
const C = {
  navy: '#0D1B35', navy2: '#1B2D4F', green: '#10B981', greenDark: '#059669',
  slate: '#F8FAFC', gray: '#64748B', border: '#E2E8F0', lightGreen: '#F0FDF4'
}

// ── SHARED SLIDE WRAPPER ─────────────────────────────────────────────────
function Slide({ children, bg }: { children: React.ReactNode; bg?: string }) {
  return (
    <div className="report-slide" style={{ background: bg || 'white' }}>
      {children}
      <div style={{ position: 'absolute', bottom: 16, right: 24, opacity: 0.35, display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ display: 'flex', gap: '2px' }}>
          {[14, 10, 7].map((h, i) => (
            <div key={i} style={{ width: 4, height: h, background: C.navy, borderRadius: 1, alignSelf: 'flex-end' }} />
          ))}
        </div>
        <span style={{ fontSize: '0.6rem', color: C.navy, fontWeight: 600, letterSpacing: '0.05em' }}>EsGenesis.Career</span>
      </div>
    </div>
  )
}

// ── SLIDE 1: COVER ───────────────────────────────────────────────────────
function SlideCover({ r }: { r: Report }) {
  return (
    <Slide bg={C.slate}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 24 }}>
        <div style={{ display: 'flex', gap: '3px', marginBottom: 40 }}>
          {[28, 20, 14].map((h, i) => (
            <div key={i} style={{ width: 8, height: h, background: i === 0 ? C.green : C.navy, borderRadius: 2, alignSelf: 'flex-end' }} />
          ))}
        </div>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', fontWeight: 800, color: C.navy, lineHeight: 1.1, marginBottom: 20 }}>
          Strategic Career<br />Analysis & Roadmap
        </h1>
        <p style={{ color: C.gray, fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', marginBottom: 8 }}>
          Prepared for <strong style={{ color: C.navy }}>{r.name}</strong> | {r.stream} & Analytics Pathway
        </p>
        <div style={{ width: 160, height: 1.5, background: C.navy, margin: '20px 0 28px' }} />
        <p style={{ color: C.gray, fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)', maxWidth: 400, lineHeight: 1.6 }}>
          An evaluation of human capital assets, subject performance data,<br />and market alignment for the {r.stream} Stream.
        </p>
        <div style={{ marginTop: 40, color: C.gray, fontSize: '0.65rem', letterSpacing: '0.08em', fontWeight: 600 }}>
          REPORT ID: {r.reportId} | DATE: {r.date}
        </div>
      </div>
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '35%', background: 'linear-gradient(135deg, #E8F4FD 0%, #EEF2F7 100%)' }}>
        <div style={{ position: 'absolute', bottom: 8, right: 8, width: 6, height: 40, background: C.green, borderRadius: 2 }} />
      </div>
    </Slide>
  )
}

// ── SLIDE 2: EXECUTIVE DASHBOARD ─────────────────────────────────────────
function SlideExecutive({ r }: { r: Report }) {
  const boxes = [
    { label: 'ARCHETYPE', icon: '♜', main: r.mbti, sub: r.mbtiTitle, desc: r.mbtiDesc?.split('.').slice(0, 2).join('. ') + '.' },
    { label: 'SIGNAL DETECTION', icon: '◎', main: 'High Alignment:', subs: r.signalDetection },
    { label: 'OPPORTUNITY FILTER', icon: '⬡', main: `${r.totalPaths} → 5`, mainGreen: true, desc: `Total Paths → High-Fit 'Safe' Careers` },
    { label: 'AVERAGE SUBJECT FIT', icon: '⊙', mainBig: r.avgScore, sub: r.classification, green: true }
  ]
  return (
    <Slide>
      <h2 className="slide-title">Executive Dashboard: The Strategic Bottom Line</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 16, height: 'calc(100% - 80px)' }}>
        {boxes.map((b, i) => (
          <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', border: `1.5px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{b.icon}</div>
            <div style={{ flex: 1 }}>
              <p className="label-sm" style={{ marginBottom: 4 }}>{b.label}</p>
              {b.mainBig !== undefined ? (
                <>
                  <div className="score-big">{b.mainBig}</div>
                  <p style={{ fontSize: '0.75rem', color: C.gray }}>{b.sub}</p>
                </>
              ) : b.subs ? (
                <>
                  <p style={{ fontWeight: 700, color: C.navy, fontSize: '0.9rem', marginBottom: 6 }}>{b.main}</p>
                  {b.subs.map(s => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ color: C.green, fontSize: '0.85rem' }}>✓</span>
                      <span style={{ fontSize: '0.85rem', color: C.navy }}>{s}</span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <p className="font-display" style={{ fontSize: b.mainGreen ? 'clamp(1.2rem, 2.5vw, 1.8rem)' : 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 800, color: b.mainGreen ? C.green : C.navy }}>{b.main}</p>
                  {b.sub && <p style={{ fontSize: '0.75rem', color: C.green, fontWeight: 700 }}>{b.sub}</p>}
                  {b.desc && <p style={{ fontSize: '0.75rem', color: C.gray, marginTop: 4, lineHeight: 1.5 }}>{b.desc}</p>}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 24, left: 64, right: 80, padding: '10px 16px', background: C.slate, borderRadius: 6, fontSize: '0.78rem', color: C.gray }}>
        {r.summaryStatement}
      </div>
    </Slide>
  )
}

// ── SLIDE 3: PERSONALITY RADAR ───────────────────────────────────────────
function SlidePersonality({ r }: { r: Report }) {
  const m = r.personalityMultipliers
  const radarData = [
    { axis: 'Practical', val: m.practical },
    { axis: 'Analytical', val: m.analytical },
    { axis: 'Social', val: m.social },
    { axis: 'Creative', val: m.creative }
  ]
  const highDim = radarData.reduce((a, b) => a.val > b.val ? a : b)

  return (
    <Slide>
      <h2 className="slide-title">Asset Profile: Personality & Academic DNA</h2>
      <div style={{ display: 'flex', gap: 32, height: 'calc(100% - 80px)', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 800, color: C.navy, fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', marginBottom: 12 }}>Core Traits: {r.mbti}</p>
          <p style={{ color: C.gray, fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 20 }}>
            The {r.mbtiTitle}. {r.mbtiDesc}
          </p>
          <div className="insight-box">
            <span style={{ color: C.green, fontSize: '1.1rem', flexShrink: 0 }}>⊙</span>
            <p style={{ fontSize: '0.85rem', color: C.navy }}><strong>Insight:</strong> {r.personalityInsight}</p>
          </div>
        </div>
        <div style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: '0.75rem', color: C.gray }}>↑ {highDim.val}x High Leverage</span>
            <span style={{ color: C.green, fontSize: '0.8rem', fontWeight: 700 }}>{highDim.axis}</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={C.border} />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: C.navy, fontWeight: 600 }} />
              <Radar dataKey="val" stroke={C.navy} fill={C.navy} fillOpacity={0.3} dot={{ r: 3, fill: C.navy }} />
            </RadarChart>
          </ResponsiveContainer>
          <p style={{ fontSize: '0.65rem', color: C.gray, marginTop: 4 }}>Data points are relative to an average benchmark of 1.0x.</p>
        </div>
      </div>
    </Slide>
  )
}

// ── SLIDE 4: SUBJECT INTELLIGENCE ────────────────────────────────────────
function SlideSubjects({ r }: { r: Report }) {
  const top = r.scoredSubjects.slice(0, 4)
  const max = Math.max(...top.map(s => s.score)) * 1.05

  return (
    <Slide>
      <h2 className="slide-title">Subject Intelligence: The Data Core</h2>
      <div style={{ height: 'calc(100% - 100px)', paddingRight: 120, paddingTop: 8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={top} layout="vertical" barSize={28}>
            <XAxis type="number" domain={[0, max]} hide />
            <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 13, fill: C.navy, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} label={{ position: 'right', formatter: (v: number, entry: { payload?: { label: string } }) => `${v}  (${entry?.payload?.label || ''})`, fontSize: 11, fill: C.gray }}>
              {top.map((s, i) => <Cell key={i} fill={i === 0 ? C.green : C.navy} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ position: 'absolute', bottom: 24, left: 64, right: 80 }}>
        {top[0] && <p style={{ fontSize: '0.8rem', color: C.gray }}>Your foundation is solid. <strong style={{ color: C.navy }}>{top[0].name} ({top[0].score})</strong> is a standout outlier, functioning as your primary academic asset.</p>}
      </div>
      {top[0] && (
        <div style={{ position: 'absolute', top: 80, right: 16, maxWidth: 100, fontSize: '0.65rem', color: C.gray, lineHeight: 1.5 }}>
          Driven by {top[0].score >= 100 ? '5/5' : '4/5'} Interest & {top[0].label}
        </div>
      )}
    </Slide>
  )
}

// ── SLIDE 5: ACADEMIC FORMULA ────────────────────────────────────────────
function SlideFormula({ r }: { r: Report }) {
  const { topCombination: top, altCombination: alt } = r
  return (
    <Slide>
      <h2 className="slide-title">Optimizing the Academic Formula</h2>
      <div style={{ height: 'calc(100% - 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32 }}>
        {/* Primary combo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {top.subjects.map((subj, i) => (
            <div key={subj} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', border: `2px solid ${C.navy}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
                  {['📈', '📋', 'π'][i] || '📚'}
                </div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: C.navy, marginTop: 6 }}>{subj}</p>
              </div>
              {i < top.subjects.length - 1 && <span style={{ fontSize: '1.5rem', color: C.navy, fontWeight: 300 }}>+</span>}
            </div>
          ))}
          <span style={{ fontSize: '1.5rem', color: C.navy, fontWeight: 300 }}>=</span>
          <div style={{ border: `2.5px solid ${C.green}`, borderRadius: 10, padding: '14px 22px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: C.green, letterSpacing: '0.08em', marginBottom: 4 }}>FIT SCORE</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: C.green }}>{top.score}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: C.navy, marginTop: 4 }}>{top.label}</div>
          </div>
        </div>

        {/* Alt combo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
          {alt.subjects.map((subj, i) => (
            <span key={subj} style={{ color: C.gray, fontSize: '0.9rem', fontWeight: 600 }}>
              {subj}{i < alt.subjects.length - 1 ? ' +' : ''}
            </span>
          ))}
          <span style={{ color: C.gray }}>=</span>
          <span style={{ color: C.gray, fontWeight: 700 }}>Fit Score {alt.score}</span>
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
          <p style={{ fontSize: '0.82rem', color: C.gray, lineHeight: 1.6 }}>{top.insight}</p>
        </div>
      </div>
    </Slide>
  )
}

// ── SLIDE 6: OPPORTUNITY FUNNEL ───────────────────────────────────────────
function SlideOpportunity({ r }: { r: Report }) {
  const tiers = [
    { label: 'Aspirational / Stretch', paths: r.aspirationalCareers.length, range: `${Math.min(...r.aspirationalCareers.map(c => c.score)).toFixed(1)} – ${Math.max(...r.aspirationalCareers.map(c => c.score)).toFixed(1)}`, examples: r.aspirationalCareers.slice(0, 2).map(c => c.title).join(', '), bg: '#F8FAFC', size: 180 },
    { label: 'Balanced', paths: r.balancedCareers.length, range: `${Math.min(...r.balancedCareers.map(c => c.score)).toFixed(1)} – ${Math.max(...r.balancedCareers.map(c => c.score)).toFixed(1)}`, examples: r.balancedCareers.slice(0, 2).map(c => c.title).join(', '), bg: '#EDF2F7', size: 130 },
    { label: 'SAFE / HIGH FIT', paths: 5, range: r.avgScore.toString(), examples: 'Strategic Focus Area', bg: C.green, size: 80, isBottom: true }
  ]

  return (
    <Slide>
      <h2 className="slide-title">The Opportunity Landscape: Risk vs. Fit</h2>
      <div style={{ display: 'flex', gap: 40, height: 'calc(100% - 80px)', alignItems: 'center' }}>
        {/* Funnel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {tiers.map((tier, i) => (
            <div key={tier.label} style={{
              width: `${100 - i * 22}%`, padding: '14px 20px', textAlign: 'center',
              background: tier.bg, borderRadius: i === 0 ? '6px 6px 0 0' : i === 2 ? '0 0 6px 6px' : 0,
              clipPath: i === 0 ? 'polygon(5% 0, 95% 0, 88% 100%, 12% 100%)' : i === 1 ? 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)' : undefined
            }}>
              <p style={{ fontWeight: 800, fontSize: '0.85rem', color: tier.isBottom ? 'white' : C.navy, marginBottom: 4 }}>{tier.label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', fontWeight: 800, color: tier.isBottom ? 'white' : C.navy }}>{tier.paths} Paths</p>
              <p style={{ fontSize: '0.7rem', color: tier.isBottom ? 'rgba(255,255,255,0.8)' : C.gray }}>Score {tier.range}</p>
              <p style={{ fontSize: '0.68rem', color: tier.isBottom ? 'rgba(255,255,255,0.9)' : C.gray, marginTop: 2, fontStyle: tier.isBottom ? 'normal' : 'italic' }}>{tier.examples}</p>
            </div>
          ))}
        </div>

        {/* Annotation */}
        <div style={{ maxWidth: 220, padding: '20px', background: C.slate, borderRadius: 10, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: '0.82rem', color: C.gray, lineHeight: 1.7 }}>
            We identified <strong style={{ color: C.navy }}>{r.totalPaths} potential paths.</strong> The strategy is to secure the 'Safe' zone first, where natural aptitude ensures the highest probability of success.
          </p>
        </div>
      </div>
    </Slide>
  )
}

// ── SLIDE 7: SAFE CAREERS ────────────────────────────────────────────────
function SlideSafeCareers({ r }: { r: Report }) {
  return (
    <Slide>
      <h2 className="slide-title">High-Fit Opportunities: The 'Safe' Zone</h2>
      <div style={{ display: 'flex', gap: 12, height: 'calc(100% - 100px)', alignItems: 'stretch' }}>
        {r.safeCareers.slice(0, 5).map(c => (
          <div key={c.title} className="card-outline" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontWeight: 800, color: C.navy, fontSize: 'clamp(0.75rem, 1.2vw, 0.95rem)', lineHeight: 1.3, marginBottom: 8 }}>{c.title}</p>
              <p style={{ fontSize: '0.75rem', color: C.gray, lineHeight: 1.5 }}>{c.domain}</p>
            </div>
            <div>
              <p className="label-sm" style={{ marginBottom: 4 }}>Score</p>
              <p className="score-green" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', fontWeight: 800 }}>{c.score}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontSize: '0.78rem', color: C.gray }}>These are not just jobs; these are careers where the <strong>{r.mbti}</strong> personality type and {r.stream}/Math proficiency converge perfectly.</p>
      </div>
    </Slide>
  )
}

// ── SLIDE 8: BALANCED & ASPIRATIONAL ────────────────────────────────────
function SlideExpansion({ r }: { r: Report }) {
  const scatterData = [
    ...r.balancedCareers.map(c => ({ name: c.title, x: c.score, y: 65 + Math.random() * 25, z: 800, type: 'balanced' })),
    ...r.aspirationalCareers.map(c => ({ name: c.title, x: c.score, y: 15 + Math.random() * 35, z: 600, type: 'aspirational' }))
  ]

  return (
    <Slide>
      <h2 className="slide-title">Expansion Targets: Balanced & Aspirational</h2>
      <div style={{ display: 'flex', gap: 24, height: 'calc(100% - 80px)', alignItems: 'center' }}>
        <div style={{ flex: 2 }}>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
              <SX type="number" domain={[0, 100]} label={{ value: 'Fit Score (Low to High)', position: 'bottom', fontSize: 10, fill: C.gray }} tick={{ fontSize: 9 }} />
              <SY type="number" domain={[0, 100]} label={{ value: 'Sector Type', angle: -90, position: 'left', fontSize: 10, fill: C.gray }} tick={{ fontSize: 9 }} />
              <ZAxis range={[300, 800]} />
              <ST content={({ payload }) => {
                if (!payload?.length) return null
                const d = payload[0].payload
                return <div style={{ background: 'white', border: `1px solid ${C.border}`, padding: '6px 10px', borderRadius: 6, fontSize: '0.75rem' }}><strong>{d.name}</strong><br />Score: {d.x.toFixed(1)}</div>
              }} />
              <Scatter data={scatterData.filter(d => d.type === 'balanced')} fill={C.green} opacity={0.85} />
              <Scatter data={scatterData.filter(d => d.type === 'aspirational')} fill={C.navy} opacity={0.65} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, fontSize: '0.8rem', color: C.gray, lineHeight: 1.8 }}>
          <p>While {r.stream} is <em>"Home Turf"</em>, your profile allows for pivots into Management Consulting or Tech.</p>
          <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: C.green }} /><span>Balanced</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: C.navy }} /><span>Aspirational</span></div>
          </div>
        </div>
      </div>
    </Slide>
  )
}

// ── SLIDE 9: DEGREE PATHWAYS ─────────────────────────────────────────────
function SlideDegree({ r }: { r: Report }) {
  const dp = r.degreePathways
  return (
    <Slide>
      <h2 className="slide-title">The Educational Bridge: Degree Pathways</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: 'calc(100% - 80px)', justifyContent: 'center' }}>
        {[
          { label: 'PROFESSIONAL CERTIFICATION', primary: dp.professional.primary, alt: dp.professional.alt },
          { label: 'ACADEMIC DEGREE (Concurrent)', primary: dp.academic.primary, alt: dp.academic.alt }
        ].map(track => (
          <div key={track.label}>
            <p className="label-sm" style={{ marginBottom: 10 }}>{track.label}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.gray, flexShrink: 0 }} />
              <div style={{ flex: 1, height: 2, background: C.border }} />
              <div style={{ border: `1.5px solid ${C.navy}`, borderRadius: 6, padding: '8px 18px', background: 'white', whiteSpace: 'nowrap', fontSize: '0.85rem', fontWeight: 600, color: C.navy }}>{track.primary}</div>
              <div style={{ flex: 1, height: 2, background: C.border }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.gray, flexShrink: 0 }} />
              <div style={{ flex: 1, height: 2, background: C.border }} />
              <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 6, padding: '8px 18px', background: C.slate, whiteSpace: 'nowrap', fontSize: '0.85rem', color: C.gray }}>Alt: {track.alt}</div>
            </div>
          </div>
        ))}

        <div>
          <p style={{ fontWeight: 700, color: C.navy, fontSize: '0.85rem', marginBottom: 8 }}>Target Institutions</p>
          {dp.institutions.map(inst => (
            <div key={inst} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
              <span style={{ color: C.gray }}>•</span>
              <span style={{ fontSize: '0.82rem', color: C.gray }}>{inst}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
          <p style={{ fontSize: '0.82rem', color: C.gray }}>{dp.insight}</p>
        </div>
      </div>
    </Slide>
  )
}

// ── SLIDE 10: RISKS ──────────────────────────────────────────────────────
function SlideRisks({ r }: { r: Report }) {
  return (
    <Slide>
      <h2 className="slide-title">Critical Analysis: Risks & Realities</h2>
      <div style={{ display: 'flex', gap: 20, height: 'calc(100% - 140px)', marginBottom: 20 }}>
        {r.risks.map(risk => (
          <div key={risk.title} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, borderRight: `1px solid ${C.border}`, paddingRight: 20, ':last-child': { borderRight: 'none' } as React.CSSProperties }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', border: `1.5px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>⚠</div>
            <p style={{ fontWeight: 700, color: C.navy, fontSize: '0.9rem' }}>{risk.title}</p>
            <p style={{ fontSize: '0.82rem', color: C.gray, lineHeight: 1.7 }}>{risk.desc}</p>
          </div>
        ))}
      </div>
      {r.unresolvedVariables.length > 0 && (
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px 20px' }}>
          <p style={{ fontWeight: 700, color: C.navy, marginBottom: 10, fontSize: '0.9rem' }}>Unresolved Variables</p>
          {r.unresolvedVariables.map(v => (
            <div key={v} style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
              <span style={{ color: C.gray, fontSize: '0.8rem' }}>☐</span>
              <span style={{ fontSize: '0.8rem', color: C.gray, fontFamily: 'monospace' }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </Slide>
  )
}

// ── SLIDE 11: TIMELINE ───────────────────────────────────────────────────
function SlideTimeline({ r }: { r: Report }) {
  const tl = r.executionTimeline
  const cols = [
    { label: 'IMMEDIATE', sub: '2 Weeks', items: tl.immediate },
    { label: 'SHORT TERM', sub: '1-3 Mo', items: tl.shortTerm },
    { label: 'MEDIUM TERM', sub: '3-6 Mo', items: tl.mediumTerm },
    { label: 'LONG TERM', sub: '6-12 Mo', items: tl.longTerm }
  ]
  return (
    <Slide>
      <h2 className="slide-title">Execution Strategy: T-Minus 12 Months</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, height: 'calc(100% - 80px)', paddingTop: 8 }}>
        {cols.map((col, ci) => (
          <div key={col.label} style={{ borderLeft: `2px solid ${ci === cols.length - 1 ? C.green : C.border}`, paddingLeft: 14 }}>
            <p style={{ fontWeight: 800, fontSize: '0.75rem', color: C.navy, marginBottom: 2 }}>{col.label}</p>
            <p style={{ fontSize: '0.65rem', color: C.gray, marginBottom: 16 }}>({col.sub})</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {col.items.map((item, ii) => (
                <div key={item}>
                  <p style={{ fontSize: '0.8rem', color: C.navy, marginBottom: 5 }}>{item}</p>
                  <div style={{ height: 3, width: '80%', background: ii === col.items.length - 1 && ci >= cols.length - 2 ? C.green : C.navy, borderRadius: 2 }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Slide>
  )
}

// ── SLIDE 12: SCOPE ──────────────────────────────────────────────────────
function SlideScope({ r }: { r: Report }) {
  return (
    <Slide>
      <h2 className="slide-title">Scope & Limitations</h2>
      <p style={{ color: C.gray, fontSize: '0.95rem', lineHeight: 1.8, marginBottom: 28, maxWidth: 700 }}>
        This report is directional. The granular details—specifically costs and exact cut-offs—represent the next layer of data required for your operational plan.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {r.limitations.map(item => (
          <div key={item} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', border: `1.5px solid ${C.border}`, flexShrink: 0 }} />
            <span style={{ fontSize: '0.9rem', color: C.gray }}>{item}</span>
          </div>
        ))}
      </div>
    </Slide>
  )
}

// ── SLIDE 13: CLOSING CTA ────────────────────────────────────────────────
function SlideClose({ r }: { r: Report }) {
  return (
    <Slide bg={C.slate}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 40 }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: C.navy, lineHeight: 1.15, marginBottom: 16 }}>
            Your Journey<br />Begins Now.
          </h2>
          <p style={{ color: C.gray, fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 28 }}>
            We have identified the destination and the vehicle. The next step is driving the route.
          </p>
          <div style={{ border: `2px solid ${C.navy}`, borderRadius: 8, padding: '14px 24px', display: 'inline-block', maxWidth: 260 }}>
            <p style={{ fontWeight: 800, color: C.navy, fontSize: '0.9rem', textAlign: 'center' }}>Schedule the Deep-Dive<br />Counseling Session</p>
          </div>
          <div style={{ marginTop: 28, fontSize: '0.8rem', color: C.gray, lineHeight: 1.8 }}>
            <p>Palak Pandey</p>
            <p>CASPA Intelligence</p>
            <p>palakpandey.esg@outlook.com</p>
          </div>
        </div>
        <div style={{ flex: 1, background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 80, height: 80, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: C.green, fontSize: '1.8rem', transform: 'rotate(-45deg)' }}>↗</div>
          </div>
        </div>
      </div>
    </Slide>
  )
}

// ── MAIN REPORT VIEWER ────────────────────────────────────────────────────
export default function ReportViewer({ report }: { report: Report }) {
  const [current, setCurrent] = useState(0)
  const slides = [
    { label: 'Cover', component: <SlideCover r={report} /> },
    { label: 'Executive', component: <SlideExecutive r={report} /> },
    { label: 'Personality', component: <SlidePersonality r={report} /> },
    { label: 'Subjects', component: <SlideSubjects r={report} /> },
    { label: 'Formula', component: <SlideFormula r={report} /> },
    { label: 'Landscape', component: <SlideOpportunity r={report} /> },
    { label: 'Safe Zone', component: <SlideSafeCareers r={report} /> },
    { label: 'Expansion', component: <SlideExpansion r={report} /> },
    { label: 'Education', component: <SlideDegree r={report} /> },
    { label: 'Risks', component: <SlideRisks r={report} /> },
    { label: 'Timeline', component: <SlideTimeline r={report} /> },
    { label: 'Scope', component: <SlideScope r={report} /> },
    { label: 'Close', component: <SlideClose r={report} /> },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0D1B35', fontFamily: 'var(--font-body)' }}>
      {/* TOP BAR */}
      <div className="no-print" style={{ background: '#0A1628', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[16, 12, 8].map((h, i) => <div key={i} style={{ width: 5, height: h, background: i === 0 ? '#10B981' : 'white', borderRadius: 1, alignSelf: 'flex-end' }} />)}
          </div>
          <span style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>
            EsGenesis<span style={{ color: '#10B981' }}>.Career</span>
          </span>
          <span style={{ color: '#475569', fontSize: '0.8rem', marginLeft: 8 }}>Report for {report.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => window.print()} style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem' }}>
            ↓ Export PDF
          </button>
        </div>
      </div>

      {/* SLIDE NAVIGATION */}
      <div className="no-print" style={{ background: '#0A1628', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 32px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {slides.map((s, i) => (
          <button key={s.label} onClick={() => setCurrent(i)} style={{
            padding: '6px 14px', borderRadius: 5, border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap',
            background: i === current ? '#10B981' : 'rgba(255,255,255,0.06)',
            color: i === current ? 'white' : '#64748B'
          }}>
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      {/* SLIDE VIEW */}
      <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ width: '100%' }}>
          {slides[current].component}
        </div>

        {/* PREV / NEXT */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
          <button
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            style={{ background: 'rgba(255,255,255,0.08)', color: current === 0 ? '#475569' : 'white', border: 'none', padding: '10px 24px', borderRadius: 6, cursor: current === 0 ? 'default' : 'pointer', fontSize: '0.875rem' }}
          >
            ← Previous
          </button>
          <span style={{ color: '#475569', fontSize: '0.8rem' }}>{current + 1} / {slides.length}</span>
          <button
            onClick={() => setCurrent(Math.min(slides.length - 1, current + 1))}
            disabled={current === slides.length - 1}
            style={{ background: current === slides.length - 1 ? 'rgba(255,255,255,0.04)' : '#10B981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 6, cursor: current === slides.length - 1 ? 'default' : 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* ALL SLIDES FOR PRINT */}
      <div style={{ display: 'none' }} className="print-all">
        {slides.map((s, i) => <div key={i} style={{ marginBottom: 20 }}>{s.component}</div>)}
      </div>
      <style>{`@media print { .no-print { display: none !important; } .print-all { display: block !important; } .report-slide { page-break-after: always; } }`}</style>
    </div>
  )
}
