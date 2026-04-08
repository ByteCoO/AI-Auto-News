import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client
from openai import OpenAI

# 1. 加载配置
env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
load_dotenv(dotenv_path=env_path)

# Supabase 配置
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

# LLM 配置 (支持 OpenAI/DeepSeek/SiliconFlow 等)
LLM_API_KEY = os.environ.get("LLM_API_KEY")
LLM_BASE_URL = os.environ.get("LLM_BASE_URL", "https://api.openai.com/v1")
LLM_MODEL = os.environ.get("LLM_MODEL", "gpt-3.5-turbo")

if not all([SUPABASE_URL, SUPABASE_KEY, LLM_API_KEY]):
    print("❌ 错误: 请确保 .env.local 中配置了 SUPABASE 和 LLM_API_KEY")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
client = OpenAI(api_key=LLM_API_KEY, base_url=LLM_BASE_URL)

PROMPT_TEMPLATE = """
你是一个商业机会分析专家。请分析以下 Reddit 帖子的内容，并以 JSON 格式输出分析结果。

帖子标题: {title}
帖子内容: {selftext}

请输出以下字段的 JSON 对象：
1. intent_type: 分类为 'tool_request' (找工具), 'complaint' (抱怨痛点), 'showcase' (展示产品), 'discussion' (一般讨论)。
2. pain_level: 痛点指数，1-5 的整数，5 为最痛/需求最急迫。
3. buy_signal: 布尔值，是否有明确的购买或付费意愿。
4. ai_summary: 用一句话总结这个帖子的核心商业价值。
5. saas_idea: 如果痛点高，请给出一个针对性的 SaaS 解决思路。

只输出 JSON，不要任何其它解释文字。
"""

def analyze_posts():
    # 查找尚未分析的帖子 (intent_type 为空)
    print("🔍 正在从数据库查找未分析的帖子...")
    response = supabase.table("reddit_posts").select("*").is_("intent_type", "null").limit(10).execute()
    posts = response.data

    if not posts:
        print("✅ 所有帖子已分析完毕或无新数据。")
        return

    print(f"🚀 开始分析 {len(posts)} 个帖子...")

    for post in posts:
        try:
            print(f"正在分析: {post['title'][:50]}...")
            
            completion = client.chat.completions.create(
                model=LLM_MODEL,
                messages=[
                    {"role": "system", "content": "You are a business intelligence assistant that outputs valid JSON."},
                    {"role": "user", "content": PROMPT_TEMPLATE.format(title=post['title'], selftext=post['selftext'] or "无内容")}
                ],
                response_format={"type": "json_object"}
            )
            
            analysis = json.loads(completion.choices[0].message.content)
            
            # 更新数据库
            supabase.table("reddit_posts").update({
                "intent_type": analysis.get("intent_type"),
                "pain_level": analysis.get("pain_level"),
                "buy_signal": analysis.get("buy_signal"),
                "ai_summary": analysis.get("ai_summary"),
                "saas_idea": analysis.get("saas_idea")
            }).eq("id", post["id"]).execute()
            
            print(f"✅ 分析完成并存入数据库！")

        except Exception as e:
            print(f"❌ 分析帖子 {post['id']} 时出错: {e}")

if __name__ == "__main__":
    analyze_posts()
