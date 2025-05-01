import PopularSection from './components/PopularSection';
import Header from './components/Header';
import LatestNews from './components/LatestNews';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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