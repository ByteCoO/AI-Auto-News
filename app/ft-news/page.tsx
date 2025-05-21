import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import FTNewsClientPage from './FTNewsClientPage';

export default async function FTNewsPage() {
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

  if (!user) {
    redirect('/login') // Redirect to a login page if user is not logged in
  }
  return <FTNewsClientPage />;
}