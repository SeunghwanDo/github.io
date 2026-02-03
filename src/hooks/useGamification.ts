'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'

// Point values for different actions
export const POINT_VALUES = {
  DAILY_LOGIN: 10,
  COURSE_VIEW: 5,
  COURSE_APPLY: 20,
  ATTENDANCE: 15,
  ASSIGNMENT_SUBMIT: 30,
  ASSIGNMENT_PERFECT: 50,
  COURSE_COMPLETE: 200,
  REVIEW_WRITE: 25,
  STREAK_BONUS_7: 100,
  STREAK_BONUS_30: 500,
  FIRST_COURSE: 100,
  FIRST_CERTIFICATE: 150,
}

// Level thresholds
export const LEVELS = [
  { level: 1, name: '신입생', minPoints: 0, maxPoints: 99, icon: '🌱', color: 'slate' },
  { level: 2, name: '학습자', minPoints: 100, maxPoints: 299, icon: '📚', color: 'emerald' },
  { level: 3, name: '열정러너', minPoints: 300, maxPoints: 599, icon: '🔥', color: 'amber' },
  { level: 4, name: '숙련자', minPoints: 600, maxPoints: 999, icon: '⭐', color: 'blue' },
  { level: 5, name: '전문가', minPoints: 1000, maxPoints: 1999, icon: '💎', color: 'violet' },
  { level: 6, name: '마스터', minPoints: 2000, maxPoints: 3999, icon: '👑', color: 'fuchsia' },
  { level: 7, name: '레전드', minPoints: 4000, maxPoints: Infinity, icon: '🏆', color: 'amber' },
]

// Achievement definitions
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'learning' | 'social' | 'streak' | 'special'
  condition: string
  points: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: string
}

export const ACHIEVEMENTS: Achievement[] = [
  // Learning achievements
  { id: 'first-login', name: '첫 발걸음', description: '처음으로 로그인했습니다', icon: '👋', category: 'learning', condition: 'first_login', points: 10, rarity: 'common' },
  { id: 'first-course', name: '학습의 시작', description: '첫 교육과정을 신청했습니다', icon: '📖', category: 'learning', condition: 'first_course_apply', points: 50, rarity: 'common' },
  { id: 'first-complete', name: '완주자', description: '첫 교육과정을 수료했습니다', icon: '🎓', category: 'learning', condition: 'first_course_complete', points: 100, rarity: 'rare' },
  { id: 'course-3', name: '다재다능', description: '3개의 교육과정을 수료했습니다', icon: '🎯', category: 'learning', condition: 'complete_3_courses', points: 200, rarity: 'rare' },
  { id: 'course-5', name: '학습왕', description: '5개의 교육과정을 수료했습니다', icon: '🏅', category: 'learning', condition: 'complete_5_courses', points: 500, rarity: 'epic' },
  { id: 'perfect-score', name: '완벽주의자', description: '과제에서 만점을 받았습니다', icon: '💯', category: 'learning', condition: 'perfect_assignment', points: 100, rarity: 'rare' },
  { id: 'perfect-attendance', name: '개근왕', description: '한 달간 100% 출석했습니다', icon: '📅', category: 'learning', condition: 'perfect_monthly_attendance', points: 300, rarity: 'epic' },

  // Streak achievements
  { id: 'streak-7', name: '일주일 연속', description: '7일 연속 학습했습니다', icon: '🔥', category: 'streak', condition: 'streak_7', points: 100, rarity: 'common' },
  { id: 'streak-30', name: '한 달 연속', description: '30일 연속 학습했습니다', icon: '⚡', category: 'streak', condition: 'streak_30', points: 500, rarity: 'epic' },
  { id: 'streak-100', name: '백일장', description: '100일 연속 학습했습니다', icon: '💪', category: 'streak', condition: 'streak_100', points: 1000, rarity: 'legendary' },

  // Social achievements
  { id: 'first-review', name: '리뷰어', description: '첫 수강 후기를 작성했습니다', icon: '✍️', category: 'social', condition: 'first_review', points: 50, rarity: 'common' },
  { id: 'helpful-review', name: '도움이 되는 리뷰', description: '후기가 10개 이상 추천을 받았습니다', icon: '👍', category: 'social', condition: 'review_10_likes', points: 150, rarity: 'rare' },

  // Special achievements
  { id: 'early-bird', name: '얼리버드', description: '오전 6시 이전에 학습했습니다', icon: '🌅', category: 'special', condition: 'early_morning', points: 50, rarity: 'rare' },
  { id: 'night-owl', name: '올빼미', description: '자정 이후에 학습했습니다', icon: '🦉', category: 'special', condition: 'late_night', points: 50, rarity: 'rare' },
  { id: 'weekend-warrior', name: '주말 전사', description: '주말에도 학습했습니다', icon: '⚔️', category: 'special', condition: 'weekend_learning', points: 30, rarity: 'common' },
  { id: 'speed-learner', name: '스피드 러너', description: '예정보다 빨리 과정을 수료했습니다', icon: '🚀', category: 'special', condition: 'early_completion', points: 200, rarity: 'epic' },
  { id: 'certificate-collector', name: '자격증 수집가', description: '5개의 수료증을 획득했습니다', icon: '🏆', category: 'special', condition: 'collect_5_certificates', points: 500, rarity: 'legendary' },
]

