'use client'

import { useState, useEffect } from 'react'

// 타입 정의
export interface User {
  id: string
  name: string
  avatar?: string
  level: number
  title: string
  skills: string[]
  completedCourses: number
  joinedAt: Date
}

export interface Question {
  id: string
  title: string
  content: string
  author: User
  category: string
  tags: string[]
  views: number
  likes: number
  answers: Answer[]
  createdAt: Date
  updatedAt: Date
  isResolved: boolean
}

export interface Answer {
  id: string
  content: string
  author: User
  likes: number
  isAccepted: boolean
  createdAt: Date
}

export interface StudyGroup {
  id: string
  name: string
  description: string
  category: string
  leader: User
  members: User[]
  maxMembers: number
  schedule: string
  level: '입문' | '초급' | '중급' | '고급'
  tags: string[]
  isRecruiting: boolean
  createdAt: Date
  meetingType: 'online' | 'offline' | 'hybrid'
  location?: string
}

export interface Mentor {
  id: string
  user: User
  specialty: string[]
  introduction: string
  experience: string
  company?: string
  position?: string
  rating: number
  reviewCount: number
  menteeCount: number
  availableSlots: MentorSlot[]
  price: number // 무료면 0
  isAvailable: boolean
}

export interface MentorSlot {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isBooked: boolean
}

export interface MentorSession {
  id: string
  mentor: Mentor
  mentee: User
  slot: MentorSlot
  date: Date
  status: 'scheduled' | 'completed' | 'cancelled'
  topic: string
  notes?: string
}

// 샘플 데이터
const sampleUsers: User[] = [
  {
    id: 'user1',
    name: '김철수',
    level: 5,
    title: '숙련자',
    skills: ['CNC 가공', '품질관리', 'AutoCAD'],
    completedCourses: 12,
    joinedAt: new Date('2024-01-15'),
  },
  {
    id: 'user2',
    name: '이영희',
    level: 7,
    title: '전문가',
    skills: ['스마트팩토리', 'PLC 프로그래밍', '로봇공학'],
    completedCourses: 25,
    joinedAt: new Date('2023-08-20'),
  },
  {
    id: 'user3',
    name: '박민수',
    level: 3,
    title: '중급자',
    skills: ['용접', '안전관리'],
    completedCourses: 6,
    joinedAt: new Date('2024-06-01'),
  },
  {
    id: 'user4',
    name: '정수진',
    level: 6,
    title: '숙련자',
    skills: ['품질관리', 'ISO 인증', '6시그마'],
    completedCourses: 18,
    joinedAt: new Date('2023-11-10'),
  },
  {
    id: 'user5',
    name: '최동훈',
    level: 8,
    title: '마스터',
    skills: ['스마트팩토리', 'AI/ML', '데이터분석'],
    completedCourses: 35,
    joinedAt: new Date('2023-03-05'),
  },
]

const sampleQuestions: Question[] = [
  {
    id: 'q1',
    title: 'CNC 밀링 가공 시 표면 거칠기 개선 방법',
    content: '스테인레스 가공 시 표면 거칠기가 예상보다 높게 나옵니다. 절삭 속도와 이송률을 조절해봤는데 크게 개선되지 않네요. 어떤 방법이 있을까요?',
    author: sampleUsers[2],
    category: 'CNC 가공',
    tags: ['CNC', '밀링', '표면처리', '스테인레스'],
    views: 156,
    likes: 12,
    answers: [
      {
        id: 'a1',
        content: '공구 마모 상태를 먼저 확인해보세요. 또한 절삭유 공급이 충분한지, 칩 배출이 원활한지도 중요합니다. 스테인레스의 경우 코팅 인서트 사용을 권장드립니다.',
        author: sampleUsers[0],
        likes: 8,
        isAccepted: true,
        createdAt: new Date('2024-12-02'),
      },
    ],
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-02'),
    isResolved: true,
  },
  {
    id: 'q2',
    title: 'PLC 래더 로직에서 타이머 사용법',
    content: '미쓰비시 PLC를 처음 배우고 있는데, 온딜레이 타이머와 오프딜레이 타이머의 차이점과 실제 적용 사례를 알고 싶습니다.',
    author: sampleUsers[3],
    category: 'PLC/자동화',
    tags: ['PLC', '미쓰비시', '타이머', '래더로직'],
    views: 89,
    likes: 5,
    answers: [],
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
    isResolved: false,
  },
  {
    id: 'q3',
    title: '스마트팩토리 MES 도입 시 고려사항',
    content: '중소기업에서 MES 시스템 도입을 검토 중입니다. 기존 설비와의 연동, 비용, 도입 기간 등 실제 경험을 공유해주실 분 계신가요?',
    author: sampleUsers[0],
    category: '스마트팩토리',
    tags: ['MES', '스마트팩토리', '중소기업', '디지털전환'],
    views: 234,
    likes: 28,
    answers: [
      {
        id: 'a2',
        content: '작년에 도입 완료했습니다. 기존 설비가 RS-232/485 통신만 지원해서 IoT 게이트웨이를 추가 설치했어요. 초기 비용보다 데이터 표준화 작업이 더 힘들었습니다.',
        author: sampleUsers[4],
        likes: 15,
        isAccepted: false,
        createdAt: new Date('2024-12-06'),
      },
      {
        id: 'a3',
        content: '정부 지원사업(스마트공장 보급확산사업)을 활용하시면 비용 부담을 줄일 수 있습니다. 단계별로 기초 → 고도화로 진행하시는 것을 추천드려요.',
        author: sampleUsers[1],
        likes: 22,
        isAccepted: true,
        createdAt: new Date('2024-12-07'),
      },
    ],
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-07'),
    isResolved: true,
  },
  {
    id: 'q4',
    title: '품질관리에서 SPC 차트 해석 방법',
    content: 'X-bar R 차트를 작성했는데, 관리한계선 내에 있지만 연속 7점이 중심선 위에 있습니다. 이런 경우 어떻게 해석해야 하나요?',
    author: sampleUsers[2],
    category: '품질관리',
    tags: ['SPC', '품질관리', '관리도', '통계'],
    views: 67,
    likes: 9,
    answers: [],
    createdAt: new Date('2024-12-12'),
    updatedAt: new Date('2024-12-12'),
    isResolved: false,
  },
]

