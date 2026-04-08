import Image from 'next/image';
import Navbar from './components/Navbar';
import HeroSection from '../components/HeroSection';
import PopularForums from '../components/PopularForums';
import ClansSection from '../components/ClansSection';
import EventsSection from '../components/EventsSection';
import WhoToWatchSection from '../components/WhoToWatchSection';
import LatestNews from '../components/LatestNews';

// SEO should be handled by a parent server component or in the root layout.

export default function Home() {
  return (
    <main className="min-h-screen bg-white transition-colors duration-200">
      {/* name: Navbar - Top navigation */}
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* name: HeroSection - Homepage hero */}
            <HeroSection />
            <div className="mt-8">
              {/* name: PopularForums - Trending forums */}
               <PopularForums />
            </div>
          </div>
          <div className="space-y-6">
            {/* name: ClansSection - Clans overview */}
            <ClansSection />
            {/* name: EventsSection - Upcoming events */}
            <EventsSection />
            {/* name: WhoToWatchSection - Recommended creators */}
            <WhoToWatchSection />
          </div>
        </div>
      </div>
      {/* 添加最新新闻组件 */}
      {/* name: LatestNews - Latest news list */}
      <LatestNews />
    </main>
  );
}