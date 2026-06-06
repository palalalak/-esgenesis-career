'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ── TYPES ────────────────────────────────────────────────────────────────────
interface FormData {
  name: string
  email: string
  grade: string
  personality: Record<string, string>
  subjects: { name: string; marks: number; interest: number }[]
}

// ── PERSONALITY QUESTIONS ─────────────────────────────────────────────────────
const personalityQuestions = [
  // E/I
  { id: 'ei_1', dim: 'EI', q: 'When working on a task, I prefer to:', a: ['Discuss it with others as I go', 'Think it through alone first'], val: ['E', 'I'] },
  { id: 'ei_2', dim: 'EI', q: 'I feel more energised when I:', a: ['Interact with groups of people', 'Spend time alone or with one person'], val: ['E', 'I'] },
  { id: 'ei_3', dim: 'EI', q: 'In group situations, I usually:', a: ['Speak up and take charge', 'Observe before contributing'], val: ['E', 'I'] },
  { id: 'ei_4', dim: 'EI', q: 'After a long day, I prefer:', a: ['Social plans with friends', 'Quiet time at home'], val: ['E', 'I'] },
  // S/N
  { id: 'sn_1', dim: 'SN', q: 'I learn best when information is:', a: ['Practical with real-world examples', 'Conceptual with underlying theory'], val: ['S', 'N'] },
  { id: 'sn_2', dim: 'SN', q: 'I am more interested in:', a: ['What is happening now', 'What could happen in the future'], val: ['S', 'N'] },
  { id: 'sn_3', dim: 'SN', q: 'When solving problems, I usually:', a: ['Use proven step-by-step methods', 'Try creative or unconventional approaches'], val: ['S', 'N'] },
  { id: 'sn_4', dim: 'SN', q: 'I trust information more when it is:', a: ['Grounded in hard facts', 'Backed by insight and pattern'], val: ['S', 'N'] },
  // T/F
  { id: 'tf_1', dim: 'TF', q: 'When making decisions, I rely more on:', a: ['Logic and objective analysis', 'Feelings and personal values'], val: ['T', 'F'] },
  { id: 'tf_2', dim: 'TF', q: 'In disagreements, I focus more on:', a: ['What is logically correct', 'How people are feeling'], val: ['T', 'F'] },
  { id: 'tf_3', dim: 'TF', q: 'I am more influenced by:', a: ['Facts and data', 'Stories and emotions'], val: ['T', 'F'] },
  { id: 'tf_4', dim: 'TF', q: 'Feedback affects me more when it is:', a: ['Honest and direct', 'Sensitive and encouraging'], val: ['T', 'F'] },
  // J/P
  { id: 'jp_1', dim: 'JP', q: 'I prefer my work to be:', a: ['Planned and structured', 'Flexible and spontaneous'], val: ['J', 'P'] },
  { id: 'jp_2', dim: 'JP', q: 'Deadlines:', a: ['Help me stay organised', 'Feel restrictive'], val: ['J', 'P'] },
  { id: 'jp_3', dim: 'JP', q: 'I like decisions to be:', a: ['Final — I prefer closure', 'Open — I prefer options'], val: ['J', 'P'] },
  { id: 'jp_4', dim: 'JP', q: 'I would describe myself as:', a: ['Organised and systematic', 'Adaptable and go-with-the-flow'], val: ['J', 'P'] },
]

const SUBJECT_LIST = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'Economics', 'Accountancy', 'Business Studies', 'History', 'Geography',
  'Political Science', 'Psychology', 'Sociology', 'Fine Arts', 'Physical Education',
  'Data Science', 'Entrepreneurship', 'English', 'Hindi', 'French'
]

