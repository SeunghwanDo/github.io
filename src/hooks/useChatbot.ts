'use client'

import { useState, useEffect, useCallback } from 'react'

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  category?: string
}

export interface ChatSession {
  id: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  title: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  keywords: string[]
}

// FAQ 데이터
const faqData: FAQ[] = [
  // 교육과정 관련
  {
    id: 'faq1',
    question: '어떤 교육과정이 있나요?',
    answer: '스킬브릿지에서는 다양한 제조업 관련 교육과정을 제공합니다:\n\n• **CNC 가공**: CNC 밀링, 선반, 프로그래밍\n• **스마트팩토리**: MES, IoT, 데이터 분석\n• **PLC/자동화**: 미쓰비시, 지멘스 PLC 프로그래밍\n• **품질관리**: SPC, 6시그마, ISO 인증\n• **용접/금속가공**: 각종 용접 기법, 판금 가공\n• **안전관리**: 산업안전, 위험성평가\n\n대시보드의 SkillBridge 메뉴에서 전체 교육과정을 확인하실 수 있습니다.',
    category: '교육과정',
    keywords: ['교육', '과정', '강의', '수업', '배우다', '종류'],
  },
  {
    id: 'faq2',
    question: '교육 비용은 얼마인가요?',
    answer: '교육 비용은 과정에 따라 다릅니다:\n\n• **무료 과정**: 정부 지원 내일배움카드 과정 (자부담 없음)\n• **일반 과정**: 20만원 ~ 100만원 (과정 기간/내용에 따라 상이)\n• **기업 위탁 교육**: 별도 협의\n\n💡 **팁**: 내일배움카드를 발급받으시면 대부분의 교육을 무료 또는 저렴하게 수강하실 수 있습니다. 마이페이지에서 내일배움카드 연동이 가능합니다.',
    category: '비용',
    keywords: ['비용', '가격', '돈', '무료', '유료', '얼마', '결제', '카드'],
  },
  {
    id: 'faq3',
    question: '교육 기간은 얼마나 되나요?',
    answer: '교육 기간은 과정마다 다양합니다:\n\n• **단기 과정**: 1~2주 (40시간 내외)\n• **중기 과정**: 1~2개월 (160~320시간)\n• **장기 과정**: 3~6개월 (480시간 이상)\n\n온라인 과정의 경우 자율 학습이 가능하며, 오프라인 과정은 정해진 일정에 맞춰 진행됩니다. 각 과정 상세 페이지에서 구체적인 기간을 확인하실 수 있습니다.',
    category: '교육과정',
    keywords: ['기간', '시간', '얼마나', '며칠', '개월', '주'],
  },
  // 수강신청 관련
  {
    id: 'faq4',
    question: '수강신청은 어떻게 하나요?',
    answer: '수강신청 방법은 간단합니다:\n\n1. **회원가입/로그인**: 우측 상단에서 로그인\n2. **과정 검색**: SkillBridge 메뉴에서 원하는 과정 찾기\n3. **상세 확인**: 과정 상세 페이지에서 일정, 비용 확인\n4. **신청하기**: "수강신청" 버튼 클릭\n5. **결제/승인**: 유료 과정은 결제, 국비 과정은 승인 대기\n\n📌 일부 인기 과정은 조기 마감될 수 있으니 서둘러 신청하세요!',
    category: '수강신청',
    keywords: ['수강', '신청', '등록', '접수', '어떻게', '방법'],
  },
  {
    id: 'faq5',
    question: '수강 취소는 어떻게 하나요?',
    answer: '수강 취소는 다음과 같이 진행됩니다:\n\n**취소 방법**:\n1. 마이페이지 → 수강 내역\n2. 취소할 과정 선택\n3. "수강 취소" 버튼 클릭\n\n**환불 정책**:\n• 교육 시작 7일 전: 전액 환불\n• 교육 시작 3일 전: 70% 환불\n• 교육 시작 후: 진도율에 따라 차등 환불\n\n국비 지원 과정의 경우 별도의 취소 절차가 필요할 수 있습니다.',
    category: '수강신청',
    keywords: ['취소', '환불', '그만', '중단', '철회'],
  },
  // 자격증/수료증 관련
  {
    id: 'faq6',
    question: '수료증은 어떻게 발급받나요?',
    answer: '수료증 발급 절차:\n\n1. **수료 조건 충족**: 출석률 80% 이상 + 과제 제출\n2. **자동 발급**: 조건 충족 시 마이페이지에 자동 등록\n3. **다운로드**: 마이페이지 → 수료증/뱃지 메뉴에서 다운로드\n\n수료증에는 교육과정명, 교육기간, 이수시간, 발급일자가 기재됩니다. 블록체인 기반 인증으로 위변조가 불가능합니다.\n\n💼 발급받은 수료증은 이력서 빌더에서 자동으로 연동됩니다!',
    category: '자격증',
    keywords: ['수료증', '수료', '증명서', '발급', '다운로드', '출력'],
  },
  {
    id: 'faq7',
    question: '뱃지는 어떻게 획득하나요?',
    answer: '뱃지는 다양한 활동을 통해 획득할 수 있습니다:\n\n**학습 뱃지**:\n• 첫 수강 완료\n• 연속 출석 달성\n• 과정 만점 달성\n\n**참여 뱃지**:\n• Q&A 첫 답변\n• 인기 답변 채택\n• 스터디 그룹 참여\n\n**특별 뱃지**:\n• 멘토 활동\n• 이달의 학습왕\n• 연간 수료왕\n\n획득한 뱃지는 마이페이지와 커뮤니티 프로필에 표시됩니다!',
    category: '자격증',
    keywords: ['뱃지', '배지', '업적', '달성', '획득'],
  },
  // 취업 연계 관련
  {
    id: 'faq8',
    question: '취업 연계는 어떻게 되나요?',
    answer: 'Biz360과 연계된 취업 지원 서비스를 제공합니다:\n\n**채용공고 매칭**:\n• 수강 이력 기반 맞춤 채용공고 추천\n• AI가 분석한 적합도 점수 제공\n\n**이력서 빌더**:\n• 수료증/자격증 자동 연동\n• 제조업 특화 이력서 템플릿\n\n**기업 직접 연결**:\n• 교육기관 협력 기업 취업 연계\n• 인턴십/실습 프로그램 연결\n\n채용공고 메뉴에서 나에게 맞는 일자리를 찾아보세요!',
    category: '취업',
    keywords: ['취업', '채용', '일자리', '구직', '이직', '연계', '매칭'],
  },
  // 기술 지원 관련
  {
    id: 'faq9',
    question: '영상이 재생되지 않아요',
    answer: '영상 재생 문제 해결 방법:\n\n**1. 기본 확인**\n• 인터넷 연결 상태 확인\n• 브라우저 새로고침 (Ctrl+F5)\n• 다른 브라우저에서 시도\n\n**2. 브라우저 설정**\n• 캐시 및 쿠키 삭제\n• 하드웨어 가속 비활성화\n• 광고 차단 프로그램 해제\n\n**3. 권장 환경**\n• Chrome, Edge, Safari 최신 버전\n• 최소 인터넷 속도: 5Mbps 이상\n\n계속 문제가 있으시면 고객센터(1588-0000)로 연락해주세요.',
    category: '기술지원',
    keywords: ['영상', '동영상', '재생', '안됨', '오류', '에러', '버퍼링'],
  },
  {
    id: 'faq10',
    question: '비밀번호를 잊어버렸어요',
    answer: '비밀번호 재설정 방법:\n\n1. 로그인 페이지에서 "비밀번호 찾기" 클릭\n2. 가입 시 사용한 이메일 주소 입력\n3. 이메일로 전송된 재설정 링크 클릭\n4. 새 비밀번호 설정\n\n⚠️ **주의사항**:\n• 재설정 링크는 24시간 동안 유효합니다\n• 스팸함도 확인해주세요\n• 이메일이 오지 않으면 고객센터로 문의\n\nBiz360 SSO 계정으로 로그인하신 경우, Biz360에서 비밀번호를 변경하셔야 합니다.',
    category: '계정',
    keywords: ['비밀번호', '암호', '잊어', '분실', '찾기', '재설정', '로그인'],
  },
  // 스마트팩토리 관련
  {
    id: 'faq11',
    question: '스마트팩토리 교육 추천해주세요',
    answer: '경력과 목표에 따른 스마트팩토리 교육 추천:\n\n**입문자 (경력 0~2년)**:\n• 스마트팩토리 개론 (40시간)\n• IoT 센서 기초 (60시간)\n\n**실무자 (경력 3~5년)**:\n• MES 시스템 운영 (80시간)\n• 데이터 수집/분석 실무 (100시간)\n\n**관리자/전문가 (경력 5년+)**:\n• 스마트팩토리 구축 실무 (160시간)\n• 제조 AI/빅데이터 활용 (120시간)\n\n💡 AI 추천 기능을 이용하시면 더 정확한 맞춤 추천을 받으실 수 있습니다!',
    category: '교육과정',
    keywords: ['스마트팩토리', '스마트', '공장', '4차', '추천', 'MES', 'IoT'],
  },
  // 멘토링 관련
  {
    id: 'faq12',
    question: '멘토링 서비스가 뭔가요?',
    answer: '멘토링 서비스는 현업 전문가와 1:1로 상담받을 수 있는 서비스입니다:\n\n**멘토링 내용**:\n• 진로/커리어 상담\n• 기술 질의응답\n• 취업/이직 조언\n• 학습 로드맵 설계\n\n**신청 방법**:\n1. 커뮤니티 → 멘토링 메뉴\n2. 원하는 멘토 프로필 확인\n3. 가능한 시간대 선택\n4. 상담 주제 작성 후 신청\n\n**비용**: 무료~유료 (멘토별 상이)\n\n매칭된 멘토와 화상 또는 채팅으로 상담이 진행됩니다.',
    category: '커뮤니티',
    keywords: ['멘토', '멘토링', '상담', '조언', '선배', '전문가'],
  },
]

