'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

// SEO should be handled by a parent server component or in the root layout.

export default function ProtectedPage() {
  const { user, isLoading, isMockUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // 如果没有加载且没有用户，可以重定向到登录页或首页
      // 为了简单起见，这里我们不自动重定向，而是显示提示信息
      // router.push('/'); 
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="p-4">加载用户信息中...</div>;
  }

  if (!user) {
    return (
      <div className="p-4">
        <p>您需要登录才能访问此页面。</p>
        <Link href="/" className="text-blue-500 hover:underline">
          返回首页进行登录
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">受保护的页面</h1>
      <p>欢迎, {user.email}!</p>
      {isMockUser && <p className="text-green-600 font-semibold">您当前以模拟用户身份登录。</p>}
      <p>这里是只有登录用户才能看到的内容。</p>
      <Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
        返回首页
      </Link>
    </div>
  );
}