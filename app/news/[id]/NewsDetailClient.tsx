'use client'; // 标记为客户端组件

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// 从 page.tsx 导入 NewsItem 类型 (或者在这里重新定义/共享)
interface NewsItem {
  id: number;
  created_at: string;
  News: {
    title?: string;
    content?: string;
    zh_body?: string;
  } | null;
}

interface NewsDetailClientProps {
  newsItem: NewsItem;
}

export default function NewsDetailClient({ newsItem }: NewsDetailClientProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoadingTTS, setIsLoadingTTS] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [audioUrlZh, setAudioUrlZh] = useState<string | null>(null);
  const [isLoadingTTSZh, setIsLoadingTTSZh] = useState<boolean>(false);
  const [isPlayingZh, setIsPlayingZh] = useState<boolean>(false);
  const [ttsErrorZh, setTtsErrorZh] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioRefZh = useRef<HTMLAudioElement>(null);

  const handlePlayTTS = async () => {
    if (!newsItem.News?.content) {
      setTtsError('没有可播报的内容。');
      return;
    }

    setIsLoadingTTS(true);
    setTtsError(null);
    setAudioUrl(null); // 清除旧的 URL
    setIsPlaying(false); // 重置播放状态

    const filename = `news_${newsItem.id}_${Date.now()}`;
    const textToSpeak = newsItem.News.content;

    try {
      // 修改 fetch URL 指向内部代理 API
      const response = await fetch('/api/tts-proxy', { // <--- 修改这里
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToSpeak,
          name: filename,
          voice: "zh-CN-XiaoxiaoNeural",
          rate: "-4%",
          volume: "+0%",
        }),
      });

      // 检查来自代理 API 的响应
      if (!response.ok) {
        // 尝试解析代理返回的错误信息
        const errorData = await response.json().catch(() => ({ message: '无法解析代理错误信息' }));
        // 抛出错误，包含从代理获取的状态码和消息
        throw new Error(`代理 API 错误: ${response.status} ${response.statusText} - ${errorData.message || ''}`);
      }

      // 假设代理 API 在成功时返回 { success: true, filename: '...' }
      // 或者即使不返回 filename，我们也可以在前端重新构建它，因为 filename 是在前端生成的
      // const responseData = await response.json(); // 如果需要从代理获取确认或数据

      // 关键：仍然使用原始的外部 GET URL 来获取音频文件
      const generatedAudioUrl = `https://fond-nina-ballpo-dba04486.koyeb.app/files/${filename}.mp3`;
      setAudioUrl(generatedAudioUrl);

    } catch (error) {
      console.error("TTS 请求失败 (通过代理):", error);
      setTtsError(error instanceof Error ? error.message : '生成语音时发生未知错误。');
    } finally {
      setIsLoadingTTS(false);
    }
  };

  const handlePlayTTSZh = async () => {
    if (!newsItem.News?.zh_body) {
      setTtsErrorZh('没有可播报的内容。');
      return;
    }

    setIsLoadingTTSZh(true);
    setTtsErrorZh(null);
    setAudioUrlZh(null);
    setIsPlayingZh(false);
    const filename = `news_${newsItem.id}_zh_${Date.now()}`;
    const textToSpeak = newsItem.News.zh_body;

    try {
      const response = await fetch('/api/tts-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToSpeak,
          name: filename,
          voice: "zh-CN-XiaoxiaoNeural",
          rate: "-4%",
          volume: "+0%",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '无法解析代理错误信息' }));
        throw new Error(`代理 API 错误: ${response.status} ${response.statusText} - ${errorData.message || ''}`);
      }

      const generatedAudioUrl = `https://fond-nina-ballpo-dba04486.koyeb.app/files/${filename}.mp3`;
      setAudioUrlZh(generatedAudioUrl);
    } catch (error) {
      console.error("TTS 请求失败 (通过代理):", error);
      setTtsErrorZh(error instanceof Error ? error.message : '生成语音时发生未知错误。');
    } finally {
      setIsLoadingTTSZh(false);
    }
  };

  // 当 audioUrl 更新后，尝试播放音频
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.load(); // 加载新的音频源
      audioRef.current.play().catch(e => {
         console.error("音频播放失败:", e);
         setTtsError("无法自动播放音频，请手动点击播放。");
         setIsPlaying(false); // 确保状态正确
      });
    }
  }, [audioUrl]);

  // 当 audioUrlZh 更新后，尝试播放音频
  useEffect(() => {
    if (audioUrlZh && audioRefZh.current) {
      audioRefZh.current.load();
      audioRefZh.current.play().catch(e => {
         console.error("音频播放失败:", e);
         setTtsErrorZh("无法自动播放音频，请手动点击播放。");
         setIsPlayingZh(false); // 确保状态正确
      });
    }
  }, [audioUrlZh]);

  // 更新播放状态
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    const audioElementZh = audioRefZh.current;
    if (!audioElementZh) return;

    const handlePlay = () => setIsPlayingZh(true);
    const handlePause = () => setIsPlayingZh(false);
    const handleEnded = () => setIsPlayingZh(false);

    audioElementZh.addEventListener('play', handlePlay);
    audioElementZh.addEventListener('pause', handlePause);
    audioElementZh.addEventListener('ended', handleEnded);
    return () => {
      audioElementZh.removeEventListener('play', handlePlay);
      audioElementZh.removeEventListener('pause', handlePause);
      audioElementZh.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
       audioRef.current.play().catch(e => console.error("手动播放失败:", e));
    }
  };

  const togglePlayPauseZh = () => {
    if (!audioRefZh.current) return;
    if (isPlayingZh) {
      audioRefZh.current.pause();
    } else {
       audioRefZh.current.play().catch(e => console.error("手动播放失败:", e));
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-3xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {newsItem.News?.title || '无标题'}
        </h1>
        <div className="text-sm text-gray-500 mb-6">
          发布时间: {new Date(newsItem.created_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>

        {/* TTS 控制按钮 */}
        <div className="my-6">
          <button
            onClick={handlePlayTTS}
            disabled={isLoadingTTS || !newsItem.News?.content}
            className={`px-4 py-2 rounded text-white font-semibold mr-4 ${isLoadingTTS ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50`}
          >
            {isLoadingTTS ? '正在生成语音...' : '生成并播放原文语音'}
          </button>
          {audioUrl && (
            <button
              onClick={togglePlayPause}
              className={`px-4 py-2 rounded text-white font-semibold mr-4 ${isPlaying ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isPlaying ? '暂停' : '播放'}
            </button>
          )}
          {ttsError && <p className="text-red-500 text-sm mt-2">{ttsError}</p>}
          <button
            onClick={handlePlayTTSZh}
            disabled={isLoadingTTSZh || !newsItem.News?.zh_body}
            className={`px-4 py-2 rounded text-white font-semibold mr-4 ${isLoadingTTSZh ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} disabled:opacity-50`}
          >
            {isLoadingTTSZh ? '正在生成语音...' : '生成并播放译文语音'}
          </button>
          {audioUrlZh && (
            <button
              onClick={togglePlayPauseZh}
              className={`px-4 py-2 rounded text-white font-semibold ${isPlayingZh ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isPlayingZh ? '暂停' : '播放'}
            </button>
          )}
          {ttsErrorZh && <p className="text-red-500 text-sm mt-2">{ttsErrorZh}</p>}
        </div>

        {/* 音频播放器 (可以隐藏) */}
        <audio ref={audioRef} src={audioUrl || undefined} className="w-full mt-4" controls></audio>
        <audio ref={audioRefZh} src={audioUrlZh || undefined} className="w-full mt-4" controls></audio>
        {/* 如果不想显示播放器控件，可以移除 controls 属性，或者用 CSS 隐藏 */}
        {/* <audio ref={audioRef} src={audioUrl || undefined} style={{ display: 'none' }}></audio> */}


        {/* 新闻内容 */}
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed mt-4">
          <p>{newsItem.News?.content || '暂无内容'}</p>
          {newsItem.News?.zh_body && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <div className="font-semibold text-gray-700 mb-2">译文：</div>
              <p>{newsItem.News.zh_body}</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link href="/news" className="text-blue-600 hover:underline">&larr; 返回新聞列表</Link>
        </div>
      </div>
    </div>
  );
}