// 카테고리별 추천 질문
const suggestedQuestions = {
  '교육과정': ['어떤 교육과정이 있나요?', '교육 기간은 얼마나 되나요?', '스마트팩토리 교육 추천해주세요'],
  '비용': ['교육 비용은 얼마인가요?', '국비 지원 과정이 있나요?'],
  '수강신청': ['수강신청은 어떻게 하나요?', '수강 취소는 어떻게 하나요?'],
  '자격증': ['수료증은 어떻게 발급받나요?', '뱃지는 어떻게 획득하나요?'],
  '취업': ['취업 연계는 어떻게 되나요?', '이력서는 어떻게 작성하나요?'],
  '기술지원': ['영상이 재생되지 않아요', '비밀번호를 잊어버렸어요'],
  '커뮤니티': ['멘토링 서비스가 뭔가요?', '스터디 그룹은 어떻게 참여하나요?'],
}

// AI 응답 생성 함수 (FAQ 기반)
function generateResponse(userMessage: string): { content: string; category?: string } {
  const lowerMessage = userMessage.toLowerCase()

  // FAQ에서 키워드 매칭
  let bestMatch: FAQ | null = null
  let maxScore = 0

  for (const faq of faqData) {
    let score = 0
    for (const keyword of faq.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        score += 1
      }
    }
    // 질문과의 유사도도 체크
    if (lowerMessage.includes(faq.question.substring(0, 10).toLowerCase())) {
      score += 2
    }
    if (score > maxScore) {
      maxScore = score
      bestMatch = faq
    }
  }

  // 매칭된 FAQ가 있으면 해당 답변 반환
  if (bestMatch && maxScore >= 1) {
    return {
      content: bestMatch.answer,
      category: bestMatch.category,
    }
  }

  // 인사말 처리
  const greetings = ['안녕', '반가워', '하이', 'hello', 'hi', '처음']
  if (greetings.some(g => lowerMessage.includes(g))) {
    return {
      content: '안녕하세요! 스킬브릿지 AI 상담사입니다. 🤖\n\n제조업 교육, 수강신청, 자격증, 취업 연계 등에 대해 궁금한 점을 물어보세요!\n\n**자주 묻는 질문**:\n• 어떤 교육과정이 있나요?\n• 교육 비용은 얼마인가요?\n• 수강신청은 어떻게 하나요?\n• 취업 연계는 어떻게 되나요?',
      category: '인사',
    }
  }

  // 감사 인사 처리
  const thanks = ['감사', '고마워', '땡큐', 'thank', '수고']
  if (thanks.some(t => lowerMessage.includes(t))) {
    return {
      content: '도움이 되셨다니 기쁩니다! 😊\n\n추가로 궁금한 점이 있으시면 언제든 물어보세요. 좋은 학습 되세요!',
      category: '인사',
    }
  }

  // 기본 응답
  return {
    content: '죄송합니다, 해당 질문에 대한 정확한 답변을 찾지 못했습니다. 🤔\n\n다음 중 궁금하신 내용이 있으신가요?\n\n• **교육과정**: 과정 종류, 기간, 비용\n• **수강신청**: 신청 방법, 취소/환불\n• **자격증**: 수료증, 뱃지 발급\n• **취업**: 채용 연계, 이력서 작성\n• **기술지원**: 영상 재생, 로그인 문제\n\n또는 고객센터(1588-0000)로 문의해주시면 더 자세한 안내를 받으실 수 있습니다.',
    category: undefined,
  }
}

