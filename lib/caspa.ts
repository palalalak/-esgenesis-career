// ============================================================
// CASPA SCORING ENGINE — EsGenesis.Career
// Original logic from n8n workflow, ported to TypeScript
// ============================================================

export interface SubjectInput {
  name: string;
  marks: number;       // 0-100
  interest: number;    // 1-5
}

export interface PersonalityAnswers {
  // E/I dimension (4 questions)
  ei1: 'E' | 'I'; ei2: 'E' | 'I'; ei3: 'E' | 'I'; ei4: 'E' | 'I';
  // S/N dimension
  sn1: 'S' | 'N'; sn2: 'S' | 'N'; sn3: 'S' | 'N'; sn4: 'S' | 'N';
  // T/F dimension
  tf1: 'T' | 'F'; tf2: 'T' | 'F'; tf3: 'T' | 'F'; tf4: 'T' | 'F';
  // J/P dimension
  jp1: 'J' | 'P'; jp2: 'J' | 'P'; jp3: 'J' | 'P'; jp4: 'J' | 'P';
}

export interface AssessmentInput {
  name: string;
  age: string;
  city: string;
  currentClass: string;
  subjects: SubjectInput[];
  personality: PersonalityAnswers;
  aspirations?: string;
}

export type MBTIType = string; // e.g. "ESTJ"

export interface PersonalityProfile {
  type: MBTIType;
  archetype: string;
  description: string;
  weights: { practical: number; analytical: number; creative: number; social: number };
}

export interface ScoredSubject {
  name: string;
  marks: number;
  interest: number;
  rawScore: number;
  weightedScore: number;
  classification: 'Superpower Asset' | 'Recommended' | 'Developing' | 'High Risk';
}

export interface CareerPath {
  title: string;
  domain: string;
  description: string;
  fitScore: number;
  tier: 'Safe' | 'Balanced' | 'Aspirational';
  subjects: string[];
}

export interface SubjectCombination {
  subjects: string[];
  fitScore: number;
  label: string;
  tier: 'Safe' | 'Balanced' | 'Aspirational';
}

export interface CASPAResult {
  studentName: string;
  studentAge: string;
  studentCity: string;
  reportId: string;
  date: string;
  stream: 'Science' | 'Commerce' | 'Arts' | 'Mixed';
  personalityProfile: PersonalityProfile;
  scoredSubjects: ScoredSubject[];
  avgSubjectFit: number;
  topCombinations: SubjectCombination[];
  careerPaths: CareerPath[];
  safeCount: number;
  balancedCount: number;
  aspirationalCount: number;
  signalDetection: string[];
  risks: { title: string; description: string }[];
  educationPathways: { type: string; primary: string; alternative: string }[];
  actionPlan: { phase: string; timeframe: string; actions: string[] }[];
}

// ============================================================
// PERSONALITY ENGINE
// ============================================================

function calcMBTI(p: PersonalityAnswers): MBTIType {
  const E = [p.ei1, p.ei2, p.ei3, p.ei4].filter(x => x === 'E').length >= 2 ? 'E' : 'I';
  const S = [p.sn1, p.sn2, p.sn3, p.sn4].filter(x => x === 'S').length >= 2 ? 'S' : 'N';
  const T = [p.tf1, p.tf2, p.tf3, p.tf4].filter(x => x === 'T').length >= 2 ? 'T' : 'F';
  const J = [p.jp1, p.jp2, p.jp3, p.jp4].filter(x => x === 'J').length >= 2 ? 'J' : 'P';
  return `${E}${S}${T}${J}`;
}

