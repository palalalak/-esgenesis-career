import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { result } = await req.json()
    
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ narrative: {} })
    
    const prompt = `You are CASPA, an AI career counselling engine. Generate short, data-driven narrative texts for each section of a career intelligence report.

Student: ${result.studentName}, ${result.studentAge} years, ${result.studentCity}
Personality: ${result.personalityProfile.type} (${result.personalityProfile.archetype})
Stream: ${result.stream}
Top subjects: ${result.scoredSubjects.slice(0,3).map((s: {name:string;weightedScore:number}) => `${s.name} (${s.weightedScore})`).join(', ')}
Safe careers: ${result.careerPaths.filter((c: {tier:string;fitScore:number}) => c.tier === 'Safe' && c.fitScore >= 70).slice(0,3).map((c: {title:string}) => c.title).join(', ')}
Avg subject fit: ${result.avgSubjectFit}

Return ONLY a JSON object with these keys (1-2 sentences each, professional consulting tone):
{
  "executive": "...",
  "personality": "...",
  "subjects": "...",
  "formula": "...",
  "safeCareers": "...",
  "expansion": "..."
}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    
    const data = await response.json()
    const text = data.content?.[0]?.text || '{}'
    const clean = text.replace(/```json|```/g, '').trim()
    const narrative = JSON.parse(clean)
    
    return NextResponse.json({ narrative })
  } catch {
    return NextResponse.json({ narrative: {} })
  }
}
