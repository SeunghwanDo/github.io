'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { useCertificates } from './useCertificates'

export interface PersonalInfo {
  name: string
  email: string
  phone: string
  address: string
  birthDate: string
  photo?: string
  introduction: string
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
}

export interface Skill {
  id: string
  name: string
  level: 1 | 2 | 3 | 4 | 5
  category: string
}

export interface CourseCompletion {
  id: string
  courseId: string
  courseTitle: string
  provider: string
  completedAt: string
  certificateNumber?: string
}

export interface ResumeData {
  id: string
  templateId: string
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  skills: Skill[]
  courses: CourseCompletion[]
  languages: Array<{ language: string; level: string }>
  awards: Array<{ title: string; issuer: string; date: string }>
  createdAt: string
  updatedAt: string
}

export interface ResumeTemplate {
  id: string
  name: string
  description: string
  preview: string
  color: string
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'professional',
    name: '프로페셔널',
    description: '깔끔하고 전문적인 디자인',
    preview: '📄',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'modern',
    name: '모던',
    description: '현대적이고 세련된 디자인',
    preview: '✨',
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'minimal',
    name: '미니멀',
    description: '심플하고 간결한 디자인',
    preview: '📋',
    color: 'from-slate-500 to-gray-500',
  },
  {
    id: 'creative',
    name: '크리에이티브',
    description: '독창적이고 눈에 띄는 디자인',
    preview: '🎨',
    color: 'from-pink-500 to-rose-500',
  },
]

// Mock completed courses data
const mockCompletedCourses: CourseCompletion[] = [
  {
    id: 'cc-1',
    courseId: '1',
    courseTitle: '아크 용접 기능사 자격증 취득반',
    provider: '한국폴리텍대학',
    completedAt: '2024-01-15',
    certificateNumber: 'CERT-2024-001',
  },
  {
    id: 'cc-2',
    courseId: '4',
    courseTitle: 'PLC 자동화 시스템 실무',
    provider: '스마트공장배움터',
    completedAt: '2023-11-20',
    certificateNumber: 'CERT-2023-045',
  },
]

