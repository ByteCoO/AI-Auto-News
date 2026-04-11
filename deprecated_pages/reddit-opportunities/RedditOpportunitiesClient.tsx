'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChartBarIcon,
  LightBulbIcon,
  FireIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface RedditComment {
  source_file: string;
  reddit_comment_id: string;
  reddit_post_id: string;
  parent_id: string;
  subreddit: string;
  author: string;
  body: string;
  score: number;
  depth: number;
  is_submitter: boolean;
  collapsed_reason_code: string | null;
  permalink: string;
  created_utc: number;
  created_beijing: string;
  fetch_date: string;
  intent_type: string;
  sentiment: string;
  pain_level: number;
  buy_signal: boolean;
  ai_summary: string | null;
  saas_idea: string | null;
  problem_summary: string;
  target_user: string | null;
  urgency: number;
  keywords: string[];
  business_value: number;
  analyzed_at: string;
  analysis_mode: string;
}

interface Stats {
  totalRecords: number;
  highValueCount: number;
  saasIdeaCount: number;
  buySignalCount: number;
  avgPainLevel: string;
  avgBusinessValue: string;
  topSaaSIdeas: Array<{ idea: string; count: number }>;
  intents: Record<string, number>;
  sentiments: Record<string, number>;
  subreddits: Record<string, number>;
}

interface PageProps {
  stats: Stats;
  highValueOpportunities: RedditComment[];
  painPoints: RedditComment[];
  buySignals: RedditComment[];
}

