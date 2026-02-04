'use client'

import { useState } from 'react'
import {
  BookOpen, Clock, Award, TrendingUp, Target, Calendar,
  Play, CheckCircle, ChevronRight, BarChart3, Trophy, Bell
} from 'lucide-react'
import {
  DataCertification,
  SilverModeToggle,
  RegrowthTrack,
  CourseCard,
  SkillRadarChart,
  UserStatsHeader,
  MOCK_USER,
  MOCK_COURSES,
  MOCK_SKILLS,
  SilverModeSettings
} from './SkillBridgeComponents'

// ============================================================
// MOCK DATA FOR DASHBOARD
// ============================================================

const MOCK_WEEKLY_ACTIVITY = [
  { day: '월', hours: 1.5 },
  { day: '화', hours: 2.0 },
  { day: '수', hours: 1.0 },
  { day: '목', hours: 2.5 },
  { day: '금', hours: 1.5 },
  { day: '토', hours: 0 },
  { day: '일', hours: 0 },
]

const MOCK_ACHIEVEMENTS = [
  { id: '1', name: '첫 수료증 획득', icon: '🏆', earnedAt: '2일 전', rarity: 'common' },
  { id: '2', name: '7일 연속 학습', icon: '🔥', earnedAt: '오늘', rarity: 'rare' },
  { id: '3', name: '퀴즈 만점왕', icon: '💯', earnedAt: '3일 전', rarity: 'epic' },
]

const MOCK_GOALS = [
  { id: '1', title: '이번 주 학습 시간', target: 10, current: 8.5, unit: '시간' },
  { id: '2', title: '이번 달 과정 수료', target: 2, current: 1, unit: '개' },
  { id: '3', title: '용접 자격증 취득', target: 100, current: 75, unit: '%' },
]

const RARITY_COLORS: Record<string, string> = {
  common: 'bg-slate-100 text-slate-700 border-slate-300',
  rare: 'bg-blue-100 text-blue-700 border-blue-300',
  epic: 'bg-purple-100 text-purple-700 border-purple-300',
  legendary: 'bg-amber-100 text-amber-700 border-amber-300',
}

// ============================================================
// DASHBOARD PAGE
// ============================================================

