import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Features data
const features = [
  {
    icon: '🎯',
    title: 'AI-Powered Insights',
    description: 'Deep learning algorithms automatically identify high-value business signals and user needs',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '📊',
    title: 'Real-Time Trends',
    description: 'Monitor hot discussions on Reddit and other communities to discover emerging opportunities',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: '💡',
    title: 'Pain Point Discovery',
    description: 'Pinpoint user pain points and validate your SaaS ideas with real data',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: '🚀',
    title: 'Fast Validation',
    description: 'Replace guesswork with data, validate your business ideas in just 3 days',
    color: 'from-green-500 to-emerald-500',
  },
];

// Stats data
const stats = [
  { value: '1M+', label: 'Data Analyzed', icon: '📈' },
  { value: '500+', label: 'Happy Customers', icon: '👥' },
  { value: '98%', label: 'Satisfaction Rate', icon: '⭐' },
  { value: '340%', label: 'Avg ROI Increase', icon: '💰' },
];

export default async function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col bg-white dark:bg-[#090B10] transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 dark:from-yellow-500/10 dark:to-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-5xl text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-yellow-500/10 to-amber-500/10 dark:from-yellow-500/20 dark:to-amber-500/20 border border-yellow-500/20 dark:border-yellow-500/30">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-700 dark:text-yellow-400">
              AI-Powered Intelligence Platform
            </span>
          </div>

          {/* Main title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-tight">
            <span className="block text-gray-900 dark:text-white">Welcome to</span>
            <span className="block mt-2 bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 dark:from-yellow-400 dark:via-amber-300 dark:to-yellow-500 bg-clip-text text-transparent">
              GameVerse
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl lg:text-2xl mb-12 text-gray-600 dark:text-gray-300 leading-relaxed font-light max-w-3xl mx-auto">
            The ultimate hub for <span className="font-semibold text-gray-900 dark:text-white">AI insights</span> and <span className="font-semibold text-gray-900 dark:text-white">tech intelligence</span>.
            <br className="hidden md:block"/>
            Discover high-value commercial signals before anyone else.
          </p>

          {/* CTA Buttons */}
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
              href="/business-insights"
              className="group px-10 py-5 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold text-lg transition-all border-2 border-gray-300 dark:border-gray-600 hover:border-yellow-500 dark:hover:border-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2">
                <span className="text-2xl">💡</span>
                <span>Business Insights</span>
              </span>
            </Link>
          </div>

          {/* Status indicators */}
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
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose GameVerse?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              AI-driven business intelligence platform that helps you discover opportunities others miss
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore More
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Discover features that work for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/business-insights" className="group">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 rounded-2xl p-8 border border-yellow-200 dark:border-yellow-800 hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400">
                  Business Insights
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Explore AI-curated commercial signals and validated business opportunities
                </p>
              </div>
            </Link>

            <Link href="/about" className="group">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  About Us
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Learn about our mission, team, and the story behind GameVerse
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 dark:from-yellow-600 dark:via-amber-600 dark:to-yellow-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join hundreds of teams already using GameVerse
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/trends"
              className="px-8 py-3 bg-white text-yellow-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Try It Free
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-100 dark:bg-gray-950 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>© 2024 GameVerse. All rights reserved.</p>
      </footer>
    </main>
  );
}