export interface GamificationStats {
  totalPoints: number
  currentLevel: typeof LEVELS[number]
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  achievements: Achievement[]
  pointHistory: Array<{
    id: string
    action: string
    points: number
    timestamp: string
  }>
  weeklyPoints: number
  monthlyPoints: number
}

// Mock leaderboard data
const mockLeaderboard = [
  { rank: 1, name: '김민준', points: 4520, level: 7, streak: 45, avatar: '🏆' },
  { rank: 2, name: '이서연', points: 3890, level: 6, streak: 32, avatar: '👑' },
  { rank: 3, name: '박지훈', points: 3450, level: 6, streak: 28, avatar: '💎' },
  { rank: 4, name: '최예진', points: 2980, level: 6, streak: 21, avatar: '⭐' },
  { rank: 5, name: '정우성', points: 2540, level: 5, streak: 18, avatar: '🔥' },
  { rank: 6, name: '강수진', points: 2120, level: 5, streak: 15, avatar: '📚' },
  { rank: 7, name: '윤도현', points: 1850, level: 5, streak: 12, avatar: '🎯' },
  { rank: 8, name: '임하늘', points: 1620, level: 5, streak: 10, avatar: '💪' },
  { rank: 9, name: '송민아', points: 1380, level: 4, streak: 8, avatar: '🌟' },
  { rank: 10, name: '한지민', points: 1150, level: 4, streak: 7, avatar: '✨' },
]

