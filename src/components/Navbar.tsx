'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, Menu, X, User, LogOut, ChevronDown, Award, Sparkles, Trophy } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import NotificationDropdown from './NotificationDropdown'

export default function Navbar() {
  const pathname = usePathname()
  const { user, loading, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navLinks = [
    { href: '/skillbridge', label: 'SkillBridge' },
    { href: '/jobs', label: '채용공고' },
    { href: '/dashboard', label: '대시보드' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Biz<span className="text-violet-400">360</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition ${
                    isActive(link.href)
                      ? 'text-violet-400 font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notification Bell - Only show when logged in */}
            {!loading && user && <NotificationDropdown />}

            {loading ? (
              <div className="w-8 h-8 bg-slate-800 rounded-full animate-pulse" />
            ) : user ? (
              /* Logged In */
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.email?.[0].toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-slate-300 text-sm max-w-[120px] truncate">
                    {user.user_metadata?.name || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                      <div className="p-3 border-b border-slate-700">
                        <p className="text-white font-medium text-sm truncate">
                          {user.user_metadata?.name || '사용자'}
                        </p>
                        <p className="text-slate-500 text-xs truncate">{user.email}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          href="/mypage"
                          className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition text-sm"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          마이페이지
                        </Link>
                        <Link
                          href="/mypage?tab=certificates"
                          className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition text-sm"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Award className="w-4 h-4" />
                          수료증/뱃지
                        </Link>
                        <Link
                          href="/recommendations"
                          className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition text-sm"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Sparkles className="w-4 h-4" />
                          AI 추천
                        </Link>
                        <Link
                          href="/gamification"
                          className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition text-sm"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Trophy className="w-4 h-4" />
                          학습 레벨
                        </Link>
                        <button
                          onClick={() => {
                            signOut()
                            setUserMenuOpen(false)
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-slate-700 rounded-lg transition text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          로그아웃
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Logged Out */
              <>
                <Link
                  href="/auth"
                  className="hidden sm:block px-4 py-2 text-sm text-slate-300 hover:text-white transition"
                >
                  로그인
                </Link>
                <Link
                  href="/auth"
                  className="px-4 py-2 text-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:from-violet-500 hover:to-fuchsia-500 transition shadow-lg shadow-violet-500/25"
                >
                  시작하기
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-2 rounded-lg transition ${
                    isActive(link.href)
                      ? 'text-violet-400 bg-violet-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/auth"
                  className="block px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
