'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  TrendingUp, Award, Target, ChevronRight, Calendar, Star,
  ArrowUp, Zap, BookOpen, Shield, Wrench, Cpu, CheckCircle,
  Clock, Medal, Info
} from 'lucide-react'

// Types
interface SkillData {
  name: string
  level: number
  maxLevel: number
  experience: number
  category: string
  color: string
  recentGrowth: number
}

interface SkillHistory {
  date: string
  event: string
  skillName: string
  change: number
  type: 'course' | 'certificate' | 'achievement' | 'assessment'
}

interface SkillCategory {
  name: string
  icon: React.ReactNode
  color: string
  bgColor: string
  skills: SkillData[]
}

// Mock data
const generateSkillData = (): SkillCategory[] => [
  {
    name: '용접 기술',
    icon: <Wrench className="w-5 h-5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    skills: [
      { name: 'TIG 용접', level: 4, maxLevel: 5, experience: 85, category: '용접', color: '#f97316', recentGrowth: 12 },
      { name: 'MIG 용접', level: 3, maxLevel: 5, experience: 65, category: '용접', color: '#f97316', recentGrowth: 8 },
      { name: '피복 아크 용접', level: 5, maxLevel: 5, experience: 100, category: '용접', color: '#f97316', recentGrowth: 0 },
      { name: '가스 용접', level: 2, maxLevel: 5, experience: 40, category: '용접', color: '#f97316', recentGrowth: 5 },
    ]
  },
  {
    name: '안전 관리',
    icon: <Shield className="w-5 h-5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    skills: [
      { name: '산업 안전', level: 4, maxLevel: 5, experience: 80, category: '안전', color: '#22c55e', recentGrowth: 15 },
      { name: '위험성 평가', level: 3, maxLevel: 5, experience: 55, category: '안전', color: '#22c55e', recentGrowth: 10 },
      { name: '안전 교육', level: 3, maxLevel: 5, experience: 60, category: '안전', color: '#22c55e', recentGrowth: 7 },
      { name: '소방 안전', level: 2, maxLevel: 5, experience: 35, category: '안전', color: '#22c55e', recentGrowth: 3 },
    ]
  },
  {
    name: '품질 관리',
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    skills: [
      { name: 'ISO 9001', level: 3, maxLevel: 5, experience: 70, category: '품질', color: '#3b82f6', recentGrowth: 20 },
      { name: '검사 기법', level: 4, maxLevel: 5, experience: 75, category: '품질', color: '#3b82f6', recentGrowth: 5 },
      { name: 'SPC', level: 2, maxLevel: 5, experience: 45, category: '품질', color: '#3b82f6', recentGrowth: 8 },
      { name: '문서 관리', level: 3, maxLevel: 5, experience: 50, category: '품질', color: '#3b82f6', recentGrowth: 0 },
    ]
  },
  {
    name: '자동화/스마트',
    icon: <Cpu className="w-5 h-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    skills: [
      { name: 'PLC 프로그래밍', level: 2, maxLevel: 5, experience: 35, category: '자동화', color: '#a855f7', recentGrowth: 25 },
      { name: 'HMI 설계', level: 1, maxLevel: 5, experience: 20, category: '자동화', color: '#a855f7', recentGrowth: 10 },
      { name: '로봇 운용', level: 2, maxLevel: 5, experience: 30, category: '자동화', color: '#a855f7', recentGrowth: 15 },
      { name: '센서/IoT', level: 1, maxLevel: 5, experience: 15, category: '자동화', color: '#a855f7', recentGrowth: 12 },
    ]
  }
]

const generateHistory = (): SkillHistory[] => [
  { date: '2024-01-15', event: 'TIG 용접 마스터 과정 수료', skillName: 'TIG 용접', change: 12, type: 'course' },
  { date: '2024-01-10', event: '산업안전기사 자격증 취득', skillName: '산업 안전', change: 15, type: 'certificate' },
  { date: '2024-01-08', event: '용접 숙련자 뱃지 획득', skillName: '용접 전체', change: 5, type: 'achievement' },
  { date: '2024-01-05', event: 'PLC 기초 과정 수료', skillName: 'PLC 프로그래밍', change: 25, type: 'course' },
  { date: '2024-01-02', event: 'ISO 9001 심사원 교육 완료', skillName: 'ISO 9001', change: 20, type: 'course' },
  { date: '2023-12-28', event: '안전 관리자 역량 평가', skillName: '위험성 평가', change: 10, type: 'assessment' },
  { date: '2023-12-20', event: '로봇 운용 기초 수료', skillName: '로봇 운용', change: 15, type: 'course' },
]

