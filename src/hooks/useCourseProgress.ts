'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export interface Attendance {
  id: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  check_in_time?: string
  check_out_time?: string
}

export interface Assignment {
  id: string
  title: string
  description: string
  due_date: string
  status: 'pending' | 'submitted' | 'graded'
  score?: number
  max_score: number
  submitted_at?: string
  feedback?: string
}

export interface Milestone {
  id: string
  title: string
  description: string
  target_date: string
  completed: boolean
  completed_at?: string
}

export interface CourseProgress {
  id: string
  user_id: string
  course_id: string
  course_title: string
  enrollment_status: 'enrolled' | 'in_progress' | 'completed' | 'dropped'
  start_date: string
  end_date: string
  attendance_rate: number
  assignment_completion_rate: number
  overall_progress: number
  current_week: number
  total_weeks: number
  attendance: Attendance[]
  assignments: Assignment[]
  milestones: Milestone[]
  last_activity?: string
}

// Mock progress data for demo
const generateMockProgress = (courseId: string): CourseProgress => {
  const startDate = new Date('2024-01-15')
  const endDate = new Date('2024-04-15')
  const today = new Date()
  const totalWeeks = 12
  const currentWeek = Math.min(
    Math.ceil((today.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)),
    totalWeeks
  )

  // Generate attendance records
  const attendance: Attendance[] = []
  for (let i = 0; i < currentWeek * 5; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      const random = Math.random()
      attendance.push({
        id: `att-${i}`,
        date: date.toISOString().split('T')[0],
        status: random > 0.1 ? 'present' : random > 0.05 ? 'late' : 'absent',
        check_in_time: random > 0.1 ? '09:00' : undefined,
        check_out_time: random > 0.1 ? '18:00' : undefined,
      })
    }
  }

  // Generate assignments
  const assignments: Assignment[] = [
    {
      id: 'asn-1',
      title: '용접 기초 이론 퀴즈',
      description: '용접의 원리와 종류에 대한 이해도 평가',
      due_date: '2024-01-25',
      status: 'graded',
      score: 85,
      max_score: 100,
      submitted_at: '2024-01-24',
      feedback: '전반적으로 잘 이해하고 있습니다. 용접 결함 부분 복습 권장.',
    },
    {
      id: 'asn-2',
      title: '안전 수칙 레포트',
      description: '작업장 안전 수칙 및 보호구 착용 방법 정리',
      due_date: '2024-02-01',
      status: 'graded',
      score: 92,
      max_score: 100,
      submitted_at: '2024-01-31',
      feedback: '상세하고 체계적인 정리입니다.',
    },
    {
      id: 'asn-3',
      title: '비드 쌓기 실습 평가',
      description: '수평 비드 쌓기 실습 결과물 평가',
      due_date: '2024-02-15',
      status: 'graded',
      score: 78,
      max_score: 100,
      submitted_at: '2024-02-14',
      feedback: '비드 폭 일정성 개선 필요. 추가 연습 권장.',
    },
    {
      id: 'asn-4',
      title: '필릿 용접 실습',
      description: 'T-Joint 필릿 용접 실습',
      due_date: '2024-02-28',
      status: 'submitted',
      max_score: 100,
      submitted_at: '2024-02-27',
    },
    {
      id: 'asn-5',
      title: '수직 용접 실습',
      description: '수직 상향 용접 실습 평가',
      due_date: '2024-03-15',
      status: 'pending',
      max_score: 100,
    },
  ]

  // Generate milestones
  const milestones: Milestone[] = [
    {
      id: 'ms-1',
      title: '오리엔테이션 완료',
      description: '교육 과정 안내 및 안전 교육',
      target_date: '2024-01-15',
      completed: true,
      completed_at: '2024-01-15',
    },
    {
      id: 'ms-2',
      title: '기초 이론 학습',
      description: '용접의 기초 이론 및 원리 이해',
      target_date: '2024-01-31',
      completed: true,
      completed_at: '2024-01-30',
    },
    {
      id: 'ms-3',
      title: '기초 실습 완료',
      description: '비드 쌓기 및 수평 필릿 용접 실습',
      target_date: '2024-02-28',
      completed: true,
      completed_at: '2024-02-25',
    },
    {
      id: 'ms-4',
      title: '심화 실습 완료',
      description: '수직, 위보기 용접 실습',
      target_date: '2024-03-31',
      completed: false,
    },
    {
      id: 'ms-5',
      title: '모의 시험 통과',
      description: '실기 모의 시험 합격',
      target_date: '2024-04-07',
      completed: false,
    },
    {
      id: 'ms-6',
      title: '과정 수료',
      description: '전체 교육 과정 수료',
      target_date: '2024-04-15',
      completed: false,
    },
  ]

  const presentCount = attendance.filter(
    (a) => a.status === 'present' || a.status === 'late'
  ).length
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 100

  const completedAssignments = assignments.filter(
    (a) => a.status === 'graded' || a.status === 'submitted'
  ).length
  const assignmentCompletionRate = Math.round((completedAssignments / assignments.length) * 100)

  const completedMilestones = milestones.filter((m) => m.completed).length
  const overallProgress = Math.round((completedMilestones / milestones.length) * 100)

  return {
    id: `progress-${courseId}`,
    user_id: 'user1',
    course_id: courseId,
    course_title: '아크 용접 기능사 자격증 취득반',
    enrollment_status: 'in_progress',
    start_date: '2024-01-15',
    end_date: '2024-04-15',
    attendance_rate: attendanceRate,
    assignment_completion_rate: assignmentCompletionRate,
    overall_progress: overallProgress,
    current_week: Math.min(currentWeek, totalWeeks),
    total_weeks: totalWeeks,
    attendance,
    assignments,
    milestones,
    last_activity: new Date().toISOString(),
  }
}

