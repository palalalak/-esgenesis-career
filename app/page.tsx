'use client'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen" style={{ background: '#f0f4f8' }}>
      {/* NAV */}
      <nav style={{ background: '#1a2744', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 28, height: 28, background: '#10b981', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><rect x="1" y="9" width="4" height="6"/><rect x="6" y="5" width="4" height="10"/><rect x="11" y="1" width="4" height="14"/></svg>
          </div>
          <span style={{ color: 'white', fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            EsGenesis<span style={{ color: '#10b981' }}>.Career</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#how" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', textDecoration: 'none' }}>How It Works</a>
          <a href="#framework" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', textDecoration: 'none' }}>Framework</a>
          <button onClick={() => router.push('/assessment')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 20px', borderRadius: 6, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
            Start Assessment
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: '#1a2744', padding: '96px 48px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Grid background */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }}/>
        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 24 }}>
            <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>AI-Powered Career Intelligence</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.03em' }}>
            Discover Your Future.<br />
            <span style={{ color: '#10b981' }}>Backed by Intelligence.</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.65)', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.7 }}>
            AI-powered career discovery using personality insights, behavioural analysis and strategic career mapping. Used by 200+ students.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/assessment')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '14px 32px', borderRadius: 8, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sora)' }}>
              Start Assessment →
            </button>
            <button onClick={() => router.push('/report?demo=true')} style={{ background: 'transparent', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)', padding: '14px 32px', borderRadius: 8, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
              View Sample Report
            </button>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: 'white', padding: '28px 48px', display: 'flex', justifyContent: 'center', gap: '64px', flexWrap: 'wrap', borderBottom: '1px solid #e5e7eb' }}>
        {[['200+', 'Students Assessed'], ['42', 'Subjects Mapped'], ['200+', 'Career Paths'], ['4', 'Personality Dimensions']].map(([num, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-sora)' }}>{num}</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '80px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '2rem', fontWeight: 800, color: '#1a2744', marginBottom: 12 }}>How CASPA Works</h2>
          <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>Four intelligent layers working together to map your unique career trajectory.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {[
            { step: '01', title: 'Personality Mapping', desc: 'MBTI-style assessment across 4 dimensions: Energy, Information, Decision, Structure.', icon: '🧠' },
            { step: '02', title: 'Academic Intelligence', desc: 'Your marks and subject interest are weighted against your personality profile.', icon: '📊' },
            { step: '03', title: 'Career Scoring', desc: 'Every career is scored against your subject fit, personality alignment, and market demand.', icon: '🎯' },
            { step: '04', title: 'Strategic Report', desc: 'A premium consulting-grade report with ranked paths, risks, and a 12-month action plan.', icon: '📄' },
          ].map(item => (
            <div key={item.step} style={{ background: 'white', borderRadius: 12, padding: '28px 24px', boxShadow: '0 1px 4px rgba(26,39,68,0.08)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>{item.icon}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', letterSpacing: '0.08em', marginBottom: 8 }}>STEP {item.step}</div>
              <div style={{ fontWeight: 700, color: '#1a2744', marginBottom: 8, fontFamily: 'var(--font-sora)' }}>{item.title}</div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FRAMEWORK */}
      <section id="framework" style={{ background: '#1a2744', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: 12 }}>Career Intelligence Framework</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 500, margin: '0 auto' }}>Three-tier career classification system for strategic decision-making.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { label: 'Safe / High Fit', score: '85–100', color: '#10b981', desc: 'Careers where your personality type and subject proficiency converge. Highest probability of success.' },
              { label: 'Balanced', score: '60–84', color: '#f59e0b', desc: 'Strong alignment with potential to optimize through targeted skill development.' },
              { label: 'Aspirational / Stretch', score: '25–59', color: '#6b7280', desc: 'Interest-driven paths requiring additional capability development. Long-term strategic targets.' },
            ].map(tier => (
              <div key={tier.label} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '28px 24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ width: 40, height: 4, background: tier.color, borderRadius: 2, marginBottom: 16 }}/>
                <div style={{ fontWeight: 700, color: 'white', fontFamily: 'var(--font-sora)', marginBottom: 6 }}>{tier.label}</div>
                <div style={{ fontSize: '0.8rem', color: tier.color, fontWeight: 600, marginBottom: 12 }}>Fit Score {tier.score}</div>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '2rem', fontWeight: 800, color: '#1a2744', marginBottom: 16 }}>Ready to map your future?</h2>
        <p style={{ color: '#6b7280', marginBottom: 32, fontSize: '1rem' }}>15-minute assessment. Comprehensive career intelligence report.</p>
        <button onClick={() => router.push('/assessment')} style={{ background: '#1a2744', color: 'white', border: 'none', padding: '16px 40px', borderRadius: 8, fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sora)' }}>
          Begin Assessment →
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1a2744', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>© 2026 EsGenesis.Career — Palak Pandey · palakpandey.esg@outlook.com</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>Powered by CASPA Intelligence Engine</span>
      </footer>
    </main>
  )
}
