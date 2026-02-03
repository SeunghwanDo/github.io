'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronRight,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  BookOpen,
  Star,
  Award,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Briefcase,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { getProvider, Provider } from '@/data/providers'
import { courses, Course } from '@/data/courses'

export default function ProviderDetailPage() {
  const params = useParams()
  const providerId = params.id as string
  const provider = getProvider(providerId)

  // Get courses from this provider
  const providerCourses = Object.values(courses).filter((course) => {
    const providerNameMapping: Record<string, string> = {
      'kopo': '한국폴리텍대학',
      'smart-factory': '스마트공장배움터',
      'busan-techno': '부산테크노파크',
      'kcomwel': '한국산업인력공단',
      'samsung-tech': '삼성전자',
      'hyundai-hrd': '현대자동차',
    }
    const providerName = providerNameMapping[providerId]
    return providerName && course.provider_name.includes(providerName.split(' ')[0])
  })

  if (!provider) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-16 text-center">
          <Building2 className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">교육기관을 찾을 수 없습니다</h1>
          <Link href="/providers" className="text-violet-400 hover:text-violet-300">
            교육기관 목록으로 돌아가기
          </Link>
        </main>
      </div>
    )
  }

  const getTypeColor = (type: Provider['type']) => {
    switch (type) {
      case '대학':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case '직업훈련원':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case '기업연수원':
        return 'bg-violet-500/20 text-violet-400 border-violet-500/30'
      case '온라인':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case '정부기관':
        return 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-violet-400">홈</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/providers" className="hover:text-violet-400">교육기관</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-violet-400">{provider.name}</span>
        </div>

        {/* Header */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {provider.name[0]}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getTypeColor(provider.type)}`}>
                  {provider.type}
                </span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">{provider.rating}</span>
                  <span className="text-slate-500">({provider.reviewCount.toLocaleString()}개 리뷰)</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-white mb-3">{provider.name}</h1>
              <p className="text-slate-400 mb-4">{provider.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {provider.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  설립 {provider.established}년
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  누적 수강생 {provider.totalStudents.toLocaleString()}명
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex md:flex-col gap-3">
              <a
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition flex items-center gap-2"
              >
                <Globe className="w-5 h-5" />
                웹사이트
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={`tel:${provider.phone}`}
                className="px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                문의하기
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800">
            <div className="text-center">
              <p className="text-3xl font-bold text-violet-400">{provider.totalCourses}</p>
              <p className="text-slate-500 text-sm">운영 과정</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-400">{provider.totalStudents.toLocaleString()}</p>
              <p className="text-slate-500 text-sm">누적 수강생</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-400">{provider.rating}</p>
              <p className="text-slate-500 text-sm">평균 평점</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">{provider.partnerships.length}</p>
              <p className="text-slate-500 text-sm">협력 기관</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Specialties */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-violet-400" />
                전문 분야
              </h2>
              <div className="flex flex-wrap gap-2">
                {provider.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-4 py-2 bg-violet-500/10 border border-violet-500/30 text-violet-300 rounded-xl"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                인증 및 자격
              </h2>
              <div className="space-y-3">
                {provider.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {cert}
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                주요 시설
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {provider.facilities.map((facility, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-800/50 rounded-xl text-slate-300"
                  >
                    {facility}
                  </div>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-violet-400" />
                  운영 교육과정
                </h2>
                <Link
                  href={`/skillbridge?provider=${providerId}`}
                  className="text-violet-400 text-sm hover:text-violet-300 flex items-center gap-1"
                >
                  전체 보기 <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {providerCourses.length > 0 ? (
                  providerCourses.slice(0, 4).map((course) => (
                    <Link
                      key={course.id}
                      href={`/skillbridge/${course.id}`}
                      className="block p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-medium">{course.title}</p>
                          <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                            <span>{course.duration}</span>
                            <span className="text-emerald-400">{course.cost}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 text-sm">
                          <Star className="w-4 h-4 fill-current" />
                          {course.rating}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-8">
                    현재 등록된 교육과정이 없습니다
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">연락처</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-500 text-sm mb-1">주소</p>
                  <p className="text-slate-300">{provider.address}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">전화</p>
                  <a
                    href={`tel:${provider.phone}`}
                    className="text-slate-300 hover:text-violet-400 transition flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    {provider.phone}
                  </a>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">이메일</p>
                  <a
                    href={`mailto:${provider.email}`}
                    className="text-slate-300 hover:text-violet-400 transition flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    {provider.email}
                  </a>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">웹사이트</p>
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:text-violet-300 transition flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    방문하기
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Partnerships */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                협력 기관
              </h3>
              <div className="space-y-2">
                {provider.partnerships.map((partner, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-800/50 rounded-lg text-slate-300 text-sm"
                  >
                    {partner}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">교육 상담 받기</h3>
              <p className="text-slate-400 text-sm mb-4">
                {provider.name}의 교육 프로그램에 대해 상담받으세요
              </p>
              <button className="w-full py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition">
                상담 신청
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
