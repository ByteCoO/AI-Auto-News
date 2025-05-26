'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext'; // 导入 useAuth
import { User } from '@supabase/supabase-js'; // User 类型可能仍然需要，或者由 AuthContext 提供

export default function AuthButton({ user: initialUserProp }: { user: User | null }) { // initialUserProp 可以用于初始判断，但主要依赖 context
  const { user, signInWithGoogle, signOut, mockLogin, isLoading } = useAuth();
  const router = useRouter();

  const handleMockLogin = async () => {
    await mockLogin();
    router.push('/protected-page'); // 跳转到受保护页面
    router.refresh(); // 确保UI状态更新
  };

  const handleSignIn = async () => {
    await signInWithGoogle();
    // router.refresh(); // signInWithGoogle 内部或 AuthContext 的 onAuthStateChange 会处理状态和可能的刷新
  };

  const handleSignOut = async () => {
    await signOut();
    router.refresh(); // Context的signOut已经处理了状态更新，这里刷新页面确保UI同步
  };

  // isLoading 可以用来显示加载状态，避免用户在操作过程中重复点击
  if (isLoading) {
    return <div className="flex items-center gap-4">Loading...</div>;
  }

  // 现在直接使用来自 context 的 user
  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <button
        className="py-2 px-4 rounded-md no-underline bg-btn-back hover:bg-btn-background-hover"
        onClick={handleSignOut} disabled={isLoading}
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="flex gap-4">
      <button
        className="py-2 px-4 rounded-md no-underline bg-btn-back hover:bg-btn-background-hover"
        onClick={handleSignIn} disabled={isLoading}
      >
        Login with Google
      </button>
    
    </div>
  );
}