'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

interface ApplicationData {
  courseId: string
  notes?: string
}

interface Application {
  id: string
  course_id: string
  user_id: string
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
  applied_at: string
  notes?: string
}

export function useCourseApplication() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes('your-project-id')

  const applyForCourse = async (data: ApplicationData): Promise<Application | null> => {
    setLoading(true)
    setError(null)

    try {
      if (!isSupabaseConfigured) {
        // Mock application for demo
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockApplication: Application = {
          id: `mock-${Date.now()}`,
          course_id: data.courseId,
          user_id: user?.id || 'guest',
          status: 'pending',
          applied_at: new Date().toISOString(),
          notes: data.notes,
        }

        // Store in localStorage for demo purposes
        const applications = JSON.parse(localStorage.getItem('course_applications') || '[]')
        applications.push(mockApplication)
        localStorage.setItem('course_applications', JSON.stringify(applications))

        return mockApplication
      }

      if (!user) {
        throw new Error('로그인이 필요합니다')
      }

      const { data: application, error: insertError } = await supabase
        .from('course_applications')
        .insert({
          course_id: data.courseId,
          user_id: user.id,
          notes: data.notes,
          status: 'pending',
        })
        .select()
        .single()

      if (insertError) throw insertError

      return application
    } catch (err) {
      const message = err instanceof Error ? err.message : '신청 중 오류가 발생했습니다'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const cancelApplication = async (applicationId: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      if (!isSupabaseConfigured) {
        // Mock cancellation
        await new Promise((resolve) => setTimeout(resolve, 500))

        const applications = JSON.parse(localStorage.getItem('course_applications') || '[]')
        const updatedApplications = applications.map((app: Application) =>
          app.id === applicationId ? { ...app, status: 'cancelled' } : app
        )
        localStorage.setItem('course_applications', JSON.stringify(updatedApplications))

        return true
      }

      const { error: updateError } = await supabase
        .from('course_applications')
        .update({ status: 'cancelled' })
        .eq('id', applicationId)
        .eq('user_id', user?.id)

      if (updateError) throw updateError

      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : '취소 중 오류가 발생했습니다'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const getMyApplications = async (): Promise<Application[]> => {
    setLoading(true)
    setError(null)

    try {
      if (!isSupabaseConfigured) {
        // Return mock applications from localStorage
        const applications = JSON.parse(localStorage.getItem('course_applications') || '[]')
        return applications
      }

      if (!user) {
        return []
      }

      const { data: applications, error: fetchError } = await supabase
        .from('course_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false })

      if (fetchError) throw fetchError

      return applications || []
    } catch (err) {
      const message = err instanceof Error ? err.message : '신청 내역 조회 중 오류가 발생했습니다'
      setError(message)
      return []
    } finally {
      setLoading(false)
    }
  }

  const checkApplicationStatus = async (courseId: string): Promise<Application | null> => {
    try {
      if (!isSupabaseConfigured) {
        const applications = JSON.parse(localStorage.getItem('course_applications') || '[]')
        return applications.find((app: Application) => app.course_id === courseId) || null
      }

      if (!user) {
        return null
      }

      const { data: application, error: fetchError } = await supabase
        .from('course_applications')
        .select('*')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      return application || null
    } catch (err) {
      return null
    }
  }

  return {
    applyForCourse,
    cancelApplication,
    getMyApplications,
    checkApplicationStatus,
    loading,
    error,
  }
}
