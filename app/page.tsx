import PopularSection from './components/PopularSection';
import Header from './components/Header';
import LatestNews from './components/LatestNews';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: '首页 - 我们的网站',
  description: '欢迎来到我们的网站。发现最新新闻、热门内容和更多信息。',
  // 可以添加更多元数据，例如 keywords, openGraph 等
  // keywords: ['关键词1', '关键词2'],
  // openGraph: {
  //   title: '首页 - 我们的网站',
  //   description: '欢迎来到我们的网站。发现最新新闻、热门内容和更多信息。',
  //   // images: [{ url: '/path/to/home-image.jpg' }],
  // },
};

export default async function Home() {
  return (
    <main className="min-h-screen bg-white transition-colors duration-200">
      <Header />
      {/* <PopularSection /> */}
     

      <div className="container mx-auto px-4 py-12 h-1/2 w-full flex justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500">
              Website project is building
            </div>
          </div>
          <div className="space-y-6">
            {/* 可以在这里添加其他侧边栏组件 */}
          </div>
        </div>
      </div>

      <LatestNews />
    </main>
  );
}