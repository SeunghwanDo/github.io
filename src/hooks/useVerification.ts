'use client'

import { useState, useEffect, createContext, useContext, useCallback } from 'react'

// Types
export interface FitnessVerification {
  verified: boolean
  grade: 1 | 2 | 3 | null
  verifiedAt: string | null
  metrics?: {
    cardio: number
    strength: number
    flexibility: number
    balance: number
  }
}

export interface CareerVerification {
  verified: boolean
  totalYears: number
  verifiedAt: string | null
  employmentHistory: {
    company: string
    position: string
    startDate: string
    endDate: string
    verified: boolean
  }[]
}

export interface UserVerification {
  fitness: FitnessVerification
  career: CareerVerification
  isExpert: boolean // 5+ years verified
}

export interface SilverModeSettings {
  enabled: boolean
  fontSize: 'normal' | 'large' | 'xlarge'
  highContrast: boolean
  simplifiedNav: boolean
  ttsEnabled: boolean
}

export interface UserProfile {
  id: string
  name: string
  age: number
  birthYear: number
  email: string
  primarySkill: string
  experienceYears: number
  verification: UserVerification
  silverMode: SilverModeSettings
}

interface VerificationContextType {
  userProfile: UserProfile | null
  silverMode: SilverModeSettings
  isLoading: boolean
  // Verification actions
  connectFitnessData: () => Promise<void>
  verifyCareerHistory: () => Promise<void>
  // Silver mode actions
  toggleSilverMode: () => void
  updateSilverSettings: (settings: Partial<SilverModeSettings>) => void
  // TTS
  speakText: (text: string) => void
  stopSpeaking: () => void
  isSpeaking: boolean
}

const defaultSilverMode: SilverModeSettings = {
  enabled: false,
  fontSize: 'normal',
  highContrast: false,
  simplifiedNav: false,
  ttsEnabled: false
}

const defaultVerification: UserVerification = {
  fitness: {
    verified: false,
    grade: null,
    verifiedAt: null
  },
  career: {
    verified: false,
    totalYears: 0,
    verifiedAt: null,
    employmentHistory: []
  },
  isExpert: false
}

const VerificationContext = createContext<VerificationContextType | null>(null)