const levelNames = ['입문', '초급', '중급', '고급', '전문가']

// Radar Chart Component (CSS-based)
function RadarChart({ skills }: { skills: { name: string; value: number }[] }) {
  const size = 300
  const center = size / 2
  const radius = size / 2 - 40
  const levels = 5

  const angleStep = (2 * Math.PI) / skills.length
  const startAngle = -Math.PI / 2

  // Calculate points for each level
  const levelPoints = (level: number) => {
    return skills.map((_, i) => {
      const angle = startAngle + i * angleStep
      const r = (radius / levels) * level
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle)
      }
    })
  }

  // Calculate data points
  const dataPoints = skills.map((skill, i) => {
    const angle = startAngle + i * angleStep
    const r = (radius / 100) * skill.value
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    }
  })

  // Calculate label positions
  const labelPositions = skills.map((skill, i) => {
    const angle = startAngle + i * angleStep
    const r = radius + 25
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      name: skill.name
    }
  })

  const polygonPath = (points: { x: number; y: number }[]) =>
    points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-md mx-auto">
      {/* Background levels */}
      {[5, 4, 3, 2, 1].map((level) => (
        <polygon
          key={level}
          points={levelPoints(level).map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {skills.map((_, i) => {
        const angle = startAngle + i * angleStep
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos(angle)}
            y2={center + radius * Math.sin(angle)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        )
      })}

      {/* Data polygon */}
      <polygon
        points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')}
        fill="rgba(59, 130, 246, 0.3)"
        stroke="#3b82f6"
        strokeWidth="2"
      />

      {/* Data points */}
      {dataPoints.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r="5"
          fill="#3b82f6"
          stroke="white"
          strokeWidth="2"
        />
      ))}

      {/* Labels */}
      {labelPositions.map((label, i) => (
        <text
          key={i}
          x={label.x}
          y={label.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs fill-gray-600 font-medium"
        >
          {label.name}
        </text>
      ))}
    </svg>
  )
}

// Skill Bar Component
function SkillBar({ skill }: { skill: SkillData }) {
  return (
    <div className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{skill.name}</span>
          {skill.recentGrowth > 0 && (
            <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <ArrowUp className="w-3 h-3 mr-0.5" />
              {skill.recentGrowth}%
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500">
          Lv.{skill.level} {levelNames[skill.level - 1]}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${skill.experience}%`,
              backgroundColor: skill.color
            }}
          />
        </div>
        <span className="text-sm font-medium text-gray-600 w-12 text-right">
          {skill.experience}%
        </span>
      </div>

      {/* Level dots */}
      <div className="flex items-center gap-1 mt-2">
        {Array.from({ length: skill.maxLevel }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < skill.level ? 'bg-current' : 'bg-gray-200'
            }`}
            style={{ color: i < skill.level ? skill.color : undefined }}
          />
        ))}
      </div>
    </div>
  )
}

// Timeline Item Component
function TimelineItem({ item }: { item: SkillHistory }) {
  const typeIcons = {
    course: <BookOpen className="w-4 h-4" />,
    certificate: <Award className="w-4 h-4" />,
    achievement: <Medal className="w-4 h-4" />,
    assessment: <Target className="w-4 h-4" />
  }

  const typeColors = {
    course: 'bg-blue-100 text-blue-600',
    certificate: 'bg-amber-100 text-amber-600',
    achievement: 'bg-purple-100 text-purple-600',
    assessment: 'bg-green-100 text-green-600'
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`p-2 rounded-full ${typeColors[item.type]}`}>
          {typeIcons[item.type]}
        </div>
        <div className="w-0.5 h-full bg-gray-200 mt-2" />
      </div>
      <div className="pb-8">
        <p className="text-xs text-gray-500 mb-1">{item.date}</p>
        <p className="font-medium text-gray-900">{item.event}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-600">{item.skillName}</span>
          <span className="text-sm text-green-600 font-medium">+{item.change}%</span>
        </div>
      </div>
    </div>
  )
}

