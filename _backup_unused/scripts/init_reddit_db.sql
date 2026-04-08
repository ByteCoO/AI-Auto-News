-- 创建核心表：reddit_posts
CREATE TABLE IF NOT EXISTS public.reddit_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- 1. 基础元数据 (来自你的爬虫 JSON)
    subreddit VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    author VARCHAR(255),
    score INTEGER DEFAULT 0,
    num_comments INTEGER DEFAULT 0,
    flair VARCHAR(255),
    created_utc DOUBLE PRECISION,
    created_beijing TIMESTAMP WITH TIME ZONE,
    url TEXT,
    permalink TEXT UNIQUE NOT NULL, -- 使用 permalink 作为唯一约束，防止重复插入
    selftext TEXT,
    is_video BOOLEAN DEFAULT FALSE,
    domain VARCHAR(255),
    rank INTEGER,
    fetch_date TIMESTAMP WITH TIME ZONE,

    -- 2. AI 商业价值衍生字段 (针对你的赚钱方案预留)
    -- 用于存储 LLM 分析后的结果
    intent_type VARCHAR(255),    -- 意图分类：如 'tool_request' (找工具), 'complaint' (抱怨), 'discussion' (讨论)
    pain_level INTEGER,          -- 痛点指数：1-5 分，分数越高越急迫
    buy_signal BOOLEAN,          -- 购买信号：是否表达了明确的付费意愿
    ai_summary TEXT,             -- AI 一句话商业价值总结，用于前端 Dashboard 展示
    saas_idea TEXT,              -- AI 自动生成的 SaaS 切入点

    -- 3. 系统字段
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 创建索引以加速前端 Dashboard 查询
CREATE INDEX idx_reddit_posts_subreddit ON public.reddit_posts(subreddit);
CREATE INDEX idx_reddit_posts_score ON public.reddit_posts(score DESC);
CREATE INDEX idx_reddit_posts_fetch_date ON public.reddit_posts(fetch_date DESC);
CREATE INDEX idx_reddit_posts_buy_signal ON public.reddit_posts(buy_signal) WHERE buy_signal = true;

-- 开启行级安全 (RLS)
ALTER TABLE public.reddit_posts ENABLE ROW LEVEL SECURITY;

-- 策略：允许所有人读取 (方便 Next.js 前端展示)
CREATE POLICY "Allow public read access"
    ON public.reddit_posts
    FOR SELECT
    USING (true);

-- 策略：允许 Service Role 插入/更新 (用于你的 MCP/爬虫后台写入)
CREATE POLICY "Allow service role to insert"
    ON public.reddit_posts
    FOR INSERT
    WITH CHECK (true);
    
CREATE POLICY "Allow service role to update"
    ON public.reddit_posts
    FOR UPDATE
    USING (true);
