'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AssessmentInput, PersonalityAnswers, SubjectInput } from '@/lib/caspa'

const AVAILABLE_SUBJECTS = [
  'Mathematics','Physics','Chemistry','Biology','Economics','Accountancy',
  'Business Studies','Computer Science','Data Science','History','Geography',
  'Political Science','Sociology','Psychology','English','Language',
  'Fine Arts','Music','Physical Education','Legal Studies','Entrepreneurship',
  'Home Science',
]

const PERSONALITY_QUESTIONS: { key: keyof PersonalityAnswers; question: string; optionA: { label: string; value: string }; optionB: { label: string; value: string } }[] = [
  // E/I
  { key: 'ei1', question: 'When working on a task, I prefer to:', optionA: { label: 'Discuss ideas with others as I go', value: 'E' }, optionB: { label: 'Think it through alone first', value: 'I' } },
  { key: 'ei2', question: 'I feel more energised when I:', optionA: { label: 'Interact with people around me', value: 'E' }, optionB: { label: 'Have quiet time to reflect', value: 'I' } },
  { key: 'ei3', question: 'In group situations, I usually:', optionA: { label: 'Speak up and contribute ideas', value: 'E' }, optionB: { label: 'Listen and contribute thoughtfully', value: 'I' } },
  { key: 'ei4', question: 'After a long day, I prefer:', optionA: { label: 'Social plans with friends', value: 'E' }, optionB: { label: 'Time alone to recharge', value: 'I' } },
  // S/N
  { key: 'sn1', question: 'I learn best when information is:', optionA: { label: 'Practical and grounded in facts', value: 'S' }, optionB: { label: 'Conceptual and idea-driven', value: 'N' } },
  { key: 'sn2', question: 'I am more interested in:', optionA: { label: 'What is happening now', value: 'S' }, optionB: { label: 'What could happen in the future', value: 'N' } },
  { key: 'sn3', question: 'When solving problems, I usually:', optionA: { label: 'Apply proven, reliable methods', value: 'S' }, optionB: { label: 'Explore creative new approaches', value: 'N' } },
  { key: 'sn4', question: 'I trust information more when it is:', optionA: { label: 'Based on observable facts', value: 'S' }, optionB: { label: 'Backed by patterns and insights', value: 'N' } },
  // T/F
  { key: 'tf1', question: 'When making decisions, I rely more on:', optionA: { label: 'Logic and objective analysis', value: 'T' }, optionB: { label: 'Values and how people feel', value: 'F' } },
  { key: 'tf2', question: 'In disagreements, I focus more on:', optionA: { label: 'What is logically correct', value: 'T' }, optionB: { label: 'What keeps relationships intact', value: 'F' } },
  { key: 'tf3', question: 'I am more influenced by:', optionA: { label: 'Facts and data', value: 'T' }, optionB: { label: 'Personal stories and values', value: 'F' } },
  { key: 'tf4', question: 'Feedback affects me more when it is:', optionA: { label: 'Honest, even if blunt', value: 'T' }, optionB: { label: 'Delivered with sensitivity', value: 'F' } },
  // J/P
  { key: 'jp1', question: 'I prefer my work to be:', optionA: { label: 'Planned and structured', value: 'J' }, optionB: { label: 'Flexible and open-ended', value: 'P' } },
  { key: 'jp2', question: 'Deadlines:', optionA: { label: 'Help me stay focused', value: 'J' }, optionB: { label: 'Feel unnecessarily restricting', value: 'P' } },
  { key: 'jp3', question: 'I like decisions to be:', optionA: { label: 'Final and resolved', value: 'J' }, optionB: { label: 'Open to change as new info arrives', value: 'P' } },
  { key: 'jp4', question: 'My workspace tends to be:', optionA: { label: 'Tidy and organized', value: 'J' }, optionB: { label: 'Flexible and adaptable', value: 'P' } },
]

const INTEREST_LABELS = ['', 'Not Interested', 'Slightly Interested', 'Neutral', 'Interested', 'Very Interested']

