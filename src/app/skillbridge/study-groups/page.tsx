'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users, Calendar, Clock, MapPin, Trophy, Flame, Target,
  MessageCircle, ChevronRight, Star, Plus, CheckCircle,
  TrendingUp, Award, Zap, Lock, UserPlus, Bell, Search,
  Filter, Crown, Medal
} from 'lucide-react'

// Types
interface StudyGroup {
  id: string
  name: string
  description: string
  category: string
  memberCount: number
  maxMembers: number
  leader: {
    name: string
    avatar: string
  }
  schedule: string
  location: string
  level: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  isJoined: boolean
  nextMeeting: string
  progress: number
  recentActivity: string
}

interface Challenge {
  id: string
  title: string
  description: string
  category: string
  type: 'daily' | 'weekly' | 'monthly' | 'event'
  startDate: string
  endDate: string
  participants: number
  xpReward: number
  badgeReward?: string
  progress: number
  target: number
  unit: string
  status: 'active' | 'upcoming' | 'completed'
  isJoined: boolean
  leaderboard: {
    rank: number
    name: string
    score: number
    isCurrentUser?: boolean
  }[]
}

interface LeaderboardEntry {
  rank: number
  name: string
  avatar: string
  xp: number
  level: number
  streak: number
  badges: number
}

// Mock data
const generateStudyGroups = (): StudyGroup[] => [
  {
    id: '1',
    name: '용접기능사 합격 스터디',
    description: '용접기능사 자격증 취득을 목표로 함께 공부하는 스터디입니다. 이론과 실기 모두 다룹니다.',
    category: '용접',
    memberCount: 8,
    maxMembers: 12,
    leader: { name: '김용접', avatar: '' },
    schedule: '매주 토요일 10:00',
    location: '온라인 (Zoom)',
    level: 'beginner',
    tags: ['자격증', '기능사', '초보환영'],
    isJoined: true,
    nextMeeting: '1월 20일 (토) 10:00',
    progress: 65,
    recentActivity: '어제 스터디 자료 업로드'
  },
  {
    id: '2',
    name: '산업안전기사 실기 대비반',
    description: '산업안전기사 실기 시험 대비 스터디입니다. 실전 문제 풀이 위주로 진행합니다.',
    category: '안전',
    memberCount: 15,
    maxMembers: 20,
    leader: { name: '이안전', avatar: '' },
    schedule: '매주 수, 토 19:00',
    location: '온라인 (Discord)',
    level: 'intermediate',
    tags: ['자격증', '실기', '문제풀이'],
    isJoined: false,
    nextMeeting: '1월 17일 (수) 19:00',
    progress: 45,
    recentActivity: '3시간 전 새 멤버 가입'
  },
  {
    id: '3',
    name: 'PLC 마스터 클래스',
    description: '미쯔비시, 지멘스 PLC 프로그래밍을 심도있게 학습하는 고급 스터디입니다.',
    category: '자동화',
    memberCount: 6,
    maxMembers: 8,
    leader: { name: '박자동', avatar: '' },
    schedule: '격주 일요일 14:00',
    location: '서울 마포구 스터디카페',
    level: 'advanced',
    tags: ['PLC', '미쯔비시', '지멘스'],
    isJoined: false,
    nextMeeting: '1월 21일 (일) 14:00',
    progress: 80,
    recentActivity: '2일 전 프로젝트 발표'
  },
  {
    id: '4',
    name: '품질관리 기초반',
    description: 'ISO 9001과 품질관리 기초를 함께 학습합니다. 실무 사례 중심으로 진행됩니다.',
    category: '품질',
    memberCount: 10,
    maxMembers: 15,
    leader: { name: '최품질', avatar: '' },
    schedule: '매주 화요일 20:00',
    location: '온라인 (Google Meet)',
    level: 'beginner',
    tags: ['ISO9001', '품질관리', '기초'],
    isJoined: false,
    nextMeeting: '1월 16일 (화) 20:00',
    progress: 30,
    recentActivity: '방금 스터디 공지 등록'
  }
]

