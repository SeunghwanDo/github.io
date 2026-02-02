'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  TrendingUp,
  Award,
  Building2,
  Target,
  BookOpen,
  BarChart3,
  Shield,
  Cpu,
  Factory,
  ChevronRight,
  Play,
  Star,
  Save,
  Loader2,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useAssessment } from '@/hooks/useAuth'

interface SkillQuestion {
  id: number
  category: string
  question: string
  options: { value: number; label: string }[]
}

const skillQuestions: SkillQuestion[] = [
  {
    id: 1,
    category: '스마트 제조',
    question: 'PLC(Programmable Logic Controller) 프로그래밍 경험이 있습니까?',
    options: [
      { value: 1, label: '전혀 없음' },
      { value: 2, label: '기초 이해' },
      { value: 3, label: '실무 경험 있음' },
      { value: 4, label: '고급 활용 가능' },
      { value: 5, label: '전문가 수준' },
    ],
  },
  {
    id: 2,
    category: '데이터 분석',
    question: '생산 데이터 분석 및 시각화 도구 사용 경험이 있습니까?',
    options: [
      { value: 1, label: '전혀 없음' },
      { value: 2, label: '엑셀 기초' },
      { value: 3, label: 'BI 도구 사용 가능' },
      { value: 4, label: '통계 분석 가능' },
      { value: 5, label: '머신러닝 적용 가능' },
    ],
  },
  {
    id: 3,
    category: '품질관리',
    question: 'SPC(통계적 공정관리) 이해도는 어느 정도입니까?',
    options: [
      { value: 1, label: '전혀 모름' },
      { value: 2, label: '개념 이해' },
      { value: 3, label: '관리도 해석 가능' },
      { value: 4, label: '공정능력 분석 가능' },
      { value: 5, label: 'SPC 시스템 구축 가능' },
    ],
  },
  {
    id: 4,
    category: '자동화',
    question: '산업용 로봇 또는 협동로봇 운용 경험이 있습니까?',
    options: [
      { value: 1, label: '전혀 없음' },
      { value: 2, label: '이론만 학습' },
      { value: 3, label: '기본 조작 가능' },
      { value: 4, label: '프로그래밍 가능' },
      { value: 5, label: '시스템 설계 가능' },
    ],
  },
  {
    id: 5,
    category: 'IoT/센서',
    question: '산업용 IoT 센서 및 네트워크 구성 경험이 있습니까?',
    options: [
      { value: 1, label: '전혀 없음' },
      { value: 2, label: '센서 종류 이해' },
      { value: 3, label: '데이터 수집 경험' },
      { value: 4, label: '네트워크 구성 가능' },
      { value: 5, label: 'IoT 플랫폼 구축 가능' },
    ],
  },
]

interface SkillResult {
  category: string
  score: number
  level: string
  recommendation: string
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'test' | 'result'>('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [results, setResults] = useState<SkillResult[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const { saveAssessment } = useAssessment()

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers({ ...answers, [questionId]: value })
  }

