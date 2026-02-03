'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen, Clock, Award, TrendingUp, Target, Calendar,
  Play, CheckCircle, Star, Flame, ChevronRight, BarChart3,
  Trophy, Zap, BookMarked, Bell, ArrowUp, ArrowDown
} from 'lucide-react'

// Types
interface LearningStats {
  totalCourses: number
  completedCourses: number
  inProgressCourses: number
  totalHours: number
  thisWeekHours: number
  streak: number
  xp: number
  level: number
  certificates: number
}

interface CourseProgress {
  id: string
  title: string
  provider: string
  progress: number
  lastAccessed: string
  nextLesson: string
  thumbnail: string
  category: string
  totalLessons: number
  completedLessons: number
}

interface WeeklyActivity {
  day: string
  hours: number
  lessons: number
}

interface Achievement {
  id: string
  name: string
  icon: string
  earnedAt: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface LearningGoal {
  id: string
  title: string
  target: number
  current: number
  unit: string
  deadline: string
}

// Mock data generator
const generateMockData = () => {
  const stats: LearningStats = {
    totalCourses: 12,
    completedCourses: 5,
    inProgressCourses: 3,
    totalHours: 156,
    thisWeekHours: 8.5,
    streak: 7,
    xp: 4250,
    level: 4,
    certificates: 5
  }

  const courses: CourseProgress[] = [
    {
      id: '1',
      title: 'TIG 용접 마스터 과정',
      provider: '한국폴리텍대학',
      progress: 75,
      lastAccessed: '2시간 전',
      nextLesson: '제5장: 스테인리스 용접 기법',
      thumbnail: '/courses/welding.jpg',
      category: '용접',
      totalLessons: 24,
      completedLessons: 18
    },
    {
      id: '2',
      title: '산업안전기사 실기 완벽대비',
      provider: '안전교육원',
      progress: 45,
      lastAccessed: '1일 전',
      nextLesson: '제3장: 위험성 평가 실습',
      thumbnail: '/courses/safety.jpg',
      category: '안전',
      totalLessons: 32,
      completedLessons: 14
    },
    {
      id: '3',
      title: '스마트 팩토리 PLC 프로그래밍',
      provider: '미래산업교육원',
      progress: 20,
      lastAccessed: '3일 전',
      nextLesson: '제2장: 래더 다이어그램 기초',
      thumbnail: '/courses/plc.jpg',
      category: '자동화',
      totalLessons: 28,
      completedLessons: 6
    }
  ]

  const weeklyActivity: WeeklyActivity[] = [
    { day: '월', hours: 1.5, lessons: 3 },
    { day: '화', hours: 2.0, lessons: 4 },
    { day: '수', hours: 1.0, lessons: 2 },
    { day: '목', hours: 2.5, lessons: 5 },
    { day: '금', hours: 1.5, lessons: 3 },
    { day: '토', hours: 0, lessons: 0 },
    { day: '일', hours: 0, lessons: 0 }
  ]

  const recentAchievements: Achievement[] = [
    { id: '1', name: '첫 수료증 획득', icon: '🏆', earnedAt: '2일 전', rarity: 'common' },
    { id: '2', name: '7일 연속 학습', icon: '🔥', earnedAt: '오늘', rarity: 'rare' },
    { id: '3', name: '퀴즈 만점왕', icon: '💯', earnedAt: '3일 전', rarity: 'epic' }
  ]

  const goals: LearningGoal[] = [
    { id: '1', title: '이번 주 학습 시간', target: 10, current: 8.5, unit: '시간', deadline: '3일 후' },
    { id: '2', title: '이번 달 과정 수료', target: 2, current: 1, unit: '개', deadline: '12일 후' },
    { id: '3', title: '용접 자격증 취득', target: 100, current: 75, unit: '%', deadline: '30일 후' }
  ]

  return { stats, courses, weeklyActivity, recentAchievements, goals }
}

// Level info
const levelInfo: Record<number, { name: string; minXP: number; maxXP: number }> = {
  1: { name: '신입생', minXP: 0, maxXP: 500 },
  2: { name: '학습자', minXP: 500, maxXP: 1500 },
  3: { name: '숙련자', minXP: 1500, maxXP: 3000 },
  4: { name: '전문가', minXP: 3000, maxXP: 5000 },
  5: { name: '마스터', minXP: 5000, maxXP: 8000 },
  6: { name: '그랜드마스터', minXP: 8000, maxXP: 12000 },
  7: { name: '레전드', minXP: 12000, maxXP: 99999 }
}

const rarityColors = {
  common: 'bg-gray-100 text-gray-700 border-gray-300',
  rare: 'bg-blue-100 text-blue-700 border-blue-300',
  epic: 'bg-purple-100 text-purple-700 border-purple-300',
  legendary: 'bg-amber-100 text-amber-700 border-amber-300'
}

const categoryColors: Record<string, string> = {
  '용접': 'bg-orange-100 text-orange-700',
  '안전': 'bg-green-100 text-green-700',
  '품질': 'bg-blue-100 text-blue-700',
  '자동화': 'bg-purple-100 text-purple-700'
}

export default function MyLearningPage() {
  const [data, setData] = useState<ReturnType<typeof generateMockData> | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setData(generateMockData())

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const { stats, courses, weeklyActivity, recentAchievements, goals } = data
  const currentLevel = levelInfo[stats.level]
  const xpProgress = ((stats.xp - currentLevel.minXP) / (currentLevel.maxXP - currentLevel.minXP)) * 100
  const maxHours = Math.max(...weeklyActivity.map(d => d.hours), 1)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/skillbridge" className="text-gray-500 hover:text-gray-700">
                ← SkillBridge
              </Link>
              <h1 className="text-xl font-bold text-gray-900">내 학습</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {currentTime.toLocaleDateString('ko-KR', {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short'
                })}
              </span>
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Level Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-blue-100 mb-1">안녕하세요, 학습자님! 👋</p>
                <h2 className="text-2xl font-bold mb-2">오늘도 열심히 배워볼까요?</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-300" />
                    {stats.streak}일 연속 학습 중
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-yellow-300" />
                    {stats.xp.toLocaleString()} XP
                  </span>
                </div>
              </div>

              {/* Level Progress */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 min-w-[280px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Lv.{stats.level} {currentLevel.name}</span>
                  <span className="text-sm text-blue-200">
                    {stats.xp.toLocaleString()} / {currentLevel.maxXP.toLocaleString()} XP
                  </span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <p className="text-xs text-blue-200 mt-2">
                  다음 레벨까지 {(currentLevel.maxXP - stats.xp).toLocaleString()} XP 남음
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgressCourses}</p>
                <p className="text-sm text-gray-500">진행 중인 과정</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completedCourses}</p>
                <p className="text-sm text-gray-500">수료 완료</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
                <p className="text-sm text-gray-500">총 학습 시간</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.certificates}</p>
                <p className="text-sm text-gray-500">취득 자격증</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Courses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning */}
            <section className="bg-white rounded-xl shadow-sm border">
              <div className="p-5 border-b flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Play className="w-5 h-5 text-blue-600" />
                  이어서 학습하기
                </h3>
                <Link href="/skillbridge" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  전체 보기 <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="divide-y">
                {courses.map((course) => (
                  <div key={course.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookMarked className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 truncate">{course.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${categoryColors[course.category] || 'bg-gray-100 text-gray-700'}`}>
                            {course.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{course.provider}</p>

                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{course.progress}%</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            다음: {course.nextLesson}
                          </span>
                          <span className="text-gray-400">{course.lastAccessed}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/skillbridge/${course.id}`}
                        className="flex-1 py-2 bg-blue-600 text-white text-center rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        이어서 학습하기
                      </Link>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        상세 보기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Weekly Activity Chart */}
            <section className="bg-white rounded-xl shadow-sm border p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  이번 주 학습 활동
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">총</span>
                  <span className="font-bold text-blue-600">{stats.thisWeekHours}시간</span>
                  <span className="flex items-center text-green-600">
                    <ArrowUp className="w-4 h-4" />
                    12%
                  </span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-2 h-40">
                {weeklyActivity.map((day, index) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center justify-end h-28">
                      <div
                        className={`w-full max-w-[40px] rounded-t-lg transition-all duration-300 ${
                          day.hours > 0 ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                        style={{ height: `${(day.hours / maxHours) * 100}%`, minHeight: day.hours > 0 ? '8px' : '4px' }}
                      />
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-medium ${index === new Date().getDay() - 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                        {day.day}
                      </p>
                      {day.hours > 0 && (
                        <p className="text-xs text-gray-400">{day.hours}h</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Goals & Achievements */}
          <div className="space-y-6">
            {/* Learning Goals */}
            <section className="bg-white rounded-xl shadow-sm border">
              <div className="p-5 border-b flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  학습 목표
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">+ 추가</button>
              </div>

              <div className="p-5 space-y-4">
                {goals.map((goal) => {
                  const progress = (goal.current / goal.target) * 100
                  return (
                    <div key={goal.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{goal.title}</span>
                        <span className="text-xs text-gray-500">{goal.deadline}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              progress >= 100 ? 'bg-green-500' : progress >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-20 text-right">
                          {goal.current}/{goal.target}{goal.unit}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Recent Achievements */}
            <section className="bg-white rounded-xl shadow-sm border">
              <div className="p-5 border-b flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  최근 업적
                </h3>
                <Link href="/gamification" className="text-sm text-blue-600 hover:text-blue-700">
                  전체 보기
                </Link>
              </div>

              <div className="p-5 space-y-3">
                {recentAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${rarityColors[achievement.rarity]}`}
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{achievement.name}</p>
                      <p className="text-xs opacity-70">{achievement.earnedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-white rounded-xl shadow-sm border p-5">
              <h3 className="font-semibold text-gray-900 mb-4">빠른 메뉴</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/skillbridge/skill-map"
                  className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-purple-700">스킬 맵</span>
                </Link>

                <Link
                  href="/skillbridge/learning-path"
                  className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <BookMarked className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-blue-700">학습 경로</span>
                </Link>

                <Link
                  href="/skillbridge/mentoring"
                  className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-700">멘토링</span>
                </Link>

                <Link
                  href="/skillbridge/study-groups"
                  className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-amber-700">스터디 그룹</span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
