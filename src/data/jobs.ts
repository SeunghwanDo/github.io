// Biz360 채용공고 데이터 (연동 시뮬레이션)

export interface JobPosting {
  id: string
  company_name: string
  company_logo?: string
  title: string
  department: string
  location: string
  employment_type: '정규직' | '계약직' | '인턴'
  experience_level: string
  salary_range?: string
  required_skills: string[]
  preferred_skills: string[]
  description: string
  responsibilities: string[]
  qualifications: string[]
  benefits: string[]
  posted_at: string
  deadline: string
  status: 'active' | 'closed' | 'upcoming'
  applicants_count: number
  views_count: number
}

// 스킬과 교육과정 카테고리 매핑
export const skillToCourseMapping: Record<string, string[]> = {
  // 용접 관련
  '아크용접': ['1'],
  '용접': ['1'],
  'TIG용접': ['1'],
  'MIG용접': ['1'],
  '특수용접': ['1'],

  // CNC/가공 관련
  'CNC': ['2'],
  'CNC선반': ['2'],
  'CNC밀링': ['2'],
  'CAM': ['2'],
  '기계가공': ['2'],
  'G코드': ['2'],

  // 품질관리 관련
  'QC': ['3'],
  '품질관리': ['3'],
  'SPC': ['3'],
  '6시그마': ['3'],
  'ISO': ['3'],
  '품질검사': ['3'],

  // 자동화/PLC 관련
  'PLC': ['4'],
  '자동화': ['4'],
  'HMI': ['4'],
  '산업자동화': ['4'],
  '시퀀스제어': ['4'],
  'SCADA': ['4'],

  // 물류/지게차 관련
  '지게차': ['5'],
  '물류': ['5'],
  '창고관리': ['5'],
  '운반': ['5'],

  // 전기/전자 관련
  '전기': ['6'],
  '전기기능사': ['6'],
  '전기설비': ['6'],
  '배전반': ['6'],
  '시퀀스': ['6'],

  // 로봇 관련
  '로봇': ['7'],
  '산업용로봇': ['7'],
  '로봇용접': ['7', '1'],
  '로봇조작': ['7'],
  '협동로봇': ['7'],

  // CAD/설계 관련
  'CAD': ['8'],
  'AutoCAD': ['8'],
  '기계설계': ['8'],
  '제도': ['8'],
  '3D모델링': ['8'],
  'SolidWorks': ['8'],

  // 에너지 관련
  '에너지관리': ['9'],
  '에너지절감': ['9'],
  '보일러': ['9'],
  '공조': ['9'],

  // 사출 관련
  '사출': ['10'],
  '사출성형': ['10'],
  '금형': ['10'],
  '플라스틱': ['10'],

  // 반도체 관련
  '반도체': ['11'],
  '클린룸': ['11'],
  '반도체공정': ['11'],
  '웨이퍼': ['11'],

  // 스마트팩토리 관련
  '스마트팩토리': ['12'],
  'IoT': ['12'],
  'MES': ['12'],
  '데이터분석': ['12'],
  '빅데이터': ['12'],
}

