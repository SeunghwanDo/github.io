'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { SkillCourse } from '@/types/supabase'
import { courses as coursesData, Course, getCoursesByCategory, searchCourses } from '@/data/courses'

// Convert Course to SkillCourse format for compatibility
function toSkillCourse(course: Course): SkillCourse {
  return {
    id: course.id,
    title: course.title,
    provider_name: course.provider_name,
    category: course.category,
    duration: course.duration,
    cost: course.cost,
    location: course.location,
    start_date: course.start_date,
    status: course.status,
    thumbnail_url: course.thumbnail_url,
    description: course.description,
    rating: course.rating,
    students: course.students,
    capacity: course.capacity,
    created_at: new Date().toISOString(),
  }
}

interface UseCoursesOptions {
  category?: string
  search?: string
}

export function useCourses(options: UseCoursesOptions = {}) {
  const [courses, setCourses] = useState<SkillCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true)
        setError(null)

        // Check if Supabase is configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
          // Use local data
          let filteredCourses: Course[]

          if (options.search) {
            filteredCourses = searchCourses(options.search)
          } else if (options.category && options.category !== 'all') {
            filteredCourses = getCoursesByCategory(options.category)
          } else {
            filteredCourses = Object.values(coursesData)
          }

          // Apply both filters if both exist
          if (options.search && options.category && options.category !== 'all') {
            filteredCourses = filteredCourses.filter((c) => c.category === options.category)
          }

          setCourses(filteredCourses.map(toSkillCourse))
          return
        }

        // Fetch from Supabase
        let query = supabase.from('skill_courses').select('*')

        if (options.category && options.category !== 'all') {
          query = query.eq('category', options.category)
        }

        if (options.search) {
          query = query.or(
            `title.ilike.%${options.search}%,provider_name.ilike.%${options.search}%`
          )
        }

        const { data, error: fetchError } = await query.order('created_at', {
          ascending: false,
        })

        if (fetchError) {
          throw fetchError
        }

        setCourses(data || [])
      } catch (err) {
        console.error('Error fetching courses:', err)
        setError('교육 과정을 불러오는데 실패했습니다.')
        // Fallback to local data on error
        setCourses(Object.values(coursesData).map(toSkillCourse))
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [options.category, options.search])

  return { courses, loading, error }
}

export function useCourse(id: string) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourse() {
      try {
        setLoading(true)
        setError(null)

        // Check if Supabase is configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
          // Use local data
          const localCourse = coursesData[id]
          setCourse(localCourse || coursesData['1'])
          return
        }

        const { data, error: fetchError } = await supabase
          .from('skill_courses')
          .select('*')
          .eq('id', id)
          .single()

        if (fetchError) {
          throw fetchError
        }

        // Merge with local data for full course info
        const localCourse = coursesData[id]
        if (localCourse) {
          setCourse({ ...localCourse, ...data })
        } else {
          setCourse(data)
        }
      } catch (err) {
        console.error('Error fetching course:', err)
        setError('교육 과정을 불러오는데 실패했습니다.')
        // Fallback to local data
        setCourse(coursesData[id] || coursesData['1'])
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id])

  return { course, loading, error }
}
