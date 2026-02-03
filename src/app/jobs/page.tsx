'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  MapPin,
  Building2,
  Clock,
  Users,
  Eye,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  GraduationCap,
  TrendingUp,
  Filter,
  Briefcase,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useJobs, useSavedJobs, useJobMatching } from '@/hooks/useJobs'
import { useDebounce } from '@/hooks/useDebounce'
import { jobCategories } from '@/data/jobs'
import { courses } from '@/data/courses'

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [showMatchingOnly, setShowMatchingOnly] = useState(false)

  const debouncedSearch = useDebounce(searchTerm, 300)
  const { jobs, loading } = useJobs({
    category: selectedCategory,
    search: debouncedSearch,
  })
  const { savedJobs, saveJob, unsaveJob, isJobSaved } = useSavedJobs()
  const { matchedJobs } = useJobMatching()

  // Get match info for a job
  const getMatchInfo = (jobId: string) => {
    return matchedJobs.find((m) => m.job.id === jobId)
  }

  // Filter jobs based on matching toggle
  const displayJobs = showMatchingOnly
    ? jobs.filter((job) => {
        const match = getMatchInfo(job.id)
        return match && match.score >= 30
      })
    : jobs

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/" className="hover:text-violet-400">
              홈
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-violet-400">채용공고</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Biz360 채용공고</h1>
          <p className="text-slate-400">
            내 역량에 맞는 채용공고를 찾고, 필요한 교육과정을 추천받으세요
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="회사명, 직무, 스킬로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              <Filter className="w-5 h-5 text-slate-500 flex-shrink-0 mt-3 hidden lg:block" />
              {jobCategories.slice(0, 6).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition ${
                    selectedCategory === category
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showMatchingOnly}
                onChange={(e) => setShowMatchingOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-violet-500 focus:ring-violet-500"
              />
              <span className="text-slate-300 text-sm">내 역량과 매칭되는 공고만 보기</span>
            </label>
            <span className="text-slate-500 text-sm">
              총 {displayJobs.length}개의 채용공고
            </span>
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid gap-4">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-5 bg-slate-800 rounded w-1/3 mb-2" />
                    <div className="h-6 bg-slate-800 rounded w-2/3 mb-3" />
                    <div className="h-4 bg-slate-800 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))
          ) : displayJobs.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">채용공고가 없습니다</h3>
              <p className="text-slate-500">
                {showMatchingOnly
                  ? '역량 진단을 완료하면 맞춤 채용공고를 확인할 수 있습니다.'
                  : '검색 조건을 변경해 보세요.'}
              </p>
              {showMatchingOnly && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition"
                >
                  <TrendingUp className="w-5 h-5" />
                  역량 진단하기
                </Link>
              )}
            </div>
          ) : (
            displayJobs.map((job) => {
              const matchInfo = getMatchInfo(job.id)
              const isSaved = isJobSaved(job.id)

              return (
                <div
                  key={job.id}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-violet-500/30 transition group"
                >
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Company Logo */}
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-8 h-8 text-slate-500" />
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-violet-400 text-sm font-medium">{job.company_name}</p>
                          <h3 className="text-xl font-semibold text-white mt-1 group-hover:text-violet-300 transition">
                            <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                          </h3>
                        </div>

                        {/* Match Score Badge */}
                        {matchInfo && matchInfo.score > 0 && (
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${
                              matchInfo.score >= 70
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : matchInfo.score >= 40
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                            }`}
                          >
                            매칭 {matchInfo.score}%
                          </div>
                        )}
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-slate-400">
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
                        {job.salary_range && (
                          <span className="text-emerald-400">{job.salary_range}</span>
                        )}
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.required_skills.map((skill) => {
                          const isMatched = matchInfo?.matchedRequired.includes(skill)
                          return (
                            <span
                              key={skill}
                              className={`px-2 py-1 rounded text-xs ${
                                isMatched
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {skill}
                              {isMatched && ' ✓'}
                            </span>
                          )
                        })}
                        {job.preferred_skills.slice(0, 2).map((skill) => {
                          const isMatched = matchInfo?.matchedPreferred.includes(skill)
                          return (
                            <span
                              key={skill}
                              className={`px-2 py-1 rounded text-xs ${
                                isMatched
                                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                                  : 'bg-slate-800/50 text-slate-500'
                              }`}
                            >
                              {skill}
                              {isMatched && ' ✓'}
                            </span>
                          )
                        })}
                      </div>

                      {/* Missing Skills & Recommended Courses */}
                      {matchInfo && matchInfo.missingRequired.length > 0 && (
                        <div className="mt-4 p-3 bg-slate-800/50 rounded-xl">
                          <p className="text-xs text-slate-500 mb-2">
                            부족한 역량을 위한 추천 교육과정
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {matchInfo.recommendedCourses.slice(0, 2).map((courseId) => {
                              const course = courses[courseId]
                              if (!course) return null
                              return (
                                <Link
                                  key={courseId}
                                  href={`/skillbridge/${courseId}`}
                                  className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/30 rounded-lg text-sm text-violet-300 hover:bg-violet-500/20 transition"
                                >
                                  <GraduationCap className="w-4 h-4" />
                                  {course.title}
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col items-center gap-2 lg:gap-3">
                      <button
                        onClick={() => (isSaved ? unsaveJob(job.id) : saveJob(job.id))}
                        className={`p-2 rounded-lg transition ${
                          isSaved
                            ? 'bg-violet-500/20 text-violet-400'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-5 h-5" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-500 transition"
                      >
                        상세보기
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-slate-500 lg:mt-2">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {job.views_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {job.applicants_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Link to SkillBridge */}
        <div className="mt-8 p-6 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">역량 강화가 필요하신가요?</h3>
              <p className="text-slate-400">SkillBridge에서 채용에 필요한 교육과정을 찾아보세요</p>
            </div>
            <Link
              href="/skillbridge"
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition flex items-center gap-2"
            >
              <GraduationCap className="w-5 h-5" />
              교육과정 둘러보기
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
