'use client'

import { useState, useEffect, useCallback } from 'react'

// 인재 타입 정의
export interface Talent {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  title: string
  level: number
  experience: number // 년수
  skills: Skill[]
  certifications: Certification[]
  completedCourses: CompletedCourse[]
  introduction: string
  desiredPosition: string
  desiredSalary?: string
  location: string
  isAvailable: boolean
  availableFrom?: Date
  lastActive: Date
  viewCount: number
  savedCount: number
}

export interface Skill {
  name: string
  level: '입문' | '초급' | '중급' | '고급' | '전문가'
  yearsOfExperience: number
}

export interface Certification {
  name: string
  issuer: string
  issueDate: Date
  isVerified: boolean
}

export interface CompletedCourse {
  id: string
  name: string
  provider: string
  completedAt: Date
  score?: number
}

export interface SearchFilters {
  query: string
  skills: string[]
  minExperience: number
  maxExperience: number
  location: string
  skillLevel: string
  isAvailableOnly: boolean
  certifications: string[]
}

export interface SavedTalent {
  talentId: string
  savedAt: Date
  notes?: string
  status: 'saved' | 'contacted' | 'interviewing' | 'hired' | 'rejected'
}

// 샘플 인재 데이터
const sampleTalents: Talent[] = [
  {
    id: 't1',
    name: '김민준',
    email: 'minjun.kim@example.com',
    title: 'CNC 가공 기술자',
    level: 6,
    experience: 8,
    skills: [
      { name: 'CNC 밀링', level: '전문가', yearsOfExperience: 8 },
      { name: 'CNC 선반', level: '고급', yearsOfExperience: 6 },
      { name: 'CAM 프로그래밍', level: '고급', yearsOfExperience: 5 },
      { name: '품질검사', level: '중급', yearsOfExperience: 4 },
    ],
    certifications: [
      { name: '컴퓨터응용가공산업기사', issuer: '한국산업인력공단', issueDate: new Date('2020-06-15'), isVerified: true },
      { name: '품질경영기사', issuer: '한국산업인력공단', issueDate: new Date('2021-09-20'), isVerified: true },
    ],
    completedCourses: [
      { id: 'c1', name: 'CNC 밀링 마스터 과정', provider: '한국폴리텍대학', completedAt: new Date('2024-03-15'), score: 95 },
      { id: 'c2', name: '5축 가공 실무', provider: 'DMG MORI 아카데미', completedAt: new Date('2024-08-20'), score: 88 },
    ],
    introduction: '정밀 가공 분야에서 8년간 경력을 쌓아온 CNC 전문가입니다. 자동차 부품, 금형, 항공 부품 가공 경험이 풍부하며, 품질과 효율을 동시에 추구합니다.',
    desiredPosition: 'CNC 팀장 / 공정 관리자',
    desiredSalary: '5000만원 ~ 6000만원',
    location: '경기도 안산시',
    isAvailable: true,
    availableFrom: new Date('2025-02-01'),
    lastActive: new Date('2024-12-15'),
    viewCount: 234,
    savedCount: 18,
  },
  {
    id: 't2',
    name: '이서연',
    email: 'seoyeon.lee@example.com',
    title: '스마트팩토리 엔지니어',
    level: 7,
    experience: 6,
    skills: [
      { name: '스마트팩토리', level: '전문가', yearsOfExperience: 6 },
      { name: 'PLC 프로그래밍', level: '고급', yearsOfExperience: 5 },
      { name: 'MES 시스템', level: '고급', yearsOfExperience: 4 },
      { name: '데이터 분석', level: '중급', yearsOfExperience: 3 },
      { name: 'Python', level: '중급', yearsOfExperience: 2 },
    ],
    certifications: [
      { name: '생산자동화기능사', issuer: '한국산업인력공단', issueDate: new Date('2019-05-10'), isVerified: true },
      { name: '정보처리기사', issuer: '한국산업인력공단', issueDate: new Date('2020-11-25'), isVerified: true },
      { name: '스마트팩토리 전문가', issuer: '스마트제조혁신추진단', issueDate: new Date('2023-08-15'), isVerified: true },
    ],
    completedCourses: [
      { id: 'c3', name: '스마트팩토리 구축 실무', provider: 'KIAT', completedAt: new Date('2024-05-20'), score: 98 },
      { id: 'c4', name: '제조 데이터 분석 과정', provider: '포스코 아카데미', completedAt: new Date('2024-10-10'), score: 92 },
    ],
    introduction: '대기업 스마트팩토리 구축 프로젝트를 다수 수행한 경험이 있습니다. MES 도입부터 IoT 센서 연동, 데이터 분석까지 전 과정을 이끌 수 있습니다.',
    desiredPosition: '스마트팩토리 PM / 기술 컨설턴트',
    desiredSalary: '6000만원 ~ 7000만원',
    location: '서울시 강남구',
    isAvailable: true,
    lastActive: new Date('2024-12-18'),
    viewCount: 456,
    savedCount: 32,
  },
  {
    id: 't3',
    name: '박준혁',
    email: 'junhyuk.park@example.com',
    title: 'PLC/자동화 엔지니어',
    level: 5,
    experience: 5,
    skills: [
      { name: 'PLC 프로그래밍', level: '고급', yearsOfExperience: 5 },
      { name: '미쓰비시 PLC', level: '전문가', yearsOfExperience: 5 },
      { name: '지멘스 PLC', level: '중급', yearsOfExperience: 3 },
      { name: 'HMI 설계', level: '고급', yearsOfExperience: 4 },
      { name: '로봇 프로그래밍', level: '초급', yearsOfExperience: 1 },
    ],
    certifications: [
      { name: '전기기능사', issuer: '한국산업인력공단', issueDate: new Date('2018-08-20'), isVerified: true },
      { name: '생산자동화산업기사', issuer: '한국산업인력공단', issueDate: new Date('2021-06-10'), isVerified: true },
    ],
    completedCourses: [
      { id: 'c5', name: 'PLC 마스터 과정', provider: '미쓰비시전기', completedAt: new Date('2024-02-28'), score: 90 },
    ],
    introduction: '자동화 설비 설계 및 프로그래밍 전문가입니다. 식품, 반도체, 자동차 라인 자동화 경험이 있으며, 문제 해결 능력이 뛰어납니다.',
    desiredPosition: 'PLC 엔지니어 / 자동화 설계',
    desiredSalary: '4500만원 ~ 5500만원',
    location: '경기도 수원시',
    isAvailable: false,
    lastActive: new Date('2024-12-10'),
    viewCount: 189,
    savedCount: 12,
  },
  {
    id: 't4',
    name: '최예진',
    email: 'yejin.choi@example.com',
    title: '품질관리 전문가',
    level: 6,
    experience: 7,
    skills: [
      { name: '품질관리', level: '전문가', yearsOfExperience: 7 },
      { name: 'SPC', level: '전문가', yearsOfExperience: 6 },
      { name: '6시그마', level: '고급', yearsOfExperience: 5 },
      { name: 'ISO 9001', level: '고급', yearsOfExperience: 5 },
      { name: 'IATF 16949', level: '중급', yearsOfExperience: 3 },
    ],
    certifications: [
      { name: '품질경영기사', issuer: '한국산업인력공단', issueDate: new Date('2019-03-15'), isVerified: true },
      { name: '6시그마 블랙벨트', issuer: '한국표준협회', issueDate: new Date('2022-07-20'), isVerified: true },
      { name: 'ISO 9001 심사원', issuer: 'KAB', issueDate: new Date('2023-05-10'), isVerified: true },
    ],
    completedCourses: [
      { id: 'c6', name: '품질혁신 리더 과정', provider: '한국품질재단', completedAt: new Date('2024-04-15'), score: 96 },
      { id: 'c7', name: 'IATF 16949 실무', provider: '자동차산업협회', completedAt: new Date('2024-09-30'), score: 94 },
    ],
    introduction: '자동차 부품 제조사에서 품질관리 업무를 7년간 담당했습니다. 6시그마 프로젝트를 통해 연간 5억원 이상의 품질 비용 절감 성과를 달성했습니다.',
    desiredPosition: '품질관리 팀장 / QA 매니저',
    desiredSalary: '5500만원 ~ 6500만원',
    location: '경기도 화성시',
    isAvailable: true,
    availableFrom: new Date('2025-01-15'),
    lastActive: new Date('2024-12-17'),
    viewCount: 312,
    savedCount: 24,
  },
  {
    id: 't5',
    name: '정우성',
    email: 'wooseong.jung@example.com',
    title: '용접 기술자',
    level: 4,
    experience: 10,
    skills: [
      { name: 'TIG 용접', level: '전문가', yearsOfExperience: 10 },
      { name: 'MIG 용접', level: '전문가', yearsOfExperience: 10 },
      { name: '특수 용접', level: '고급', yearsOfExperience: 7 },
      { name: '용접 도면 해독', level: '고급', yearsOfExperience: 8 },
      { name: '용접 품질검사', level: '중급', yearsOfExperience: 5 },
    ],
    certifications: [
      { name: '용접기능사', issuer: '한국산업인력공단', issueDate: new Date('2014-09-10'), isVerified: true },
      { name: '특수용접기능사', issuer: '한국산업인력공단', issueDate: new Date('2017-05-20'), isVerified: true },
      { name: '용접산업기사', issuer: '한국산업인력공단', issueDate: new Date('2020-11-15'), isVerified: true },
    ],
    completedCourses: [
      { id: 'c8', name: '로봇 용접 프로그래밍', provider: '현대로보틱스', completedAt: new Date('2024-06-20'), score: 85 },
    ],
    introduction: '10년 경력의 용접 전문가입니다. 조선, 플랜트, 자동차 분야에서 다양한 경험을 쌓았으며, 후배 육성에도 관심이 많습니다.',
    desiredPosition: '용접 팀장 / 기술 강사',
    desiredSalary: '4500만원 ~ 5500만원',
    location: '울산시 남구',
    isAvailable: true,
    lastActive: new Date('2024-12-16'),
    viewCount: 156,
    savedCount: 8,
  },
  {
    id: 't6',
    name: '한소희',
    email: 'sohee.han@example.com',
    title: '산업안전 전문가',
    level: 5,
    experience: 6,
    skills: [
      { name: '산업안전', level: '전문가', yearsOfExperience: 6 },
      { name: '위험성평가', level: '전문가', yearsOfExperience: 5 },
      { name: 'PSM', level: '고급', yearsOfExperience: 4 },
      { name: '안전교육', level: '고급', yearsOfExperience: 5 },
      { name: 'ISO 45001', level: '중급', yearsOfExperience: 3 },
    ],
    certifications: [
      { name: '산업안전기사', issuer: '한국산업인력공단', issueDate: new Date('2019-09-15'), isVerified: true },
      { name: '위험물산업기사', issuer: '한국산업인력공단', issueDate: new Date('2020-06-20'), isVerified: true },
      { name: 'ISO 45001 심사원', issuer: 'KAB', issueDate: new Date('2023-10-10'), isVerified: true },
    ],
    completedCourses: [
      { id: 'c9', name: 'PSM 실무 과정', provider: '안전보건공단', completedAt: new Date('2024-03-25'), score: 92 },
      { id: 'c10', name: '스마트 안전관리', provider: '스마트안전연구원', completedAt: new Date('2024-11-15'), score: 88 },
    ],
    introduction: '제조 현장의 안전관리 전문가입니다. 무재해 사업장 인증 경험이 있으며, 안전 문화 정착을 위한 다양한 프로젝트를 수행했습니다.',
    desiredPosition: '안전관리 팀장 / HSE 매니저',
    desiredSalary: '5000만원 ~ 6000만원',
    location: '충청남도 천안시',
    isAvailable: true,
    lastActive: new Date('2024-12-18'),
    viewCount: 198,
    savedCount: 15,
  },
]

