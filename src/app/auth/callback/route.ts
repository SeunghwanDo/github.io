import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/mypage'

  if (code) {
    const cookieStore = await cookies()
    const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, {
                  ...options,
                  // SSO: Set cookie domain for cross-subdomain auth
                  domain: cookieDomain || undefined,
                })
              )
            } catch {
              // Server Component에서 쿠키 설정 시 발생 가능한 오류 무시
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirect to the original destination or mypage
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  // Redirect to auth page on error
  return NextResponse.redirect(new URL('/auth?error=callback_failed', requestUrl.origin))
}