const PERSONALITY_MAP: Record<string, Omit<PersonalityProfile, 'type'>> = {
  ESTJ: { archetype: 'The Executive', description: 'Organized, practical, natural manager. High administrative capability.', weights: { practical: 1.3, analytical: 1.1, creative: 0.8, social: 1.0 } },
  ENTJ: { archetype: 'The Commander', description: 'Strategic, decisive, natural leader with strong systems thinking.', weights: { practical: 1.2, analytical: 1.3, creative: 0.9, social: 1.0 } },
  INTJ: { archetype: 'The Architect', description: 'Visionary strategist. Independent, analytical, high precision.', weights: { practical: 1.1, analytical: 1.4, creative: 1.0, social: 0.8 } },
  INTP: { archetype: 'The Logician', description: 'Innovative thinker. Driven by logic and theoretical frameworks.', weights: { practical: 0.9, analytical: 1.4, creative: 1.1, social: 0.7 } },
  ENTP: { archetype: 'The Debater', description: 'Quick-thinking, entrepreneurial. Thrives on intellectual challenge.', weights: { practical: 1.0, analytical: 1.2, creative: 1.2, social: 1.0 } },
  ENFJ: { archetype: 'The Protagonist', description: 'Natural leader with strong communication and empathy.', weights: { practical: 1.0, analytical: 0.9, creative: 1.1, social: 1.3 } },
  INFJ: { archetype: 'The Advocate', description: 'Insightful, principled, creative problem-solver.', weights: { practical: 0.9, analytical: 1.0, creative: 1.2, social: 1.1 } },
  ISFJ: { archetype: 'The Defender', description: 'Dedicated, meticulous, strong in supportive and service roles.', weights: { practical: 1.2, analytical: 1.0, creative: 0.9, social: 1.1 } },
  ISTJ: { archetype: 'The Inspector', description: 'Reliable, thorough, systematic. Excellent in structured environments.', weights: { practical: 1.3, analytical: 1.1, creative: 0.8, social: 0.9 } },
  ESFJ: { archetype: 'The Consul', description: 'Caring, social, organized. Excellent in team and community roles.', weights: { practical: 1.1, analytical: 0.8, creative: 0.9, social: 1.3 } },
  ESTP: { archetype: 'The Entrepreneur', description: 'Bold, perceptive, action-oriented. Thrives in dynamic environments.', weights: { practical: 1.2, analytical: 1.0, creative: 1.1, social: 1.0 } },
  INFP: { archetype: 'The Mediator', description: 'Idealistic, empathetic, creative. Drawn to meaningful work.', weights: { practical: 0.8, analytical: 0.9, creative: 1.4, social: 1.1 } },
  ENFP: { archetype: 'The Campaigner', description: 'Enthusiastic, creative, sociable. Excellent communicator.', weights: { practical: 0.8, analytical: 0.9, creative: 1.3, social: 1.2 } },
  ISTP: { archetype: 'The Virtuoso', description: 'Practical, observant, excellent problem-solver with tools and systems.', weights: { practical: 1.2, analytical: 1.2, creative: 1.0, social: 0.8 } },
  ISFP: { archetype: 'The Adventurer', description: 'Flexible, charming, creative. Artistic and hands-on.', weights: { practical: 1.0, analytical: 0.8, creative: 1.3, social: 1.0 } },
  ESFP: { archetype: 'The Entertainer', description: 'Spontaneous, energetic, people-focused. Born performer.', weights: { practical: 0.9, analytical: 0.7, creative: 1.2, social: 1.3 } },
};

// ============================================================
// SUBJECT SCORING ENGINE
// ============================================================

