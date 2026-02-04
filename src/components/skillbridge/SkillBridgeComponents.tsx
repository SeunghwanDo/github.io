'use client'

import { useState } from 'react'
import {
  Shield, CheckCircle, Heart, Briefcase, Award, ChevronRight,
  Eye, Type, Sun, Volume2, VolumeX, Sprout, ArrowRight, Star,
  TrendingDown, BookOpen, Target, Clock, Users, Zap, Trophy,
  ChevronDown, Play, Flame, BarChart3
} from 'lucide-react'

// ============================================================
// TYPES & INTERFACES
// ============================================================

export interface FitnessVerification {
  verified: boolean
  grade: 1 | 2 | 3 | null
  verifiedAt: string | null
  metrics?: { cardio: number; strength: number; flexibility: number; balance: number }
}

export interface CareerVerification {
  verified: boolean
  totalYears: number
  verifiedAt: string | null
  history: { company: string; position: string; period: string }[]
}

export interface UserProfile {
  id: string
  name: string
  age: number
  primarySkill: string
  experienceYears: number
  level: number
  xp: number
  streak: number
  fitness: FitnessVerification
  career: CareerVerification
}

export interface Course {
  id: string
  title: string
  provider: string
  category: string
  duration: string
  progress: number
  rating: number
  students: number
  thumbnail?: string
}

export interface SkillData {
  name: string
  level: number
  maxLevel: number
  experience: number
  color: string
}

export interface TransitionPath {
  id: string
  title: string
  fromRole: string
  toRole: string
  description: string
  physicalDemand: 'low' | 'medium' | 'high'
  experienceUtilization: number
  benefits: string[]
  avgSalary: string
}

export interface SilverModeSettings {
  enabled: boolean
  fontSize: 'normal' | 'large' | 'xlarge'
  highContrast: boolean
  ttsEnabled: boolean
}

// ============================================================
// MOCK DATA
// ============================================================

export const MOCK_USER: UserProfile = {
  id: 'user-1',
  name: '홍길동',
  age: 52,
  primarySkill: '용접',
  experienceYears: 25,
  level: 4,
  xp: 4250,
  streak: 7,
  fitness: {
    verified: true,
    grade: 1,
    verifiedAt: '2024-01-15',
    metrics: { cardio: 85, strength: 90, flexibility: 75, balance: 80 }
  },
  career: {
    verified: true,
    totalYears: 25,
    verifiedAt: '2024-01-10',
    history: [
      { company: '현대중공업', position: '용접 기술자', period: '1999-2010' },
      { company: '삼성중공업', position: '용접 팀장', period: '2010-2024' }
    ]
  }
}

export const MOCK_COURSES: Course[] = [
  { id: '1', title: 'TIG 용접 마스터 과정', provider: '한국폴리텍대학', category: '용접', duration: '8주', progress: 75, rating: 4.9, students: 1234 },
  { id: '2', title: '산업안전기사 실기 완벽대비', provider: '안전교육원', category: '안전', duration: '6주', progress: 45, rating: 4.8, students: 892 },
  { id: '3', title: '스마트 팩토리 PLC 프로그래밍', provider: '미래산업교육원', category: '자동화', duration: '10주', progress: 20, rating: 4.7, students: 567 },
  { id: '4', title: 'ISO 9001 품질경영시스템', provider: 'KSA', category: '품질', duration: '4주', progress: 0, rating: 4.6, students: 445 },
]

export const MOCK_SKILLS: SkillData[] = [
  { name: 'TIG 용접', level: 4, maxLevel: 5, experience: 85, color: '#f97316' },
  { name: 'MIG 용접', level: 3, maxLevel: 5, experience: 65, color: '#f97316' },
  { name: '산업 안전', level: 4, maxLevel: 5, experience: 80, color: '#22c55e' },
  { name: 'PLC 프로그래밍', level: 2, maxLevel: 5, experience: 35, color: '#a855f7' },
  { name: '품질 관리', level: 3, maxLevel: 5, experience: 60, color: '#3b82f6' },
]

