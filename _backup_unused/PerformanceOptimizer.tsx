'use client';

import { useEffect } from 'react';

export function PerformanceOptimizer() {
  useEffect(() => {
    // 预加载关键资源
    if (typeof window !== 'undefined') {
      // 预加载重要的页面
      const criticalPages = ['/blog', '/Channels', '/ft-news'];
      
      criticalPages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
      });

      // 延迟加载非关键图片
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));

      // 清理函数
      return () => {
        imageObserver.disconnect();
      };
    }
  }, []);

  return null;
}

// Web Vitals 监控
export function WebVitalsReporter() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // 监控核心网络生命力指标
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          }
          if (entry.entryType === 'first-input') {
            console.log('FID:', entry.processingStart - entry.startTime);
          }
          if (entry.entryType === 'layout-shift') {
            console.log('CLS:', entry.value);
          }
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

      return () => observer.disconnect();
    }
  }, []);

  return null;
}