export default function DashboardPage() {
  const [silverMode, setSilverMode] = useState<SilverModeSettings>({
    enabled: false,
    fontSize: 'normal',
    highContrast: false,
    ttsEnabled: false,
  })

  const handleSilverToggle = (key: keyof SilverModeSettings) => {
    if (key === 'enabled') {
      setSilverMode(prev => ({
        ...prev,
        enabled: !prev.enabled,
        fontSize: !prev.enabled ? 'large' : 'normal',
        highContrast: !prev.enabled,
        ttsEnabled: !prev.enabled,
      }))
    } else if (key === 'fontSize') {
      const sizes: ('normal' | 'large' | 'xlarge')[] = ['normal', 'large', 'xlarge']
      const currentIndex = sizes.indexOf(silverMode.fontSize)
      const nextIndex = (currentIndex + 1) % sizes.length
      setSilverMode(prev => ({ ...prev, fontSize: sizes[nextIndex] }))
    } else {
      setSilverMode(prev => ({ ...prev, [key]: !prev[key] }))
    }
  }

  const user = MOCK_USER
  const courses = MOCK_COURSES
  const maxHours = Math.max(...MOCK_WEEKLY_ACTIVITY.map(d => d.hours), 1)
  const thisWeekHours = MOCK_WEEKLY_ACTIVITY.reduce((sum, d) => sum + d.hours, 0)

  return (
    <div className={`min-h-screen bg-slate-50 ${silverMode.enabled ? 'text-lg' : ''}`}>
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-slate-900">SkillBridge</h1>
              <span className="text-slate-500">내 학습</span>
            </div>
            <div className="flex items-center gap-4">
              <SilverModeToggle settings={silverMode} onToggle={handleSilverToggle} />
              <button className="relative p-2 text-slate-400 hover:text-slate-600">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Stats Header */}
        <section className="mb-8">
          <UserStatsHeader user={user} />
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: '진행 중인 과정', value: '3', color: 'bg-blue-100 text-blue-600' },
            { icon: CheckCircle, label: '수료 완료', value: '5', color: 'bg-emerald-100 text-emerald-600' },
            { icon: Clock, label: '총 학습 시간', value: '156h', color: 'bg-purple-100 text-purple-600' },
            { icon: Award, label: '취득 자격증', value: '5', color: 'bg-amber-100 text-amber-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Data Certification Section */}
            <DataCertification user={user} />

            {/* Continue Learning */}
            <section className="bg-white rounded-xl shadow-sm border">
              <div className="p-5 border-b flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Play className="w-5 h-5 text-blue-600" />
                  이어서 학습하기
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  전체 보기 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 grid gap-4">
                {courses.filter(c => c.progress > 0).slice(0, 3).map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </section>

            {/* Weekly Activity */}
            <section className="bg-white rounded-xl shadow-sm border p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  이번 주 학습 활동
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">총</span>
                  <span className="font-bold text-blue-600">{thisWeekHours}시간</span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-2 h-40">
                {MOCK_WEEKLY_ACTIVITY.map((day, index) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center justify-end h-28">
                      <div
                        className={`w-full max-w-[40px] rounded-t-lg transition-all ${day.hours > 0 ? 'bg-blue-500' : 'bg-slate-200'}`}
                        style={{ height: `${(day.hours / maxHours) * 100}%`, minHeight: day.hours > 0 ? '8px' : '4px' }}
                      />
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-medium ${index === new Date().getDay() - 1 ? 'text-blue-600' : 'text-slate-500'}`}>
                        {day.day}
                      </p>
                      {day.hours > 0 && <p className="text-xs text-slate-400">{day.hours}h</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Re-growth Track (for 50+ users) */}
            {user.age >= 50 && <RegrowthTrack user={user} />}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Skill Map */}
            <SkillRadarChart skills={MOCK_SKILLS} />

            {/* Learning Goals */}
            <section className="bg-white rounded-xl shadow-sm border">
              <div className="p-5 border-b flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  학습 목표
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">+ 추가</button>
              </div>
              <div className="p-5 space-y-4">
                {MOCK_GOALS.map(goal => {
                  const progress = (goal.current / goal.target) * 100
                  return (
                    <div key={goal.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{goal.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${progress >= 100 ? 'bg-emerald-500' : progress >= 70 ? 'bg-blue-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700 w-20 text-right">
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
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  최근 업적
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">전체 보기</button>
              </div>
              <div className="p-5 space-y-3">
                {MOCK_ACHIEVEMENTS.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${RARITY_COLORS[achievement.rarity]}`}
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

            {/* Quick Links */}
            <section className="bg-white rounded-xl shadow-sm border p-5">
              <h3 className="font-semibold text-slate-900 mb-4">빠른 메뉴</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '스킬 맵', icon: TrendingUp, color: 'from-purple-50 to-purple-100 text-purple-700 bg-purple-500' },
                  { label: '학습 경로', icon: BookOpen, color: 'from-blue-50 to-blue-100 text-blue-700 bg-blue-500' },
                  { label: '멘토링', icon: Award, color: 'from-emerald-50 to-emerald-100 text-emerald-700 bg-emerald-500' },
                  { label: '스터디', icon: Calendar, color: 'from-amber-50 to-amber-100 text-amber-700 bg-amber-500' },
                ].map((item, i) => (
                  <button
                    key={i}
                    className={`p-4 bg-gradient-to-br ${item.color.split(' ').slice(0, 2).join(' ')} rounded-lg text-center hover:shadow-md transition-shadow`}
                  >
                    <div className={`w-10 h-10 ${item.color.split(' ').slice(-1)} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-sm font-medium ${item.color.split(' ').slice(2, 3)}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
