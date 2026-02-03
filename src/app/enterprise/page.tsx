'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search, Filter, Users, Bookmark, BookmarkCheck, MapPin, Briefcase,
  Award, Star, Clock, ChevronDown, ChevronUp, X, Building2,
  ArrowLeft, Mail, Phone, ExternalLink, Check, Eye
} from 'lucide-react'
import {
  useTalentSearch, Talent, skillOptions, locationOptions, certificationOptions
} from '@/hooks/useTalentSearch'

type ViewMode = 'search' | 'saved'

export default function EnterprisePage() {
  const {
    talents, loading, filters, updateFilters, resetFilters,
    saveTalent, unsaveTalent, isTalentSaved, getSavedTalentsList, getStats
  } = useTalentSearch()

  const [viewMode, setViewMode] = useState<ViewMode>('search')
  const [showFilters, setShowFilters] = useState(true)
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null)

  const stats = getStats()
  const savedTalentsList = getSavedTalentsList()

  const skillLevels = ['all', '입문', '초급', '중급', '고급', '전문가']

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-fuchsia-400 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            대시보드로 돌아가기
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-fuchsia-500/20 rounded-xl">
              <Building2 className="w-6 h-6 text-fuchsia-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">인재 검색</h1>
          </div>
          <p className="text-slate-400">스킬브릿지 수료생 중 우수 인재를 검색하고 채용하세요</p>

          {/* 통계 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{stats.totalTalents}</div>
              <div className="text-sm text-slate-400">전체 인재</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">{stats.availableTalents}</div>
              <div className="text-sm text-slate-400">구직중</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-fuchsia-400">{stats.savedCount}</div>
              <div className="text-sm text-slate-400">저장한 인재</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-400">{stats.avgExperience.toFixed(1)}년</div>
              <div className="text-sm text-slate-400">평균 경력</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 탭 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode('search')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              viewMode === 'search'
                ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Search className="w-5 h-5" />
            인재 검색
          </button>
          <button
            onClick={() => setViewMode('saved')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              viewMode === 'saved'
                ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            저장한 인재
            {savedTalentsList.length > 0 && (
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {savedTalentsList.length}
              </span>
            )}
          </button>
        </div>

        {viewMode === 'search' ? (
          <div className="flex gap-6">
            {/* 필터 사이드바 */}
            <div className={`${showFilters ? 'w-72' : 'w-0'} flex-shrink-0 transition-all overflow-hidden`}>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    필터
                  </h3>
                  <button
                    onClick={resetFilters}
                    className="text-xs text-fuchsia-400 hover:text-fuchsia-300"
                  >
                    초기화
                  </button>
                </div>

                {/* 검색 */}
                <div className="mb-4">
                  <label className="block text-sm text-slate-400 mb-2">검색</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="이름, 스킬, 직무..."
                      value={filters.query}
                      onChange={(e) => updateFilters({ query: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                    />
                  </div>
                </div>

                {/* 스킬 */}
                <div className="mb-4">
                  <label className="block text-sm text-slate-400 mb-2">스킬</label>
                  <select
                    onChange={(e) => {
                      if (e.target.value && !filters.skills.includes(e.target.value)) {
                        updateFilters({ skills: [...filters.skills, e.target.value] })
                      }
                      e.target.value = ''
                    }}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-fuchsia-500"
                  >
                    <option value="">스킬 선택...</option>
                    {skillOptions.map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filters.skills.map(skill => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-fuchsia-500/20 text-fuchsia-400 rounded-lg text-xs"
                      >
                        {skill}
                        <button onClick={() => updateFilters({ skills: filters.skills.filter(s => s !== skill) })}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 경력 */}
                <div className="mb-4">
                  <label className="block text-sm text-slate-400 mb-2">경력 (년)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={filters.minExperience}
                      onChange={(e) => updateFilters({ minExperience: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-fuchsia-500"
                    />
                    <span className="text-slate-500">~</span>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={filters.maxExperience}
                      onChange={(e) => updateFilters({ maxExperience: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-fuchsia-500"
                    />
                  </div>
                </div>

                {/* 지역 */}
                <div className="mb-4">
                  <label className="block text-sm text-slate-400 mb-2">지역</label>
                  <select
                    value={filters.location}
                    onChange={(e) => updateFilters({ location: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-fuchsia-500"
                  >
                    <option value="">전체 지역</option>
                    {locationOptions.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* 스킬 레벨 */}
                <div className="mb-4">
                  <label className="block text-sm text-slate-400 mb-2">최소 스킬 레벨</label>
                  <select
                    value={filters.skillLevel}
                    onChange={(e) => updateFilters({ skillLevel: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-fuchsia-500"
                  >
                    {skillLevels.map(level => (
                      <option key={level} value={level}>
                        {level === 'all' ? '전체' : level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 구직중만 */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.isAvailableOnly}
                      onChange={(e) => updateFilters({ isAvailableOnly: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-600 text-fuchsia-500 focus:ring-fuchsia-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-sm text-slate-300">구직중인 인재만</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 필터 토글 버튼 */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="fixed left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors md:hidden"
            >
              {showFilters ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white" />}
            </button>

            {/* 인재 목록 */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400">
                  <span className="text-white font-medium">{talents.length}</span>명의 인재
                </p>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg text-slate-300 text-sm"
                >
                  <Filter className="w-4 h-4" />
                  필터
                </button>
              </div>

              {talents.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
                  <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">검색 결과가 없습니다</h3>
                  <p className="text-slate-400">필터 조건을 변경해보세요</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {talents.map(talent => (
                    <TalentCard
                      key={talent.id}
                      talent={talent}
                      isSaved={isTalentSaved(talent.id)}
                      onSave={() => saveTalent(talent.id)}
                      onUnsave={() => unsaveTalent(talent.id)}
                      onSelect={() => setSelectedTalent(talent)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 저장한 인재 */
          <div>
            {savedTalentsList.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <Bookmark className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">저장한 인재가 없습니다</h3>
                <p className="text-slate-400 mb-6">관심 있는 인재를 저장해보세요</p>
                <button
                  onClick={() => setViewMode('search')}
                  className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-xl font-medium"
                >
                  인재 검색하기
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedTalentsList.map(item => item.talent && (
                  <TalentCard
                    key={item.talentId}
                    talent={item.talent}
                    isSaved={true}
                    onSave={() => {}}
                    onUnsave={() => unsaveTalent(item.talentId)}
                    onSelect={() => setSelectedTalent(item.talent!)}
                    savedInfo={item}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 인재 상세 모달 */}
      {selectedTalent && (
        <TalentDetailModal
          talent={selectedTalent}
          isSaved={isTalentSaved(selectedTalent.id)}
          onSave={() => saveTalent(selectedTalent.id)}
          onUnsave={() => unsaveTalent(selectedTalent.id)}
          onClose={() => setSelectedTalent(null)}
        />
      )}
    </div>
  )
}

// 인재 카드 컴포넌트
interface TalentCardProps {
  talent: Talent
  isSaved: boolean
  onSave: () => void
  onUnsave: () => void
  onSelect: () => void
  savedInfo?: { savedAt: Date; status: string }
}

function TalentCard({ talent, isSaved, onSave, onUnsave, onSelect, savedInfo }: TalentCardProps) {
  const levelColors: Record<string, string> = {
    '입문': 'bg-green-500/20 text-green-400',
    '초급': 'bg-blue-500/20 text-blue-400',
    '중급': 'bg-yellow-500/20 text-yellow-400',
    '고급': 'bg-orange-500/20 text-orange-400',
    '전문가': 'bg-red-500/20 text-red-400',
  }

  return (
    <div
      className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-fuchsia-500/50 transition-all cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-start gap-4">
        {/* 프로필 */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {talent.name[0]}
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-white">{talent.name}</h3>
                {talent.isAvailable ? (
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">구직중</span>
                ) : (
                  <span className="px-2 py-0.5 bg-slate-700 text-slate-400 rounded-full text-xs">재직중</span>
                )}
              </div>
              <p className="text-fuchsia-400 font-medium">{talent.title}</p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                isSaved ? onUnsave() : onSave()
              }}
              className={`p-2 rounded-xl transition-all ${
                isSaved
                  ? 'bg-fuchsia-500/20 text-fuchsia-400'
                  : 'bg-slate-800 text-slate-400 hover:text-fuchsia-400'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
          </div>

          {/* 기본 정보 */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              경력 {talent.experience}년
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {talent.location}
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              자격증 {talent.certifications.length}개
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              조회 {talent.viewCount}
            </span>
          </div>

          {/* 스킬 */}
          <div className="flex flex-wrap gap-2 mt-3">
            {talent.skills.slice(0, 5).map(skill => (
              <span
                key={skill.name}
                className={`px-2 py-1 rounded-lg text-xs font-medium ${levelColors[skill.level] || 'bg-slate-700 text-slate-300'}`}
              >
                {skill.name}
              </span>
            ))}
            {talent.skills.length > 5 && (
              <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded-lg text-xs">
                +{talent.skills.length - 5}
              </span>
            )}
          </div>

          {/* 저장 정보 */}
          {savedInfo && (
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-4 text-xs text-slate-500">
              <span>저장일: {new Date(savedInfo.savedAt).toLocaleDateString()}</span>
              <span className="px-2 py-0.5 bg-slate-700 rounded">
                {savedInfo.status === 'saved' && '저장됨'}
                {savedInfo.status === 'contacted' && '연락함'}
                {savedInfo.status === 'interviewing' && '면접 중'}
                {savedInfo.status === 'hired' && '채용 완료'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 인재 상세 모달
interface TalentDetailModalProps {
  talent: Talent
  isSaved: boolean
  onSave: () => void
  onUnsave: () => void
  onClose: () => void
}

function TalentDetailModal({ talent, isSaved, onSave, onUnsave, onClose }: TalentDetailModalProps) {
  const levelColors: Record<string, string> = {
    '입문': 'bg-green-500/20 text-green-400',
    '초급': 'bg-blue-500/20 text-blue-400',
    '중급': 'bg-yellow-500/20 text-yellow-400',
    '고급': 'bg-orange-500/20 text-orange-400',
    '전문가': 'bg-red-500/20 text-red-400',
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex items-start justify-between z-10">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
              {talent.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-white">{talent.name}</h2>
                {talent.isAvailable ? (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">구직중</span>
                ) : (
                  <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded-lg text-sm">재직중</span>
                )}
              </div>
              <p className="text-lg text-fuchsia-400">{talent.title}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  경력 {talent.experience}년
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {talent.location}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6 space-y-6">
          {/* 희망 조건 */}
          <div className="bg-slate-800/50 rounded-xl p-4">
            <h3 className="font-semibold text-white mb-3">희망 조건</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-slate-500">희망 포지션</span>
                <p className="text-white">{talent.desiredPosition}</p>
              </div>
              {talent.desiredSalary && (
                <div>
                  <span className="text-sm text-slate-500">희망 연봉</span>
                  <p className="text-white">{talent.desiredSalary}</p>
                </div>
              )}
              {talent.availableFrom && (
                <div>
                  <span className="text-sm text-slate-500">입사 가능일</span>
                  <p className="text-white">{new Date(talent.availableFrom).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* 자기소개 */}
          <div>
            <h3 className="font-semibold text-white mb-3">자기소개</h3>
            <p className="text-slate-300 leading-relaxed">{talent.introduction}</p>
          </div>

          {/* 스킬 */}
          <div>
            <h3 className="font-semibold text-white mb-3">보유 스킬</h3>
            <div className="space-y-2">
              {talent.skills.map(skill => (
                <div key={skill.name} className="flex items-center gap-4 bg-slate-800/50 rounded-xl p-3">
                  <span className="text-white font-medium flex-1">{skill.name}</span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${levelColors[skill.level]}`}>
                    {skill.level}
                  </span>
                  <span className="text-sm text-slate-500">{skill.yearsOfExperience}년</span>
                </div>
              ))}
            </div>
          </div>

          {/* 자격증 */}
          <div>
            <h3 className="font-semibold text-white mb-3">자격증</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {talent.certifications.map(cert => (
                <div key={cert.name} className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-3">
                  <div className="w-10 h-10 rounded-lg bg-fuchsia-500/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">{cert.name}</span>
                      {cert.isVerified && <Check className="w-4 h-4 text-green-400" />}
                    </div>
                    <span className="text-xs text-slate-500">{cert.issuer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 수료 과정 */}
          <div>
            <h3 className="font-semibold text-white mb-3">스킬브릿지 수료 과정</h3>
            <div className="space-y-2">
              {talent.completedCourses.map(course => (
                <div key={course.id} className="flex items-center justify-between bg-slate-800/50 rounded-xl p-3">
                  <div>
                    <span className="text-white font-medium">{course.name}</span>
                    <div className="text-sm text-slate-500">{course.provider}</div>
                  </div>
                  <div className="text-right">
                    {course.score && (
                      <div className="text-fuchsia-400 font-medium">{course.score}점</div>
                    )}
                    <div className="text-xs text-slate-500">
                      {new Date(course.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-4 flex gap-3">
          <button
            onClick={isSaved ? onUnsave : onSave}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
              isSaved
                ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            {isSaved ? '저장됨' : '저장하기'}
          </button>
          <a
            href={`mailto:${talent.email}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all"
          >
            <Mail className="w-5 h-5" />
            연락하기
          </a>
        </div>
      </div>
    </div>
  )
}
