'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { courses } from '@/data/courses'

export interface Certificate {
  id: string
  user_id: string
  course_id: string
  course_title: string
  provider_name: string
  issued_at: string
  certificate_number: string
  status: 'active' | 'expired' | 'revoked'
}

export interface Badge {
  id: string
  user_id: string
  name: string
  description: string
  icon: string
  color: string
  category: string
  earned_at: string
  course_id?: string
}

// Mock certificates for demo
const mockCertificates: Certificate[] = [
  {
    id: 'cert-1',
    user_id: 'user1',
    course_id: '3',
    course_title: '품질관리(QC) 전문가 양성과정',
    provider_name: '부산품질혁신센터',
    issued_at: '2024-01-20',
    certificate_number: 'SB-2024-QC-001234',
    status: 'active',
  },
  {
    id: 'cert-2',
    user_id: 'user1',
    course_id: '5',
    course_title: '지게차 운전 기능사 취득반',
    provider_name: '부산직업전문학교',
    issued_at: '2024-01-05',
    certificate_number: 'SB-2024-FK-000892',
    status: 'active',
  },
]

// Mock badges for demo
const mockBadges: Badge[] = [
  {
    id: 'badge-1',
    user_id: 'user1',
    name: '품질 전문가',
    description: '품질관리(QC) 전문가 양성과정을 수료하였습니다.',
    icon: '✓',
    color: 'blue',
    category: '품질',
    earned_at: '2024-01-20',
    course_id: '3',
  },
  {
    id: 'badge-2',
    user_id: 'user1',
    name: '물류 전문가',
    description: '지게차 운전 기능사 자격을 취득하였습니다.',
    icon: '🚜',
    color: 'amber',
    category: '안전',
    earned_at: '2024-01-05',
    course_id: '5',
  },
  {
    id: 'badge-3',
    user_id: 'user1',
    name: '학습 시작',
    description: '첫 번째 교육 과정을 신청하였습니다.',
    icon: '🎯',
    color: 'violet',
    category: '활동',
    earned_at: '2023-12-15',
  },
  {
    id: 'badge-4',
    user_id: 'user1',
    name: '역량 진단 완료',
    description: '스킬 역량 진단을 완료하였습니다.',
    icon: '📊',
    color: 'emerald',
    category: '활동',
    earned_at: '2023-12-10',
  },
]

export function useCertificates() {
  const { user } = useAuth()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes('your-project-id')

  const fetchCertificates = useCallback(async () => {
    setLoading(true)
    try {
      if (!isSupabaseConfigured) {
        // Use mock data + localStorage
        const storedCerts = JSON.parse(localStorage.getItem('certificates') || '[]')
        const storedBadges = JSON.parse(localStorage.getItem('badges') || '[]')

        setCertificates([...mockCertificates, ...storedCerts])
        setBadges([...mockBadges, ...storedBadges])
        return
      }

      if (!user) {
        setCertificates([])
        setBadges([])
        return
      }

      // Fetch from Supabase
      const [certsResult, badgesResult] = await Promise.all([
        supabase
          .from('certificates')
          .select('*')
          .eq('user_id', user.id)
          .order('issued_at', { ascending: false }),
        supabase
          .from('badges')
          .select('*')
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false }),
      ])

      setCertificates(certsResult.data || [])
      setBadges(badgesResult.data || [])
    } catch (err) {
      console.error('Failed to fetch certificates:', err)
      setCertificates(mockCertificates)
      setBadges(mockBadges)
    } finally {
      setLoading(false)
    }
  }, [user, isSupabaseConfigured])

  // Issue certificate (for demo/admin)
  const issueCertificate = async (courseId: string) => {
    const course = courses[courseId]
    if (!course) return null

    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      user_id: user?.id || 'guest',
      course_id: courseId,
      course_title: course.title,
      provider_name: course.provider_name,
      issued_at: new Date().toISOString().split('T')[0],
      certificate_number: `SB-${new Date().getFullYear()}-${course.category.substring(0, 2).toUpperCase()}-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      status: 'active',
    }

    if (!isSupabaseConfigured) {
      const stored = JSON.parse(localStorage.getItem('certificates') || '[]')
      stored.unshift(newCert)
      localStorage.setItem('certificates', JSON.stringify(stored))
      setCertificates((prev) => [newCert, ...prev])

      // Also award badge if course has one
      if (course.badge) {
        const newBadge: Badge = {
          id: `badge-${Date.now()}`,
          user_id: user?.id || 'guest',
          name: course.badge.name,
          description: `${course.title}을(를) 수료하였습니다.`,
          icon: course.badge.icon,
          color: course.badge.color,
          category: course.category,
          earned_at: new Date().toISOString().split('T')[0],
          course_id: courseId,
        }

        const storedBadges = JSON.parse(localStorage.getItem('badges') || '[]')
        storedBadges.unshift(newBadge)
        localStorage.setItem('badges', JSON.stringify(storedBadges))
        setBadges((prev) => [newBadge, ...prev])
      }

      return newCert
    }

    // Supabase implementation
    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert(newCert)
        .select()
        .single()

      if (error) throw error

      setCertificates((prev) => [data, ...prev])
      return data
    } catch (err) {
      console.error('Failed to issue certificate:', err)
      return null
    }
  }

  // Award badge manually
  const awardBadge = async (badge: Omit<Badge, 'id' | 'user_id' | 'earned_at'>) => {
    const newBadge: Badge = {
      ...badge,
      id: `badge-${Date.now()}`,
      user_id: user?.id || 'guest',
      earned_at: new Date().toISOString().split('T')[0],
    }

    if (!isSupabaseConfigured) {
      const stored = JSON.parse(localStorage.getItem('badges') || '[]')
      stored.unshift(newBadge)
      localStorage.setItem('badges', JSON.stringify(stored))
      setBadges((prev) => [newBadge, ...prev])
      return newBadge
    }

    try {
      const { data, error } = await supabase
        .from('badges')
        .insert(newBadge)
        .select()
        .single()

      if (error) throw error

      setBadges((prev) => [data, ...prev])
      return data
    } catch (err) {
      console.error('Failed to award badge:', err)
      return null
    }
  }

  useEffect(() => {
    fetchCertificates()
  }, [fetchCertificates])

  return {
    certificates,
    badges,
    loading,
    issueCertificate,
    awardBadge,
    refetch: fetchCertificates,
  }
}

// Helper to get badge color class
export function getBadgeColorClass(color: string) {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
    red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
    violet: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
    rose: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
    cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    teal: { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30' },
    indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30' },
    yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    lime: { bg: 'bg-lime-500/20', text: 'text-lime-400', border: 'border-lime-500/30' },
  }

  return colorMap[color] || colorMap.violet
}
