'use client'

import { useState } from 'react'
import {
  Shield, CheckCircle, Heart, Briefcase, Award, AlertCircle,
  Loader2, ChevronRight, ExternalLink, Lock, Unlock
} from 'lucide-react'
import { useVerification, getFitnessGradeBadge } from '@/hooks/useVerification'

export default function DataCertification() {
  const {
    userProfile,
    isLoading,
    connectFitnessData,
    verifyCareerHistory
  } = useVerification()

  const [expandedSection, setExpandedSection] = useState<'fitness' | 'career' | null>(null)

  if (!userProfile) return null

  const { verification } = userProfile
  const fitnessGrade = getFitnessGradeBadge(verification.fitness.grade)

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">내 데이터 인증</h3>
            <p className="text-sm text-gray-600">공공 데이터 연동으로 신뢰도를 높이세요</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* 국민체력100 Integration */}
        <div className={`rounded-xl border-2 transition-all ${
          verification.fitness.verified
            ? 'border-green-200 bg-green-50'
            : 'border-gray-200 bg-white'
        }`}>
          <div
            className="p-4 cursor-pointer"
            onClick={() => setExpandedSection(expandedSection === 'fitness' ? null : 'fitness')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  verification.fitness.verified ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Heart className={`w-5 h-5 ${
                    verification.fitness.verified ? 'text-green-600' : 'text-gray-500'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">국민체력100</h4>
                    {verification.fitness.verified && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        인증 완료
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">건강 체력 인증</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {verification.fitness.verified && (
                  <div className="flex items-center gap-1">
                    <span className="text-2xl">{fitnessGrade.emoji}</span>
                    <span className={`font-bold ${fitnessGrade.color}`}>
                      {fitnessGrade.label}
                    </span>
                  </div>
                )}
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedSection === 'fitness' ? 'rotate-90' : ''
                }`} />
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          {expandedSection === 'fitness' && (
            <div className="px-4 pb-4 space-y-4">
              <div className="h-px bg-gray-200" />

              {verification.fitness.verified ? (
                <>
                  {/* Fitness Metrics */}
                  {verification.fitness.metrics && (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: '심폐지구력', value: verification.fitness.metrics.cardio, color: 'bg-red-500' },
                        { label: '근력', value: verification.fitness.metrics.strength, color: 'bg-blue-500' },
                        { label: '유연성', value: verification.fitness.metrics.flexibility, color: 'bg-green-500' },
                        { label: '균형감각', value: verification.fitness.metrics.balance, color: 'bg-purple-500' }
                      ].map((metric) => (
                        <div key={metric.label} className="p-3 bg-white rounded-lg border">
                          <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${metric.color} rounded-full`}
                                style={{ width: `${metric.value}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{metric.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 p-3 bg-green-100 rounded-lg text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      건강 인증 완료 - 현장 근무 적합
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    인증일: {new Date(verification.fitness.verifiedAt!).toLocaleDateString('ko-KR')}
                  </p>
                </>
              ) : (
                <>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">국민체력100 인증이란?</h5>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 전국 체력인증센터에서 무료 체력 측정</li>
                      <li>• 체력 등급(1~3급) 인증서 발급</li>
                      <li>• 기업에 건강한 근로자임을 증명</li>
                    </ul>
                  </div>

                  <button
                    onClick={connectFitnessData}
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        연동 중...
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5" />
                        건강 데이터 연동하기
                      </>
                    )}
                  </button>

                  <a
                    href="https://nfa.kspo.or.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    국민체력100 센터 찾기
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </>
              )}
            </div>
          )}
        </div>

        {/* 고용24 Integration */}
        <div className={`rounded-xl border-2 transition-all ${
          verification.career.verified
            ? 'border-green-200 bg-green-50'
            : 'border-gray-200 bg-white'
        }`}>
          <div
            className="p-4 cursor-pointer"
            onClick={() => setExpandedSection(expandedSection === 'career' ? null : 'career')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  verification.career.verified ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Briefcase className={`w-5 h-5 ${
                    verification.career.verified ? 'text-green-600' : 'text-gray-500'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">고용24</h4>
                    {verification.career.verified && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        인증 완료
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">경력 이력 인증</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {verification.isExpert && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-sm rounded-full font-medium">
                    <Award className="w-4 h-4" />
                    검증된 전문가
                  </span>
                )}
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedSection === 'career' ? 'rotate-90' : ''
                }`} />
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          {expandedSection === 'career' && (
            <div className="px-4 pb-4 space-y-4">
              <div className="h-px bg-gray-200" />

              {verification.career.verified ? (
                <>
                  {/* Verified Employment History */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-900 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      인증된 경력 ({verification.career.totalYears}년)
                    </h5>

                    {verification.career.employmentHistory.map((job, index) => (
                      <div key={index} className="p-3 bg-white rounded-lg border">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{job.company}</p>
                            <p className="text-sm text-gray-600">{job.position}</p>
                            <p className="text-xs text-gray-500">
                              {job.startDate} ~ {job.endDate}
                            </p>
                          </div>
                          {job.verified && (
                            <span className="flex items-center gap-1 text-green-600 text-xs">
                              <CheckCircle className="w-3 h-3" />
                              인증됨
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {verification.isExpert && (
                    <div className="flex items-center gap-2 p-3 bg-amber-100 rounded-lg text-amber-800">
                      <Award className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        5년 이상 경력 인증 - 검증된 전문가 배지 획득!
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    인증일: {new Date(verification.career.verifiedAt!).toLocaleDateString('ko-KR')}
                  </p>
                </>
              ) : (
                <>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">고용24 경력 인증이란?</h5>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 국민연금, 건강보험 가입 이력 기반 검증</li>
                      <li>• 허위 경력 기재 방지</li>
                      <li>• 5년 이상 경력 시 '검증된 전문가' 배지 부여</li>
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg text-amber-800">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">
                      경력 인증을 완료하면 기업에서 신뢰할 수 있는 후보자로 우선 검토됩니다.
                    </span>
                  </div>

                  <button
                    onClick={verifyCareerHistory}
                    disabled={isLoading}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        인증 중...
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-5 h-5" />
                        경력 이력 인증하기
                      </>
                    )}
                  </button>

                  <a
                    href="https://www.work24.go.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 text-sm text-indigo-600 hover:underline"
                  >
                    고용24 바로가기
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </>
              )}
            </div>
          )}
        </div>

        {/* Trust Score Summary */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-gray-900">신뢰도 점수</span>
            <span className="text-2xl font-bold text-blue-600">
              {calculateTrustScore(verification)}점
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
              style={{ width: `${calculateTrustScore(verification)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>기본</span>
            <span>신뢰</span>
            <span>우수</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function calculateTrustScore(verification: { fitness: { verified: boolean; grade: number | null }; career: { verified: boolean }; isExpert: boolean }): number {
  let score = 20 // Base score

  if (verification.fitness.verified) {
    score += 25
    if (verification.fitness.grade === 1) score += 15
    else if (verification.fitness.grade === 2) score += 10
    else if (verification.fitness.grade === 3) score += 5
  }

  if (verification.career.verified) {
    score += 30
    if (verification.isExpert) score += 10
  }

  return Math.min(score, 100)
}
