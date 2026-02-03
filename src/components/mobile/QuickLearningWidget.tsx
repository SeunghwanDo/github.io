'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Play, Clock, ChevronRight, Flame, Zap, Trophy,
  CheckCircle, BookOpen, Target
} from 'lucide-react'

interface QuickCourse {
  id: string
  title: string
  progress: number
  nextLesson: string
  estimatedTime: string
}

interface DailyGoal {
  completed: number
  target: number
  streak: number
}

export default function QuickLearningWidget() {
  const [currentCourse, setCurrentCourse] = useState<QuickCourse | null>(null)
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>({
    completed: 25,
    target: 30,
    streak: 7
  })
  const [showMotivation, setShowMotivation] = useState(true)

  useEffect(() => {
    // Load from localStorage or fetch
    setCurrentCourse({
      id: '1',
      title: 'TIG 용접 마스터 과정',
      progress: 75,
      nextLesson: '제5장: 스테인리스 용접 기법',
      estimatedTime: '15분'
    })
  }, [])

  const goalProgress = (dailyGoal.completed / dailyGoal.target) * 100
  const remaining = dailyGoal.target - dailyGoal.completed

  return (
    <div className="space-y-4 p-4">
      {/* Daily Goal Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            <span className="font-medium">오늘의 학습 목표</span>
          </div>
          <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-sm">
            <Flame className="w-4 h-4 text-orange-300" />
            <span>{dailyGoal.streak}일</span>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-end justify-between mb-1">
            <span className="text-3xl font-bold">{dailyGoal.completed}분</span>
            <span className="text-blue-200">/ {dailyGoal.target}분</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
        </div>

        {remaining > 0 ? (
          <p className="text-sm text-blue-100">
            오늘 목표까지 <span className="font-bold">{remaining}분</span> 남았어요! 화이팅! 💪
          </p>
        ) : (
          <p className="text-sm text-green-200 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            오늘 목표 달성! 대단해요! 🎉
          </p>
        )}
      </div>

      {/* Quick Resume Card */}
      {currentCourse && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <BookOpen className="w-4 h-4" />
              <span>이어서 학습하기</span>
            </div>

            <h3 className="font-semibold text-gray-900 mb-1">
              {currentCourse.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {currentCourse.nextLesson}
            </p>

            {/* Progress */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${currentCourse.progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {currentCourse.progress}%
              </span>
            </div>

            <Link
              href={`/skillbridge/${currentCourse.id}`}
              className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              <Play className="w-5 h-5" />
              학습 시작
              <span className="text-blue-200 text-sm ml-1">
                ({currentCourse.estimatedTime})
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Link
          href="/skillbridge/skill-map"
          className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
        >
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-2">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-medium text-purple-700">스킬맵</span>
        </Link>

        <Link
          href="/skillbridge/study-groups"
          className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
        >
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-2">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-medium text-green-700">챌린지</span>
        </Link>

        <Link
          href="/gamification"
          className="flex flex-col items-center p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
        >
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-2">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-medium text-amber-700">리워드</span>
        </Link>
      </div>

      {/* Motivation Message */}
      {showMotivation && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-medium text-amber-900 mb-1">오늘의 학습 팁</p>
                <p className="text-sm text-amber-700">
                  짧은 시간이라도 매일 꾸준히 학습하는 것이 실력 향상의 비결이에요!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowMotivation(false)}
              className="text-amber-400 hover:text-amber-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