export function useChatbot() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // 초기 로드
  useEffect(() => {
    const savedSessions = localStorage.getItem('skillbridge_chat_sessions')
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions)
      setSessions(parsed)
      // 가장 최근 세션 불러오기
      if (parsed.length > 0) {
        setCurrentSession(parsed[parsed.length - 1])
      }
    }
  }, [])

  // 세션 저장
  const saveSessions = useCallback((updatedSessions: ChatSession[]) => {
    localStorage.setItem('skillbridge_chat_sessions', JSON.stringify(updatedSessions))
    setSessions(updatedSessions)
  }, [])

  // 새 세션 시작
  const startNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      messages: [{
        id: `msg_${Date.now()}`,
        content: '안녕하세요! 스킬브릿지 AI 상담사입니다. 🤖\n\n제조업 교육, 수강신청, 자격증, 취업 연계 등에 대해 궁금한 점을 물어보세요!\n\n무엇을 도와드릴까요?',
        role: 'assistant',
        timestamp: new Date(),
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '새 대화',
    }
    const updated = [...sessions, newSession]
    saveSessions(updated)
    setCurrentSession(newSession)
    return newSession
  }, [sessions, saveSessions])

  // 메시지 전송
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    let session = currentSession
    if (!session) {
      session = startNewSession()
    }

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date(),
    }

    const updatedMessages = [...session.messages, userMessage]
    const updatedSession = {
      ...session,
      messages: updatedMessages,
      updatedAt: new Date(),
      title: session.messages.length === 1 ? content.slice(0, 30) + '...' : session.title,
    }

    // 세션 업데이트
    const updatedSessions = sessions.map(s => s.id === session!.id ? updatedSession : s)
    if (!sessions.find(s => s.id === session!.id)) {
      updatedSessions.push(updatedSession)
    }
    saveSessions(updatedSessions)
    setCurrentSession(updatedSession)

    // AI 응답 생성 (타이핑 효과)
    setIsTyping(true)

    // 실제 API 호출 대신 로컬 응답 생성
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

    const response = generateResponse(content)

    const assistantMessage: Message = {
      id: `msg_${Date.now()}`,
      content: response.content,
      role: 'assistant',
      timestamp: new Date(),
      category: response.category,
    }

    const finalMessages = [...updatedMessages, assistantMessage]
    const finalSession = {
      ...updatedSession,
      messages: finalMessages,
      updatedAt: new Date(),
    }

    const finalSessions = updatedSessions.map(s => s.id === session!.id ? finalSession : s)
    saveSessions(finalSessions)
    setCurrentSession(finalSession)
    setIsTyping(false)

    return assistantMessage
  }, [currentSession, sessions, startNewSession, saveSessions])

  // 세션 선택
  const selectSession = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSession(session)
    }
  }, [sessions])

  // 세션 삭제
  const deleteSession = useCallback((sessionId: string) => {
    const updated = sessions.filter(s => s.id !== sessionId)
    saveSessions(updated)
    if (currentSession?.id === sessionId) {
      setCurrentSession(updated.length > 0 ? updated[updated.length - 1] : null)
    }
  }, [sessions, currentSession, saveSessions])

  // 추천 질문
  const getSuggestedQuestions = useCallback((category?: string) => {
    if (category && suggestedQuestions[category as keyof typeof suggestedQuestions]) {
      return suggestedQuestions[category as keyof typeof suggestedQuestions]
    }
    // 랜덤 추천
    const allQuestions = Object.values(suggestedQuestions).flat()
    return allQuestions.sort(() => Math.random() - 0.5).slice(0, 4)
  }, [])

  return {
    sessions,
    currentSession,
    isTyping,
    isOpen,
    setIsOpen,
    sendMessage,
    startNewSession,
    selectSession,
    deleteSession,
    getSuggestedQuestions,
  }
}
