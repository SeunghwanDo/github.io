'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users, Star, MessageCircle, Clock, Award, CheckCircle,
  Search, Filter, ChevronRight, Calendar, Video, Phone,
  Mail, MapPin, Briefcase, GraduationCap, Heart, Send,
  ThumbsUp, MoreHorizontal, X
} from 'lucide-react'

// Types
interface Mentor {
  id: string
  name: string
  title: string
  company: string
  avatar: string
  expertise: string[]
  experience: number
  rating: number
  reviewCount: number
  menteeCount: number
  bio: string
  location: string
  availability: string
  responseTime: string
  price: string
  badges: string[]
  isVerified: boolean
  isFeatured: boolean
}

interface Question {
  id: string
  author: string
  authorAvatar: string
  title: string
  content: string
  category: string
  createdAt: string
  answers: number
  views: number
  likes: number
  isAnswered: boolean
  tags: string[]
}

interface MentorSession {
  id: string
  mentorName: string
  mentorAvatar: string
  date: string
  time: string
  type: 'video' | 'phone' | 'chat'
  status: 'upcoming' | 'completed' | 'cancelled'
  topic: string
}

// Mock data
const generateMentors = (): Mentor[] => [
  {
    id: '1',
    name: '김철수',
    title: '수석 용접기술사',
    company: '현대중공업',
    avatar: '/avatars/mentor1.jpg',
    expertise: ['TIG 용접', 'MIG 용접', '특수소재 용접', '용접 검사'],
    experience: 25,
    rating: 4.9,
    reviewCount: 128,
    menteeCount: 45,
    bio: '25년간 조선업계에서 용접 전문가로 활동해왔습니다. 기능올림픽 금메달리스트이며, 현재 후배 양성에 힘쓰고 있습니다.',
    location: '울산',
    availability: '주중 저녁, 주말',
    responseTime: '24시간 이내',
    price: '무료',
    badges: ['기술사', '기능올림픽', '인증멘토'],
    isVerified: true,
    isFeatured: true
  },
  {
    id: '2',
    name: '이영희',
    title: '안전관리 팀장',
    company: '삼성엔지니어링',
    avatar: '/avatars/mentor2.jpg',
    expertise: ['산업안전', '위험성평가', 'PSM', 'ISO 45001'],
    experience: 18,
    rating: 4.8,
    reviewCount: 89,
    menteeCount: 32,
    bio: '대기업 안전관리 경력 18년. 산업안전기사, 위험물산업기사 보유. 안전분야 취업 및 자격증 취득을 도와드립니다.',
    location: '서울',
    availability: '평일 점심, 주말 오전',
    responseTime: '12시간 이내',
    price: '무료',
    badges: ['산업안전기사', '인증멘토'],
    isVerified: true,
    isFeatured: true
  },
  {
    id: '3',
    name: '박민수',
    title: '스마트팩토리 PM',
    company: '포스코ICT',
    avatar: '/avatars/mentor3.jpg',
    expertise: ['PLC', 'HMI', 'MES', '로봇'],
    experience: 12,
    rating: 4.7,
    reviewCount: 56,
    menteeCount: 28,
    bio: '제조업 DX 전문가입니다. PLC 프로그래밍부터 MES 구축까지 스마트팩토리 전반에 대해 멘토링합니다.',
    location: '포항',
    availability: '주중 저녁',
    responseTime: '48시간 이내',
    price: '무료',
    badges: ['PLC전문가', 'MES전문가'],
    isVerified: true,
    isFeatured: false
  },
  {
    id: '4',
    name: '정수연',
    title: '품질관리 수석',
    company: 'LG화학',
    avatar: '/avatars/mentor4.jpg',
    expertise: ['ISO 9001', 'SPC', '6시그마', '품질검사'],
    experience: 15,
    rating: 4.9,
    reviewCount: 72,
    menteeCount: 25,
    bio: '품질경영기사, 6시그마 MBB 보유. 품질관리 전문가로 성장하고 싶은 분들을 위한 멘토링을 제공합니다.',
    location: '대전',
    availability: '주말 오전',
    responseTime: '24시간 이내',
    price: '무료',
    badges: ['품질경영기사', '6시그마MBB', '인증멘토'],
    isVerified: true,
    isFeatured: false
  }
]

