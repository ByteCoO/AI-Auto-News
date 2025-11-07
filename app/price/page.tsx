// 这是一个服务器组件 (默认)，所以没有 'use client'
import type { Metadata } from 'next';
import PricingClientPage from './PricingClientPage'; // 导入我们刚刚创建的客户端组件

// metadata 导出留在这里，它会在服务器上被正确处理
import { generateSEOMetadata } from '@/app/components/SEOTemplate';

export const metadata: Metadata = generateSEOMetadata({
  title: "Pricing Plans - Game Visioning Premium Subscriptions",
  description: "Choose the perfect Game Visioning subscription plan for your needs. Get premium access to exclusive news analysis, advanced features, and ad-free browsing.",
  keywords: ['pricing', 'subscription', 'premium', 'plans', 'news', 'analysis', 'API', 'real-time'],
  canonical: '/price',
  ogType: 'website',
});

// 这个页面组件本身很简单，只是渲染客户端组件
export default function PricePage() {
  return <PricingClientPage />;
}