export const MOCK_REGROWTH_PATHS: TransitionPath[] = [
  {
    id: '1',
    title: '산업안전 교육강사',
    fromRole: '용접 기술자',
    toRole: '안전교육 전문강사',
    description: '25년 현장 경험을 바탕으로 후배들에게 안전한 작업 방법을 교육합니다.',
    physicalDemand: 'low',
    experienceUtilization: 95,
    benefits: ['육체적 부담 감소', '경험 100% 활용', '정년 후 활동 가능', '높은 사회적 기여'],
    avgSalary: '월 350~500만원'
  },
  {
    id: '2',
    title: '품질관리 관리자',
    fromRole: '용접 기술자',
    toRole: 'QC 매니저',
    description: '용접 품질에 대한 깊은 이해를 바탕으로 전체 품질 관리를 총괄합니다.',
    physicalDemand: 'low',
    experienceUtilization: 85,
    benefits: ['사무직 전환', '관리자 역할', '안정적인 근무환경', '높은 연봉'],
    avgSalary: '월 400~600만원'
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  '용접': 'bg-orange-100 text-orange-700',
  '안전': 'bg-green-100 text-green-700',
  '품질': 'bg-blue-100 text-blue-700',
  '자동화': 'bg-purple-100 text-purple-700'
}

// ============================================================
// COMPONENT: DataCertification (신뢰 인증 시스템)
// ============================================================

export function DataCertification({ user = MOCK_USER }: { user?: UserProfile }) {
  const [expanded, setExpanded] = useState<'fitness' | 'career' | null>(null)

  const fitnessGrade = user.fitness.grade
  const gradeInfo = fitnessGrade === 1
    ? { emoji: '🥇', label: '1등급', color: 'text-amber-500' }
    : fitnessGrade === 2
    ? { emoji: '🥈', label: '2등급', color: 'text-gray-400' }
    : { emoji: '🥉', label: '3등급', color: 'text-amber-700' }

  const trustScore = 20 +
    (user.fitness.verified ? 25 + (fitnessGrade === 1 ? 15 : fitnessGrade === 2 ? 10 : 5) : 0) +
    (user.career.verified ? 30 + (user.career.totalYears >= 5 ? 10 : 0) : 0)

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">내 데이터 인증</h3>
            <p className="text-sm text-slate-600">공공 데이터 연동으로 신뢰도를 높이세요</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* 국민체력100 */}
        <div className={`rounded-xl border-2 transition-all ${user.fitness.verified ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'}`}>
          <div className="p-4 cursor-pointer" onClick={() => setExpanded(expanded === 'fitness' ? null : 'fitness')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${user.fitness.verified ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                  <Heart className={`w-5 h-5 ${user.fitness.verified ? 'text-emerald-600' : 'text-slate-500'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-slate-900">국민체력100</h4>
                    {user.fitness.verified && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        <CheckCircle className="w-3 h-3" /> 인증 완료
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">건강 체력 인증</p>
                </div>
              </div>
              {user.fitness.verified && (
                <div className="flex items-center gap-1">
                  <span className="text-2xl">{gradeInfo.emoji}</span>
                  <span className={`font-bold ${gradeInfo.color}`}>{gradeInfo.label}</span>
                </div>
              )}
            </div>
          </div>

          {expanded === 'fitness' && user.fitness.verified && user.fitness.metrics && (
            <div className="px-4 pb-4 space-y-3">
              <div className="h-px bg-slate-200" />
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '심폐지구력', value: user.fitness.metrics.cardio, color: 'bg-red-500' },
                  { label: '근력', value: user.fitness.metrics.strength, color: 'bg-blue-500' },
                  { label: '유연성', value: user.fitness.metrics.flexibility, color: 'bg-emerald-500' },
                  { label: '균형감각', value: user.fitness.metrics.balance, color: 'bg-purple-500' }
                ].map((m) => (
                  <div key={m.label} className="p-3 bg-white rounded-lg border">
                    <p className="text-xs text-slate-500 mb-1">{m.label}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.value}%` }} />
                      </div>
                      <span className="text-sm font-medium">{m.value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 p-3 bg-emerald-100 rounded-lg text-emerald-800">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">건강 인증 완료 - 현장 근무 적합</span>
              </div>
            </div>
          )}
        </div>

        {/* 고용24 */}
        <div className={`rounded-xl border-2 transition-all ${user.career.verified ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'}`}>
          <div className="p-4 cursor-pointer" onClick={() => setExpanded(expanded === 'career' ? null : 'career')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${user.career.verified ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                  <Briefcase className={`w-5 h-5 ${user.career.verified ? 'text-emerald-600' : 'text-slate-500'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-slate-900">고용24</h4>
                    {user.career.verified && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        <CheckCircle className="w-3 h-3" /> 인증 완료
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">경력 이력 인증</p>
                </div>
              </div>
              {user.career.totalYears >= 5 && (
                <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-sm rounded-full font-medium">
                  <Award className="w-4 h-4" /> 검증된 전문가
                </span>
              )}
            </div>
          </div>

          {expanded === 'career' && user.career.verified && (
            <div className="px-4 pb-4 space-y-3">
              <div className="h-px bg-slate-200" />
              <h5 className="font-medium text-slate-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                인증된 경력 ({user.career.totalYears}년)
              </h5>
              {user.career.history.map((job, i) => (
                <div key={i} className="p-3 bg-white rounded-lg border">
                  <p className="font-medium text-slate-900">{job.company}</p>
                  <p className="text-sm text-slate-600">{job.position}</p>
                  <p className="text-xs text-slate-500">{job.period}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trust Score */}
        <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-slate-900">신뢰도 점수</span>
            <span className="text-2xl font-bold text-blue-600">{trustScore}점</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: `${trustScore}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// COMPONENT: SilverModeToggle (실버 모드)
// ============================================================

export function SilverModeToggle({
  settings,
  onToggle
}: {
  settings: SilverModeSettings
  onToggle: (key: keyof SilverModeSettings) => void
}) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          settings.enabled
            ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      >
        <Eye className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">
          {settings.enabled ? '실버 모드 ON' : '실버 모드'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
      </button>

      {showSettings && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">
            <div className="p-4 border-b bg-amber-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-slate-900">실버 모드</span>
                </div>
                <button
                  onClick={() => onToggle('enabled')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${settings.enabled ? 'bg-amber-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <Type className="w-4 h-4" /> 글씨 크기
                </label>
                <div className="flex gap-2">
                  {['normal', 'large', 'xlarge'].map((size) => (
                    <button
                      key={size}
                      onClick={() => onToggle('fontSize')}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all ${
                        settings.fontSize === size
                          ? 'border-amber-500 bg-amber-50 text-amber-800'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {size === 'normal' ? '보통' : size === 'large' ? '크게' : '매우 크게'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Sun className="w-4 h-4" /> 고대비 모드
                </label>
                <button
                  onClick={() => onToggle('highContrast')}
                  className={`relative w-10 h-5 rounded-full transition-colors ${settings.highContrast ? 'bg-amber-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.highContrast ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Volume2 className="w-4 h-4" /> 음성 읽기 (TTS)
                </label>
                <button
                  onClick={() => onToggle('ttsEnabled')}
                  className={`relative w-10 h-5 rounded-full transition-colors ${settings.ttsEnabled ? 'bg-amber-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.ttsEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t">
              <p className="text-xs text-slate-500 text-center">💡 실버 모드는 50대 이상 사용자에게 추천됩니다</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================
// COMPONENT: ReadAloudButton (TTS 버튼)
// ============================================================

export function ReadAloudButton({ text, label = '읽어주기' }: { text: string; label?: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleClick = () => {
    if (!('speechSynthesis' in window)) {
      alert('이 브라우저는 음성 지원이 되지 않습니다.')
      return
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ko-KR'
      utterance.rate = 0.9
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
      setIsSpeaking(true)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        isSpeaking ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
      }`}
    >
      {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      <span className="font-medium">{isSpeaking ? '읽기 중지' : label}</span>
    </button>
  )
}

// ============================================================
// COMPONENT: RegrowthTrack (인생 2막 추천)
// ============================================================

export function RegrowthTrack({
  user = MOCK_USER,
  paths = MOCK_REGROWTH_PATHS
}: {
  user?: UserProfile
  paths?: TransitionPath[]
}) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  if (user.age < 50) return null

  const physicalLabels = {
    low: { label: '낮음', color: 'bg-emerald-100 text-emerald-700' },
    medium: { label: '보통', color: 'bg-amber-100 text-amber-700' },
    high: { label: '높음', color: 'bg-red-100 text-red-700' }
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 overflow-hidden">
      <div className="p-5 border-b border-emerald-200 bg-gradient-to-r from-emerald-100 to-teal-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500 rounded-xl">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-emerald-900">인생 2막 추천</h3>
              <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">Re-growth 🌱</span>
            </div>
            <p className="text-sm text-emerald-700">{user.experienceYears}년 {user.primarySkill} 경력을 활용한 전환 경로</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {paths.map((path) => (
          <div
            key={path.id}
            className={`p-4 bg-white rounded-xl border-2 transition-all cursor-pointer ${
              selectedPath === path.id ? 'border-emerald-500 shadow-lg' : 'border-transparent hover:border-emerald-300'
            }`}
            onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-slate-900">{path.title}</h4>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${physicalLabels[path.physicalDemand].color}`}>
                    체력 부담 {physicalLabels[path.physicalDemand].label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                  <span className="font-medium">{path.fromRole}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium text-emerald-700">{path.toRole}</span>
                </div>
                <p className="text-sm text-slate-600">{path.description}</p>

                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Target className="w-4 h-4" /> 경험 활용도 {path.experienceUtilization}%
                  </span>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${selectedPath === path.id ? 'rotate-90' : ''}`} />
            </div>

            {selectedPath === path.id && (
              <div className="mt-4 pt-4 border-t space-y-4">
                <div>
                  <h5 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" /> 전환 장점
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {path.benefits.map((b, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">✓ {b}</span>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-800"><span className="font-medium">예상 수입:</span> {path.avgSalary}</p>
                </div>
                <button className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">
                  <Sprout className="w-5 h-5" /> 이 경로로 시작하기
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// COMPONENT: CourseCard (과정 카드)
// ============================================================

export function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className={`h-2 ${
        course.category === '용접' ? 'bg-orange-500' :
        course.category === '안전' ? 'bg-emerald-500' :
        course.category === '자동화' ? 'bg-purple-500' : 'bg-blue-500'
      }`} />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 text-xs rounded-full ${CATEGORY_COLORS[course.category] || 'bg-slate-100 text-slate-700'}`}>
            {course.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {course.rating}
          </span>
        </div>

        <h4 className="font-semibold text-slate-900 mb-1">{course.title}</h4>
        <p className="text-sm text-slate-500 mb-3">{course.provider} · {course.duration}</p>

        {course.progress > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-600">진행률</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${course.progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Users className="w-3 h-3" /> {course.students.toLocaleString()}명
          </span>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1">
            <Play className="w-4 h-4" /> {course.progress > 0 ? '이어서' : '시작'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// COMPONENT: SkillRadarChart (스킬 레이더 차트)
// ============================================================

export function SkillRadarChart({ skills = MOCK_SKILLS }: { skills?: SkillData[] }) {
  const size = 280
  const center = size / 2
  const radius = size / 2 - 40

  const points = skills.map((skill, i) => {
    const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2
    const r = (radius / 100) * skill.experience
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) }
  })

  const labelPositions = skills.map((skill, i) => {
    const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2
    const r = radius + 25
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle), name: skill.name }
  })

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-600" /> 스킬 맵
      </h3>

      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-xs mx-auto">
        {/* Grid circles */}
        {[5, 4, 3, 2, 1].map(level => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={(radius / 5) * level}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {skills.map((_, i) => {
          const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          )
        })}

        {/* Data polygon */}
        <polygon points={polygonPoints} fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="2" />

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="5" fill="#3b82f6" stroke="white" strokeWidth="2" />
        ))}

        {/* Labels */}
        {labelPositions.map((l, i) => (
          <text key={i} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle" className="text-xs fill-slate-600 font-medium">
            {l.name}
          </text>
        ))}
      </svg>

      {/* Skill bars */}
      <div className="mt-6 space-y-3">
        {skills.map(skill => (
          <div key={skill.name} className="flex items-center gap-3">
            <span className="text-sm text-slate-700 w-24 truncate">{skill.name}</span>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${skill.experience}%`, backgroundColor: skill.color }} />
            </div>
            <span className="text-sm font-medium text-slate-700 w-8">Lv.{skill.level}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// COMPONENT: UserStatsHeader (상단 통계)
// ============================================================

export function UserStatsHeader({ user = MOCK_USER }: { user?: UserProfile }) {
  const levelInfo = { name: '전문가', minXP: 3000, maxXP: 5000 }
  const xpProgress = ((user.xp - levelInfo.minXP) / (levelInfo.maxXP - levelInfo.minXP)) * 100

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold">{user.name}</span>
            {user.career.totalYears >= 5 && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                ✅ 검증된 전문가
              </span>
            )}
          </div>
          <p className="text-blue-100 mb-2">{user.primarySkill} · 경력 {user.experienceYears}년</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-300" /> {user.streak}일 연속 학습
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-300" /> {user.xp.toLocaleString()} XP
            </span>
            {user.fitness.verified && (
              <span className="flex items-center gap-1">
                {user.fitness.grade === 1 ? '🥇' : user.fitness.grade === 2 ? '🥈' : '🥉'} 체력 인증
              </span>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-xl p-4 min-w-[250px]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Lv.{user.level} {levelInfo.name}</span>
            <span className="text-sm text-blue-200">{user.xp.toLocaleString()} / {levelInfo.maxXP.toLocaleString()} XP</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" style={{ width: `${xpProgress}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
