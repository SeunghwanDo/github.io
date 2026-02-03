'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  Target,
  Sparkles,
  TrendingUp,
  Star,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Loader2,
  Briefcase,
  GraduationCap,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import {
  useRecommendations,
  careerGoals,
  getReasonIcon,
  getReasonColor,
} from '@/hooks/useRecommendations'

export default function RecommendationsPage() {
  const {
    recommendations,
    loading,
    selectedGoal,
    setCareerGoal,
    getRoadmap,
    refresh,
  } = useRecommendations()
  const [showGoalSelector, setShowGoalSelector] = useState(false)

  const roadmap = selectedGoal ? getRoadmap(selectedGoal.id) : []

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/" className="hover:text-violet-400">홈</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-violet-400">AI 추천</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-violet-400" />
                AI 맞춤 교육 추천
              </h1>
              <p className="text-slate-400">
                역량 진단 결과와 커리어 목표를 기반으로 최적의 교육과정을 추천합니다
              </p>
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition flex items-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              새로고침
            </button>
          </div>
        </div>

        {/* Career Goal Section */}
        <div className="bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-semibold text-white">커리어 목표</h2>
              </div>
              {selectedGoal ? (
                <div>
                  <p className="text-2xl font-bold text-white mb-1">{selectedGoal.title}</p>
                  <p className="text-slate-400">{selectedGoal.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedGoal.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-violet-500/20 text-violet-300 text-sm rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-slate-400">커리어 목표를 설정하면 더 정확한 추천을 받을 수 있습니다</p>
              )}
            </div>
            <button
              onClick={() => setShowGoalSelector(!showGoalSelector)}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition"
            >
              {selectedGoal ? '목표 변경' : '목표 설정'}
            </button>
          </div>

          {/* Goal Selector */}
          {showGoalSelector && (
            <div className="mt-6 pt-6 border-t border-violet-500/30">
              <p className="text-slate-400 text-sm mb-4">원하는 커리어 목표를 선택하세요</p>
              <div className="grid md:grid-cols-3 gap-4">
                {careerGoals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => {
                      setCareerGoal(goal.id)
                      setShowGoalSelector(false)
                    }}
                    className={`p-4 rounded-xl text-left transition ${
                      selectedGoal?.id === goal.id
                        ? 'bg-violet-600 border-2 border-violet-400'
                        : 'bg-slate-800/50 border border-slate-700 hover:border-violet-500/50'
                    }`}
                  >
                    <h3 className="text-white font-semibold mb-1">{goal.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{goal.description}</p>
                  </button>
                ))}
              </div>
              {selectedGoal && (
                <button
                  onClick={() => {
                    setCareerGoal(null)
                    setShowGoalSelector(false)
                  }}
                  className="mt-4 text-slate-400 text-sm hover:text-white"
                >
                  목표 초기화
                </button>
              )}
            </div>
          )}
        </div>

        {/* Learning Roadmap */}
        {selectedGoal && roadmap.length > 0 && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">학습 로드맵</h2>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-violet-500 to-fuchsia-500" />

              <div className="space-y-6">
                {roadmap.map((step, idx) => (
                  <div key={step.course.id} className="relative flex gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold z-10">
                      {step.step}
                    </div>
                    <div className="flex-1 bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800 transition">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-violet-400 text-sm font-medium mb-1">
                            STEP {step.step}
                          </p>
                          <h3 className="text-white font-semibold mb-2">{step.course.title}</h3>
                          <p className="text-slate-500 text-sm mb-3">{step.course.provider_name}</p>
                          <div className="flex flex-wrap gap-2">
                            {step.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Link
                          href={`/skillbridge/${step.course.id}`}
                          className="px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-500 transition flex items-center gap-1"
                        >
                          상세보기
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              추천 교육과정
            </h2>
            <span className="text-slate-500 text-sm">
              {recommendations.length}개의 추천
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <Target className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">추천 결과가 없습니다</h3>
              <p className="text-slate-500 mb-6">역량 진단을 받으면 맞춤 추천을 받을 수 있습니다</p>
              <Link
                href="/dashboard"
                className="inline-flex px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition"
              >
                역량 진단 시작
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.map((rec, idx) => (
                <div
                  key={rec.course.id}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-violet-500/30 transition group"
                >
                  {/* Rank Badge */}
                  {idx < 3 && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {idx + 1}
                    </div>
                  )}

                  {/* Course Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-violet-400 text-sm font-medium">{rec.course.provider_name}</p>
                      <h3 className="text-lg font-semibold text-white mt-1 group-hover:text-violet-300 transition">
                        <Link href={`/skillbridge/${rec.course.id}`}>
                          {rec.course.title}
                        </Link>
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{rec.course.rating}</span>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {rec.course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {rec.course.location?.split(' ')[0] || '온라인'}
                    </span>
                  </div>

                  {/* Recommendation Reasons */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {rec.reasons.map((reason, ridx) => (
                      <span
                        key={ridx}
                        className={`px-2 py-1 text-xs rounded-lg border flex items-center gap-1 ${getReasonColor(reason.type)}`}
                      >
                        <span>{getReasonIcon(reason.type)}</span>
                        {reason.type === 'skill_gap' && '역량 보완'}
                        {reason.type === 'career_goal' && '목표 달성'}
                        {reason.type === 'popular' && '인기 과정'}
                        {reason.type === 'job_match' && '취업 연계'}
                        {reason.type === 'trending' && '트렌드'}
                      </span>
                    ))}
                  </div>

                  {/* Reason Detail */}
                  <div className="text-sm text-slate-500 mb-4">
                    {rec.reasons[0]?.description}
                  </div>

                  {/* Missing Skills */}
                  {rec.missingSkills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 mb-2">배울 수 있는 스킬</p>
                      <div className="flex flex-wrap gap-2">
                        {rec.missingSkills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded"
                          >
                            + {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <span className="text-emerald-400 font-medium">{rec.course.cost}</span>
                    <Link
                      href={`/skillbridge/${rec.course.id}`}
                      className="px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-500 transition flex items-center gap-2"
                    >
                      자세히 보기
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-2xl p-6">
            <Briefcase className="w-10 h-10 text-emerald-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">채용공고 확인하기</h3>
            <p className="text-slate-400 mb-4">
              추천 교육과정을 수료하면 지원 가능한 채용공고를 확인하세요
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300"
            >
              채용공고 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6">
            <TrendingUp className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">역량 재진단</h3>
            <p className="text-slate-400 mb-4">
              학습 후 역량 진단을 다시 받으면 성장을 확인할 수 있습니다
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
            >
              역량 진단하기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