// Subject category weights — how each category maps to the 4 personality dimensions
const SUBJECT_WEIGHTS: Record<string, { practical: number; analytical: number; creative: number; social: number }> = {
  Mathematics: { practical: 1.0, analytical: 1.4, creative: 0.8, social: 0.7 },
  Physics: { practical: 1.1, analytical: 1.3, creative: 0.9, social: 0.7 },
  Chemistry: { practical: 1.1, analytical: 1.2, creative: 0.9, social: 0.8 },
  Biology: { practical: 1.0, analytical: 1.1, creative: 0.9, social: 1.0 },
  Economics: { practical: 1.2, analytical: 1.3, creative: 0.9, social: 1.0 },
  Accountancy: { practical: 1.3, analytical: 1.1, creative: 0.7, social: 0.9 },
  'Business Studies': { practical: 1.2, analytical: 1.0, creative: 1.0, social: 1.1 },
  History: { practical: 0.9, analytical: 1.0, creative: 1.0, social: 1.1 },
  Geography: { practical: 1.0, analytical: 1.0, creative: 1.0, social: 1.0 },
  'Political Science': { practical: 1.0, analytical: 1.1, creative: 1.0, social: 1.2 },
  Sociology: { practical: 0.9, analytical: 1.0, creative: 1.0, social: 1.3 },
  Psychology: { practical: 1.0, analytical: 1.1, creative: 1.0, social: 1.2 },
  'Computer Science': { practical: 1.1, analytical: 1.4, creative: 1.1, social: 0.8 },
  'Data Science': { practical: 1.1, analytical: 1.4, creative: 1.0, social: 0.8 },
  'Physical Education': { practical: 1.2, analytical: 0.8, creative: 0.9, social: 1.1 },
  'Fine Arts': { practical: 0.8, analytical: 0.8, creative: 1.5, social: 1.0 },
  Music: { practical: 0.8, analytical: 0.9, creative: 1.5, social: 1.0 },
  Language: { practical: 0.9, analytical: 1.0, creative: 1.1, social: 1.1 },
  English: { practical: 0.9, analytical: 1.0, creative: 1.1, social: 1.1 },
  'Home Science': { practical: 1.2, analytical: 0.9, creative: 1.0, social: 1.0 },
  'Legal Studies': { practical: 1.1, analytical: 1.2, creative: 0.9, social: 1.1 },
  Entrepreneurship: { practical: 1.2, analytical: 1.0, creative: 1.2, social: 1.1 },
};

function getSubjectWeight(subjectName: string): { practical: number; analytical: number; creative: number; social: number } {
  return SUBJECT_WEIGHTS[subjectName] || { practical: 1.0, analytical: 1.0, creative: 1.0, social: 1.0 };
}

function scoreSubject(subject: SubjectInput, personalityWeights: PersonalityProfile['weights']): ScoredSubject {
  const sw = getSubjectWeight(subject.name);
  // Personality alignment = dot product of personality weights and subject weights
  const alignment = (
    personalityWeights.practical * sw.practical +
    personalityWeights.analytical * sw.analytical +
    personalityWeights.creative * sw.creative +
    personalityWeights.social * sw.social
  ) / 4;
  
  // Interest multiplier: 1/5=0.6, 2/5=0.8, 3/5=1.0, 4/5=1.2, 5/5=1.4
  const interestMultiplier = 0.4 + (subject.interest / 5) * 1.0;
  
  const rawScore = subject.marks;
  const weightedScore = Math.round(rawScore * alignment * interestMultiplier * 10) / 10;
  
  let classification: ScoredSubject['classification'];
  if (weightedScore >= 90) classification = 'Superpower Asset';
  else if (weightedScore >= 70) classification = 'Recommended';
  else if (weightedScore >= 50) classification = 'Developing';
  else classification = 'High Risk';
  
  return { name: subject.name, marks: subject.marks, interest: subject.interest, rawScore, weightedScore, classification };
}

// ============================================================
// CAREER DATABASE
// ============================================================

interface CareerDef {
  title: string;
  domain: string;
  description: string;
  requiredSubjects: string[];
  personalityFit: string[];   // MBTI types with high fit
  tier: 'Safe' | 'Balanced' | 'Aspirational';
}

