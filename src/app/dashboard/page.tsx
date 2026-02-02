'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import {
  Users,
  TrendingUp,
  BookOpen,
  Award,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  CheckCircle2,
  AlertCircle,
  Building2,
  UserCheck,
  GraduationCap,
  RefreshCw,
} from 'lucide-react'

// Mock Data
const employees = [
  {
    id: '1',
    name: '김철수',
    department: '생산1팀',
    position: '주임',
    avatar: 'KC',
    skills: { 스마트제조: 3, 데이터분석: 2, 품질관리: 4, 자동화: 2, IoT: 3 },
    lastAssessment: '2024-01-15',
    status: 'active',
  },
  {
    id: '2',
    name: '이영희',
    department: '품질관리팀',
    position: '대리',
    avatar: 'LY',
    skills: { 스마트제조: 2, 데이터분석: 4, 품질관리: 5, 자동화: 3, IoT: 2 },
    lastAssessment: '2024-01-18',
    status: 'active',
  },
  {
    id: '3',
    name: '박민수',
    department: '생산2팀',
    position: '사원',
    avatar: 'PM',
    skills: { 스마트제조: 2, 데이터분석: 1, 품질관리: 2, 자동화: 1, IoT: 1 },
    lastAssessment: '2024-01-20',
    status: 'pending',
  },
  {
    id: '4',
    name: '정수진',
    department: '자동화팀',
    position: '과장',
    avatar: 'JS',
    skills: { 스마트제조: 4, 데이터분석: 3, 품질관리: 3, 자동화: 5, IoT: 4 },
    lastAssessment: '2024-01-10',
    status: 'active',
  },
]

const departmentStats = [
  { name: '생산1팀', score: 2.8, employees: 15, trend: 'up', change: 0.3 },
  { name: '생산2팀', score: 2.2, employees: 12, trend: 'down', change: -0.1 },
  { name: '품질관리팀', score: 3.4, employees: 8, trend: 'up', change: 0.5 },
  { name: '자동화팀', score: 4.0, employees: 6, trend: 'up', change: 0.2 },
]

const recentActivities = [
  { type: 'assessment', user: '김철수', action: '스킬 진단 완료', time: '2시간 전' },
  { type: 'course', user: '이영희', action: 'PLC 자동화 과정 수료', time: '5시간 전' },
  { type: 'badge', user: '정수진', action: '자동화 전문가 뱃지 획득', time: '1일 전' },
  { type: 'assessment', user: '박민수', action: '스킬 진단 요청됨', time: '2일 전' },
]

