import { NextRequest, NextResponse } from 'next/server'

interface SkillAnswer {
  questionId: number
  category: string
  score: number
}

interface AnalysisResult {
  category: string
  score: number
  level: string
  percentile: number
  recommendation: string
  courses: string[]
}

// 스킬 분석 API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers, userId, companyId } = body as {
      answers: SkillAnswer[]
      userId?: string
      companyId?: string
    }

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: '유효하지 않은 요청입니다.' },
        { status: 400 }
      )
    }

    // 카테고리별 분석 결과 생성
    const analysisResults: AnalysisResult[] = answers.map((answer) => {
      const { category, score } = answer

      let level = ''
      let percentile = 0
      let recommendation = ''
      let courses: string[] = []

      if (score <= 1) {
        level = '입문'
        percentile = 15
        recommendation = `${category} 기초 역량 강화가 필요합니다.`
        courses = [
          `${category} 기초 입문 과정`,
          `${category} 이론과 개념 이해`,
        ]
      } else if (score <= 2) {
        level = '초급'
        percentile = 35
        recommendation = `${category} 실무 기초 학습을 추천합니다.`
        courses = [
          `${category} 실무 기초 과정`,
          `${category} 현장 적용 사례 학습`,
        ]
      } else if (score <= 3) {
        level = '중급'
        percentile = 55
        recommendation = `${category} 심화 학습으로 전문성을 높이세요.`
        courses = [
          `${category} 심화 과정`,
          `${category} 문제 해결 워크샵`,
        ]
      } else if (score <= 4) {
        level = '고급'
        percentile = 80
        recommendation = `${category} 전문가 과정으로 역량을 완성하세요.`
        courses = [
          `${category} 전문가 과정`,
          `${category} 리더십 및 코칭`,
        ]
      } else {
        level = '전문가'
        percentile = 95
        recommendation = `${category} 분야의 전문가입니다. 지식 공유를 권장합니다.`
        courses = [
          `${category} 마스터 클래스`,
          `${category} 강사 양성 과정`,
        ]
      }

      return {
        category,
        score,
        level,
        percentile,
        recommendation,
        courses,
      }
    })

    // 전체 평균 계산
    const averageScore =
      analysisResults.reduce((sum, r) => sum + r.score, 0) / analysisResults.length

    // 강점/약점 분석
    const strengths = analysisResults
      .filter((r) => r.score >= 4)
      .map((r) => r.category)

    const weaknesses = analysisResults
      .filter((r) => r.score <= 2)
      .map((r) => r.category)

    // 우선 추천 교육 (약점 기반)
    const priorityCourses = analysisResults
      .filter((r) => r.score <= 3)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .flatMap((r) => r.courses)

    const response = {
      success: true,
      data: {
        userId,
        companyId,
        analysisDate: new Date().toISOString(),
        overallScore: Math.round(averageScore * 10) / 10,
        overallLevel: averageScore >= 4 ? '고급' : averageScore >= 3 ? '중급' : averageScore >= 2 ? '초급' : '입문',
        results: analysisResults,
        summary: {
          strengths,
          weaknesses,
          priorityCourses,
        },
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Skill analysis error:', error)
    return NextResponse.json(
      { error: '분석 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 분석 결과 조회
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  const companyId = searchParams.get('companyId')

  // Mock 데이터 반환 (실제로는 DB에서 조회)
  const mockResult = {
    userId,
    companyId,
    analysisDate: '2024-01-20T09:00:00Z',
    overallScore: 3.2,
    overallLevel: '중급',
    results: [
      { category: '스마트 제조', score: 3, level: '중급', percentile: 55 },
      { category: '데이터 분석', score: 2, level: '초급', percentile: 35 },
      { category: '품질관리', score: 4, level: '고급', percentile: 80 },
      { category: '자동화', score: 3, level: '중급', percentile: 55 },
      { category: 'IoT/센서', score: 4, level: '고급', percentile: 80 },
    ],
  }

  return NextResponse.json({ success: true, data: mockResult })
}
