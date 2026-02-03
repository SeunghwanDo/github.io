// 교육기관 데이터

export interface Provider {
  id: string
  name: string
  type: '대학' | '직업훈련원' | '기업연수원' | '온라인' | '정부기관'
  description: string
  logo?: string
  location: string
  address: string
  phone: string
  email: string
  website: string
  established: string
  totalStudents: number
  totalCourses: number
  rating: number
  reviewCount: number
  certifications: string[]
  specialties: string[]
  facilities: string[]
  partnerships: string[]
}

export const providers: Record<string, Provider> = {
  'kopo': {
    id: 'kopo',
    name: '한국폴리텍대학',
    type: '대학',
    description: '대한민국 최고의 기술교육 명문, 한국폴리텍대학입니다. 산업현장 중심의 실무 교육과 높은 취업률을 자랑합니다.',
    location: '부산 사상구',
    address: '부산광역시 사상구 학감대로 316',
    phone: '051-310-3000',
    email: 'info@kopo.ac.kr',
    website: 'https://www.kopo.ac.kr',
    established: '1998',
    totalStudents: 45000,
    totalCourses: 150,
    rating: 4.7,
    reviewCount: 2340,
    certifications: ['고용노동부 인정 직업훈련기관', 'NCS 기반 교육과정 운영', 'K-Digital Training 지정기관'],
    specialties: ['용접', '기계가공', '자동화', '전기전자', '반도체'],
    facilities: ['최신 용접실습장', 'CNC 가공센터', 'PLC 실습실', '로봇 자동화 센터'],
    partnerships: ['현대중공업', '삼성전자', 'LG화학', '포스코'],
  },
  'smart-factory': {
    id: 'smart-factory',
    name: '스마트공장배움터',
    type: '정부기관',
    description: '중소벤처기업부 산하 스마트제조혁신추진단에서 운영하는 스마트공장 전문 교육기관입니다.',
    location: '대구 달서구',
    address: '대구광역시 달서구 성서공단로 213',
    phone: '053-580-0000',
    email: 'edu@smart-factory.kr',
    website: 'https://www.smart-factory.kr',
    established: '2019',
    totalStudents: 15000,
    totalCourses: 45,
    rating: 4.5,
    reviewCount: 890,
    certifications: ['스마트제조혁신추진단 공인', 'K-Smart Factory 인증'],
    specialties: ['스마트팩토리', 'IoT', 'MES', '빅데이터', 'AI'],
    facilities: ['스마트팩토리 시범공장', 'IoT 실습실', '데이터분석센터'],
    partnerships: ['중소벤처기업부', '산업통상자원부', '대한상공회의소'],
  },
  'busan-techno': {
    id: 'busan-techno',
    name: '부산테크노파크',
    type: '정부기관',
    description: '부산지역 산업기술 혁신과 기업 지원을 위한 기술혁신 플랫폼입니다.',
    location: '부산 강서구',
    address: '부산광역시 강서구 과학산단1로 60번길 31',
    phone: '051-974-9200',
    email: 'info@btp.or.kr',
    website: 'https://www.btp.or.kr',
    established: '2000',
    totalStudents: 8500,
    totalCourses: 32,
    rating: 4.4,
    reviewCount: 456,
    certifications: ['산업통상자원부 인정', '지역혁신기관'],
    specialties: ['반도체', '자동차부품', '기계장비', '에너지'],
    facilities: ['반도체 테스트센터', '자동차부품 시험장', '공용장비센터'],
    partnerships: ['부산광역시', '산업통상자원부', 'SK하이닉스'],
  },
  'kcomwel': {
    id: 'kcomwel',
    name: '한국산업인력공단',
    type: '정부기관',
    description: '국가기술자격 시험 및 직업능력개발 교육을 담당하는 고용노동부 산하 공공기관입니다.',
    location: '울산 중구',
    address: '울산광역시 중구 종가로 345',
    phone: '1644-8000',
    email: 'info@hrdkorea.or.kr',
    website: 'https://www.hrdkorea.or.kr',
    established: '1982',
    totalStudents: 500000,
    totalCourses: 500,
    rating: 4.3,
    reviewCount: 12500,
    certifications: ['고용노동부 산하기관', '국가기술자격 시험기관'],
    specialties: ['국가기술자격', '직업훈련', '해외취업'],
    facilities: ['자격시험장', '직업훈련시설', '해외취업지원센터'],
    partnerships: ['고용노동부', '교육부', '해외 공공기관'],
  },
  'samsung-tech': {
    id: 'samsung-tech',
    name: '삼성전자 기술교육원',
    type: '기업연수원',
    description: '삼성전자의 기술인력 양성을 위한 전문 교육기관으로, 반도체 및 디스플레이 분야 최고 수준의 교육을 제공합니다.',
    location: '경기 화성시',
    address: '경기도 화성시 삼성전자로 1',
    phone: '031-200-0000',
    email: 'tech.edu@samsung.com',
    website: 'https://www.samsung.com',
    established: '1995',
    totalStudents: 25000,
    totalCourses: 120,
    rating: 4.9,
    reviewCount: 3200,
    certifications: ['삼성 공인 교육기관', '글로벌 기술인증'],
    specialties: ['반도체', '디스플레이', '가전', '품질관리'],
    facilities: ['반도체 클린룸', '디스플레이 실습실', '첨단 장비센터'],
    partnerships: ['삼성전자', '삼성SDI', '삼성디스플레이'],
  },
  'hyundai-hrd': {
    id: 'hyundai-hrd',
    name: '현대자동차 인재개발원',
    type: '기업연수원',
    description: '현대자동차그룹의 기술인력 양성 및 역량 개발을 위한 종합 교육기관입니다.',
    location: '충남 아산시',
    address: '충청남도 아산시 인주면 현대로 700',
    phone: '041-530-0000',
    email: 'hrd@hyundai.com',
    website: 'https://www.hyundai.com',
    established: '1990',
    totalStudents: 18000,
    totalCourses: 85,
    rating: 4.8,
    reviewCount: 1890,
    certifications: ['현대차그룹 공인', '자동차 기술 인증'],
    specialties: ['자동차제조', '로봇용접', '전기차', '품질검사'],
    facilities: ['자동차 조립라인', '로봇용접센터', '전기차 실습장'],
    partnerships: ['현대자동차', '기아', '현대모비스'],
  },
}

// Get provider by ID
export function getProvider(id: string): Provider | undefined {
  return providers[id]
}

// Get all providers
export function getAllProviders(): Provider[] {
  return Object.values(providers)
}

// Get providers by type
export function getProvidersByType(type: Provider['type']): Provider[] {
  return Object.values(providers).filter((p) => p.type === type)
}

// Search providers
export function searchProviders(query: string): Provider[] {
  const normalizedQuery = query.toLowerCase().trim()
  return Object.values(providers).filter(
    (p) =>
      p.name.toLowerCase().includes(normalizedQuery) ||
      p.specialties.some((s) => s.toLowerCase().includes(normalizedQuery)) ||
      p.location.toLowerCase().includes(normalizedQuery)
  )
}

// Provider name to ID mapping for courses
export const providerNameToId: Record<string, string> = {
  '한국폴리텍대학': 'kopo',
  '스마트공장배움터': 'smart-factory',
  '부산테크노파크': 'busan-techno',
  '한국산업인력공단': 'kcomwel',
  '삼성전자 기술교육원': 'samsung-tech',
  '현대자동차 인재개발원': 'hyundai-hrd',
}
