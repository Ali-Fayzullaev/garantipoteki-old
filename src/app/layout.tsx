// layout.tsx
import type { Metadata } from "next"; 
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GARANT IPOTEKI - Кредиты и ипотека под ключ",
  description: "Без первоначального взноса. Даже с действующими кредитами. Эксперты по ипотеке и кредитованию в Казахстане.",
  keywords: "ипотека, кредит, без первоначального взноса, Астана, Костанай, Рудный, Петропавловск, Кокшетау",
  authors: [{ name: "GARANT IPOTEKI" }],
  openGraph: {
    title: "GARANT IPOTEKI - Кредиты и ипотека под ключ",
    description: "Без первоначального взноса. Даже с действующими кредитами.",
    type: "website",
    locale: "ru_RU",
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
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Принудительно светлая тема */}
        <meta name="color-scheme" content="light only" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* Meta Pixel Code */}
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
              fbq('init', '1341098146860774');  // Ваш ID пикселя
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
        {/* End Meta Pixel Code */}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