// Biz360 연동 채용공고 mock 데이터
export const jobPostings: Record<string, JobPosting> = {
  'job-1': {
    id: 'job-1',
    company_name: '현대중공업',
    title: '용접 기술자',
    department: '조선사업부',
    location: '울산 동구',
    employment_type: '정규직',
    experience_level: '경력 3년 이상',
    salary_range: '4,000만원 ~ 5,500만원',
    required_skills: ['아크용접', 'TIG용접', '도면해독'],
    preferred_skills: ['용접기능장', '특수용접', '로봇용접'],
    description: '현대중공업 조선사업부에서 선박 건조에 필요한 용접 기술자를 모집합니다.',
    responsibilities: [
      '선박 구조물 용접 작업',
      '용접 품질 관리 및 검사',
      '신규 용접 기술 도입 및 적용',
      '후배 기술자 교육 및 지도',
    ],
    qualifications: [
      '용접 관련 자격증 보유자',
      '아크용접, TIG용접 숙련자',
      '도면 해독 능력 보유',
      '교대 근무 가능자',
    ],
    benefits: ['4대보험', '퇴직금', '중식제공', '통근버스', '자녀학자금'],
    posted_at: '2024-01-15',
    deadline: '2024-02-15',
    status: 'active',
    applicants_count: 45,
    views_count: 1230,
  },
  'job-2': {
    id: 'job-2',
    company_name: '삼성전자',
    title: 'CNC 가공 엔지니어',
    department: '반도체 장비팀',
    location: '화성시',
    employment_type: '정규직',
    experience_level: '경력 2년 이상',
    salary_range: '4,500만원 ~ 6,000만원',
    required_skills: ['CNC선반', 'CNC밀링', 'CAM', 'G코드'],
    preferred_skills: ['기계가공기능장', 'MasterCAM', '정밀가공'],
    description: '반도체 장비 부품 정밀 가공을 담당할 CNC 엔지니어를 모집합니다.',
    responsibilities: [
      '반도체 장비 부품 CNC 가공',
      '가공 프로그램 작성 및 최적화',
      '품질 검사 및 측정',
      '장비 유지보수',
    ],
    qualifications: [
      'CNC 기계 운용 경력 2년 이상',
      'CAM 프로그램 사용 가능',
      'G코드 작성 능력',
      '정밀 측정 장비 활용 가능',
    ],
    benefits: ['4대보험', '성과급', '자녀학자금', '사내식당', '헬스장'],
    posted_at: '2024-01-18',
    deadline: '2024-02-28',
    status: 'active',
    applicants_count: 78,
    views_count: 2340,
  },
  'job-3': {
    id: 'job-3',
    company_name: 'LG화학',
    title: '품질관리(QC) 담당자',
    department: '품질보증팀',
    location: '여수시',
    employment_type: '정규직',
    experience_level: '신입/경력',
    salary_range: '3,500만원 ~ 5,000만원',
    required_skills: ['품질관리', 'SPC', 'ISO'],
    preferred_skills: ['6시그마', '품질기사', 'FMEA'],
    description: '석유화학 제품의 품질관리를 담당할 QC 전문가를 모집합니다.',
    responsibilities: [
      '제품 품질 검사 및 관리',
      'SPC 데이터 분석',
      'ISO 문서 관리',
      '품질 개선 활동 추진',
    ],
    qualifications: [
      '품질관리 관련 전공자',
      'SPC, 통계 분석 능력',
      'MS Office 활용 능숙',
      '문제해결 능력 우수자',
    ],
    benefits: ['4대보험', '연차휴가', '사택제공', '통근버스', '의료비지원'],
    posted_at: '2024-01-20',
    deadline: '2024-02-20',
    status: 'active',
    applicants_count: 156,
    views_count: 4520,
  },
  'job-4': {
    id: 'job-4',
    company_name: 'LS일렉트릭',
    title: 'PLC 자동화 엔지니어',
    department: '자동화사업부',
    location: '청주시',
    employment_type: '정규직',
    experience_level: '경력 3년 이상',
    salary_range: '5,000만원 ~ 7,000만원',
    required_skills: ['PLC', 'HMI', '자동화', '시퀀스제어'],
    preferred_skills: ['SCADA', '로봇', '전기기사'],
    description: '스마트팩토리 자동화 시스템 구축을 담당할 PLC 엔지니어를 모집합니다.',
    responsibilities: [
      'PLC 프로그램 설계 및 개발',
      'HMI 화면 개발',
      '자동화 라인 구축 및 관리',
      '설비 트러블슈팅',
    ],
    qualifications: [
      'PLC 프로그래밍 경력 3년 이상',
      '지멘스/미쓰비시/LS PLC 사용 가능',
      '전기/전자 관련 전공',
      '출장 가능자',
    ],
    benefits: ['4대보험', '성과급', '자기개발비', '복지포인트', '장기근속수당'],
    posted_at: '2024-01-22',
    deadline: '2024-03-01',
    status: 'active',
    applicants_count: 34,
    views_count: 980,
  },
  'job-5': {
    id: 'job-5',
    company_name: '쿠팡',
    title: '물류센터 지게차 운전원',
    department: '풀필먼트센터',
    location: '부산 강서구',
    employment_type: '정규직',
    experience_level: '신입/경력',
    salary_range: '3,200만원 ~ 4,000만원',
    required_skills: ['지게차', '물류', '창고관리'],
    preferred_skills: ['지게차기능사', '위험물취급', 'WMS'],
    description: '대규모 물류센터에서 지게차를 운용할 전문 인력을 모집합니다.',
    responsibilities: [
      '입출고 화물 운반',
      '재고 정리 및 적재',
      '지게차 일일 점검',
      '안전 수칙 준수',
    ],
    qualifications: [
      '지게차 운전 면허 소지자',
      '물류센터 근무 경험 우대',
      '성실하고 책임감 있는 분',
      '교대 근무 가능자',
    ],
    benefits: ['4대보험', '중식제공', '통근버스', '연차휴가', '명절선물'],
    posted_at: '2024-01-25',
    deadline: '2024-02-10',
    status: 'active',
    applicants_count: 89,
    views_count: 1876,
  },
  'job-6': {
    id: 'job-6',
    company_name: '두산로보틱스',
    title: '협동로봇 엔지니어',
    department: 'R&D센터',
    location: '수원시',
    employment_type: '정규직',
    experience_level: '경력 2년 이상',
    salary_range: '5,500만원 ~ 8,000만원',
    required_skills: ['로봇', 'PLC', '자동화'],
    preferred_skills: ['협동로봇', 'ROS', 'Python', '비전시스템'],
    description: '협동로봇 시스템 개발 및 고객 현장 적용을 담당할 엔지니어를 모집합니다.',
    responsibilities: [
      '협동로봇 어플리케이션 개발',
      '고객 현장 설치 및 티칭',
      '기술 지원 및 트러블슈팅',
      '로봇 시스템 최적화',
    ],
    qualifications: [
      '산업용 로봇 운용 경험',
      'PLC 및 자동화 시스템 이해',
      '기계/전자/로봇 관련 전공',
      '국내외 출장 가능자',
    ],
    benefits: ['4대보험', 'RSU', '자기개발비', '사내식당', '유연근무제'],
    posted_at: '2024-01-28',
    deadline: '2024-02-28',
    status: 'active',
    applicants_count: 23,
    views_count: 567,
  },
  'job-7': {
    id: 'job-7',
    company_name: 'SK하이닉스',
    title: '반도체 공정 엔지니어',
    department: '생산기술팀',
    location: '이천시',
    employment_type: '정규직',
    experience_level: '신입/경력',
    salary_range: '4,500만원 ~ 6,500만원',
    required_skills: ['반도체', '클린룸', '반도체공정'],
    preferred_skills: ['웨이퍼', '공정분석', 'SPC'],
    description: 'D램/낸드 반도체 제조 공정을 담당할 엔지니어를 모집합니다.',
    responsibilities: [
      '반도체 공정 운영 및 관리',
      '공정 데이터 분석 및 개선',
      '수율 향상 활동',
      '설비 관리 및 유지보수',
    ],
    qualifications: [
      '이공계 전공자',
      '반도체 공정 이해',
      '클린룸 근무 가능',
      '교대 근무 가능자',
    ],
    benefits: ['4대보험', '성과급', '주거지원', '사내식당', '어린이집'],
    posted_at: '2024-01-30',
    deadline: '2024-03-15',
    status: 'active',
    applicants_count: 234,
    views_count: 5670,
  },
  'job-8': {
    id: 'job-8',
    company_name: '포스코',
    title: '스마트팩토리 구축 담당자',
    department: '스마트제조혁신센터',
    location: '포항시',
    employment_type: '정규직',
    experience_level: '경력 5년 이상',
    salary_range: '6,000만원 ~ 9,000만원',
    required_skills: ['스마트팩토리', 'MES', 'IoT', '데이터분석'],
    preferred_skills: ['빅데이터', 'AI', 'Python', 'PLC'],
    description: '제철소 스마트팩토리 시스템 구축 및 운영을 담당할 전문가를 모집합니다.',
    responsibilities: [
      '스마트팩토리 시스템 기획 및 구축',
      'MES/ERP 연동 개발',
      'IoT 센서 데이터 수집 및 분석',
      'AI 기반 공정 최적화',
    ],
    qualifications: [
      'IT/제조 분야 경력 5년 이상',
      'MES, ERP 구축 경험',
      '데이터 분석 능력',
      '제조업 프로세스 이해',
    ],
    benefits: ['4대보험', '성과급', '사택', '복지포인트', '자녀학자금'],
    posted_at: '2024-02-01',
    deadline: '2024-03-31',
    status: 'active',
    applicants_count: 18,
    views_count: 432,
  },
}

