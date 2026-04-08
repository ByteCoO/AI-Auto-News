import FAQSchemaScript from './components/FAQSchemaScript';
import { PerformanceOptimizer, WebVitalsReporter } from './components/PerformanceOptimizer';
import ScrollReveal from './components/ScrollReveal';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  return (
    <>
      {/* SEO & Performance Scripts */}
      <FAQSchemaScript />
      <PerformanceOptimizer />
      <WebVitalsReporter />
      <ScrollReveal />

      <main className="min-h-screen w-full flex flex-col items-center justify-center px-4" style={{ backgroundColor: 'var(--color-background)' }}>
        <section className="max-w-4xl text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter animate-fade-in" style={{ fontFamily: 'var(--font-heading)' }}>
            Welcome to <span className="text-blue-500">GameVerse</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-400 leading-relaxed font-light">
            The ultimate hub for AI insights and tech intelligence. <br className="hidden md:block"/>
            Discover high-value commercial signals before anyone else.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/trends"
              className="px-10 py-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl shadow-2xl shadow-blue-500/30 transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95"
            >
              🚀 Launch AI Trends Radar
            </Link>
            <Link
              href="/price"
              className="px-10 py-5 rounded-full bg-gray-800 hover:bg-gray-700 text-white font-bold text-xl transition-all border border-gray-700 hover:border-gray-500"
            >
              View Pricing
            </Link>
          </div>
          
          {/* 辅助装饰：显示当前系统状态 */}
          <div className="mt-16 flex items-center justify-center gap-8 text-gray-500 text-sm font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Radar Online
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              AI Analysis Active
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