const CAREER_DATABASE: CareerDef[] = [
  // Finance / Commerce
  { title: 'Chartered Accountant', domain: 'Accounting, Audit, Tax', description: 'Professional qualification via ICAI. Core of Indian finance.', requiredSubjects: ['Accountancy', 'Mathematics', 'Economics'], personalityFit: ['ESTJ','ISTJ','INTJ','ENTJ'], tier: 'Safe' },
  { title: 'Investment Banker', domain: 'Corp Finance, Mergers', description: 'Advises corporations on capital markets and M&A.', requiredSubjects: ['Economics', 'Mathematics', 'Accountancy'], personalityFit: ['ENTJ','ESTJ','ENTP','INTJ'], tier: 'Safe' },
  { title: 'Financial Analyst', domain: 'Investment, Data Analysis', description: 'Analyzes financial data to guide investment decisions.', requiredSubjects: ['Economics', 'Mathematics', 'Accountancy'], personalityFit: ['INTJ','ISTJ','INTP','ESTJ'], tier: 'Safe' },
  { title: 'Actuary', domain: 'Financial Risk & Math', description: 'Uses statistics to assess financial risk for insurance and finance.', requiredSubjects: ['Mathematics', 'Economics', 'Computer Science'], personalityFit: ['INTJ','INTP','ISTJ','INFJ'], tier: 'Safe' },
  { title: 'Stock Broker', domain: 'Securities Trading', description: 'Executes trades and manages client portfolios.', requiredSubjects: ['Economics', 'Mathematics', 'Accountancy'], personalityFit: ['ESTP','ESTJ','ENTP','ENTJ'], tier: 'Safe' },
  { title: 'Tax Consultant', domain: 'Taxation, Compliance', description: 'Advises individuals and corporations on tax strategy.', requiredSubjects: ['Accountancy', 'Economics', 'Legal Studies'], personalityFit: ['ISTJ','ESTJ','ISFJ','INTJ'], tier: 'Balanced' },
  { title: 'Supply Chain Manager', domain: 'Operations, Logistics', description: 'Optimizes product flow from manufacturing to delivery.', requiredSubjects: ['Business Studies', 'Mathematics', 'Economics'], personalityFit: ['ESTJ','ENTJ','ISTJ','ESTP'], tier: 'Balanced' },
  { title: 'Management Consultant', domain: 'Strategy, Business', description: 'Solves complex organizational and strategic problems for clients.', requiredSubjects: ['Economics', 'Business Studies', 'Mathematics'], personalityFit: ['ENTJ','ENTP','INTJ','ESTJ'], tier: 'Balanced' },
  // Science / Tech
  { title: 'Data Scientist', domain: 'AI, Analytics, ML', description: 'Builds models that extract insights from large datasets.', requiredSubjects: ['Mathematics', 'Computer Science', 'Data Science'], personalityFit: ['INTJ','INTP','ENTJ','ISTP'], tier: 'Balanced' },
  { title: 'Software Engineer', domain: 'Technology, Dev', description: 'Designs and builds software systems and applications.', requiredSubjects: ['Computer Science', 'Mathematics', 'Physics'], personalityFit: ['INTP','INTJ','ISTP','ENTP'], tier: 'Safe' },
  { title: 'Doctor (MBBS)', domain: 'Medicine, Healthcare', description: 'Diagnoses and treats medical conditions.', requiredSubjects: ['Biology', 'Chemistry', 'Physics'], personalityFit: ['ISFJ','INFJ','ENFJ','ISTJ'], tier: 'Safe' },
  { title: 'Civil Engineer', domain: 'Infrastructure, Design', description: 'Plans and builds infrastructure like roads, buildings, bridges.', requiredSubjects: ['Physics', 'Mathematics', 'Chemistry'], personalityFit: ['ESTJ','ISTJ','ISTP','ENTJ'], tier: 'Safe' },
  // Creative / Social
  { title: 'Graphic Designer', domain: 'Design, Visual Arts', description: 'Creates visual concepts and communication materials.', requiredSubjects: ['Fine Arts', 'Computer Science'], personalityFit: ['INFP','ENFP','ISFP','ENTP'], tier: 'Safe' },
  { title: 'Journalist / Media', domain: 'Media, Communication', description: 'Investigates and communicates news and stories to the public.', requiredSubjects: ['English', 'History', 'Political Science'], personalityFit: ['ENFP','ENTP','INFJ','ENFJ'], tier: 'Safe' },
  { title: 'Psychologist', domain: 'Mental Health, Research', description: 'Studies human behavior and provides therapeutic support.', requiredSubjects: ['Psychology', 'Sociology', 'Biology'], personalityFit: ['INFJ','ENFJ','INFP','ISFJ'], tier: 'Safe' },
  { title: 'Teacher / Professor', domain: 'Education, Research', description: 'Educates and mentors students at school or university level.', requiredSubjects: ['Language', 'English', 'Sociology'], personalityFit: ['ENFJ','INFJ','ISFJ','ESFJ'], tier: 'Safe' },
  // Aspirational
  { title: 'Entrepreneur', domain: 'Startup, Venture', description: 'Builds new businesses and products from scratch.', requiredSubjects: ['Business Studies', 'Economics', 'Entrepreneurship'], personalityFit: ['ENTJ','ENTP','ESTP','ENFP'], tier: 'Aspirational' },
  { title: 'Corporate Lawyer', domain: 'Law, Compliance', description: 'Advises corporations on legal matters and transactions.', requiredSubjects: ['Legal Studies', 'Political Science', 'Economics'], personalityFit: ['ENTJ','INTJ','ENFJ','ISTJ'], tier: 'Aspirational' },
  { title: 'Operations Manager', domain: 'Business, Operations', description: 'Oversees day-to-day business functions and efficiency.', requiredSubjects: ['Business Studies', 'Economics', 'Mathematics'], personalityFit: ['ESTJ','ENTJ','ISTJ','ESTP'], tier: 'Aspirational' },
  { title: 'Cybersecurity Analyst', domain: 'Tech, Security', description: 'Protects digital systems from threats and breaches.', requiredSubjects: ['Computer Science', 'Mathematics', 'Physics'], personalityFit: ['INTJ','ISTP','INTP','ISTJ'], tier: 'Aspirational' },
  { title: 'Urban Planner', domain: 'Geography, Policy', description: 'Designs sustainable cities and community environments.', requiredSubjects: ['Geography', 'Political Science', 'Mathematics'], personalityFit: ['INTJ','INFJ','ENTJ','ISTJ'], tier: 'Aspirational' },
  { title: 'Environmental Consultant', domain: 'ESG, Policy', description: 'Advises organizations on sustainability and environmental compliance.', requiredSubjects: ['Biology', 'Chemistry', 'Geography'], personalityFit: ['INTJ','INFJ','ENTJ','ENFP'], tier: 'Aspirational' },
  { title: 'Digital Marketing Manager', domain: 'Marketing, Brand', description: 'Leads digital growth strategy across platforms and campaigns.', requiredSubjects: ['Business Studies', 'English', 'Economics'], personalityFit: ['ENFP','ENTP','ESFP','ENFJ'], tier: 'Balanced' },
  { title: 'Architect', domain: 'Design, Construction', description: 'Designs buildings balancing aesthetics and engineering.', requiredSubjects: ['Fine Arts', 'Mathematics', 'Physics'], personalityFit: ['INTJ','INFJ','ISTP','INTP'], tier: 'Aspirational' },
  { title: 'IAS / Civil Services', domain: 'Government, Policy', description: 'Top administrative service of India. Policy and governance.', requiredSubjects: ['History', 'Political Science', 'Geography'], personalityFit: ['ENTJ','INTJ','ESTJ','ENFJ'], tier: 'Aspirational' },
  { title: 'Research Scientist', domain: 'R&D, Academia', description: 'Conducts original research to advance human knowledge.', requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'], personalityFit: ['INTJ','INTP','INFJ','ISTJ'], tier: 'Aspirational' },
];

// ============================================================
// STREAM DETECTION
// ============================================================

function detectStream(subjects: SubjectInput[]): 'Science' | 'Commerce' | 'Arts' | 'Mixed' {
  const scienceSubjects = ['Physics', 'Chemistry', 'Biology', 'Computer Science', 'Data Science'];
  const commerceSubjects = ['Accountancy', 'Economics', 'Business Studies'];
  const artsSubjects = ['History', 'Geography', 'Political Science', 'Sociology', 'Psychology', 'Fine Arts', 'Music'];
  
  const subjectNames = subjects.map(s => s.name);
  const sciCount = subjectNames.filter(s => scienceSubjects.includes(s)).length;
  const comCount = subjectNames.filter(s => commerceSubjects.includes(s)).length;
  const artCount = subjectNames.filter(s => artsSubjects.includes(s)).length;
  
  const max = Math.max(sciCount, comCount, artCount);
  if (max === 0) return 'Mixed';
  if (sciCount === max && sciCount > comCount && sciCount > artCount) return 'Science';
  if (comCount === max && comCount > sciCount && comCount > artCount) return 'Commerce';
  if (artCount === max && artCount > sciCount && artCount > comCount) return 'Arts';
  return 'Mixed';
}

// ============================================================
// CAREER FIT SCORING
// ============================================================

function scoreCareer(career: CareerDef, scoredSubjects: ScoredSubject[], mbti: string, avgFit: number): number {
  const subjectNames = scoredSubjects.map(s => s.name);
  const matchCount = career.requiredSubjects.filter(rs => subjectNames.includes(rs)).length;
  const subjectMatch = matchCount / career.requiredSubjects.length;
  
  // Get avg weighted score for matched subjects
  let subjectScore = 0;
  let counted = 0;
  for (const rs of career.requiredSubjects) {
    const found = scoredSubjects.find(s => s.name === rs);
    if (found) { subjectScore += found.weightedScore; counted++; }
  }
  const avgSubjectScore = counted > 0 ? subjectScore / counted : avgFit;
  
  const personalityBonus = career.personalityFit.includes(mbti) ? 10 : 0;
  const rawScore = avgSubjectScore * subjectMatch * 0.85 + personalityBonus;
  
  // Cap at 100, min 10
  return Math.round(Math.min(100, Math.max(10, rawScore)) * 10) / 10;
}

// ============================================================
// COMBINATION SCORING
// ============================================================

function generateCombinations(scoredSubjects: ScoredSubject[]): SubjectCombination[] {
  const sorted = [...scoredSubjects].sort((a, b) => b.weightedScore - a.weightedScore);
  const top = sorted.slice(0, Math.min(6, sorted.length));
  const combos: SubjectCombination[] = [];
  
  // 3-subject combos
  for (let i = 0; i < top.length; i++) {
    for (let j = i + 1; j < top.length; j++) {
      for (let k = j + 1; k < top.length; k++) {
        const avg = (top[i].weightedScore + top[j].weightedScore + top[k].weightedScore) / 3;
        const fitScore = Math.round(avg * 10) / 10;
        let tier: SubjectCombination['tier'] = fitScore >= 85 ? 'Safe' : fitScore >= 65 ? 'Balanced' : 'Aspirational';
        let label = tier === 'Safe' ? 'THE SAFE TRIPLE (Highest Leverage)' : tier === 'Balanced' ? 'Balanced Combination' : 'Aspirational Path';
        combos.push({ subjects: [top[i].name, top[j].name, top[k].name], fitScore, label, tier });
      }
    }
  }
  
  return combos.sort((a, b) => b.fitScore - a.fitScore).slice(0, 4);
}

// ============================================================
// EDUCATION PATHWAY GENERATOR
// ============================================================

function generateEducationPathways(stream: string, careers: CareerPath[]): CASPAResult['educationPathways'] {
  if (stream === 'Commerce') return [
    { type: 'Professional Certification', primary: 'Chartered Accountancy (CA) via ICAI', alternative: 'CMA / CS' },
    { type: 'Academic Degree (Concurrent)', primary: 'Bachelor of Commerce (B.Com Hons)', alternative: 'Economics (B.A./B.Sc)' },
  ];
  if (stream === 'Science') return [
    { type: 'Academic Degree', primary: 'B.Tech / B.E. (Engineering)', alternative: 'B.Sc (Physics/Chem/Bio)' },
    { type: 'Professional Route', primary: 'MBBS (Medicine)', alternative: 'B.Sc + M.Sc + Research' },
  ];
  return [
    { type: 'Academic Degree', primary: 'B.A. (Honours) — Major Subject', alternative: 'B.A. (Programme) — Multi-subject' },
    { type: 'Professional Route', primary: 'UPSC Civil Services Prep', alternative: 'Mass Communication / Law' },
  ];
}

// ============================================================
// RISK ANALYSIS
// ============================================================

function generateRisks(stream: string, scoredSubjects: ScoredSubject[]): CASPAResult['risks'] {
  const risks = [];
  const hasHighRisk = scoredSubjects.some(s => s.classification === 'High Risk');
  
  if (stream === 'Commerce') {
    risks.push({ title: 'Financial Planning', description: 'Education pathways (especially CA coaching) require robust financial modeling. Scholarship availability must be assessed.' });
    risks.push({ title: 'Competition Density', description: 'High density in top commerce colleges (SRCC, etc.) creates a bottleneck. Acceptance rates are below 1%.' });
  } else if (stream === 'Science') {
    risks.push({ title: 'Entrance Exam Intensity', description: 'JEE/NEET are highly competitive. Consistent 2-year preparation is non-negotiable.' });
    risks.push({ title: 'Specialization Lock-in', description: 'Science stream offers fewer pivots post-12th. Engineering vs. Medicine decision must be made early.' });
  } else {
    risks.push({ title: 'Career Visibility', description: 'Arts stream careers require stronger personal branding and networking to overcome perception gaps.' });
    risks.push({ title: 'Income Trajectory', description: 'Some arts careers have longer ramp-up to stable income. Financial planning is essential.' });
  }
  
  if (hasHighRisk) {
    risks.push({ title: 'Academic Readiness', description: 'Gap exists between current performance in some subjects and entrance exam requirements. Immediate targeted improvement required.' });
  } else {
    risks.push({ title: 'Academic Readiness', description: 'Current performance is solid. Maintain consistency and begin targeted entrance exam preparation.' });
  }
  
  return risks;
}

// ============================================================
// ACTION PLAN GENERATOR
// ============================================================

function generateActionPlan(): CASPAResult['actionPlan'] {
  return [
    { phase: 'IMMEDIATE', timeframe: '2 Weeks', actions: ['Review top 10 career options in detail', 'Research 3–5 target colleges', 'Identify subject tutors if needed'] },
    { phase: 'SHORT TERM', timeframe: '1–3 Months', actions: ['Attend open houses and webinars', 'Connect with working professionals', 'Begin entrance exam preparation'] },
    { phase: 'MEDIUM TERM', timeframe: '3–6 Months', actions: ['Complete exam registrations', 'Finalize college shortlist', 'Financial planning for higher education'] },
    { phase: 'LONG TERM', timeframe: '6–12 Months', actions: ['Admissions process begins', 'Undergraduate studies start', 'Build early professional network'] },
  ];
}

// ============================================================
// MAIN CASPA ENGINE
// ============================================================

export function runCASPA(input: AssessmentInput): CASPAResult {
  const mbti = calcMBTI(input.personality);
  const personalityData = PERSONALITY_MAP[mbti] || PERSONALITY_MAP['ESTJ'];
  const personalityProfile: PersonalityProfile = { type: mbti, ...personalityData };
  
  // Score all subjects
  const scoredSubjects = input.subjects
    .filter(s => s.marks > 0 || s.interest > 0)
    .map(s => scoreSubject(s, personalityProfile.weights))
    .sort((a, b) => b.weightedScore - a.weightedScore);
  
  const avgSubjectFit = scoredSubjects.length > 0
    ? Math.round((scoredSubjects.reduce((sum, s) => sum + s.weightedScore, 0) / scoredSubjects.length) * 10) / 10
    : 0;
  
  const stream = detectStream(input.subjects);
  
  // Score all careers
  const scoredCareers: CareerPath[] = CAREER_DATABASE.map(career => ({
    title: career.title,
    domain: career.domain,
    description: career.description,
    fitScore: scoreCareer(career, scoredSubjects, mbti, avgSubjectFit),
    tier: career.tier,
    subjects: career.requiredSubjects,
  })).sort((a, b) => b.fitScore - a.fitScore);
  
  const safeCount = scoredCareers.filter(c => c.tier === 'Safe' && c.fitScore >= 70).length;
  const balancedCount = scoredCareers.filter(c => c.tier === 'Balanced' && c.fitScore >= 55).length;
  const aspirationalCount = scoredCareers.filter(c => c.tier === 'Aspirational').length;
  
  const topCombinations = generateCombinations(scoredSubjects);
  
  // Signal detection: subjects with very high scores
  const signalDetection = scoredSubjects.filter(s => s.weightedScore >= 75).map(s => s.name).slice(0, 4);
  
  const educationPathways = generateEducationPathways(stream, scoredCareers);
  const risks = generateRisks(stream, scoredSubjects);
  const actionPlan = generateActionPlan();
  
  const reportId = `CASPA-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase();
  
  return {
    studentName: input.name,
    studentAge: input.age,
    studentCity: input.city,
    reportId,
    date,
    stream,
    personalityProfile,
    scoredSubjects,
    avgSubjectFit,
    topCombinations,
    careerPaths: scoredCareers,
    safeCount,
    balancedCount,
    aspirationalCount,
    signalDetection,
    risks,
    educationPathways,
    actionPlan,
  };
}