const recommendedCourses = [
  { title: '데이터 분석 기초', department: '생산1팀', matched: 8, priority: 'high' },
  { title: 'IoT 센서 활용', department: '생산2팀', matched: 6, priority: 'medium' },
  { title: 'PLC 프로그래밍', department: '전체', matched: 12, priority: 'high' },
]

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'employees' | 'skills' | 'courses'>('overview')

  const getSkillColor = (level: number) => {
    if (level >= 4) return 'bg-emerald-500'
    if (level >= 3) return 'bg-blue-500'
    if (level >= 2) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getSkillBgColor = (level: number) => {
    if (level >= 4) return 'bg-emerald-500/20 text-emerald-400'
    if (level >= 3) return 'bg-blue-500/20 text-blue-400'
    if (level >= 2) return 'bg-amber-500/20 text-amber-400'
    return 'bg-red-500/20 text-red-400'
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar */}
      <Navbar />

      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-40">
        <div className="flex justify-around py-2">
          {[
            { id: 'overview', icon: BarChart3, label: '현황' },
            { id: 'employees', icon: Users, label: '직원' },
            { id: 'skills', icon: Target, label: '역량' },
            { id: 'courses', icon: GraduationCap, label: '교육' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setSelectedTab(item.id as typeof selectedTab)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
                  selectedTab === item.id
                    ? 'text-violet-400'
                    : 'text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden lg:block fixed left-0 top-16 h-[calc(100%-4rem)] w-64 bg-slate-900 border-r border-slate-800 z-40">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">
                Biz<span className="text-violet-400">360</span>
              </span>
              <p className="text-xs text-slate-500">Enterprise Dashboard</p>
            </div>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          {[
            { id: 'overview', icon: BarChart3, label: '전체 현황' },
            { id: 'employees', icon: Users, label: '직원 관리' },
            { id: 'skills', icon: Target, label: '역량 분석' },
            { id: 'courses', icon: GraduationCap, label: '교육 관리' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setSelectedTab(item.id as typeof selectedTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  selectedTab === item.id
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-medium">
              ST
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">(주)스마트테크</p>
              <p className="text-xs text-slate-500">관리자</p>
            </div>
            <Settings className="w-5 h-5 text-slate-500" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 pb-20 lg:pb-0">
        {/* Header */}
        <header className="sticky top-16 z-30 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 py-4 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {selectedTab === 'overview' && '전체 현황'}
                {selectedTab === 'employees' && '직원 관리'}
                {selectedTab === 'skills' && '역량 분석'}
                {selectedTab === 'courses' && '교육 관리'}
              </h1>
              <p className="text-slate-500 text-sm">Biz360 연동 · 마지막 동기화: 2시간 전</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="검색..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>
              <button className="relative p-2 text-slate-400 hover:text-white transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full" />
              </button>
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition">
                <RefreshCw className="w-4 h-4" />
                동기화
              </button>
              <button className="sm:hidden p-2 bg-violet-600 text-white rounded-lg">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { label: '전체 직원', value: '41', sub: '+3 이번 달', icon: Users, color: 'violet' },
                  { label: '진단 완료율', value: '85%', sub: '35/41명', icon: CheckCircle2, color: 'emerald' },
                  { label: '평균 역량', value: '3.2', sub: '+0.3 전월 대비', icon: TrendingUp, color: 'blue' },
                  { label: '진행중 교육', value: '12', sub: '4개 과정', icon: BookOpen, color: 'amber' },
                ].map((stat, i) => {
                  const Icon = stat.icon
                  return (
                    <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-${stat.color}-500/20`}>
                          <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                        </div>
                        <span className="text-emerald-400 text-sm flex items-center gap-1">
                          <ArrowUpRight className="w-4 h-4" />
                          12%
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-slate-500 text-sm">{stat.label}</div>
                      <div className="text-slate-400 text-xs mt-1">{stat.sub}</div>
                    </div>
                  )
                })}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Skill Distribution */}
                <div className="col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">역량 영역별 현황</h3>
                    <button className="text-slate-400 hover:text-white text-sm">자세히 보기</button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: '스마트 제조', avg: 2.8, target: 4.0 },
                      { name: '데이터 분석', avg: 2.5, target: 4.0 },
                      { name: '품질 관리', avg: 3.5, target: 4.0 },
                      { name: '자동화', avg: 2.8, target: 4.0 },
                      { name: 'IoT/센서', avg: 2.5, target: 4.0 },
                    ].map((skill, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-300">{skill.name}</span>
                          <span className="text-slate-500">
                            {skill.avg} / {skill.target}
                          </span>
                        </div>
                        <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`absolute left-0 top-0 h-full rounded-full ${
                              skill.avg >= 3.5 ? 'bg-emerald-500' : skill.avg >= 2.5 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(skill.avg / 5) * 100}%` }}
                          />
                          <div
                            className="absolute top-0 h-full w-0.5 bg-violet-400"
                            style={{ left: `${(skill.target / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-700">
                    <span className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="w-3 h-3 bg-emerald-500 rounded" /> 목표 달성
                    </span>
                    <span className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="w-3 h-3 bg-amber-500 rounded" /> 개선 필요
                    </span>
                    <span className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="w-3 h-3 bg-violet-400 rounded-full" /> 목표치
                    </span>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">최근 활동</h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            activity.type === 'assessment'
                              ? 'bg-blue-500/20'
                              : activity.type === 'course'
                              ? 'bg-emerald-500/20'
                              : 'bg-amber-500/20'
                          }`}
                        >
                          {activity.type === 'assessment' && <Target className="w-4 h-4 text-blue-400" />}
                          {activity.type === 'course' && <BookOpen className="w-4 h-4 text-emerald-400" />}
                          {activity.type === 'badge' && <Award className="w-4 h-4 text-amber-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white">{activity.user}</p>
                          <p className="text-xs text-slate-500">{activity.action}</p>
                        </div>
                        <span className="text-xs text-slate-600">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Department & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department Stats */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">부서별 역량</h3>
                    <button className="text-slate-400 hover:text-white text-sm">전체 보기</button>
                  </div>
                  <div className="space-y-4">
                    {departmentStats.map((dept, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-violet-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{dept.name}</p>
                            <p className="text-slate-500 text-sm">{dept.employees}명</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`text-lg font-bold ${getSkillBgColor(dept.score).split(' ')[1]}`}>
                              {dept.score}
                            </p>
                            <p
                              className={`text-xs flex items-center gap-1 ${
                                dept.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                              }`}
                            >
                              {dept.trend === 'up' ? (
                                <ArrowUpRight className="w-3 h-3" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3" />
                              )}
                              {Math.abs(dept.change)}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Courses */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">추천 교육 과정</h3>
                    <Link href="/skillbridge" className="text-violet-400 hover:text-violet-300 text-sm">
                      SkillBridge 바로가기
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {recommendedCourses.map((course, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              course.priority === 'high' ? 'bg-red-500/20' : 'bg-amber-500/20'
                            }`}
                          >
                            <GraduationCap
                              className={`w-5 h-5 ${course.priority === 'high' ? 'text-red-400' : 'text-amber-400'}`}
                            />
                          </div>
                          <div>
                            <p className="text-white font-medium">{course.title}</p>
                            <p className="text-slate-500 text-sm">{course.department} 대상</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-violet-400">{course.matched}명 매칭</span>
                          <ChevronRight className="w-5 h-5 text-slate-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/skillbridge"
                    className="mt-4 w-full py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition flex items-center justify-center gap-2"
                  >
                    교육 과정 탐색하기
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Biz360 Integration Status */}
              <div className="bg-gradient-to-r from-violet-900/30 to-fuchsia-900/30 border border-violet-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Biz360 연동 상태</h3>
                      <p className="text-slate-400 text-sm">인사정보, 조직도, 교육이력 실시간 동기화 중</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {[
                      { label: '인사 정보', status: 'active' },
                      { label: '조직도', status: 'active' },
                      { label: '교육 이력', status: 'pending' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {item.status === 'active' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-400" />
                        )}
                        <span className="text-sm text-slate-300">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Employees Tab */}
          {selectedTab === 'employees' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="px-4 py-2 bg-violet-600 text-white rounded-lg">전체</button>
                  <button className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700">
                    진단 완료
                  </button>
                  <button className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700">
                    진단 대기
                  </button>
                </div>
                <button className="px-4 py-2 bg-violet-600 text-white rounded-lg flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  진단 요청 보내기
                </button>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left px-6 py-4 text-slate-400 font-medium text-sm">직원</th>
                      <th className="text-left px-6 py-4 text-slate-400 font-medium text-sm">부서</th>
                      <th className="text-left px-6 py-4 text-slate-400 font-medium text-sm">역량 현황</th>
                      <th className="text-left px-6 py-4 text-slate-400 font-medium text-sm">마지막 진단</th>
                      <th className="text-left px-6 py-4 text-slate-400 font-medium text-sm">상태</th>
                      <th className="text-left px-6 py-4 text-slate-400 font-medium text-sm"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => {
                      const avgSkill =
                        Object.values(emp.skills).reduce((a, b) => a + b, 0) / Object.values(emp.skills).length
                      return (
                        <tr key={emp.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                {emp.avatar}
                              </div>
                              <div>
                                <p className="text-white font-medium">{emp.name}</p>
                                <p className="text-slate-500 text-sm">{emp.position}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-300">{emp.department}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-0.5">
                                {Object.values(emp.skills).map((level, i) => (
                                  <div key={i} className={`w-1.5 h-6 rounded-sm ${getSkillColor(level)}`} />
                                ))}
                              </div>
                              <span className={`text-sm px-2 py-0.5 rounded ${getSkillBgColor(avgSkill)}`}>
                                {avgSkill.toFixed(1)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-sm">{emp.lastAssessment}</td>
                          <td className="px-6 py-4">
                            {emp.status === 'active' ? (
                              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                                완료
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                                대기중
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-violet-400 hover:text-violet-300 text-sm">상세</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {selectedTab === 'skills' && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Target className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">역량 분석 대시보드</h3>
                <p className="text-slate-500">상세 역량 분석 기능 준비 중입니다</p>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {selectedTab === 'courses' && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <GraduationCap className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">교육 관리</h3>
                <p className="text-slate-500 mb-4">교육 과정 관리 기능 준비 중입니다</p>
                <Link
                  href="/skillbridge"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition"
                >
                  SkillBridge에서 교육 찾기
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
