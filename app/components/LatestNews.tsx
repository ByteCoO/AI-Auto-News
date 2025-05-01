'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Author {
  name: string;
  date: string;
  avatar: string;
}

interface NewsItem {
  id: number;
  created_at: string;
  News: {
    title?: string;
    content?: string;
  } | null;
}

export default function LatestNews() {
  const [visibleItems, setVisibleItems] = useState(3); // 每行显示3个项目
  const [loading, setLoading] = useState(false);

  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('NSD')
        .select('id, created_at, News')
        .order('created_at', { ascending: false });
  
      if (error) {
        console.error('Error fetching news:', error);
      } else {
        setNewsItems(data || []);
      }
    };
  
    fetchNews();
  }, []);

  const loadMore = () => {
    setLoading(true);
    // 模拟加载延迟
    setTimeout(() => {
      setVisibleItems(prev => Math.min(prev + 3, newsItems.length));
      setLoading(false);
    }, 800);
  };

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        if (!loading && visibleItems < newsItems.length) {
          loadMore();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, visibleItems]);

  return (
    <div className="py-8 bg-[#f7e5d0]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {newsItems.slice(0, visibleItems).map((item) => (
            <Link href={`/news/${item.id}`} key={item.id} className="block bg-white rounded-lg shadow-md p-6 transition hover:shadow-lg cursor-pointer">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{item.News?.title || '无标题'}</h3>
            </Link>
          ))}
        </div>
        {loading && (
          <div className="text-center mt-6">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-800 border-r-transparent"></div>
          </div>
        )}
        {!loading && visibleItems < newsItems.length && (
          <div className="text-center mt-6">
            <button 
              onClick={loadMore}
              className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              加载更多
            </button>
          </div>
        )}
      </div>
    </div>
  );
}