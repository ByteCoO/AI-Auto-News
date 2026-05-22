'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  RocketLaunchIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  BoltIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';

interface Opportunity {
  id: string;
  title: string;
  subreddit: string;
  final_decision: string;
  demand_score: number;
  success_probability: string;
  estimated_revenue: string;
  painkiller_vs_vitamin: string;
  market_saturation: string;
  is_fake_demand: boolean;
  day_1_3: string;
  similar_product?: string;
}

function getDecisionColor(decision: string) {
  switch (decision) {
    case 'BUILD': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'VALIDATE': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'VALIDATE HARDER': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-blue-100 text-blue-800 border-blue-200';
  }
}

function getDecisionIcon(decision: string) {
  switch (decision) {
    case 'BUILD': return <RocketLaunchIcon className="w-4 h-4" />;
    case 'VALIDATE': return <BoltIcon className="w-4 h-4" />;
    case 'VALIDATE HARDER': return <ExclamationTriangleIcon className="w-4 h-4" />;
    default: return <ShieldCheckIcon className="w-4 h-4" />;
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-gray-500';
}

function getScoreBg(score: number) {
  if (score >= 80) return 'bg-emerald-50';
  if (score >= 70) return 'bg-blue-50';
  if (score >= 60) return 'bg-amber-50';
  return 'bg-gray-50';
}

const SORT_OPTIONS = [
  { value: 'demand_desc', label: 'Demand Score (High→Low)' },
  { value: 'demand_asc', label: 'Demand Score (Low→High)' },
  { value: 'success_desc', label: 'Success % (High→Low)' },
  { value: 'subreddit', label: 'Subreddit (A→Z)' },
];

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 6;

export default function OpportunityFilters({ opportunities }: { opportunities: Opportunity[] }) {
  const [decisionFilter, setDecisionFilter] = useState<string>('ALL');
  const [subredditFilter, setSubredditFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('demand_desc');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [autoLoad, setAutoLoad] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Extract unique subreddits
  const subreddits = useMemo(() => {
    const subs = [...new Set(opportunities.map(o => o.subreddit).filter(Boolean))];
    return subs.sort();
  }, [opportunities]);

  // Extract unique decisions
  const decisions = useMemo(() => {
    const decs = [...new Set(opportunities.map(o => o.final_decision).filter(Boolean))];
    return decs.sort();
  }, [opportunities]);

  // Filter and sort
  const filtered = useMemo(() => {
    let result = [...opportunities];

    if (decisionFilter !== 'ALL') {
      result = result.filter(o => o.final_decision === decisionFilter);
    }
    if (subredditFilter !== 'ALL') {
      result = result.filter(o => o.subreddit === subredditFilter);
    }

    switch (sortBy) {
      case 'demand_desc':
        result.sort((a, b) => (b.demand_score || 0) - (a.demand_score || 0));
        break;
      case 'demand_asc':
        result.sort((a, b) => (a.demand_score || 0) - (b.demand_score || 0));
        break;
      case 'success_desc':
        result.sort((a, b) => (parseInt(b.success_probability) || 0) - (parseInt(a.success_probability) || 0));
        break;
      case 'subreddit':
        result.sort((a, b) => (a.subreddit || '').localeCompare(b.subreddit || ''));
        break;
    }

    return result;
  }, [opportunities, decisionFilter, subredditFilter, sortBy]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [decisionFilter, subredditFilter, sortBy]);

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = useCallback(() => {
    setAutoLoad(true);
    setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, filtered.length));
  }, [filtered.length]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!autoLoad || !sentinelRef.current) return;
    if (visibleCount >= filtered.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, filtered.length));
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [autoLoad, visibleCount, filtered.length]);

  const buildCount = opportunities.filter(o => o.final_decision === 'BUILD').length;
  const validateCount = opportunities.filter(o => o.final_decision === 'VALIDATE' || o.final_decision === 'VALIDATE HARDER').length;
  const avgDemand = opportunities.length > 0
    ? Math.round(opportunities.reduce((sum, o) => sum + (o.demand_score || 0), 0) / opportunities.length)
    : 0;

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 px-4" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #ecfdf5 100%)' }}>
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block px-4 py-1 mb-6 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
            AI-Powered Market Intelligence
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            SaaS Opportunity Radar
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: 'var(--color-text-secondary)' }}>
            We analyze thousands of Reddit discussions to find <strong>real pain points</strong> people are willing to pay for.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'Opportunities', value: opportunities.length, icon: ChartBarIcon },
              { label: 'Ready to Build', value: buildCount, icon: RocketLaunchIcon },
              { label: 'Needs Validation', value: validateCount, icon: BoltIcon },
              { label: 'Avg Demand', value: avgDemand, icon: ArrowTrendingUpIcon },
            ].map((stat) => (
              <div key={stat.label} className="card-metric">
                <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--color-accent)' }} />
                <div className="metric-value">{stat.value}</div>
                <div className="metric-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-2">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition-colors"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
              backgroundColor: showFilters ? 'var(--color-surface-hover)' : 'var(--color-surface)',
            }}
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
          </button>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowsUpDownIcon className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm px-3 py-2 border rounded-lg"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Result count */}
          <span className="text-sm ml-auto" style={{ color: 'var(--color-text-muted)' }}>
            Showing {filtered.length} of {opportunities.length}
          </span>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 p-4 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Decision Filter */}
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Decision</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setDecisionFilter('ALL')}
                    className={`px-3 py-1 text-xs font-medium border rounded-full transition-colors ${
                      decisionFilter === 'ALL'
                        ? 'bg-gray-800 text-white border-gray-800'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    All
                  </button>
                  {decisions.map(dec => (
                    <button
                      key={dec}
                      onClick={() => setDecisionFilter(dec)}
                      className={`px-3 py-1 text-xs font-medium border rounded-full transition-colors ${
                        decisionFilter === dec
                          ? getDecisionColor(dec)
                          : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {dec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subreddit Filter */}
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Subreddit</label>
                <select
                  value={subredditFilter}
                  onChange={(e) => setSubredditFilter(e.target.value)}
                  className="w-full text-sm px-3 py-2 border rounded-lg"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  <option value="ALL">All Subreddits</option>
                  {subreddits.map(sub => (
                    <option key={sub} value={sub}>r/{sub}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Opportunities Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>No opportunities match your filters.</p>
          </div>
        ) : (
          <div className="dashboard-grid">
            {visibleItems.map((opp) => (
              <div key={opp.id} className="card group">
                <div className="h-1 -mt-4 -mx-4 mb-4" style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981)' }} />

                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold border rounded-full ${getDecisionColor(opp.final_decision)}`}>
                    {getDecisionIcon(opp.final_decision)}
                    {opp.final_decision}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{opp.subreddit || 'SaaS Discussion'}</span>
                </div>

                <h3 className="text-base font-semibold mb-3 line-clamp-2" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                  {opp.title === 'N/A' || !opp.title ? (opp.similar_product || 'SaaS Opportunity') : opp.title}
                </h3>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`rounded-lg p-3 text-center ${getScoreBg(opp.demand_score)}`}>
                    <div className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Demand</div>
                    <div className={`text-xl font-bold ${getScoreColor(opp.demand_score)}`}>{opp.demand_score}</div>
                  </div>
                  <div className={`rounded-lg p-3 text-center ${getScoreBg(parseInt(opp.success_probability) || 0)}`}>
                    <div className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Success</div>
                    <div className={`text-xl font-bold ${getScoreColor(parseInt(opp.success_probability) || 0)}`}>{opp.success_probability}</div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  {opp.estimated_revenue && (
                    <div className="flex items-center gap-2 text-sm">
                      <CurrencyDollarIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span style={{ color: 'var(--color-text-secondary)' }}>{opp.estimated_revenue}</span>
                    </div>
                  )}
                  {opp.painkiller_vs_vitamin && (
                    <div className="flex items-center gap-2 text-sm">
                      {opp.painkiller_vs_vitamin === 'painkiller' ? (
                        <CheckCircleIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      )}
                      <span className="capitalize" style={{ color: 'var(--color-text-secondary)' }}>{opp.painkiller_vs_vitamin}</span>
                    </div>
                  )}
                  {opp.market_saturation && (
                    <div className="flex items-center gap-2 text-sm">
                      <TrophyIcon className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span style={{ color: 'var(--color-text-secondary)' }}>Saturation: <span className="capitalize">{opp.market_saturation}</span></span>
                    </div>
                  )}
                </div>

                {opp.is_fake_demand && (
                  <div className="flex items-center gap-2 px-3 py-2 mb-3 text-xs rounded-lg bg-red-50 border border-red-200 text-red-700">
                    <XCircleIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
                    Potential fake demand detected
                  </div>
                )}

                {opp.day_1_3 && (
                  <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <div className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>30-Day Plan Preview</div>
                    <p className="text-sm line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>{opp.day_1_3}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-8">
            {!autoLoad ? (
              <button
                onClick={handleLoadMore}
                className="btn-primary px-8 py-3"
              >
                Load More ({filtered.length - visibleCount} remaining)
              </button>
            ) : (
              <div ref={sentinelRef} className="py-8">
                <div className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Loading more...
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
