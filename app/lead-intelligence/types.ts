export interface Lead {
  lead_id: string;
  intent_signal: "HIGH" | "MEDIUM" | "LOW";
  match_score: number;
  context: {
    platform: string;
    target_product: string;
    pain_point: string;
    user_stage: string;
    urgency: string;
  };
  user_profile: {
    user_type: string;
    estimated_budget: string | null;
    existing_tools: string[];
    behavior_signal: string[];
  };
  sales_intelligence: {
    estimated_ltv: string | null;
    conversion_probability: number;
    time_to_close: string;
    competitor_weakness: string;
    winning_angle: string;
  };
  action_plan: {
    what_to_sell: string[];
    entry_offer: string;
    upsell: string;
    channel: string;
    timing: string;
    reply_script: string;
  };
  evidence: {
    keywords_detected: string[];
    sentiment: string;
    raw_excerpt: string;
  };
  source: {
    url: string;
    subreddit?: string;
  };
}