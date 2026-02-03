'use client'

import { useState, useEffect, useCallback } from 'react'
import { courses, Course } from '@/data/courses'
import { jobPostings, getRecommendedCoursesForJob } from '@/data/jobs'
import { useAuth, useAssessment } from './useAuth'

export interface RecommendationReason {
  type: 'skill_gap' | 'career_goal' | 'popular' | 'job_match' | 'trending'
  description: string
}

export interface CourseRecommendation {
  course: Course
  score: number
  reasons: RecommendationReason[]
  matchedSkills: string[]
  missingSkills: string[]
}

export interface CareerGoal {
  id: string
  title: string
  description: string
  requiredSkills: string[]
  recommendedCourses: string[]
}

// Career paths with required skills
export const careerGoals: CareerGoal[] = [
  {
    id: 'welder',
    title: '용접 기술자',
    description: '제조업 핵심 인력으로 성장하세요',
    requiredSkills: ['아크용접', 'TIG용접', 'MIG용접', '도면해독', '품질검사'],
    recommendedCourses: ['1', '7'],
  },
  {
    id: 'cnc-operator',
    title: 'CNC 가공 전문가',
    description: '정밀가공 분야의 전문가로 성장하세요',
    requiredSkills: ['CNC선반', 'CNC밀링', 'CAM', 'G코드', '정밀측정'],
    recommendedCourses: ['2', '8'],
  },
  {
    id: 'qa-engineer',
    title: '품질관리 전문가',
    description: '품질보증 분야의 전문가로 성장하세요',
    requiredSkills: ['품질관리', 'SPC', 'ISO', '6시그마', 'FMEA'],
    recommendedCourses: ['3'],
  },
  {
    id: 'automation-engineer',
    title: '자동화 엔지니어',
    description: '스마트팩토리 시대의 핵심 인력이 되세요',
    requiredSkills: ['PLC', 'HMI', '자동화', '로봇', '센서'],
    recommendedCourses: ['4', '7', '12'],
  },
  {
    id: 'safety-manager',
    title: '산업안전 관리자',
    description: '안전한 작업환경을 만드는 전문가가 되세요',
    requiredSkills: ['안전관리', '위험성평가', '산업안전법', '응급처치'],
    recommendedCourses: ['5', '9'],
  },
  {
    id: 'smart-factory',
    title: '스마트팩토리 전문가',
    description: '4차 산업혁명 시대의 리더가 되세요',
    requiredSkills: ['IoT', 'MES', '데이터분석', 'PLC', '자동화'],
    recommendedCourses: ['12', '4', '7'],
  },
]

// Skill to course mapping for recommendations
const skillToCourseMap: Record<string, string[]> = {
  '용접': ['1'],
  '아크용접': ['1'],
  'TIG용접': ['1'],
  'CNC': ['2'],
  '기계가공': ['2'],
  '품질관리': ['3'],
  'QC': ['3'],
  'SPC': ['3'],
  'PLC': ['4'],
  '자동화': ['4'],
  '안전': ['5'],
  '위험물': ['5'],
  '전기': ['6'],
  '전기설비': ['6'],
  '로봇': ['7'],
  '산업용로봇': ['7'],
  'CAD': ['8'],
  '기계설계': ['8'],
  '에너지': ['9'],
  '에너지관리': ['9'],
  '사출': ['10'],
  '금형': ['10'],
  '반도체': ['11'],
  '클린룸': ['11'],
  '스마트팩토리': ['12'],
  'IoT': ['12'],
  'MES': ['12'],
}

