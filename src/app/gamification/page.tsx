'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  Trophy,
  Flame,
  Star,
  Target,
  Award,
  TrendingUp,
  Users,
  Calendar,
  Zap,
  Gift,
  Lock,
  CheckCircle2,
  ArrowRight,
  Crown,
  Medal,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import {
  useGamification,
  ACHIEVEMENTS,
  getRarityColor,
  getRarityBgColor,
  getLevelColor,
} from '@/hooks/useGamification'

export default function GamificationPage() {
  const {
    stats,
    loading,
    leaderboard,
    getProgressToNextLevel,
    getUserRank,
    LEVELS,
  } = useGamification()

  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'leaderboard' | 'history'>('overview')

  const userRank = getUserRank()
  const progressToNext = stats ? getProgressToNextLevel(stats.totalPoints) : 0
  const nextLevel = stats ? LEVELS.find(l => l.level === stats.currentLevel.level + 1) : null

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-slate-800 rounded-2xl" />
            <div className="h-64 bg-slate-800 rounded-2xl" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/" className="hover:text-violet-400">홈</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-violet-400">학습 레벨</span>
          </div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            학습 레벨 & 업적
          </h1>
        </div>

        {/* Stats Overview Card */}
        <div className="bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Level Badge */}
            <div className="text-center">
              <div className="w-28 h-28 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-5xl shadow-lg shadow-violet-500/30">
                {stats?.currentLevel.icon}
              </div>
              <p className={`text-lg font-bold mt-2 ${getLevelColor(stats?.currentLevel.color || 'slate')}`}>
                Lv.{stats?.currentLevel.level} {stats?.currentLevel.name}
              </p>
            </div>

            {/* Stats */}
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">총 포인트</span>
                <span className="text-2xl font-bold text-white">{stats?.totalPoints.toLocaleString()} XP</span>
              </div>

              {/* Progress to next level */}
              {nextLevel && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-500">다음 레벨까지</span>
                    <span className="text-violet-400">
                      {nextLevel.minPoints - (stats?.totalPoints || 0)} XP 필요
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all"
                      style={{ width: `${progressToNext}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                  <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">{stats?.currentStreak}</p>
                  <p className="text-slate-500 text-xs">연속 학습</p>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                  <Award className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">{stats?.achievements.length}</p>
                  <p className="text-slate-500 text-xs">획득 업적</p>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                  <Users className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">#{userRank?.rank || '-'}</p>
                  <p className="text-slate-500 text-xs">전체 순위</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: '개요', icon: Target },
            { id: 'achievements', label: '업적', icon: Award },
            { id: 'leaderboard', label: '리더보드', icon: Trophy },
            { id: 'history', label: '포인트 기록', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Streak Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                연속 학습 스트릭
              </h2>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-orange-400">{stats?.currentStreak}</p>
                  <p className="text-slate-500">현재 스트릭</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-400">최장 기록: {stats?.longestStreak}일</span>
                  </div>
                  <p className="text-slate-500 text-sm">
                    매일 학습하면 보너스 포인트를 받을 수 있습니다!
                  </p>
                  <div className="flex gap-2 mt-3">
                    <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">
                      7일 연속: +100 XP
                    </span>
                    <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">
                      30일 연속: +500 XP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                레벨 시스템
              </h2>
              <div className="grid grid-cols-7 gap-2">
                {LEVELS.map((level) => (
                  <div
                    key={level.level}
                    className={`p-3 rounded-xl text-center ${
                      stats?.currentLevel.level === level.level
                        ? 'bg-violet-500/20 border-2 border-violet-500'
                        : stats?.currentLevel.level! > level.level
                          ? 'bg-emerald-500/10 border border-emerald-500/30'
                          : 'bg-slate-800/50 border border-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{level.icon}</span>
                    <p className={`text-xs mt-1 ${
                      stats?.currentLevel.level === level.level
                        ? 'text-violet-400 font-bold'
                        : 'text-slate-500'
                    }`}>
                      Lv.{level.level}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  최근 획득 업적
                </h2>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className="text-violet-400 text-sm hover:text-violet-300 flex items-center gap-1"
                >
                  전체 보기 <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {stats?.achievements.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  아직 획득한 업적이 없습니다. 학습을 시작해보세요!
                </p>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {stats?.achievements.slice(0, 5).map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex-shrink-0 w-32 p-4 rounded-xl border text-center ${getRarityBgColor(achievement.rarity)}`}
                    >
                      <span className="text-3xl">{achievement.icon}</span>
                      <p className="text-white text-sm font-medium mt-2 line-clamp-1">
                        {achievement.name}
                      </p>
                      <p className="text-slate-500 text-xs mt-1">
                        +{achievement.points} XP
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Point Earning Guide */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-fuchsia-400" />
                포인트 획득 방법
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { action: '매일 로그인', points: 10, icon: '📅' },
                  { action: '출석 체크', points: 15, icon: '✅' },
                  { action: '과제 제출', points: 30, icon: '📝' },
                  { action: '과정 수료', points: 200, icon: '🎓' },
                  { action: '후기 작성', points: 25, icon: '✍️' },
                  { action: '만점 획득', points: 50, icon: '💯' },
                ].map((item) => (
                  <div
                    key={item.action}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                  >
                    <span className="flex items-center gap-2 text-slate-300">
                      <span>{item.icon}</span>
                      {item.action}
                    </span>
                    <span className="text-violet-400 font-medium">+{item.points} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            {['learning', 'streak', 'social', 'special'].map((category) => (
              <div key={category} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 capitalize">
                  {category === 'learning' && '📚 학습 업적'}
                  {category === 'streak' && '🔥 스트릭 업적'}
                  {category === 'social' && '👥 소셜 업적'}
                  {category === 'special' && '✨ 특별 업적'}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {ACHIEVEMENTS.filter(a => a.category === category).map((achievement) => {
                    const isUnlocked = stats?.achievements.some(a => a.id === achievement.id)
                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-xl border ${
                          isUnlocked
                            ? getRarityBgColor(achievement.rarity)
                            : 'bg-slate-800/30 border-slate-700/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`text-3xl ${!isUnlocked && 'opacity-30 grayscale'}`}>
                            {isUnlocked ? achievement.icon : '🔒'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                                {achievement.name}
                              </h3>
                              <span className={`px-2 py-0.5 text-xs rounded bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`}>
                                {achievement.rarity}
                              </span>
                            </div>
                            <p className={`text-sm mt-1 ${isUnlocked ? 'text-slate-400' : 'text-slate-600'}`}>
                              {achievement.description}
                            </p>
                            <p className={`text-sm mt-2 ${isUnlocked ? 'text-violet-400' : 'text-slate-600'}`}>
                              +{achievement.points} XP
                            </p>
                          </div>
                          {isUnlocked && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                이번 달 리더보드
              </h2>
            </div>

            {/* Top 3 */}
            <div className="p-6 bg-gradient-to-b from-slate-800/50 to-transparent">
              <div className="flex items-end justify-center gap-4">
                {/* 2nd Place */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-2xl mb-2">
                    {leaderboard[1]?.avatar}
                  </div>
                  <p className="text-white font-medium">{leaderboard[1]?.name}</p>
                  <p className="text-slate-500 text-sm">{leaderboard[1]?.points.toLocaleString()} XP</p>
                  <div className="mt-2 w-16 h-20 bg-slate-600 rounded-t-lg flex items-center justify-center">
                    <Medal className="w-8 h-8 text-slate-300" />
                  </div>
                </div>

                {/* 1st Place */}
                <div className="text-center -mt-4">
                  <Crown className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-3xl mb-2 shadow-lg shadow-amber-500/30">
                    {leaderboard[0]?.avatar}
                  </div>
                  <p className="text-white font-bold">{leaderboard[0]?.name}</p>
                  <p className="text-amber-400 text-sm font-medium">{leaderboard[0]?.points.toLocaleString()} XP</p>
                  <div className="mt-2 w-20 h-28 bg-amber-500/30 rounded-t-lg flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-amber-400" />
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-700/50 rounded-full flex items-center justify-center text-2xl mb-2">
                    {leaderboard[2]?.avatar}
                  </div>
                  <p className="text-white font-medium">{leaderboard[2]?.name}</p>
                  <p className="text-slate-500 text-sm">{leaderboard[2]?.points.toLocaleString()} XP</p>
                  <div className="mt-2 w-16 h-16 bg-amber-700/30 rounded-t-lg flex items-center justify-center">
                    <Medal className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Rest of leaderboard */}
            <div className="divide-y divide-slate-800">
              {leaderboard.slice(3).map((user, idx) => (
                <div
                  key={user.rank}
                  className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 text-center text-slate-500 font-medium">
                      {user.rank}
                    </span>
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-lg">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-slate-500 text-sm">Lv.{user.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{user.points.toLocaleString()} XP</p>
                    <p className="text-orange-400 text-sm flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {user.streak}일
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* My Rank */}
            {userRank && (
              <div className="p-4 bg-violet-500/10 border-t border-violet-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="w-8 text-center text-violet-400 font-bold">
                      #{userRank.rank}
                    </span>
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold">
                      나
                    </div>
                    <div>
                      <p className="text-white font-medium">내 순위</p>
                      <p className="text-slate-500 text-sm">Lv.{stats?.currentLevel.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-violet-400 font-bold">{stats?.totalPoints.toLocaleString()} XP</p>
                    <p className="text-orange-400 text-sm flex items-center gap-1 justify-end">
                      <Flame className="w-3 h-3" />
                      {stats?.currentStreak}일
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              포인트 획득 기록
            </h2>
            {stats?.pointHistory.length === 0 ? (
              <p className="text-slate-500 text-center py-12">
                아직 포인트 기록이 없습니다
              </p>
            ) : (
              <div className="space-y-3">
                {stats?.pointHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                  >
                    <div>
                      <p className="text-white">{entry.action}</p>
                      <p className="text-slate-500 text-sm">
                        {new Date(entry.timestamp).toLocaleDateString('ko-KR', {
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className="text-emerald-400 font-medium">+{entry.points} XP</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
