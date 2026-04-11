import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import ExpandableText from '@/app/components/ExpandableText';

export const dynamic = 'force-dynamic';

interface BusinessInsight {
  id: string;
  idea_id: string;
  category: string;
  signal_type: string;
  problem_statement: string;
  solution_idea: string;
  validation_evidence: string;
  original_quote: string;
  competitor_mentioned: string | null;
  source_permalink: string;
  author: string;
  subreddit: string;
  score: number;
  created_beijing: string;
  signal_count: number;
}

async function getInsights(sort: string = 'top', category: string = 'all', queryStr: string = ''): Promise<BusinessInsight[]> {
  let query = supabase.from('business_insights').select('*');
  if (category !== 'all') query = query.eq('category', category);
  if (queryStr) query = query.or(`problem_statement.ilike.%${queryStr}%,solution_idea.ilike.%${queryStr}%`);
  
  if (sort === 'new') {
    query = query.order('created_beijing', { ascending: false });
  } else {
    query = query.order('score', { ascending: false });
  }

  const { data, error } = await query;
  return (data as BusinessInsight[]) || [];
}

async function getCategories(): Promise<string[]> {
  const { data } = await supabase.from('business_insights').select('category');
  if (!data) return ['all'];
  const categories = Array.from(new Set(data.map(item => item.category)));
  return ['all', ...categories.sort()];
}

export default async function BusinessInsightsPage({ 
  searchParams 
}: { 
  searchParams: { sort?: string; category?: string; q?: string } 
}) {
  const currentSort = searchParams.sort || 'top';
  const currentCategory = searchParams.category || 'all';
  const searchQuery = searchParams.q || '';
  
  const [insights, categories] = await Promise.all([
    getInsights(currentSort, currentCategory, searchQuery),
    getCategories()
  ]);

  return (
    <main className="min-h-screen bg-[#0F1219] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
               BUSINESS <span className="text-yellow-500">INSIGHTS</span>
             </h1>
             <p className="text-gray-500 text-sm mt-1">Data-driven opportunities from across the web.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <form action="" method="get">
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search topics..."
                className="w-full bg-[#1A1F2B] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-yellow-500/50 outline-none"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
          </div>
        </div>

        {/* Navigation & Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
           {categories.map((cat) => (
              <Link
                key={cat}
                href={`?category=${cat}&sort=${currentSort}${searchQuery ? `&q=${searchQuery}` : ''}`}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentCategory === cat
                    ? 'bg-yellow-500 text-black shadow-lg'
                    : 'bg-[#1A1F2B] text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {cat.toUpperCase()}
              </Link>
            ))}
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {insights.map((insight) => (
            <div 
              key={insight.idea_id} 
              className="bg-[#161B22] rounded-3xl border border-[#30363D] overflow-hidden shadow-xl"
            >
              {/* Header: Title and Circle Score */}
              <div className="p-6 pb-2 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <span className="text-blue-400 text-xs font-bold">{insight.subreddit[0].toUpperCase()}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white leading-snug pr-8 line-clamp-2">
                    {insight.problem_statement}
                  </h2>
                </div>
                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-yellow-500/40 flex items-center justify-center">
                   <span className="text-[10px] font-black text-yellow-500">{Math.floor(insight.score/10)}</span>
                </div>
              </div>

              <div className="px-6 mb-4">
                <p className="text-xs text-gray-500 font-medium">r/{insight.subreddit}</p>
              </div>

              {/* Meta Stats Bar */}
              <div className="px-6 py-3 mx-6 rounded-xl bg-[#0D1117] border border-[#30363D] flex flex-wrap gap-5 text-[11px] font-bold">
                <div className="flex items-center gap-1.5 text-orange-400">
                  <span>👍</span> {insight.score} Upvotes
                </div>
                <div className="flex items-center gap-1.5 text-green-400">
                  <span>📊</span> 91% Upvote Ratio
                </div>
                <div className="flex items-center gap-1.5 text-blue-400">
                  <span>💬</span> {insight.signal_count} Comments
                </div>
                <div className="flex items-center gap-1.5 text-purple-400">
                  <span>🕒</span> 2 days ago
                </div>
              </div>

              {/* Content Sections */}
              <div className="p-6 space-y-5">
                {/* Original Quote - Expandable */}
                <div className="mb-6">
                   <ExpandableText 
                      text={insight.original_quote}
                      className="text-gray-400 text-sm leading-relaxed"
                      maxLines={3}
                   />
                </div>

                {/* Pain Point Block */}
                <div className="border-l-[3px] border-red-500/60 bg-red-500/[0.03] p-4 rounded-r-xl">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-red-500 text-xs">⚡</span>
                       <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Pain Point</span>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed font-medium">{insight.problem_statement}</p>
                </div>

                {/* Solution Block */}
                <div className="border-l-[3px] border-green-500/60 bg-green-500/[0.03] p-4 rounded-r-xl">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-green-500 text-xs">💡</span>
                       <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Solution Idea</span>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed font-medium">{insight.solution_idea}</p>
                </div>

                {/* AI Justification */}
                <div className="border-l-[3px] border-purple-500/60 bg-purple-500/[0.03] p-4 rounded-r-xl">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-purple-500 text-xs">✨</span>
                       <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">AI Justification</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{insight.validation_evidence}. Community feedback confirms high demand for performance-focused alternatives.</p>
                </div>

                {/* Tags Section */}
                <div className="pt-4 space-y-4">
                    <div>
                       <p className="text-[10px] font-black text-gray-600 uppercase mb-2 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                          Service Types
                       </p>
                       <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#1C2128] border border-[#30363D] text-purple-400 text-[10px] font-bold">{insight.category.toLowerCase()}</span>
                          <span className="px-3 py-1 rounded-full bg-[#1C2128] border border-[#30363D] text-yellow-500/70 text-[10px] font-bold">SaaS Platform</span>
                          <span className="px-3 py-1 rounded-full bg-[#1C2128] border border-[#30363D] text-green-400/70 text-[10px] font-bold">Mobile App</span>
                       </div>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-600 uppercase mb-2 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                          Topics
                       </p>
                       <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#1C2128] border border-[#30363D] text-blue-400 text-[10px] font-bold">Performance Optimization</span>
                          <span className="px-3 py-1 rounded-full bg-[#1C2128] border border-[#30363D] text-red-400 text-[10px] font-bold">Market Gap</span>
                          <span className="px-3 py-1 rounded-full bg-[#1C2128] border border-[#30363D] text-emerald-400 text-[10px] font-bold">{insight.subreddit}</span>
                       </div>
                    </div>
                </div>
              </div>

              <Link 
                href={insight.source_permalink}
                target="_blank"
                className="block border-t border-gray-800 p-4 text-center text-[11px] font-bold text-gray-500 hover:text-yellow-500 transition-colors uppercase tracking-widest"
              >
                View original discussion on Reddit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
