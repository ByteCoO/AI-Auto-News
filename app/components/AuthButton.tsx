'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function AuthButton({ user }: { user: User | null }) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <button
        className="py-2 px-4 rounded-md no-underline bg-btn-back hover:bg-btn-background-hover"
        onClick={handleSignOut}
      >
        Logout
      </button>
    </div>
  ) : (
    <button
      className="py-2 px-4 rounded-md no-underline bg-btn-back hover:bg-btn-background-hover"
      onClick={handleSignIn}
    >
      Login with Google
    </button>
  );
}