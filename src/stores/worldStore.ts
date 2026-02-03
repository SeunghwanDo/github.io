'use client'

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react'

// 아이템 타입 정의
export interface InventoryItem {
  id: string
  name: string
  description: string
  icon: string
  category: 'furniture' | 'trophy' | 'decoration' | 'clothing'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  source?: string // 아이템 출처 (예: 'skillbridge', 'shop', 'event')
  obtainedAt: Date
  metadata?: Record<string, unknown>
}

export interface PlacedItem {
  itemId: string
  position: { x: number; y: number }
  rotation?: number
}

export interface Room {
  id: string
  name: string
  placedItems: PlacedItem[]
}

// 아바타 오라/효과 타입
export interface AvatarAura {
  id: string
  name: string
  description: string
  effect: 'healthy' | 'muscular' | 'expert' | 'legend' | 'regrowth'
  color: string
  source: string
  unlockedAt: Date
}

export interface WorldState {
  inventory: InventoryItem[]
  rooms: Room[]
  currentRoom: string
  coins: number
  syncedAt: Date | null
  hasSyncedSkillBridge: boolean
  // 아바타 효과
  avatarAuras: AvatarAura[]
  fitnessGrade: 1 | 2 | 3 | null
  isVerifiedExpert: boolean
}

// 기본 인벤토리 아이템
const defaultInventoryItems: InventoryItem[] = [
  {
    id: 'bed_basic',
    name: '기본 침대',
    description: '편안한 기본 침대입니다.',
    icon: '🛏️',
    category: 'furniture',
    rarity: 'common',
    source: 'starter',
    obtainedAt: new Date(),
  },
  {
    id: 'desk_basic',
    name: '기본 책상',
    description: '공부와 작업을 위한 책상입니다.',
    icon: '🪑',
    category: 'furniture',
    rarity: 'common',
    source: 'starter',
    obtainedAt: new Date(),
  },
  {
    id: 'plant_small',
    name: '작은 화분',
    description: '방에 생기를 더해주는 작은 식물입니다.',
    icon: '🪴',
    category: 'decoration',
    rarity: 'common',
    source: 'starter',
    obtainedAt: new Date(),
  },
]

// 기본 방 설정
const defaultRooms: Room[] = [
  {
    id: 'main_room',
    name: '메인 룸',
    placedItems: [
      { itemId: 'bed_basic', position: { x: 20, y: 60 } },
      { itemId: 'desk_basic', position: { x: 70, y: 30 } },
    ],
  },
]

// 국민체력100 인증 배지/아이템 정의
export const fitnessBadges: Record<number, Omit<InventoryItem, 'obtainedAt'>> = {
  1: {
    id: 'fitness_grade_1',
    name: '국민체력100 1등급',
    description: '최고 수준의 체력을 인증받았습니다. 아바타에 "건강한 빛" 오라가 적용됩니다.',
    icon: '🥇',
    category: 'trophy',
    rarity: 'legendary',
    source: 'fitness100',
    metadata: {
      grade: 1,
      auraEffect: 'muscular',
      auraColor: '#FFD700'
    }
  },
  2: {
    id: 'fitness_grade_2',
    name: '국민체력100 2등급',
    description: '우수한 체력을 인증받았습니다. 아바타에 "활력" 오라가 적용됩니다.',
    icon: '🥈',
    category: 'trophy',
    rarity: 'epic',
    source: 'fitness100',
    metadata: {
      grade: 2,
      auraEffect: 'healthy',
      auraColor: '#C0C0C0'
    }
  },
  3: {
    id: 'fitness_grade_3',
    name: '국민체력100 3등급',
    description: '양호한 체력을 인증받았습니다.',
    icon: '🥉',
    category: 'trophy',
    rarity: 'rare',
    source: 'fitness100',
    metadata: {
      grade: 3,
      auraEffect: 'healthy',
      auraColor: '#CD7F32'
    }
  }
}

// 검증된 전문가 배지
export const expertBadge: Omit<InventoryItem, 'obtainedAt'> = {
  id: 'verified_expert',
  name: '검증된 전문가',
  description: '고용24를 통해 5년 이상의 경력이 공식 인증되었습니다.',
  icon: '✅',
  category: 'trophy',
  rarity: 'epic',
  source: 'employment24',
  metadata: {
    verified: true,
    auraEffect: 'expert',
    auraColor: '#4F46E5'
  }
}

