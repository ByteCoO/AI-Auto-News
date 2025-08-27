// app/page.tsx
'use client'; // 声明这是一个客户端组件，因为我们需要使用 state 和事件处理

import { useState, FormEvent } from 'react';

// SEO should be handled by a parent server component or in the root layout.

// TypeScript 类型定义，用于描述从 Jina API 返回的数据结构
interface JinaData {
  code: number;
  status: number;
  data: {
    url: string;
    title: string;
    content: string;
    links?: { url: string; text: string }[];
    // 可以根据需要添加更多字段
  };
}

export default function HomePage() {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JinaData | null>(null);

  /**
   * 根据 URL 生成一个安全的文件名 (TypeScript 版本)
   */
  const generateFilenameFromUrl = (urlStr: string): string => {
    // 移除协议头
    const filenameBase = urlStr.replace(/https?:\/\//, '');
    // 将所有非字母数字的字符替换为下划线
    const safeFilename = filenameBase.replace(/[^a-zA-Z0-9.]+/g, '_');
    // 移除末尾可能出现的下划线
    return `${safeFilename.replace(/_$/, '')}.json`;
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // 阻止页面重新加载
    
    if (!url.trim()) {
      setError('❌ URL 不能为空！');
      return;
    }

    // 重置状态
    setIsLoading(true);
    setError(null);
    setResult(null);

    // 如果用户忘记输入 http:// 或 https://，自动帮忙补上 https://
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        console.log("🔧 检测到 URL缺少协议头，已自动添加 'https://'");
        targetUrl = 'https://' + targetUrl;
    }

    try {
      // 调用我们自己的后端 API Route
      const response = await fetch('/api/jina-reader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!response.ok) {
        // 如果后端返回错误，则尝试解析错误信息
        const errorData = await response.json();
        throw new Error(errorData.error || `请求失败，状态码: ${response.status}`);
      }
      
      const data: JinaData = await response.json();
      setResult(data);
      console.log("✅ 请求成功！已获取到 JSON 数据。", data);

    } catch (err: any) {
      console.error("❌ 请求失败:", err);
      setError(`❌ 请求失败: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 处理下载
   */
  const handleDownload = () => {
      if (!result) return;
      
      const filename = generateFilenameFromUrl(result.data.url);
      const jsonStr = JSON.stringify(result, null, 2); // 美化 JSON 格式
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const href = URL.createObjectURL(blob);
      
      // 创建一个临时的 a 标签来触发下载
      const link = document.createElement('a');
      link.href = href;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // 清理
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
      console.log(`💾 文件 ${filename} 已开始下载。`);
  };

  return (
    <main className="container mx-auto p-4 md:p-8 font-sans bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Jina Reader Web
        </h1>
        <p className="text-gray-600 mb-6">
          输入一个 URL，通过 Jina Reader API 提取其主要内容。
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="👉 请输入完整的 URL (例如: https://www.example.com)"
            className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isLoading ? '提取中...' : '🚀 提取内容'}
          </button>
        </form>

        {/* 状态显示区域 */}
        <div className="mt-6">
            {isLoading && (
                <div className="text-center text-gray-500">
                    <p>🚀 正在请求 Jina Reader API，请稍候...</p>
                </div>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
                    <p>{error}</p>
                </div>
            )}
            {result && (
                <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">提取结果</h2>
                            <p className="text-sm text-gray-500 truncate" title={result.data.title}>
                                标题: {result.data.title}
                            </p>
                        </div>
                        <button 
                            onClick={handleDownload}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition"
                        >
                            💾 下载 JSON
                        </button>
                    </div>
                    <pre className="p-4 text-sm bg-gray-900 text-green-300 overflow-x-auto max-h-[60vh]">
                        <code>{JSON.stringify(result, null, 2)}</code>
                    </pre>
                </div>
            )}
        </div>
      </div>
    </main>
  );
}