// Mock enrolled courses
const mockEnrolledCourses: string[] = ['1', '3']

export function useCourseProgress(courseId?: string) {
  const { user } = useAuth()
  const [progress, setProgress] = useState<CourseProgress | null>(null)
  const [allProgress, setAllProgress] = useState<CourseProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes('your-project-id')

  // Fetch progress for a specific course
  const fetchProgress = useCallback(async () => {
    if (!courseId) return

    setLoading(true)
    setError(null)

    try {
      if (!isSupabaseConfigured) {
        // Use mock data
        const stored = localStorage.getItem(`courseProgress_${courseId}`)
        if (stored) {
          setProgress(JSON.parse(stored))
        } else if (mockEnrolledCourses.includes(courseId)) {
          const mockData = generateMockProgress(courseId)
          setProgress(mockData)
          localStorage.setItem(`courseProgress_${courseId}`, JSON.stringify(mockData))
        } else {
          setProgress(null)
        }
        return
      }

      if (!user) {
        setProgress(null)
        return
      }

      const { data, error: fetchError } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single()

      if (fetchError) throw fetchError
      setProgress(data)
    } catch (err) {
      console.error('Failed to fetch course progress:', err)
      setError('진행 상황을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [courseId, user, isSupabaseConfigured])

  // Fetch all progress for user
  const fetchAllProgress = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      if (!isSupabaseConfigured) {
        // Use mock data for enrolled courses
        const progressList: CourseProgress[] = []
        for (const cid of mockEnrolledCourses) {
          const stored = localStorage.getItem(`courseProgress_${cid}`)
          if (stored) {
            progressList.push(JSON.parse(stored))
          } else {
            const mockData = generateMockProgress(cid)
            progressList.push(mockData)
            localStorage.setItem(`courseProgress_${cid}`, JSON.stringify(mockData))
          }
        }
        setAllProgress(progressList)
        return
      }

      if (!user) {
        setAllProgress([])
        return
      }

      const { data, error: fetchError } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('last_activity', { ascending: false })

      if (fetchError) throw fetchError
      setAllProgress(data || [])
    } catch (err) {
      console.error('Failed to fetch all progress:', err)
      setError('진행 상황을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [user, isSupabaseConfigured])

  // Mark attendance
  const markAttendance = async (status: Attendance['status']) => {
    if (!progress || !courseId) return

    const newAttendance: Attendance = {
      id: `att-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status,
      check_in_time: status !== 'absent' ? new Date().toTimeString().slice(0, 5) : undefined,
    }

    const updatedProgress = {
      ...progress,
      attendance: [...progress.attendance, newAttendance],
      last_activity: new Date().toISOString(),
    }

    // Recalculate attendance rate
    const presentCount = updatedProgress.attendance.filter(
      (a) => a.status === 'present' || a.status === 'late'
    ).length
    updatedProgress.attendance_rate = Math.round(
      (presentCount / updatedProgress.attendance.length) * 100
    )

    setProgress(updatedProgress)
    localStorage.setItem(`courseProgress_${courseId}`, JSON.stringify(updatedProgress))

    return newAttendance
  }

  // Submit assignment
  const submitAssignment = async (assignmentId: string) => {
    if (!progress || !courseId) return

    const updatedAssignments = progress.assignments.map((a) =>
      a.id === assignmentId
        ? { ...a, status: 'submitted' as const, submitted_at: new Date().toISOString() }
        : a
    )

    const updatedProgress = {
      ...progress,
      assignments: updatedAssignments,
      last_activity: new Date().toISOString(),
    }

    // Recalculate assignment completion rate
    const completed = updatedAssignments.filter(
      (a) => a.status === 'graded' || a.status === 'submitted'
    ).length
    updatedProgress.assignment_completion_rate = Math.round(
      (completed / updatedAssignments.length) * 100
    )

    setProgress(updatedProgress)
    localStorage.setItem(`courseProgress_${courseId}`, JSON.stringify(updatedProgress))
  }

  // Complete milestone
  const completeMilestone = async (milestoneId: string) => {
    if (!progress || !courseId) return

    const updatedMilestones = progress.milestones.map((m) =>
      m.id === milestoneId
        ? { ...m, completed: true, completed_at: new Date().toISOString() }
        : m
    )

    const updatedProgress = {
      ...progress,
      milestones: updatedMilestones,
      last_activity: new Date().toISOString(),
    }

    // Recalculate overall progress
    const completed = updatedMilestones.filter((m) => m.completed).length
    updatedProgress.overall_progress = Math.round((completed / updatedMilestones.length) * 100)

    // Check if course is completed
    if (updatedProgress.overall_progress === 100) {
      updatedProgress.enrollment_status = 'completed'
    }

    setProgress(updatedProgress)
    localStorage.setItem(`courseProgress_${courseId}`, JSON.stringify(updatedProgress))
  }

  useEffect(() => {
    if (courseId) {
      fetchProgress()
    } else {
      fetchAllProgress()
    }
  }, [courseId, fetchProgress, fetchAllProgress])

  return {
    progress,
    allProgress,
    loading,
    error,
    markAttendance,
    submitAssignment,
    completeMilestone,
    refetch: courseId ? fetchProgress : fetchAllProgress,
  }
}

// Helper functions
export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return 'text-emerald-400'
  if (percentage >= 60) return 'text-amber-400'
  return 'text-red-400'
}

export function getProgressBgColor(percentage: number): string {
  if (percentage >= 80) return 'bg-emerald-500'
  if (percentage >= 60) return 'bg-amber-500'
  return 'bg-red-500'
}

export function getStatusText(status: CourseProgress['enrollment_status']): {
  text: string
  color: string
} {
  switch (status) {
    case 'enrolled':
      return { text: '등록됨', color: 'bg-blue-500/20 text-blue-400' }
    case 'in_progress':
      return { text: '수강 중', color: 'bg-violet-500/20 text-violet-400' }
    case 'completed':
      return { text: '수료', color: 'bg-emerald-500/20 text-emerald-400' }
    case 'dropped':
      return { text: '중단', color: 'bg-red-500/20 text-red-400' }
    default:
      return { text: status, color: 'bg-slate-500/20 text-slate-400' }
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