export default function SkillMapPage() {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([])
  const [history, setHistory] = useState<SkillHistory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showRadar, setShowRadar] = useState(true)

  useEffect(() => {
    setSkillCategories(generateSkillData())
    setHistory(generateHistory())
  }, [])

  // Calculate overall stats
  const allSkills = skillCategories.flatMap(c => c.skills)
  const overallLevel = allSkills.length > 0
    ? Math.round(allSkills.reduce((sum, s) => sum + s.level, 0) / allSkills.length * 10) / 10
    : 0
  const totalGrowth = allSkills.reduce((sum, s) => sum + s.recentGrowth, 0)

  // Prepare radar chart data
  const radarData = skillCategories.map(category => {
    const avgExp = category.skills.reduce((sum, s) => sum + s.experience, 0) / category.skills.length
    return { name: category.name.split(' ')[0], value: avgExp }
  })

  // Filter skills by category
  const displayCategories = selectedCategory
    ? skillCategories.filter(c => c.name === selectedCategory)
    : skillCategories

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/skillbridge/my-learning" className="text-gray-500 hover:text-gray-700">
                ← 내 학습
              </Link>
              <h1 className="text-xl font-bold text-gray-900">스킬 맵</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRadar(!showRadar)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  showRadar ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                레이더 차트
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-blue-100">전체 스킬 레벨</span>
            </div>
            <p className="text-4xl font-bold">{overallLevel}</p>
            <p className="text-sm text-blue-200 mt-1">평균 레벨</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <ArrowUp className="w-6 h-6" />
              </div>
              <span className="text-green-100">이번 달 성장</span>
            </div>
            <p className="text-4xl font-bold">+{totalGrowth}%</p>
            <p className="text-sm text-green-200 mt-1">전체 스킬 성장량</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-purple-100">보유 스킬</span>
            </div>
            <p className="text-4xl font-bold">{allSkills.length}개</p>
            <p className="text-sm text-purple-200 mt-1">4개 카테고리</p>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Radar & Skills */}
          <div className="lg:col-span-2 space-y-6">
            {/* Radar Chart */}
            {showRadar && radarData.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    역량 분포
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    카테고리별 평균 숙련도
                  </div>
                </div>
                <RadarChart skills={radarData} />
              </section>
            )}

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                전체
              </button>
              {skillCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                    selectedCategory === category.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border hover:bg-gray-50'
                  }`}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </div>

            {/* Skills List */}
            {displayCategories.map((category) => (
              <section key={category.name} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className={`p-4 border-b flex items-center gap-3 ${category.bgColor}`}>
                  <div className={`p-2 bg-white rounded-lg ${category.color}`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${category.color}`}>{category.name}</h3>
                    <p className="text-sm text-gray-600">
                      {category.skills.length}개 스킬 · 평균 Lv.{Math.round(category.skills.reduce((s, sk) => s + sk.level, 0) / category.skills.length * 10) / 10}
                    </p>
                  </div>
                </div>
                <div className="p-4 grid gap-3">
                  {category.skills.map((skill) => (
                    <SkillBar key={skill.name} skill={skill} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Right Column - Timeline & Recommendations */}
          <div className="space-y-6">
            {/* Growth Timeline */}
            <section className="bg-white rounded-xl shadow-sm border">
              <div className="p-5 border-b flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  성장 히스토리
                </h3>
                <Link href="#" className="text-sm text-blue-600 hover:text-blue-700">
                  전체 보기
                </Link>
              </div>
              <div className="p-5">
                {history.slice(0, 5).map((item, index) => (
                  <TimelineItem key={index} item={item} />
                ))}
              </div>
            </section>

            {/* Skill Recommendations */}
            <section className="bg-white rounded-xl shadow-sm border">
              <div className="p-5 border-b">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  추천 스킬 향상
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">PLC 프로그래밍</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    스마트 팩토리 시대에 필수적인 역량입니다. 현재 레벨에서 한 단계 업그레이드를 추천합니다.
                  </p>
                  <Link
                    href="/skillbridge?category=자동화"
                    className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                  >
                    관련 과정 보기 <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">위험성 평가</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    산업안전기사 취득 후 실무 역량 강화가 필요합니다.
                  </p>
                  <Link
                    href="/skillbridge?category=안전"
                    className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    관련 과정 보기 <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>

            {/* Certificates Earned */}
            <section className="bg-white rounded-xl shadow-sm border p-5">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-amber-500" />
                취득 자격증
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">산업안전기사</p>
                    <p className="text-xs text-gray-500">2024.01.10 취득</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Award className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">용접기능사</p>
                    <p className="text-xs text-gray-500">2023.11.05 취득</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
