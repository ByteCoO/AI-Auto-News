// 这是一个服务器组件 (默认)，所以没有 'use client'
import type { Metadata } from 'next';
import PricingClientPage from './PricingClientPage'; // 导入我们刚刚创建的客户端组件

// metadata 导出留在这里，它会在服务器上被正确处理
export const metadata: Metadata = {
  title: '价格 - 新闻 API 定价',
  description: '为您的项目找到完美的 API 计划。我们为实时新闻 API 提供灵活、可扩展且价格合理的定价层级，从免费的开发者计划到企业解决方案。 ',
  alternates: {
    canonical: '/price',
  },
};

// 这个页面组件本身很简单，只是渲染客户端组件
export default function PricePage() {
  return <PricingClientPage />;
}