export function useGamification() {
  const { user } = useAuth()
  const [stats, setStats] = useState<GamificationStats | null>(null)
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard)
  const [loading, setLoading] = useState(true)

  // Calculate level from points
  const getLevelFromPoints = useCallback((points: number) => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (points >= LEVELS[i].minPoints) {
        return LEVELS[i]
      }
    }
    return LEVELS[0]
  }, [])

  // Calculate progress to next level
  const getProgressToNextLevel = useCallback((points: number) => {
    const currentLevel = getLevelFromPoints(points)
    const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1)

    if (!nextLevel) return 100 // Max level

    const pointsInLevel = points - currentLevel.minPoints
    const pointsNeeded = nextLevel.minPoints - currentLevel.minPoints
    return Math.round((pointsInLevel / pointsNeeded) * 100)
  }, [getLevelFromPoints])

  // Load stats from localStorage
  const loadStats = useCallback(() => {
    setLoading(true)
    try {
      const stored = localStorage.getItem('gamificationStats')
      if (stored) {
        const parsed = JSON.parse(stored)
        setStats({
          ...parsed,
          currentLevel: getLevelFromPoints(parsed.totalPoints),
        })
      } else {
        // Initialize new user stats
        const initial: GamificationStats = {
          totalPoints: 0,
          currentLevel: LEVELS[0],
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: null,
          achievements: [],
          pointHistory: [],
          weeklyPoints: 0,
          monthlyPoints: 0,
        }
        setStats(initial)
        localStorage.setItem('gamificationStats', JSON.stringify(initial))
      }
    } catch (error) {
      console.error('Failed to load gamification stats:', error)
    } finally {
      setLoading(false)
    }
  }, [getLevelFromPoints])

  // Add points for an action
  const addPoints = useCallback((action: keyof typeof POINT_VALUES, customPoints?: number) => {
    if (!stats) return

    const points = customPoints ?? POINT_VALUES[action]
    const now = new Date()
    const today = now.toISOString().split('T')[0]

    // Check and update streak
    let newStreak = stats.currentStreak
    if (stats.lastActivityDate) {
      const lastDate = new Date(stats.lastActivityDate)
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)

      if (stats.lastActivityDate === today) {
        // Same day, no streak change
      } else if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
        // Consecutive day, increase streak
        newStreak += 1
      } else {
        // Streak broken
        newStreak = 1
      }
    } else {
      newStreak = 1
    }

    // Check for streak bonuses
    let bonusPoints = 0
    if (newStreak === 7 && stats.currentStreak < 7) {
      bonusPoints += POINT_VALUES.STREAK_BONUS_7
    }
    if (newStreak === 30 && stats.currentStreak < 30) {
      bonusPoints += POINT_VALUES.STREAK_BONUS_30
    }

    const newTotalPoints = stats.totalPoints + points + bonusPoints

    const updatedStats: GamificationStats = {
      ...stats,
      totalPoints: newTotalPoints,
      currentLevel: getLevelFromPoints(newTotalPoints),
      currentStreak: newStreak,
      longestStreak: Math.max(stats.longestStreak, newStreak),
      lastActivityDate: today,
      weeklyPoints: stats.weeklyPoints + points + bonusPoints,
      monthlyPoints: stats.monthlyPoints + points + bonusPoints,
      pointHistory: [
        {
          id: `ph-${Date.now()}`,
          action,
          points: points + bonusPoints,
          timestamp: now.toISOString(),
        },
        ...stats.pointHistory.slice(0, 49), // Keep last 50 entries
      ],
    }

    setStats(updatedStats)
    localStorage.setItem('gamificationStats', JSON.stringify(updatedStats))

    return { points: points + bonusPoints, newLevel: updatedStats.currentLevel }
  }, [stats, getLevelFromPoints])

  // Unlock achievement
  const unlockAchievement = useCallback((achievementId: string) => {
    if (!stats) return false

    // Check if already unlocked
    if (stats.achievements.some(a => a.id === achievementId)) {
      return false
    }

    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId)
    if (!achievement) return false

    const unlockedAchievement = {
      ...achievement,
      unlockedAt: new Date().toISOString(),
    }

    const updatedStats: GamificationStats = {
      ...stats,
      totalPoints: stats.totalPoints + achievement.points,
      currentLevel: getLevelFromPoints(stats.totalPoints + achievement.points),
      achievements: [...stats.achievements, unlockedAchievement],
      pointHistory: [
        {
          id: `ph-${Date.now()}`,
          action: `업적 달성: ${achievement.name}`,
          points: achievement.points,
          timestamp: new Date().toISOString(),
        },
        ...stats.pointHistory.slice(0, 49),
      ],
    }

    setStats(updatedStats)
    localStorage.setItem('gamificationStats', JSON.stringify(updatedStats))

    return unlockedAchievement
  }, [stats, getLevelFromPoints])

  // Check and unlock achievements based on conditions
  const checkAchievements = useCallback((condition: string, value?: number) => {
    if (!stats) return []

    const unlockedAchievements: Achievement[] = []

    ACHIEVEMENTS.forEach(achievement => {
      if (stats.achievements.some(a => a.id === achievement.id)) return

      let shouldUnlock = false

      switch (achievement.condition) {
        case condition:
          shouldUnlock = true
          break
        case 'streak_7':
          shouldUnlock = stats.currentStreak >= 7
          break
        case 'streak_30':
          shouldUnlock = stats.currentStreak >= 30
          break
        case 'streak_100':
          shouldUnlock = stats.currentStreak >= 100
          break
        // Add more condition checks as needed
      }

      if (shouldUnlock) {
        const result = unlockAchievement(achievement.id)
        if (result) unlockedAchievements.push(result as Achievement)
      }
    })

    return unlockedAchievements
  }, [stats, unlockAchievement])

  // Get user's rank in leaderboard
  const getUserRank = useCallback(() => {
    if (!stats) return null

    const allUsers = [...leaderboard]
    allUsers.push({
      rank: 0,
      name: user?.user_metadata?.name || '나',
      points: stats.totalPoints,
      level: stats.currentLevel.level,
      streak: stats.currentStreak,
      avatar: '👤',
    })

    allUsers.sort((a, b) => b.points - a.points)
    const userIndex = allUsers.findIndex(u => u.name === (user?.user_metadata?.name || '나'))

    return {
      rank: userIndex + 1,
      total: allUsers.length,
    }
  }, [stats, leaderboard, user])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  return {
    stats,
    loading,
    leaderboard,
    addPoints,
    unlockAchievement,
    checkAchievements,
    getLevelFromPoints,
    getProgressToNextLevel,
    getUserRank,
    LEVELS,
    ACHIEVEMENTS,
    POINT_VALUES,
  }
}

// Helper functions
export function getRarityColor(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common':
      return 'from-slate-400 to-slate-500'
    case 'rare':
      return 'from-blue-400 to-blue-500'
    case 'epic':
      return 'from-violet-400 to-purple-500'
    case 'legendary':
      return 'from-amber-400 to-orange-500'
    default:
      return 'from-slate-400 to-slate-500'
  }
}

export function getRarityBgColor(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common':
      return 'bg-slate-500/20 border-slate-500/30'
    case 'rare':
      return 'bg-blue-500/20 border-blue-500/30'
    case 'epic':
      return 'bg-violet-500/20 border-violet-500/30'
    case 'legendary':
      return 'bg-amber-500/20 border-amber-500/30'
    default:
      return 'bg-slate-500/20 border-slate-500/30'
  }
}

export function getLevelColor(color: string): string {
  const colorMap: Record<string, string> = {
    slate: 'text-slate-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    blue: 'text-blue-400',
    violet: 'text-violet-400',
    fuchsia: 'text-fuchsia-400',
  }
  return colorMap[color] || 'text-slate-400'
}