// SkillBridge 자격증 트로피 아이템 정의
export const skillBridgeTrophies: Record<string, Omit<InventoryItem, 'obtainedAt'>> = {
  trophy_welding: {
    id: 'trophy_welding',
    name: '용접 마스터 트로피',
    description: 'SkillBridge에서 용접 기능사 자격증을 취득하여 받은 금빛 트로피입니다.',
    icon: '🏆',
    category: 'trophy',
    rarity: 'epic',
    source: 'skillbridge',
    metadata: {
      certification: '용접 기능사',
      color: 'gold',
      shape: 'welding_torch',
    },
  },
  trophy_safety: {
    id: 'trophy_safety',
    name: '안전 지킴이 상패',
    description: 'SkillBridge에서 안전 관리자 과정을 수료하여 받은 녹색 십자 상패입니다.',
    icon: '🛡️',
    category: 'trophy',
    rarity: 'rare',
    source: 'skillbridge',
    metadata: {
      certification: '안전 관리자',
      color: 'green',
      shape: 'cross_shield',
    },
  },
  trophy_cnc: {
    id: 'trophy_cnc',
    name: 'CNC 장인 트로피',
    description: 'SkillBridge에서 CNC 가공 마스터 과정을 수료하여 받은 은빛 트로피입니다.',
    icon: '⚙️',
    category: 'trophy',
    rarity: 'epic',
    source: 'skillbridge',
    metadata: {
      certification: 'CNC 가공 마스터',
      color: 'silver',
      shape: 'gear',
    },
  },
  trophy_smartfactory: {
    id: 'trophy_smartfactory',
    name: '스마트팩토리 전문가 상',
    description: 'SkillBridge에서 스마트팩토리 전문가 과정을 수료하여 받은 크리스탈 상패입니다.',
    icon: '💎',
    category: 'trophy',
    rarity: 'legendary',
    source: 'skillbridge',
    metadata: {
      certification: '스마트팩토리 전문가',
      color: 'crystal',
      shape: 'diamond',
    },
  },
}

// 가상의 SkillBridge 자격증 데이터 (시뮬레이션)
const simulatedSkillBridgeCertifications = [
  { id: 'welding_cert', name: '용접 기능사', trophyId: 'trophy_welding' },
  { id: 'safety_cert', name: '안전 관리자', trophyId: 'trophy_safety' },
]

// 초기 상태
const initialState: WorldState = {
  inventory: defaultInventoryItems,
  rooms: defaultRooms,
  currentRoom: 'main_room',
  coins: 1000,
  syncedAt: null,
  hasSyncedSkillBridge: false,
  avatarAuras: [],
  fitnessGrade: null,
  isVerifiedExpert: false,
}

// Context 타입
interface WorldContextType {
  state: WorldState
  loading: boolean
  // 인벤토리 액션
  addToInventory: (item: InventoryItem) => void
  removeFromInventory: (itemId: string) => void
  hasItem: (itemId: string) => boolean
  getItemsByCategory: (category: InventoryItem['category']) => InventoryItem[]
  // 방 액션
  placeItem: (roomId: string, itemId: string, position: { x: number; y: number }) => void
  removeItemFromRoom: (roomId: string, itemId: string) => void
  setCurrentRoom: (roomId: string) => void
  // SkillBridge 연동
  syncExternalData: () => Promise<void>
  // 국민체력100 / 고용24 연동
  syncFitnessGrade: (grade: 1 | 2 | 3) => void
  syncExpertVerification: () => void
  // 아바타 오라
  getActiveAuras: () => AvatarAura[]
  // 기타
  addCoins: (amount: number) => void
  spendCoins: (amount: number) => boolean
}

const WorldContext = createContext<WorldContextType | null>(null)

