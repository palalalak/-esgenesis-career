'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ fontFamily: 'var(--font-body)', background: 'var(--slate-50)', minHeight: '100vh' }}>
      
      {/* NAV */}
      <nav style={{ 
        background: 'var(--navy-900)', 
        padding: '18px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '3px' }}>
            {[20, 14, 10].map((h, i) => (
              <div key={i} style={{ width: 6, height: h, background: i === 0 ? 'var(--emerald)' : 'white', borderRadius: 2, alignSelf: 'flex-end' }} />
            ))}
          </div>
          <span style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.01em' }}>
            EsGenesis<span style={{ color: 'var(--emerald)' }}>.Career</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#how" style={{ color: '#94A3B8', fontSize: '0.875rem', textDecoration: 'none' }}>How It Works</a>
          <a href="#framework" style={{ color: '#94A3B8', fontSize: '0.875rem', textDecoration: 'none' }}>Framework</a>
          <Link href="/assessment" style={{
            background: 'var(--emerald)', color: 'white',
            padding: '10px 22px', borderRadius: 6,
            textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600
          }}>Start Assessment</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 60%, #1a3a5c 100%)',
        padding: '100px 48px 80px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* grid bg */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 28 }}>
            <div style={{ width: 7, height: 7, background: 'var(--emerald)', borderRadius: '50%' }} />
            <span style={{ color: 'var(--emerald)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>CASPA Intelligence System · v2.0</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: 'white', lineHeight: 1.1, maxWidth: 720, marginBottom: 20 }}>
            Discover Your Future.<br />
            <span style={{ color: 'var(--emerald)' }}>Backed by Intelligence.</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: 560, lineHeight: 1.7, marginBottom: 40 }}>
            AI-powered career discovery using personality insights, behavioural analysis and strategic career mapping. Built for students at the inflection point.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/assessment" style={{
              background: 'var(--emerald)', color: 'white',
              padding: '16px 36px', borderRadius: 8,
              textDecoration: 'none', fontSize: '1rem', fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: 8
            }}>
              Start Assessment →
            </Link>
            <Link href="/report/sample" style={{
              background: 'transparent', color: 'white',
              border: '1.5px solid rgba(255,255,255,0.25)',
              padding: '16px 36px', borderRadius: 8,
              textDecoration: 'none', fontSize: '1rem', fontWeight: 500
            }}>
              View Sample Report
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 48, marginTop: 64, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {[['200+', 'Students Assessed'], ['13', 'Report Slides'], ['26+', 'Career Paths Mapped']].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--emerald)' }}>{num}</div>
                <div style={{ color: '#64748B', fontSize: '0.85rem', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '80px 48px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: 'var(--emerald)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Process</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, color: 'var(--navy-900)' }}>How It Works</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { step: '01', title: 'Personality Assessment', desc: 'Answer 16 questions mapping your MBTI profile across 4 dimensions.' },
              { step: '02', title: 'Academic Input', desc: 'Enter your subjects, marks, and interest levels for precise scoring.' },
              { step: '03', title: 'CASPA Analysis', desc: 'Our AI engine scores 200+ career paths against your unique profile.' },
              { step: '04', title: 'Strategic Report', desc: '13-page career roadmap with ranked paths, education plan, and timeline.' }
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ padding: '28px 24px', border: '1.5px solid #E2E8F0', borderRadius: 10, position: 'relative' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: '#E2E8F0', marginBottom: 12 }}>{step}</div>
                <div style={{ fontWeight: 700, color: 'var(--navy-900)', marginBottom: 8, fontSize: '0.95rem' }}>{title}</div>
                <div style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FRAMEWORK */}
      <section id="framework" style={{ padding: '80px 48px', background: 'var(--slate-50)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--emerald)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Framework</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--navy-900)', marginBottom: 20 }}>
              The Career Intelligence Framework
            </h2>
            <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 28 }}>
              CASPA combines academic performance data with validated personality profiling to generate a 3-tier opportunity landscape: Safe, Balanced, and Aspirational paths — each scored against your actual profile.
            </p>
            {[
              'MBTI-derived personality scoring (4 dimensions)',
              'Subject performance × interest weighting',
              '2 & 3 subject combination analysis',
              'Stream detection (Science / Commerce / Arts)',
              '200+ mapped careers with fit scores'
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, background: 'var(--emerald)', borderRadius: '50%', flexShrink: 0 }} />
                <span style={{ color: '#475569', fontSize: '0.9rem' }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Mini report preview */}
          <div style={{ background: 'white', borderRadius: 12, padding: '28px', boxShadow: '0 8px 32px rgba(13,27,53,0.10)', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Sample Output</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-900)' }}>Executive Dashboard</div>
              </div>
              <div style={{ background: 'var(--emerald)', color: 'white', borderRadius: 6, padding: '4px 10px', fontSize: '0.7rem', fontWeight: 700 }}>SAFE ZONE</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'ARCHETYPE', value: 'ESTJ', sub: 'The Executive' },
                { label: 'FIT SCORE', value: '97.7', sub: 'Superior Alignment', green: true },
                { label: 'TOTAL PATHS', value: '26', sub: 'Analyzed' },
                { label: 'HIGH-FIT', value: '5', sub: 'Safe Careers', green: true }
              ].map(({ label, value, sub, green }) => (
                <div key={label} style={{ background: 'var(--slate-50)', borderRadius: 8, padding: '14px 16px' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: green ? 'var(--emerald)' : 'var(--navy-900)', lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 4 }}>{sub}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, padding: '12px 16px', background: '#F0FDF4', borderRadius: 8, borderLeft: '3px solid var(--emerald)' }}>
              <span style={{ fontSize: '0.8rem', color: '#065F46' }}>Strong trajectory toward financial and analytical roles detected.</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 48px', background: 'var(--navy-900)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, color: 'white', marginBottom: 16 }}>
            Ready to Discover Your Path?
          </h2>
          <p style={{ color: '#94A3B8', marginBottom: 36, lineHeight: 1.7 }}>
            The assessment takes 10 minutes. The report maps your next 12 months.
          </p>
          <Link href="/assessment" style={{
            background: 'var(--emerald)', color: 'white',
            padding: '18px 44px', borderRadius: 8,
            textDecoration: 'none', fontSize: '1.05rem', fontWeight: 700,
            display: 'inline-block'
          }}>
            Begin Assessment →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0A1628', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-display)', color: 'white', fontWeight: 700 }}>
          EsGenesis<span style={{ color: 'var(--emerald)' }}>.Career</span>
        </span>
        <span style={{ color: '#475569', fontSize: '0.8rem' }}>
          A product by Palak Pandey · palakpandey.esg@outlook.com
        </span>
      </footer>
    </div>
  )
}
