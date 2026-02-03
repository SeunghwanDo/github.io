'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Home, Store, Users, Briefcase, GraduationCap, Map,
  Loader2, Sparkles
} from 'lucide-react'
import { useWorldStore } from '@/stores/worldStore'
import MyHomeView from './MyHomeView'

// 타운 존 타입
interface TownZone {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  isAvailable: boolean
}

// 타운 존 정의
const townZones: TownZone[] = [
  {
    id: 'home',
    name: '마이홈',
    description: '나만의 공간을 꾸미고 트로피를 진열하세요',
    icon: <Home className="w-8 h-8" />,
    color: 'from-fuchsia-500 to-purple-600',
    position: { x: 15, y: 20 },
    size: { width: 25, height: 30 },
    isAvailable: true,
  },
  {
    id: 'shop',
    name: '아이템 상점',
    description: '가구와 장식품을 구매하세요',
    icon: <Store className="w-8 h-8" />,
    color: 'from-amber-500 to-orange-600',
    position: { x: 60, y: 20 },
    size: { width: 25, height: 30 },
    isAvailable: false,
  },
  {
    id: 'plaza',
    name: '중앙 광장',
    description: '다른 유저들과 소통하세요',
    icon: <Users className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-600',
    position: { x: 37, y: 55 },
    size: { width: 26, height: 25 },
    isAvailable: false,
  },
  {
    id: 'office',
    name: '커리어 센터',
    description: '취업 정보와 채용 공고를 확인하세요',
    icon: <Briefcase className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-600',
    position: { x: 10, y: 60 },
    size: { width: 22, height: 25 },
    isAvailable: false,
  },
  {
    id: 'academy',
    name: '교육관',
    description: 'SkillBridge 교육 과정을 확인하세요',
    icon: <GraduationCap className="w-8 h-8" />,
    color: 'from-violet-500 to-indigo-600',
    position: { x: 68, y: 60 },
    size: { width: 22, height: 25 },
    isAvailable: false,
  },
]

export default function TownMap() {
  const { state, syncExternalData } = useWorldStore()
  const [currentView, setCurrentView] = useState<'town' | 'home' | 'shop' | 'plaza' | 'office' | 'academy'>('town')
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const hasSyncedRef = useRef(false)

  // 존 클릭 핸들러
  const handleZoneClick = async (zoneId: string) => {
    const zone = townZones.find(z => z.id === zoneId)
    if (!zone || !zone.isAvailable) return

    // 마이홈 입장 시 SkillBridge 데이터 동기화 (최초 1회)
    if (zoneId === 'home' && !hasSyncedRef.current && !state.hasSyncedSkillBridge) {
      setIsSyncing(true)
      hasSyncedRef.current = true

      try {
        await syncExternalData()
      } catch (error) {
        console.error('Failed to sync external data:', error)
      } finally {
        setIsSyncing(false)
      }
    }

    setCurrentView(zoneId as typeof currentView)
  }

  // 타운으로 돌아가기
  const handleBackToTown = () => {
    setCurrentView('town')
  }

  // 동기화 로딩 화면
  if (isSyncing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <Loader2 className="w-8 h-8 text-fuchsia-400 absolute -bottom-2 -right-2 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">SkillBridge 데이터 동기화 중...</h2>
          <p className="text-slate-400">자격증 정보를 불러오고 있습니다</p>
        </div>
      </div>
    )
  }

  // 마이홈 뷰
  if (currentView === 'home') {
    return <MyHomeView onBack={handleBackToTown} />
  }

  // 타운맵 뷰
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* 헤더 */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-fuchsia-500/20 rounded-xl">
              <Map className="w-6 h-6 text-fuchsia-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">BizWorld</h1>
              <p className="text-slate-400 text-sm">메타버스 타운</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 rounded-lg">
              <span className="text-yellow-400">🪙</span>
              <span className="text-yellow-400 font-medium">{state.coins.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 타운맵 */}
        <div className="relative bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden" style={{ height: '600px' }}>
          {/* 맵 배경 */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-slate-800 to-blue-900/20" />

          {/* 길 */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* 수평 도로 */}
              <rect x="0" y="45" width="100" height="10" fill="rgba(100, 116, 139, 0.3)" />
              {/* 수직 도로 */}
              <rect x="45" y="0" width="10" height="100" fill="rgba(100, 116, 139, 0.3)" />
            </svg>
          </div>

          {/* 존 */}
          {townZones.map(zone => (
            <div
              key={zone.id}
              className={`absolute cursor-pointer transition-all duration-300 ${
                zone.isAvailable
                  ? 'hover:scale-105 hover:z-10'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              style={{
                left: `${zone.position.x}%`,
                top: `${zone.position.y}%`,
                width: `${zone.size.width}%`,
                height: `${zone.size.height}%`,
              }}
              onClick={() => handleZoneClick(zone.id)}
              onMouseEnter={() => setHoveredZone(zone.id)}
              onMouseLeave={() => setHoveredZone(null)}
            >
              {/* 존 배경 */}
              <div className={`w-full h-full bg-gradient-to-br ${zone.color} rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 p-4 ${
                zone.isAvailable ? 'ring-2 ring-white/20' : ''
              }`}>
                <div className="text-white/90">
                  {zone.icon}
                </div>
                <span className="text-white font-semibold text-center">{zone.name}</span>
                {!zone.isAvailable && (
                  <span className="text-white/60 text-xs">준비중</span>
                )}
              </div>

              {/* 호버 툴팁 */}
              {hoveredZone === zone.id && zone.isAvailable && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-20 whitespace-nowrap">
                  <p className="text-white font-medium">{zone.name}</p>
                  <p className="text-slate-400 text-sm">{zone.description}</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2">
                    <div className="border-8 border-transparent border-t-slate-900" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 맵 범례 */}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-700 rounded-xl p-3">
            <p className="text-slate-400 text-xs mb-2">빌딩을 클릭하여 입장하세요</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded" />
              <span className="text-slate-300 text-xs">이용 가능</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-3 h-3 bg-slate-600 rounded opacity-50" />
              <span className="text-slate-500 text-xs">준비중</span>
            </div>
          </div>

          {/* SkillBridge 동기화 상태 */}
          {state.hasSyncedSkillBridge && (
            <div className="absolute bottom-4 right-4 bg-green-500/20 border border-green-500/50 rounded-xl px-3 py-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">SkillBridge 연동됨</span>
              </div>
            </div>
          )}
        </div>

        {/* 안내 문구 */}
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            🏠 <span className="text-fuchsia-400 font-medium">마이홈</span>에 입장하면 SkillBridge 자격증이 자동으로 동기화됩니다
          </p>
        </div>
      </div>
    </div>
  )
}