const generateQuestions = (): Question[] => [
  {
    id: '1',
    author: '학습자A',
    authorAvatar: '/avatars/user1.jpg',
    title: 'TIG 용접 시 텅스텐 끝이 자꾸 오염되는데 어떻게 해야 할까요?',
    content: '연습 중인데 아르곤 가스도 충분히 나오고 있는 것 같은데 텅스텐 끝이 자꾸 까맣게 변합니다...',
    category: '용접',
    createdAt: '2시간 전',
    answers: 3,
    views: 45,
    likes: 8,
    isAnswered: true,
    tags: ['TIG용접', '텅스텐', '초보자']
  },
  {
    id: '2',
    author: '취준생B',
    authorAvatar: '/avatars/user2.jpg',
    title: '산업안전기사 실기 준비 어떻게 하셨나요?',
    content: '필기는 합격했는데 실기가 너무 막막합니다. 실제 현장 경험이 없어서 더 어렵네요...',
    category: '안전',
    createdAt: '5시간 전',
    answers: 7,
    views: 128,
    likes: 23,
    isAnswered: true,
    tags: ['산업안전기사', '실기', '자격증']
  },
  {
    id: '3',
    author: '현직자C',
    authorAvatar: '/avatars/user3.jpg',
    title: 'PLC 래더 다이어그램에서 타이머 사용법 질문드립니다',
    content: 'TON과 TOF 타이머의 차이점이 헷갈립니다. 실제로 어떤 상황에서 각각 사용하나요?',
    category: '자동화',
    createdAt: '1일 전',
    answers: 5,
    views: 89,
    likes: 15,
    isAnswered: true,
    tags: ['PLC', '타이머', '래더']
  },
  {
    id: '4',
    author: '이직준비D',
    authorAvatar: '/avatars/user4.jpg',
    title: '품질관리 쪽으로 이직하려는데 어떤 자격증이 유리할까요?',
    content: '현재 생산직 5년차입니다. 품질관리로 직무 전환하고 싶은데 어떤 자격증부터 따야 할지...',
    category: '품질',
    createdAt: '1일 전',
    answers: 4,
    views: 156,
    likes: 31,
    isAnswered: false,
    tags: ['이직', '품질관리', '자격증추천']
  }
]

const generateSessions = (): MentorSession[] => [
  {
    id: '1',
    mentorName: '김철수 멘토',
    mentorAvatar: '/avatars/mentor1.jpg',
    date: '2024-01-20',
    time: '19:00',
    type: 'video',
    status: 'upcoming',
    topic: 'TIG 용접 실기 피드백'
  },
  {
    id: '2',
    mentorName: '이영희 멘토',
    mentorAvatar: '/avatars/mentor2.jpg',
    date: '2024-01-15',
    time: '12:30',
    type: 'chat',
    status: 'completed',
    topic: '산업안전기사 학습 방향 상담'
  }
]

const categoryColors: Record<string, string> = {
  '용접': 'bg-orange-100 text-orange-700',
  '안전': 'bg-green-100 text-green-700',
  '품질': 'bg-blue-100 text-blue-700',
  '자동화': 'bg-purple-100 text-purple-700'
}

