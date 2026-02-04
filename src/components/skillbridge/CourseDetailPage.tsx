'use client'

import { useState } from 'react'
import {
  ArrowLeft, Clock, Users, Star, BookOpen, Play, CheckCircle,
  Lock, ChevronDown, ChevronUp, Download, Share2, Heart,
  MessageSquare, Award, Volume2, VolumeX
} from 'lucide-react'
import {
  SilverModeToggle,
  MOCK_USER,
  SilverModeSettings
} from './SkillBridgeComponents'

// ============================================================
// MOCK DATA FOR COURSE DETAIL
// ============================================================

export interface Lesson {
  id: string
  title: string
  duration: string
  type: 'video' | 'quiz' | 'practice' | 'reading'
  completed: boolean
  locked: boolean
}

export interface Chapter {
  id: string
  title: string
  lessons: Lesson[]
}

export interface CourseDetail {
  id: string
  title: string
  description: string
  instructor: {
    name: string
    title: string
    avatar: string
    rating: number
    students: number
  }
  thumbnail: string
  duration: string
  level: string
  rating: number
  students: number
  price: number
  progress: number
  chapters: Chapter[]
  skills: string[]
  requirements: string[]
  outcomes: string[]
}

export const MOCK_COURSE_DETAIL: CourseDetail = {
  id: 'course-1',
  title: 'TIG 용접 기초부터 실전까지',
  description: '제조 현장에서 가장 많이 사용되는 TIG 용접의 기초 이론부터 실전 기술까지 체계적으로 배웁니다. 국가기술자격증 취득에 필요한 모든 내용을 담았습니다.',
  instructor: {
    name: '김용접',
    title: '용접기능장 / 前 현대중공업 기술감독',
    avatar: '👨‍🏫',
    rating: 4.9,
    students: 2340
  },
  thumbnail: '🔥',
  duration: '24시간',
  level: '초급~중급',
  rating: 4.8,
  students: 1523,
  price: 89000,
  progress: 35,
  chapters: [
    {
      id: 'ch-1',
      title: '1장. TIG 용접 기초 이론',
      lessons: [
        { id: 'l-1-1', title: 'TIG 용접이란?', duration: '15분', type: 'video', completed: true, locked: false },
        { id: 'l-1-2', title: '용접 장비 구성과 원리', duration: '20분', type: 'video', completed: true, locked: false },
        { id: 'l-1-3', title: '안전 수칙과 보호구 착용법', duration: '12분', type: 'video', completed: true, locked: false },
        { id: 'l-1-4', title: '기초 이론 퀴즈', duration: '10분', type: 'quiz', completed: true, locked: false },
      ]
    },
    {
      id: 'ch-2',
      title: '2장. 모재와 용접봉의 이해',
      lessons: [
        { id: 'l-2-1', title: '철강 재료의 종류와 특성', duration: '25분', type: 'video', completed: true, locked: false },
        { id: 'l-2-2', title: '용접봉 선택 가이드', duration: '18분', type: 'video', completed: false, locked: false },
        { id: 'l-2-3', title: '용접 전류와 가스 설정', duration: '22분', type: 'video', completed: false, locked: false },
        { id: 'l-2-4', title: '실습: 장비 세팅하기', duration: '30분', type: 'practice', completed: false, locked: false },
      ]
    },
    {
      id: 'ch-3',
      title: '3장. 기본 용접 기술',
      lessons: [
        { id: 'l-3-1', title: '직선 비드 용접', duration: '35분', type: 'video', completed: false, locked: true },
        { id: 'l-3-2', title: '위빙 비드 용접', duration: '30분', type: 'video', completed: false, locked: true },
        { id: 'l-3-3', title: '필렛 용접 실습', duration: '45분', type: 'practice', completed: false, locked: true },
        { id: 'l-3-4', title: '기본 기술 평가', duration: '20분', type: 'quiz', completed: false, locked: true },
      ]
    },
    {
      id: 'ch-4',
      title: '4장. 고급 용접 기법',
      lessons: [
        { id: 'l-4-1', title: '다층 용접 기법', duration: '40분', type: 'video', completed: false, locked: true },
        { id: 'l-4-2', title: '파이프 용접 실습', duration: '50분', type: 'practice', completed: false, locked: true },
        { id: 'l-4-3', title: '용접 결함과 검사', duration: '25분', type: 'reading', completed: false, locked: true },
        { id: 'l-4-4', title: '최종 실기 평가', duration: '60분', type: 'practice', completed: false, locked: true },
      ]
    }
  ],
  skills: ['TIG 용접', '용접 안전', '금속 재료학', '용접 검사'],
  requirements: ['용접에 대한 기초 지식 (없어도 됨)', '실습 장비 접근 가능 (선택)', '학습 의지'],
  outcomes: [
    '용접기능사 자격증 취득 준비 완료',
    'TIG 용접의 기초부터 고급 기술까지 습득',
    '현장에서 바로 적용 가능한 실무 능력',
    '용접 품질 검사 및 결함 분석 능력'
  ]
}

