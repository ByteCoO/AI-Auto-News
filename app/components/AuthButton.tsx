'use client';

import { useRouter, usePathname } from 'next/navigation'; // 导入 usePathname
import { useEffect } from 'react'; // 导入 useEffect
import { useAuth } from '../contexts/AuthContext'; // 导入 useAuth

// Google SVG Icon (taken from Google's branding guidelines)
const GoogleIcon = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

export default function AuthButton() { 
  const { user, signInWithGoogle, signOut, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // 获取当前路径

  const handleSignIn = async () => {
    await signInWithGoogle();
    // 重定向逻辑将由下面的 useEffect 处理
  };

  useEffect(() => {
    if (!isLoading && user && pathname !== '/') {
      router.push('/');
    }
  }, [user, isLoading, router, pathname]);

  const handleSignOut = async () => {
    await signOut();
    router.refresh(); 
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-2">Loading...</div>;
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-700 dark:text-gray-300">Hey, {user.email}!</span>
      <button
        className="py-2 px-4 rounded-md no-underline bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
        onClick={handleSignOut} 
        disabled={isLoading}
      >
        Logout
      </button>
    </div>
  ) : (
    <button
      className="flex items-center justify-center gap-2 py-2 px-4 rounded-md no-underline bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 transition-colors duration-200 shadow-sm"
      onClick={handleSignIn} 
      disabled={isLoading}
    >
      <GoogleIcon />
      <span>Login with Google</span>
    </button>
  );
}