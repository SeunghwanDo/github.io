'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Sprout, ArrowRight, Star, Clock, Users, Award,
  TrendingDown, Heart, BookOpen, ChevronRight, Sparkles,
  Target, CheckCircle, Shield
} from 'lucide-react'
import { useVerification, isEligibleForRegrowth, getRegrowthRecommendations } from '@/hooks/useVerification'
import ReadAloudButton from './ReadAloudButton'

interface TransitionPath {
  id: string
  title: string
  fromRole: string
  toRole: string
  description: string
  physicalDemand: 'low' | 'medium' | 'high'
  experienceUtilization: number // percentage
  courses: {
    id: string
    title: string
    duration: string
    provider: string
  }[]
  benefits: string[]
  avgSalary: string
  demandLevel: 'high' | 'medium' | 'low'
  successStories: number
}

const regrowthPaths: Record<string, TransitionPath[]> = {
  '용접': [
    {
      id: 'welding-to-safety',
      title: '산업안전 교육강사',
      fromRole: '용접 기술자',
      toRole: '안전교육 전문강사',
      description: '20년 이상의 현장 경험을 바탕으로 후배 기술자들에게 안전한 작업 방법을 교육합니다.',
      physicalDemand: 'low',
      experienceUtilization: 95,
      courses: [
        { id: '1', title: '산업안전교육 강사양성과정', duration: '4주', provider: '한국산업안전보건공단' },
        { id: '2', title: '교수법 및 강의 스킬', duration: '2주', provider: '직업능력개발원' }
      ],
      benefits: ['육체적 부담 감소', '경험 100% 활용', '정년 후에도 활동 가능', '높은 사회적 기여'],
      avgSalary: '월 350~500만원',
      demandLevel: 'high',
      successStories: 234
    },
    {
      id: 'welding-to-qc',
      title: '품질관리 관리자',
      fromRole: '용접 기술자',
      toRole: 'QC 매니저',
      description: '용접 품질에 대한 깊은 이해를 바탕으로 전체 품질 관리를 총괄합니다.',
      physicalDemand: 'low',
      experienceUtilization: 85,
      courses: [
        { id: '3', title: '품질경영기사 자격과정', duration: '8주', provider: '폴리텍대학' },
        { id: '4', title: 'ISO 9001 심사원 과정', duration: '3주', provider: 'KSA' }
      ],
      benefits: ['사무직 전환', '관리자 역할', '안정적인 근무환경', '높은 연봉'],
      avgSalary: '월 400~600만원',
      demandLevel: 'high',
      successStories: 189
    },
    {
      id: 'welding-to-consultant',
      title: '기술 컨설턴트',
      fromRole: '용접 기술자',
      toRole: '용접/제조 컨설턴트',
      description: '다양한 기업에 용접 기술 및 공정 개선 자문을 제공합니다.',
      physicalDemand: 'low',
      experienceUtilization: 100,
      courses: [
        { id: '5', title: '기술 컨설팅 방법론', duration: '4주', provider: '중소기업진흥공단' },
        { id: '6', title: '제조 공정 최적화', duration: '3주', provider: '생산성본부' }
      ],
      benefits: ['자유로운 시간 관리', '높은 수입', '전문성 인정', '네트워크 확장'],
      avgSalary: '프로젝트당 500~1000만원',
      demandLevel: 'medium',
      successStories: 87
    }
  ],
  '안전': [
    {
      id: 'safety-to-consultant',
      title: '안전관리 컨설턴트',
      fromRole: '안전관리자',
      toRole: 'ESG/안전 컨설턴트',
      description: '중소기업 대상 안전관리 시스템 구축 및 ESG 대응을 지원합니다.',
      physicalDemand: 'low',
      experienceUtilization: 100,
      courses: [
        { id: '7', title: 'ESG 경영 전문가 과정', duration: '6주', provider: 'KPC' },
        { id: '8', title: '중대재해처벌법 대응 실무', duration: '2주', provider: '안전보건공단' }
      ],
      benefits: ['높은 수요', 'ESG 트렌드 부합', '프리랜서 가능', '법적 전문성'],
      avgSalary: '월 500~800만원',
      demandLevel: 'high',
      successStories: 156
    }
  ],
  '품질': [
    {
      id: 'qc-to-auditor',
      title: 'ISO 심사원',
      fromRole: '품질관리자',
      toRole: '인증심사원',
      description: '다양한 기업의 품질경영시스템을 심사하고 인증합니다.',
      physicalDemand: 'low',
      experienceUtilization: 90,
      courses: [
        { id: '9', title: 'ISO 9001 선임심사원', duration: '5일', provider: 'KAB' },
        { id: '10', title: '심사 기법 고급과정', duration: '3일', provider: 'KSA' }
      ],
      benefits: ['출장 위주 업무', '높은 일당', '전문가 인정', '지속적 학습'],
      avgSalary: '일당 30~50만원',
      demandLevel: 'medium',
      successStories: 78
    }
  ],
  '자동화': [
    {
      id: 'auto-to-trainer',
      title: 'PLC 교육강사',
      fromRole: '자동화 엔지니어',
      toRole: '기술교육 전문강사',
      description: '미래 자동화 인력을 양성하는 교육자로 전환합니다.',
      physicalDemand: 'low',
      experienceUtilization: 95,
      courses: [
        { id: '11', title: '직업훈련교사 자격과정', duration: '8주', provider: '폴리텍대학' },
        { id: '12', title: '교육과정 개발 실무', duration: '2주', provider: '직업능력개발원' }
      ],
      benefits: ['안정적 고용', '사회적 보람', '방학 존재', '연금 혜택'],
      avgSalary: '월 350~500만원',
      demandLevel: 'high',
      successStories: 112
    }
  ]
}