export default function AssessmentPage() {
  const router = useRouter()
  const [step, setStep] = useState(0) // 0=info, 1=subjects, 2=personality, 3=loading
  const [info, setInfo] = useState({ name: '', age: '', city: '', currentClass: '', aspirations: '' })
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [subjectData, setSubjectData] = useState<Record<string, SubjectInput>>({})
  const [personality, setPersonality] = useState<Partial<PersonalityAnswers>>({})
  const [error, setError] = useState('')

  const totalSteps = 3
  const progress = ((step) / totalSteps) * 100

  const toggleSubject = (s: string) => {
    if (selectedSubjects.includes(s)) {
      setSelectedSubjects(prev => prev.filter(x => x !== s))
      const next = { ...subjectData }; delete next[s]; setSubjectData(next)
    } else {
      setSelectedSubjects(prev => [...prev, s])
      setSubjectData(prev => ({ ...prev, [s]: { name: s, marks: 0, interest: 3 } }))
    }
  }

  const setSubjectField = (name: string, field: 'marks' | 'interest', val: number) => {
    setSubjectData(prev => ({ ...prev, [name]: { ...prev[name], [field]: val } }))
  }

  const setPersonalityAnswer = (key: keyof PersonalityAnswers, val: string) => {
    setPersonality(prev => ({ ...prev, [key]: val }))
  }

  const personalityComplete = PERSONALITY_QUESTIONS.every(q => personality[q.key])
  const allAnswered = personalityComplete

  const handleSubmit = async () => {
    if (!allAnswered) { setError('Please answer all personality questions.'); return }
    setStep(3)
    const subjects = Object.values(subjectData)
    const input: AssessmentInput = {
      name: info.name, age: info.age, city: info.city,
      currentClass: info.currentClass, aspirations: info.aspirations,
      subjects,
      personality: personality as PersonalityAnswers,
    }
    localStorage.setItem('caspa_input', JSON.stringify(input))
    router.push('/report')
  }

  const NavBar = () => (
    <nav style={{ background: '#1a2744', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <div style={{ width: 28, height: 28, background: '#10b981', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><rect x="1" y="9" width="4" height="6"/><rect x="6" y="5" width="4" height="10"/><rect x="11" y="1" width="4" height="14"/></svg>
        </div>
        <span style={{ color: 'white', fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1.1rem' }}>EsGenesis<span style={{ color: '#10b981' }}>.Career</span></span>
      </a>
      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Assessment — Step {step + 1} of {totalSteps}</span>
    </nav>
  )

  if (step === 3) return (
    <main>
      <NavBar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', gap: 24 }}>
        <div style={{ width: 64, height: 64, border: '4px solid #10b981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '1.5rem', fontWeight: 700, color: '#1a2744', marginBottom: 8 }}>Generating your Career Intelligence Report</h2>
          <p style={{ color: '#6b7280' }}>Analysing personality, scoring subjects, mapping 200+ career paths...</p>
        </div>
      </div>
    </main>
  )

  return (
    <main>
      <NavBar />
      {/* Progress bar */}
      <div style={{ height: 3, background: '#e5e7eb' }}>
        <div style={{ height: '100%', background: '#10b981', width: `${progress}%`, transition: 'width 0.4s ease' }}/>
      </div>

      <div style={{ maxWidth: 720, margin: '48px auto', padding: '0 24px' }}>

        {/* STEP 0: Personal Info */}
        {step === 0 && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: '1.75rem', fontWeight: 800, color: '#1a2744', marginBottom: 8 }}>About You</h1>
            <p style={{ color: '#6b7280', marginBottom: 36 }}>Let's start with some basic information.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              {[
                { label: 'Full Name', key: 'name', placeholder: 'Your full name' },
                { label: 'Age', key: 'age', placeholder: 'e.g. 16' },
                { label: 'City', key: 'city', placeholder: 'Your city' },
                { label: 'Current Class', key: 'currentClass', placeholder: 'e.g. Class 10, Class 11' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>{field.label}</label>
                  <input
                    value={info[field.key as keyof typeof info]}
                    onChange={e => setInfo(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Career Aspirations (optional)</label>
              <textarea
                value={info.aspirations}
                onChange={e => setInfo(prev => ({ ...prev, aspirations: e.target.value }))}
                placeholder="Any careers you're curious about? Fields that excite you?"
                rows={3}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: '0.95rem', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
            <button
              onClick={() => { if (!info.name) { setError('Please enter your name.'); return; } setError(''); setStep(1) }}
              style={{ background: '#1a2744', color: 'white', border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sora)' }}
            >Continue →</button>
            {error && <p style={{ color: '#ef4444', marginTop: 12, fontSize: '0.875rem' }}>{error}</p>}
          </div>
        )}

        {/* STEP 1: Subjects */}
        {step === 1 && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: '1.75rem', fontWeight: 800, color: '#1a2744', marginBottom: 8 }}>Your Subjects</h1>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>Select the subjects you study. Then tell us your marks and interest level for each.</p>
            
            {/* Subject selector */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 12 }}>Select your subjects:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {AVAILABLE_SUBJECTS.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleSubject(s)}
                    style={{
                      padding: '6px 14px', borderRadius: 100, fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer', border: '1.5px solid',
                      background: selectedSubjects.includes(s) ? '#1a2744' : 'white',
                      color: selectedSubjects.includes(s) ? 'white' : '#374151',
                      borderColor: selectedSubjects.includes(s) ? '#1a2744' : '#d1d5db',
                    }}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Subject details */}
            {selectedSubjects.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 16 }}>Enter marks and interest for each subject:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {selectedSubjects.map(s => (
                    <div key={s} style={{ background: 'white', borderRadius: 10, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 20, alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: '#1a2744', fontSize: '0.95rem' }}>{s}</span>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>Marks (0–100)</label>
                        <input type="number" min={0} max={100}
                          value={subjectData[s]?.marks || ''}
                          onChange={e => setSubjectField(s, 'marks', parseInt(e.target.value) || 0)}
                          style={{ width: 80, padding: '6px 10px', border: '1.5px solid #d1d5db', borderRadius: 6, fontSize: '0.9rem', fontFamily: 'inherit' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: 4 }}>Interest (1–5)</label>
                        <select value={subjectData[s]?.interest || 3} onChange={e => setSubjectField(s, 'interest', parseInt(e.target.value))}
                          style={{ padding: '6px 10px', border: '1.5px solid #d1d5db', borderRadius: 6, fontSize: '0.85rem', background: 'white', fontFamily: 'inherit' }}>
                          {[1,2,3,4,5].map(v => <option key={v} value={v}>{v} — {INTEREST_LABELS[v]}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(0)} style={{ background: 'transparent', color: '#6b7280', border: '1.5px solid #d1d5db', padding: '12px 24px', borderRadius: 8, fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}>← Back</button>
              <button
                onClick={() => { if (selectedSubjects.length < 2) { setError('Please select at least 2 subjects.'); return } setError(''); setStep(2) }}
                style={{ background: '#1a2744', color: 'white', border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sora)' }}
              >Continue →</button>
            </div>
            {error && <p style={{ color: '#ef4444', marginTop: 12, fontSize: '0.875rem' }}>{error}</p>}
          </div>
        )}

        {/* STEP 2: Personality */}
        {step === 2 && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: '1.75rem', fontWeight: 800, color: '#1a2744', marginBottom: 8 }}>Personality Assessment</h1>
            <p style={{ color: '#6b7280', marginBottom: 32 }}>16 questions across 4 dimensions. Choose whichever option feels most natural to you.</p>

            {(['E/I — Energy Style', 'S/N — Information Style', 'T/F — Decision Style', 'J/P — Structure Style'] as const).map((dimLabel, dimIdx) => (
              <div key={dimLabel} style={{ marginBottom: 36 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>{dimLabel}</div>
                {PERSONALITY_QUESTIONS.slice(dimIdx * 4, dimIdx * 4 + 4).map(q => (
                  <div key={q.key} style={{ background: 'white', borderRadius: 10, padding: '20px', marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <p style={{ fontWeight: 600, color: '#1a2744', marginBottom: 14, fontSize: '0.95rem' }}>{q.question}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {[q.optionA, q.optionB].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setPersonalityAnswer(q.key, opt.value)}
                          style={{
                            padding: '10px 16px', borderRadius: 8, fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left', border: '1.5px solid',
                            background: personality[q.key] === opt.value ? '#1a2744' : 'white',
                            color: personality[q.key] === opt.value ? 'white' : '#374151',
                            borderColor: personality[q.key] === opt.value ? '#1a2744' : '#e5e7eb',
                            fontFamily: 'inherit',
                          }}
                        >{opt.label}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(1)} style={{ background: 'transparent', color: '#6b7280', border: '1.5px solid #d1d5db', padding: '12px 24px', borderRadius: 8, fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}>← Back</button>
              <button
                onClick={handleSubmit}
                disabled={!personalityComplete}
                style={{ background: personalityComplete ? '#10b981' : '#d1d5db', color: 'white', border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: '0.95rem', fontWeight: 700, cursor: personalityComplete ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-sora)' }}
              >Generate My Report →</button>
            </div>
            {error && <p style={{ color: '#ef4444', marginTop: 12, fontSize: '0.875rem' }}>{error}</p>}
          </div>
        )}
      </div>
    </main>
  )
}
