import requests
import json

# 目标 API 地址
url = "https://www.bloomberg.com/lineup-next/api/stories?limit=50&pageNumber=1&types=ARTICLE,FEATURE,INTERACTIVE,LETTER,EXPLAINERS"

# 你的代理服务器地址
proxy_address = "http://127.0.0.1:7890"
proxies = {
   "http": proxy_address,
   "https": proxy_address,
}

# 伪装成浏览器的请求头
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
}

print(f"[*] 正在尝试通过代理 {proxy_address} 访问 API...")
print(f"[*] 目标 URL: {url}")

try:
    # 发送请求，同时使用代理和自定义请求头
    response = requests.get(url, headers=headers, proxies=proxies, timeout=20)

    # 检查响应状态码
    if response.status_code == 200:
        print("\n[SUCCESS] 请求成功！ 状态码: 200 OK")
        
        # 尝试解析 JSON 并打印部分内容
        try:
            data = response.json()
            print(f"[*] 成功获取到 {len(data)} 条新闻摘要。")
            if data:
                print("\n[*] 第一条新闻的标题是:")
                print(f"    '{data[0].get('primarySyndication', {}).get('headline', 'N/A')}'")
        except json.JSONDecodeError:
            print("[WARNING] 响应内容不是有效的 JSON 格式。")
            print("\n[*] 响应内容前 200 字符:")
            print(response.text[:200])

    else:
        print(f"\n[FAILURE] 请求失败！ 状态码: {response.status_code}")
        print("\n[*] 服务器响应内容:")
        print(response.text)

except requests.exceptions.ProxyError as e:
    print("\n[FATAL ERROR] 代理连接失败！")
    print("请确认你的代理程序正在运行，并且监听在 7890 端口。")
    print(f"错误详情: {e}")

except requests.exceptions.RequestException as e:
    print(f"\n[FATAL ERROR] 发生网络请求错误！")
    print(f"错误详情: {e}")