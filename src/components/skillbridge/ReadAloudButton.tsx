'use client'

import { Volume2, VolumeX, Loader2 } from 'lucide-react'
import { useVerification } from '@/hooks/useVerification'

interface ReadAloudButtonProps {
  text: string
  className?: string
  variant?: 'icon' | 'full'
  label?: string
}

export default function ReadAloudButton({
  text,
  className = '',
  variant = 'full',
  label = '읽어주기'
}: ReadAloudButtonProps) {
  const { silverMode, speakText, stopSpeaking, isSpeaking } = useVerification()

  // Only show if TTS is enabled in silver mode
  if (!silverMode.ttsEnabled && !silverMode.enabled) {
    return null
  }

  const handleClick = () => {
    if (isSpeaking) {
      stopSpeaking()
    } else {
      speakText(text)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`p-2 rounded-lg transition-all ${
          isSpeaking
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
        } ${className}`}
        title={isSpeaking ? '읽기 중지' : '음성으로 읽기'}
      >
        {isSpeaking ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        isSpeaking
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
      } ${className}`}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-5 h-5" />
          <span className="font-medium">읽기 중지</span>
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5" />
          <span className="font-medium">{label}</span>
        </>
      )}
    </button>
  )
}

// Wrapper component for content sections
export function ReadAloudSection({
  children,
  textContent,
  title
}: {
  children: React.ReactNode
  textContent: string
  title?: string
}) {
  const { silverMode } = useVerification()

  return (
    <div className="relative">
      {(silverMode.ttsEnabled || silverMode.enabled) && (
        <div className="absolute top-2 right-2 z-10">
          <ReadAloudButton
            text={title ? `${title}. ${textContent}` : textContent}
            variant="icon"
          />
        </div>
      )}
      {children}
    </div>
  )
}