// 직무 카테고리
export const jobCategories = [
  '전체',
  '용접/금속',
  'CNC/가공',
  '품질관리',
  '자동화/PLC',
  '물류/운반',
  '전기/전자',
  '로봇',
  '반도체',
  '스마트팩토리',
]

// 채용공고 필터링
export function getJobsByCategory(category: string): JobPosting[] {
  const jobs = Object.values(jobPostings)
  if (category === '전체') return jobs

  const categorySkillMap: Record<string, string[]> = {
    '용접/금속': ['아크용접', '용접', 'TIG용접', 'MIG용접'],
    'CNC/가공': ['CNC', 'CNC선반', 'CNC밀링', 'CAM'],
    '품질관리': ['QC', '품질관리', 'SPC', 'ISO'],
    '자동화/PLC': ['PLC', '자동화', 'HMI', '시퀀스제어'],
    '물류/운반': ['지게차', '물류', '창고관리'],
    '전기/전자': ['전기', '전기기능사', '전기설비'],
    '로봇': ['로봇', '산업용로봇', '협동로봇'],
    '반도체': ['반도체', '클린룸', '반도체공정'],
    '스마트팩토리': ['스마트팩토리', 'MES', 'IoT'],
  }

  const targetSkills = categorySkillMap[category] || []
  return jobs.filter((job) =>
    job.required_skills.some((skill) =>
      targetSkills.some((target) => skill.includes(target) || target.includes(skill))
    )
  )
}

