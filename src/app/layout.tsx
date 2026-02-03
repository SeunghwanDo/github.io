import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ChatbotWidget from '@/components/ChatbotWidget'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkillBridge - 제조업 교육 매칭 플랫폼',
  description: 'Biz360 연계 스마트 제조 인력 역량 진단 및 맞춤형 교육 매칭 서비스',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SkillBridge',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'SkillBridge',
    title: 'SkillBridge - 제조업 교육 매칭 플랫폼',
    description: '제조업 맞춤형 교육 매칭 및 학습 관리 플랫폼',
  },
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        {children}
        <ChatbotWidget />
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
