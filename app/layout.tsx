import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from './providers/ThemeProvider';
import Footer from './components/Footer';
import { FTNewsProvider } from './contexts/FTNewsContext';
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import AuthButton from './components/AuthButton'; // Assuming you'll create this component

export const metadata: Metadata = {
  title: 'GameVerse',
  description: '游戏社区平台',
};

export default async function RootLayout({
  children,
}: { children: React.ReactNode }) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component. Cookies can't be set
            // from Server Components. This can happen if you're using a Supabase client
            // in a Server Component with `revalidatePath` or similar.
            // For more details: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiesdotset
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component. Cookies can't be set
            // from Server Components. This can happen if you're using a Supabase client
            // in a Server Component with `revalidatePath` or similar.
            // For more details: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiesdotdelete
          }
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body>
        <main className="min-h-screen flex flex-col items-center">
          {/* Add AuthButton here */}
          <div className="w-full max-w-4xl flex justify-end py-3 px-3 lg:px-6">
            <AuthButton user={user} />
          </div>
          {children}
        </main>
      </body>
    </html>
  )
}
