'use client'

import { useState } from 'react'
import Link from 'next/link'

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

  const calculateResults = () => {
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
  }

  const resetTest = () => {
    setCurrentStep('intro')
    setCurrentQuestion(0)
    setAnswers({})
    setResults([])
  }

  const averageScore = results.length
    ? (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)
    : '0'

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SkillBridge</h1>
                <p className="text-xs text-gray-500">제조업 교육 매칭 플랫폼</p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-primary-600 font-medium"
              >
                기업 대시보드
              </Link>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
                로그인
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Intro Section */}
      {currentStep === 'intro' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero */}
          <div className="text-center mb-16">
            <span className="inline-block bg-manufacturing-100 text-manufacturing-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Biz360 연계 서비스
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              스마트 제조 인력의
              <br />
              <span className="text-primary-600">역량을 진단</span>하고{' '}
              <span className="text-manufacturing-600">맞춤 교육</span>을 매칭합니다
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              5분 스킬 진단으로 현재 역량 수준을 파악하고,
              <br />
              AI 기반 맞춤형 교육 과정을 추천받으세요.
            </p>
            <button
              onClick={() => setCurrentStep('test')}
              className="bg-primary-600 text-white text-lg px-8 py-4 rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-200"
            >
              무료 스킬 진단 시작하기
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">정밀 역량 진단</h3>
              <p className="text-gray-600">
                스마트 제조, 품질관리, 자동화 등 5개 핵심 영역의 역량을 체계적으로 평가합니다.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="w-12 h-12 bg-manufacturing-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-manufacturing-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI 맞춤 매칭</h3>
              <p className="text-gray-600">
                진단 결과를 기반으로 200개 이상의 교육 과정 중 최적의 커리큘럼을 추천합니다.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Biz360 연동</h3>
              <p className="text-gray-600">
                기업 현황 데이터와 연계하여 조직 전체의 역량 현황을 한눈에 파악합니다.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-1">2,500+</div>
                <div className="text-primary-100">진단 완료</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">200+</div>
                <div className="text-primary-100">교육 과정</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">150+</div>
                <div className="text-primary-100">파트너 기업</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">95%</div>
                <div className="text-primary-100">만족도</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Section */}
      {currentStep === 'test' && (
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  문항 {currentQuestion + 1} / {skillQuestions.length}
                </span>
                <span>{Math.round(((currentQuestion + 1) / skillQuestions.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 transition-all duration-300"
                  style={{
                    width: `${((currentQuestion + 1) / skillQuestions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <span className="inline-block bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
                {skillQuestions[currentQuestion].category}
              </span>
              <h3 className="text-xl font-semibold text-gray-900">
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
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        answers[skillQuestions[currentQuestion].id] === option.value
                          ? 'border-primary-600 bg-primary-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {answers[skillQuestions[currentQuestion].id] === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-gray-700">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrev}
                disabled={currentQuestion === 0}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                이전
              </button>
              <button
                onClick={handleNext}
                disabled={!answers[skillQuestions[currentQuestion].id]}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">스킬 진단 결과</h2>
            <p className="text-gray-600">총점 평균: {averageScore} / 5.0</p>
          </div>

          {/* Overall Score */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#2563eb"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(parseFloat(averageScore) / 5) * 352} 352`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{averageScore}</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-4">
              {results.map((result, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-primary-600 mb-1">{result.score}</div>
                  <div className="text-sm text-gray-600 mb-1">{result.category}</div>
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded-full ${
                      result.score >= 4
                        ? 'bg-manufacturing-100 text-manufacturing-700'
                        : result.score >= 3
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {result.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">맞춤 교육 추천</h3>
            <div className="space-y-4">
              {results
                .filter((r) => r.score < 4)
                .map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{result.recommendation}</div>
                      <div className="text-sm text-gray-500">
                        현재 수준: {result.level} (Level {result.score})
                      </div>
                    </div>
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm">
                      과정 보기
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <button
              onClick={resetTest}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
            >
              다시 진단하기
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition"
            >
              기업 대시보드 보기
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-white font-semibold">SkillBridge</span>
              </div>
              <p className="text-sm">Biz360 연계 제조업 교육 매칭 플랫폼</p>
            </div>
            <div className="text-sm">
              &copy; 2024 SkillBridge. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