// 검색
export function searchJobs(query: string): JobPosting[] {
  const normalizedQuery = query.toLowerCase().trim()
  return Object.values(jobPostings).filter(
    (job) =>
      job.title.toLowerCase().includes(normalizedQuery) ||
      job.company_name.toLowerCase().includes(normalizedQuery) ||
      job.required_skills.some((skill) => skill.toLowerCase().includes(normalizedQuery)) ||
      job.location.toLowerCase().includes(normalizedQuery)
  )
}

// 채용공고에 맞는 교육과정 추천
export function getRecommendedCoursesForJob(job: JobPosting): string[] {
  const allSkills = [...job.required_skills, ...job.preferred_skills]
  const courseIds = new Set<string>()

  allSkills.forEach((skill) => {
    // 직접 매핑 확인
    if (skillToCourseMapping[skill]) {
      skillToCourseMapping[skill].forEach((id) => courseIds.add(id))
    }
    // 부분 매칭 확인
    Object.entries(skillToCourseMapping).forEach(([key, ids]) => {
      if (skill.includes(key) || key.includes(skill)) {
        ids.forEach((id) => courseIds.add(id))
      }
    })
  })

  return Array.from(courseIds)
}

// 사용자 스킬과 채용공고 매칭 점수 계산
export function calculateJobMatchScore(
  userSkills: string[],
  job: JobPosting
): { score: number; matchedRequired: string[]; matchedPreferred: string[]; missingRequired: string[] } {
  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase())

  const matchedRequired = job.required_skills.filter((skill) =>
    normalizedUserSkills.some(
      (userSkill) => userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill)
    )
  )

  const matchedPreferred = job.preferred_skills.filter((skill) =>
    normalizedUserSkills.some(
      (userSkill) => userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill)
    )
  )

  const missingRequired = job.required_skills.filter((skill) => !matchedRequired.includes(skill))

  // 점수 계산: 필수 스킬 70%, 우대 스킬 30%
  const requiredScore = job.required_skills.length > 0
    ? (matchedRequired.length / job.required_skills.length) * 70
    : 70
  const preferredScore = job.preferred_skills.length > 0
    ? (matchedPreferred.length / job.preferred_skills.length) * 30
    : 30

  return {
    score: Math.round(requiredScore + preferredScore),
    matchedRequired,
    matchedPreferred,
    missingRequired,
  }
}
