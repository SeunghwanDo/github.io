'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileCheck,
  BarChart3,
  Settings,
  ChevronRight,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Download,
  TrendingUp,
  Award,
  AlertTriangle,
  Bell,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { courses } from '@/data/courses'

// Mock admin data
interface Application {
  id: string
  user_name: string
  user_email: string
  course_id: string
  course_title: string
  applied_at: string
  status: 'pending' | 'approved' | 'rejected'
}

interface Stats {
  totalCourses: number
  activeCourses: number
  totalStudents: number
  pendingApplications: number
  completionRate: number
  monthlyGrowth: number
}

const mockApplications: Application[] = [
  {
    id: 'app-1',
    user_name: '김철수',
    user_email: 'kim@example.com',
    course_id: '1',
    course_title: '아크 용접 기능사 자격증 취득반',
    applied_at: '2024-02-01T10:30:00',
    status: 'pending',
  },
  {
    id: 'app-2',
    user_name: '이영희',
    user_email: 'lee@example.com',
    course_id: '2',
    course_title: 'CNC 선반 가공 실무',
    applied_at: '2024-02-01T09:15:00',
    status: 'pending',
  },
  {
    id: 'app-3',
    user_name: '박민수',
    user_email: 'park@example.com',
    course_id: '3',
    course_title: '품질관리(QC) 전문가 양성과정',
    applied_at: '2024-01-31T14:45:00',
    status: 'pending',
  },
  {
    id: 'app-4',
    user_name: '정수진',
    user_email: 'jung@example.com',
    course_id: '4',
    course_title: 'PLC 자동화 시스템 실무',
    applied_at: '2024-01-30T11:20:00',
    status: 'approved',
  },
  {
    id: 'app-5',
    user_name: '최동훈',
    user_email: 'choi@example.com',
    course_id: '1',
    course_title: '아크 용접 기능사 자격증 취득반',
    applied_at: '2024-01-29T16:00:00',
    status: 'rejected',
  },
]

