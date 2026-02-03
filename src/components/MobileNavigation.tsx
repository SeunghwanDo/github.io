'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home, BookOpen, TrendingUp, Users, User
} from 'lucide-react'

const navItems = [
  {
    href: '/skillbridge/my-learning',
    icon: Home,
    label: '홈',
    activeColor: 'text-blue-600'
  },
  {
    href: '/skillbridge',
    icon: BookOpen,
    label: '과정',
    activeColor: 'text-blue-600'
  },
  {
    href: '/skillbridge/skill-map',
    icon: TrendingUp,
    label: '스킬',
    activeColor: 'text-blue-600'
  },
  {
    href: '/skillbridge/study-groups',
    icon: Users,
    label: '소셜',
    activeColor: 'text-blue-600'
  },
  {
    href: '/skillbridge/mentoring',
    icon: User,
    label: '멘토링',
    activeColor: 'text-blue-600'
  }
]

export default function MobileNavigation() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/skillbridge') {
      return pathname === '/skillbridge'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  active ? item.activeColor : 'text-gray-400'
                }`}
              >
                <Icon className={`w-6 h-6 ${active ? 'stroke-[2.5]' : ''}`} />
                <span className={`text-xs mt-1 ${active ? 'font-medium' : ''}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind the nav */}
      <div className="md:hidden h-16" />
    </>
  )
}
