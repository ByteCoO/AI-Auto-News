import PopularSection from './components/PopularSection';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import LatestNews from './components/LatestNews';
import { Metadata } from 'next';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Game Visiong',
  description: 'Welcome to our website. Discover the latest news, hot content and more.',
  
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