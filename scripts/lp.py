import pyperclip
import time
import os

output_filename = "clipboard_log.txt"
output_directory = "" # 当前目录
check_interval = 1  # 每隔多少秒检查一次

output_filepath = os.path.join(output_directory, output_filename)

print(f"监控剪贴板中... 新内容将追加到 '{output_filepath}'")
print("按 Ctrl+C 停止监控。")

recent_value = ""
try:
    while True:
        try:
            # 尝试读取剪贴板，忽略非文本内容错误
            clipboard_content = pyperclip.paste()
        except pyperclip.PyperclipException: 
            clipboard_content = None # 或许可以记录一个错误

        # 仅当内容是字符串且与上次不同时处理
        if isinstance(clipboard_content, str) and clipboard_content != recent_value:
            print("检测到新内容，正在写入文件...")
            try:
                with open(output_filepath, "a", encoding="utf-8") as f:
                    f.write(clipboard_content)
                    f.write("\n--- clipboard item end ---\n") # 分隔符
                recent_value = clipboard_content
                print("写入完成。")
            except Exception as e:
                print(f"写入文件时出错: {e}")
        elif not isinstance(clipboard_content, str) and recent_value != "[Non-Text Data]":
             # 如果是非文本内容且之前记录的不是非文本标记
             print("检测到非文本内容。")
             try:
                with open(output_filepath, "a", encoding="utf-8") as f:
                    f.write("[Non-Text Data Copied]")
                    f.write("\n--- clipboard item end ---\n") # 分隔符
                recent_value = "[Non-Text Data]" # 记录下来，避免重复写入标记
                print("已记录非文本标记。")
             except Exception as e:
                print(f"写入文件时出错: {e}")

        time.sleep(check_interval)
except KeyboardInterrupt:
    print("\n监控已停止。")
except Exception as e:
    print(f"\n发生意外错误: {e}")