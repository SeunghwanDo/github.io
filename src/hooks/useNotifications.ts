'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export interface Notification {
  id: string
  user_id: string
  type: 'application_approved' | 'application_rejected' | 'course_reminder' | 'course_start' | 'certificate_ready' | 'system'
  title: string
  message: string
  link?: string
  read: boolean
  created_at: string
}

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: 'n1',
    user_id: 'user1',
    type: 'application_approved',
    title: '교육 신청 승인',
    message: '아크 용접 기능사 자격증 취득반 신청이 승인되었습니다.',
    link: '/skillbridge/1',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30분 전
  },
  {
    id: 'n2',
    user_id: 'user1',
    type: 'course_reminder',
    title: '교육 시작 D-3',
    message: 'PLC 자동화 시스템 실무 과정이 3일 후 시작됩니다.',
    link: '/skillbridge/4',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
  },
  {
    id: 'n3',
    user_id: 'user1',
    type: 'certificate_ready',
    title: '수료증 발급 완료',
    message: '품질관리(QC) 전문가 양성과정 수료증이 발급되었습니다.',
    link: '/mypage?tab=certificates',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1일 전
  },
  {
    id: 'n4',
    user_id: 'user1',
    type: 'system',
    title: 'SkillBridge 업데이트',
    message: '새로운 자동화 과정 5개가 추가되었습니다. 지금 확인해보세요!',
    link: '/skillbridge?category=자동화',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2일 전
  },
]

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes('your-project-id')

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      if (!isSupabaseConfigured) {
        // Use mock data
        const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]')
        const allNotifications = [...mockNotifications, ...storedNotifications].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        setNotifications(allNotifications)
        setUnreadCount(allNotifications.filter((n) => !n.read).length)
        return
      }

      if (!user) {
        setNotifications([])
        setUnreadCount(0)
        return
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      setNotifications(data || [])
      setUnreadCount((data || []).filter((n: Notification) => !n.read).length)
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter((n) => !n.read).length)
    } finally {
      setLoading(false)
    }
  }, [user, isSupabaseConfigured])

  // Mark as read
  const markAsRead = async (notificationId: string) => {
    try {
      if (!isSupabaseConfigured) {
        // Update local state
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))

        // Update localStorage
        const stored = JSON.parse(localStorage.getItem('notifications') || '[]')
        const updated = stored.map((n: Notification) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
        localStorage.setItem('notifications', JSON.stringify(updated))
        return
      }

      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      if (!isSupabaseConfigured) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        setUnreadCount(0)

        const stored = JSON.parse(localStorage.getItem('notifications') || '[]')
        const updated = stored.map((n: Notification) => ({ ...n, read: true }))
        localStorage.setItem('notifications', JSON.stringify(updated))
        return
      }

      if (!user) return

      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false)

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err)
    }
  }

  // Add notification (for local/demo use)
  const addNotification = (notification: Omit<Notification, 'id' | 'user_id' | 'created_at'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `local-${Date.now()}`,
      user_id: user?.id || 'guest',
      created_at: new Date().toISOString(),
    }

    setNotifications((prev) => [newNotification, ...prev])
    if (!notification.read) {
      setUnreadCount((prev) => prev + 1)
    }

    // Save to localStorage
    const stored = JSON.parse(localStorage.getItem('notifications') || '[]')
    stored.unshift(newNotification)
    localStorage.setItem('notifications', JSON.stringify(stored))
  }

  // Initial fetch
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Real-time subscription (when Supabase is configured)
  useEffect(() => {
    if (!isSupabaseConfigured || !user) return

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification
          setNotifications((prev) => [newNotification, ...prev])
          setUnreadCount((prev) => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, isSupabaseConfigured])

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    refetch: fetchNotifications,
  }
}

// Helper function to get notification icon by type
export function getNotificationIcon(type: Notification['type']) {
  switch (type) {
    case 'application_approved':
      return { icon: '✅', color: 'text-emerald-400', bg: 'bg-emerald-500/20' }
    case 'application_rejected':
      return { icon: '❌', color: 'text-red-400', bg: 'bg-red-500/20' }
    case 'course_reminder':
      return { icon: '📅', color: 'text-amber-400', bg: 'bg-amber-500/20' }
    case 'course_start':
      return { icon: '🎓', color: 'text-blue-400', bg: 'bg-blue-500/20' }
    case 'certificate_ready':
      return { icon: '🏆', color: 'text-violet-400', bg: 'bg-violet-500/20' }
    case 'system':
      return { icon: '📢', color: 'text-slate-400', bg: 'bg-slate-500/20' }
    default:
      return { icon: '🔔', color: 'text-slate-400', bg: 'bg-slate-500/20' }
  }
}

// Helper function to format relative time
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return '방금 전'
  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 7) return `${diffDays}일 전`
  return date.toLocaleDateString('ko-KR')
}
