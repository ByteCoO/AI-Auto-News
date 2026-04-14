import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import BusinessInsightsClient from './BusinessInsightsClient';

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

  // Limit the initial server-side fetch to the first 10 items
  const { data, error } = await query.range(0, 9);
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

        {/* Client-side Insights List with Infinite Scroll */}
        <BusinessInsightsClient 
          initialInsights={insights} 
          currentSort={currentSort}
          currentCategory={currentCategory}
          searchQuery={searchQuery}
        />
      </div>
    </main>
  );
}
