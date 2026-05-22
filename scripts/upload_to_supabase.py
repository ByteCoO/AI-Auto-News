import os
import json
from supabase import create_client, Client

# 1. Supabase 配置 (请在运行前替换为您自己的实际 Key)
# 您可以在 Supabase Project Settings > API 中找到这些信息
url = "YOUR_SUPABASE_URL"
key = "YOUR_SUPABASE_ANON_KEY"
supabase: Client = create_client(url, key)

# 数据目录 - 存放爬虫分析结果的文件夹
DATA_DIR = r"D:\2025\Code\auto-NW\my-app\public\Idea"

def transform_and_upload():
    print(f"开始扫描目录: {DATA_DIR}")
    
    if not os.path.exists(DATA_DIR):
        print(f"错误: 目录 {DATA_DIR} 不存在")
        return

    files = [f for f in os.listdir(DATA_DIR) if f.endswith(".json") and "analysis" in f]
    print(f"发现 {len(files)} 个待处理的分析文件")

    for filename in files:
        file_path = os.path.join(DATA_DIR, filename)
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # 提取 Hot Leads
            hot_leads = data.get("hot_leads", [])
            if not hot_leads:
                print(f"[-] 跳过 {filename}: 无具体 Hot Leads 数据")
                continue

            for idx, lead in enumerate(hot_leads):
                # 将 JSON 数据映射到 Supabase 表结构 (符合截图中的 columns)
                payload = {
                    "lead_id": f"{filename.split('_')[0]}_{idx}", # 唯一标识符
                    "intent_signal": lead.get("intent_level", "MEDIUM").upper(),
                    "match_score": float(data.get("market_metrics", {}).get("demand_score", 0)) / 100,
                    "context": {
                        "platform": "Reddit",
                        "pain_point": data.get("market_metrics", {}).get("trend", ""),
                        "final_decision": data.get("final_decision", ""),
                        "market_summary": data.get("market_summary", "")
                    },
                    "user_profile": {
                        "user_type": lead.get("user_type", ""),
                        "suggested_dm": lead.get("suggested_dm", ""),
                        "behavior_signal": data.get("revenue_signal", {}).get("payment_behavior", [])
                    },
                    "sales_intelligence": {
                        "estimated_ltv": data.get("analog_case", {}).get("revenue_estimate", ""),
                        "conversion_probability": float(data.get("success_probability", {}).get("success_probability", "0%").replace('%','')) / 100,
                        "revenue_simulation": data.get("revenue_simulation", {})
                    },
                    "action_plan": {
                        "execution": data.get("execution_plan", {}),
                        "risk_analysis": data.get("risk_analysis", {})
                    },
                    "evidence": {
                        "quote": lead.get("quote", ""),
                        "sentiment": data.get("revenue_signal", {}).get("painkiller_vs_vitamin", ""),
                        "keywords": data.get("evidence_extraction", [{}])[0].get("quote", "")[:50]
                    },
                    "source": {
                        "url": data.get("evidence_extraction", [{}])[0].get("link", ""),
                        "subreddit": data.get("evidence_extraction", [{}])[0].get("subreddit", "SaaS")
                    }
                }

                # 执行 Upsert (根据 lead_id 自动更新或插入)
                try:
                    supabase.table("leads").upsert(payload, on_conflict="lead_id").execute()
                    print(f"[+] 成功上传/更新: {payload['lead_id']} (来自 {filename})")
                except Exception as e:
                    print(f"[!] 上传单条记录失败: {str(e)}")

        except Exception as e:
            print(f"[!] 读取文件 {filename} 出错: {str(e)}")

    print("所有任务处理完毕。")

if __name__ == "__main__":
    transform_and_upload()