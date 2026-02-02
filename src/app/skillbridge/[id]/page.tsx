'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Clock,
  MapPin,
  Users,
  Star,
  Calendar,
  CheckCircle2,
  Play,
  Award,
  Zap,
  BookOpen,
  Target,
  Building2,
  Phone,
  Mail,
  Share2,
  Heart,
  Download,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'

// Mock Course Data
const courseData = {
  '1': {
    id: '1',
    title: '아크 용접 기능사 자격증 취득반',
    provider_name: '한국폴리텍대학',
    provider_logo: '/images/provider-polyt.png',
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
    thumbnail_url: '/images/welding.jpg',
    description:
      'CO2 용접 및 아크 용접의 기초부터 실기 시험 대비까지 체계적으로 학습합니다. 국가기술자격증 취득을 목표로 하며, 수료 후 취업 연계 프로그램을 제공합니다.',
    highlights: [
      '국비 100% 지원 (내일배움카드 필수)',
      '실기 위주의 현장 중심 교육',
      '자격증 취득률 92%',
      '수료 후 취업 연계 지원',
    ],
    curriculum: [
      {
        week: '1-2주차',
        title: '용접 기초 이론',
        topics: ['용접의 원리와 종류', '안전 수칙 및 보호구 착용', '용접 재료의 이해'],
      },
      {
        week: '3-4주차',
        title: '아크 용접 기초 실습',
        topics: ['용접기 조작법', '비드 쌓기 연습', '수평 필릿 용접'],
      },
      {
        week: '5-8주차',
        title: '아크 용접 심화',
        topics: ['수직 용접', '위보기 용접', '다양한 자세 연습'],
      },
      {
        week: '9-10주차',
        title: 'CO2 용접 실습',
        topics: ['반자동 용접기 조작', 'CO2 용접 실습', '용접부 품질 검사'],
      },
      {
        week: '11-12주차',
        title: '실기 시험 대비',
        topics: ['모의 실기 시험', '취약점 보완 훈련', '시험 팁 및 주의사항'],
      },
    ],
    instructor: {
      name: '김용접',
      title: '용접 기능장',
      experience: '25년 현장 경력',
      certifications: ['용접기능장', '특수용접기능사', '직업훈련교사'],
      image: '/images/instructor.jpg',
    },
    requirements: [
      '만 18세 이상',
      '내일배움카드 소지자',
      '고등학교 졸업 이상 또는 동등 학력',
      '용접 관련 업종 취업 희망자',
    ],
    benefits: [
      '훈련 수당 지급 (월 최대 30만원)',
      '교재 및 실습 재료비 무료',
      '자격증 응시료 지원',
      '수료 후 취업 연계',
    ],
    contact: {
      phone: '051-123-4567',
      email: 'welding@kopo.ac.kr',
      website: 'https://www.kopo.ac.kr',
    },
  },
}

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview')
  const [isApplying, setIsApplying] = useState(false)

  // Default to course 1 for demo
  const course = courseData['1']

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '용접':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case '안전':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case '품질':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case '자동화':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link href="/skillbridge" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
                <ArrowLeft className="w-5 h-5" />
                <span>목록으로</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-white transition">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-rose-400 transition">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 to-slate-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getCategoryColor(course.category)}`}>
                  {course.category}
                </span>
                <span className="px-3 py-1 text-sm font-medium bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                  모집중
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{course.title}</h1>

              <div className="flex items-center gap-6 text-slate-400 mb-6">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {course.provider_name}
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-medium">{course.rating}</span>
                  <span className="text-slate-500">({course.reviews}개 리뷰)</span>
                </div>
              </div>

              <p className="text-slate-400 text-lg mb-8">{course.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Clock, label: '교육 기간', value: course.duration },
                  { icon: MapPin, label: '교육 장소', value: '부산 사상구' },
                  { icon: Calendar, label: '시작일', value: course.start_date },
                  { icon: Users, label: '정원', value: `${course.enrolled}/${course.capacity}명` },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                      <Icon className="w-5 h-5 text-violet-400 mb-2" />
                      <p className="text-slate-500 text-sm">{item.label}</p>
                      <p className="text-white font-medium">{item.value}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Apply Card */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sticky top-24">
                <div className="text-center mb-6">
                  <p className="text-slate-500 text-sm mb-1">수강료</p>
                  <p className="text-3xl font-bold text-violet-400">{course.cost}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">모집 마감</span>
                    <span className="text-amber-400 font-medium">{course.deadline}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">남은 자리</span>
                    <span className="text-white font-medium">{course.capacity - course.enrolled}명</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full"
                      style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setIsApplying(true)}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition shadow-lg shadow-violet-500/25 mb-3"
                >
                  수강 신청하기
                </button>

                <button className="w-full py-3 bg-slate-700/50 text-white rounded-xl hover:bg-slate-700 transition flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  교육 안내서 다운로드
                </button>

                <div className="mt-6 pt-6 border-t border-slate-700">
                  <p className="text-slate-500 text-sm mb-3">문의</p>
                  <div className="space-y-2">
                    <a href={`tel:${course.contact.phone}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm">
                      <Phone className="w-4 h-4" />
                      {course.contact.phone}
                    </a>
                    <a href={`mailto:${course.contact.email}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm">
                      <Mail className="w-4 h-4" />
                      {course.contact.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-slate-800 sticky top-16 z-40 bg-slate-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: '과정 소개' },
              { id: 'curriculum', label: '커리큘럼' },
              { id: 'instructor', label: '강사 소개' },
              { id: 'reviews', label: '수강 후기' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-4 px-2 font-medium transition border-b-2 ${
                  activeTab === tab.id
                    ? 'text-violet-400 border-violet-400'
                    : 'text-slate-500 border-transparent hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            {activeTab === 'overview' && (
              <>
                {/* Highlights */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">교육 특장점</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">지원 자격</h2>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                    <ul className="space-y-3">
                      {course.requirements.map((req, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-300">
                          <div className="w-2 h-2 bg-violet-400 rounded-full" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">수강 혜택</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-gradient-to-r from-violet-900/30 to-fuchsia-900/30 border border-violet-500/20 rounded-xl">
                        <Award className="w-5 h-5 text-violet-400" />
                        <span className="text-slate-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Curriculum */}
            {activeTab === 'curriculum' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">교육 커리큘럼</h2>
                <div className="space-y-4">
                  {course.curriculum.map((week, i) => (
                    <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between p-4 border-b border-slate-700">
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-violet-500/20 text-violet-400 text-sm font-medium rounded-lg">
                            {week.week}
                          </span>
                          <h3 className="text-white font-medium">{week.title}</h3>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                      </div>
                      <div className="p-4">
                        <ul className="space-y-2">
                          {week.topics.map((topic, j) => (
                            <li key={j} className="flex items-center gap-3 text-slate-400 text-sm">
                              <Play className="w-4 h-4 text-slate-600" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructor */}
            {activeTab === 'instructor' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">강사 소개</h2>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                      {course.instructor.name[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{course.instructor.name}</h3>
                      <p className="text-violet-400 mb-2">{course.instructor.title}</p>
                      <p className="text-slate-400 mb-4">{course.instructor.experience}</p>
                      <div className="flex flex-wrap gap-2">
                        {course.instructor.certifications.map((cert, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-full">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">수강 후기</h2>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
                  <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">수강 후기 준비 중</h3>
                  <p className="text-slate-500">첫 번째 후기를 남겨주세요!</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Related Courses */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">연관 교육 과정</h3>
              <div className="space-y-4">
                {[
                  { title: 'TIG 용접 전문가 과정', provider: '한국폴리텍대학', category: '용접' },
                  { title: '용접 품질 검사원', provider: '부산품질혁신센터', category: '품질' },
                  { title: '로봇 용접 운용', provider: '스마트공장혁신센터', category: '자동화' },
                ].map((item, i) => (
                  <Link
                    key={i}
                    href="/skillbridge/1"
                    className="block p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition"
                  >
                    <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <p className="text-white font-medium mt-2">{item.title}</p>
                    <p className="text-slate-500 text-sm">{item.provider}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {isApplying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setIsApplying(false)} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-2">수강 신청</h3>
            <p className="text-slate-400 mb-6">{course.title}</p>

            <form className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">이름</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  placeholder="홍길동"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">연락처</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  placeholder="010-1234-5678"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">이메일</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  placeholder="example@email.com"
                />
              </div>

              <div className="flex items-start gap-2 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-amber-200 text-sm">
                  국비지원 과정은 내일배움카드가 필요합니다. 미소지자는 발급 후 신청해주세요.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsApplying(false)}
                  className="flex-1 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition"
                >
                  신청하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Biz<span className="text-violet-400">360</span> SkillBridge
              </span>
            </div>
            <p className="text-slate-500 text-sm">
              &copy; 2024 Biz360. 부울경 제조업을 위한 비즈니스 플랫폼
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
