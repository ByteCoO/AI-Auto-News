import os
import json
import datetime
from supabase import create_client, Client

# Supabase配置
SUPABASE_URL =  'https://mfpydhkkhscxpbmhtgmx.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcHlkaGtraHNjeHBibWh0Z214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDI2MTgsImV4cCI6MjA1Nzc3ODYxOH0.PIiGySjAUELSMllABgxop0HNO43nWJQ3Is0nl_Pk2u4'

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("请设置环境变量：NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY")

def init_supabase() -> Client:
    """初始化Supabase客户端"""
    try:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"初始化Supabase客户端失败: {e}")
        raise

def read_json_data(file_path: str) -> list:
    """读取JSON文件数据"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if not isinstance(data, list):
                raise ValueError('data.json格式不正确，预期为一个数组。')
            return data
    except FileNotFoundError:
        print(f"找不到文件: {file_path}")
        raise
    except json.JSONDecodeError as e:
        print(f"JSON解析错误: {e}")
        raise
    except Exception as e:
        print(f"读取文件时发生错误: {e}")
        raise

def format_news_data(news_data: list) -> list:
    """格式化新闻数据为通用对象，便于JSONB插入"""
    formatted = []
    for item in news_data:
        # 直接将每条新闻整体作为一个对象插入
        formatted.append({"News": item})
    return formatted

def insert_to_supabase(supabase: Client, formatted_data: list) -> None:
    """将数据插入到Supabase"""
    try:
        result = supabase.table('NSD').insert(formatted_data).execute()
        print(f"成功插入 {len(formatted_data)} 条新闻数据！")
    except Exception as e:
        print(f"插入数据时发生错误: {e}")
        raise

def main():
    try:
        # 初始化Supabase客户端
        supabase = init_supabase()
        
        # 获取当前脚本所在目录的路径
        script_dir = os.path.dirname(os.path.abspath(__file__))
        # 构建data.json的完整路径（假设在public目录下）
        json_path = os.path.join(os.path.dirname(script_dir), 'public', 'data.json')
        
        # 读取JSON数据
        news_data = read_json_data(json_path)
        
        # 格式化数据
        formatted_data = format_news_data(news_data)
        
        # 插入数据到Supabase
        insert_to_supabase(supabase, formatted_data)
        
        print("数据导入完成！")
        
    except Exception as e:
        print(f"程序执行出错: {e}")
        raise

if __name__ == "__main__":
    main()