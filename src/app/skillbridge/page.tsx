'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  Clock,
  MapPin,
  Users,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Settings,
  Award,
  TrendingUp,
  ChevronRight,
  Play,
  BookOpen,
  Loader2,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useCourses } from '@/hooks/useCourses'

const categories = [
  { id: 'all', name: '전체', icon: BookOpen },
  { id: '용접', name: '용접', icon: Zap },
  { id: '안전', name: '안전', icon: Shield },
  { id: '품질', name: '품질', icon: Award },
  { id: '자동화', name: '자동화', icon: Settings },
]

export default function SkillBridgePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    // Simple debounce
    setTimeout(() => {
      setDebouncedSearch(value)
    }, 300)
  }

  // Use the courses hook
  const { courses, loading, error } = useCourses({
    category: selectedCategory,
    search: debouncedSearch,
  })

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case '용접':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case '안전':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case '품질':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case '자동화':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'recruiting':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
            모집중
          </span>
        )
      case 'upcoming':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
            예정
          </span>
        )
      case 'ongoing':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
            진행중
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-slate-500/20 text-slate-400 rounded-full border border-slate-500/30">
            마감
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/50 to-slate-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm mb-6">
              <TrendingUp className="w-4 h-4" />
              부울경 제조업 특화 교육 플랫폼
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              현장 기술,
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                여기서 마스터하세요
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              용접, 안전관리, 품질관리, 자동화까지.
              <br />
              제조 현장에서 바로 쓸 수 있는 실무 교육을 찾아보세요.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="배우고 싶은 기술을 검색하세요..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:from-violet-500 hover:to-fuchsia-500 transition">
                  검색
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center gap-12 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">150+</div>
                <div className="text-slate-500 text-sm">교육 과정</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">2,500+</div>
                <div className="text-slate-500 text-sm">수강생</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">95%</div>
                <div className="text-slate-500 text-sm">취업 연계율</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                    selectedCategory === category.id
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">추천 교육 과정</h2>
            <p className="text-slate-500 mt-1">
              {loading ? '로딩 중...' : `${courses.length}개의 과정이 있습니다`}
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 hover:text-white transition">
            <Filter className="w-4 h-4" />
            필터
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">검색 결과가 없습니다</h3>
            <p className="text-slate-500">다른 키워드로 검색해보세요.</p>
          </div>
        )}

        {/* Course Cards */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/skillbridge/${course.id}`}
                className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-violet-500/50 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center group-hover:bg-violet-600/50 transition">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    {getStatusBadge(course.status)}
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(
                        course.category
                      )}`}
                    >
                      {course.category || '기타'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-400 transition">
                    {course.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                    {course.description || '교육 과정 설명이 없습니다.'}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration || '미정'}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {course.location || '미정'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div>
                      <div className="text-xs text-slate-500">{course.provider_name}</div>
                      <div className="text-lg font-bold text-violet-400">
                        {course.cost || '가격 문의'}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{course.rating || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{course.students || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="px-6 pb-6">
                  <div className="w-full py-3 bg-slate-700/50 text-white rounded-xl group-hover:bg-violet-600 transition flex items-center justify-center gap-2">
                    상세 보기
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && courses.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition inline-flex items-center gap-2">
              더 많은 교육 보기
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative bg-gradient-to-r from-violet-900/50 to-fuchsia-900/50 rounded-3xl p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                우리 회사 맞춤 교육이 필요하신가요?
              </h2>
              <p className="text-slate-300 max-w-xl">
                기업 역량 진단부터 맞춤형 교육 과정 추천까지, SkillBridge가 도와드립니다.
                지금 바로 기업 대시보드에서 직원들의 스킬 현황을 파악해보세요.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="flex-shrink-0 px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition inline-flex items-center gap-2"
            >
              기업 대시보드 바로가기
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Biz<span className="text-violet-400">360</span> SkillBridge
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