export function useResume() {
  const { user } = useAuth()
  const { certificates } = useCertificates()
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Initialize or load resume
  useEffect(() => {
    setLoading(true)
    try {
      const stored = localStorage.getItem('resumeData')
      if (stored) {
        setResume(JSON.parse(stored))
      } else {
        // Initialize with user data and completed courses
        const initial: ResumeData = {
          id: `resume-${Date.now()}`,
          templateId: 'professional',
          personalInfo: {
            name: user?.user_metadata?.name || '',
            email: user?.email || '',
            phone: '',
            address: '',
            birthDate: '',
            introduction: '',
          },
          education: [],
          experience: [],
          skills: [],
          courses: mockCompletedCourses,
          languages: [],
          awards: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setResume(initial)
      }
    } catch (error) {
      console.error('Failed to load resume:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Save resume
  const saveResume = useCallback(async (data: Partial<ResumeData>) => {
    if (!resume) return

    setSaving(true)
    try {
      const updated: ResumeData = {
        ...resume,
        ...data,
        updatedAt: new Date().toISOString(),
      }
      setResume(updated)
      localStorage.setItem('resumeData', JSON.stringify(updated))
      return updated
    } finally {
      setSaving(false)
    }
  }, [resume])

  // Update personal info
  const updatePersonalInfo = useCallback((info: Partial<PersonalInfo>) => {
    if (!resume) return
    return saveResume({
      personalInfo: { ...resume.personalInfo, ...info },
    })
  }, [resume, saveResume])

  // Add/update/remove education
  const addEducation = useCallback((edu: Omit<Education, 'id'>) => {
    if (!resume) return
    const newEdu: Education = { ...edu, id: `edu-${Date.now()}` }
    return saveResume({
      education: [...resume.education, newEdu],
    })
  }, [resume, saveResume])

  const updateEducation = useCallback((id: string, edu: Partial<Education>) => {
    if (!resume) return
    return saveResume({
      education: resume.education.map((e) => (e.id === id ? { ...e, ...edu } : e)),
    })
  }, [resume, saveResume])

  const removeEducation = useCallback((id: string) => {
    if (!resume) return
    return saveResume({
      education: resume.education.filter((e) => e.id !== id),
    })
  }, [resume, saveResume])

  // Add/update/remove experience
  const addExperience = useCallback((exp: Omit<Experience, 'id'>) => {
    if (!resume) return
    const newExp: Experience = { ...exp, id: `exp-${Date.now()}` }
    return saveResume({
      experience: [...resume.experience, newExp],
    })
  }, [resume, saveResume])

  const updateExperience = useCallback((id: string, exp: Partial<Experience>) => {
    if (!resume) return
    return saveResume({
      experience: resume.experience.map((e) => (e.id === id ? { ...e, ...exp } : e)),
    })
  }, [resume, saveResume])

  const removeExperience = useCallback((id: string) => {
    if (!resume) return
    return saveResume({
      experience: resume.experience.filter((e) => e.id !== id),
    })
  }, [resume, saveResume])

  // Add/update/remove skills
  const addSkill = useCallback((skill: Omit<Skill, 'id'>) => {
    if (!resume) return
    const newSkill: Skill = { ...skill, id: `skill-${Date.now()}` }
    return saveResume({
      skills: [...resume.skills, newSkill],
    })
  }, [resume, saveResume])

  const updateSkill = useCallback((id: string, skill: Partial<Skill>) => {
    if (!resume) return
    return saveResume({
      skills: resume.skills.map((s) => (s.id === id ? { ...s, ...skill } : s)),
    })
  }, [resume, saveResume])

  const removeSkill = useCallback((id: string) => {
    if (!resume) return
    return saveResume({
      skills: resume.skills.filter((s) => s.id !== id),
    })
  }, [resume, saveResume])

  // Change template
  const setTemplate = useCallback((templateId: string) => {
    return saveResume({ templateId })
  }, [saveResume])

  // Sync with certificates
  const syncCertificates = useCallback(() => {
    if (!resume || !certificates) return

    const coursesFromCerts: CourseCompletion[] = certificates.map((cert) => ({
      id: `cc-${cert.id}`,
      courseId: cert.course_id,
      courseTitle: cert.course_title,
      provider: cert.provider_name,
      completedAt: cert.issued_at,
      certificateNumber: cert.certificate_number,
    }))

    // Merge with existing courses, avoiding duplicates
    const existingIds = new Set(resume.courses.map((c) => c.courseId))
    const newCourses = coursesFromCerts.filter((c) => !existingIds.has(c.courseId))

    if (newCourses.length > 0) {
      return saveResume({
        courses: [...resume.courses, ...newCourses],
      })
    }
  }, [resume, certificates, saveResume])

  // Generate shareable link
  const generateShareLink = useCallback(() => {
    if (!resume) return null
    // In a real app, this would upload to a server and return a URL
    const encoded = btoa(JSON.stringify(resume))
    return `${window.location.origin}/resume/view?data=${encoded.slice(0, 50)}...`
  }, [resume])

  return {
    resume,
    loading,
    saving,
    saveResume,
    updatePersonalInfo,
    addEducation,
    updateEducation,
    removeEducation,
    addExperience,
    updateExperience,
    removeExperience,
    addSkill,
    updateSkill,
    removeSkill,
    setTemplate,
    syncCertificates,
    generateShareLink,
    RESUME_TEMPLATES,
  }
}

// Helper functions
export function getSkillLevelText(level: number): string {
  switch (level) {
    case 1:
      return '입문'
    case 2:
      return '초급'
    case 3:
      return '중급'
    case 4:
      return '고급'
    case 5:
      return '전문가'
    default:
      return '미정'
  }
}

export function formatDateRange(startDate: string, endDate: string, current: boolean): string {
  const start = new Date(startDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
  })
  const end = current
    ? '현재'
    : new Date(endDate).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
      })
  return `${start} - ${end}`
}