const sampleStudyGroups: StudyGroup[] = [
  {
    id: 'sg1',
    name: 'CNC 마스터 스터디',
    description: 'CNC 프로그래밍 및 가공 기술을 함께 공부하는 모임입니다. 실습 위주로 진행하며, 매주 과제를 수행합니다.',
    category: 'CNC 가공',
    leader: sampleUsers[0],
    members: [sampleUsers[0], sampleUsers[2]],
    maxMembers: 8,
    schedule: '매주 토요일 오전 10시',
    level: '중급',
    tags: ['CNC', 'G코드', '실습'],
    isRecruiting: true,
    createdAt: new Date('2024-10-01'),
    meetingType: 'hybrid',
    location: '서울 금천구 가산디지털단지',
  },
  {
    id: 'sg2',
    name: '스마트팩토리 입문반',
    description: '스마트팩토리의 기초 개념부터 MES, ERP 연동까지 단계별로 학습합니다.',
    category: '스마트팩토리',
    leader: sampleUsers[4],
    members: [sampleUsers[4], sampleUsers[1], sampleUsers[3]],
    maxMembers: 12,
    schedule: '격주 수요일 저녁 7시',
    level: '입문',
    tags: ['스마트팩토리', 'MES', 'IoT'],
    isRecruiting: true,
    createdAt: new Date('2024-11-15'),
    meetingType: 'online',
  },
  {
    id: 'sg3',
    name: 'PLC 프로그래밍 마스터',
    description: '미쓰비시, 지멘스 PLC를 활용한 자동화 프로그래밍을 심화 학습합니다.',
    category: 'PLC/자동화',
    leader: sampleUsers[1],
    members: [sampleUsers[1], sampleUsers[0], sampleUsers[3], sampleUsers[4]],
    maxMembers: 6,
    schedule: '매주 월요일 저녁 8시',
    level: '고급',
    tags: ['PLC', '미쓰비시', '지멘스', '자동화'],
    isRecruiting: false,
    createdAt: new Date('2024-09-01'),
    meetingType: 'online',
  },
  {
    id: 'sg4',
    name: '품질관리사 자격증 스터디',
    description: '품질관리사 자격증 취득을 목표로 함께 공부합니다. 기출문제 풀이 및 이론 정리.',
    category: '품질관리',
    leader: sampleUsers[3],
    members: [sampleUsers[3], sampleUsers[2]],
    maxMembers: 10,
    schedule: '매주 화, 목 저녁 9시',
    level: '초급',
    tags: ['품질관리사', '자격증', '기출문제'],
    isRecruiting: true,
    createdAt: new Date('2024-12-01'),
    meetingType: 'online',
  },
]

