'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Employee {
  id: string
  name: string
  department: string
  position: string
  skills: { category: string; level: number }[]
  lastAssessment: string
  recommendedCourses: number
}

interface DepartmentStat {
  name: string
  avgScore: number
  employeeCount: number
  skillGaps: string[]
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: '김철수',
    department: '생산1팀',
    position: '주임',
    skills: [
      { category: '스마트 제조', level: 3 },
      { category: '데이터 분석', level: 2 },
      { category: '품질관리', level: 4 },
      { category: '자동화', level: 2 },
      { category: 'IoT/센서', level: 3 },
    ],
    lastAssessment: '2024-01-15',
    recommendedCourses: 3,
  },
  {
    id: '2',
    name: '이영희',
    department: '품질관리팀',
    position: '대리',
    skills: [
      { category: '스마트 제조', level: 2 },
      { category: '데이터 분석', level: 4 },
      { category: '품질관리', level: 5 },
      { category: '자동화', level: 3 },
      { category: 'IoT/센서', level: 2 },
    ],
    lastAssessment: '2024-01-18',
    recommendedCourses: 2,
  },
  {
    id: '3',
    name: '박민수',
    department: '생산2팀',
    position: '사원',
    skills: [
      { category: '스마트 제조', level: 2 },
      { category: '데이터 분석', level: 1 },
      { category: '품질관리', level: 2 },
      { category: '자동화', level: 1 },
      { category: 'IoT/센서', level: 1 },
    ],
    lastAssessment: '2024-01-20',
    recommendedCourses: 5,
  },
  {
    id: '4',
    name: '정수진',
    department: '자동화팀',
    position: '과장',
    skills: [
      { category: '스마트 제조', level: 4 },
      { category: '데이터 분석', level: 3 },
      { category: '품질관리', level: 3 },
      { category: '자동화', level: 5 },
      { category: 'IoT/센서', level: 4 },
    ],
    lastAssessment: '2024-01-10',
    recommendedCourses: 1,
  },
]

const departmentStats: DepartmentStat[] = [
  {
    name: '생산1팀',
    avgScore: 2.8,
    employeeCount: 15,
    skillGaps: ['데이터 분석', '자동화'],
  },
  {
    name: '생산2팀',
    avgScore: 2.2,
    employeeCount: 12,
    skillGaps: ['데이터 분석', '자동화', 'IoT/센서'],
  },
  {
    name: '품질관리팀',
    avgScore: 3.4,
    employeeCount: 8,
    skillGaps: ['스마트 제조', 'IoT/센서'],
  },
  {
    name: '자동화팀',
    avgScore: 4.0,
    employeeCount: 6,
    skillGaps: [],
  },
]