// Provider 컴포넌트
export function WorldProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorldState>(initialState)
  const [loading, setLoading] = useState(true)

  // localStorage에서 상태 로드
  useEffect(() => {
    const savedState = localStorage.getItem('bizworld_state')
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        setState({
          ...parsed,
          syncedAt: parsed.syncedAt ? new Date(parsed.syncedAt) : null,
          inventory: parsed.inventory.map((item: InventoryItem) => ({
            ...item,
            obtainedAt: new Date(item.obtainedAt),
          })),
        })
      } catch (error) {
        console.error('Failed to parse saved world state:', error)
      }
    }
    setLoading(false)
  }, [])

  // 상태 변경 시 localStorage에 저장
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('bizworld_state', JSON.stringify(state))
    }
  }, [state, loading])

  // 인벤토리에 아이템 추가
  const addToInventory = useCallback((item: InventoryItem) => {
    setState(prev => {
      // 이미 있는 아이템인지 확인
      if (prev.inventory.some(i => i.id === item.id)) {
        return prev
      }
      return {
        ...prev,
        inventory: [...prev.inventory, item],
      }
    })
  }, [])

  // 인벤토리에서 아이템 제거
  const removeFromInventory = useCallback((itemId: string) => {
    setState(prev => ({
      ...prev,
      inventory: prev.inventory.filter(item => item.id !== itemId),
    }))
  }, [])

  // 아이템 보유 여부 확인
  const hasItem = useCallback((itemId: string) => {
    return state.inventory.some(item => item.id === itemId)
  }, [state.inventory])

  // 카테고리별 아이템 조회
  const getItemsByCategory = useCallback((category: InventoryItem['category']) => {
    return state.inventory.filter(item => item.category === category)
  }, [state.inventory])

  // 방에 아이템 배치
  const placeItem = useCallback((roomId: string, itemId: string, position: { x: number; y: number }) => {
    setState(prev => ({
      ...prev,
      rooms: prev.rooms.map(room => {
        if (room.id === roomId) {
          // 이미 배치된 아이템이면 위치만 업데이트
          const existingIndex = room.placedItems.findIndex(p => p.itemId === itemId)
          if (existingIndex >= 0) {
            const newPlacedItems = [...room.placedItems]
            newPlacedItems[existingIndex] = { ...newPlacedItems[existingIndex], position }
            return { ...room, placedItems: newPlacedItems }
          }
          // 새로 배치
          return {
            ...room,
            placedItems: [...room.placedItems, { itemId, position }],
          }
        }
        return room
      }),
    }))
  }, [])

  // 방에서 아이템 제거
  const removeItemFromRoom = useCallback((roomId: string, itemId: string) => {
    setState(prev => ({
      ...prev,
      rooms: prev.rooms.map(room => {
        if (room.id === roomId) {
          return {
            ...room,
            placedItems: room.placedItems.filter(p => p.itemId !== itemId),
          }
        }
        return room
      }),
    }))
  }, [])

  // 현재 방 변경
  const setCurrentRoom = useCallback((roomId: string) => {
    setState(prev => ({ ...prev, currentRoom: roomId }))
  }, [])

  // SkillBridge 데이터 동기화
  const syncExternalData = useCallback(async () => {
    // 이미 동기화했으면 스킵
    if (state.hasSyncedSkillBridge) {
      return
    }

    // 시뮬레이션: API 호출 대기 효과
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 가상의 SkillBridge 데이터에서 자격증 확인 및 트로피 추가
    const newTrophies: InventoryItem[] = []

    for (const cert of simulatedSkillBridgeCertifications) {
      const trophyData = skillBridgeTrophies[cert.trophyId]
      if (trophyData && !state.inventory.some(item => item.id === cert.trophyId)) {
        newTrophies.push({
          ...trophyData,
          obtainedAt: new Date(),
        })
      }
    }

    if (newTrophies.length > 0) {
      setState(prev => ({
        ...prev,
        inventory: [...prev.inventory, ...newTrophies],
        syncedAt: new Date(),
        hasSyncedSkillBridge: true,
      }))

      // 알림 표시
      alert(`🎉 SkillBridge 데이터 동기화 완료!\n\n자격증 보상이 도착했습니다:\n${newTrophies.map(t => `• ${t.name}`).join('\n')}\n\n마이홈 선반에서 트로피를 확인하세요!`)
    } else {
      setState(prev => ({
        ...prev,
        syncedAt: new Date(),
        hasSyncedSkillBridge: true,
      }))
    }
  }, [state.hasSyncedSkillBridge, state.inventory])

  // 국민체력100 등급 동기화
  const syncFitnessGrade = useCallback((grade: 1 | 2 | 3) => {
    const badgeData = fitnessBadges[grade]
    if (!badgeData) return

    const newBadge: InventoryItem = {
      ...badgeData,
      obtainedAt: new Date()
    }

    const newAura: AvatarAura = {
      id: `fitness_aura_${grade}`,
      name: grade === 1 ? '건강한 빛' : grade === 2 ? '활력의 빛' : '건강 인증',
      description: `국민체력100 ${grade}등급 인증으로 획득한 아바타 효과입니다.`,
      effect: grade === 1 ? 'muscular' : 'healthy',
      color: badgeData.metadata?.auraColor as string || '#FFD700',
      source: 'fitness100',
      unlockedAt: new Date()
    }

    setState(prev => {
      // 이미 있으면 스킵
      if (prev.fitnessGrade === grade) return prev

      // 기존 체력 배지 제거 후 새로 추가
      const filteredInventory = prev.inventory.filter(item => !item.id.startsWith('fitness_grade_'))
      const filteredAuras = prev.avatarAuras.filter(aura => !aura.id.startsWith('fitness_aura_'))

      return {
        ...prev,
        inventory: [...filteredInventory, newBadge],
        avatarAuras: [...filteredAuras, newAura],
        fitnessGrade: grade
      }
    })

    // 알림
    alert(`🎉 BizWorld 연동 완료!\n\n국민체력100 ${grade}등급 배지가 인벤토리에 추가되었습니다.\n아바타에 "${grade === 1 ? '건강한 빛' : '활력의 빛'}" 오라가 적용됩니다!`)
  }, [])

  // 검증된 전문가 동기화
  const syncExpertVerification = useCallback(() => {
    const newBadge: InventoryItem = {
      ...expertBadge,
      obtainedAt: new Date()
    }

    const newAura: AvatarAura = {
      id: 'expert_aura',
      name: '전문가의 기운',
      description: '고용24를 통해 경력이 검증된 전문가에게 부여되는 오라입니다.',
      effect: 'expert',
      color: '#4F46E5',
      source: 'employment24',
      unlockedAt: new Date()
    }

    setState(prev => {
      if (prev.isVerifiedExpert) return prev

      return {
        ...prev,
        inventory: [...prev.inventory, newBadge],
        avatarAuras: [...prev.avatarAuras, newAura],
        isVerifiedExpert: true
      }
    })

    alert(`🎉 BizWorld 연동 완료!\n\n"검증된 전문가" 배지가 인벤토리에 추가되었습니다.\n아바타에 "전문가의 기운" 오라가 적용됩니다!`)
  }, [])

  // 활성화된 오라 목록
  const getActiveAuras = useCallback(() => {
    return state.avatarAuras
  }, [state.avatarAuras])

  // SkillBridge 이벤트 리스너 (체력 인증 동기화)
  useEffect(() => {
    const handleFitnessVerified = (event: CustomEvent<{ grade: 1 | 2 | 3 }>) => {
      syncFitnessGrade(event.detail.grade)
    }

    const handleExpertVerified = () => {
      syncExpertVerification()
    }

    window.addEventListener('skillbridge-fitness-verified', handleFitnessVerified as EventListener)
    window.addEventListener('skillbridge-expert-verified', handleExpertVerified)

    return () => {
      window.removeEventListener('skillbridge-fitness-verified', handleFitnessVerified as EventListener)
      window.removeEventListener('skillbridge-expert-verified', handleExpertVerified)
    }
  }, [syncFitnessGrade, syncExpertVerification])

  // 코인 추가
  const addCoins = useCallback((amount: number) => {
    setState(prev => ({ ...prev, coins: prev.coins + amount }))
  }, [])

  // 코인 사용
  const spendCoins = useCallback((amount: number) => {
    if (state.coins < amount) return false
    setState(prev => ({ ...prev, coins: prev.coins - amount }))
    return true
  }, [state.coins])

  const value: WorldContextType = {
    state,
    loading,
    addToInventory,
    removeFromInventory,
    hasItem,
    getItemsByCategory,
    placeItem,
    removeItemFromRoom,
    setCurrentRoom,
    syncExternalData,
    syncFitnessGrade,
    syncExpertVerification,
    getActiveAuras,
    addCoins,
    spendCoins,
  }

  return (
    <WorldContext.Provider value={value}>
      {children}
    </WorldContext.Provider>
  )
}

// 커스텀 훅
export function useWorldStore() {
  const context = useContext(WorldContext)
  if (!context) {
    throw new Error('useWorldStore must be used within a WorldProvider')
  }
  return context
}