const sampleMentors: Mentor[] = [
  {
    id: 'm1',
    user: sampleUsers[4],
    specialty: ['스마트팩토리', 'AI/ML', '데이터분석'],
    introduction: '대기업 스마트팩토리 구축 10년 경력입니다. 중소기업 디지털 전환 컨설팅 경험 다수 보유.',
    experience: '삼성전자 스마트팩토리팀 10년, 현재 제조 AI 스타트업 CTO',
    company: '스마트팩토리솔루션즈',
    position: 'CTO',
    rating: 4.9,
    reviewCount: 47,
    menteeCount: 23,
    availableSlots: [
      { id: 'slot1', dayOfWeek: 1, startTime: '19:00', endTime: '20:00', isBooked: false },
      { id: 'slot2', dayOfWeek: 3, startTime: '19:00', endTime: '20:00', isBooked: true },
      { id: 'slot3', dayOfWeek: 5, startTime: '20:00', endTime: '21:00', isBooked: false },
    ],
    price: 50000,
    isAvailable: true,
  },
  {
    id: 'm2',
    user: sampleUsers[1],
    specialty: ['PLC 프로그래밍', '로봇공학', '자동화설비'],
    introduction: '자동차 부품 제조 현장에서 15년간 자동화 설비를 담당했습니다. 실무 노하우를 전수해드립니다.',
    experience: '현대모비스 자동화설비팀 15년',
    company: '현대모비스',
    position: '수석엔지니어',
    rating: 4.8,
    reviewCount: 32,
    menteeCount: 18,
    availableSlots: [
      { id: 'slot4', dayOfWeek: 2, startTime: '20:00', endTime: '21:00', isBooked: false },
      { id: 'slot5', dayOfWeek: 4, startTime: '20:00', endTime: '21:00', isBooked: false },
    ],
    price: 30000,
    isAvailable: true,
  },
  {
    id: 'm3',
    user: sampleUsers[0],
    specialty: ['CNC 가공', '품질관리', 'AutoCAD'],
    introduction: 'CNC 가공 전문가입니다. 초보자도 이해하기 쉽게 설명해드립니다.',
    experience: '정밀가공 전문업체 8년',
    company: '대한정밀',
    position: '공장장',
    rating: 4.7,
    reviewCount: 21,
    menteeCount: 12,
    availableSlots: [
      { id: 'slot6', dayOfWeek: 6, startTime: '10:00', endTime: '11:00', isBooked: false },
      { id: 'slot7', dayOfWeek: 6, startTime: '14:00', endTime: '15:00', isBooked: false },
    ],
    price: 0, // 무료 멘토링
    isAvailable: true,
  },
]

