import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PopularForums from './components/PopularForums';
import ClansSection from './components/ClansSection';
import EventsSection from './components/EventsSection';
import WhoToWatchSection from './components/WhoToWatchSection';
import LatestNews from './components/LatestNews';

export default function Home() {
  return (
    <main className="min-h-screen bg-white transition-colors duration-200">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HeroSection />
            <div className="mt-8">
              <PopularForums />
            </div>
          </div>
          <div className="space-y-6">
            <ClansSection />
            <EventsSection />
            <WhoToWatchSection />
          </div>
        </div>
      </div>
      <LatestNews />
    </main>
  );
}