const generateChallenges = (): Challenge[] => [
  {
    id: '1',
    title: '7일 연속 학습 챌린지',
    description: '7일 동안 매일 최소 30분 이상 학습하면 성공!',
    category: '습관',
    type: 'weekly',
    startDate: '2024-01-15',
    endDate: '2024-01-21',
    participants: 234,
    xpReward: 500,
    badgeReward: '불꽃 학습자',
    progress: 5,
    target: 7,
    unit: '일',
    status: 'active',
    isJoined: true,
    leaderboard: [
      { rank: 1, name: '학습왕A', score: 7 },
      { rank: 2, name: '열공B', score: 6 },
      { rank: 3, name: '나', score: 5, isCurrentUser: true },
      { rank: 4, name: '파이팅C', score: 5 },
      { rank: 5, name: '화이팅D', score: 4 }
    ]
  },
  {
    id: '2',
    title: '용접 마스터 챌린지',
    description: '용접 관련 과정 3개를 완료하고 마스터가 되자!',
    category: '용접',
    type: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    participants: 89,
    xpReward: 1000,
    badgeReward: '용접 마스터',
    progress: 2,
    target: 3,
    unit: '과정',
    status: 'active',
    isJoined: true,
    leaderboard: [
      { rank: 1, name: '용접장인', score: 3 },
      { rank: 2, name: '나', score: 2, isCurrentUser: true },
      { rank: 3, name: '불꽃손', score: 2 },
      { rank: 4, name: '용접러', score: 1 },
      { rank: 5, name: '초보용접', score: 1 }
    ]
  },
  {
    id: '3',
    title: '안전 퀴즈 마라톤',
    description: '안전 관련 퀴즈 100문제를 풀어보세요!',
    category: '안전',
    type: 'event',
    startDate: '2024-01-20',
    endDate: '2024-01-27',
    participants: 156,
    xpReward: 800,
    progress: 0,
    target: 100,
    unit: '문제',
    status: 'upcoming',
    isJoined: false,
    leaderboard: []
  },
  {
    id: '4',
    title: '설날 특별 학습 챌린지',
    description: '설 연휴 동안 총 10시간 학습 달성하기!',
    category: '이벤트',
    type: 'event',
    startDate: '2024-02-09',
    endDate: '2024-02-12',
    participants: 45,
    xpReward: 1500,
    badgeReward: '설날 학습왕',
    progress: 0,
    target: 10,
    unit: '시간',
    status: 'upcoming',
    isJoined: false,
    leaderboard: []
  }
]

const generateLeaderboard = (): LeaderboardEntry[] => [
  { rank: 1, name: '학습왕김철수', avatar: '', xp: 15420, level: 6, streak: 45, badges: 28 },
  { rank: 2, name: '열공이영희', avatar: '', xp: 14230, level: 6, streak: 38, badges: 25 },
  { rank: 3, name: '노력파박민수', avatar: '', xp: 12890, level: 5, streak: 30, badges: 22 },
  { rank: 4, name: '꾸준함정수연', avatar: '', xp: 11540, level: 5, streak: 28, badges: 20 },
  { rank: 5, name: '성실한최동훈', avatar: '', xp: 10280, level: 5, streak: 25, badges: 18 },
  { rank: 15, name: '나 (현재 순위)', avatar: '', xp: 4250, level: 4, streak: 7, badges: 8 }
]

const categoryColors: Record<string, string> = {
  '용접': 'bg-orange-100 text-orange-700 border-orange-200',
  '안전': 'bg-green-100 text-green-700 border-green-200',
  '품질': 'bg-blue-100 text-blue-700 border-blue-200',
  '자동화': 'bg-purple-100 text-purple-700 border-purple-200',
  '습관': 'bg-pink-100 text-pink-700 border-pink-200',
  '이벤트': 'bg-amber-100 text-amber-700 border-amber-200'
}

const levelColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700'
}

const levelLabels = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급'
}

const typeLabels = {
  daily: '일간',
  weekly: '주간',
  monthly: '월간',
  event: '이벤트'
}

