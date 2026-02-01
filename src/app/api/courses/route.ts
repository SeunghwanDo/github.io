import { NextRequest, NextResponse } from 'next/server'

interface Course {
  id: string
  title: string
  category: string
  provider: string
  duration: string
  targetLevel: string
  description: string
  price: number
  rating: number
  enrollmentCount: number
  tags: string[]
}

// Mock 교육 과정 데이터
const courses: Course[] = [
  {
    id: 'c001',
    title: '스마트공장 데이터 분석 기초',
    category: '데이터 분석',
    provider: '한국생산성본부',
    duration: '16시간',
    targetLevel: '초급',
    description: '제조 현장 데이터를 수집하고 분석하는 기초 역량을 학습합니다.',
    price: 350000,
    rating: 4.5,
    enrollmentCount: 245,
    tags: ['데이터분석', '엑셀', '시각화', '스마트공장'],
  },
  {
    id: 'c002',
    title: 'PLC 프로그래밍 실무',
    category: '스마트 제조',
    provider: '대한상공회의소',
    duration: '24시간',
    targetLevel: '중급',
    description: 'PLC 기본 구조 이해부터 래더 프로그래밍까지 실무 역량을 배양합니다.',
    price: 480000,
    rating: 4.7,
    enrollmentCount: 189,
    tags: ['PLC', '자동화', '래더', '시퀀스'],
  },
  {
    id: 'c003',
    title: '협동로봇 운용 및 프로그래밍',
    category: '자동화',
    provider: '로봇산업진흥원',
    duration: '32시간',
    targetLevel: '초급',
    description: '협동로봇의 기본 운용법과 간단한 프로그래밍을 학습합니다.',
    price: 550000,
    rating: 4.8,
    enrollmentCount: 312,
    tags: ['협동로봇', 'cobot', '로봇프로그래밍'],
  },
  {
    id: 'c004',
    title: '산업용 IoT 센서 활용',
    category: 'IoT/센서',
    provider: '스마트제조혁신센터',
    duration: '16시간',
    targetLevel: '중급',
    description: '다양한 산업용 센서의 원리와 데이터 수집 방법을 학습합니다.',
    price: 380000,
    rating: 4.4,
    enrollmentCount: 156,
    tags: ['IoT', '센서', '데이터수집', 'MQTT'],
  },
  {
    id: 'c005',
    title: 'SPC(통계적 공정관리) 실무',
    category: '품질관리',
    provider: '한국품질재단',
    duration: '24시간',
    targetLevel: '중급',
    description: '관리도 작성부터 공정능력 분석까지 SPC 전반을 학습합니다.',
    price: 420000,
    rating: 4.6,
    enrollmentCount: 278,
    tags: ['SPC', '품질관리', '통계', '관리도'],
  },
  {
    id: 'c006',
    title: '머신러닝 기반 예지보전',
    category: '데이터 분석',
    provider: '스마트제조혁신센터',
    duration: '40시간',
    targetLevel: '고급',
    description: '설비 데이터 기반 고장 예측 모델 개발 방법을 학습합니다.',
    price: 780000,
    rating: 4.9,
    enrollmentCount: 89,
    tags: ['머신러닝', '예지보전', 'AI', 'Python'],
  },
  {
    id: 'c007',
    title: 'MES 시스템 이해와 활용',
    category: '스마트 제조',
    provider: '대한상공회의소',
    duration: '16시간',
    targetLevel: '초급',
    description: 'MES 시스템의 구조와 현장 활용 방법을 학습합니다.',
    price: 320000,
    rating: 4.3,
    enrollmentCount: 203,
    tags: ['MES', '스마트공장', '생산관리'],
  },
  {
    id: 'c008',
    title: '6시그마 Green Belt',
    category: '품질관리',
    provider: '한국품질재단',
    duration: '40시간',
    targetLevel: '중급',
    description: '6시그마 방법론과 개선 도구를 체계적으로 학습합니다.',
    price: 650000,
    rating: 4.7,
    enrollmentCount: 421,
    tags: ['6시그마', 'DMAIC', '품질개선'],
  },
]

// 교육 과정 목록 조회
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  const level = searchParams.get('level')
  const search = searchParams.get('search')

  let filteredCourses = [...courses]

  // 카테고리 필터
  if (category && category !== 'all') {
    filteredCourses = filteredCourses.filter((c) => c.category === category)
  }

  // 레벨 필터
  if (level && level !== 'all') {
    filteredCourses = filteredCourses.filter((c) => c.targetLevel === level)
  }

  // 검색어 필터
  if (search) {
    const searchLower = search.toLowerCase()
    filteredCourses = filteredCourses.filter(
      (c) =>
        c.title.toLowerCase().includes(searchLower) ||
        c.tags.some((t) => t.toLowerCase().includes(searchLower)) ||
        c.provider.toLowerCase().includes(searchLower)
    )
  }

  return NextResponse.json({
    success: true,
    data: {
      courses: filteredCourses,
      total: filteredCourses.length,
      categories: ['스마트 제조', '데이터 분석', '품질관리', '자동화', 'IoT/센서'],
      levels: ['초급', '중급', '고급'],
    },
  })
}

// 맞춤 추천 교육 과정 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { skillResults, companyId } = body as {
      skillResults: { category: string; score: number }[]
      companyId?: string
    }

    if (!skillResults || !Array.isArray(skillResults)) {
      return NextResponse.json(
        { error: '유효하지 않은 요청입니다.' },
        { status: 400 }
      )
    }

    // 약점 기반 추천 (점수가 낮은 카테고리 우선)
    const recommendations = skillResults
      .filter((r) => r.score < 4)
      .sort((a, b) => a.score - b.score)
      .flatMap((result) => {
        const categoryCourses = courses.filter(
          (c) => c.category === result.category
        )

        // 점수에 따른 적절한 레벨 매칭
        let targetLevel = '초급'
        if (result.score >= 3) targetLevel = '중급'
        if (result.score >= 4) targetLevel = '고급'

        const levelMatchedCourses = categoryCourses.filter(
          (c) => c.targetLevel === targetLevel
        )

        return levelMatchedCourses.length > 0
          ? levelMatchedCourses
          : categoryCourses.slice(0, 2)
      })

    // 중복 제거
    const uniqueRecommendations = Array.from(
      new Map(recommendations.map((c) => [c.id, c])).values()
    )

    return NextResponse.json({
      success: true,
      data: {
        recommendations: uniqueRecommendations.slice(0, 6),
        totalMatched: uniqueRecommendations.length,
        analysisBasedOn: skillResults.length,
      },
    })
  } catch (error) {
    console.error('Course recommendation error:', error)
    return NextResponse.json(
      { error: '추천 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