export function VerificationProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [silverMode, setSilverMode] = useState<SilverModeSettings>(defaultSilverMode)
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('skillbridge-user-profile')
    const savedSilverMode = localStorage.getItem('skillbridge-silver-mode')

    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    } else {
      // Default mock user
      setUserProfile({
        id: 'user-1',
        name: '홍길동',
        age: 45,
        birthYear: 1979,
        email: 'hong@example.com',
        primarySkill: '용접',
        experienceYears: 20,
        verification: defaultVerification,
        silverMode: defaultSilverMode
      })
    }

    if (savedSilverMode) {
      const settings = JSON.parse(savedSilverMode)
      setSilverMode(settings)
      applyStyleSettings(settings)
    }
  }, [])

  // Apply silver mode styles
  const applyStyleSettings = (settings: SilverModeSettings) => {
    const root = document.documentElement

    if (settings.enabled) {
      // Font size
      const fontScale = settings.fontSize === 'xlarge' ? 1.4 : settings.fontSize === 'large' ? 1.2 : 1
      root.style.setProperty('--font-scale', String(fontScale))
      root.style.fontSize = `${fontScale * 100}%`

      // High contrast
      if (settings.highContrast) {
        root.classList.add('high-contrast')
      } else {
        root.classList.remove('high-contrast')
      }

      root.classList.add('silver-mode')
    } else {
      root.style.removeProperty('--font-scale')
      root.style.fontSize = ''
      root.classList.remove('silver-mode', 'high-contrast')
    }
  }

  // Save to localStorage whenever profile changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('skillbridge-user-profile', JSON.stringify(userProfile))
    }
  }, [userProfile])

  useEffect(() => {
    localStorage.setItem('skillbridge-silver-mode', JSON.stringify(silverMode))
    applyStyleSettings(silverMode)
  }, [silverMode])

  // Connect to National Fitness 100 (Simulated)
  const connectFitnessData = useCallback(async () => {
    setIsLoading(true)

    // Simulate API call to 국민체력100
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulated verification result
    const fitnessResult: FitnessVerification = {
      verified: true,
      grade: Math.random() > 0.5 ? 1 : Math.random() > 0.5 ? 2 : 3,
      verifiedAt: new Date().toISOString(),
      metrics: {
        cardio: Math.floor(Math.random() * 30) + 70,
        strength: Math.floor(Math.random() * 30) + 70,
        flexibility: Math.floor(Math.random() * 30) + 70,
        balance: Math.floor(Math.random() * 30) + 70
      }
    }

    setUserProfile(prev => {
      if (!prev) return prev
      return {
        ...prev,
        verification: {
          ...prev.verification,
          fitness: fitnessResult
        }
      }
    })

    // Sync with BizWorld (dispatch custom event)
    window.dispatchEvent(new CustomEvent('skillbridge-fitness-verified', {
      detail: { grade: fitnessResult.grade }
    }))

    setIsLoading(false)
  }, [])

  // Verify Career History via Employment 24 (Simulated)
  const verifyCareerHistory = useCallback(async () => {
    setIsLoading(true)

    // Simulate API call to 고용24
    await new Promise(resolve => setTimeout(resolve, 2500))

    // Simulated employment history
    const careerResult: CareerVerification = {
      verified: true,
      totalYears: userProfile?.experienceYears || 15,
      verifiedAt: new Date().toISOString(),
      employmentHistory: [
        {
          company: '현대중공업',
          position: '용접 기술자',
          startDate: '2005-03-01',
          endDate: '2015-02-28',
          verified: true
        },
        {
          company: '삼성중공업',
          position: '용접 팀장',
          startDate: '2015-03-01',
          endDate: '2024-01-15',
          verified: true
        }
      ]
    }

    const isExpert = careerResult.totalYears >= 5

    setUserProfile(prev => {
      if (!prev) return prev
      return {
        ...prev,
        verification: {
          ...prev.verification,
          career: careerResult,
          isExpert
        }
      }
    })

    setIsLoading(false)
  }, [userProfile?.experienceYears])

  // Toggle Silver Mode
  const toggleSilverMode = useCallback(() => {
    setSilverMode(prev => {
      const newEnabled = !prev.enabled
      return {
        ...prev,
        enabled: newEnabled,
        fontSize: newEnabled ? 'large' : 'normal',
        highContrast: newEnabled,
        simplifiedNav: newEnabled,
        ttsEnabled: newEnabled
      }
    })
  }, [])

  // Update specific silver mode settings
  const updateSilverSettings = useCallback((settings: Partial<SilverModeSettings>) => {
    setSilverMode(prev => ({ ...prev, ...settings }))
  }, [])

  // Text-to-Speech
  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('이 브라우저는 음성 지원이 되지 않습니다.')
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ko-KR'
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [])

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  return (
    <VerificationContext.Provider
      value={{
        userProfile,
        silverMode,
        isLoading,
        connectFitnessData,
        verifyCareerHistory,
        toggleSilverMode,
        updateSilverSettings,
        speakText,
        stopSpeaking,
        isSpeaking
      }}
    >
      {children}
    </VerificationContext.Provider>
  )
}

export function useVerification() {
  const context = useContext(VerificationContext)
  if (!context) {
    throw new Error('useVerification must be used within VerificationProvider')
  }
  return context
}

// Helper functions
export function getFitnessGradeBadge(grade: 1 | 2 | 3 | null): { emoji: string; label: string; color: string } {
  switch (grade) {
    case 1:
      return { emoji: '🥇', label: '1등급', color: 'text-amber-500' }
    case 2:
      return { emoji: '🥈', label: '2등급', color: 'text-gray-400' }
    case 3:
      return { emoji: '🥉', label: '3등급', color: 'text-amber-700' }
    default:
      return { emoji: '❓', label: '미인증', color: 'text-gray-400' }
  }
}

export function isEligibleForRegrowth(profile: UserProfile | null): boolean {
  if (!profile) return false
  return profile.age >= 50 || (new Date().getFullYear() - profile.birthYear) >= 50
}

export function getRegrowthRecommendations(profile: UserProfile | null): string[] {
  if (!profile || !isEligibleForRegrowth(profile)) return []

  const recommendations: Record<string, string[]> = {
    '용접': ['산업안전교육 강사', '품질관리 관리자', '기술 컨설턴트', '직업훈련 교사'],
    '안전': ['안전관리 컨설턴트', '위험성평가 전문가', '안전교육 강사', 'ESG 담당자'],
    '품질': ['품질경영 컨설턴트', 'ISO 심사원', '공정개선 전문가', '기술 문서 작성자'],
    '자동화': ['스마트팩토리 컨설턴트', 'PLC 교육강사', '기술영업', 'A/S 매니저']
  }

  return recommendations[profile.primarySkill] || ['경력 컨설턴트', '멘토', '기술 고문']
}