export default function RedditOpportunitiesPage({ stats, highValueOpportunities, painPoints, buySignals }: PageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'opportunities' | 'saas' | 'pain'>('overview');

  return (
    <div className="w-full p-4 md:p-8 pt-24 bg-white dark:bg-[#090B10] text-gray-900 dark:text-[#E2E8F0] transition-colors duration-300">
      {/* Header */}
      <header className="relative overflow-hidden bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-yellow-500/20 rounded-3xl p-8 mb-12 shadow-xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 dark:from-yellow-500/10 dark:to-amber-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 dark:from-blue-500/8 dark:to-purple-500/8 blur-[100px] rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-4 py-1.5 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 dark:from-yellow-500/20 dark:to-amber-500/20 border border-yellow-500/30 dark:border-yellow-500/40 text-yellow-700 dark:text-yellow-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 shadow-lg shadow-yellow-500/10">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"></span>
              Reddit Intelligence Engine
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
            <span className="bg-gradient-to-r from-gray-900 via-yellow-700 to-gray-900 dark:from-white dark:via-yellow-400 dark:to-white bg-clip-text text-transparent">
              Business Opportunity Radar
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl font-light">
            Extract SaaS ideas, user pain points, and buying signals from high-value Reddit comments
          </p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'overview' as const, label: 'Overview', icon: ChartBarIcon },
          { id: 'opportunities' as const, label: 'Top Opportunities', icon: CurrencyDollarIcon },
          { id: 'saas' as const, label: 'SaaS Ideas', icon: LightBulbIcon },
          { id: 'pain' as const, label: 'Pain Points', icon: ExclamationTriangleIcon },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 dark:from-yellow-400 dark:to-amber-400 text-gray-900 shadow-lg shadow-yellow-500/30'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
              icon={ChartBarIcon}
              label="Total Records"
              value={stats.totalRecords}
              color="blue"
            />
            <StatCard
              icon={FireIcon}
              label="High-Value"
              value={stats.highValueCount}
              color="yellow"
            />
            <StatCard
              icon={LightBulbIcon}
              label="SaaS Ideas"
              value={stats.saasIdeaCount}
              color="green"
            />
            <StatCard
              icon={CurrencyDollarIcon}
              label="Buy Signals"
              value={stats.buySignalCount}
              color="purple"
            />
            <StatCard
              icon={ExclamationTriangleIcon}
              label="Avg Pain Level"
              value={stats.avgPainLevel}
              color="red"
            />
            <StatCard
              icon={ArrowTrendingUpIcon}
              label="Avg Business Value"
              value={stats.avgBusinessValue}
              color="amber"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Intent Distribution */}
            <div className="bg-white dark:bg-[#11141B] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-yellow-500" />
                Intent Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.intents).map(([intent, count]) => (
                  <div key={intent} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-24 capitalize">{intent}</span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-end pr-2 transition-all"
                        style={{ width: `${(count / stats.totalRecords) * 100}%` }}
                      >
                        <span className="text-xs font-bold text-white">{count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sentiment Distribution */}
            <div className="bg-white dark:bg-[#11141B] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                Sentiment Analysis
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.sentiments).map(([sentiment, count]) => (
                  <div key={sentiment} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-24 capitalize">{sentiment}</span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-6 overflow-hidden">
                      <div
                        className={`h-full flex items-center justify-end pr-2 transition-all ${
                          sentiment === 'positive'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : sentiment === 'negative'
                            ? 'bg-gradient-to-r from-red-500 to-rose-500'
                            : 'bg-gradient-to-r from-gray-400 to-gray-500'
                        }`}
                        style={{ width: `${(count / stats.totalRecords) * 100}%` }}
                      >
                        <span className="text-xs font-bold text-white">{count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top SaaS Ideas Preview */}
          <div className="bg-white dark:bg-[#11141B] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <LightBulbIcon className="w-5 h-5 text-yellow-500" />
              Top 5 SaaS Ideas
            </h3>
            <div className="space-y-3">
              {stats.topSaaSIdeas.slice(0, 5).map((item, idx) => (
                <div key={item.idea} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <span className="text-2xl font-black text-yellow-500 w-8">#{idx + 1}</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">{item.idea}</p>
                    <p className="text-sm text-gray-500">Mentioned {item.count} times</p>
                  </div>
                  <div className="px-3 py-1 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-bold">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* High Value Opportunities Tab */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 dark:from-yellow-500/20 dark:to-amber-500/20 border border-yellow-500/30 dark:border-yellow-500/40 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <FireIcon className="w-6 h-6 text-yellow-500" />
              High-Value Opportunities ({highValueOpportunities.length})
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Comments with business value score ≥ 7</p>
          </div>

          <div className="grid gap-4">
            {highValueOpportunities.map((item, idx) => (
              <OpportunityCard key={item.reddit_comment_id} item={item} idx={idx} />
            ))}
          </div>
        </div>
      )}

      {/* SaaS Ideas Tab */}
      {activeTab === 'saas' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border border-green-500/30 dark:border-green-500/40 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <LightBulbIcon className="w-6 h-6 text-green-500" />
              SaaS Idea Leaderboard ({stats.saasIdeaCount})
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Actionable SaaS ideas extracted from user comments</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stats.topSaaSIdeas.map((item, idx) => (
              <div key={item.idea} className="bg-white dark:bg-[#11141B] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl hover:border-green-500/50 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl font-black text-green-500">#{idx + 1}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.idea}</h3>
                    <p className="text-sm text-gray-500">Mentioned {item.count} times</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                    SaaS Idea
                  </span>
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold">
                    {item.count} Mentions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pain Points Tab */}
      {activeTab === 'pain' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20 border border-red-500/30 dark:border-red-500/40 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
              User Pain Points ({painPoints.length})
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Comments with pain level ≥ 4, indicating strong user frustration or unmet needs</p>
          </div>

          <div className="grid gap-4">
            {painPoints.map((item, idx) => (
              <PainPointCard key={item.reddit_comment_id} item={item} idx={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-500 to-amber-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-rose-500',
    amber: 'from-amber-500 to-orange-500',
  };

  return (
    <div className="bg-white dark:bg-[#11141B] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 bg-gradient-to-br ${colorClasses[color]} rounded-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm text-gray-500 font-medium">{label}</span>
      </div>
      <p className="text-3xl font-black text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

// Opportunity Card Component
function OpportunityCard({ item, idx }: { item: RedditComment; idx: number }) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <div className="bg-white dark:bg-[#11141B] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl hover:border-yellow-500/50 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-black text-yellow-500">#{idx + 1}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded text-xs font-bold">
                BV: {item.business_value}
              </span>
              <span className="px-2 py-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 dark:text-purple-400 rounded text-xs font-bold border border-purple-500/20">
                🎯 Score: {item.confidence_score}/10
              </span>
              {item.buy_signal && (
                <span className="px-2 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded text-xs font-bold">
                  💰 Buy Signal
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              r/{item.subreddit} • @{item.author} • {item.created_beijing}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded text-xs font-bold ${
            item.pain_level >= 4 ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
          }`}>
            Pain: {item.pain_level}
          </span>
          <span className="px-2 py-1 bg-purple-500/10 text-purple-700 dark:text-purple-400 rounded text-xs font-bold">
            Urgency: {item.urgency}
          </span>
        </div>
      </div>

      {/* FREE TIER */}
      <p className="text-gray-900 dark:text-gray-200 mb-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg italic">
        "{item.body}"
      </p>

      {item.saas_idea && (
        <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded">
          <p className="text-sm font-bold text-green-700 dark:text-green-400">
            💡 SaaS Idea: {item.saas_idea}
          </p>
        </div>
      )}

      {item.target_user && (
        <p className="text-sm text-gray-500 mb-2">
          🎯 Target User: <span className="font-bold text-gray-700 dark:text-gray-300">{item.target_user}</span>
        </p>
      )}

      {/* PREMIUM TIER - Locked/Unlocked */}
      {isUnlocked ? (
        <div className="mt-4 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 text-xs font-black rounded">
              🔓 UNLOCKED
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
              <p className="text-xs text-purple-600 dark:text-purple-400 font-bold mb-1">📊 Confidence Score</p>
              <p className="text-2xl font-black text-purple-700 dark:text-purple-300">{item.confidence_score}/10</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{item.why_worth_doing}</p>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1">💰 Pricing Suggestion</p>
              <p className="text-xl font-black text-blue-700 dark:text-blue-300">{item.pricing_suggestion}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Market Size: {item.market_size_estimate}</p>
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-bold mb-2">🚀 MVP Features</p>
            <ul className="space-y-1">
              {item.mvp_features?.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-xs text-orange-600 dark:text-orange-400 font-bold mb-1">🏢 Competitors</p>
            <p className="text-sm text-orange-700 dark:text-orange-300">{item.competitors}</p>
          </div>

          <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
            <p className="text-xs text-teal-600 dark:text-teal-400 font-bold mb-1">🎯 Target Audience</p>
            <p className="text-sm text-teal-700 dark:text-teal-300">{item.target_audience_detail}</p>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-dashed border-yellow-500/30 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">🔒</span>
            <p className="text-lg font-black text-gray-700 dark:text-gray-300">Premium Business Analysis</p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Unlock confidence score, MVP features, pricing strategy, competitor analysis & more
          </p>
          <button
            onClick={() => setIsUnlocked(true)}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-gray-900 font-black rounded-lg shadow-lg shadow-yellow-500/30 transition-all transform hover:scale-105"
          >
            🔓 Unlock for $5/mo →
          </button>
          <p className="text-xs text-gray-400 mt-2">Includes: Score • MVP • Pricing • Competitors • Market Size</p>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <a
          href={item.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-colors"
        >
          View Original Post →
        </a>
        {!isUnlocked && (
          <button
            onClick={() => setIsUnlocked(true)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-gray-900 font-bold rounded-lg transition-all"
          >
            🔓 Unlock Analysis
          </button>
        )}
      </div>
    </div>
  );
}

// Pain Point Card Component
function PainPointCard({ item, idx }: { item: RedditComment; idx: number }) {
  return (
    <div className="bg-white dark:bg-[#11141B] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl hover:border-red-500/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-black text-red-500">#{idx + 1}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                item.pain_level >= 5 ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}>
                Pain: {item.pain_level}/5
              </span>
              <span className="px-2 py-1 bg-orange-500/10 text-orange-700 dark:text-orange-400 rounded text-xs font-bold">
                Sentiment: {item.sentiment}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              r/{item.subreddit} • @{item.author} • Score: {item.score}
            </p>
          </div>
        </div>
      </div>

      <p className="text-gray-900 dark:text-gray-200 mb-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg italic">
        "{item.body}"
      </p>

      {item.problem_summary && (
        <div className="mb-3 p-3 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded">
          <p className="text-sm text-orange-700 dark:text-orange-400">
            📋 Problem Summary: {item.problem_summary}
          </p>
        </div>
      )}

      {item.saas_idea && (
        <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded">
          <p className="text-sm font-bold text-green-700 dark:text-green-400">
            💡 Potential Solution: {item.saas_idea}
          </p>
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <a
          href={item.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-colors"
        >
          View Original Post →
        </a>
      </div>
    </div>
  );
}
