/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Игнорировать ошибки TypeScript при сборке (ускоряет процесс)
    ignoreBuildErrors: true,
  },
  // Отключаем неиспользуемые оптимизации для быстрой сборки
  swcMinify: true, // Использует более быстрый SWC minifier
  
  // Упрощенная конфигурация изображений
  images: {
    domains: ['garantipoteki-astana.kz'],
    unoptimized: true, // Отключает оптимизацию изображений для быстрой сборки
  },
  
  // Минимальные настройки для продакшена
  poweredByHeader: false,
  compress: true,
  
  // Простые заголовки
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
}

module.exports = nextConfig
