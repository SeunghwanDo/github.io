'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Star,
  Plus,
  Trash2,
  Save,
  Download,
  Share2,
  Eye,
  Loader2,
  CheckCircle2,
  Edit,
  X,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import {
  useResume,
  RESUME_TEMPLATES,
  getSkillLevelText,
  formatDateRange,
  Education,
  Experience,
  Skill,
} from '@/hooks/useResume'

export default function ResumePage() {
  const {
    resume,
    loading,
    saving,
    updatePersonalInfo,
    addEducation,
    updateEducation,
    removeEducation,
    addExperience,
    updateExperience,
    removeExperience,
    addSkill,
    removeSkill,
    setTemplate,
    syncCertificates,
  } = useResume()

  const [activeSection, setActiveSection] = useState<'info' | 'education' | 'experience' | 'skills' | 'courses' | 'preview'>('info')
  const [editingEdu, setEditingEdu] = useState<string | null>(null)
  const [editingExp, setEditingExp] = useState<string | null>(null)
  const [showAddEdu, setShowAddEdu] = useState(false)
  const [showAddExp, setShowAddExp] = useState(false)
  const [showAddSkill, setShowAddSkill] = useState(false)

  // Form states
  const [newEdu, setNewEdu] = useState<Partial<Education>>({})
  const [newExp, setNewExp] = useState<Partial<Experience>>({ achievements: [] })
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({ level: 3 })

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          </div>
        </main>
      </div>
    )
  }

  const handleAddEducation = () => {
    if (newEdu.school && newEdu.degree) {
      addEducation(newEdu as Omit<Education, 'id'>)
      setNewEdu({})
      setShowAddEdu(false)
    }
  }

  const handleAddExperience = () => {
    if (newExp.company && newExp.position) {
      addExperience(newExp as Omit<Experience, 'id'>)
      setNewExp({ achievements: [] })
      setShowAddExp(false)
    }
  }

  const handleAddSkill = () => {
    if (newSkill.name && newSkill.category) {
      addSkill(newSkill as Omit<Skill, 'id'>)
      setNewSkill({ level: 3 })
      setShowAddSkill(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/" className="hover:text-violet-400">홈</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-violet-400">이력서 빌더</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <FileText className="w-8 h-8 text-violet-400" />
                이력서 빌더
              </h1>
              <p className="text-slate-400 mt-1">수료 이력이 자동으로 반영되는 스마트 이력서</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition flex items-center gap-2">
                <Eye className="w-4 h-4" />
                미리보기
              </button>
              <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition flex items-center gap-2">
                <Download className="w-4 h-4" />
                PDF 다운로드
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 sticky top-24">
              <h3 className="text-sm font-medium text-slate-400 mb-3">섹션</h3>
              <nav className="space-y-1">
                {[
                  { id: 'info', label: '기본 정보', icon: User },
                  { id: 'education', label: '학력', icon: GraduationCap },
                  { id: 'experience', label: '경력', icon: Briefcase },
                  { id: 'skills', label: '보유 스킬', icon: Star },
                  { id: 'courses', label: '수료 이력', icon: Award },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id as typeof activeSection)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition text-left ${
                        activeSection === item.id
                          ? 'bg-violet-600 text-white'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  )
                })}
              </nav>

              {/* Template Selection */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <h3 className="text-sm font-medium text-slate-400 mb-3">템플릿</h3>
                <div className="grid grid-cols-2 gap-2">
                  {RESUME_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setTemplate(template.id)}
                      className={`p-3 rounded-lg text-center transition ${
                        resume?.templateId === template.id
                          ? 'bg-violet-500/20 border-2 border-violet-500'
                          : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-2xl">{template.preview}</span>
                      <p className="text-xs text-slate-400 mt-1">{template.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sync Certificates */}
              <button
                onClick={syncCertificates}
                className="w-full mt-4 px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                수료증 동기화
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Personal Info Section */}
            {activeSection === 'info' && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-violet-400" />
                  기본 정보
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">이름 *</label>
                    <input
                      type="text"
                      value={resume?.personalInfo.name || ''}
                      onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder="홍길동"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">이메일 *</label>
                    <input
                      type="email"
                      value={resume?.personalInfo.email || ''}
                      onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">연락처</label>
                    <input
                      type="tel"
                      value={resume?.personalInfo.phone || ''}
                      onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder="010-1234-5678"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">생년월일</label>
                    <input
                      type="date"
                      value={resume?.personalInfo.birthDate || ''}
                      onChange={(e) => updatePersonalInfo({ birthDate: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-slate-400 text-sm mb-2">주소</label>
                    <input
                      type="text"
                      value={resume?.personalInfo.address || ''}
                      onChange={(e) => updatePersonalInfo({ address: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder="서울특별시 강남구"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-slate-400 text-sm mb-2">자기소개</label>
                    <textarea
                      value={resume?.personalInfo.introduction || ''}
                      onChange={(e) => updatePersonalInfo({ introduction: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                      placeholder="간략한 자기소개를 작성해주세요"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Education Section */}
            {activeSection === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-violet-400" />
                    학력
                  </h2>
                  <button
                    onClick={() => setShowAddEdu(true)}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    추가
                  </button>
                </div>

                {/* Add Education Form */}
                {showAddEdu && (
                  <div className="bg-slate-900/50 border border-violet-500/30 rounded-2xl p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">학교명 *</label>
                        <input
                          type="text"
                          value={newEdu.school || ''}
                          onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                          placeholder="OO대학교"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">학위 *</label>
                        <select
                          value={newEdu.degree || ''}
                          onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                          <option value="">선택</option>
                          <option value="고등학교">고등학교</option>
                          <option value="전문학사">전문학사</option>
                          <option value="학사">학사</option>
                          <option value="석사">석사</option>
                          <option value="박사">박사</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">전공</label>
                        <input
                          type="text"
                          value={newEdu.field || ''}
                          onChange={(e) => setNewEdu({ ...newEdu, field: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                          placeholder="기계공학과"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 text-sm mb-2">입학</label>
                          <input
                            type="month"
                            value={newEdu.startDate || ''}
                            onChange={(e) => setNewEdu({ ...newEdu, startDate: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 text-sm mb-2">졸업</label>
                          <input
                            type="month"
                            value={newEdu.endDate || ''}
                            onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => {
                          setShowAddEdu(false)
                          setNewEdu({})
                        }}
                        className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleAddEducation}
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                )}

                {/* Education List */}
                {resume?.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold">{edu.school}</h3>
                        <p className="text-slate-400">{edu.degree} {edu.field && `- ${edu.field}`}</p>
                        <p className="text-slate-500 text-sm mt-1">
                          {formatDateRange(edu.startDate, edu.endDate, false)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-white transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="p-2 text-slate-400 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {resume?.education.length === 0 && !showAddEdu && (
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                    <GraduationCap className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">학력 정보를 추가해주세요</p>
                  </div>
                )}
              </div>
            )}

            {/* Experience Section */}
            {activeSection === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-violet-400" />
                    경력
                  </h2>
                  <button
                    onClick={() => setShowAddExp(true)}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    추가
                  </button>
                </div>

                {/* Add Experience Form */}
                {showAddExp && (
                  <div className="bg-slate-900/50 border border-violet-500/30 rounded-2xl p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">회사명 *</label>
                        <input
                          type="text"
                          value={newExp.company || ''}
                          onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">직위 *</label>
                        <input
                          type="text"
                          value={newExp.position || ''}
                          onChange={(e) => setNewExp({ ...newExp, position: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">입사일</label>
                        <input
                          type="month"
                          value={newExp.startDate || ''}
                          onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">퇴사일</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="month"
                            value={newExp.endDate || ''}
                            onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                            disabled={newExp.current}
                            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
                          />
                          <label className="flex items-center gap-2 text-slate-400 text-sm whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={newExp.current || false}
                              onChange={(e) => setNewExp({ ...newExp, current: e.target.checked })}
                              className="rounded"
                            />
                            재직중
                          </label>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-slate-400 text-sm mb-2">업무 내용</label>
                        <textarea
                          value={newExp.description || ''}
                          onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => {
                          setShowAddExp(false)
                          setNewExp({ achievements: [] })
                        }}
                        className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleAddExperience}
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                )}

                {/* Experience List */}
                {resume?.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold">{exp.company}</h3>
                        <p className="text-violet-400">{exp.position}</p>
                        <p className="text-slate-500 text-sm mt-1">
                          {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                        </p>
                        {exp.description && (
                          <p className="text-slate-400 mt-3">{exp.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-white transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="p-2 text-slate-400 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {resume?.experience.length === 0 && !showAddExp && (
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                    <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">경력 정보를 추가해주세요</p>
                  </div>
                )}
              </div>
            )}

            {/* Skills Section */}
            {activeSection === 'skills' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-violet-400" />
                    보유 스킬
                  </h2>
                  <button
                    onClick={() => setShowAddSkill(true)}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    추가
                  </button>
                </div>

                {/* Add Skill Form */}
                {showAddSkill && (
                  <div className="bg-slate-900/50 border border-violet-500/30 rounded-2xl p-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">스킬명 *</label>
                        <input
                          type="text"
                          value={newSkill.name || ''}
                          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                          placeholder="예: 아크용접"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">카테고리 *</label>
                        <select
                          value={newSkill.category || ''}
                          onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                          <option value="">선택</option>
                          <option value="용접">용접</option>
                          <option value="기계가공">기계가공</option>
                          <option value="자동화">자동화</option>
                          <option value="품질관리">품질관리</option>
                          <option value="전기전자">전기전자</option>
                          <option value="기타">기타</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">숙련도</label>
                        <select
                          value={newSkill.level || 3}
                          onChange={(e) => setNewSkill({ ...newSkill, level: Number(e.target.value) as Skill['level'] })}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                          {[1, 2, 3, 4, 5].map((level) => (
                            <option key={level} value={level}>
                              {getSkillLevelText(level)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => {
                          setShowAddSkill(false)
                          setNewSkill({ level: 3 })
                        }}
                        className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleAddSkill}
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                )}

                {/* Skills Grid */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  {resume?.skills.length === 0 && !showAddSkill ? (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                      <p className="text-slate-500">보유 스킬을 추가해주세요</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {resume?.skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl group"
                        >
                          <span className="text-white">{skill.name}</span>
                          <span className="text-xs text-slate-500">({getSkillLevelText(skill.level)})</span>
                          <button
                            onClick={() => removeSkill(skill.id)}
                            className="text-slate-500 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Courses Section */}
            {activeSection === 'courses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-violet-400" />
                    수료 이력
                  </h2>
                  <button
                    onClick={syncCertificates}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    수료증 동기화
                  </button>
                </div>

                <p className="text-slate-500 text-sm">
                  SkillBridge에서 수료한 교육 이력이 자동으로 반영됩니다.
                </p>

                {/* Courses List */}
                {resume?.courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{course.courseTitle}</h3>
                          <p className="text-slate-400 text-sm">{course.provider}</p>
                          <div className="flex items-center gap-4 mt-2 text-slate-500 text-sm">
                            <span>수료일: {new Date(course.completedAt).toLocaleDateString('ko-KR')}</span>
                            {course.certificateNumber && (
                              <span className="text-violet-400">{course.certificateNumber}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                ))}

                {resume?.courses.length === 0 && (
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                    <Award className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 mb-4">수료한 교육이 없습니다</p>
                    <Link
                      href="/skillbridge"
                      className="text-violet-400 hover:text-violet-300"
                    >
                      교육과정 둘러보기 →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
