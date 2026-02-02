'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

interface Review {
  id: string
  course_id: string
  user_id: string
  rating: number
  content: string
  created_at: string
  user_name?: string
}

interface CreateReviewData {
  courseId: string
  rating: number
  content: string
}

export function useCourseReviews(courseId?: string) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes('your-project-id')

  // Mock reviews for demo
  const mockReviews: Review[] = [
    {
      id: 'mock-1',
      course_id: '1',
      user_id: 'user-1',
      rating: 5,
      content: '실무에 바로 적용할 수 있는 내용이 많아서 좋았습니다. 강사님의 설명이 명확하고 이해하기 쉬웠어요.',
      created_at: '2024-01-15T09:00:00Z',
      user_name: '김철수',
    },
    {
      id: 'mock-2',
      course_id: '1',
      user_id: 'user-2',
      rating: 4,
      content: '용접 기초부터 실기까지 체계적으로 배울 수 있었습니다. 자격증 취득에 큰 도움이 되었습니다.',
      created_at: '2024-01-10T14:30:00Z',
      user_name: '이영희',
    },
    {
      id: 'mock-3',
      course_id: '1',
      user_id: 'user-3',
      rating: 5,
      content: '국비지원으로 무료로 들을 수 있어서 좋았고, 실습 위주의 수업이라 실력이 많이 늘었습니다.',
      created_at: '2024-01-05T11:00:00Z',
      user_name: '박민수',
    },
  ]

  const getReviews = async (targetCourseId?: string): Promise<Review[]> => {
    const id = targetCourseId || courseId
    if (!id) return []

    setLoading(true)
    setError(null)

    try {
      if (!isSupabaseConfigured) {
        // Return mock reviews filtered by course
        await new Promise((resolve) => setTimeout(resolve, 300))
        const storedReviews = JSON.parse(localStorage.getItem('course_reviews') || '[]')
        const allReviews = [...mockReviews, ...storedReviews]
        return allReviews.filter((r: Review) => r.course_id === id)
      }

      const { data, error: fetchError } = await supabase
        .from('course_reviews')
        .select('*, users(name)')
        .eq('course_id', id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      return data?.map((r) => ({
        ...r,
        user_name: r.users?.name || '익명',
      })) || []
    } catch (err) {
      const message = err instanceof Error ? err.message : '리뷰 조회 중 오류가 발생했습니다'
      setError(message)
      return []
    } finally {
      setLoading(false)
    }
  }

  const createReview = async (data: CreateReviewData): Promise<Review | null> => {
    setLoading(true)
    setError(null)

    try {
      if (!isSupabaseConfigured) {
        // Mock review creation
        await new Promise((resolve) => setTimeout(resolve, 500))

        const newReview: Review = {
          id: `mock-${Date.now()}`,
          course_id: data.courseId,
          user_id: user?.id || 'guest',
          rating: data.rating,
          content: data.content,
          created_at: new Date().toISOString(),
          user_name: user?.user_metadata?.name || user?.email?.split('@')[0] || '게스트',
        }

        const storedReviews = JSON.parse(localStorage.getItem('course_reviews') || '[]')
        storedReviews.unshift(newReview)
        localStorage.setItem('course_reviews', JSON.stringify(storedReviews))

        return newReview
      }

      if (!user) {
        throw new Error('로그인이 필요합니다')
      }

      const { data: review, error: insertError } = await supabase
        .from('course_reviews')
        .insert({
          course_id: data.courseId,
          user_id: user.id,
          rating: data.rating,
          content: data.content,
        })
        .select()
        .single()

      if (insertError) throw insertError

      return review
    } catch (err) {
      const message = err instanceof Error ? err.message : '리뷰 작성 중 오류가 발생했습니다'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getAverageRating = async (targetCourseId?: string): Promise<{ average: number; count: number }> => {
    const id = targetCourseId || courseId
    if (!id) return { average: 0, count: 0 }

    try {
      if (!isSupabaseConfigured) {
        const storedReviews = JSON.parse(localStorage.getItem('course_reviews') || '[]')
        const allReviews = [...mockReviews, ...storedReviews].filter((r: Review) => r.course_id === id)

        if (allReviews.length === 0) return { average: 0, count: 0 }

        const sum = allReviews.reduce((acc: number, r: Review) => acc + r.rating, 0)
        return { average: sum / allReviews.length, count: allReviews.length }
      }

      const { data, error: fetchError } = await supabase
        .from('course_reviews')
        .select('rating')
        .eq('course_id', id)

      if (fetchError) throw fetchError

      if (!data || data.length === 0) return { average: 0, count: 0 }

      const sum = data.reduce((acc, r) => acc + r.rating, 0)
      return { average: sum / data.length, count: data.length }
    } catch {
      return { average: 0, count: 0 }
    }
  }

  return {
    getReviews,
    createReview,
    getAverageRating,
    loading,
    error,
  }
}