// 커뮤니티 훅
export function useCommunity() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([])
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = () => {
      // localStorage에서 데이터 로드 또는 샘플 데이터 사용
      const savedQuestions = localStorage.getItem('skillbridge_questions')
      const savedGroups = localStorage.getItem('skillbridge_studygroups')
      const savedMentors = localStorage.getItem('skillbridge_mentors')

      setQuestions(savedQuestions ? JSON.parse(savedQuestions) : sampleQuestions)
      setStudyGroups(savedGroups ? JSON.parse(savedGroups) : sampleStudyGroups)
      setMentors(savedMentors ? JSON.parse(savedMentors) : sampleMentors)
      setLoading(false)
    }

    loadData()
  }, [])

  // 질문 관련 함수
  const addQuestion = (question: Omit<Question, 'id' | 'views' | 'likes' | 'answers' | 'createdAt' | 'updatedAt' | 'isResolved'>) => {
    const newQuestion: Question = {
      ...question,
      id: `q${Date.now()}`,
      views: 0,
      likes: 0,
      answers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isResolved: false,
    }
    const updated = [newQuestion, ...questions]
    setQuestions(updated)
    localStorage.setItem('skillbridge_questions', JSON.stringify(updated))
    return newQuestion
  }

  const addAnswer = (questionId: string, answer: Omit<Answer, 'id' | 'likes' | 'isAccepted' | 'createdAt'>) => {
    const newAnswer: Answer = {
      ...answer,
      id: `a${Date.now()}`,
      likes: 0,
      isAccepted: false,
      createdAt: new Date(),
    }
    const updated = questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: [...q.answers, newAnswer],
          updatedAt: new Date(),
        }
      }
      return q
    })
    setQuestions(updated)
    localStorage.setItem('skillbridge_questions', JSON.stringify(updated))
    return newAnswer
  }

  const acceptAnswer = (questionId: string, answerId: string) => {
    const updated = questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          isResolved: true,
          answers: q.answers.map(a => ({
            ...a,
            isAccepted: a.id === answerId,
          })),
        }
      }
      return q
    })
    setQuestions(updated)
    localStorage.setItem('skillbridge_questions', JSON.stringify(updated))
  }

  const likeQuestion = (questionId: string) => {
    const updated = questions.map(q => {
      if (q.id === questionId) {
        return { ...q, likes: q.likes + 1 }
      }
      return q
    })
    setQuestions(updated)
    localStorage.setItem('skillbridge_questions', JSON.stringify(updated))
  }

  // 스터디 그룹 관련 함수
  const createStudyGroup = (group: Omit<StudyGroup, 'id' | 'members' | 'createdAt'>) => {
    const newGroup: StudyGroup = {
      ...group,
      id: `sg${Date.now()}`,
      members: [group.leader],
      createdAt: new Date(),
    }
    const updated = [newGroup, ...studyGroups]
    setStudyGroups(updated)
    localStorage.setItem('skillbridge_studygroups', JSON.stringify(updated))
    return newGroup
  }

  const joinStudyGroup = (groupId: string, user: User) => {
    const updated = studyGroups.map(g => {
      if (g.id === groupId && g.members.length < g.maxMembers) {
        return {
          ...g,
          members: [...g.members, user],
          isRecruiting: g.members.length + 1 < g.maxMembers,
        }
      }
      return g
    })
    setStudyGroups(updated)
    localStorage.setItem('skillbridge_studygroups', JSON.stringify(updated))
  }

  const leaveStudyGroup = (groupId: string, userId: string) => {
    const updated = studyGroups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.filter(m => m.id !== userId),
          isRecruiting: true,
        }
      }
      return g
    })
    setStudyGroups(updated)
    localStorage.setItem('skillbridge_studygroups', JSON.stringify(updated))
  }

  // 멘토 관련 함수
  const bookMentorSession = (mentorId: string, slotId: string, mentee: User, topic: string): MentorSession | null => {
    const mentor = mentors.find(m => m.id === mentorId)
    if (!mentor) return null

    const slot = mentor.availableSlots.find(s => s.id === slotId && !s.isBooked)
    if (!slot) return null

    // 슬롯 예약 처리
    const updatedMentors = mentors.map(m => {
      if (m.id === mentorId) {
        return {
          ...m,
          menteeCount: m.menteeCount + 1,
          availableSlots: m.availableSlots.map(s =>
            s.id === slotId ? { ...s, isBooked: true } : s
          ),
        }
      }
      return m
    })
    setMentors(updatedMentors)
    localStorage.setItem('skillbridge_mentors', JSON.stringify(updatedMentors))

    // 세션 생성
    const session: MentorSession = {
      id: `ms${Date.now()}`,
      mentor,
      mentee,
      slot,
      date: new Date(), // 실제로는 다음 해당 요일 날짜 계산 필요
      status: 'scheduled',
      topic,
    }

    // 세션 저장
    const sessions = JSON.parse(localStorage.getItem('skillbridge_mentor_sessions') || '[]')
    localStorage.setItem('skillbridge_mentor_sessions', JSON.stringify([...sessions, session]))

    return session
  }

  const getMySessions = (userId: string): MentorSession[] => {
    const sessions = JSON.parse(localStorage.getItem('skillbridge_mentor_sessions') || '[]')
    return sessions.filter((s: MentorSession) => s.mentee.id === userId || s.mentor.user.id === userId)
  }

  // 검색 및 필터링
  const searchQuestions = (query: string, category?: string) => {
    return questions.filter(q => {
      const matchesQuery = query === '' ||
        q.title.toLowerCase().includes(query.toLowerCase()) ||
        q.content.toLowerCase().includes(query.toLowerCase()) ||
        q.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      const matchesCategory = !category || category === 'all' || q.category === category
      return matchesQuery && matchesCategory
    })
  }

  const searchStudyGroups = (query: string, category?: string, level?: string) => {
    return studyGroups.filter(g => {
      const matchesQuery = query === '' ||
        g.name.toLowerCase().includes(query.toLowerCase()) ||
        g.description.toLowerCase().includes(query.toLowerCase()) ||
        g.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      const matchesCategory = !category || category === 'all' || g.category === category
      const matchesLevel = !level || level === 'all' || g.level === level
      return matchesQuery && matchesCategory && matchesLevel
    })
  }

  const searchMentors = (query: string, specialty?: string) => {
    return mentors.filter(m => {
      const matchesQuery = query === '' ||
        m.user.name.toLowerCase().includes(query.toLowerCase()) ||
        m.specialty.some(s => s.toLowerCase().includes(query.toLowerCase())) ||
        m.introduction.toLowerCase().includes(query.toLowerCase())
      const matchesSpecialty = !specialty || specialty === 'all' ||
        m.specialty.includes(specialty)
      return matchesQuery && matchesSpecialty && m.isAvailable
    })
  }

  // 카테고리 목록
  const categories = [
    'CNC 가공',
    'PLC/자동화',
    '스마트팩토리',
    '품질관리',
    '용접/금속가공',
    '안전관리',
    '기타',
  ]

  return {
    questions,
    studyGroups,
    mentors,
    loading,
    categories,
    // 질문
    addQuestion,
    addAnswer,
    acceptAnswer,
    likeQuestion,
    searchQuestions,
    // 스터디
    createStudyGroup,
    joinStudyGroup,
    leaveStudyGroup,
    searchStudyGroups,
    // 멘토링
    bookMentorSession,
    getMySessions,
    searchMentors,
  }
}