// ── STEP COMPONENTS ─────────────────────────────────────────────────────────
function NavBar() {
  return (
    <nav style={{ background: 'var(--navy-900)', padding: '16px 48px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ display: 'flex', gap: '3px' }}>
        {[20, 14, 10].map((h, i) => (
          <div key={i} style={{ width: 6, height: h, background: i === 0 ? 'var(--emerald)' : 'white', borderRadius: 2, alignSelf: 'flex-end' }} />
        ))}
      </div>
      <span style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
        EsGenesis<span style={{ color: 'var(--emerald)' }}>.Career</span>
      </span>
    </nav>
  )
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div style={{ background: 'white', padding: '16px 48px', borderBottom: '1px solid #E2E8F0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Step {step} of {total}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--emerald)', fontWeight: 700 }}>{pct}% complete</span>
        </div>
        <div style={{ height: 4, background: '#E2E8F0', borderRadius: 2 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--emerald)', borderRadius: 2, transition: 'width 0.4s ease' }} />
        </div>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Assessment() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', grade: '',
    personality: {},
    subjects: [{ name: 'Mathematics', marks: 0, interest: 3 }]
  })

  const totalSteps = 4

  // ── STEP 1: PROFILE ──────────────────────────────────────────────────────
  const Step1 = () => (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: 8 }}>
        Your Profile
      </h2>
      <p style={{ color: '#64748B', marginBottom: 36 }}>Basic information to personalise your report.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-900)' }}>Full Name *</span>
          <input
            type="text"
            placeholder="e.g. Arjun Sharma"
            value={formData.name}
            onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
            style={{ padding: '12px 16px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: '1rem', outline: 'none', fontFamily: 'var(--font-body)' }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-900)' }}>Email Address *</span>
          <input
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
            style={{ padding: '12px 16px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: '1rem', outline: 'none', fontFamily: 'var(--font-body)' }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-900)' }}>Current Grade / Class *</span>
          <select
            value={formData.grade}
            onChange={e => setFormData(f => ({ ...f, grade: e.target.value }))}
            style={{ padding: '12px 16px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: '1rem', outline: 'none', fontFamily: 'var(--font-body)', background: 'white' }}
          >
            <option value="">Select grade...</option>
            {['Class 9', 'Class 10', 'Class 11', 'Class 12', 'Post 12th', 'Other'].map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>
      </div>

      <button
        onClick={() => formData.name && formData.email && formData.grade && setStep(2)}
        style={{ marginTop: 36, background: 'var(--navy-900)', color: 'white', padding: '14px 32px', borderRadius: 8, border: 'none', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}
      >
        Continue →
      </button>
    </div>
  )

  // ── STEP 2: PERSONALITY ──────────────────────────────────────────────────
  const Step2 = () => (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: 8 }}>
        Personality Assessment
      </h2>
      <p style={{ color: '#64748B', marginBottom: 36 }}>16 questions. Choose the answer that feels most natural.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {personalityQuestions.map((q, i) => (
          <div key={q.id} style={{ padding: '20px 24px', border: `1.5px solid ${formData.personality[q.id] ? 'var(--emerald)' : '#E2E8F0'}`, borderRadius: 10, background: formData.personality[q.id] ? '#F0FDF4' : 'white' }}>
            <p style={{ fontWeight: 600, color: 'var(--navy-900)', marginBottom: 14, fontSize: '0.95rem' }}>
              <span style={{ color: '#94A3B8', marginRight: 8, fontSize: '0.85rem' }}>{i + 1}.</span>
              {q.q}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.a.map((ans, ai) => (
                <label key={ans} style={{
                  display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                  padding: '10px 14px', borderRadius: 8,
                  background: formData.personality[q.id] === q.val[ai] ? 'var(--navy-900)' : 'var(--slate-50)',
                  transition: 'all 0.15s'
                }}>
                  <input
                    type="radio"
                    name={q.id}
                    checked={formData.personality[q.id] === q.val[ai]}
                    onChange={() => setFormData(f => ({ ...f, personality: { ...f.personality, [q.id]: q.val[ai] } }))}
                    style={{ accentColor: 'var(--emerald)' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: formData.personality[q.id] === q.val[ai] ? 'white' : 'var(--navy-900)', fontWeight: formData.personality[q.id] === q.val[ai] ? 600 : 400 }}>{ans}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
        <button onClick={() => setStep(1)} style={{ background: 'white', color: 'var(--navy-900)', border: '1.5px solid #E2E8F0', padding: '14px 28px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
        <button
          onClick={() => Object.keys(formData.personality).length >= 16 && setStep(3)}
          style={{ background: 'var(--navy-900)', color: 'white', padding: '14px 32px', borderRadius: 8, border: 'none', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}
        >
          Continue ({Object.keys(formData.personality).length}/16) →
        </button>
      </div>
    </div>
  )

  // ── STEP 3: SUBJECTS ────────────────────────────────────────────────────
  const Step3 = () => {
    const addSubject = () => {
      if (formData.subjects.length < 6)
        setFormData(f => ({ ...f, subjects: [...f.subjects, { name: '', marks: 0, interest: 3 }] }))
    }
    const removeSubject = (i: number) => setFormData(f => ({ ...f, subjects: f.subjects.filter((_, idx) => idx !== i) }))
    const updateSubject = (i: number, field: string, val: string | number) => {
      const s = [...formData.subjects]
      s[i] = { ...s[i], [field]: val }
      setFormData(f => ({ ...f, subjects: s }))
    }

    return (
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: 8 }}>Academic Profile</h2>
        <p style={{ color: '#64748B', marginBottom: 36 }}>Add your subjects. Enter marks out of 100 and rate your interest (1–5).</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {formData.subjects.map((subj, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {i === 0 && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</span>}
                <select
                  value={subj.name}
                  onChange={e => updateSubject(i, 'name', e.target.value)}
                  style={{ padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: '0.9rem', outline: 'none', background: 'white', fontFamily: 'var(--font-body)' }}
                >
                  <option value="">Select subject…</option>
                  {SUBJECT_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {i === 0 && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Marks /100</span>}
                <input
                  type="number" min={0} max={100}
                  value={subj.marks || ''}
                  onChange={e => updateSubject(i, 'marks', Number(e.target.value))}
                  style={{ padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-body)' }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {i === 0 && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interest (1–5)</span>}
                <select
                  value={subj.interest}
                  onChange={e => updateSubject(i, 'interest', Number(e.target.value))}
                  style={{ padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: '0.9rem', outline: 'none', background: 'white', fontFamily: 'var(--font-body)' }}
                >
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {['– Low', '– Below Avg', '– Average', '– High', '– Passionate'][n - 1]}</option>)}
                </select>
              </label>
              <button
                onClick={() => removeSubject(i)}
                style={{ padding: '11px 14px', border: '1.5px solid #FEE2E2', borderRadius: 8, background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
              >✕</button>
            </div>
          ))}
        </div>

        {formData.subjects.length < 6 && (
          <button onClick={addSubject} style={{ marginTop: 16, background: 'white', border: '1.5px dashed #CBD5E1', color: '#64748B', padding: '12px 20px', borderRadius: 8, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
            + Add Subject
          </button>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
          <button onClick={() => setStep(2)} style={{ background: 'white', color: 'var(--navy-900)', border: '1.5px solid #E2E8F0', padding: '14px 28px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
          <button
            onClick={() => formData.subjects.filter(s => s.name && s.marks > 0).length >= 2 && setStep(4)}
            style={{ background: 'var(--navy-900)', color: 'white', padding: '14px 32px', borderRadius: 8, border: 'none', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Review & Generate →
          </button>
        </div>
        <p style={{ marginTop: 10, color: '#94A3B8', fontSize: '0.8rem' }}>Minimum 2 subjects with marks required.</p>
      </div>
    )
  }

  // ── STEP 4: CONFIRM + SUBMIT ─────────────────────────────────────────────
  const Step4 = () => {
    const validSubjects = formData.subjects.filter(s => s.name && s.marks > 0)

    const handleSubmit = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        const data = await res.json()
        if (data.reportId) {
          try { sessionStorage.setItem(`report_${data.reportId}`, JSON.stringify(data.report)) } catch {}
          router.push(`/report/${data.reportId}`)
        }
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }

    return (
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: 8 }}>
          Review & Generate
        </h2>
        <p style={{ color: '#64748B', marginBottom: 36 }}>Confirm your information before we generate your report.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: '20px 24px', border: '1.5px solid #E2E8F0', borderRadius: 10 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Profile</div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--navy-900)' }}>{formData.name}</div>
            <div style={{ color: '#64748B', fontSize: '0.875rem' }}>{formData.email} · {formData.grade}</div>
          </div>

          <div style={{ padding: '20px 24px', border: '1.5px solid #E2E8F0', borderRadius: 10 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Personality Responses</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['EI', 'SN', 'TF', 'JP'].map(dim => {
                const qs = personalityQuestions.filter(q => q.dim === dim)
                const score = qs.reduce((acc, q) => acc + (formData.personality[q.id] === q.val[0] ? 1 : 0), 0)
                const type = score >= 2 ? qs[0].val[0] : qs[0].val[1]
                return (
                  <div key={dim} style={{ background: 'var(--navy-900)', color: 'white', borderRadius: 6, padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700 }}>
                    {dim}: <span style={{ color: 'var(--emerald)' }}>{type}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ padding: '20px 24px', border: '1.5px solid #E2E8F0', borderRadius: 10 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Subjects</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {validSubjects.map(s => (
                <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: 'var(--navy-900)', fontSize: '0.9rem' }}>{s.name}</span>
                  <span style={{ color: '#64748B', fontSize: '0.85rem' }}>{s.marks}/100 · Interest {s.interest}/5</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
          <button onClick={() => setStep(3)} style={{ background: 'white', color: 'var(--navy-900)', border: '1.5px solid #E2E8F0', padding: '14px 28px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: loading ? '#94A3B8' : 'var(--emerald)', color: 'white',
              padding: '14px 40px', borderRadius: 8, border: 'none', fontSize: '1rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 10
            }}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Analysing your profile…
              </>
            ) : 'Generate My Report →'}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const steps = [null, <Step1 key={1} />, <Step2 key={2} />, <Step3 key={3} />, <Step4 key={4} />]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)' }}>
      <NavBar />
      <ProgressBar step={step} total={totalSteps} />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
        {/* Step labels */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
          {['Profile', 'Personality', 'Academics', 'Generate'].map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700,
                background: step > i + 1 ? 'var(--emerald)' : step === i + 1 ? 'var(--navy-900)' : '#E2E8F0',
                color: step >= i + 1 ? 'white' : '#94A3B8'
              }}>{step > i + 1 ? '✓' : i + 1}</div>
              <span style={{ fontSize: '0.8rem', fontWeight: step === i + 1 ? 700 : 400, color: step === i + 1 ? 'var(--navy-900)' : '#94A3B8' }}>{label}</span>
              {i < 3 && <div style={{ width: 20, height: 1, background: '#E2E8F0', marginLeft: 4 }} />}
            </div>
          ))}
        </div>

        {steps[step]}
      </div>
    </div>
  )
}
