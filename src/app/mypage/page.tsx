'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { useAuth, useAssessment } from '@/hooks/useAuth'
import { useCourseApplication } from '@/hooks/useCourseApplication'
import { useCertificates, getBadgeColorClass } from '@/hooks/useCertificates'
import { useCourseProgress, getProgressColor, getProgressBgColor, getStatusText } from '@/hooks/useCourseProgress'
import {
  User,
  Mail,
  Calendar,
  Target,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  BarChart3,
  Award,
  RefreshCw,
  Loader2,
  FileText,
  Download,
  Share2,
} from 'lucide-react'

interface Assessment {
  id: string
  scores: Record<string, number>
  average_score: number
  created_at: string
}

interface Application {
  id: string
  course_id: string
  status: string
  applied_at: string
  notes?: string
}

// Mock course data for display
const courseNames: Record<string, string> = {
  '1': '아크 용접 기능사 자격증 취득반',
  '2': '산업안전기사 실기 완성',
  '3': '품질관리(QC) 전문가 양성과정',
  '4': 'PLC 자동화 시스템 실무',
  '5': '지게차 운전 기능사 취득',
  '6': '스마트 센서 및 IoT 기초',
}

export default function MyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const { getAssessments } = useAssessment()
  const { getMyApplications } = useCourseApplication()
  const { certificates, badges, loading: certsLoading } = useCertificates()
  const { allProgress, loading: progressLoading } = useCourseProgress()

  // Get initial tab from URL param
  const tabParam = searchParams.get('tab')
  const initialTab = tabParam === 'certificates' ? 'certificates' : tabParam === 'progress' ? 'progress' : 'overview'

  const [activeTab, setActiveTab] = useState<'overview' | 'assessments' | 'applications' | 'progress' | 'certificates'>(initialTab as 'overview' | 'assessments' | 'applications' | 'progress' | 'certificates')
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [assessmentResult, applicationResult] = await Promise.all([
          getAssessments(),
          getMyApplications(),
        ])

        if (assessmentResult.data) {
          setAssessments(assessmentResult.data)
        }
        setApplications(applicationResult || [])
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Redirect if not logged in (after auth check)
  useEffect(() => {
    if (!authLoading && !user) {
      // For demo, allow access even without login
      // router.push('/auth')
    }
  }, [authLoading, user, router])

  const latestAssessment = assessments[0]

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: '심사 중', color: 'text-amber-400', bg: 'bg-amber-500/20', icon: Clock }
      case 'approved':
        return { text: '승인됨', color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: CheckCircle2 }
      case 'rejected':
        return { text: '미승인', color: 'text-red-400', bg: 'bg-red-500/20', icon: XCircle }
      case 'completed':
        return { text: '수료', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Award }
      case 'cancelled':
        return { text: '취소됨', color: 'text-slate-400', bg: 'bg-slate-500/20', icon: XCircle }
      default:
        return { text: status, color: 'text-slate-400', bg: 'bg-slate-500/20', icon: AlertCircle }
    }
  }

  const getSkillLevel = (score: number) => {
    if (score >= 4) return { text: '전문가', color: 'text-emerald-400' }
    if (score >= 3) return { text: '숙련자', color: 'text-blue-400' }
    if (score >= 2) return { text: '중급자', color: 'text-amber-400' }
    return { text: '초급자', color: 'text-red-400' }
  }

  const getSkillBarColor = (score: number) => {
    if (score >= 4) return 'bg-emerald-500'
    if (score >= 3) return 'bg-blue-500'
    if (score >= 2) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Header */}
      <section className="relative border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 to-slate-950" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
              {user?.email?.[0].toUpperCase() || 'G'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                {user?.user_metadata?.name || user?.email?.split('@')[0] || '게스트'}
              </h1>
              <div className="flex items-center gap-4 text-slate-400">
                {user?.email && (
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                )}
                {user?.created_at && (
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    가입일: {formatDate(user.created_at)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-slate-800 sticky top-16 z-40 bg-slate-900/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 sm:gap-8 overflow-x-auto">
            {[
              { id: 'overview', label: '개요', icon: BarChart3 },
              { id: 'progress', label: '학습 현황', icon: TrendingUp },
              { id: 'assessments', label: '역량 진단', icon: Target },
              { id: 'applications', label: '신청 내역', icon: BookOpen },
              { id: 'certificates', label: '수료증/뱃지', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 py-4 px-2 font-medium transition border-b-2 ${
                    activeTab === tab.id
                      ? 'text-violet-400 border-violet-400'
                      : 'text-slate-500 border-transparent hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-violet-500/20 rounded-xl">
                        <Target className="w-6 h-6 text-violet-400" />
                      </div>
                      {latestAssessment && (
                        <span className={`text-sm ${getSkillLevel(latestAssessment.average_score).color}`}>
                          {getSkillLevel(latestAssessment.average_score).text}
                        </span>
                      )}
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {latestAssessment ? latestAssessment.average_score.toFixed(1) : '-'}
                    </div>
                    <div className="text-slate-500 text-sm">평균 역량 점수</div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{assessments.length}</div>
                    <div className="text-slate-500 text-sm">완료한 진단</div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <BookOpen className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{applications.length}</div>
                    <div className="text-slate-500 text-sm">신청한 교육</div>
                  </div>
                </div>

                {/* Latest Assessment */}
                {latestAssessment && (
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-white">최근 역량 진단 결과</h2>
                      <span className="text-slate-500 text-sm">
                        {formatDate(latestAssessment.created_at)}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {Object.entries(latestAssessment.scores).map(([skill, score]) => (
                        <div key={skill}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-300">{skill}</span>
                            <span className="text-slate-500">{score} / 5</span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getSkillBarColor(score)}`}
                              style={{ width: `${(score / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
                      <Link
                        href="/"
                        className="text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1"
                      >
                        다시 진단하기
                        <RefreshCw className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setActiveTab('assessments')}
                        className="text-slate-400 hover:text-white text-sm flex items-center gap-1"
                      >
                        전체 기록 보기
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Recent Applications */}
                {applications.length > 0 && (
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-white">최근 신청 내역</h2>
                      <button
                        onClick={() => setActiveTab('applications')}
                        className="text-slate-400 hover:text-white text-sm flex items-center gap-1"
                      >
                        전체 보기
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {applications.slice(0, 3).map((app) => {
                        const statusInfo = getStatusInfo(app.status)
                        const StatusIcon = statusInfo.icon
                        return (
                          <Link
                            key={app.id}
                            href={`/skillbridge/${app.course_id}`}
                            className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition"
                          >
                            <div>
                              <p className="text-white font-medium">
                                {courseNames[app.course_id] || `과정 ${app.course_id}`}
                              </p>
                              <p className="text-slate-500 text-sm">{formatDate(app.applied_at)}</p>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.bg}`}>
                              <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                              <span className={`text-sm ${statusInfo.color}`}>{statusInfo.text}</span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!latestAssessment && applications.length === 0 && (
                  <div className="text-center py-20">
                    <User className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">시작해보세요!</h3>
                    <p className="text-slate-500 mb-6">역량 진단을 받고 맞춤 교육을 찾아보세요</p>
                    <div className="flex items-center justify-center gap-4">
                      <Link
                        href="/"
                        className="px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition"
                      >
                        역량 진단 시작
                      </Link>
                      <Link
                        href="/skillbridge"
                        className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition"
                      >
                        교육 과정 탐색
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Assessments Tab */}
            {activeTab === 'assessments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">역량 진단 기록</h2>
                  <Link
                    href="/"
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    새로 진단하기
                  </Link>
                </div>

                {assessments.length === 0 ? (
                  <div className="text-center py-20 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                    <Target className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">진단 기록이 없습니다</h3>
                    <p className="text-slate-500 mb-6">역량 진단을 받고 나의 강점을 파악해보세요</p>
                    <Link
                      href="/"
                      className="inline-flex px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition"
                    >
                      역량 진단 시작
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assessments.map((assessment, index) => (
                      <div
                        key={assessment.id}
                        className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-violet-500/20 text-violet-400 text-sm rounded-lg">
                              #{assessments.length - index}
                            </span>
                            <span className="text-slate-500 text-sm">
                              {formatDate(assessment.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-white">
                              {assessment.average_score.toFixed(1)}
                            </span>
                            <span className={`text-sm ${getSkillLevel(assessment.average_score).color}`}>
                              {getSkillLevel(assessment.average_score).text}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {Object.entries(assessment.scores).map(([skill, score]) => (
                            <div key={skill} className="text-center">
                              <div
                                className={`w-full h-2 rounded-full mb-2 ${getSkillBarColor(score)}`}
                                style={{ opacity: score / 5 }}
                              />
                              <p className="text-slate-400 text-xs">{skill}</p>
                              <p className="text-white font-medium">{score}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">교육 신청 내역</h2>
                  <Link
                    href="/skillbridge"
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    교육 찾기
                  </Link>
                </div>

                {applications.length === 0 ? (
                  <div className="text-center py-20 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                    <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">신청 내역이 없습니다</h3>
                    <p className="text-slate-500 mb-6">SkillBridge에서 나에게 맞는 교육을 찾아보세요</p>
                    <Link
                      href="/skillbridge"
                      className="inline-flex px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition"
                    >
                      교육 과정 탐색
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => {
                      const statusInfo = getStatusInfo(app.status)
                      const StatusIcon = statusInfo.icon
                      return (
                        <Link
                          key={app.id}
                          href={`/skillbridge/${app.course_id}`}
                          className="block bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-white mb-2">
                                {courseNames[app.course_id] || `교육 과정 ${app.course_id}`}
                              </h3>
                              <div className="flex items-center gap-4 text-slate-500 text-sm">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  신청일: {formatDate(app.applied_at)}
                                </span>
                              </div>
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${statusInfo.bg}`}>
                              <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                              <span className={`font-medium ${statusInfo.color}`}>{statusInfo.text}</span>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">학습 현황</h2>
                  <Link
                    href="/skillbridge"
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    새 교육 찾기
                  </Link>
                </div>

                {progressLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                  </div>
                ) : allProgress.length === 0 ? (
                  <div className="text-center py-20 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                    <TrendingUp className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">수강 중인 과정이 없습니다</h3>
                    <p className="text-slate-500 mb-6">교육과정을 신청하고 학습을 시작하세요</p>
                    <Link
                      href="/skillbridge"
                      className="inline-flex px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition"
                    >
                      교육 과정 탐색
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allProgress.map((prog) => {
                      const statusInfo = getStatusText(prog.enrollment_status)
                      return (
                        <Link
                          key={prog.id}
                          href={`/progress/${prog.course_id}`}
                          className="block bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-violet-500/30 transition"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.color}`}>
                                  {statusInfo.text}
                                </span>
                                <span className="text-slate-500 text-sm">
                                  {prog.current_week}/{prog.total_weeks}주차
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-white mb-2">{prog.course_title}</h3>
                              <div className="flex items-center gap-6 text-sm text-slate-400">
                                <span>출석률: <span className={getProgressColor(prog.attendance_rate)}>{prog.attendance_rate}%</span></span>
                                <span>과제: <span className={getProgressColor(prog.assignment_completion_rate)}>{prog.assignment_completion_rate}%</span></span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className={`text-2xl font-bold ${getProgressColor(prog.overall_progress)}`}>
                                  {prog.overall_progress}%
                                </div>
                                <p className="text-slate-500 text-sm">전체 진행률</p>
                              </div>
                              <div className="w-24 h-24 relative">
                                <svg className="w-full h-full transform -rotate-90">
                                  <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="none"
                                    className="text-slate-700"
                                  />
                                  <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${(prog.overall_progress / 100) * 251.2} 251.2`}
                                    className={getProgressBgColor(prog.overall_progress).replace('bg-', 'text-')}
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-4">
                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${getProgressBgColor(prog.overall_progress)}`}
                                style={{ width: `${prog.overall_progress}%` }}
                              />
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className="space-y-8">
                {/* Certificates Section */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">수료증</h2>
                  {certsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                    </div>
                  ) : certificates.length === 0 ? (
                    <div className="text-center py-12 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                      <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">수료증이 없습니다</h3>
                      <p className="text-slate-500 mb-6">교육 과정을 완료하면 수료증이 발급됩니다</p>
                      <Link
                        href="/skillbridge"
                        className="inline-flex px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition"
                      >
                        교육 과정 탐색
                      </Link>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {certificates.map((cert) => (
                        <div
                          key={cert.id}
                          className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden"
                        >
                          {/* Decorative badge */}
                          <div className="absolute top-4 right-4 w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center">
                            <Award className="w-8 h-8 text-violet-400" />
                          </div>

                          <div className="relative">
                            <p className="text-violet-400 text-sm font-medium mb-1">수료증</p>
                            <h3 className="text-lg font-bold text-white mb-2 pr-16">{cert.course_title}</h3>
                            <p className="text-slate-400 text-sm mb-4">{cert.provider_name}</p>

                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-500">발급번호</span>
                                <span className="text-slate-300 font-mono">{cert.certificate_number}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">발급일</span>
                                <span className="text-slate-300">{formatDate(cert.issued_at)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">상태</span>
                                <span className={`${cert.status === 'active' ? 'text-emerald-400' : 'text-slate-400'}`}>
                                  {cert.status === 'active' ? '유효' : cert.status === 'expired' ? '만료' : '취소됨'}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
                              <button className="flex-1 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition flex items-center justify-center gap-2 text-sm">
                                <Download className="w-4 h-4" />
                                다운로드
                              </button>
                              <button className="py-2 px-4 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition">
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Badges Section */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">획득한 뱃지</h2>
                  {badges.length === 0 ? (
                    <div className="text-center py-12 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                      <Award className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">뱃지가 없습니다</h3>
                      <p className="text-slate-500">활동을 통해 뱃지를 획득해보세요</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {badges.map((badge) => {
                        const colorClass = getBadgeColorClass(badge.color)
                        return (
                          <div
                            key={badge.id}
                            className={`${colorClass.bg} border ${colorClass.border} rounded-2xl p-4 text-center hover:scale-105 transition-transform cursor-pointer`}
                          >
                            <div className="text-4xl mb-2">{badge.icon}</div>
                            <h4 className={`font-semibold ${colorClass.text} mb-1`}>{badge.name}</h4>
                            <p className="text-slate-500 text-xs line-clamp-2">{badge.description}</p>
                            <p className="text-slate-600 text-xs mt-2">{formatDate(badge.earned_at)}</p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