// Mentor Card Component
function MentorCard({ mentor, onSelect }: { mentor: Mentor; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
    >
      {mentor.isFeatured && (
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-medium text-center py-1">
          ⭐ 추천 멘토
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
              {mentor.name.charAt(0)}
            </div>
            {mentor.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
            <p className="text-sm text-gray-600">{mentor.title}</p>
            <p className="text-sm text-gray-500">{mentor.company}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-medium">{mentor.rating}</span>
            <span className="text-gray-400">({mentor.reviewCount})</span>
          </span>
          <span className="flex items-center gap-1 text-gray-500">
            <Users className="w-4 h-4" />
            멘티 {mentor.menteeCount}명
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {mentor.expertise.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
          {mentor.expertise.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-xs rounded-full">
              +{mentor.expertise.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t text-sm">
          <span className="flex items-center gap-1 text-gray-500">
            <MapPin className="w-4 h-4" />
            {mentor.location}
          </span>
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4" />
            {mentor.responseTime}
          </span>
        </div>

        <div className="flex gap-2 mt-4">
          <button className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            멘토링 신청
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Heart className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Question Card Component
function QuestionCard({ question }: { question: Question }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {question.author.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">{question.author}</span>
            <span className="text-xs text-gray-400">{question.createdAt}</span>
            {question.isAnswered && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                답변완료
              </span>
            )}
          </div>

          <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
            {question.title}
          </h4>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {question.content}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 py-0.5 text-xs rounded-full ${categoryColors[question.category] || 'bg-gray-100 text-gray-700'}`}>
              {question.category}
            </span>
            {question.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs text-gray-500">#{tag}</span>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              답변 {question.answers}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              {question.likes}
            </span>
            <span>조회 {question.views}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mentor Detail Modal
function MentorDetailModal({ mentor, onClose }: { mentor: Mentor; onClose: () => void }) {
  const [message, setMessage] = useState('')

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">멘토 프로필</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
                {mentor.name.charAt(0)}
              </div>
              {mentor.isVerified && (
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{mentor.name}</h3>
              <p className="text-gray-600">{mentor.title}</p>
              <p className="text-gray-500 flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {mentor.company} · 경력 {mentor.experience}년
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {mentor.badges.map((badge) => (
                  <span
                    key={badge}
                    className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full flex items-center gap-1"
                  >
                    <Award className="w-3 h-3" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{mentor.rating}</p>
              <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                평점
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{mentor.reviewCount}</p>
              <p className="text-sm text-gray-500">리뷰</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{mentor.menteeCount}</p>
              <p className="text-sm text-gray-500">멘티</p>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">소개</h4>
            <p className="text-gray-600">{mentor.bio}</p>
          </div>

          {/* Expertise */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">전문 분야</h4>
            <div className="flex flex-wrap gap-2">
              {mentor.expertise.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>{mentor.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5 text-gray-400" />
              <span>응답: {mentor.responseTime}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span>{mentor.availability}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Award className="w-5 h-5 text-gray-400" />
              <span>{mentor.price}</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-900 mb-4">멘토링 신청</h4>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="멘토에게 전하고 싶은 메시지를 작성해주세요. (예: 학습 목표, 궁금한 점 등)"
              className="w-full p-4 border rounded-lg resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-3 mt-4">
              <button className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                멘토링 신청하기
              </button>
              <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Video className="w-5 h-5" />
                화상 상담
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MentoringPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [sessions, setSessions] = useState<MentorSession[]>([])
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [activeTab, setActiveTab] = useState<'mentors' | 'qna' | 'my'>('mentors')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    setMentors(generateMentors())
    setQuestions(generateQuestions())
    setSessions(generateSessions())
  }, [])

  const filteredMentors = mentors.filter((m) => {
    const matchesSearch = m.name.includes(searchQuery) ||
      m.expertise.some(e => e.includes(searchQuery))
    const matchesCategory = !selectedCategory ||
      m.expertise.some(e => e.includes(selectedCategory))
    return matchesSearch && matchesCategory
  })

  const categories = ['용접', '안전', '품질', '자동화']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/skillbridge/my-learning" className="text-gray-500 hover:text-gray-700">
                ← 내 학습
              </Link>
              <h1 className="text-xl font-bold text-gray-900">멘토링</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">선배에게 배우는 진짜 노하우</h2>
              <p className="text-green-100">현장 경험이 풍부한 멘토와 1:1로 연결됩니다</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{mentors.length}</p>
              <p className="text-green-200 text-sm">등록 멘토</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{mentors.filter(m => m.isVerified).length}</p>
              <p className="text-green-200 text-sm">인증 멘토</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{questions.length}</p>
              <p className="text-green-200 text-sm">Q&A 게시글</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">무료</p>
              <p className="text-green-200 text-sm">멘토링 비용</p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('mentors')}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === 'mentors'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            멘토 찾기
            {activeTab === 'mentors' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('qna')}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === 'qna'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Q&A 게시판
            {activeTab === 'qna' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === 'my'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            내 멘토링
            {activeTab === 'my' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>

        {/* Mentors Tab */}
        {activeTab === 'mentors' && (
          <>
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="멘토 이름 또는 전문 분야로 검색"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Mentor Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  onSelect={() => setSelectedMentor(mentor)}
                />
              ))}
            </div>
          </>
        )}

        {/* Q&A Tab */}
        {activeTab === 'qna' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">총 {questions.length}개의 질문</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                질문하기
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          </>
        )}

        {/* My Mentoring Tab */}
        {activeTab === 'my' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upcoming Sessions */}
            <section className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                예정된 멘토링
              </h3>
              <div className="space-y-4">
                {sessions.filter(s => s.status === 'upcoming').map((session) => (
                  <div key={session.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                        {session.mentorName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{session.mentorName}</p>
                        <p className="text-sm text-gray-500">{session.topic}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {session.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {session.time}
                      </span>
                      <span className="flex items-center gap-1">
                        {session.type === 'video' && <Video className="w-4 h-4" />}
                        {session.type === 'phone' && <Phone className="w-4 h-4" />}
                        {session.type === 'chat' && <MessageCircle className="w-4 h-4" />}
                        {session.type === 'video' ? '화상' : session.type === 'phone' ? '전화' : '채팅'}
                      </span>
                    </div>
                    <button className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                      참여하기
                    </button>
                  </div>
                ))}
                {sessions.filter(s => s.status === 'upcoming').length === 0 && (
                  <p className="text-center text-gray-500 py-8">예정된 멘토링이 없습니다</p>
                )}
              </div>
            </section>

            {/* Past Sessions */}
            <section className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                완료된 멘토링
              </h3>
              <div className="space-y-4">
                {sessions.filter(s => s.status === 'completed').map((session) => (
                  <div key={session.id} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold">
                        {session.mentorName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{session.mentorName}</p>
                        <p className="text-sm text-gray-500">{session.topic}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{session.date}</span>
                      <button className="text-blue-600 hover:text-blue-700">
                        리뷰 작성
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Mentor Detail Modal */}
      {selectedMentor && (
        <MentorDetailModal
          mentor={selectedMentor}
          onClose={() => setSelectedMentor(null)}
        />
      )}
    </div>
  )
}
