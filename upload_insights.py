import json
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# 加载环境变量
load_dotenv(".env.local")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("错误: 请在 .env.local 中设置 SUPABASE_URL 和 SUPABASE_KEY")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_insights():
    data_file = os.path.join("out", "8", "business_insights_top20_en.json")
    
    if not os.path.exists(data_file):
        print(f"找不到文件: {data_file}")
        return

    with open(data_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"准备上传 {len(data)} 条商业洞察数据...")

    for item in data:
        # 平铺数据结构以符合 SQL 表
        record = {
            "idea_id": item["idea_id"],
            "category": item["category"],
            "signal_type": item["signal_type"],
            "problem_statement": item["problem_statement"],
            "solution_idea": item["solution_idea"],
            "validation_evidence": item["validation_evidence"],
            "original_quote": item["original_quote"],
            "competitor_mentioned": item["competitor_mentioned"],
            "source_permalink": item["source_permalink"],
            "author": item["meta"]["author"],
            "subreddit": item["meta"]["subreddit"],
            "score": item["meta"]["score"],
            "created_beijing": item["meta"]["created_beijing"],
            "signal_count": item["meta"]["signal_count"]
        }

        try:
            # 使用 upsert，如果 idea_id 已存在则更新，不存在则插入
            supabase.table("business_insights").upsert(record, on_conflict="idea_id").execute()
            print(f"✓ 已同步: {item['idea_id']}")
        except Exception as e:
            print(f"✗ 失败: {item['idea_id']} - {str(e)}")

if __name__ == "__main__":
    upload_insights()