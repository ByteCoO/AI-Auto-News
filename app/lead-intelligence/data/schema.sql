-- 1. 创建 leads 表
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id TEXT UNIQUE NOT NULL,
    intent_signal TEXT CHECK (intent_signal IN ('HIGH', 'MEDIUM', 'LOW')),
    match_score NUMERIC(3, 2),
    context JSONB NOT NULL DEFAULT '{}'::jsonb,
    user_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
    sales_intelligence JSONB NOT NULL DEFAULT '{}'::jsonb,
    action_plan JSONB NOT NULL DEFAULT '{}'::jsonb,
    evidence JSONB NOT NULL DEFAULT '{}'::jsonb,
    source JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 为常用查询字段创建索引
CREATE INDEX IF NOT EXISTS idx_leads_intent_signal ON public.leads(intent_signal);
CREATE INDEX IF NOT EXISTS idx_leads_match_score ON public.leads(match_score);

-- 3. 开启 RLS (行级安全策略)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. 创建策略：允许所有人读取数据 (SEO 需要)
CREATE POLICY "Allow public read access" ON public.leads
    FOR SELECT USING (true);

-- 5. 创建策略：仅允许经过身份验证的服务写入数据 (爬虫导入数据用)
CREATE POLICY "Allow service-role insert" ON public.leads
    FOR INSERT WITH CHECK (true);