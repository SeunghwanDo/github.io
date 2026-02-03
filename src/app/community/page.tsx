'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MessageSquare, Users, UserCheck, Search, Plus, ThumbsUp, Eye,
  CheckCircle, Clock, MapPin, Video, Calendar, Star, ChevronRight,
  Filter, Tag, Award, BookOpen, ArrowLeft
} from 'lucide-react'
import { useCommunity, Question, StudyGroup, Mentor } from '@/hooks/useCommunity'

type Tab = 'questions' | 'study' | 'mentoring'

export default function CommunityPage() {
  const {
    questions, studyGroups, mentors, loading, categories,
    searchQuestions, searchStudyGroups, searchMentors
  } = useCommunity()

  const [activeTab, setActiveTab] = useState<Tab>('questions')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false)
  const [showNewGroupModal, setShowNewGroupModal] = useState(false)

  // 필터링된 데이터
  const filteredQuestions = searchQuestions(searchQuery, selectedCategory)
  const filteredGroups = searchStudyGroups(searchQuery, selectedCategory, selectedLevel)
  const filteredMentors = searchMentors(searchQuery, selectedCategory)

  const tabs = [
    { id: 'questions', label: 'Q&A 게시판', icon: MessageSquare, count: questions.length },
    { id: 'study', label: '스터디 그룹', icon: Users, count: studyGroups.length },
    { id: 'mentoring', label: '멘토링', icon: UserCheck, count: mentors.length },
  ]

  const levels = ['all', '입문', '초급', '중급', '고급']

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
          <h1 className="text-3xl font-bold text-white mb-2">학습 커뮤니티</h1>
          <p className="text-slate-400">질문하고, 함께 배우고, 멘토를 만나세요</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 탭 네비게이션 */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as Tab)
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-lg shadow-fuchsia-500/25'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder={
                  activeTab === 'questions' ? '질문 검색...' :
                  activeTab === 'study' ? '스터디 그룹 검색...' :
                  '멘토 검색...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
              />
            </div>

            {/* 카테고리 필터 */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-fuchsia-500"
              >
                <option value="all">전체 카테고리</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* 레벨 필터 (스터디 그룹만) */}
            {activeTab === 'study' && (
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-fuchsia-500"
              >
                <option value="all">전체 레벨</option>
                {levels.slice(1).map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            )}

            {/* 글쓰기 버튼 */}
            {activeTab !== 'mentoring' && (
              <button
                onClick={() => activeTab === 'questions' ? setShowNewQuestionModal(true) : setShowNewGroupModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all"
              >
                <Plus className="w-5 h-5" />
                {activeTab === 'questions' ? '질문하기' : '그룹 만들기'}
              </button>
            )}
          </div>
        </div>

        {/* Q&A 게시판 */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">질문이 없습니다</h3>
                <p className="text-slate-400 mb-6">첫 번째 질문을 작성해보세요!</p>
                <button
                  onClick={() => setShowNewQuestionModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-xl font-medium"
                >
                  질문하기
                </button>
              </div>
            ) : (
              filteredQuestions.map(question => (
                <QuestionCard key={question.id} question={question} />
              ))
            )}
          </div>
        )}

        {/* 스터디 그룹 */}
        {activeTab === 'study' && (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredGroups.length === 0 ? (
              <div className="md:col-span-2 text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">스터디 그룹이 없습니다</h3>
                <p className="text-slate-400 mb-6">새로운 스터디 그룹을 만들어보세요!</p>
                <button
                  onClick={() => setShowNewGroupModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-xl font-medium"
                >
                  그룹 만들기
                </button>
              </div>
            ) : (
              filteredGroups.map(group => (
                <StudyGroupCard key={group.id} group={group} />
              ))
            )}
          </div>
        )}

        {/* 멘토링 */}
        {activeTab === 'mentoring' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3 text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <UserCheck className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">멘토가 없습니다</h3>
                <p className="text-slate-400">검색 조건을 변경해보세요.</p>
              </div>
            ) : (
              filteredMentors.map(mentor => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))
            )}
          </div>
        )}
      </div>

      {/* 새 질문 모달 */}
      {showNewQuestionModal && (
        <NewQuestionModal onClose={() => setShowNewQuestionModal(false)} categories={categories} />
      )}

      {/* 새 그룹 모달 */}
      {showNewGroupModal && (
        <NewGroupModal onClose={() => setShowNewGroupModal(false)} categories={categories} />
      )}
    </div>
  )
}