  const handleNext = () => {
    if (currentQuestion < skillQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = async () => {
    const skillResults: SkillResult[] = skillQuestions.map((q) => {
      const score = answers[q.id] || 1
      let level = ''
      let recommendation = ''

      if (score <= 1) {
        level = '입문'
        recommendation = `${q.category} 기초 과정 추천`
      } else if (score <= 2) {
        level = '초급'
        recommendation = `${q.category} 실무 기초 과정 추천`
      } else if (score <= 3) {
        level = '중급'
        recommendation = `${q.category} 심화 과정 추천`
      } else if (score <= 4) {
        level = '고급'
        recommendation = `${q.category} 전문가 과정 추천`
      } else {
        level = '전문가'
        recommendation = `${q.category} 마스터/강사 과정 추천`
      }

      return { category: q.category, score, level, recommendation }
    })

    setResults(skillResults)
    setCurrentStep('result')

    // Auto-save assessment
    const scores: Record<string, number> = {}
    skillResults.forEach((r) => {
      scores[r.category] = r.score
    })
    const avgScore = skillResults.reduce((sum, r) => sum + r.score, 0) / skillResults.length

    setSaving(true)
    try {
      await saveAssessment(scores, avgScore)
      setSaved(true)
    } catch (error) {
      console.error('Failed to save assessment:', error)
    } finally {
      setSaving(false)
    }
  }

  const resetTest = () => {
    setCurrentStep('intro')
    setCurrentQuestion(0)
    setAnswers({})
    setResults([])
    setSaved(false)
  }

  const averageScore = results.length
    ? (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)
    : '0'

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-emerald-400'
    if (score >= 3) return 'text-blue-400'
    if (score >= 2) return 'text-amber-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 4) return 'bg-emerald-500/20 border-emerald-500/30'
    if (score >= 3) return 'bg-blue-500/20 border-blue-500/30'
    if (score >= 2) return 'bg-amber-500/20 border-amber-500/30'
    return 'bg-red-500/20 border-red-500/30'
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Intro Section */}
      {currentStep === 'intro' && (
        <>
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-violet-950/50 to-slate-950" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm mb-6">
                  <Factory className="w-4 h-4" />
                  부울경 제조업 특화 비즈니스 플랫폼
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  제조 현장의{' '}
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                    디지털 혁신
                  </span>
                  을<br />시작하세요
                </h1>

                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                  역량 진단부터 맞춤 교육, 기업 관리까지.
                  <br />
                  Biz360이 제조업의 스마트한 성장을 지원합니다.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setCurrentStep('test')}
                    className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition shadow-lg shadow-violet-500/25 inline-flex items-center justify-center gap-2"
                  >
                    무료 역량 진단 시작
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <Link
                    href="/skillbridge"
                    className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition inline-flex items-center justify-center gap-2"
                  >
                    교육 과정 둘러보기
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
                {[
                  { value: '2,500+', label: '진단 완료', icon: Target },
                  { value: '200+', label: '교육 과정', icon: BookOpen },
                  { value: '150+', label: '파트너 기업', icon: Building2 },
                  { value: '95%', label: '만족도', icon: Star },
                ].map((stat, i) => {
                  const Icon = stat.icon
                  return (
                    <div key={i} className="text-center p-6 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
                      <Icon className="w-6 h-6 text-violet-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-slate-500 text-sm">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">왜 Biz360인가요?</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                제조업에 특화된 올인원 비즈니스 플랫폼으로 기업의 경쟁력을 높이세요.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: '정밀 역량 진단',
                  description: '스마트 제조, 품질관리, 자동화 등 5개 핵심 영역의 역량을 체계적으로 평가합니다.',
                  color: 'violet',
                },
                {
                  icon: Cpu,
                  title: 'AI 맞춤 매칭',
                  description: '진단 결과를 기반으로 200개 이상의 교육 과정 중 최적의 커리큘럼을 추천합니다.',
                  color: 'fuchsia',
                },
                {
                  icon: BarChart3,
                  title: '실시간 대시보드',
                  description: '기업 현황 데이터와 연계하여 조직 전체의 역량 현황을 한눈에 파악합니다.',
                  color: 'blue',
                },
              ].map((feature, i) => {
                const Icon = feature.icon
                return (
                  <div
                    key={i}
                    className="group p-8 bg-slate-800/30 border border-slate-700/50 rounded-2xl hover:border-violet-500/50 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={`w-14 h-14 bg-${feature.color}-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                      <Icon className={`w-7 h-7 text-${feature.color}-400`} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* CTA */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="relative bg-gradient-to-r from-violet-900/50 to-fuchsia-900/50 rounded-3xl p-12 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />

              <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    지금 바로 역량 진단을 시작하세요
                  </h2>
                  <p className="text-slate-300 max-w-xl">
                    5분 만에 현재 역량 수준을 파악하고, 맞춤형 교육 추천을 받아보세요.
                    완전 무료입니다.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep('test')}
                  className="flex-shrink-0 px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition inline-flex items-center gap-2"
                >
                  무료 진단 시작
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Test Section */}
      {currentStep === 'test' && (
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>문항 {currentQuestion + 1} / {skillQuestions.length}</span>
                <span>{Math.round(((currentQuestion + 1) / skillQuestions.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / skillQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-violet-500/20 text-violet-400 text-sm font-medium rounded-full mb-4">
                {skillQuestions[currentQuestion].category}
              </span>
              <h3 className="text-xl font-semibold text-white">
                {skillQuestions[currentQuestion].question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {skillQuestions[currentQuestion].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(skillQuestions[currentQuestion].id, option.value)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition ${
                    answers[skillQuestions[currentQuestion].id] === option.value
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        answers[skillQuestions[currentQuestion].id] === option.value
                          ? 'border-violet-500 bg-violet-500'
                          : 'border-slate-600'
                      }`}
                    >
                      {answers[skillQuestions[currentQuestion].id] === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-slate-300">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrev}
                disabled={currentQuestion === 0}
                className="px-6 py-2 text-slate-400 hover:text-white disabled:opacity-50 transition"
              >
                이전
              </button>
              <button
                onClick={handleNext}
                disabled={!answers[skillQuestions[currentQuestion].id]}
                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition disabled:opacity-50"
              >
                {currentQuestion === skillQuestions.length - 1 ? '결과 보기' : '다음'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Section */}
      {currentStep === 'result' && (
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">역량 진단 결과</h2>
            <p className="text-slate-400">총점 평균: {averageScore} / 5.0</p>
            {saving && (
              <div className="flex items-center justify-center gap-2 mt-2 text-violet-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                결과 저장 중...
              </div>
            )}
            {saved && (
              <div className="flex items-center justify-center gap-2 mt-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                결과가 저장되었습니다
              </div>
            )}
          </div>

          {/* Overall Score */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-40 h-40">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="#334155" strokeWidth="12" fill="none" />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(parseFloat(averageScore) / 5) * 440} 440`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{averageScore}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {results.map((result, index) => (
                <div key={index} className="text-center p-4 bg-slate-700/30 rounded-xl">
                  <div className={`text-2xl font-bold mb-1 ${getScoreColor(result.score)}`}>
                    {result.score}
                  </div>
                  <div className="text-slate-400 text-sm mb-2">{result.category}</div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getScoreBg(result.score)} ${getScoreColor(result.score)}`}>
                    {result.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">맞춤 교육 추천</h3>
            <div className="space-y-4">
              {results
                .filter((r) => r.score < 4)
                .map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl"
                  >
                    <div>
                      <div className="font-medium text-white">{result.recommendation}</div>
                      <div className="text-sm text-slate-500">
                        현재 수준: {result.level} (Level {result.score})
                      </div>
                    </div>
                    <Link
                      href="/skillbridge"
                      className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition text-sm"
                    >
                      과정 보기
                    </Link>
                  </div>
                ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <button
              onClick={resetTest}
              className="px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition"
            >
              다시 진단하기
            </button>
            <Link
              href="/skillbridge"
              className="px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition"
            >
              교육 과정 찾아보기
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Biz<span className="text-violet-400">360</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm">
              &copy; 2024 Biz360. 부울경 제조업을 위한 비즈니스 플랫폼
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
