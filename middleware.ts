import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CITY_ROUTES = ['kokshetau', 'kostanay', 'petropavlovsk']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Проверяем, является ли путь названием города
  const citySlug = pathname.slice(1) // убираем начальный слеш
  
  if (CITY_ROUTES.includes(citySlug)) {
    // Переписываем URL на /city/[slug]
    return NextResponse.rewrite(new URL(`/city/${citySlug}`, request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}