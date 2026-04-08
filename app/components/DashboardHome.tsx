'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { 
  NewspaperIcon, 
  GlobeAltIcon, 
  TrendingUpIcon,
  PlayIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: string;
}

export default function DashboardHome() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger scroll reveal animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    setIsVisible(true);

    return () => observer.disconnect();
  }, []);

  const featuredNews: NewsItem[] = [
    {
      id: '1',
      title: 'AI Revolution in Gaming: How Machine Learning is Transforming Player Experience',
      source: 'TechCrunch',
      time: '2 hours ago',
      category: 'AI & Gaming'
    },
    {
      id: '2',
      title: 'Breakthrough in Quantum Computing Could Change Everything',
      source: 'Wired',
      time: '4 hours ago',
      category: 'Technology'
    },
    {
      id: '3',
      title: 'The Future of Virtual Reality: What to Expect in 2024',
      source: 'The Verge',
      time: '6 hours ago',
      category: 'VR/AR'
    }
  ];

  const quickActions = [
    { icon: <NewspaperIcon className="w-6 h-6" />, label: 'Create Article', color: 'var(--color-accent)' },
    { icon: <GlobeAltIcon className="w-6 h-6" />, label: 'Publish News', color: '#10b981' },
    { icon: <TrendingUpIcon className="w-6 h-6" />, label: 'View Analytics', color: '#3b82f6' },
    { icon: <PlayIcon className="w-6 h-6" />, label: 'Media Library', color: '#8b5cf6' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className={`text-center py-8 ${isVisible ? 'animate-slide-up' : ''}`}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Your Content Hub
          </h2>
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            Manage your AI, gaming, and tech news content from one powerful dashboard
          </p>
        </div>

        {/* Quick Actions */}
        <div className={`reveal-on-scroll ${isVisible ? 'visible' : ''}`}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={action.label}
                className={`card micro-bounce text-center p-6 ${isVisible ? 'animate-fade-in-delayed' : ''}`}
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="flex items-center justify-center mb-3" style={{ color: action.color }}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured News */}
        <div className={`reveal-on-scroll ${isVisible ? 'visible' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Featured Content
            </h3>
            <button className="btn-primary micro-bounce">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {featuredNews.map((news, index) => (
              <div
                key={news.id}
                className={`card micro-bounce cursor-pointer ${isVisible ? 'animate-fade-in-delayed' : ''}`}
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{ 
                          backgroundColor: 'var(--color-accent)',
                          color: 'white'
                        }}
                      >
                        {news.category}
                      </span>
                      <span className="text-xs ml-2" style={{ color: 'var(--color-text-muted)' }}>
                        {news.source} • {news.time}
                      </span>
                    </div>
                    <h4 className="font-medium text-base leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                      {news.title}
                    </h4>
                  </div>
                  <button className="ml-4 p-2 rounded-lg micro-bounce" style={{ backgroundColor: 'var(--color-surface-hover)' }}>
                    <ChatBubbleLeftRightIcon className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Stats */}
        <div className={`reveal-on-scroll ${isVisible ? 'visible' : ''}`}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Content Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`card ${isVisible ? 'animate-fade-in-delayed' : ''}`} style={{ animationDelay: '1s' }}>
              <h4 className="font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
                Top Performing Articles
              </h4>
              <div className="space-y-3">
                {[
                  { title: 'AI in Gaming', views: '12.4k', trend: '+15%' },
                  { title: 'Tech News Daily', views: '8.7k', trend: '+8%' },
                  { title: 'Future Tech', views: '6.2k', trend: '+22%' }
                ].map((article, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                      {article.title}
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                        {article.views}
                      </div>
                      <div className="text-xs text-green-600">
                        {article.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`card ${isVisible ? 'animate-fade-in-delayed' : ''}`} style={{ animationDelay: '1.1s' }}>
              <h4 className="font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
                Weekly Summary
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Articles Published</span>
                  <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>23</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Total Views</span>
                  <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>127k</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Engagement Rate</span>
                  <span className="font-medium text-green-600">+12.5%</span>
                </div>
                <div className="pt-2">
                  <button className="btn-accent w-full micro-bounce">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}