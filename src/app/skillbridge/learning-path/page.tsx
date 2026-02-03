'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Map, Target, Clock, CheckCircle, Circle, Lock, ChevronRight,
  Award, BookOpen, Zap, Star, ArrowRight, Sparkles, Play,
  Calendar, TrendingUp, Flag, Users
} from 'lucide-react'

// Types
interface PathStep {
  id: string
  title: string
  description: string
  type: 'course' | 'certification' | 'project' | 'assessment'
  duration: string
  status: 'completed' | 'current' | 'upcoming' | 'locked'
  skills: string[]
  provider?: string
  xpReward: number
  requiredLevel?: number
}

interface LearningPath {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  totalDuration: string
  steps: PathStep[]
  completedSteps: number
  totalSteps: number
  enrolled: number
  rating: number
  tags: string[]
  thumbnail: string
  aiRecommended?: boolean
}

// Mock data
const generateLearningPaths = (): LearningPath[] => [
  {
    id: 'welding-master',
    title: '용접 마스터 로드맵',
    description: '용접 입문부터 전문가까지, 체계적인 커리큘럼으로 용접 기술을 마스터합니다.',
    category: '용접',
    difficulty: 'beginner',
    totalDuration: '6개월',
    completedSteps: 3,
    totalSteps: 8,
    enrolled: 1234,
    rating: 4.8,
    tags: ['TIG', 'MIG', '피복아크', '자격증'],
    thumbnail: '/paths/welding.jpg',
    aiRecommended: true,
    steps: [
      {
        id: 'w1',
        title: '용접 기초 이론',
        description: '용접의 원리와 기본 개념을 학습합니다.',
        type: 'course',
        duration: '2주',
        status: 'completed',
        skills: ['용접 이론', '안전 수칙'],
        provider: '한국폴리텍대학',
        xpReward: 200
      },
      {
        id: 'w2',
        title: '피복 아크 용접 실습',
        description: '가장 기본적인 피복 아크 용접을 실습합니다.',
        type: 'course',
        duration: '4주',
        status: 'completed',
        skills: ['피복아크용접', '비드 형성'],
        provider: '한국폴리텍대학',
        xpReward: 400
      },
      {
        id: 'w3',
        title: '용접기능사 필기 대비',
        description: '용접기능사 필기시험을 준비합니다.',
        type: 'course',
        duration: '2주',
        status: 'completed',
        skills: ['용접 이론', '재료학'],
        xpReward: 300
      },
      {
        id: 'w4',
        title: 'TIG 용접 기초',
        description: 'TIG 용접의 기본 기법을 학습합니다.',
        type: 'course',
        duration: '4주',
        status: 'current',
        skills: ['TIG 용접', '아르곤 가스'],
        provider: '미래기술교육원',
        xpReward: 500
      },
      {
        id: 'w5',
        title: '용접기능사 실기',
        description: '용접기능사 실기시험에 도전합니다.',
        type: 'certification',
        duration: '1일',
        status: 'upcoming',
        skills: ['자격증'],
        xpReward: 1000,
        requiredLevel: 3
      },
      {
        id: 'w6',
        title: 'MIG 용접 마스터',
        description: '반자동 MIG 용접 기술을 익힙니다.',
        type: 'course',
        duration: '4주',
        status: 'locked',
        skills: ['MIG 용접', 'CO2 용접'],
        provider: '한국폴리텍대학',
        xpReward: 500,
        requiredLevel: 3
      },
      {
        id: 'w7',
        title: '특수 용접 기법',
        description: '스테인리스, 알루미늄 등 특수 소재 용접을 학습합니다.',
        type: 'course',
        duration: '6주',
        status: 'locked',
        skills: ['특수소재', '고급 기법'],
        xpReward: 600,
        requiredLevel: 4
      },
      {
        id: 'w8',
        title: '용접산업기사 취득',
        description: '최종 목표: 용접산업기사 자격증을 취득합니다.',
        type: 'certification',
        duration: '준비기간 포함',
        status: 'locked',
        skills: ['전문가 자격'],
        xpReward: 2000,
        requiredLevel: 4
      }
    ]
  },
  {
    id: 'safety-expert',
    title: '산업안전 전문가 경로',
    description: '안전관리자로 성장하기 위한 체계적인 학습 경로입니다.',
    category: '안전',
    difficulty: 'intermediate',
    totalDuration: '8개월',
    completedSteps: 2,
    totalSteps: 7,
    enrolled: 856,
    rating: 4.9,
    tags: ['산업안전', '위험성평가', 'KOSHA'],
    thumbnail: '/paths/safety.jpg',
    steps: [
      {
        id: 's1',
        title: '산업안전 기초',
        description: '산업안전의 기본 개념과 법규를 학습합니다.',
        type: 'course',
        duration: '3주',
        status: 'completed',
        skills: ['안전법규', '기초이론'],
        xpReward: 250
      },
      {
        id: 's2',
        title: '위험성 평가 실무',
        description: '현장 위험성 평가 방법론을 익힙니다.',
        type: 'course',
        duration: '4주',
        status: 'completed',
        skills: ['위험성평가', 'JSA'],
        xpReward: 400
      },
      {
        id: 's3',
        title: '산업안전기사 필기',
        description: '산업안전기사 필기시험을 준비합니다.',
        type: 'course',
        duration: '6주',
        status: 'current',
        skills: ['안전관리론', '인간공학'],
        xpReward: 500
      },
      {
        id: 's4',
        title: '산업안전기사 실기',
        description: '산업안전기사 실기시험에 도전합니다.',
        type: 'certification',
        duration: '4주',
        status: 'upcoming',
        skills: ['실무능력'],
        xpReward: 1000
      },
      {
        id: 's5',
        title: 'KOSHA 인증 교육',
        description: '한국산업안전보건공단 인증 전문교육을 이수합니다.',
        type: 'course',
        duration: '2주',
        status: 'locked',
        skills: ['KOSHA', '전문교육'],
        xpReward: 600,
        requiredLevel: 4
      },
      {
        id: 's6',
        title: '안전관리 프로젝트',
        description: '실제 현장에서 안전관리 프로젝트를 수행합니다.',
        type: 'project',
        duration: '8주',
        status: 'locked',
        skills: ['현장실무', '프로젝트'],
        xpReward: 800,
        requiredLevel: 4
      },
      {
        id: 's7',
        title: '안전관리자 역량평가',
        description: '최종 역량 평가를 통해 전문가로 인증받습니다.',
        type: 'assessment',
        duration: '1주',
        status: 'locked',
        skills: ['종합평가'],
        xpReward: 1500,
        requiredLevel: 5
      }
    ]
  },
  {
    id: 'smart-factory',
    title: '스마트 팩토리 엔지니어',
    description: 'Industry 4.0 시대를 선도할 스마트 팩토리 전문가 양성 과정입니다.',
    category: '자동화',
    difficulty: 'advanced',
    totalDuration: '10개월',
    completedSteps: 1,
    totalSteps: 9,
    enrolled: 567,
    rating: 4.7,
    tags: ['PLC', 'HMI', 'IoT', 'MES'],
    thumbnail: '/paths/smart.jpg',
    aiRecommended: true,
    steps: [
      {
        id: 'sf1',
        title: '스마트 팩토리 개론',
        description: '4차 산업혁명과 스마트 팩토리의 이해',
        type: 'course',
        duration: '2주',
        status: 'completed',
        skills: ['Industry 4.0', '스마트제조'],
        xpReward: 200
      },
      {
        id: 'sf2',
        title: 'PLC 프로그래밍 기초',
        description: '래더 다이어그램과 기본 로직 프로그래밍',
        type: 'course',
        duration: '6주',
        status: 'current',
        skills: ['PLC', '래더로직'],
        provider: '미래산업교육원',
        xpReward: 500
      },
      {
        id: 'sf3',
        title: 'PLC 프로그래밍 심화',
        description: 'Function Block과 고급 프로그래밍 기법',
        type: 'course',
        duration: '6주',
        status: 'upcoming',
        skills: ['FB', 'ST언어'],
        xpReward: 600
      },
      {
        id: 'sf4',
        title: 'HMI 설계 및 구현',
        description: '휴먼머신인터페이스 설계와 구현',
        type: 'course',
        duration: '4주',
        status: 'locked',
        skills: ['HMI', 'SCADA'],
        xpReward: 500,
        requiredLevel: 3
      },
      {
        id: 'sf5',
        title: '산업용 로봇 기초',
        description: '로봇 운용 및 프로그래밍 기초',
        type: 'course',
        duration: '6주',
        status: 'locked',
        skills: ['로봇', '티칭'],
        xpReward: 600,
        requiredLevel: 3
      },
      {
        id: 'sf6',
        title: 'IoT 센서 네트워크',
        description: '산업용 IoT 센서 및 네트워크 구축',
        type: 'course',
        duration: '4주',
        status: 'locked',
        skills: ['IoT', '센서'],
        xpReward: 500,
        requiredLevel: 4
      },
      {
        id: 'sf7',
        title: 'MES 시스템 이해',
        description: '제조실행시스템의 이해와 활용',
        type: 'course',
        duration: '4주',
        status: 'locked',
        skills: ['MES', 'ERP연동'],
        xpReward: 600,
        requiredLevel: 4
      },
      {
        id: 'sf8',
        title: '스마트 팩토리 프로젝트',
        description: '종합 프로젝트: 미니 스마트 팩토리 구축',
        type: 'project',
        duration: '8주',
        status: 'locked',
        skills: ['통합', '프로젝트'],
        xpReward: 1000,
        requiredLevel: 4
      },
      {
        id: 'sf9',
        title: '스마트제조엔지니어 인증',
        description: '최종 인증 평가',
        type: 'certification',
        duration: '1주',
        status: 'locked',
        skills: ['인증'],
        xpReward: 2000,
        requiredLevel: 5
      }
    ]
  }
]

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700',
  expert: 'bg-red-100 text-red-700'
}

