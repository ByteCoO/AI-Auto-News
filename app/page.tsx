import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-4 bg-white dark:bg-[#090B10] transition-colors duration-300">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 dark:from-yellow-500/10 dark:to-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <section className="max-w-5xl text-center relative z-10">
        {/* 徽章 */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-yellow-500/10 to-amber-500/10 dark:from-yellow-500/20 dark:to-amber-500/20 border border-yellow-500/20 dark:border-yellow-500/30">
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-700 dark:text-yellow-400">
            AI-Powered Intelligence Platform
          </span>
        </div>

        {/* 主标题 - 黑金配色 */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-tight">
          <span className="block text-gray-900 dark:text-white">Welcome to</span>
          <span className="block mt-2 bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 dark:from-yellow-400 dark:via-amber-300 dark:to-yellow-500 bg-clip-text text-transparent">
            GameVerse
          </span>
        </h1>

        {/* 描述文字 */}
        <p className="text-lg md:text-xl lg:text-2xl mb-12 text-gray-600 dark:text-gray-300 leading-relaxed font-light max-w-3xl mx-auto">
          The ultimate hub for <span className="font-semibold text-gray-900 dark:text-white">AI insights</span> and <span className="font-semibold text-gray-900 dark:text-white">tech intelligence</span>. 
          <br className="hidden md:block"/>
          Discover high-value commercial signals before anyone else.
        </p>

        {/* 按钮组 */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-16">
          <Link
            href="/trends"
            className="group px-10 py-5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-bold text-lg shadow-2xl shadow-blue-500/30 dark:shadow-blue-500/20 transition-all flex items-center gap-3 transform hover:scale-105 active:scale-95 border border-blue-500/20"
          >
            <span className="text-2xl">🚀</span>
            <span>Launch AI Trends Radar</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          <Link
            href="/price"
            className="group px-10 py-5 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold text-lg transition-all border-2 border-gray-300 dark:border-gray-600 hover:border-yellow-500 dark:hover:border-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <span className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              <span>View Pricing</span>
            </span>
          </Link>
        </div>

        {/* 状态指示器 */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-mono">
          <div className="flex items-center gap-3 px-6 py-3 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></span>
            <span className="text-green-700 dark:text-green-400 font-semibold">Radar Online</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></span>
            <span className="text-blue-700 dark:text-blue-400 font-semibold">AI Analysis Active</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-full border border-yellow-200 dark:border-yellow-800">
            <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"></span>
            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">Live Signals</span>
          </div>
        </div>

        {/* 底部装饰线 */}
        <div className="mt-20 flex items-center justify-center gap-2">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-500/50"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-500/50"></div>
        </div>
      </section>
    </main>
  );
}
