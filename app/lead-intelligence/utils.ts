import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { createClient } from '@supabase/supabase-js';
import { Lead } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getLeadsFromSupabase(): Promise<Lead[]> {
  // 使用 Supabase 的内置关联查询：抓取 hot_leads 及其关联的 projects 表数据
  const { data, error } = await supabase
    .from('hot_leads')
    .select(`
      *,
      projects (*)
    `)
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching leads from relational tables:', error);
    return [];
  }

  // 将打平的关系型数据映射回前端 UI 需要的嵌套 Lead 接口格式
  return (data as any[]).map(row => {
    const proj = row.projects;
    return {
      lead_id: `lead_${row.id}`,
      intent_signal: (row.intent_level || 'MEDIUM').toUpperCase(),
      match_score: (proj.mm_demand_score || 80) / 100,
      context: {
        platform: 'Reddit',
        target_product: proj.project_name || 'New Opportunity',
        pain_point: row.quote || 'No context provided',
        user_stage: proj.rs_painkiller_vs_vitamin || 'PAINKILLER',
        urgency: proj.mm_trend || 'RISING'
      },
      user_profile: {
        user_type: row.user_type || 'Potential User',
        estimated_budget: proj.rs_price_range || 'N/A',
        existing_tools: [],
        behavior_signal: []
      },
      sales_intelligence: {
        estimated_ltv: proj.ac_revenue_estimate || 'N/A',
        conversion_probability: parseFloat((proj.sp_success_probability || '50').replace('%','')) / 100,
        time_to_close: proj.sim_time_to_first_revenue || '14 days',
        competitor_weakness: proj.cr_market_saturation || 'High',
        winning_angle: proj.ep_first_revenue_strategy || 'Direct approach'
      },
      action_plan: {
        what_to_sell: [proj.ac_similar_product || 'SaaS'],
        entry_offer: proj.ep_day_1_3 || 'Consultation',
        upsell: proj.ep_day_11_30 || 'Enterprise',
        channel: 'Reddit DM',
        timing: 'Immediate',
        reply_script: row.suggested_dm || ''
      },
      evidence: {
        keywords_detected: [],
        sentiment: 'negative',
        raw_excerpt: row.quote
      },
      source: {
        url: '#',
        subreddit: 'SaaS'
      }
    };
  }) as Lead[];
}