export function useRecommendations() {
  const { user } = useAuth()
  const { getLatestAssessment } = useAssessment()
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGoal, setSelectedGoal] = useState<CareerGoal | null>(null)

  // Get user's weak skills from assessment
  const getWeakSkills = useCallback(async () => {
    const assessment = await getLatestAssessment()
    if (!assessment) return []

    const weakSkills: string[] = []
    Object.entries(assessment.scores).forEach(([skill, score]) => {
      if ((score as number) < 3) {
        weakSkills.push(skill)
      }
    })
    return weakSkills
  }, [getLatestAssessment])

  // Get user's strong skills from assessment
  const getStrongSkills = useCallback(async () => {
    const assessment = await getLatestAssessment()
    if (!assessment) return []

    const strongSkills: string[] = []
    Object.entries(assessment.scores).forEach(([skill, score]) => {
      if ((score as number) >= 3) {
        strongSkills.push(skill)
      }
    })
    return strongSkills
  }, [getLatestAssessment])

  // Calculate recommendations based on various factors
  const calculateRecommendations = useCallback(async () => {
    setLoading(true)

    try {
      const weakSkills = await getWeakSkills()
      const strongSkills = await getStrongSkills()

      const recommendationMap = new Map<string, CourseRecommendation>()

      // 1. Recommend courses based on skill gaps
      for (const skill of weakSkills) {
        const courseIds = skillToCourseMap[skill] || []
        for (const courseId of courseIds) {
          const course = courses[courseId]
          if (!course) continue

          const existing = recommendationMap.get(courseId)
          if (existing) {
            existing.score += 20
            existing.missingSkills.push(skill)
            if (!existing.reasons.some((r) => r.type === 'skill_gap')) {
              existing.reasons.push({
                type: 'skill_gap',
                description: '역량 진단에서 부족한 스킬을 보완할 수 있습니다',
              })
            }
          } else {
            recommendationMap.set(courseId, {
              course,
              score: 20,
              reasons: [
                {
                  type: 'skill_gap',
                  description: '역량 진단에서 부족한 스킬을 보완할 수 있습니다',
                },
              ],
              matchedSkills: [],
              missingSkills: [skill],
            })
          }
        }
      }

      // 2. Recommend courses based on career goal
      if (selectedGoal) {
        for (const courseId of selectedGoal.recommendedCourses) {
          const course = courses[courseId]
          if (!course) continue

          const existing = recommendationMap.get(courseId)
          if (existing) {
            existing.score += 30
            existing.reasons.push({
              type: 'career_goal',
              description: `${selectedGoal.title} 목표에 필요한 교육입니다`,
            })
          } else {
            recommendationMap.set(courseId, {
              course,
              score: 30,
              reasons: [
                {
                  type: 'career_goal',
                  description: `${selectedGoal.title} 목표에 필요한 교육입니다`,
                },
              ],
              matchedSkills: [],
              missingSkills: [],
            })
          }
        }
      }

      // 3. Recommend popular courses
      const popularCourseIds = ['1', '4', '12']
      for (const courseId of popularCourseIds) {
        const course = courses[courseId]
        if (!course) continue

        const existing = recommendationMap.get(courseId)
        if (existing) {
          existing.score += 10
          if (!existing.reasons.some((r) => r.type === 'popular')) {
            existing.reasons.push({
              type: 'popular',
              description: '인기 교육과정입니다',
            })
          }
        } else {
          recommendationMap.set(courseId, {
            course,
            score: 10,
            reasons: [
              {
                type: 'popular',
                description: '인기 교육과정입니다',
              },
            ],
            matchedSkills: [],
            missingSkills: [],
          })
        }
      }

      // 4. Match with job postings
      Object.values(jobPostings).forEach((job) => {
        const courseIds = getRecommendedCoursesForJob(job)
        for (const courseId of courseIds) {
          const course = courses[courseId]
          if (!course) continue

          const existing = recommendationMap.get(courseId)
          if (existing) {
            existing.score += 15
            if (!existing.reasons.some((r) => r.type === 'job_match')) {
              existing.reasons.push({
                type: 'job_match',
                description: `${job.company_name}의 ${job.title} 채용에 도움이 됩니다`,
              })
            }
          } else {
            recommendationMap.set(courseId, {
              course,
              score: 15,
              reasons: [
                {
                  type: 'job_match',
                  description: `${job.company_name}의 ${job.title} 채용에 도움이 됩니다`,
                },
              ],
              matchedSkills: [],
              missingSkills: [],
            })
          }
        }
      })

      // 5. Trending courses (newest or high rating)
      const trendingIds = ['12', '7', '11']
      for (const courseId of trendingIds) {
        const course = courses[courseId]
        if (!course) continue

        const existing = recommendationMap.get(courseId)
        if (existing) {
          existing.score += 5
          if (!existing.reasons.some((r) => r.type === 'trending')) {
            existing.reasons.push({
              type: 'trending',
              description: '최근 인기가 상승하는 교육입니다',
            })
          }
        } else {
          recommendationMap.set(courseId, {
            course,
            score: 5,
            reasons: [
              {
                type: 'trending',
                description: '최근 인기가 상승하는 교육입니다',
              },
            ],
            matchedSkills: [],
            missingSkills: [],
          })
        }
      }

      // Sort by score and return top recommendations
      const sorted = Array.from(recommendationMap.values()).sort((a, b) => b.score - a.score)
      setRecommendations(sorted.slice(0, 8))
    } finally {
      setLoading(false)
    }
  }, [getWeakSkills, getStrongSkills, selectedGoal])

  // Set career goal
  const setCareerGoal = useCallback((goalId: string | null) => {
    if (goalId === null) {
      setSelectedGoal(null)
      localStorage.removeItem('careerGoal')
    } else {
      const goal = careerGoals.find((g) => g.id === goalId)
      if (goal) {
        setSelectedGoal(goal)
        localStorage.setItem('careerGoal', goalId)
      }
    }
  }, [])

  // Load saved career goal
  useEffect(() => {
    const savedGoal = localStorage.getItem('careerGoal')
    if (savedGoal) {
      const goal = careerGoals.find((g) => g.id === savedGoal)
      if (goal) {
        setSelectedGoal(goal)
      }
    }
  }, [])

  // Calculate recommendations when goal or user changes
  useEffect(() => {
    calculateRecommendations()
  }, [calculateRecommendations])

  // Get roadmap for career goal
  const getRoadmap = useCallback((goalId: string) => {
    const goal = careerGoals.find((g) => g.id === goalId)
    if (!goal) return []

    return goal.recommendedCourses
      .map((id) => courses[id])
      .filter(Boolean)
      .map((course, idx) => ({
        step: idx + 1,
        course,
        skills: goal.requiredSkills.slice(idx * 2, (idx + 1) * 2),
      }))
  }, [])

  return {
    recommendations,
    loading,
    selectedGoal,
    careerGoals,
    setCareerGoal,
    getRoadmap,
    refresh: calculateRecommendations,
  }
}

// Helper functions
export function getReasonIcon(type: RecommendationReason['type']): string {
  switch (type) {
    case 'skill_gap':
      return '📈'
    case 'career_goal':
      return '🎯'
    case 'popular':
      return '⭐'
    case 'job_match':
      return '💼'
    case 'trending':
      return '🔥'
    default:
      return '✨'
  }
}

export function getReasonColor(type: RecommendationReason['type']): string {
  switch (type) {
    case 'skill_gap':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    case 'career_goal':
      return 'bg-violet-500/20 text-violet-400 border-violet-500/30'
    case 'popular':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    case 'job_match':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'trending':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }
}
