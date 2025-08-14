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
    default: 'Game Visioning: News, Analysis, and Community',
    template: `%s | Game Visioning`,
  },
  description: 'Your premier destination for the latest news, in-depth analysis, and vibrant community discussions. Stay informed with our comprehensive coverage and expert insights.',
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