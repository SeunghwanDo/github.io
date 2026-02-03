'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronRight,
  MapPin,
  Clock,
  Briefcase,
  Users,
  Eye,
  Calendar,
  Building2,
  Bookmark,
  BookmarkCheck,
  Share2,
  GraduationCap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Star,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useJob, useSavedJobs, useJobMatching } from '@/hooks/useJobs'

export default function JobDetailPage() {
  const params = useParams()
  const jobId = params.id as string

  const { job, loading, recommendedCourses } = useJob(jobId)
  const { saveJob, unsaveJob, isJobSaved } = useSavedJobs()
  const { matchedJobs } = useJobMatching()

  const matchInfo = matchedJobs.find((m) => m.job.id === jobId)
  const isSaved = isJobSaved(jobId)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-800 rounded w-1/4 mb-4" />
            <div className="h-12 bg-slate-800 rounded w-3/4 mb-8" />
            <div className="h-64 bg-slate-800 rounded-2xl" />
          </div>
        </main>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">채용공고를 찾을 수 없습니다</h1>
          <Link href="/jobs" className="text-violet-400 hover:text-violet-300">
            채용공고 목록으로 돌아가기
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-violet-400">홈</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/jobs" className="hover:text-violet-400">채용공고</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-violet-400">{job.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-10 h-10 text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-violet-400 font-medium">{job.company_name}</p>
                  <h1 className="text-2xl font-bold text-white mt-1">{job.title}</h1>
                  <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.experience_level}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.employment_type}
                    </span>
                  </div>
                </div>

                {/* Match Score */}
                {matchInfo && matchInfo.score > 0 && (
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold ${
                        matchInfo.score >= 70
                          ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50'
                          : matchInfo.score >= 40
                            ? 'bg-amber-500/20 text-amber-400 border-2 border-amber-500/50'
                            : 'bg-slate-500/20 text-slate-400 border-2 border-slate-500/50'
                      }`}
                    >
                      {matchInfo.score}%
                    </div>
                    <p className="text-xs text-slate-500 mt-1">매칭률</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-slate-800">
                <button className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-medium hover:from-violet-500 hover:to-fuchsia-500 transition">
                  지원하기
                </button>
                <button
                  onClick={() => (isSaved ? unsaveJob(job.id) : saveJob(job.id))}
                  className={`px-4 py-3 rounded-xl transition flex items-center gap-2 ${
                    isSaved
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  {isSaved ? '저장됨' : '저장'}
                </button>
                <button className="px-4 py-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">직무 소개</h2>
              <p className="text-slate-300 leading-relaxed">{job.description}</p>
            </div>

            {/* Responsibilities */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">담당 업무</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300">
                    <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Qualifications */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">자격 요건</h2>
              <ul className="space-y-2">
                {job.qualifications.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Skills */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">필수 스킬</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {job.required_skills.map((skill) => {
                  const isMatched = matchInfo?.matchedRequired.includes(skill)
                  return (
                    <span
                      key={skill}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${
                        isMatched
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {isMatched ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {skill}
                    </span>
                  )
                })}
              </div>

              <h3 className="text-md font-medium text-slate-400 mb-3">우대 스킬</h3>
              <div className="flex flex-wrap gap-2">
                {job.preferred_skills.map((skill) => {
                  const isMatched = matchInfo?.matchedPreferred.includes(skill)
                  return (
                    <span
                      key={skill}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        isMatched
                          ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {skill}
                      {isMatched && ' ✓'}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">복리후생</h2>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Info Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">채용 정보</h3>
              <div className="space-y-4">
                {job.salary_range && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">연봉</span>
                    <span className="text-emerald-400 font-medium">{job.salary_range}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">고용형태</span>
                  <span className="text-white">{job.employment_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">경력</span>
                  <span className="text-white">{job.experience_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">근무지</span>
                  <span className="text-white">{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">마감일</span>
                  <span className="text-white">{job.deadline}</span>
                </div>
                <div className="pt-4 border-t border-slate-800 flex justify-between text-sm">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Eye className="w-4 h-4" />
                    조회 {job.views_count}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Users className="w-4 h-4" />
                    지원 {job.applicants_count}명
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Courses */}
            {recommendedCourses.length > 0 && (
              <div className="bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 border border-violet-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-violet-400" />
                  <h3 className="text-lg font-semibold text-white">추천 교육과정</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  이 채용공고에 필요한 역량을 기를 수 있는 교육과정입니다
                </p>
                <div className="space-y-3">
                  {recommendedCourses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/skillbridge/${course.id}`}
                      className="block p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-white font-medium group-hover:text-violet-300 transition line-clamp-1">
                            {course.title}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">{course.provider_name}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="flex items-center gap-1 text-xs text-amber-400">
                              <Star className="w-3 h-3 fill-current" />
                              {course.rating}
                            </span>
                            <span className="text-xs text-slate-500">{course.duration}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-violet-400 transition" />
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/skillbridge"
                  className="block text-center text-sm text-violet-400 hover:text-violet-300 mt-4"
                >
                  더 많은 교육과정 보기
                </Link>
              </div>
            )}

            {/* Skill Assessment CTA */}
            {!matchInfo || matchInfo.score === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">내 역량 진단하기</h3>
                <p className="text-slate-400 text-sm mb-4">
                  역량 진단을 완료하면 이 채용공고와의 매칭률을 확인할 수 있습니다
                </p>
                <Link
                  href="/dashboard"
                  className="block text-center py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition"
                >
                  역량 진단 시작
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}