const difficultyLabels = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
  expert: '전문가'
}

const statusColors = {
  completed: 'bg-green-500',
  current: 'bg-blue-500',
  upcoming: 'bg-gray-300',
  locked: 'bg-gray-200'
}

const typeIcons = {
  course: <BookOpen className="w-4 h-4" />,
  certification: <Award className="w-4 h-4" />,
  project: <Flag className="w-4 h-4" />,
  assessment: <Target className="w-4 h-4" />
}

const categoryColors: Record<string, string> = {
  '용접': 'border-orange-500 bg-orange-50',
  '안전': 'border-green-500 bg-green-50',
  '품질': 'border-blue-500 bg-blue-50',
  '자동화': 'border-purple-500 bg-purple-50'
}

// Step Component
function PathStepCard({ step, index, isLast }: { step: PathStep; index: number; isLast: boolean }) {
  const StatusIcon = () => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'current':
        return <Play className="w-6 h-6 text-blue-500" />
      case 'upcoming':
        return <Circle className="w-6 h-6 text-gray-400" />
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-300" />
    }
  }

  return (
    <div className="flex gap-4">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
          step.status === 'completed' ? 'border-green-500 bg-green-50' :
          step.status === 'current' ? 'border-blue-500 bg-blue-50' :
          'border-gray-200 bg-white'
        }`}>
          <StatusIcon />
        </div>
        {!isLast && (
          <div className={`w-0.5 flex-1 min-h-[60px] ${
            step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
          }`} />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-8 ${step.status === 'locked' ? 'opacity-50' : ''}`}>
        <div className={`p-4 rounded-lg border ${
          step.status === 'current' ? 'border-blue-300 bg-blue-50 shadow-sm' :
          step.status === 'completed' ? 'border-green-200 bg-green-50' :
          'border-gray-200 bg-white'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`p-1 rounded ${
                  step.type === 'course' ? 'bg-blue-100 text-blue-600' :
                  step.type === 'certification' ? 'bg-amber-100 text-amber-600' :
                  step.type === 'project' ? 'bg-purple-100 text-purple-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {typeIcons[step.type]}
                </span>
                <h4 className="font-medium text-gray-900">{step.title}</h4>
                {step.status === 'current' && (
                  <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                    진행 중
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{step.description}</p>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  {step.duration}
                </span>
                <span className="flex items-center gap-1 text-amber-600">
                  <Zap className="w-4 h-4" />
                  +{step.xpReward} XP
                </span>
                {step.provider && (
                  <span className="text-gray-500">{step.provider}</span>
                )}
                {step.requiredLevel && (
                  <span className="text-gray-400 text-xs">
                    Lv.{step.requiredLevel} 필요
                  </span>
                )}
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 mt-2">
                {step.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            {step.status === 'current' && (
              <Link
                href={`/skillbridge/1`}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
              >
                이어서 학습
              </Link>
            )}
            {step.status === 'upcoming' && (
              <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0">
                미리보기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Path Card Component
function PathCard({ path, onSelect }: { path: LearningPath; onSelect: () => void }) {
  const progress = (path.completedSteps / path.totalSteps) * 100

  return (
    <div
      onClick={onSelect}
      className={`p-5 rounded-xl border-l-4 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer ${categoryColors[path.category] || 'border-gray-500 bg-gray-50'}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {path.aiRecommended && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
                <Sparkles className="w-3 h-3" />
                AI 추천
              </span>
            )}
            <span className={`px-2 py-0.5 text-xs rounded-full ${difficultyColors[path.difficulty]}`}>
              {difficultyLabels[path.difficulty]}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{path.title}</h3>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{path.description}</p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600">진행률</span>
          <span className="font-medium text-gray-900">
            {path.completedSteps}/{path.totalSteps} 완료
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {path.totalDuration}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {path.enrolled.toLocaleString()}명
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-4 h-4 text-amber-500" />
          {path.rating}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-3">
        {path.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function LearningPathPage() {
  const [paths, setPaths] = useState<LearningPath[]>([])
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    setPaths(generateLearningPaths())
  }, [])

  const filteredPaths = selectedCategory
    ? paths.filter(p => p.category === selectedCategory)
    : paths

  const categories = ['용접', '안전', '품질', '자동화']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href={selectedPath ? '#' : '/skillbridge/my-learning'}
                onClick={(e) => {
                  if (selectedPath) {
                    e.preventDefault()
                    setSelectedPath(null)
                  }
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ← {selectedPath ? '학습 경로' : '내 학습'}
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                {selectedPath ? selectedPath.title : '학습 경로'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedPath ? (
          <>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Map className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">나만의 학습 로드맵</h2>
                  <p className="text-indigo-100">AI가 추천하는 맞춤형 학습 경로로 목표에 도달하세요</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-3xl font-bold">{paths.length}</p>
                  <p className="text-indigo-200 text-sm">등록된 학습 경로</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-3xl font-bold">
                    {paths.filter(p => p.aiRecommended).length}
                  </p>
                  <p className="text-indigo-200 text-sm">AI 추천 경로</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-3xl font-bold">
                    {paths.reduce((sum, p) => sum + p.completedSteps, 0)}
                  </p>
                  <p className="text-indigo-200 text-sm">완료한 단계</p>
                </div>
              </div>
            </section>

            {/* Category Filter */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
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
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Path List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPaths.map((path) => (
                <PathCard
                  key={path.id}
                  path={path}
                  onSelect={() => setSelectedPath(path)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Path Detail View */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content - Steps */}
              <div className="lg:col-span-2">
                <section className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${
                      selectedPath.category === '용접' ? 'bg-orange-100' :
                      selectedPath.category === '안전' ? 'bg-green-100' :
                      selectedPath.category === '자동화' ? 'bg-purple-100' :
                      'bg-blue-100'
                    }`}>
                      <Target className={`w-6 h-6 ${
                        selectedPath.category === '용접' ? 'text-orange-600' :
                        selectedPath.category === '안전' ? 'text-green-600' :
                        selectedPath.category === '자동화' ? 'text-purple-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedPath.title}</h2>
                      <p className="text-gray-600">{selectedPath.description}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">전체 진행률</span>
                      <span className="text-sm font-medium">
                        {selectedPath.completedSteps}/{selectedPath.totalSteps} 단계 완료
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                        style={{ width: `${(selectedPath.completedSteps / selectedPath.totalSteps) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedPath.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Steps Timeline */}
                <section className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    학습 단계
                  </h3>

                  <div>
                    {selectedPath.steps.map((step, index) => (
                      <PathStepCard
                        key={step.id}
                        step={step}
                        index={index}
                        isLast={index === selectedPath.steps.length - 1}
                      />
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Path Info */}
                <section className="bg-white rounded-xl shadow-sm border p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">경로 정보</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">난이도</span>
                      <span className={`px-2 py-0.5 text-sm rounded-full ${difficultyColors[selectedPath.difficulty]}`}>
                        {difficultyLabels[selectedPath.difficulty]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">예상 기간</span>
                      <span className="font-medium">{selectedPath.totalDuration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">수강생</span>
                      <span className="font-medium">{selectedPath.enrolled.toLocaleString()}명</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">평점</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        {selectedPath.rating}
                      </span>
                    </div>
                  </div>
                </section>

                {/* XP Summary */}
                <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5">
                  <h3 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    획득 가능 XP
                  </h3>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-amber-600">
                      {selectedPath.steps.reduce((sum, s) => sum + s.xpReward, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-amber-700 mt-1">총 XP</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-amber-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-amber-700">획득 XP</span>
                      <span className="font-medium text-amber-900">
                        {selectedPath.steps
                          .filter(s => s.status === 'completed')
                          .reduce((sum, s) => sum + s.xpReward, 0)
                          .toLocaleString()} XP
                      </span>
                    </div>
                  </div>
                </section>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Play className="w-5 h-5" />
                    이어서 학습하기
                  </button>
                  <button className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    학습 계획 수정
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
