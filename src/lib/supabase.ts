import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient as createSSRServerClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cookie domain for SSO across subdomains (e.g., .biz360.kr)
// This allows auth cookies to be shared between biz360.kr and skillbridge.biz360.kr
const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined

/**
 * Browser client for client-side operations
 * Configured with cookie domain for cross-subdomain SSO
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? {
      getItem: (key) => {
        const cookies = document.cookie.split(';')
        const cookie = cookies.find(c => c.trim().startsWith(`${key}=`))
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : null
      },
      setItem: (key, value) => {
        const domain = cookieDomain ? `; domain=${cookieDomain}` : ''
        document.cookie = `${key}=${encodeURIComponent(value)}; path=/${domain}; max-age=31536000; SameSite=Lax; Secure`
      },
      removeItem: (key) => {
        const domain = cookieDomain ? `; domain=${cookieDomain}` : ''
        document.cookie = `${key}=; path=/${domain}; max-age=0`
      },
    } : undefined,
  },
})

/**
 * Create browser client with SSO support
 * Use this in client components
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        if (typeof document === 'undefined') return undefined
        const cookies = document.cookie.split(';')
        const cookie = cookies.find(c => c.trim().startsWith(`${name}=`))
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : undefined
      },
      set(name, value, options) {
        if (typeof document === 'undefined') return
        const domain = cookieDomain ? `; domain=${cookieDomain}` : ''
        const maxAge = options?.maxAge ? `; max-age=${options.maxAge}` : ''
        const path = options?.path ? `; path=${options.path}` : '; path=/'
        const sameSite = options?.sameSite ? `; SameSite=${options.sameSite}` : '; SameSite=Lax'
        const secure = options?.secure !== false ? '; Secure' : ''
        document.cookie = `${name}=${encodeURIComponent(value)}${path}${domain}${maxAge}${sameSite}${secure}`
      },
      remove(name, options) {
        if (typeof document === 'undefined') return
        const domain = cookieDomain ? `; domain=${cookieDomain}` : ''
        const path = options?.path ? `; path=${options.path}` : '; path=/'
        document.cookie = `${name}=; max-age=0${path}${domain}`
      },
    },
  })
}

/**
 * Server-side client for API routes and Server Components
 * Use this in server-side code
 */
export function createServerClient() {
  return createClient<Database>(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
  )
}

/**
 * Server-side client with cookie handling for SSR
 * Use this in Server Components that need auth state
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createSSRServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options, domain: cookieDomain })
        } catch {
          // Server Component에서는 쿠키 설정 불가
        }
      },
      remove(name, options) {
        try {
          cookieStore.set({ name, value: '', ...options, domain: cookieDomain, maxAge: 0 })
        } catch {
          // Server Component에서는 쿠키 삭제 불가
        }
      },
    },
  })
}
