'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Check, CheckCheck, X } from 'lucide-react'
import { useNotifications, getNotificationIcon, formatRelativeTime } from '@/hooks/useNotifications'

export default function NotificationDropdown() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = async (notificationId: string) => {
    await markAsRead(notificationId)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-800"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
            <h3 className="font-semibold text-white">알림</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                <CheckCheck className="w-4 h-4" />
                모두 읽음
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500">알림이 없습니다</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => {
                const { icon, color, bg } = getNotificationIcon(notification.type)
                return (
                  <Link
                    key={notification.id}
                    href={notification.link || '#'}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`block px-4 py-3 hover:bg-slate-700/50 transition border-b border-slate-700/50 last:border-0 ${
                      !notification.read ? 'bg-violet-500/5' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-lg">{icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-medium text-sm ${!notification.read ? 'text-white' : 'text-slate-300'}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-slate-500 text-sm line-clamp-2 mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-slate-600 text-xs mt-1">
                          {formatRelativeTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-700">
              <Link
                href="/mypage?tab=notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-violet-400 hover:text-violet-300"
              >
                전체 알림 보기
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
