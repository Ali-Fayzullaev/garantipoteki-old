import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CITY_ROUTES = ['kokshetau', 'kostanay', 'petropavlovsk']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Добавляем CORS заголовки для API запросов
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next()
    
    // Добавляем CORS заголовки
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400')
    
    // Обрабатываем preflight OPTIONS запросы
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers })
    }
    
    return response
  }
  
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
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}