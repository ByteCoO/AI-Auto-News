'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  ChartBarIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface Stats {
  totalPosts: number;
  buySignals: number;
  avgPainLevel: number;
  topSubreddits: Array<{ subreddit: string; count: number }>;
  recentSignals: Array<{
    subreddit: string;
    ai_summary: string;
    pain_level: number;
    buy_signal: boolean;
    created_at: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total count
      const { count: totalCount } = await supabase
        .from('reddit_opportunities')
        .select('*', { count: 'exact', head: true });

      // Get buy signals
      const { count: buySignalCount } = await supabase
        .from('reddit_opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('buy_signal', true);

      // Get average pain level
      const { data: painData } = await supabase
        .from('reddit_opportunities')
        .select('pain_level');

      const avgPain = painData
        ? Math.round(
            painData.reduce((sum, item) => sum + item.pain_level, 0) /
              painData.length
          )
        : 0;

      // Get top subreddits
      const { data: subredditData } = await supabase
        .from('reddit_opportunities')
        .select('subreddit');

      const subredditCounts: Record<string, number> = {};
      subredditData?.forEach((item) => {
        subredditCounts[item.subreddit] =
          (subredditCounts[item.subreddit] || 0) + 1;
      });

      const topSubreddits = Object.entries(subredditCounts)
        .map(([subreddit, count]) => ({ subreddit, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get recent signals
      const { data: recentData } = await supabase
        .from('reddit_opportunities')
        .select('subreddit, ai_summary, pain_level, buy_signal, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      setStats({
        totalPosts: totalCount || 0,
        buySignals: buySignalCount || 0,
        avgPainLevel: avgPain,
        topSubreddits,
        recentSignals: recentData || [],
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Trends Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Real-time monitoring of business opportunities and user pain points from Reddit
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Posts Analyzed
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats?.totalPosts || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Buy Signals
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {stats?.buySignals || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg Pain Level
                </p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                  {stats?.avgPainLevel || 0}/10
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Subreddits */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FireIcon className="w-5 h-5 mr-2 text-orange-500" />
              Top 5 Active Communities
            </h2>
            <div className="space-y-3">
              {stats?.topSubreddits.map((item, index) => (
                <div key={item.subreddit} className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                    #{index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        r/{item.subreddit}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.count} posts
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (item.count /
                              (stats?.topSubreddits[0]?.count || 1)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Signals */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-green-500" />
              Latest Business Signals
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {stats?.recentSignals.map((signal, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                      r/{signal.subreddit}
                    </span>
                    <div className="flex items-center space-x-2">
                      {signal.buy_signal && (
                        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
                          Buy Signal
                        </span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Pain: {signal.pain_level}/10
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {signal.ai_summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
