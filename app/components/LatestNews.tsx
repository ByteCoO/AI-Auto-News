'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Author {
  name: string;
  date: string;
  avatar: string;
}

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image: string;
  author: Author;
}

export default function LatestNews() {
  const [visibleItems, setVisibleItems] = useState(3); // 每行显示3个项目
  const [loading, setLoading] = useState(false);

  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "He Sweet Science Unveiled: A Ringside Journey",
      description: "Inside The Boxing Ring: Stories, Strategies, And The Unyielding Spirit Of Champions",
      image: "/news-boxing.jpg",
      author: {
        name: "James",
        date: "August 18, 2023",
        avatar: "/avatars/james.jpg"
      }
    },
    {
      id: 2,
      title: "Hoops And Heroes: Exploring The Thrilling World Of Basketball",
      description: "Beyond The Court: Dunking Into The Heart Of Basketball Culture And Unforgettable Moments",
      image: "/news-basketball.jpg",
      author: {
        name: "Sergio",
        date: "August 07, 2023",
        avatar: "/avatars/sergio.jpg"
      }
    },
    {
      id: 3,
      title: "Beyond The Ropes: The Timeless Artistry Of Boxing",
      description: "Inside The Square Circle: A Closer Look At The Passion, Perseverance, And Glory Of Boxing",
      image: "/news-boxing2.jpg",
      author: {
        name: "Jonatan",
        date: "October 27, 2023",
        avatar: "/avatars/jonatan.jpg"
      }
    },
    {
      id: 4,
      title: "The Evolution of Fighting Games",
      description: "From Arcade to Esports: The Journey of Combat Gaming Through Decades",
      image: "/news-fighting.jpg",
      author: {
        name: "Alex",
        date: "October 29, 2023",
        avatar: "/avatars/alex.jpg"
      }
    },
    {
      id: 5,
      title: "Racing Simulation Revolution",
      description: "Next-Gen Technology Brings Ultra-Realistic Racing Experience",
      image: "/news-racing.jpg",
      author: {
        name: "Maria",
        date: "October 30, 2023",
        avatar: "/avatars/maria.jpg"
      }
    },
    {
      id: 6,
      title: "RPG Gaming Masterpiece",
      description: "Creating Immersive Worlds: The Art of Role-Playing Games",
      image: "/news-rpg.jpg",
      author: {
        name: "Chris",
        date: "October 31, 2023",
        avatar: "/avatars/chris.jpg"
      }
    }
  ];

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
            <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="h-48 relative">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover"
                />
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative">
                      <Image 
                        src={item.author.avatar} 
                        alt={item.author.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.author.name}</p>
                      <p className="text-xs text-gray-500">{item.author.date}</p>
                    </div>
                  </div>
                  
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
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