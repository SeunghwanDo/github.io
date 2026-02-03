'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  FileText,
  Target,
  TrendingUp,
  Award,
  BarChart3,
  BookOpen,
  Play,
  Send,
  Loader2,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import {
  useCourseProgress,
  getProgressColor,
  getProgressBgColor,
  getStatusText,
  formatDate,
} from '@/hooks/useCourseProgress'

export default function ProgressDetailPage() {
  const params = useParams()
  const courseId = params.id as string
  const { progress, loading, submitAssignment, completeMilestone } = useCourseProgress(courseId)
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'assignments' | 'milestones'>('overview')
  const [submittingId, setSubmittingId] = useState<string | null>(null)

  const handleSubmitAssignment = async (assignmentId: string) => {
    setSubmittingId(assignmentId)
    await submitAssignment(assignmentId)
    setSubmittingId(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-800 rounded w-1/3" />
            <div className="h-64 bg-slate-800 rounded-2xl" />
          </div>
        </main>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-16 text-center">
          <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">수강 중인 과정이 아닙니다</h1>
          <p className="text-slate-500 mb-6">이 교육과정에 등록되어 있지 않습니다.</p>
          <Link
            href="/skillbridge"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition"
          >
            교육과정 둘러보기
          </Link>
        </main>
      </div>
    )
  }

  const statusInfo = getStatusText(progress.enrollment_status)

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-violet-400">홈</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/mypage" className="hover:text-violet-400">마이페이지</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-violet-400">학습 진행률</span>
        </div>

        {/* Header */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.color}`}>
                {statusInfo.text}
              </span>
              <h1 className="text-2xl font-bold text-white mt-2">{progress.course_title}</h1>
              <div className="flex items-center gap-4 mt-2 text-slate-400 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(progress.start_date)} ~ {formatDate(progress.end_date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {progress.current_week}/{progress.total_weeks}주차
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getProgressColor(progress.overall_progress)}`}>
                  {progress.overall_progress}%
                </div>
                <p className="text-slate-500 text-sm">전체 진행률</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressBgColor(progress.overall_progress)}`}
                style={{ width: `${progress.overall_progress}%` }}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className={`text-2xl font-bold ${getProgressColor(progress.attendance_rate)}`}>
                {progress.attendance_rate}%
              </p>
              <p className="text-slate-500 text-sm">출석률</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <FileText className="w-6 h-6 text-violet-400 mx-auto mb-2" />
              <p className={`text-2xl font-bold ${getProgressColor(progress.assignment_completion_rate)}`}>
                {progress.assignment_completion_rate}%
              </p>
              <p className="text-slate-500 text-sm">과제 완료율</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <Target className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {progress.milestones.filter((m) => m.completed).length}/{progress.milestones.length}
              </p>
              <p className="text-slate-500 text-sm">마일스톤</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: '개요', icon: BarChart3 },
            { id: 'attendance', label: '출석', icon: Calendar },
            { id: 'assignments', label: '과제', icon: FileText },
            { id: 'milestones', label: '마일스톤', icon: Target },
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

        {/* Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Upcoming Tasks */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">다가오는 일정</h2>
                <div className="space-y-3">
                  {progress.assignments
                    .filter((a) => a.status === 'pending')
                    .slice(0, 3)
                    .map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-violet-400" />
                          <div>
                            <p className="text-white font-medium">{assignment.title}</p>
                            <p className="text-slate-500 text-sm">마감: {formatDate(assignment.due_date)}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs bg-amber-500/20 text-amber-400 rounded">
                          진행 중
                        </span>
                      </div>
                    ))}
                  {progress.milestones
                    .filter((m) => !m.completed)
                    .slice(0, 2)
                    .map((milestone) => (
                      <div
                        key={milestone.id}
                        className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <Target className="w-5 h-5 text-amber-400" />
                          <div>
                            <p className="text-white font-medium">{milestone.title}</p>
                            <p className="text-slate-500 text-sm">목표일: {formatDate(milestone.target_date)}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs bg-slate-500/20 text-slate-400 rounded">
                          예정
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">최근 완료</h2>
                <div className="space-y-3">
                  {progress.assignments
                    .filter((a) => a.status === 'graded')
                    .slice(0, 3)
                    .map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <div>
                            <p className="text-white font-medium">{assignment.title}</p>
                            <p className="text-slate-500 text-sm">
                              {assignment.score}/{assignment.max_score}점
                            </p>
                          </div>
                        </div>
                        <span className="text-emerald-400 font-semibold">
                          {Math.round((assignment.score! / assignment.max_score) * 100)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">출석 현황</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <span className="text-slate-400">출석</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-amber-500 rounded-full" />
                    <span className="text-slate-400">지각</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-slate-400">결석</span>
                  </span>
                </div>
              </div>

              {/* Attendance Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                  <div key={day} className="text-center text-slate-500 text-sm py-2">
                    {day}
                  </div>
                ))}
                {progress.attendance.slice(-28).map((att, idx) => {
                  const bgColor =
                    att.status === 'present'
                      ? 'bg-emerald-500/30 border-emerald-500/50'
                      : att.status === 'late'
                        ? 'bg-amber-500/30 border-amber-500/50'
                        : att.status === 'excused'
                          ? 'bg-blue-500/30 border-blue-500/50'
                          : 'bg-red-500/30 border-red-500/50'
                  return (
                    <div
                      key={idx}
                      className={`aspect-square rounded-lg border ${bgColor} flex items-center justify-center text-sm text-white`}
                      title={`${att.date}: ${att.status}`}
                    >
                      {new Date(att.date).getDate()}
                    </div>
                  )
                })}
              </div>

              {/* Attendance List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {[...progress.attendance].reverse().map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {att.status === 'present' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : att.status === 'late' ? (
                        <Clock className="w-5 h-5 text-amber-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span className="text-white">{formatDate(att.date)}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      {att.check_in_time && (
                        <span className="text-slate-400">입실: {att.check_in_time}</span>
                      )}
                      {att.check_out_time && (
                        <span className="text-slate-400">퇴실: {att.check_out_time}</span>
                      )}
                      <span
                        className={`px-2 py-1 rounded ${
                          att.status === 'present'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : att.status === 'late'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {att.status === 'present' ? '출석' : att.status === 'late' ? '지각' : '결석'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="space-y-4">
              {progress.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{assignment.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            assignment.status === 'graded'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : assignment.status === 'submitted'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {assignment.status === 'graded'
                            ? '채점 완료'
                            : assignment.status === 'submitted'
                              ? '제출됨'
                              : '진행 중'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-3">{assignment.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>마감: {formatDate(assignment.due_date)}</span>
                        {assignment.submitted_at && (
                          <span>제출: {formatDate(assignment.submitted_at)}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {assignment.status === 'graded' ? (
                        <div>
                          <p className={`text-2xl font-bold ${getProgressColor((assignment.score! / assignment.max_score) * 100)}`}>
                            {assignment.score}
                          </p>
                          <p className="text-slate-500 text-sm">/ {assignment.max_score}점</p>
                        </div>
                      ) : assignment.status === 'pending' ? (
                        <button
                          onClick={() => handleSubmitAssignment(assignment.id)}
                          disabled={submittingId === assignment.id}
                          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition flex items-center gap-2"
                        >
                          {submittingId === assignment.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              제출 중...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              제출하기
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-blue-400">채점 대기 중</span>
                      )}
                    </div>
                  </div>
                  {assignment.feedback && (
                    <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-slate-500 text-sm mb-1">강사 피드백</p>
                      <p className="text-slate-300">{assignment.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">학습 마일스톤</h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-700" />

                <div className="space-y-6">
                  {progress.milestones.map((milestone, idx) => (
                    <div key={milestone.id} className="relative flex gap-4">
                      {/* Timeline dot */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                          milestone.completed
                            ? 'bg-emerald-500/20 border-2 border-emerald-500'
                            : 'bg-slate-800 border-2 border-slate-600'
                        }`}
                      >
                        {milestone.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-500" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div
                          className={`p-4 rounded-xl ${
                            milestone.completed
                              ? 'bg-emerald-500/10 border border-emerald-500/30'
                              : 'bg-slate-800/50 border border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-white">{milestone.title}</h3>
                              <p className="text-slate-400 text-sm mt-1">{milestone.description}</p>
                              <p className="text-slate-500 text-sm mt-2">
                                {milestone.completed
                                  ? `완료: ${formatDate(milestone.completed_at!)}`
                                  : `목표: ${formatDate(milestone.target_date)}`}
                              </p>
                            </div>
                            {!milestone.completed && idx === progress.milestones.findIndex((m) => !m.completed) && (
                              <button
                                onClick={() => completeMilestone(milestone.id)}
                                className="px-3 py-1 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-500 transition"
                              >
                                완료
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Certificate CTA */}
        {progress.overall_progress === 100 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Award className="w-12 h-12 text-violet-400" />
                <div>
                  <h3 className="text-xl font-semibold text-white">과정을 완료했습니다!</h3>
                  <p className="text-slate-400">수료증을 발급받으세요</p>
                </div>
              </div>
              <Link
                href="/mypage?tab=certificates"
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition"
              >
                수료증 확인하기
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
