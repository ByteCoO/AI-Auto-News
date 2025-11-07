// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from './providers/ThemeProvider'; // 或者 'next-themes'
import ThemeToggle from './components/ThemeToggle';
import Footer from './components/Footer';
import { FTNewsProvider } from './contexts/FTNewsContext';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext'; // <--- 1. 导入 AuthProvider

export const metadata: Metadata = {
  metadataBase: new URL('https://visionong.dpdns.org'),
  title: {
    default: 'Game Visioning: Your Hub for AI, Gaming, and Tech News',
    template: `%s | Game Visioning`,
  },
  description: 'Explore the latest in AI, gaming, and technology. Game Visioning delivers daily news, in-depth analysis, and a vibrant community for tech enthusiasts.',
  keywords: ['AI news', 'gaming news', 'technology news', 'artificial intelligence', 'gaming industry', 'tech analysis', 'innovation', 'software development', 'game development', 'tech community'],
  authors: [{ name: 'Game Visioning Team' }],
  creator: 'Game Visioning',
  publisher: 'Game Visioning',
  verification: {
    google: 'your-google-site-verification-code-here',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Game Visioning: Your Hub for AI, Gaming, and Tech News',
    description: 'Explore the latest in AI, gaming, and technology. Game Visioning delivers daily news, in-depth analysis, and a vibrant community for tech enthusiasts.',
    url: 'https://visionong.dpdns.org',
    siteName: 'Game Visioning',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Game Visioning - Your Hub for AI, Gaming, and Tech News',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Game Visioning: Your Hub for AI, Gaming, and Tech News',
    description: 'Explore the latest in AI, gaming, and technology. Game Visioning delivers daily news, in-depth analysis, and a vibrant community for tech enthusiasts.',
    images: ['/og-image.jpg'],
    creator: '@gamevisioning',
    site: '@gamevisioning',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: { children: React.ReactNode }) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
          }
        },
      },
    }
  );

  // 这个 user 是服务器端获取的初始用户状态
  // AuthProvider 内部会处理客户端的动态认证状态
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://visionong.dpdns.org" />
        <link rel="alternate" type="application/rss+xml" title="Game Visioning RSS Feed" href="/rss.xml" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <meta name="google-site-verification" content="your-google-site-verification-code-here" />
        <meta name="msvalidate.01" content="your-bing-verification-code-here" />
        <meta name="yandex-verification" content="your-yandex-verification-code-here" />
        <meta name="p:domain_verify" content="your-pinterest-verification-code-here" />
        <meta property="fb:app_id" content="your-facebook-app-id" />
        <meta name="application-name" content="Game Visioning" />
        <meta name="apple-mobile-web-app-title" content="Game Visioning" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* --- 2. 用 AuthProvider 包裹 --- */}
          <AuthProvider>
            {/* FTNewsProvider seems to be missing from the JSX, add if needed */}
            <FTNewsProvider>
            <main className="min-h-screen flex flex-col items-center">
              {/* <div className="w-full max-w-4xl flex justify-end items-center py-3 px-3 lg:px-6 space-x-4"> */}
                {/* AuthButton 现在可以安全地使用 useAuth()，因为它在 AuthProvider 内部 */}
                {/* 注意：你仍然可以将服务器获取的 user 传递给 AuthButton 作为初始值，
                    或者让 AuthButton 完全依赖 useAuth() 来获取用户状态。
                    如果 AuthButton 内部使用 useAuth，它会获取到客户端的最新状态。
                */}
               {/*  <AuthButton user={user} /> */}
             {/*    <ThemeToggle /> */}
             {/*  </div> */}
             <Navbar/>
              {children} {/* 你的页面内容会在这里渲染，它们也能访问 AuthContext */}
              <Footer /> 
            </main>
            </FTNewsProvider>
          </AuthProvider>
          {/* --- 结束 AuthProvider 包裹 --- */}
        </ThemeProvider>
      </body>
    </html>
  );
}