// Study Group Card
function StudyGroupCard({ group, onJoin }: { group: StudyGroup; onJoin: () => void }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className={`h-2 ${
        group.category === '용접' ? 'bg-orange-500' :
        group.category === '안전' ? 'bg-green-500' :
        group.category === '자동화' ? 'bg-purple-500' :
        'bg-blue-500'
      }`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 text-xs rounded-full ${categoryColors[group.category]}`}>
                {group.category}
              </span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${levelColors[group.level]}`}>
                {levelLabels[group.level]}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">{group.name}</h3>
          </div>
          {group.isJoined && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              참여중
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{group.description}</p>

        {/* Progress */}
        {group.isJoined && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">스터디 진행률</span>
              <span className="font-medium">{group.progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${group.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Info */}
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span>{group.memberCount}/{group.maxMembers}명</span>
            <span className="text-gray-300">•</span>
            <span>리더: {group.leader.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{group.schedule}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{group.location}</span>
          </div>
        </div>

        {/* Next Meeting */}
        {group.isJoined && (
          <div className="p-3 bg-blue-50 rounded-lg mb-4">
            <p className="text-xs text-blue-600 mb-1">다음 모임</p>
            <p className="font-medium text-blue-900">{group.nextMeeting}</p>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {group.tags.map((tag) => (
            <span key={tag} className="text-xs text-gray-500">#{tag}</span>
          ))}
        </div>

        {/* Action */}
        {group.isJoined ? (
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
              스터디 입장
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Bell className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <button
            onClick={onJoin}
            disabled={group.memberCount >= group.maxMembers}
            className={`w-full py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 ${
              group.memberCount >= group.maxMembers
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            {group.memberCount >= group.maxMembers ? '정원 마감' : '참여하기'}
          </button>
        )}
      </div>
    </div>
  )
}

// Challenge Card
function ChallengeCard({ challenge, onJoin }: { challenge: Challenge; onJoin: () => void }) {
  const progressPercent = (challenge.progress / challenge.target) * 100

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
      challenge.status === 'upcoming' ? 'opacity-75' : ''
    }`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 text-xs rounded-full border ${categoryColors[challenge.category]}`}>
                {challenge.category}
              </span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                {typeLabels[challenge.type]}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
          </div>
          {challenge.status === 'upcoming' && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              예정
            </span>
          )}
          {challenge.isJoined && challenge.status === 'active' && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3" />
              참여중
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4">{challenge.description}</p>

        {/* Progress */}
        {challenge.isJoined && challenge.status === 'active' && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">진행률</span>
              <span className="font-medium">{challenge.progress}/{challenge.target} {challenge.unit}</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Rewards */}
        <div className="flex items-center gap-4 mb-4 p-3 bg-amber-50 rounded-lg">
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-700">+{challenge.xpReward} XP</span>
          </div>
          {challenge.badgeReward && (
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-700">{challenge.badgeReward}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {challenge.participants}명 참여
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {challenge.endDate} 마감
          </span>
        </div>

        {/* Mini Leaderboard */}
        {challenge.isJoined && challenge.leaderboard.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">리더보드</p>
            <div className="space-y-1">
              {challenge.leaderboard.slice(0, 3).map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between text-sm ${
                    entry.isCurrentUser ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {entry.rank === 1 && <Crown className="w-4 h-4 text-amber-500" />}
                    {entry.rank === 2 && <Medal className="w-4 h-4 text-gray-400" />}
                    {entry.rank === 3 && <Medal className="w-4 h-4 text-amber-700" />}
                    {entry.rank > 3 && <span className="w-4 text-center">{entry.rank}</span>}
                    <span>{entry.name}</span>
                  </span>
                  <span>{entry.score} {challenge.unit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        {challenge.status === 'active' && !challenge.isJoined ? (
          <button
            onClick={onJoin}
            className="w-full py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4" />
            챌린지 참여하기
          </button>
        ) : challenge.status === 'upcoming' ? (
          <button
            onClick={onJoin}
            className="w-full py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4" />
            알림 신청
          </button>
        ) : (
          <button className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            챌린지 현황 보기
          </button>
        )}
      </div>
    </div>
  )
}

export default function StudyGroupsPage() {
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [activeTab, setActiveTab] = useState<'groups' | 'challenges' | 'leaderboard'>('groups')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    setStudyGroups(generateStudyGroups())
    setChallenges(generateChallenges())
    setLeaderboard(generateLeaderboard())
  }, [])

  const categories = ['용접', '안전', '품질', '자동화']

  const filteredGroups = studyGroups.filter((g) => {
    const matchesSearch = g.name.includes(searchQuery) || g.description.includes(searchQuery)
    const matchesCategory = !selectedCategory || g.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const myGroups = studyGroups.filter(g => g.isJoined)
  const myChallenges = challenges.filter(c => c.isJoined)

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
              <h1 className="text-xl font-bold text-gray-900">소셜 학습</h1>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              스터디 만들기
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Stats */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">함께 배우면 더 즐거워요!</h2>
              <p className="text-purple-100">스터디 그룹과 챌린지로 학습 동기를 높이세요</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{myGroups.length}</p>
              <p className="text-purple-200 text-sm">참여 스터디</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{myChallenges.length}</p>
              <p className="text-purple-200 text-sm">진행 챌린지</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">15위</p>
              <p className="text-purple-200 text-sm">전체 순위</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">7일</p>
              <p className="text-purple-200 text-sm">연속 학습</p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === 'groups'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            스터디 그룹
            {activeTab === 'groups' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === 'challenges'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            챌린지
            {activeTab === 'challenges' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === 'leaderboard'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            리더보드
            {activeTab === 'leaderboard' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>

        {/* Study Groups Tab */}
        {activeTab === 'groups' && (
          <>
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="스터디 검색"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  전체
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
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

            {/* My Groups */}
            {myGroups.length > 0 && (
              <section className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  내 스터디
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myGroups.map((group) => (
                    <StudyGroupCard
                      key={group.id}
                      group={group}
                      onJoin={() => {}}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* All Groups */}
            <section>
              <h3 className="font-semibold text-gray-900 mb-4">전체 스터디</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.filter(g => !g.isJoined).map((group) => (
                  <StudyGroupCard
                    key={group.id}
                    group={group}
                    onJoin={() => {
                      setStudyGroups(prev =>
                        prev.map(g =>
                          g.id === group.id ? { ...g, isJoined: true, memberCount: g.memberCount + 1 } : g
                        )
                      )
                    }}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <>
            {/* Active Challenges */}
            <section className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                진행 중인 챌린지
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.filter(c => c.status === 'active').map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={() => {
                      setChallenges(prev =>
                        prev.map(c =>
                          c.id === challenge.id ? { ...c, isJoined: true, participants: c.participants + 1 } : c
                        )
                      )
                    }}
                  />
                ))}
              </div>
            </section>

            {/* Upcoming Challenges */}
            <section>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                예정된 챌린지
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.filter(c => c.status === 'upcoming').map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={() => {}}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Leaderboard */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-5 border-b bg-gradient-to-r from-amber-50 to-orange-50">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    전체 리더보드
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">이번 달 누적 XP 기준</p>
                </div>

                <div className="divide-y">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.rank}
                      className={`p-4 flex items-center gap-4 ${
                        entry.name.includes('나') ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1 ? 'bg-amber-100 text-amber-600' :
                        entry.rank === 2 ? 'bg-gray-100 text-gray-600' :
                        entry.rank === 3 ? 'bg-amber-50 text-amber-700' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {entry.rank === 1 && <Crown className="w-5 h-5" />}
                        {entry.rank === 2 && <Medal className="w-5 h-5" />}
                        {entry.rank === 3 && <Medal className="w-5 h-5" />}
                        {entry.rank > 3 && entry.rank}
                      </div>

                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                        {entry.name.charAt(0)}
                      </div>

                      <div className="flex-1">
                        <p className={`font-medium ${entry.name.includes('나') ? 'text-blue-600' : 'text-gray-900'}`}>
                          {entry.name}
                        </p>
                        <p className="text-sm text-gray-500">Lv.{entry.level}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-900">{entry.xp.toLocaleString()} XP</p>
                        <div className="flex items-center justify-end gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-500" />
                            {entry.streak}일
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="w-3 h-3 text-amber-500" />
                            {entry.badges}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              {/* My Rank */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                <h4 className="font-medium text-blue-100 mb-4">내 순위</h4>
                <div className="text-center">
                  <p className="text-5xl font-bold mb-2">15위</p>
                  <p className="text-blue-200">상위 12%</p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-200">다음 순위까지</span>
                    <span className="font-medium">230 XP</span>
                  </div>
                </div>
              </div>

              {/* Weekly Stats */}
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <h4 className="font-semibold text-gray-900 mb-4">이번 주 통계</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      획득 XP
                    </span>
                    <span className="font-bold text-green-600">+580 XP</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      연속 학습
                    </span>
                    <span className="font-bold">7일</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      완료 챌린지
                    </span>
                    <span className="font-bold">2개</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      획득 배지
                    </span>
                    <span className="font-bold">1개</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
                <h4 className="font-semibold text-amber-900 mb-3">💡 순위 올리기 팁</h4>
                <ul className="space-y-2 text-sm text-amber-800">
                  <li>• 매일 30분 이상 학습하기</li>
                  <li>• 챌린지에 적극 참여하기</li>
                  <li>• 스터디 활동에 기여하기</li>
                  <li>• 퀴즈와 과제 완료하기</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
