"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import ExpandableText from '@/app/components/ExpandableText';

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

interface BusinessInsightsClientProps {
  initialInsights: BusinessInsight[];
  currentSort: string;
  currentCategory: string;
  searchQuery: string;
}

export default function BusinessInsightsClient({
  initialInsights,
  currentSort,
  currentCategory,
  searchQuery
}: BusinessInsightsClientProps) {
  const [insights, setInsights] = useState<BusinessInsight[]>(initialInsights);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialInsights.length >= 10);
  const [loading, setLoading] = useState(false);
  const [isFirstManualLoadDone, setIsFirstManualLoadDone] = useState(false);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    // Only start infinite scroll after the first manual load is done
    if (!isFirstManualLoadDone) return;

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreInsights();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, isFirstManualLoadDone]);

  // Reset state when filters change
  useEffect(() => {
    setInsights(initialInsights);
    setPage(1);
    setHasMore(initialInsights.length >= 10);
    setIsFirstManualLoadDone(false);
  }, [initialInsights]);

  const loadMoreInsights = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        sort: currentSort,
        category: currentCategory,
        q: searchQuery,
        page: page.toString(),
        limit: '10'
      });
      
      const res = await fetch(`/api/insights?${params.toString()}`);
      const result = await res.json();
      
      if (result.data && result.data.length > 0) {
        setInsights(prev => [...prev, ...result.data]);
        setPage(prev => prev + 1);
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualLoad = () => {
    setIsFirstManualLoadDone(true);
    loadMoreInsights();
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {insights.map((insight, index) => (
          <div 
            key={insight.idea_id + index} 
            ref={index === insights.length - 1 ? lastElementRef : null}
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
              <div className="mb-6">
                 <ExpandableText 
                    text={insight.original_quote}
                    className="text-gray-400 text-sm leading-relaxed"
                    maxLines={3}
                 />
              </div>

              <div className="border-l-[3px] border-red-500/60 bg-red-500/[0.03] p-4 rounded-r-xl">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-red-500 text-xs">⚡</span>
                     <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Pain Point</span>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed font-medium">{insight.problem_statement}</p>
              </div>

              <div className="border-l-[3px] border-green-500/60 bg-green-500/[0.03] p-4 rounded-r-xl">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-green-500 text-xs">💡</span>
                     <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Solution Idea</span>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed font-medium">{insight.solution_idea}</p>
              </div>

              <div className="border-l-[3px] border-purple-500/60 bg-purple-500/[0.03] p-4 rounded-r-xl">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-purple-500 text-xs">✨</span>
                     <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">AI Justification</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{insight.validation_evidence}</p>
              </div>

              <div className="pt-4 space-y-4">
                  <div>
                     <p className="text-[10px] font-black text-gray-600 uppercase mb-2 flex items-center gap-1">
                        Service Types
                     </p>
                     <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#1C2128] border border-[#30363D] text-purple-400 text-[10px] font-bold">{insight.category.toLowerCase()}</span>
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

      {hasMore && !isFirstManualLoadDone && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleManualLoad}
            disabled={loading}
            className="px-8 py-3 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-400 transition-all disabled:opacity-50"
          >
            {loading ? 'LOADING...' : 'LOAD MORE'}
          </button>
        </div>
      )}

      {loading && isFirstManualLoadDone && (
        <div className="mt-8 text-center text-gray-500 font-bold animate-pulse">
          LOADING MORE INSIGHTS...
        </div>
      )}

      {!hasMore && insights.length > 0 && (
        <div className="mt-12 text-center text-gray-600 text-sm">
          You've reached the end of the insights.
        </div>
      )}
    </>
  );
}