// 스킬 목록
export const skillOptions = [
  'CNC 가공', 'CNC 밀링', 'CNC 선반', 'CAM 프로그래밍',
  'PLC 프로그래밍', '미쓰비시 PLC', '지멘스 PLC', 'HMI 설계',
  '스마트팩토리', 'MES 시스템', 'IoT', '데이터 분석',
  '품질관리', 'SPC', '6시그마', 'ISO 9001', 'IATF 16949',
  '용접', 'TIG 용접', 'MIG 용접', '특수 용접',
  '산업안전', '위험성평가', 'PSM', 'ISO 45001',
  '로봇 프로그래밍', 'Python', 'AutoCAD',
]

// 자격증 목록
export const certificationOptions = [
  '컴퓨터응용가공산업기사', '품질경영기사', '산업안전기사',
  '생산자동화기능사', '생산자동화산업기사', '정보처리기사',
  '전기기능사', '용접기능사', '용접산업기사', '특수용접기능사',
  '6시그마 블랙벨트', '6시그마 그린벨트',
  'ISO 9001 심사원', 'ISO 45001 심사원',
]

// 지역 목록
export const locationOptions = [
  '서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종',
  '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
]

export function useTalentSearch() {
  const [talents, setTalents] = useState<Talent[]>([])
  const [filteredTalents, setFilteredTalents] = useState<Talent[]>([])
  const [savedTalents, setSavedTalents] = useState<SavedTalent[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    skills: [],
    minExperience: 0,
    maxExperience: 20,
    location: '',
    skillLevel: 'all',
    isAvailableOnly: false,
    certifications: [],
  })

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = () => {
      setTalents(sampleTalents)
      setFilteredTalents(sampleTalents)

      const saved = localStorage.getItem('skillbridge_saved_talents')
      if (saved) {
        setSavedTalents(JSON.parse(saved))
      }
      setLoading(false)
    }

    loadData()
  }, [])

  // 필터 적용
  useEffect(() => {
    let result = [...talents]

    // 검색어 필터
    if (filters.query) {
      const query = filters.query.toLowerCase()
      result = result.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.title.toLowerCase().includes(query) ||
        t.introduction.toLowerCase().includes(query) ||
        t.skills.some(s => s.name.toLowerCase().includes(query))
      )
    }

    // 스킬 필터
    if (filters.skills.length > 0) {
      result = result.filter(t =>
        filters.skills.every(skill =>
          t.skills.some(s => s.name.toLowerCase().includes(skill.toLowerCase()))
        )
      )
    }

    // 경력 필터
    result = result.filter(t =>
      t.experience >= filters.minExperience &&
      t.experience <= filters.maxExperience
    )

    // 지역 필터
    if (filters.location) {
      result = result.filter(t =>
        t.location.includes(filters.location)
      )
    }

    // 스킬 레벨 필터
    if (filters.skillLevel !== 'all') {
      result = result.filter(t =>
        t.skills.some(s => s.level === filters.skillLevel)
      )
    }

    // 구직중 필터
    if (filters.isAvailableOnly) {
      result = result.filter(t => t.isAvailable)
    }

    // 자격증 필터
    if (filters.certifications.length > 0) {
      result = result.filter(t =>
        filters.certifications.some(cert =>
          t.certifications.some(c => c.name.includes(cert))
        )
      )
    }

    setFilteredTalents(result)
  }, [talents, filters])

  // 필터 업데이트
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // 필터 리셋
  const resetFilters = useCallback(() => {
    setFilters({
      query: '',
      skills: [],
      minExperience: 0,
      maxExperience: 20,
      location: '',
      skillLevel: 'all',
      isAvailableOnly: false,
      certifications: [],
    })
  }, [])

  // 인재 저장
  const saveTalent = useCallback((talentId: string, notes?: string) => {
    const existing = savedTalents.find(s => s.talentId === talentId)
    if (existing) return

    const newSaved: SavedTalent = {
      talentId,
      savedAt: new Date(),
      notes,
      status: 'saved',
    }
    const updated = [...savedTalents, newSaved]
    setSavedTalents(updated)
    localStorage.setItem('skillbridge_saved_talents', JSON.stringify(updated))
  }, [savedTalents])

  // 저장 취소
  const unsaveTalent = useCallback((talentId: string) => {
    const updated = savedTalents.filter(s => s.talentId !== talentId)
    setSavedTalents(updated)
    localStorage.setItem('skillbridge_saved_talents', JSON.stringify(updated))
  }, [savedTalents])

  // 저장된 인재 상태 업데이트
  const updateSavedTalentStatus = useCallback((talentId: string, status: SavedTalent['status']) => {
    const updated = savedTalents.map(s =>
      s.talentId === talentId ? { ...s, status } : s
    )
    setSavedTalents(updated)
    localStorage.setItem('skillbridge_saved_talents', JSON.stringify(updated))
  }, [savedTalents])

  // 인재가 저장되었는지 확인
  const isTalentSaved = useCallback((talentId: string) => {
    return savedTalents.some(s => s.talentId === talentId)
  }, [savedTalents])

  // 저장된 인재 목록 가져오기
  const getSavedTalentsList = useCallback(() => {
    return savedTalents.map(saved => ({
      ...saved,
      talent: talents.find(t => t.id === saved.talentId),
    })).filter(item => item.talent)
  }, [savedTalents, talents])

  // 통계
  const getStats = useCallback(() => {
    return {
      totalTalents: talents.length,
      availableTalents: talents.filter(t => t.isAvailable).length,
      savedCount: savedTalents.length,
      avgExperience: talents.reduce((sum, t) => sum + t.experience, 0) / talents.length || 0,
    }
  }, [talents, savedTalents])

  return {
    talents: filteredTalents,
    allTalents: talents,
    savedTalents,
    loading,
    filters,
    updateFilters,
    resetFilters,
    saveTalent,
    unsaveTalent,
    updateSavedTalentStatus,
    isTalentSaved,
    getSavedTalentsList,
    getStats,
  }
}
