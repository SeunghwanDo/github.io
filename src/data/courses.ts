// 교육 과정 Mock 데이터
export interface Course {
  id: string
  title: string
  provider_name: string
  category: string
  duration: string
  cost: string
  location: string
  start_date: string
  end_date: string
  status: 'recruiting' | 'upcoming' | 'ongoing' | 'closed'
  deadline: string
  rating: number
  reviews: number
  students: number
  capacity: number
  enrolled: number
  thumbnail_url: string | null
  description: string
  highlights: string[]
  curriculum: { week: string; title: string; topics: string[] }[]
  instructor: {
    name: string
    title: string
    experience: string
    certifications: string[]
  }
  requirements: string[]
  benefits: string[]
  contact: {
    phone: string
    email: string
    website: string
  }
  // 뱃지/수료증 관련
  badge?: {
    name: string
    icon: string
    color: string
  }
}

export const courses: Record<string, Course> = {
  '1': {
    id: '1',
    title: '아크 용접 기능사 자격증 취득반',
    provider_name: '한국폴리텍대학',
    category: '용접',
    duration: '3개월 (120시간)',
    cost: '무료 (국비지원)',
    location: '부산 사상구 학감대로 316',
    start_date: '2024-02-15',
    end_date: '2024-05-15',
    status: 'recruiting',
    deadline: '2024-02-10',
    rating: 4.8,
    reviews: 127,
    students: 324,
    capacity: 30,
    enrolled: 22,
    thumbnail_url: null,
    description: 'CO2 용접 및 아크 용접의 기초부터 실기 시험 대비까지 체계적으로 학습합니다.',
    highlights: ['국비 100% 지원', '실기 위주 교육', '자격증 취득률 92%', '취업 연계'],
    curriculum: [
      { week: '1-2주차', title: '용접 기초 이론', topics: ['용접의 원리', '안전 수칙', '용접 재료'] },
      { week: '3-4주차', title: '아크 용접 기초', topics: ['용접기 조작', '비드 쌓기', '수평 필릿'] },
      { week: '5-8주차', title: '아크 용접 심화', topics: ['수직 용접', '위보기 용접', '다양한 자세'] },
      { week: '9-10주차', title: 'CO2 용접', topics: ['반자동 용접기', 'CO2 용접 실습', '품질 검사'] },
      { week: '11-12주차', title: '실기 시험 대비', topics: ['모의 시험', '취약점 보완', '시험 팁'] },
    ],
    instructor: {
      name: '김용접',
      title: '용접 기능장',
      experience: '25년 현장 경력',
      certifications: ['용접기능장', '특수용접기능사', '직업훈련교사'],
    },
    requirements: ['만 18세 이상', '내일배움카드 소지자', '고졸 이상'],
    benefits: ['훈련 수당 지급', '교재 무료', '자격증 응시료 지원', '취업 연계'],
    contact: { phone: '051-123-4567', email: 'welding@kopo.ac.kr', website: 'https://www.kopo.ac.kr' },
    badge: { name: '용접 마스터', icon: '🔥', color: 'orange' },
  },
  '2': {
    id: '2',
    title: '산업안전기사 실기 완성반',
    provider_name: '부산안전교육원',
    category: '안전',
    duration: '2개월 (80시간)',
    cost: '450,000원',
    location: '부산 해운대구 센텀중앙로 48',
    start_date: '2024-03-01',
    end_date: '2024-04-30',
    status: 'recruiting',
    deadline: '2024-02-25',
    rating: 4.6,
    reviews: 89,
    students: 256,
    capacity: 25,
    enrolled: 18,
    thumbnail_url: null,
    description: '산업안전기사 실기 시험을 완벽 대비하는 집중 과정입니다.',
    highlights: ['합격률 85%', '현직 안전관리자 강의', '실무 사례 중심', '모의시험 3회'],
    curriculum: [
      { week: '1-2주차', title: '안전관리 계획', topics: ['위험성 평가', '안전보건계획', '법규 이해'] },
      { week: '3-4주차', title: '기계/전기 안전', topics: ['기계 방호장치', '전기 안전', '화재 예방'] },
      { week: '5-6주차', title: '화학물질 관리', topics: ['MSDS', '유해물질 취급', '보호구 관리'] },
      { week: '7-8주차', title: '실기 대비', topics: ['작업형 실습', '필답형 대비', '모의시험'] },
    ],
    instructor: {
      name: '박안전',
      title: '산업안전기사',
      experience: '20년 안전관리 경력',
      certifications: ['산업안전기사', '건설안전기사', 'ISO 45001 심사원'],
    },
    requirements: ['관련 학과 졸업자', '실무경력 2년 이상'],
    benefits: ['교재 제공', '온라인 복습 자료', '합격 시 수강료 환급'],
    contact: { phone: '051-234-5678', email: 'safety@bsafe.kr', website: 'https://www.bsafe.kr' },
    badge: { name: '안전 전문가', icon: '🛡️', color: 'green' },
  },
  '3': {
    id: '3',
    title: '품질관리(QC) 전문가 양성과정',
    provider_name: '부산품질혁신센터',
    category: '품질',
    duration: '1개월 (40시간)',
    cost: '무료 (국비지원)',
    location: '부산 남구 신선로 428',
    start_date: '2024-02-20',
    end_date: '2024-03-20',
    status: 'recruiting',
    deadline: '2024-02-15',
    rating: 4.7,
    reviews: 64,
    students: 189,
    capacity: 20,
    enrolled: 15,
    thumbnail_url: null,
    description: '제조업 품질관리의 핵심 역량을 체계적으로 학습합니다.',
    highlights: ['SPC 실습', 'ISO 9001 이해', '6시그마 기초', '현장 실습'],
    curriculum: [
      { week: '1주차', title: '품질관리 기초', topics: ['품질의 정의', 'QC 7도구', '샘플링 검사'] },
      { week: '2주차', title: '통계적 품질관리', topics: ['SPC', '관리도', '공정능력'] },
      { week: '3주차', title: '품질시스템', topics: ['ISO 9001', '품질매뉴얼', '내부심사'] },
      { week: '4주차', title: '실무 적용', topics: ['현장 실습', '개선 프로젝트', '발표'] },
    ],
    instructor: {
      name: '이품질',
      title: '품질경영기사',
      experience: '18년 품질관리 경력',
      certifications: ['품질경영기사', '6시그마 MBB', 'ISO 9001 선임심사원'],
    },
    requirements: ['제조업 종사자', '품질관리 관심자'],
    benefits: ['Minitab 실습', '수료증 발급', '취업 추천'],
    contact: { phone: '051-345-6789', email: 'qc@bqic.kr', website: 'https://www.bqic.kr' },
    badge: { name: '품질 전문가', icon: '✓', color: 'blue' },
  },
  '4': {
    id: '4',
    title: 'PLC 자동화 시스템 실무',
    provider_name: '스마트공장혁신센터',
    category: '자동화',
    duration: '2개월 (100시간)',
    cost: '무료 (국비지원)',
    location: '창원 성산구 중앙대로 166',
    start_date: '2024-03-05',
    end_date: '2024-05-05',
    status: 'upcoming',
    deadline: '2024-02-28',
    rating: 4.9,
    reviews: 156,
    students: 412,
    capacity: 15,
    enrolled: 12,
    thumbnail_url: null,
    description: 'Siemens, Mitsubishi PLC를 활용한 자동화 시스템 구축 실무를 학습합니다.',
    highlights: ['실장비 실습', '프로젝트 기반', '취업률 90%', '기업 연계'],
    curriculum: [
      { week: '1-2주차', title: 'PLC 기초', topics: ['PLC 구조', '입출력 모듈', '기본 명령어'] },
      { week: '3-4주차', title: '래더 프로그래밍', topics: ['타이머/카운터', '데이터 처리', '프로그램 설계'] },
      { week: '5-6주차', title: 'HMI 연동', topics: ['HMI 화면 설계', 'PLC 통신', '데이터 모니터링'] },
      { week: '7-8주차', title: '프로젝트', topics: ['자동화 라인 구축', '문제 해결', '발표 평가'] },
    ],
    instructor: {
      name: '정자동',
      title: '자동화 시스템 전문가',
      experience: '22년 자동화 설계 경력',
      certifications: ['전기기사', 'Siemens 공인강사', 'Mitsubishi 공인강사'],
    },
    requirements: ['전기/전자 기초 지식', '컴퓨터 활용 능력'],
    benefits: ['최신 장비 실습', '프로젝트 포트폴리오', '협력사 취업 연계'],
    contact: { phone: '055-456-7890', email: 'auto@sfic.kr', website: 'https://www.sfic.kr' },
    badge: { name: '자동화 마스터', icon: '⚙️', color: 'purple' },
  },
  '5': {
    id: '5',
    title: '지게차 운전 기능사 취득반',
    provider_name: '부산직업전문학교',
    category: '안전',
    duration: '2주 (40시간)',
    cost: '무료 (국비지원)',
    location: '부산 강서구 명지국제로 234',
    start_date: '2024-02-19',
    end_date: '2024-03-01',
    status: 'recruiting',
    deadline: '2024-02-14',
    rating: 4.5,
    reviews: 234,
    students: 567,
    capacity: 20,
    enrolled: 20,
    thumbnail_url: null,
    description: '지게차 운전 기능사 자격증을 2주 만에 취득할 수 있는 집중 과정입니다.',
    highlights: ['2주 집중 과정', '합격률 95%', '실기 위주', '즉시 취업 가능'],
    curriculum: [
      { week: '1주차', title: '이론 및 기초 실습', topics: ['안전 수칙', '장비 점검', '기초 조작'] },
      { week: '2주차', title: '실기 집중 훈련', topics: ['화물 적재', '코스 주행', '실기 시험 대비'] },
    ],
    instructor: {
      name: '최운전',
      title: '지게차 운전 기능장',
      experience: '15년 강의 경력',
      certifications: ['지게차운전기능사', '건설기계조종사', '직업훈련교사'],
    },
    requirements: ['만 18세 이상', '운전면허 소지자 우대'],
    benefits: ['실기 시험장 동일', '재시험 시 무료 재수강', '취업 알선'],
    contact: { phone: '051-567-8901', email: 'forklift@bjob.kr', website: 'https://www.bjob.kr' },
    badge: { name: '물류 전문가', icon: '🚜', color: 'amber' },
  },
  '6': {
    id: '6',
    title: '스마트 센서 및 IoT 기초',
    provider_name: '부산IoT혁신센터',
    category: '자동화',
    duration: '1개월 (60시간)',
    cost: '200,000원',
    location: '부산 해운대구 센텀서로 41',
    start_date: '2024-03-10',
    end_date: '2024-04-10',
    status: 'upcoming',
    deadline: '2024-03-05',
    rating: 4.4,
    reviews: 45,
    students: 123,
    capacity: 25,
    enrolled: 8,
    thumbnail_url: null,
    description: '스마트 팩토리의 핵심인 센서와 IoT 기술을 실습 위주로 학습합니다.',
    highlights: ['Arduino/Raspberry Pi', '클라우드 연동', '실시간 모니터링', '프로젝트 결과물'],
    curriculum: [
      { week: '1주차', title: '센서 기초', topics: ['센서 종류', '신호 처리', '회로 구성'] },
      { week: '2주차', title: 'Arduino 실습', topics: ['프로그래밍', '센서 연동', '데이터 수집'] },
      { week: '3주차', title: 'IoT 플랫폼', topics: ['WiFi 통신', '클라우드 연동', '대시보드'] },
      { week: '4주차', title: '프로젝트', topics: ['스마트 모니터링 시스템', '발표', '피드백'] },
    ],
    instructor: {
      name: '한스마트',
      title: 'IoT 전문가',
      experience: '10년 스마트팩토리 구축 경력',
      certifications: ['정보처리기사', 'AWS IoT 전문가', 'Azure IoT 인증'],
    },
    requirements: ['프로그래밍 기초 지식', '노트북 지참'],
    benefits: ['Arduino 키트 제공', '온라인 자료 평생 이용', '수료증 발급'],
    contact: { phone: '051-678-9012', email: 'iot@biot.kr', website: 'https://www.biot.kr' },
    badge: { name: 'IoT 스페셜리스트', icon: '📡', color: 'cyan' },
  },
  '7': {
    id: '7',
    title: 'TIG 용접 전문가 과정',
    provider_name: '한국폴리텍대학',
    category: '용접',
    duration: '4개월 (160시간)',
    cost: '무료 (국비지원)',
    location: '부산 사상구 학감대로 316',
    start_date: '2024-04-01',
    end_date: '2024-07-31',
    status: 'upcoming',
    deadline: '2024-03-25',
    rating: 4.9,
    reviews: 98,
    students: 245,
    capacity: 15,
    enrolled: 5,
    thumbnail_url: null,
    description: '스테인리스, 알루미늄 등 특수 소재 TIG 용접 전문 과정입니다.',
    highlights: ['특수 소재 전문', '고급 기술 습득', '월 100만원 이상 가능', '조선소 취업 연계'],
    curriculum: [
      { week: '1-4주차', title: 'TIG 용접 기초', topics: ['장비 이해', '텅스텐 선정', '기본 비드'] },
      { week: '5-8주차', title: '스테인리스 용접', topics: ['SUS 재질', '용접봉 선택', '열관리'] },
      { week: '9-12주차', title: '알루미늄 용접', topics: ['AL 특성', 'AC/DC 설정', '용접 기법'] },
      { week: '13-16주차', title: '실기 및 자격', topics: ['압력용기', '배관 용접', '자격 시험'] },
    ],
    instructor: {
      name: '김용접',
      title: '용접 기능장',
      experience: '25년 현장 경력',
      certifications: ['용접기능장', '특수용접기능사', '직업훈련교사'],
    },
    requirements: ['아크용접 경험자', '내일배움카드'],
    benefits: ['고급 장비 실습', '조선소 취업 연계', '월 300만원+ 가능'],
    contact: { phone: '051-123-4567', email: 'welding@kopo.ac.kr', website: 'https://www.kopo.ac.kr' },
    badge: { name: 'TIG 마스터', icon: '⚡', color: 'violet' },
  },
  '8': {
    id: '8',
    title: '비파괴검사(UT) 기술자 양성',
    provider_name: '한국비파괴검사센터',
    category: '품질',
    duration: '3개월 (120시간)',
    cost: '1,200,000원',
    location: '울산 남구 산업로 915',
    start_date: '2024-03-15',
    end_date: '2024-06-15',
    status: 'recruiting',
    deadline: '2024-03-10',
    rating: 4.7,
    reviews: 72,
    students: 198,
    capacity: 12,
    enrolled: 9,
    thumbnail_url: null,
    description: '초음파 비파괴검사(UT) Level 2 자격 취득을 위한 전문 과정입니다.',
    highlights: ['ASNT Level 2', '현장 실습', '고연봉 직종', '조선/플랜트 취업'],
    curriculum: [
      { week: '1-4주차', title: 'UT 이론', topics: ['초음파 원리', '탐촉자', '결함 종류'] },
      { week: '5-8주차', title: '장비 실습', topics: ['탐상기 조작', '교정 방법', '탐상 기법'] },
      { week: '9-12주차', title: '현장 적용', topics: ['용접부 검사', '보고서 작성', '자격 시험'] },
    ],
    instructor: {
      name: '손검사',
      title: 'NDT Level 3',
      experience: '20년 비파괴검사 경력',
      certifications: ['ASNT Level 3 (UT, RT, MT, PT)', 'KS 인증심사원'],
    },
    requirements: ['고졸 이상', '색맹/색약 아닌 자'],
    benefits: ['ASNT 자격 취득', '취업 연계 100%', '고연봉 보장'],
    contact: { phone: '052-789-0123', email: 'ndt@kndt.kr', website: 'https://www.kndt.kr' },
    badge: { name: 'NDT 전문가', icon: '🔍', color: 'indigo' },
  },
  '9': {
    id: '9',
    title: '로봇 용접 운용 기술',
    provider_name: '스마트공장혁신센터',
    category: '자동화',
    duration: '2개월 (80시간)',
    cost: '무료 (국비지원)',
    location: '창원 성산구 중앙대로 166',
    start_date: '2024-04-15',
    end_date: '2024-06-15',
    status: 'upcoming',
    deadline: '2024-04-10',
    rating: 4.8,
    reviews: 67,
    students: 156,
    capacity: 10,
    enrolled: 3,
    thumbnail_url: null,
    description: '산업용 로봇을 활용한 자동 용접 시스템 운용 기술을 학습합니다.',
    highlights: ['FANUC/KUKA 실습', '티칭 펜던트', '용접 조건 설정', '트러블슈팅'],
    curriculum: [
      { week: '1-2주차', title: '로봇 기초', topics: ['좌표계', '동작 명령', '안전 수칙'] },
      { week: '3-4주차', title: '용접 로봇', topics: ['용접 조건', '위빙 패턴', '프로그램 작성'] },
      { week: '5-6주차', title: '현장 적용', topics: ['지그 설계', '품질 관리', '문제 해결'] },
      { week: '7-8주차', title: '프로젝트', topics: ['자동화 라인 구축', '최적화', '발표'] },
    ],
    instructor: {
      name: '정자동',
      title: '자동화 시스템 전문가',
      experience: '22년 자동화 설계 경력',
      certifications: ['FANUC 공인강사', 'KUKA 공인강사', '용접기능장'],
    },
    requirements: ['용접 경험자', 'PLC 기초 지식 우대'],
    benefits: ['최신 로봇 실습', '자동차 부품사 취업 연계', '높은 연봉'],
    contact: { phone: '055-456-7890', email: 'robot@sfic.kr', website: 'https://www.sfic.kr' },
    badge: { name: '로봇 오퍼레이터', icon: '🤖', color: 'rose' },
  },
  '10': {
    id: '10',
    title: '전기기사 실기 집중반',
    provider_name: '부산전기기술교육원',
    category: '안전',
    duration: '1개월 (60시간)',
    cost: '550,000원',
    location: '부산 사하구 낙동대로 550',
    start_date: '2024-02-26',
    end_date: '2024-03-26',
    status: 'recruiting',
    deadline: '2024-02-21',
    rating: 4.6,
    reviews: 143,
    students: 389,
    capacity: 20,
    enrolled: 17,
    thumbnail_url: null,
    description: '전기기사 실기 시험 대비를 위한 집중 과정입니다.',
    highlights: ['작업형 집중', '합격률 80%', '모의시험 5회', '개인별 피드백'],
    curriculum: [
      { week: '1주차', title: '시퀀스 제어', topics: ['릴레이 회로', 'PLC 기초', '타이머'] },
      { week: '2주차', title: '배선 작업', topics: ['전선 선정', '단자 작업', '결선 도면'] },
      { week: '3주차', title: '모터 제어', topics: ['기동 회로', '정역 회로', '인버터'] },
      { week: '4주차', title: '실기 대비', topics: ['모의시험', '취약점 보완', '시험 팁'] },
    ],
    instructor: {
      name: '강전기',
      title: '전기기능장',
      experience: '25년 전기공사 경력',
      certifications: ['전기기능장', '전기공사기사', '소방설비기사(전기)'],
    },
    requirements: ['전기기사 필기 합격자'],
    benefits: ['개인 실습 부스', '불합격 시 재수강', '온라인 복습'],
    contact: { phone: '051-890-1234', email: 'electric@bete.kr', website: 'https://www.bete.kr' },
    badge: { name: '전기 마스터', icon: '⚡', color: 'yellow' },
  },
  '11': {
    id: '11',
    title: 'CAD/CAM 설계 실무',
    provider_name: '부산기계공업고등학교 평생교육원',
    category: '자동화',
    duration: '3개월 (150시간)',
    cost: '무료 (국비지원)',
    location: '부산 사상구 백양대로 567',
    start_date: '2024-03-04',
    end_date: '2024-06-04',
    status: 'recruiting',
    deadline: '2024-02-28',
    rating: 4.5,
    reviews: 88,
    students: 234,
    capacity: 20,
    enrolled: 14,
    thumbnail_url: null,
    description: 'AutoCAD, SolidWorks를 활용한 기계설계 및 CAM 가공 실무를 학습합니다.',
    highlights: ['AutoCAD 2D', 'SolidWorks 3D', 'MasterCAM', '포트폴리오 완성'],
    curriculum: [
      { week: '1-4주차', title: 'AutoCAD 2D', topics: ['기본 명령', '도면 작성', '치수 기입'] },
      { week: '5-8주차', title: 'SolidWorks 3D', topics: ['스케치', '피처', '어셈블리'] },
      { week: '9-12주차', title: 'CAM 가공', topics: ['MasterCAM', '공구 경로', 'G-code'] },
    ],
    instructor: {
      name: '설계사',
      title: '기계설계기사',
      experience: '18년 설계 경력',
      certifications: ['기계설계기사', 'CSWA', 'AutoCAD 공인강사'],
    },
    requirements: ['컴퓨터 기초', '기계공학 관심자'],
    benefits: ['정품 소프트웨어', '포트폴리오 제작', '설계 회사 취업 연계'],
    contact: { phone: '051-901-2345', email: 'cad@bmth.kr', website: 'https://www.bmth.kr' },
    badge: { name: 'CAD 디자이너', icon: '📐', color: 'teal' },
  },
  '12': {
    id: '12',
    title: '산업안전보건 관리감독자 교육',
    provider_name: '한국산업안전교육원',
    category: '안전',
    duration: '2일 (16시간)',
    cost: '무료 (법정의무교육)',
    location: '부산 부산진구 중앙대로 749',
    start_date: '2024-02-22',
    end_date: '2024-02-23',
    status: 'recruiting',
    deadline: '2024-02-20',
    rating: 4.3,
    reviews: 312,
    students: 1245,
    capacity: 50,
    enrolled: 35,
    thumbnail_url: null,
    description: '산업안전보건법에 따른 관리감독자 법정 의무교육입니다.',
    highlights: ['법정 의무교육', '2일 완성', '수료증 즉시 발급', '온라인 가능'],
    curriculum: [
      { week: '1일차', title: '안전관리', topics: ['산안법 개정', '위험성 평가', '안전보건관리'] },
      { week: '2일차', title: '보건관리', topics: ['작업환경관리', '건강진단', '사고 사례'] },
    ],
    instructor: {
      name: '안전사',
      title: '산업안전지도사',
      experience: '15년 안전관리 경력',
      certifications: ['산업안전지도사', '건설안전기사', '인간공학기사'],
    },
    requirements: ['관리감독자 직위자', '사업주 지정자'],
    benefits: ['법적 의무 충족', '수료증 발급', '재해 예방'],
    contact: { phone: '051-012-3456', email: 'safety@kosha-edu.kr', website: 'https://www.kosha-edu.kr' },
    badge: { name: '안전 리더', icon: '🦺', color: 'lime' },
  },
}

// 카테고리별 과정 필터
export function getCoursesByCategory(category: string): Course[] {
  if (category === 'all') return Object.values(courses)
  return Object.values(courses).filter((course) => course.category === category)
}

// 검색
export function searchCourses(query: string): Course[] {
  const lowercaseQuery = query.toLowerCase()
  return Object.values(courses).filter(
    (course) =>
      course.title.toLowerCase().includes(lowercaseQuery) ||
      course.provider_name.toLowerCase().includes(lowercaseQuery) ||
      course.category.toLowerCase().includes(lowercaseQuery) ||
      course.description.toLowerCase().includes(lowercaseQuery)
  )
}

// 상태별 필터
export function getCoursesByStatus(status: Course['status']): Course[] {
  return Object.values(courses).filter((course) => course.status === status)
}

// 인기 과정 (리뷰 수 기준)
export function getPopularCourses(limit: number = 5): Course[] {
  return Object.values(courses)
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, limit)
}

// 추천 과정 (평점 기준)
export function getRecommendedCourses(limit: number = 5): Course[] {
  return Object.values(courses)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}
