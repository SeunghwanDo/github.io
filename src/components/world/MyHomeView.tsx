'use client';

import React, { useState } from 'react';
import { ArrowLeft, Award, Sparkles } from 'lucide-react';
import { useWorldStore, skillBridgeTrophies } from '@/stores/worldStore';

interface MyHomeViewProps {
  onBack: () => void;
  onOpenJobTest?: () => void;
}

export default function MyHomeView({ onBack, onOpenJobTest }: MyHomeViewProps) {
  const { state, hasItem, getItemsByCategory } = useWorldStore();
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // 트로피 목록 가져오기
  const trophies = getItemsByCategory('trophy');

  // 아이템 개수 확인 (수량 기반 아이템용)
  const getItemCount = (itemId: string) => {
    const item = state.inventory.find(i => i.id === itemId);
    return item ? 1 : 0;
  };

  // SkillBridge 트로피 렌더링 (금색 용접기, 녹색 십자 등)
  const renderSkillBridgeTrophy = (trophyId: string) => {
    const trophyData = skillBridgeTrophies[trophyId];
    if (!trophyData) return null;

    // 용접 트로피 - 금색 용접기 모양
    if (trophyId === 'trophy_welding') {
      return (
        <div
          className="flex flex-col items-center group cursor-pointer relative"
          onMouseEnter={() => setShowTooltip(trophyId)}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/40 border-2 border-yellow-300 hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-yellow-900" fill="currentColor">
                <path d="M7 5V2a1 1 0 012 0v3h2V2a1 1 0 012 0v3h2V2a1 1 0 012 0v3h1a2 2 0 012 2v2a4 4 0 01-2 3.46V21a1 1 0 01-1 1H7a1 1 0 01-1-1v-8.54A4 4 0 014 9V7a2 2 0 012-2h1z"/>
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-yellow-800" />
            </div>
          </div>
          {/* 툴팁 */}
          {showTooltip === trophyId && (
            <div className="absolute bottom-full mb-2 px-3 py-2 bg-slate-900/95 border border-yellow-500/50 rounded-lg shadow-xl z-50 whitespace-nowrap">
              <p className="text-yellow-400 font-bold text-sm">{trophyData.name}</p>
              <p className="text-fuchsia-400 text-xs">SkillBridge에서 취득한 자격증입니다</p>
            </div>
          )}
        </div>
      );
    }

    // 안전 트로피 - 녹색 십자 마크 상패
    if (trophyId === 'trophy_safety') {
      return (
        <div
          className="flex flex-col items-center group cursor-pointer relative"
          onMouseEnter={() => setShowTooltip(trophyId)}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/40 border-2 border-green-300 hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z"/>
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
              <span className="text-green-800 text-[10px] font-bold">✓</span>
            </div>
          </div>
          {/* 툴팁 */}
          {showTooltip === trophyId && (
            <div className="absolute bottom-full mb-2 px-3 py-2 bg-slate-900/95 border border-green-500/50 rounded-lg shadow-xl z-50 whitespace-nowrap">
              <p className="text-green-400 font-bold text-sm">{trophyData.name}</p>
              <p className="text-fuchsia-400 text-xs">SkillBridge에서 취득한 자격증입니다</p>
            </div>
          )}
        </div>
      );
    }

    // 기타 트로피 (CNC, 스마트팩토리 등)
    return (
      <div
        className="flex flex-col items-center group cursor-pointer relative"
        onMouseEnter={() => setShowTooltip(trophyId)}
        onMouseLeave={() => setShowTooltip(null)}
      >
        <div className="text-5xl drop-shadow-xl hover:scale-110 transition-transform">
          {trophyData.icon}
        </div>
        {showTooltip === trophyId && (
          <div className="absolute bottom-full mb-2 px-3 py-2 bg-slate-900/95 border border-fuchsia-500/50 rounded-lg shadow-xl z-50 whitespace-nowrap">
            <p className="text-white font-bold text-sm">{trophyData.name}</p>
            <p className="text-fuchsia-400 text-xs">SkillBridge에서 취득한 자격증입니다</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full bg-[#fdf6e3] overflow-hidden flex flex-col min-h-screen">

      {/* 상단 네비게이션 */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={onBack}
          className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg font-bold text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> 마을로 돌아가기
        </button>
      </div>

      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <span className="text-yellow-500">🪙</span>
          <span className="font-bold text-slate-700">{state.coins.toLocaleString()}</span>
        </div>
        <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg">
          <span className="font-bold text-slate-700">🏠 나의 작업실</span>
        </div>
      </div>

      {/* === 방 내부 디자인 (CSS로 구현) === */}
      <div className="flex-1 relative flex items-center justify-center">

        {/* 1. 벽면 (Wall) */}
        <div className="absolute top-0 left-0 right-0 h-[65%] bg-[#fffbeb] border-b-8 border-[#e2e8f0] shadow-sm">

          {/* 벽면 장식: 창문 */}
          <div className="absolute top-[15%] left-[10%] w-32 h-40 bg-sky-200 border-8 border-white shadow-inner rounded-lg overflow-hidden">
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-white/50"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-white/50"></div>
            {/* 창밖 풍경 */}
            <div className="absolute top-4 right-4 text-4xl opacity-80">☁️</div>
          </div>

          {/* ===== SkillBridge 트로피 선반 (확장) ===== */}
          <div className="absolute top-[15%] right-[10%] w-80">
            {/* 선반 제목 */}
            <div className="bg-amber-700/90 text-amber-100 px-3 py-1 rounded-t-lg text-sm font-bold flex items-center gap-2">
              <span>🏆</span> SkillBridge 자격증 선반
            </div>
            {/* 선반 본체 */}
            <div className="h-6 bg-amber-800 rounded-b-sm shadow-lg"></div>
            {/* 선반 위 아이템들 */}
            <div className="absolute bottom-8 left-4 right-4 flex gap-4 items-end justify-start">

              {/* SkillBridge 트로피들 (동기화된 자격증) */}
              {trophies.length > 0 ? (
                trophies.map(trophy => (
                  <div key={trophy.id}>
                    {renderSkillBridgeTrophy(trophy.id)}
                  </div>
                ))
              ) : (
                <>
                  {/* 빈 슬롯들 */}
                  <div className="w-14 h-12 border-2 border-dashed border-amber-900/30 rounded flex items-center justify-center text-xs text-amber-900/40 bg-amber-100/30">
                    용접
                  </div>
                  <div className="w-14 h-12 border-2 border-dashed border-amber-900/30 rounded flex items-center justify-center text-xs text-amber-900/40 bg-amber-100/30">
                    안전
                  </div>
                  <div className="w-14 h-12 border-2 border-dashed border-amber-900/30 rounded flex items-center justify-center text-xs text-amber-900/40 bg-amber-100/30">
                    CNC
                  </div>
                </>
              )}

              {/* 기존 상점 아이템들 (item_badge, item_trophy) */}
              {hasItem('item_badge') && (
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-5xl drop-shadow-xl hover:scale-110 transition-transform">⛑️</div>
                  <span className="text-[10px] bg-black/70 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">황금 안전모</span>
                </div>
              )}
              {hasItem('item_trophy') && (
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="text-5xl drop-shadow-xl hover:scale-110 transition-transform">🏆</div>
                  <span className="text-[10px] bg-black/70 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">마스터</span>
                </div>
              )}
            </div>
          </div>

          {/* 벽면 액자 (수료증) */}
          <div className="absolute top-[30%] left-[30%] w-24 h-32 bg-white border-4 border-slate-800 shadow-md flex items-center justify-center transform rotate-3">
            <Award className="w-10 h-10 text-slate-300" />
          </div>
        </div>

        {/* 2. 바닥 (Floor) */}
        <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-[#f5deb3] relative">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(45deg, #e6cd9e 25%, transparent 25%, transparent 75%, #e6cd9e 75%, #e6cd9e), linear-gradient(45deg, #e6cd9e 25%, transparent 25%, transparent 75%, #e6cd9e 75%, #e6cd9e)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px', opacity: 0.3 }}></div>
        </div>

        {/* 3. 책상 (Desk) */}
        <div className="absolute bottom-[20%] w-[600px] h-40 bg-white border-t-8 border-slate-200 shadow-2xl rounded-t-lg z-10 flex items-end justify-around px-10 pb-4">

          {/* 컴퓨터 (클릭 시 업무/테스트) */}
          <div
            onClick={onOpenJobTest}
            className="relative cursor-pointer group flex flex-col items-center"
          >
            <div className="w-32 h-24 bg-slate-800 rounded-t-lg border-4 border-slate-700 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-900/50 animate-pulse"></div>
              <code className="text-[8px] text-green-400 z-10 p-2">
                System.init()...<br/>Target: Employment
              </code>
            </div>
            <div className="w-40 h-4 bg-slate-400 rounded-b-lg shadow-md"></div>
            <div className="w-12 h-8 bg-slate-500 mt-[-4px]"></div>
            <div className="w-24 h-2 bg-slate-600 rounded-full mt-[-2px] shadow-lg"></div>

            {/* 툴팁 */}
            <div className="absolute -top-12 bg-white px-3 py-1 rounded-full shadow-lg text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0">
              💻 업무/테스트 시작
            </div>
          </div>

          {/* 커피/치킨 응모권 (구매 시 책상 위에 쌓임) */}
          <div className="relative group">
            <div className="flex -space-x-4">
              {hasItem('sb_coffee') && <div className="text-4xl drop-shadow-lg transform -rotate-12 z-10">☕</div>}
              {hasItem('sb_chicken') && <div className="text-4xl drop-shadow-lg transform rotate-12 z-20">🍗</div>}
              {hasItem('sb_movie') && <div className="text-4xl drop-shadow-lg transform -rotate-6 z-0">🎬</div>}
            </div>
            {(hasItem('sb_coffee') || hasItem('sb_chicken') || hasItem('sb_movie')) && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg text-xs font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity w-32 text-center">
                🎟️ 응모권 보관 중
              </div>
            )}
          </div>

          {/* 책장/서류 */}
          <div className="flex items-end gap-1">
            <div className="w-4 h-16 bg-red-500 rounded-sm"></div>
            <div className="w-4 h-20 bg-blue-500 rounded-sm"></div>
            <div className="w-4 h-14 bg-green-500 rounded-sm"></div>
          </div>
        </div>

        {/* 4. 의자 */}
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-24 h-32 bg-slate-700 rounded-t-xl z-20 shadow-xl border-b-8 border-slate-600"></div>

        {/* SkillBridge 연동 상태 표시 */}
        {state.hasSyncedSkillBridge && (
          <div className="absolute bottom-4 right-4 bg-green-500/90 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-30">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">SkillBridge 연동됨</span>
          </div>
        )}
      </div>
    </div>
  );
}
