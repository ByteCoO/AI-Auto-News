import fs from 'fs';
import path from 'path';

// 使用商业分析增强版数据
const DATA_PATH = 'D:/2026/reddit_data/reddit_comments/cleaned/1C_enriched_business.json';

export interface RedditComment {
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
  // 商业分析层字段（付费解锁）
  confidence_score: number;
  saas_category: string;
  mvp_features: string[];
  pricing_suggestion: string;
  competitors: string;
  market_size_estimate: string;
  why_worth_doing: string;
  target_audience_detail: string;
}

export function loadRedditData(): RedditComment[] {
  try {
    const fileContent = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error loading Reddit data:', error);
    return [];
  }
}

export function getStats(data: RedditComment[]) {
  const totalRecords = data.length;
  const highValueCount = data.filter(d => d.business_value >= 7).length;
  const saasIdeaCount = data.filter(d => d.saas_idea).length;
  const buySignalCount = data.filter(d => d.buy_signal).length;
  const avgPainLevel = data.reduce((sum, d) => sum + d.pain_level, 0) / totalRecords;
  const avgBusinessValue = data.reduce((sum, d) => sum + d.business_value, 0) / totalRecords;

  // Top SaaS ideas
  const saasIdeas = data
    .filter(d => d.saas_idea)
    .reduce((acc, d) => {
      acc[d.saas_idea!] = (acc[d.saas_idea!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topSaaSIdeas = Object.entries(saasIdeas)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([idea, count]) => ({ idea, count }));

  // Intent distribution
  const intents = data.reduce((acc, d) => {
    acc[d.intent_type] = (acc[d.intent_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sentiment distribution
  const sentiments = data.reduce((acc, d) => {
    acc[d.sentiment] = (acc[d.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Subreddit distribution
  const subreddits = data.reduce((acc, d) => {
    acc[d.subreddit] = (acc[d.subreddit] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalRecords,
    highValueCount,
    saasIdeaCount,
    buySignalCount,
    avgPainLevel: avgPainLevel.toFixed(2),
    avgBusinessValue: avgBusinessValue.toFixed(2),
    topSaaSIdeas,
    intents,
    sentiments,
    subreddits,
  };
}

export function getHighValueOpportunities(data: RedditComment[], limit = 20) {
  return data
    .filter(d => d.business_value >= 7)
    .sort((a, b) => b.business_value - a.business_value)
    .slice(0, limit);
}

export function getPainPoints(data: RedditComment[], limit = 15) {
  return data
    .filter(d => d.pain_level >= 4)
    .sort((a, b) => b.pain_level - a.pain_level || b.score - a.score)
    .slice(0, limit);
}

export function getBuySignals(data: RedditComment[], limit = 15) {
  return data
    .filter(d => d.buy_signal || d.intent_type === 'buy_intent')
    .sort((a, b) => b.business_value - a.business_value)
    .slice(0, limit);
}
