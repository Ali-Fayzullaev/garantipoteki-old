// layout.tsx - Современный дизайн
import type { Metadata, Viewport } from "next"; 
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Современные шрифты
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GARANT IPOTEKI - Современные решения для ипотеки и кредитования",
  description: "🏠 Ипотека без первоначального взноса ⚡ Одобрение за 24 часа 💳 До 8 млн тенге 📍 5 городов Казахстана ⭐ Рейтинг 4.9 в 2GIS",
  keywords: "ипотека без первоначального взноса, кредит наличными, рефинансирование, ипотека Астана, кредит Алматы, быстрое одобрение кредита, GARANT IPOTEKI",
  authors: [{ name: "GARANT IPOTEKI" }],
  robots: "index, follow",
  
  openGraph: {
    title: "GARANT IPOTEKI - Лидер ипотечного кредитования в Казахстане",
    description: "Без первоначального взноса. Одобрение за 24 часа. Работаем даже с действующими кредитами. Более 1000 довольных клиентов!",
    type: "website",
    locale: "ru_RU",
    siteName: "GARANT IPOTEKI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GARANT IPOTEKI - Ипотека и кредиты",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "GARANT IPOTEKI - Ипотека без первоначального взноса",
    description: "Получите ипотеку до 8 млн тенге без справок о доходах. Рейтинг 4.9 ⭐",
  },
  
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "icon", url: "/favicon.ico" },
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#3b82f6" },
    ],
  },
  
  manifest: "/site.webmanifest",
};

// Отдельная функция для viewport согласно Next.js 14/15
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${jakartaSans.variable}`}>
      <head>
        {/* Современная оптимизация */}
        <meta name="color-scheme" content="light only" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* DNS Prefetch для улучшения скорости */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.facebook.com" />
        
        {/* Meta Pixel Code - Оптимизированный */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1341098146860774');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1341098146860774&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        
        {/* Yandex.Metrika для аналитики */}
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
              // Замените YOUR_COUNTER_ID на ваш реальный ID счетчика
              // ym(YOUR_COUNTER_ID, "init", {
              //   clickmap:true,
              //   trackLinks:true,
              //   accurateTrackBounce:true,
              //   webvisor:true
              // });
            `,
          }}
        />
      </head>
      <body className="antialiased bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-gray-900 font-inter">
        {/* Прелоадер для лучшего UX */}
        <div 
          id="page-loader" 
          className="fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-500"
          style={{ display: 'none' }}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Основной контент */}
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* Структурированные данные для SEO */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              "name": "GARANT IPOTEKI",
              "description": "Ипотека и кредиты без первоначального взноса в Казахстане",
              "url": "https://garantipoteki.kz",
              "logo": "https://garantipoteki.kz/logo.png",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Проспект Б. Момышұлы 2/5",
                "addressLocality": "Астана",
                "addressCountry": "KZ"
              },
              "telephone": "+7-707-575-97-07",
              "email": "maksatzhusupov@mail.ru",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "1000"
              },
              "serviceType": ["Ипотечное кредитование", "Потребительские кредиты", "Рефинансирование"],
              "areaServed": ["Астана", "Алматы", "Костанай", "Рудный", "Петропавловск", "Кокшетау"]
            })
          }}
        />
      </body>
    </html>
  );
}
