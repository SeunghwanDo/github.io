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

export interface WorldState {
  inventory: InventoryItem[]
  rooms: Room[]
  currentRoom: string
  coins: number
  syncedAt: Date | null
  hasSyncedSkillBridge: boolean
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