// 질문 카드 컴포넌트
function QuestionCard({ question }: { question: Question }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-fuchsia-500/50 transition-all group cursor-pointer">
      <div className="flex items-start gap-4">
        {/* 상태 표시 */}
        <div className={`p-3 rounded-xl ${
          question.isResolved
            ? 'bg-green-500/20 text-green-400'
            : 'bg-yellow-500/20 text-yellow-400'
        }`}>
          {question.isResolved ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <Clock className="w-6 h-6" />
          )}
        </div>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-fuchsia-500/20 text-fuchsia-400 rounded-lg text-xs font-medium">
              {question.category}
            </span>
            {question.isResolved && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium">
                해결됨
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-fuchsia-400 transition-colors line-clamp-1">
            {question.title}
          </h3>

          <p className="text-slate-400 text-sm mb-3 line-clamp-2">
            {question.content}
          </p>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.slice(0, 4).map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 text-slate-400 rounded-lg text-xs"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* 하단 정보 */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-slate-500">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {question.views}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                {question.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {question.answers.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                {question.author.name[0]}
              </div>
              <span className="text-slate-400">{question.author.name}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-500">
                {new Date(question.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-fuchsia-400 transition-colors" />
      </div>
    </div>
  )
}

// 스터디 그룹 카드 컴포넌트
function StudyGroupCard({ group }: { group: StudyGroup }) {
  const levelColors = {
    '입문': 'bg-green-500/20 text-green-400',
    '초급': 'bg-blue-500/20 text-blue-400',
    '중급': 'bg-yellow-500/20 text-yellow-400',
    '고급': 'bg-red-500/20 text-red-400',
  }

  const meetingTypeIcons = {
    'online': Video,
    'offline': MapPin,
    'hybrid': Users,
  }

  const MeetingIcon = meetingTypeIcons[group.meetingType]

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-fuchsia-500/50 transition-all group">
      {/* 상단 배지 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-fuchsia-500/20 text-fuchsia-400 rounded-lg text-xs font-medium">
            {group.category}
          </span>
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${levelColors[group.level]}`}>
            {group.level}
          </span>
        </div>
        {group.isRecruiting ? (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium">
            모집중
          </span>
        ) : (
          <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded-lg text-xs font-medium">
            모집마감
          </span>
        )}
      </div>

      {/* 그룹 정보 */}
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-fuchsia-400 transition-colors">
        {group.name}
      </h3>

      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
        {group.description}
      </p>

      {/* 일정 및 장소 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Calendar className="w-4 h-4 text-fuchsia-400" />
          {group.schedule}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <MeetingIcon className="w-4 h-4 text-fuchsia-400" />
          {group.meetingType === 'online' ? '온라인' :
           group.meetingType === 'offline' ? group.location :
           `하이브리드 (${group.location})`}
        </div>
      </div>

      {/* 태그 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {group.tags.map(tag => (
          <span
            key={tag}
            className="px-2 py-1 bg-slate-800 text-slate-400 rounded-lg text-xs"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 하단 정보 */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
            {group.leader.name[0]}
          </div>
          <div>
            <div className="text-sm text-white">{group.leader.name}</div>
            <div className="text-xs text-slate-500">{group.leader.title}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-white">
            {group.members.length} / {group.maxMembers}명
          </div>
          <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full"
              style={{ width: `${(group.members.length / group.maxMembers) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 참여 버튼 */}
      {group.isRecruiting && (
        <button className="w-full mt-4 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all">
          스터디 참여하기
        </button>
      )}
    </div>
  )
}

// 멘토 카드 컴포넌트
function MentorCard({ mentor }: { mentor: Mentor }) {
  const availableSlots = mentor.availableSlots.filter(s => !s.isBooked).length

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-fuchsia-500/50 transition-all">
      {/* 프로필 */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
          {mentor.user.name[0]}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{mentor.user.name}</h3>
          <p className="text-sm text-slate-400">{mentor.position}</p>
          <p className="text-xs text-slate-500">{mentor.company}</p>
        </div>
      </div>

      {/* 평점 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-white font-medium">{mentor.rating}</span>
        </div>
        <span className="text-slate-500 text-sm">
          ({mentor.reviewCount}개 리뷰)
        </span>
        <span className="text-slate-600">·</span>
        <span className="text-slate-500 text-sm">
          멘티 {mentor.menteeCount}명
        </span>
      </div>

      {/* 전문 분야 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {mentor.specialty.map(spec => (
          <span
            key={spec}
            className="px-2 py-1 bg-fuchsia-500/20 text-fuchsia-400 rounded-lg text-xs font-medium"
          >
            {spec}
          </span>
        ))}
      </div>

      {/* 소개 */}
      <p className="text-slate-400 text-sm mb-4 line-clamp-3">
        {mentor.introduction}
      </p>

      {/* 가격 및 예약 */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div>
          <div className="text-lg font-bold text-white">
            {mentor.price === 0 ? (
              <span className="text-green-400">무료</span>
            ) : (
              <>{mentor.price.toLocaleString()}원<span className="text-sm text-slate-500 font-normal">/회</span></>
            )}
          </div>
          <div className="text-xs text-slate-500">
            {availableSlots > 0 ? `${availableSlots}개 슬롯 예약 가능` : '예약 마감'}
          </div>
        </div>
        <button
          disabled={availableSlots === 0}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            availableSlots > 0
              ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white hover:shadow-lg hover:shadow-fuchsia-500/25'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          멘토링 신청
        </button>
      </div>
    </div>
  )
}

// 새 질문 모달
function NewQuestionModal({ onClose, categories }: { onClose: () => void, categories: string[] }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [tags, setTags] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 실제로는 addQuestion 호출
    console.log({ title, content, category, tags: tags.split(',').map(t => t.trim()) })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">새 질문 작성</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-fuchsia-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="질문 제목을 입력하세요"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="질문 내용을 자세히 작성해주세요"
              rows={6}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">태그 (쉼표로 구분)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="예: CNC, 가공, 초보"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all"
            >
              질문 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 새 그룹 모달
function NewGroupModal({ onClose, categories }: { onClose: () => void, categories: string[] }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [level, setLevel] = useState<'입문' | '초급' | '중급' | '고급'>('입문')
  const [schedule, setSchedule] = useState('')
  const [maxMembers, setMaxMembers] = useState(8)
  const [meetingType, setMeetingType] = useState<'online' | 'offline' | 'hybrid'>('online')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 실제로는 createStudyGroup 호출
    console.log({ name, description, category, level, schedule, maxMembers, meetingType })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">새 스터디 그룹 만들기</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-fuchsia-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">난이도</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as '입문' | '초급' | '중급' | '고급')}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-fuchsia-500"
              >
                <option value="입문">입문</option>
                <option value="초급">초급</option>
                <option value="중급">중급</option>
                <option value="고급">고급</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">그룹명</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="스터디 그룹 이름"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="스터디 그룹 소개 및 학습 목표"
              rows={4}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">모임 일정</label>
              <input
                type="text"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="예: 매주 토요일 오전 10시"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">최대 인원</label>
              <input
                type="number"
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                min={2}
                max={20}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">모임 방식</label>
            <div className="flex gap-3">
              {[
                { value: 'online', label: '온라인' },
                { value: 'offline', label: '오프라인' },
                { value: 'hybrid', label: '하이브리드' },
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMeetingType(option.value as 'online' | 'offline' | 'hybrid')}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    meetingType === option.value
                      ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all"
            >
              그룹 만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
