import os
import json
import argparse
import glob
from dotenv import load_dotenv
from supabase import create_client, Client

# 自动寻找并加载 Next.js 项目根目录的 .env.local 文件
env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ 错误: 找不到 Supabase URL 或 Key。请检查项目根目录的 .env.local 文件。")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def process_file(filepath):
    print(f"\n⏳ 正在处理文件: {filepath}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        posts = data.get("posts", [])
        if not posts:
            print(f"⚠️ 警告: 在文件 {filepath} 中没有找到 'posts' 数据。")
            return

        subreddit_default = data.get("subreddit", "unknown")
        fetch_date_default = data.get("fetch_date", None)

        records = []
        for post in posts:
            record = {
                "subreddit": post.get("subreddit", subreddit_default),
                "title": post.get("title"),
                "author": post.get("author"),
                "score": post.get("score", 0),
                "num_comments": post.get("num_comments", 0),
                "flair": post.get("flair"),
                "created_utc": post.get("created_utc"),
                "created_beijing": post.get("created_beijing"),
                "url": post.get("url"),
                "permalink": post.get("permalink"),
                "selftext": post.get("selftext", ""),
                "is_video": post.get("is_video", False),
                "domain": post.get("domain"),
                "rank": post.get("rank"),
                "fetch_date": fetch_date_default
            }
            records.append(record)

        response = supabase.table("reddit_posts").upsert(records, on_conflict="permalink").execute()
        print(f"✅ 成功导入/更新 {len(response.data)} 条数据！")

    except Exception as e:
        print(f"❌ 处理文件 {filepath} 时出错: {str(e)}")

if __name__ == "__main__":
    # 设置默认路径为当前脚本所在目录下的 data 文件夹
    default_path = os.path.join(os.path.dirname(__file__), 'data')
    
    parser = argparse.ArgumentParser(description="将爬取的 Reddit JSON 数据批量上传至 Supabase")
    parser.add_argument("path", nargs="?", default=default_path, help="JSON 文件或文件夹路径 (默认: ./data)")
    args = parser.parse_args()

    target_path = args.path

    if os.path.isdir(target_path):
        print(f"📂 检测到文件夹模式，正在扫描目录: {target_path}")
        json_files = glob.glob(os.path.join(target_path, "*.json"))
        if not json_files:
            print(f"⚠️ 警告: 目录 {target_path} 下没有找到任何 .json 文件。")
        for jf in json_files:
            process_file(jf)
    elif os.path.isfile(target_path) and target_path.endswith('.json'):
        process_file(target_path)
    else:
        print(f"❌ 错误: 无效路径 '{target_path}'。请确保文件夹或文件存在。")