const courseRecommendations = [
  {
    id: 1,
    title: '스마트공장 데이터 분석 기초',
    provider: '한국생산성본부',
    duration: '16시간',
    targetLevel: '초급',
    matchedEmployees: 8,
    category: '데이터 분석',
  },
  {
    id: 2,
    title: 'PLC 프로그래밍 실무',
    provider: '대한상공회의소',
    duration: '24시간',
    targetLevel: '중급',
    matchedEmployees: 5,
    category: '스마트 제조',
  },
  {
    id: 3,
    title: '협동로봇 운용 및 프로그래밍',
    provider: '로봇산업진흥원',
    duration: '32시간',
    targetLevel: '초급',
    matchedEmployees: 12,
    category: '자동화',
  },
  {
    id: 4,
    title: '산업용 IoT 센서 활용',
    provider: '스마트제조혁신센터',
    duration: '16시간',
    targetLevel: '중급',
    matchedEmployees: 6,
    category: 'IoT/센서',
  },
]

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'employees' | 'courses'>('overview')
  const [biz360Connected, setBiz360Connected] = useState(true)

  const avgCompanyScore =
    mockEmployees.reduce(
      (sum, emp) => sum + emp.skills.reduce((s, skill) => s + skill.level, 0) / emp.skills.length,
      0
    ) / mockEmployees.length

  const getLevelColor = (level: number) => {
    if (level >= 4) return 'bg-green-100 text-green-700'
    if (level >= 3) return 'bg-blue-100 text-blue-700'
    if (level >= 2) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  const getLevelText = (level: number) => {
    if (level >= 5) return '전문가'
    if (level >= 4) return '고급'
    if (level >= 3) return '중급'
    if (level >= 2) return '초급'
    return '입문'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">SkillBridge</h1>
                  <p className="text-xs text-gray-500">기업 대시보드</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                  biz360Connected
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    biz360Connected ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                Biz360 {biz360Connected ? '연동됨' : '미연동'}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <span className="text-gray-700 font-medium">(주)스마트테크</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          {[
            { id: 'overview', label: '전체 현황' },
            { id: 'employees', label: '직원 관리' },
            { id: 'courses', label: '교육 과정' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
              className={`pb-4 px-2 font-medium transition ${
                selectedTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-gray-500 text-sm mb-1">전체 직원 수</div>
                <div className="text-3xl font-bold text-gray-900">41명</div>
                <div className="text-green-600 text-sm mt-2">+3 이번 달</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-gray-500 text-sm mb-1">진단 완료율</div>
                <div className="text-3xl font-bold text-gray-900">85%</div>
                <div className="text-gray-500 text-sm mt-2">35/41명 완료</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-gray-500 text-sm mb-1">평균 역량 점수</div>
                <div className="text-3xl font-bold text-primary-600">
                  {avgCompanyScore.toFixed(1)}
                </div>
                <div className="text-green-600 text-sm mt-2">+0.3 전월 대비</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-gray-500 text-sm mb-1">추천 교육 수</div>
                <div className="text-3xl font-bold text-gray-900">12개</div>
                <div className="text-gray-500 text-sm mt-2">4개 진행중</div>
              </div>
            </div>

            {/* Department Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">부서별 역량 현황</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm border-b">
                      <th className="pb-3 font-medium">부서</th>
                      <th className="pb-3 font-medium">인원</th>
                      <th className="pb-3 font-medium">평균 점수</th>
                      <th className="pb-3 font-medium">역량 그래프</th>
                      <th className="pb-3 font-medium">부족 역량</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentStats.map((dept, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-4 font-medium text-gray-900">{dept.name}</td>
                        <td className="py-4 text-gray-600">{dept.employeeCount}명</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-sm ${getLevelColor(dept.avgScore)}`}>
                            {dept.avgScore.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="w-full max-w-[200px] h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-600 rounded-full"
                              style={{ width: `${(dept.avgScore / 5) * 100}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-4">
                          {dept.skillGaps.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {dept.skillGaps.map((gap, i) => (
                                <span
                                  key={i}
                                  className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded"
                                >
                                  {gap}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-green-600 text-sm">우수</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Skill Gap Chart */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">역량 영역별 현황</h3>
                <div className="space-y-4">
                  {['스마트 제조', '데이터 분석', '품질관리', '자동화', 'IoT/센서'].map(
                    (skill, index) => {
                      const avgLevel =
                        mockEmployees.reduce((sum, emp) => {
                          const s = emp.skills.find((sk) => sk.category === skill)
                          return sum + (s?.level || 0)
                        }, 0) / mockEmployees.length

                      return (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">{skill}</span>
                            <span className="text-gray-500">{avgLevel.toFixed(1)} / 5.0</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                avgLevel >= 3 ? 'bg-green-500' : avgLevel >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${(avgLevel / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Biz360 연동 현황</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">인사 정보 연동</div>
                        <div className="text-sm text-gray-500">마지막 동기화: 2시간 전</div>
                      </div>
                    </div>
                    <span className="text-green-600 text-sm font-medium">활성</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">조직도 연동</div>
                        <div className="text-sm text-gray-500">마지막 동기화: 1일 전</div>
                      </div>
                    </div>
                    <span className="text-green-600 text-sm font-medium">활성</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">교육 이력 연동</div>
                        <div className="text-sm text-gray-500">설정 필요</div>
                      </div>
                    </div>
                    <button className="text-primary-600 text-sm font-medium hover:underline">
                      설정
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {selectedTab === 'employees' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">직원 역량 현황</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="이름 또는 부서 검색"
                    className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700">
                    진단 요청 보내기
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm bg-gray-50">
                    <th className="px-6 py-3 font-medium">이름</th>
                    <th className="px-6 py-3 font-medium">부서</th>
                    <th className="px-6 py-3 font-medium">직급</th>
                    <th className="px-6 py-3 font-medium">역량 수준</th>
                    <th className="px-6 py-3 font-medium">마지막 진단</th>
                    <th className="px-6 py-3 font-medium">추천 교육</th>
                    <th className="px-6 py-3 font-medium">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {mockEmployees.map((employee) => {
                    const avgLevel =
                      employee.skills.reduce((sum, s) => sum + s.level, 0) / employee.skills.length

                    return (
                      <tr key={employee.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary-700 font-medium text-sm">
                                {employee.name[0]}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{employee.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{employee.department}</td>
                        <td className="px-6 py-4 text-gray-600">{employee.position}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {employee.skills.map((skill, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-6 rounded-sm ${
                                    skill.level >= 4
                                      ? 'bg-green-500'
                                      : skill.level >= 3
                                      ? 'bg-blue-500'
                                      : skill.level >= 2
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                  }`}
                                  title={`${skill.category}: ${skill.level}`}
                                />
                              ))}
                            </div>
                            <span className={`text-sm px-2 py-0.5 rounded ${getLevelColor(avgLevel)}`}>
                              {getLevelText(Math.round(avgLevel))}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{employee.lastAssessment}</td>
                        <td className="px-6 py-4">
                          <span className="bg-orange-100 text-orange-700 text-sm px-2 py-1 rounded">
                            {employee.recommendedCourses}개
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-primary-600 hover:underline text-sm">
                            상세 보기
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {selectedTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">맞춤 추천 교육 과정</h3>
              <div className="flex gap-3">
                <select className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>모든 카테고리</option>
                  <option>스마트 제조</option>
                  <option>데이터 분석</option>
                  <option>품질관리</option>
                  <option>자동화</option>
                  <option>IoT/센서</option>
                </select>
                <select className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>모든 수준</option>
                  <option>초급</option>
                  <option>중급</option>
                  <option>고급</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {courseRecommendations.map((course) => (
                <div key={course.id} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded">
                      {course.category}
                    </span>
                    <span className="text-orange-600 text-sm font-medium">
                      {course.matchedEmployees}명 대상
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>{course.provider}</span>
                    <span>|</span>
                    <span>{course.duration}</span>
                    <span>|</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded">{course.targetLevel}</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm hover:bg-primary-700">
                      교육 신청
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                      상세 보기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
