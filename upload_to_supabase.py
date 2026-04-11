"""
上传 Reddit 数据到 Supabase 数据库
"""
import json
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# 加载环境变量
load_dotenv(".env.local")

# Supabase 配置
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("错误: 请在 .env 文件中设置 SUPABASE_URL 和 SUPABASE_KEY")
    exit(1)

# 初始化 Supabase 客户端
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def read_data(file_path):
    """读取 JSON 数据文件"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def upload_to_supabase(data):
    """上传数据到 Supabase"""
    success_count = 0
    error_count = 0
    skipped_count = 0

    print(f"开始上传 {len(data)} 条数据...")

    for item in data:
        try:
            # 准备数据（只上传表结构中存在的字段）
            record = {
                "reddit_comment_id": item["reddit_comment_id"],
                "subreddit": item["subreddit"],
                "body": item["body"],
                "intent_type": item["intent_type"],
                "sentiment": item["sentiment"],
                "pain_level": item["pain_level"],
                "buy_signal": item["buy_signal"],
                "ai_summary": item["ai_summary"],
                "saas_idea": item["saas_idea"]
            }

            # 插入数据（如果 reddit_comment_id 已存在会跳过）
            result = supabase.table("reddit_opportunities").insert(record).execute()

            if result.data:
                success_count += 1
                print(f"✓ 成功: {item['reddit_comment_id']}")
            else:
                skipped_count += 1
                print(f"⊘ 跳过(已存在): {item['reddit_comment_id']}")

        except Exception as e:
            error_count += 1
            print(f"✗ 错误: {item['reddit_comment_id']} - {str(e)}")

    print(f"\n上传完成:")
    print(f"  成功: {success_count}")
    print(f"  跳过: {skipped_count}")
    print(f"  错误: {error_count}")

def main():
    # 数据文件路径
    data_file = os.path.join(os.path.dirname(__file__), "out", "data2.json")

    if not os.path.exists(data_file):
        print(f"错误: 找不到数据文件 {data_file}")
        exit(1)

    # 读取数据
    print(f"读取数据文件: {data_file}")
    data = read_data(data_file)
    print(f"共读取 {len(data)} 条记录\n")

    # 上传到 Supabase
    upload_to_supabase(data)

if __name__ == "__main__":
    main()
