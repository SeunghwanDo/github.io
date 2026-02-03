'use client'

import { useState } from 'react'
import { Home, Package, Settings, ChevronLeft, Sparkles } from 'lucide-react'
import { useWorldStore, skillBridgeTrophies } from '@/stores/worldStore'

interface MyHomeViewProps {
  onBack: () => void
}

export default function MyHomeView({ onBack }: MyHomeViewProps) {
  const { state, getItemsByCategory, hasItem } = useWorldStore()
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  const trophies = getItemsByCategory('trophy')
  const furniture = getItemsByCategory('furniture')
  const decorations = getItemsByCategory('decoration')

  // 트로피 아이콘 렌더링 (특수 스타일)
  const renderTrophyIcon = (trophyId: string) => {
    const trophy = skillBridgeTrophies[trophyId]
    if (!trophy) return null

    const metadata = trophy.metadata as { color?: string; shape?: string } | undefined

    // 용접 트로피 - 금색 용접기 모양
    if (trophyId === 'trophy_welding') {
      return (
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/30 border-2 border-yellow-300">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-yellow-900" fill="currentColor">
              <path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"/>
              <path d="M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h6v2h-6zm0 4h6v2h-6zm0 4h6v2h-6z"/>
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-yellow-800" />
          </div>
        </div>
      )
    }

    // 안전 트로피 - 녹색 십자 마크
    if (trophyId === 'trophy_safety') {
      return (
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/30 border-2 border-green-300">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="currentColor">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z"/>
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
            <span className="text-green-800 text-xs font-bold">+</span>
          </div>
        </div>
      )
    }

    // CNC 트로피
    if (trophyId === 'trophy_cnc') {
      return (
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-300 via-gray-400 to-slate-500 rounded-lg flex items-center justify-center shadow-lg shadow-slate-500/30 border-2 border-slate-300">
            <span className="text-3xl">⚙️</span>
          </div>
        </div>
      )
    }

    // 스마트팩토리 트로피
    if (trophyId === 'trophy_smartfactory') {
      return (
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 via-fuchsia-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30 border-2 border-purple-300 animate-pulse">
            <span className="text-3xl">💎</span>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-purple-800" />
          </div>
        </div>
      )
    }

    // 기본 트로피 아이콘
    return (
      <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
        <span className="text-3xl">{trophy.icon}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* 헤더 */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            타운으로 돌아가기
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 rounded-lg">
              <span className="text-yellow-400">🪙</span>
              <span className="text-yellow-400 font-medium">{state.coins.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 방 제목 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-fuchsia-500/20 rounded-xl">
            <Home className="w-8 h-8 text-fuchsia-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">마이홈</h1>
            <p className="text-slate-400">나만의 공간을 꾸며보세요</p>
          </div>
        </div>

        {/* 방 뷰 */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 메인 방 영역 */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 relative overflow-hidden min-h-[500px]">
              {/* 방 배경 */}
              <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 to-slate-800/50" />

              {/* 벽 */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-700 to-transparent" />

              {/* 바닥 */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-900/30 to-transparent" />

              {/* ===== 트로피 선반 영역 ===== */}
              <div className="relative z-10 mb-6">
                <div className="bg-gradient-to-r from-amber-800/80 via-amber-700/80 to-amber-800/80 rounded-xl p-4 border border-amber-600/50 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">🏆</span>
                    <h3 className="text-amber-200 font-semibold">트로피 선반</h3>
                    <span className="text-amber-400/70 text-sm">
                      (SkillBridge 자격증 보상)
                    </span>
                  </div>

                  {/* 선반 (트로피 진열) */}
                  <div className="bg-amber-900/50 rounded-lg p-4 min-h-[100px]">
                    {trophies.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-amber-400/50 text-sm">
                        SkillBridge에서 자격증을 취득하면 트로피가 이곳에 진열됩니다
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-4">
                        {trophies.map(trophy => (
                          <div
                            key={trophy.id}
                            className="relative cursor-pointer transform hover:scale-110 transition-transform"
                            onMouseEnter={() => setShowTooltip(trophy.id)}
                            onMouseLeave={() => setShowTooltip(null)}
                            onClick={() => setSelectedItem(trophy.id)}
                          >
                            {renderTrophyIcon(trophy.id)}

                            {/* 툴팁 */}
                            {showTooltip === trophy.id && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-20 whitespace-nowrap">
                                <p className="text-white font-medium text-sm">{trophy.name}</p>
                                <p className="text-fuchsia-400 text-xs">SkillBridge에서 취득한 자격증입니다</p>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                                  <div className="border-4 border-transparent border-t-slate-900" />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 가구 영역 */}
              <div className="relative z-10 grid grid-cols-2 gap-4">
                {/* 침대 */}
                {hasItem('bed_basic') && (
                  <div className="bg-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-4xl">🛏️</span>
                    <div>
                      <p className="text-white font-medium">기본 침대</p>
                      <p className="text-slate-400 text-sm">편안한 휴식 공간</p>
                    </div>
                  </div>
                )}

                {/* 책상 */}
                {hasItem('desk_basic') && (
                  <div className="bg-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-4xl">🪑</span>
                    <div>
                      <p className="text-white font-medium">기본 책상</p>
                      <p className="text-slate-400 text-sm">학습 공간</p>
                    </div>
                  </div>
                )}

                {/* 화분 */}
                {hasItem('plant_small') && (
                  <div className="bg-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-4xl">🪴</span>
                    <div>
                      <p className="text-white font-medium">작은 화분</p>
                      <p className="text-slate-400 text-sm">싱그러운 인테리어</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 인벤토리 사이드바 */}
          <div className="space-y-4">
            {/* 인벤토리 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-fuchsia-400" />
                <h3 className="text-white font-semibold">인벤토리</h3>
                <span className="text-slate-500 text-sm">({state.inventory.length})</span>
              </div>

              {/* 카테고리별 아이템 */}
              <div className="space-y-4">
                {/* 트로피 */}
                {trophies.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">트로피 ({trophies.length})</p>
                    <div className="grid grid-cols-4 gap-2">
                      {trophies.map(item => (
                        <div
                          key={item.id}
                          className={`aspect-square bg-slate-700/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors ${
                            selectedItem === item.id ? 'ring-2 ring-fuchsia-500' : ''
                          }`}
                          onClick={() => setSelectedItem(item.id)}
                          title={item.name}
                        >
                          <span className="text-2xl">{item.icon}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 가구 */}
                {furniture.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">가구 ({furniture.length})</p>
                    <div className="grid grid-cols-4 gap-2">
                      {furniture.map(item => (
                        <div
                          key={item.id}
                          className={`aspect-square bg-slate-700/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors ${
                            selectedItem === item.id ? 'ring-2 ring-fuchsia-500' : ''
                          }`}
                          onClick={() => setSelectedItem(item.id)}
                          title={item.name}
                        >
                          <span className="text-2xl">{item.icon}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 장식 */}
                {decorations.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">장식 ({decorations.length})</p>
                    <div className="grid grid-cols-4 gap-2">
                      {decorations.map(item => (
                        <div
                          key={item.id}
                          className={`aspect-square bg-slate-700/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors ${
                            selectedItem === item.id ? 'ring-2 ring-fuchsia-500' : ''
                          }`}
                          onClick={() => setSelectedItem(item.id)}
                          title={item.name}
                        >
                          <span className="text-2xl">{item.icon}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 선택된 아이템 정보 */}
            {selectedItem && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                {(() => {
                  const item = state.inventory.find(i => i.id === selectedItem)
                  if (!item) return null
                  return (
                    <>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">{item.icon}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{item.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            item.rarity === 'legendary' ? 'bg-purple-500/20 text-purple-400' :
                            item.rarity === 'epic' ? 'bg-fuchsia-500/20 text-fuchsia-400' :
                            item.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-slate-600/50 text-slate-400'
                          }`}>
                            {item.rarity === 'legendary' ? '전설' :
                             item.rarity === 'epic' ? '영웅' :
                             item.rarity === 'rare' ? '희귀' : '일반'}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm">{item.description}</p>
                      {item.source === 'skillbridge' && (
                        <div className="mt-3 px-3 py-2 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-lg">
                          <p className="text-fuchsia-400 text-xs">
                            🎓 SkillBridge에서 취득한 자격증입니다
                          </p>
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
