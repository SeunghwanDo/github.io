'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { SkillCourse } from '@/types/supabase'

// Mock data for when Supabase is not configured
const mockCourses: SkillCourse[] = [
  {
    id: '1',
    title: '아크 용접 기능사 자격증 취득반',
    provider_name: '한국폴리텍대학',
    category: '용접',
    duration: '3개월 (120시간)',
    cost: '무료 (국비지원)',
    location: '부산 사상구',
    start_date: '2024-02-15',
    status: 'recruiting',
    thumbnail_url: null,
    description: 'CO2 용접, 아크 용접 실기 집중 훈련',
    rating: 4.8,
    students: 324,
    capacity: 30,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: '산업안전기사 실기 완성',
    provider_name: '경남산업안전교육원',
    category: '안전',
    duration: '2개월 (80시간)',
    cost: '450,000원',
    location: '창원시 성산구',
    start_date: '2024-02-20',
    status: 'recruiting',
    thumbnail_url: null,
    description: '산업안전 법규, 위험성 평가 실무',
    rating: 4.6,
    students: 186,
    capacity: 25,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: '품질관리(QC) 전문가 양성과정',
    provider_name: '부산품질혁신센터',
    category: '품질',
    duration: '1개월 (40시간)',
    cost: '무료 (국비지원)',
    location: '부산 강서구',
    start_date: '2024-03-01',
    status: 'recruiting',
    thumbnail_url: null,
    description: 'SPC, 6시그마, ISO 9001 실무',
    rating: 4.9,
    students: 412,
    capacity: 30,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'PLC 자동화 시스템 실무',
    provider_name: '스마트공장혁신센터',
    category: '자동화',
    duration: '2개월 (100시간)',
    cost: '600,000원',
    location: '울산시 남구',
    start_date: '2024-02-25',
    status: 'recruiting',
    thumbnail_url: null,
    description: '미쓰비시/지멘스 PLC 프로그래밍',
    rating: 4.7,
    students: 253,
    capacity: 20,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: '지게차 운전 기능사 취득',
    provider_name: '대한상공회의소',
    category: '안전',
    duration: '2주 (40시간)',
    cost: '무료 (내일배움카드)',
    location: '김해시 장유',
    start_date: '2024-02-12',
    status: 'recruiting',
    thumbnail_url: null,
    description: '지게차 실기 운전 및 안전 교육',
    rating: 4.5,
    students: 567,
    capacity: 40,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: '스마트 센서 및 IoT 기초',
    provider_name: '경남테크노파크',
    category: '자동화',
    duration: '1개월 (60시간)',
    cost: '350,000원',
    location: '창원시 의창구',
    start_date: '2024-03-10',
    status: 'upcoming',
    thumbnail_url: null,
    description: '산업용 센서, 데이터 수집 및 분석',
    rating: 4.4,
    students: 128,
    capacity: 25,
    created_at: new Date().toISOString(),
  },
]

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
          // Use mock data
          let filteredCourses = [...mockCourses]

          if (options.category && options.category !== 'all') {
            filteredCourses = filteredCourses.filter(
              (c) => c.category === options.category
            )
          }

          if (options.search) {
            const searchLower = options.search.toLowerCase()
            filteredCourses = filteredCourses.filter(
              (c) =>
                c.title.toLowerCase().includes(searchLower) ||
                c.provider_name.toLowerCase().includes(searchLower)
            )
          }

          setCourses(filteredCourses)
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
        // Fallback to mock data on error
        setCourses(mockCourses)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [options.category, options.search])

  return { courses, loading, error }
}

export function useCourse(id: string) {
  const [course, setCourse] = useState<SkillCourse | null>(null)
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
          // Use mock data
          const mockCourse = mockCourses.find((c) => c.id === id)
          setCourse(mockCourse || mockCourses[0])
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

        setCourse(data)
      } catch (err) {
        console.error('Error fetching course:', err)
        setError('교육 과정을 불러오는데 실패했습니다.')
        // Fallback to mock data
        setCourse(mockCourses[0])
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id])

  return { course, loading, error }
}
