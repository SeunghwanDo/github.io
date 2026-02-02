# SkillBridge 배포 가이드

## 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────┐
│                        Supabase                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    Auth     │  │  Database   │  │   Storage   │         │
│  │ (공유 세션) │  │ (users 등)  │  │  (파일 등)  │         │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘         │
└─────────┼────────────────┼──────────────────────────────────┘
          │                │
          │  SSO (Cookie)  │  공유 데이터
          │                │
    ┌─────┴────────────────┴─────┐
    │                            │
┌───▼───┐                   ┌────▼────┐
│Biz360 │                   │ Skill   │
│(채용) │                   │ Bridge  │
│       │                   │ (교육)  │
└───────┘                   └─────────┘
www.biz360.kr          skillbridge.biz360.kr
```

## 1. Vercel 프로젝트 생성

### 1.1 새 프로젝트 연결
1. [Vercel Dashboard](https://vercel.com/dashboard)에서 "Add New" → "Project"
2. GitHub 레포지토리 연결 (SeunghwanDo/github.io)
3. Framework Preset: Next.js 선택

### 1.2 환경 변수 설정
Vercel 프로젝트 Settings → Environment Variables에 추가:

```env
# Supabase (Biz360과 동일한 값 사용)
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# SSO 설정
NEXT_PUBLIC_COOKIE_DOMAIN=.biz360.kr
NEXT_PUBLIC_SITE_URL=https://skillbridge.biz360.kr
```

## 2. 도메인 설정

### 2.1 Vercel 도메인 추가
1. Project Settings → Domains
2. "Add Domain" 클릭
3. `skillbridge.biz360.kr` 입력

### 2.2 DNS 레코드 설정
도메인 관리자 (가비아, 클라우드플레어 등)에서 설정:

```
Type: CNAME
Name: skillbridge
Value: cname.vercel-dns.com
TTL: 자동 또는 3600
```

또는 A 레코드 사용:
```
Type: A
Name: skillbridge
Value: 76.76.21.21
TTL: 3600
```

## 3. Supabase 설정

### 3.1 OAuth Redirect URL 추가
Supabase Dashboard → Authentication → URL Configuration:

**Site URL:**
```
https://skillbridge.biz360.kr
```

**Redirect URLs에 추가:**
```
https://skillbridge.biz360.kr/auth/callback
```

### 3.2 Biz360 프로젝트에도 적용
Biz360의 Supabase 설정에서 Redirect URLs 확인:
```
https://www.biz360.kr/auth/callback
https://skillbridge.biz360.kr/auth/callback
```

## 4. Biz360 측 수정 사항

### 4.1 쿠키 도메인 설정
Biz360 프로젝트의 환경 변수에 추가:
```env
NEXT_PUBLIC_COOKIE_DOMAIN=.biz360.kr
```

### 4.2 Supabase 클라이언트 업데이트
SkillBridge와 동일한 쿠키 도메인 설정 적용 필요

```typescript
// Biz360의 supabase.ts에 쿠키 도메인 설정 추가
const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined
```

## 5. 배포 확인

### 5.1 SSO 테스트
1. www.biz360.kr에서 로그인
2. skillbridge.biz360.kr 접속
3. 자동 로그인 확인 (동일 사용자로 인식)

### 5.2 확인 사항 체크리스트
- [ ] skillbridge.biz360.kr 접속 가능
- [ ] Biz360 로그인 후 SkillBridge 자동 로그인
- [ ] SkillBridge 로그인 후 Biz360 자동 로그인
- [ ] 마이페이지 접근 시 인증 리다이렉트 정상 작동
- [ ] 교육 신청, 리뷰 작성 등 기능 정상 작동

## 6. 트러블슈팅

### 쿠키가 공유되지 않는 경우
1. 브라우저 개발자 도구 → Application → Cookies 확인
2. `sb-` 접두사 쿠키의 Domain이 `.biz360.kr`인지 확인
3. SameSite 속성이 `Lax` 또는 `None`인지 확인

### HTTPS 관련 오류
- Vercel은 자동 HTTPS 제공
- 쿠키는 `Secure` 플래그가 필요하므로 반드시 HTTPS 사용

### OAuth 리다이렉트 오류
- Supabase Redirect URLs에 정확한 URL 등록 확인
- 로그/소셜 로그인 시 올바른 콜백 URL로 리다이렉트 되는지 확인