const mockStats: Stats = {
  totalCourses: 12,
  activeCourses: 8,
  totalStudents: 1247,
  pendingApplications: 23,
  completionRate: 87,
  monthlyGrowth: 12.5,
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'applications' | 'certificates' | 'analytics'>('overview')
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [stats] = useState<Stats>(mockStats)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const handleApprove = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: 'approved' as const } : app))
    )
  }

  const handleReject = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: 'rejected' as const } : app))
    )
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.course_title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = applications.filter((a) => a.status === 'pending').length

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-64px)] bg-slate-900 border-r border-slate-800 hidden lg:block">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-white mb-4">관리자 메뉴</h2>
            <nav className="space-y-1">
              {[
                { id: 'overview', label: '대시보드', icon: LayoutDashboard },
                { id: 'courses', label: '교육과정 관리', icon: BookOpen },
                { id: 'applications', label: '신청 관리', icon: Users, badge: pendingCount },
                { id: 'certificates', label: '수료증 발급', icon: FileCheck },
                { id: 'analytics', label: '통계/분석', icon: BarChart3 },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as typeof activeTab)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                      activeTab === item.id
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </span>
                    {item.badge && item.badge > 0 && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">관리자 대시보드</h1>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition">
                    <Bell className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-violet-500/20 rounded-xl">
                      <BookOpen className="w-6 h-6 text-violet-400" />
                    </div>
                    <span className="text-emerald-400 text-sm flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +2
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-white">{stats.totalCourses}</p>
                  <p className="text-slate-500 text-sm">전체 교육과정</p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-emerald-500/20 rounded-xl">
                      <Users className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="text-emerald-400 text-sm flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {stats.monthlyGrowth}%
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-white">{stats.totalStudents.toLocaleString()}</p>
                  <p className="text-slate-500 text-sm">전체 수강생</p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-500/20 rounded-xl">
                      <Clock className="w-6 h-6 text-amber-400" />
                    </div>
                    {pendingCount > 10 && (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <p className="text-3xl font-bold text-white">{stats.pendingApplications}</p>
                  <p className="text-slate-500 text-sm">대기 중 신청</p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <Award className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white">{stats.completionRate}%</p>
                  <p className="text-slate-500 text-sm">수료율</p>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">최근 신청</h2>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="text-violet-400 text-sm hover:text-violet-300 flex items-center gap-1"
                  >
                    전체 보기 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-medium">
                          {app.user_name[0]}
                        </div>
                        <div>
                          <p className="text-white font-medium">{app.user_name}</p>
                          <p className="text-slate-500 text-sm">{app.course_title}</p>
                        </div>
                      </div>
                      {app.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(app.id)}
                            className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            app.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {app.status === 'approved' ? '승인됨' : '거절됨'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('courses')}
                  className="p-6 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-2xl hover:border-violet-500/50 transition text-left"
                >
                  <Plus className="w-8 h-8 text-violet-400 mb-3" />
                  <h3 className="text-white font-semibold mb-1">새 교육과정 등록</h3>
                  <p className="text-slate-400 text-sm">교육과정을 등록하세요</p>
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className="p-6 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-2xl hover:border-emerald-500/50 transition text-left"
                >
                  <Users className="w-8 h-8 text-emerald-400 mb-3" />
                  <h3 className="text-white font-semibold mb-1">신청 일괄 처리</h3>
                  <p className="text-slate-400 text-sm">{pendingCount}개 대기 중</p>
                </button>
                <button
                  onClick={() => setActiveTab('certificates')}
                  className="p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl hover:border-blue-500/50 transition text-left"
                >
                  <FileCheck className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-white font-semibold mb-1">수료증 발급</h3>
                  <p className="text-slate-400 text-sm">수료 대상자 관리</p>
                </button>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">교육과정 관리</h1>
                <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  새 과정 등록
                </button>
              </div>

              {/* Search */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="교육과정 검색..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <button className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  필터
                </button>
              </div>

              {/* Course List */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left p-4 text-slate-400 font-medium">교육과정</th>
                      <th className="text-left p-4 text-slate-400 font-medium">카테고리</th>
                      <th className="text-left p-4 text-slate-400 font-medium">상태</th>
                      <th className="text-left p-4 text-slate-400 font-medium">수강생</th>
                      <th className="text-left p-4 text-slate-400 font-medium">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(courses).slice(0, 10).map((course) => (
                      <tr key={course.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="p-4">
                          <div>
                            <p className="text-white font-medium">{course.title}</p>
                            <p className="text-slate-500 text-sm">{course.provider_name}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-sm">
                            {course.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              course.status === 'recruiting'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : course.status === 'ongoing'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-slate-500/20 text-slate-400'
                            }`}
                          >
                            {course.status === 'recruiting' ? '모집중' : course.status === 'ongoing' ? '진행중' : '마감'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300">{course.enrolled}/{course.capacity}명</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-slate-400 hover:text-white transition">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-white transition">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-400 transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">신청 관리</h1>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    일괄 승인
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="이름, 교육과정으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="all">전체 상태</option>
                  <option value="pending">대기 중</option>
                  <option value="approved">승인됨</option>
                  <option value="rejected">거절됨</option>
                </select>
              </div>

              {/* Applications List */}
              <div className="space-y-3">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center text-white font-bold">
                          {app.user_name[0]}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{app.user_name}</h3>
                          <p className="text-slate-500 text-sm">{app.user_email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{app.course_title}</p>
                        <p className="text-slate-500 text-sm">
                          {new Date(app.applied_at).toLocaleDateString('ko-KR')} 신청
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          app.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400'
                            : app.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {app.status === 'pending' ? '대기 중' : app.status === 'approved' ? '승인됨' : '거절됨'}
                      </span>
                      {app.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(app.id)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            승인
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            거절
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">수료증 발급</h1>
                <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  일괄 발급
                </button>
              </div>

              {/* Completion Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-slate-400">발급 대기</span>
                  </div>
                  <p className="text-3xl font-bold text-white">47</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <FileCheck className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-slate-400">이번 달 발급</span>
                  </div>
                  <p className="text-3xl font-bold text-white">128</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-violet-500/20 rounded-lg">
                      <Award className="w-5 h-5 text-violet-400" />
                    </div>
                    <span className="text-slate-400">총 발급</span>
                  </div>
                  <p className="text-3xl font-bold text-white">2,341</p>
                </div>
              </div>

              {/* Completion List */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">수료 대기자 목록</h2>
                <div className="space-y-3">
                  {[
                    { name: '김민준', course: '아크 용접 기능사', completion: 100, date: '2024-02-01' },
                    { name: '이서연', course: 'CNC 선반 가공 실무', completion: 100, date: '2024-02-01' },
                    { name: '박지훈', course: '품질관리 전문가', completion: 100, date: '2024-01-31' },
                    { name: '최예진', course: 'PLC 자동화 실무', completion: 98, date: '2024-01-30' },
                  ].map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <input type="checkbox" className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-violet-500" />
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-medium">
                          {student.name[0]}
                        </div>
                        <div>
                          <p className="text-white font-medium">{student.name}</p>
                          <p className="text-slate-500 text-sm">{student.course}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`font-medium ${student.completion >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {student.completion}%
                          </p>
                          <p className="text-slate-500 text-sm">{student.date}</p>
                        </div>
                        <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition text-sm">
                          발급
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-white">통계/분석</h1>

              {/* Charts placeholder */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">월별 수강생 추이</h2>
                  <div className="h-64 flex items-end gap-2">
                    {[40, 55, 45, 70, 65, 80, 85, 90, 75, 95, 100, 110].map((value, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-gradient-to-t from-violet-600 to-fuchsia-500 rounded-t"
                          style={{ height: `${(value / 110) * 100}%` }}
                        />
                        <span className="text-slate-500 text-xs">{idx + 1}월</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">카테고리별 분포</h2>
                  <div className="space-y-4">
                    {[
                      { name: '용접', value: 35, color: 'bg-orange-500' },
                      { name: '자동화', value: 25, color: 'bg-violet-500' },
                      { name: '품질관리', value: 20, color: 'bg-blue-500' },
                      { name: '안전', value: 12, color: 'bg-emerald-500' },
                      { name: '기타', value: 8, color: 'bg-slate-500' },
                    ].map((cat) => (
                      <div key={cat.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">{cat.name}</span>
                          <span className="text-slate-500">{cat.value}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">주요 지표</h2>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-violet-400 mb-1">87%</p>
                    <p className="text-slate-500">평균 수료율</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-emerald-400 mb-1">4.6</p>
                    <p className="text-slate-500">평균 만족도</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-blue-400 mb-1">72%</p>
                    <p className="text-slate-500">취업 연계율</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-amber-400 mb-1">2.3일</p>
                    <p className="text-slate-500">평균 승인 시간</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
