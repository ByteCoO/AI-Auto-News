import PopularSection from './components/PopularSection';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import LatestNews from './components/LatestNews';
import { Metadata } from 'next';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: '首页 - 我们的网站',
  description: '欢迎来到我们的网站。发现最新新闻、热门内容和更多信息。',
  
};

export default async function Home() {
  return (
    <main className="min-h-screen w-full bg-while dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* <Header themeToggleComponent={<ThemeToggle />} /> */}
      <LatestNews />

      <Footer/>
    </main>
  );
}