// ============================================================
// READ ALOUD BUTTON COMPONENT (TTS)
// ============================================================

interface ReadAloudButtonProps {
  text: string
  className?: string
  variant?: 'icon' | 'button'
}

function ReadAloudButton({ text, className = '', variant = 'button' }: ReadAloudButtonProps) {
  const [isReading, setIsReading] = useState(false)

  const handleReadAloud = () => {
    if (isReading) {
      window.speechSynthesis.cancel()
      setIsReading(false)
      return
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ko-KR'
      utterance.rate = 0.9
      utterance.pitch = 1

      utterance.onend = () => setIsReading(false)
      utterance.onerror = () => setIsReading(false)

      window.speechSynthesis.speak(utterance)
      setIsReading(true)
    } else {
      alert('이 브라우저는 음성 읽기를 지원하지 않습니다.')
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleReadAloud}
        className={`p-2 rounded-lg transition-colors ${
          isReading
            ? 'bg-blue-100 text-blue-600'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        } ${className}`}
        title={isReading ? '읽기 중지' : '음성으로 듣기'}
      >
        {isReading ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    )
  }

  return (
    <button
      onClick={handleReadAloud}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isReading
          ? 'bg-blue-600 text-white'
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      } ${className}`}
    >
      {isReading ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      <span className="font-medium">{isReading ? '읽기 중지' : '음성으로 듣기'}</span>
    </button>
  )
}

// ============================================================
// LESSON TYPE ICONS AND COLORS
// ============================================================

const LESSON_TYPE_CONFIG: Record<string, { icon: typeof Play; color: string; label: string }> = {
  video: { icon: Play, color: 'text-blue-600 bg-blue-100', label: '동영상' },
  quiz: { icon: CheckCircle, color: 'text-purple-600 bg-purple-100', label: '퀴즈' },
  practice: { icon: BookOpen, color: 'text-emerald-600 bg-emerald-100', label: '실습' },
  reading: { icon: BookOpen, color: 'text-amber-600 bg-amber-100', label: '읽기' },
}

// ============================================================
// COURSE DETAIL PAGE
// ============================================================

export default function CourseDetailPage() {
  const [silverMode, setSilverMode] = useState<SilverModeSettings>({
    enabled: false,
    fontSize: 'normal',
    highContrast: false,
    ttsEnabled: false,
  })
  const [expandedChapters, setExpandedChapters] = useState<string[]>(['ch-1', 'ch-2'])
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleSilverToggle = (key: keyof SilverModeSettings) => {
    if (key === 'enabled') {
      setSilverMode(prev => ({
        ...prev,
        enabled: !prev.enabled,
        fontSize: !prev.enabled ? 'large' : 'normal',
        highContrast: !prev.enabled,
        ttsEnabled: !prev.enabled,
      }))
    } else if (key === 'fontSize') {
      const sizes: ('normal' | 'large' | 'xlarge')[] = ['normal', 'large', 'xlarge']
      const currentIndex = sizes.indexOf(silverMode.fontSize)
      const nextIndex = (currentIndex + 1) % sizes.length
      setSilverMode(prev => ({ ...prev, fontSize: sizes[nextIndex] }))
    } else {
      setSilverMode(prev => ({ ...prev, [key]: !prev[key] }))
    }
  }

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    )
  }

  const course = MOCK_COURSE_DETAIL
  const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0)
  const completedLessons = course.chapters.reduce(
    (sum, ch) => sum + ch.lessons.filter(l => l.completed).length, 0
  )

  return (
    <div className={`min-h-screen bg-slate-50 ${silverMode.enabled ? 'text-lg' : ''}`}>
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">뒤로</span>
            </button>
            <div className="flex items-center gap-3">
              <SilverModeToggle settings={silverMode} onToggle={handleSilverToggle} />
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-2 rounded-lg ${isWishlisted ? 'text-red-500' : 'text-slate-400'}`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <section className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Course Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                  {course.level}
                </span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                  진행중 {course.progress}%
                </span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 mb-3">{course.title}</h1>

              {/* TTS Button for Course Description */}
              <div className="flex items-start gap-3 mb-4">
                <p className="text-slate-600 flex-1">{course.description}</p>
                {silverMode.ttsEnabled && (
                  <ReadAloudButton text={course.description} variant="icon" />
                )}
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-lg">
                <span className="text-3xl">{course.instructor.avatar}</span>
                <div>
                  <p className="font-medium text-slate-900">{course.instructor.name}</p>
                  <p className="text-sm text-slate-500">{course.instructor.title}</p>
                </div>
                <div className="ml-auto text-right">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium">{course.instructor.rating}</span>
                  </div>
                  <p className="text-xs text-slate-500">수강생 {course.instructor.students.toLocaleString()}명</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students.toLocaleString()}명 수강중</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">{course.rating}</span>
                </div>
              </div>
            </div>

            {/* Course Card */}
            <div className="lg:w-80 bg-slate-50 rounded-xl p-5 border">
              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">학습 진행률</span>
                  <span className="text-sm font-bold text-blue-600">{course.progress}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {completedLessons}/{totalLessons} 레슨 완료
                </p>
              </div>

              {/* Continue Button */}
              <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-3">
                <Play className="w-5 h-5" />
                이어서 학습하기
              </button>

              <button className="w-full py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                오프라인 저장
              </button>
            </div>
          </div>
        </section>

        {/* Full Width TTS Section for Silver Mode */}
        {silverMode.ttsEnabled && (
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <Volume2 className="w-6 h-6 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-blue-900">음성 읽기 모드 활성화됨</p>
                <p className="text-sm text-blue-700">각 강의 설명 옆의 스피커 버튼을 눌러 음성으로 들을 수 있습니다.</p>
              </div>
            </div>
          </section>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Curriculum */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              커리큘럼
            </h2>

            {course.chapters.map((chapter, chapterIndex) => {
              const isExpanded = expandedChapters.includes(chapter.id)
              const chapterCompleted = chapter.lessons.filter(l => l.completed).length
              const chapterProgress = (chapterCompleted / chapter.lessons.length) * 100

              return (
                <div key={chapter.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  {/* Chapter Header */}
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      chapterProgress === 100
                        ? 'bg-emerald-100 text-emerald-700'
                        : chapterProgress > 0
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {chapterProgress === 100 ? <CheckCircle className="w-5 h-5" /> : chapterIndex + 1}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-slate-900">{chapter.title}</h3>
                      <p className="text-sm text-slate-500">
                        {chapter.lessons.length}개 레슨 · {chapterCompleted}개 완료
                      </p>
                    </div>
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${chapterProgress}%` }}
                      />
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  {/* Lessons */}
                  {isExpanded && (
                    <div className="border-t">
                      {chapter.lessons.map((lesson, lessonIndex) => {
                        const typeConfig = LESSON_TYPE_CONFIG[lesson.type]
                        const TypeIcon = typeConfig.icon

                        return (
                          <div
                            key={lesson.id}
                            className={`p-4 flex items-center gap-4 border-b last:border-b-0 ${
                              lesson.locked ? 'opacity-50' : 'hover:bg-slate-50 cursor-pointer'
                            }`}
                          >
                            {/* Lesson Status */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              lesson.completed
                                ? 'bg-emerald-100 text-emerald-600'
                                : lesson.locked
                                ? 'bg-slate-100 text-slate-400'
                                : 'bg-blue-100 text-blue-600'
                            }`}>
                              {lesson.locked ? (
                                <Lock className="w-4 h-4" />
                              ) : lesson.completed ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <span className="text-xs font-bold">{lessonIndex + 1}</span>
                              )}
                            </div>

                            {/* Lesson Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className={`font-medium ${lesson.locked ? 'text-slate-400' : 'text-slate-900'}`}>
                                  {lesson.title}
                                </h4>
                                {silverMode.ttsEnabled && !lesson.locked && (
                                  <ReadAloudButton
                                    text={`${lesson.title}. 소요 시간 ${lesson.duration}. ${typeConfig.label} 형식입니다.`}
                                    variant="icon"
                                    className="!p-1"
                                  />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 text-xs rounded ${typeConfig.color}`}>
                                  {typeConfig.label}
                                </span>
                                <span className="text-xs text-slate-500">{lesson.duration}</span>
                              </div>
                            </div>

                            {/* Action */}
                            {!lesson.locked && (
                              <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                lesson.completed
                                  ? 'bg-slate-100 text-slate-600'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}>
                                {lesson.completed ? '다시 보기' : '시작'}
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Outcomes */}
            <section className="bg-white rounded-xl shadow-sm border p-5">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                이 강의를 완료하면
              </h3>
              <ul className="space-y-3">
                {course.outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-700">{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Skills */}
            <section className="bg-white rounded-xl shadow-sm border p-5">
              <h3 className="font-semibold text-slate-900 mb-4">습득 스킬</h3>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section className="bg-white rounded-xl shadow-sm border p-5">
              <h3 className="font-semibold text-slate-900 mb-4">수강 전 준비사항</h3>
              <ul className="space-y-2">
                {course.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-slate-400">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Help */}
            <section className="bg-slate-100 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 mb-2">도움이 필요하신가요?</h3>
              <p className="text-sm text-slate-600 mb-4">
                학습 중 궁금한 점이 있으시면 Q&A 게시판이나 멘토링을 이용해보세요.
              </p>
              <button className="w-full py-2 border border-slate-300 bg-white text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                질문하기
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