// Physical demand labels
const physicalDemandLabels = {
  low: { label: '낮음', color: 'text-green-600 bg-green-100', icon: '✅' },
  medium: { label: '보통', color: 'text-yellow-600 bg-yellow-100', icon: '⚠️' },
  high: { label: '높음', color: 'text-red-600 bg-red-100', icon: '❌' }
}

const demandLevelLabels = {
  high: { label: '수요 많음', color: 'text-green-600' },
  medium: { label: '수요 보통', color: 'text-yellow-600' },
  low: { label: '수요 적음', color: 'text-red-600' }
}

export default function RegrowthTrack() {
  const { userProfile } = useVerification()
  const [selectedPath, setSelectedPath] = useState<TransitionPath | null>(null)
  const [showAll, setShowAll] = useState(false)

  const isEligible = isEligibleForRegrowth(userProfile)
  const primarySkill = userProfile?.primarySkill || '용접'
  const paths = regrowthPaths[primarySkill] || regrowthPaths['용접']

  if (!isEligible) {
    return null // Don't show for users under 50
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-green-200 bg-gradient-to-r from-green-100 to-emerald-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-xl">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-green-900">인생 2막 추천</h3>
                <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                  Re-growth 🌱
                </span>
              </div>
              <p className="text-sm text-green-700">
                {userProfile?.experienceYears}년 {primarySkill} 경력을 활용한 전환 경로
              </p>
            </div>
          </div>
          <ReadAloudButton
            text={`인생 2막 추천. ${userProfile?.experienceYears}년 ${primarySkill} 경력을 활용한 전환 경로를 안내해드립니다.`}
            variant="icon"
          />
        </div>
      </div>

      {/* Why Re-growth */}
      <div className="p-5 border-b border-green-200 bg-white/50">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-900 mb-2">왜 Re-growth인가요?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 text-green-800">
                <TrendingDown className="w-4 h-4" />
                <span>육체적 부담 감소</span>
              </div>
              <div className="flex items-center gap-2 text-green-800">
                <Award className="w-4 h-4" />
                <span>경험 가치 극대화</span>
              </div>
              <div className="flex items-center gap-2 text-green-800">
                <Heart className="w-4 h-4" />
                <span>지속 가능한 경력</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transition Paths */}
      <div className="p-5">
        <div className="space-y-4">
          {paths.slice(0, showAll ? paths.length : 2).map((path) => (
            <div
              key={path.id}
              className={`p-4 bg-white rounded-xl border-2 transition-all cursor-pointer ${
                selectedPath?.id === path.id
                  ? 'border-green-500 shadow-lg'
                  : 'border-transparent hover:border-green-300'
              }`}
              onClick={() => setSelectedPath(selectedPath?.id === path.id ? null : path)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{path.title}</h4>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${physicalDemandLabels[path.physicalDemand].color}`}>
                      체력 부담 {physicalDemandLabels[path.physicalDemand].label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span className="font-medium">{path.fromRole}</span>
                    <ArrowRight className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-green-700">{path.toRole}</span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">{path.description}</p>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Target className="w-4 h-4" />
                      경험 활용도 {path.experienceUtilization}%
                    </span>
                    <span className={`flex items-center gap-1 ${demandLevelLabels[path.demandLevel].color}`}>
                      <TrendingDown className="w-4 h-4 rotate-180" />
                      {demandLevelLabels[path.demandLevel].label}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <Users className="w-4 h-4" />
                      {path.successStories}명 전환 성공
                    </span>
                  </div>
                </div>

                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                  selectedPath?.id === path.id ? 'rotate-90' : ''
                }`} />
              </div>

              {/* Expanded Details */}
              {selectedPath?.id === path.id && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  {/* Benefits */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      전환 장점
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {path.benefits.map((benefit, i) => (
                        <span key={i} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          ✓ {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Required Courses */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      필요 교육과정
                    </h5>
                    <div className="space-y-2">
                      {path.courses.map((course) => (
                        <Link
                          key={course.id}
                          href={`/skillbridge/${course.id}`}
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div>
                            <p className="font-medium text-gray-900">{course.title}</p>
                            <p className="text-sm text-gray-500">{course.provider} · {course.duration}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-blue-500" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Salary Info */}
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <span className="font-medium">예상 수입:</span> {path.avgSalary}
                    </p>
                  </div>

                  {/* CTA */}
                  <Link
                    href="/skillbridge/learning-path"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Sprout className="w-5 h-5" />
                    이 경로로 시작하기
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {paths.length > 2 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-4 py-2 text-green-600 font-medium hover:text-green-700"
          >
            {showAll ? '접기' : `더 많은 전환 경로 보기 (${paths.length - 2}개)`}
          </button>
        )}
      </div>

      {/* Success Story Preview */}
      <div className="p-5 bg-gradient-to-r from-green-100 to-emerald-100 border-t border-green-200">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h4 className="font-semibold text-green-900">성공 사례</h4>
        </div>
        <div className="p-4 bg-white rounded-lg">
          <p className="text-gray-700 text-sm italic">
            &ldquo;25년간 용접 현장에서 일하다 허리 문제로 고민이 많았습니다.
            SkillBridge의 Re-growth 프로그램으로 안전교육 강사로 전환했고,
            이제는 후배들을 가르치며 새로운 보람을 느끼고 있습니다.&rdquo;
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold">
              김
            </div>
            <div>
              <p className="font-medium text-gray-900">김OO (57세)</p>
              <p className="text-xs text-gray-500">용접기술자 → 안전교육강사</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact version for sidebar/widgets
export function RegrowthBadge() {
  const { userProfile } = useVerification()
  const isEligible = isEligibleForRegrowth(userProfile)

  if (!isEligible) return null

  return (
    <Link
      href="/skillbridge/learning-path"
      className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
    >
      <Sprout className="w-5 h-5" />
      <span className="font-medium text-sm">인생 2막 추천 보기</span>
      <ChevronRight className="w-4 h-4" />
    </Link>
  )
}
