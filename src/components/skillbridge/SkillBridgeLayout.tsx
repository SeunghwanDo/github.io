'use client'

import { ReactNode } from 'react'
import { VerificationProvider, useVerification } from '@/hooks/useVerification'
import SilverModeToggle from './SilverModeToggle'
import { RegrowthBadge } from './RegrowthTrack'

interface SkillBridgeLayoutProps {
  children: ReactNode
  showSilverToggle?: boolean
  showRegrowthBadge?: boolean
}

function LayoutContent({
  children,
  showSilverToggle = true,
  showRegrowthBadge = true
}: SkillBridgeLayoutProps) {
  const { silverMode, userProfile } = useVerification()

  return (
    <div className={`skillbridge-layout ${silverMode.enabled ? 'silver-mode-active' : ''}`}>
      {/* Top Bar with Accessibility Controls */}
      {(showSilverToggle || showRegrowthBadge) && (
        <div className="fixed top-16 right-4 z-40 flex items-center gap-2">
          {showRegrowthBadge && userProfile && <RegrowthBadge />}
          {showSilverToggle && <SilverModeToggle variant="compact" />}
        </div>
      )}

      {/* Main Content */}
      {children}

      {/* Global Styles for Silver Mode */}
      <style jsx global>{`
        :root {
          --font-scale: 1;
        }

        .silver-mode-active {
          font-size: calc(1rem * var(--font-scale, 1));
        }

        .silver-mode-active .text-sm {
          font-size: calc(0.875rem * var(--font-scale, 1));
        }

        .silver-mode-active .text-xs {
          font-size: calc(0.75rem * var(--font-scale, 1));
        }

        .silver-mode-active .text-base {
          font-size: calc(1rem * var(--font-scale, 1));
        }

        .silver-mode-active .text-lg {
          font-size: calc(1.125rem * var(--font-scale, 1));
        }

        .silver-mode-active .text-xl {
          font-size: calc(1.25rem * var(--font-scale, 1));
        }

        .silver-mode-active .text-2xl {
          font-size: calc(1.5rem * var(--font-scale, 1));
        }

        /* High Contrast Mode */
        .high-contrast {
          --tw-text-opacity: 1;
        }

        .high-contrast .text-gray-500 {
          color: rgb(55 65 81);
        }

        .high-contrast .text-gray-600 {
          color: rgb(31 41 55);
        }

        .high-contrast .bg-gray-50 {
          background-color: rgb(243 244 246);
        }

        .high-contrast .border-gray-200 {
          border-color: rgb(156 163 175);
        }

        /* Larger touch targets for silver mode */
        .silver-mode-active button,
        .silver-mode-active a {
          min-height: 44px;
        }

        .silver-mode-active input,
        .silver-mode-active select,
        .silver-mode-active textarea {
          min-height: 48px;
          font-size: calc(1rem * var(--font-scale, 1));
        }

        /* Focus indicators for accessibility */
        .silver-mode-active *:focus {
          outline: 3px solid #2563eb;
          outline-offset: 2px;
        }

        /* Safe area for mobile bottom navigation */
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  )
}

export default function SkillBridgeLayout(props: SkillBridgeLayoutProps) {
  return (
    <VerificationProvider>
      <LayoutContent {...props} />
    </VerificationProvider>
  )
}

// Hook for getting verification status badge display
export function VerificationBadges() {
  const { userProfile } = useVerification()

  if (!userProfile) return null

  const { verification } = userProfile

  return (
    <div className="flex items-center gap-2">
      {/* Fitness Badge */}
      {verification.fitness.verified && (
        <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          {verification.fitness.grade === 1 ? '🥇' : verification.fitness.grade === 2 ? '🥈' : '🥉'}
          체력 {verification.fitness.grade}등급
        </span>
      )}

      {/* Expert Badge */}
      {verification.isExpert && (
        <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          ✅ 검증된 전문가
        </span>
      )}
    </div>
  )
}
