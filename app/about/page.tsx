'use client';

import {
  HeartIcon,
  LightBulbIcon,
  UsersIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const team = [
  {
    name: 'Ming Zhang',
    role: 'Founder & CEO',
    bio: 'Former Google AI researcher with 10 years of ML experience. Passionate about democratizing business opportunities through AI.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  },
  {
    name: 'Xue Li',
    role: 'CTO',
    bio: 'Full-stack engineer and ex-Facebook tech lead. Specializes in large-scale data processing and distributed systems.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
  },
  {
    name: 'Qiang Wang',
    role: 'Head of AI Research',
    bio: 'NLP expert with 20+ top-tier conference papers. Dedicated to making AI understand real human needs.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  },
  {
    name: 'Mei Chen',
    role: 'Head of Product Design',
    bio: 'UX expert and former Apple designer. Believes great design makes complexity simple.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
  },
];

const values = [
  {
    icon: HeartIcon,
    title: 'Users First',
    description: 'Every feature starts with real user needs. We reject innovation theater.',
    color: 'red',
  },
  {
    icon: LightBulbIcon,
    title: 'Data-Driven',
    description: 'Let data speak louder than opinions. AI analysis beats gut feelings.',
    color: 'yellow',
  },
  {
    icon: UsersIcon,
    title: 'Open & Transparent',
    description: 'We open-source our methodologies and share both successes and failures.',
    color: 'blue',
  },
  {
    icon: GlobeAltIcon,
    title: 'Global Vision',
    description: 'Serving entrepreneurs worldwide, breaking geographic and information barriers.',
    color: 'green',
  },
];

const milestones = [
  {
    date: 'Q1 2023',
    title: 'Project Launched',
    description: 'GameVerse team formed, started developing AI business insights platform',
    icon: RocketLaunchIcon,
  },
  {
    date: 'Q2 2023',
    title: 'MVP Released',
    description: 'First usable version launched, acquired 100+ seed users',
    icon: SparklesIcon,
  },
  {
    date: 'Q3 2023',
    title: 'Data Breakthrough',
    description: 'Analyzed 500K+ data points, AI accuracy reached 90%+',
    icon: ChartBarIcon,
  },
  {
    date: 'Q4 2023',
    title: 'User Growth',
    description: 'Paid users exceeded 500+, secured seed funding',
    icon: UsersIcon,
  },
  {
    date: 'Q1 2024',
    title: 'Product Upgrade',
    description: 'Launched enterprise features, serving large-scale clients',
    icon: ShieldCheckIcon,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Real Business Opportunities with AI
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              GameVerse's mission is to empower every entrepreneur to find genuine user needs, not rely on guesswork and luck
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                🎯 500+ Customers
              </div>
              <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                📊 1M+ Data Analyzed
              </div>
              <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                🌍 Global Users
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            In this age of information overload, real opportunities are often hidden in massive discussions. We use AI technology to help you find those high-value signals, making entrepreneurship no longer a shot in the dark.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
              <LightBulbIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Why GameVerse?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              We've seen too many entrepreneurs fail because they didn't understand real user needs. Instead of spending months building a product nobody wants, why not validate the opportunity with data first? That's exactly what GameVerse solves.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
              <HeartIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              What We Believe
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              We believe data is more reliable than intuition, AI can give small teams the same insights as big companies, and sharing success is more valuable than keeping it secret. This is GameVerse's DNA.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Core Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              These values guide every decision we make
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center"
              >
                <div
                  className={`w-14 h-14 bg-${value.color}-100 dark:bg-${value.color}-900/30 rounded-xl flex items-center justify-center mx-auto mb-4`}
                >
                  <value.icon className={`w-7 h-7 text-${value.color}-600`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Team
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            AI and engineering experts from top tech companies
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 text-center"
            >
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4 w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                />
              </div>
              <div className="pt-16 pb-6 px-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              The growth path from idea to product
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-600"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.date}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div
                    className={`w-1/2 ${
                      index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'
                    }`}
                  >
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                        {milestone.date}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-800"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Discover Your Next Business Opportunity?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join 500+ teams already using GameVerse to drive their business decisions
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
              Get Started Free
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
