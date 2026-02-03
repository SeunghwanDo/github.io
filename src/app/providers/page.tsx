'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  Search,
  Building2,
  MapPin,
  Users,
  Star,
  BookOpen,
  Filter,
  ArrowRight,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { getAllProviders, Provider } from '@/data/providers'
import { useDebounce } from '@/hooks/useDebounce'

const providerTypes: Provider['type'][] = ['대학', '직업훈련원', '기업연수원', '온라인', '정부기관']

export default function ProvidersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('전체')
  const debouncedSearch = useDebounce(searchTerm, 300)

  const allProviders = getAllProviders()

  const filteredProviders = allProviders.filter((provider) => {
    const matchesSearch =
      debouncedSearch === '' ||
      provider.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      provider.specialties.some((s) => s.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
      provider.location.toLowerCase().includes(debouncedSearch.toLowerCase())

    const matchesType = selectedType === '전체' || provider.type === selectedType

    return matchesSearch && matchesType
  })

  const getTypeColor = (type: Provider['type']) => {
    switch (type) {
      case '대학':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case '직업훈련원':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case '기업연수원':
        return 'bg-violet-500/20 text-violet-400 border-violet-500/30'
      case '온라인':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case '정부기관':
        return 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/" className="hover:text-violet-400">홈</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-violet-400">교육기관</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">교육기관 둘러보기</h1>
          <p className="text-slate-400">
            신뢰할 수 있는 교육기관에서 전문 교육을 받으세요
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="교육기관, 전문 분야, 지역 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              <button
                onClick={() => setSelectedType('전체')}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition ${
                  selectedType === '전체'
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                전체
              </button>
              {providerTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition ${
                    selectedType === type
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-500">총 {filteredProviders.length}개의 교육기관</p>
        </div>

        {/* Provider Cards */}
        {filteredProviders.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <Building2 className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">검색 결과가 없습니다</h3>
            <p className="text-slate-500">다른 검색어나 필터를 시도해보세요</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredProviders.map((provider) => (
              <Link
                key={provider.id}
                href={`/providers/${provider.id}`}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-violet-500/30 transition group"
              >
                <div className="flex items-start gap-4">
                  {/* Logo */}
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {provider.name[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getTypeColor(provider.type)}`}>
                        {provider.type}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 text-sm">
                        <Star className="w-3 h-3 fill-current" />
                        {provider.rating}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition truncate">
                      {provider.name}
                    </h3>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {provider.location}
                    </p>
                  </div>

                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-violet-400 transition" />
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-800 text-sm">
                  <span className="flex items-center gap-1 text-slate-400">
                    <BookOpen className="w-4 h-4" />
                    {provider.totalCourses}개 과정
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Users className="w-4 h-4" />
                    {provider.totalStudents.toLocaleString()}명 수강
                  </span>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {provider.specialties.slice(0, 4).map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded"
                    >
                      {specialty}
                    </span>
                  ))}
                  {provider.specialties.length > 4 && (
                    <span className="px-2 py-0.5 text-slate-500 text-xs">
                      +{provider.specialties.length - 4}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
