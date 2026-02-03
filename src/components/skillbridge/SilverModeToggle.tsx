'use client'

import { useState } from 'react'
import {
  Eye, Type, Sun, Navigation, Volume2, Settings,
  ChevronDown, Check, X
} from 'lucide-react'
import { useVerification } from '@/hooks/useVerification'

interface SilverModeToggleProps {
  variant?: 'compact' | 'full'
}

export default function SilverModeToggle({ variant = 'compact' }: SilverModeToggleProps) {
  const { silverMode, toggleSilverMode, updateSilverSettings } = useVerification()
  const [showSettings, setShowSettings] = useState(false)

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            silverMode.enabled
              ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title="실버 모드 (큰 글씨)"
        >
          <Eye className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">
            {silverMode.enabled ? '실버 모드 ON' : '실버 모드'}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Settings */}
        {showSettings && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowSettings(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">
              <div className="p-4 border-b bg-amber-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-gray-900">실버 모드</span>
                  </div>
                  <button
                    onClick={toggleSilverMode}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      silverMode.enabled ? 'bg-amber-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      silverMode.enabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  시니어 사용자를 위한 접근성 향상
                </p>
              </div>

              <div className="p-4 space-y-4">
                {/* Font Size */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Type className="w-4 h-4" />
                    글씨 크기
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: 'normal', label: '보통', size: 'text-sm' },
                      { value: 'large', label: '크게', size: 'text-base' },
                      { value: 'xlarge', label: '매우 크게', size: 'text-lg' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateSilverSettings({
                          fontSize: option.value as 'normal' | 'large' | 'xlarge',
                          enabled: option.value !== 'normal' || silverMode.enabled
                        })}
                        className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all ${option.size} ${
                          silverMode.fontSize === option.value
                            ? 'border-amber-500 bg-amber-50 text-amber-800'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Sun className="w-4 h-4" />
                    고대비 모드
                  </label>
                  <button
                    onClick={() => updateSilverSettings({
                      highContrast: !silverMode.highContrast,
                      enabled: !silverMode.highContrast || silverMode.enabled
                    })}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      silverMode.highContrast ? 'bg-amber-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      silverMode.highContrast ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                {/* Simplified Navigation */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Navigation className="w-4 h-4" />
                    간편 메뉴
                  </label>
                  <button
                    onClick={() => updateSilverSettings({
                      simplifiedNav: !silverMode.simplifiedNav,
                      enabled: !silverMode.simplifiedNav || silverMode.enabled
                    })}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      silverMode.simplifiedNav ? 'bg-amber-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      silverMode.simplifiedNav ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                {/* TTS */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Volume2 className="w-4 h-4" />
                    음성 읽기 (TTS)
                  </label>
                  <button
                    onClick={() => updateSilverSettings({
                      ttsEnabled: !silverMode.ttsEnabled,
                      enabled: !silverMode.ttsEnabled || silverMode.enabled
                    })}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      silverMode.ttsEnabled ? 'bg-amber-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      silverMode.ttsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border-t">
                <p className="text-xs text-gray-500 text-center">
                  💡 실버 모드는 50대 이상 사용자에게 추천됩니다
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Full variant (for settings page)
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="p-5 border-b bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl">
              <Eye className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">실버 모드</h3>
              <p className="text-sm text-gray-600">시니어 친화적 접근성 설정</p>
            </div>
          </div>
          <button
            onClick={toggleSilverMode}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              silverMode.enabled ? 'bg-amber-500' : 'bg-gray-300'
            }`}
          >
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform flex items-center justify-center ${
              silverMode.enabled ? 'translate-x-7' : 'translate-x-0.5'
            }`}>
              {silverMode.enabled ? (
                <Check className="w-4 h-4 text-amber-500" />
              ) : (
                <X className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Font Size */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
            <Type className="w-5 h-5 text-gray-500" />
            글씨 크기
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'normal', label: '보통', preview: '가나다' },
              { value: 'large', label: '크게', preview: '가나다' },
              { value: 'xlarge', label: '매우 크게', preview: '가나다' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateSilverSettings({
                  fontSize: option.value as 'normal' | 'large' | 'xlarge',
                  enabled: true
                })}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  silverMode.fontSize === option.value
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`block font-medium mb-1 ${
                  option.value === 'xlarge' ? 'text-xl' :
                  option.value === 'large' ? 'text-lg' : 'text-base'
                }`}>
                  {option.preview}
                </span>
                <span className="text-sm text-gray-600">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Other Settings */}
        <div className="space-y-4">
          <SettingRow
            icon={<Sun className="w-5 h-5" />}
            label="고대비 모드"
            description="텍스트와 배경의 대비를 높여 가독성 향상"
            enabled={silverMode.highContrast}
            onToggle={() => updateSilverSettings({ highContrast: !silverMode.highContrast, enabled: true })}
          />

          <SettingRow
            icon={<Navigation className="w-5 h-5" />}
            label="간편 메뉴"
            description="복잡한 메뉴를 간소화하여 쉽게 탐색"
            enabled={silverMode.simplifiedNav}
            onToggle={() => updateSilverSettings({ simplifiedNav: !silverMode.simplifiedNav, enabled: true })}
          />

          <SettingRow
            icon={<Volume2 className="w-5 h-5" />}
            label="음성 읽기 (TTS)"
            description="화면 내용을 음성으로 읽어주는 기능 활성화"
            enabled={silverMode.ttsEnabled}
            onToggle={() => updateSilverSettings({ ttsEnabled: !silverMode.ttsEnabled, enabled: true })}
          />
        </div>
      </div>
    </div>
  )
}

function SettingRow({
  icon,
  label,
  description,
  enabled,
  onToggle
}: {
  icon: React.ReactNode
  label: string
  description: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="text-gray-500">{icon}</div>
        <div>
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-amber-500' : 'bg-gray-300'
        }`}
      >
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-0.5'
        }`} />
      </button>
    </div>
  )
}
