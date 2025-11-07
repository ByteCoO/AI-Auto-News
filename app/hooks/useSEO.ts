'use client';

import { useEffect } from 'react';

// SEO Hook 用于客户端SEO优化
export function useSEO({
  title,
  description,
  canonical,
}: {
  title?: string;
  description?: string;
  canonical?: string;
}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 动态更新页面标题
    if (title) {
      document.title = title;
    }

    // 动态更新meta描述
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }

    // 动态更新规范URL
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', `https://visionong.dpdns.org${canonical}`);
    }
  }, [title, description, canonical]);
}

// 性能监控Hook
export function usePagePerformance() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // 监控核心网络生命力指标
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            console.log('LCP:', entry.startTime);
            // 可以发送到分析服务
            break;
          case 'first-input':
            const fid = entry.processingStart - entry.startTime;
            console.log('FID:', fid);
            break;
          case 'layout-shift':
            if (!entry.hadRecentInput) {
              console.log('CLS:', entry.value);
            }
            break;
          case 'navigation':
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('Page Load Time:', navEntry.loadEventEnd - navEntry.fetchStart);
            break;
        }
      }
    });

    // 观察不同类型的性能指标
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] });
    } catch (e) {
      // 浏览器不支持某些指标
      console.warn('Performance monitoring not fully supported');
    }

    return () => observer.disconnect();
  }, []);
}

// 懒加载Hook
export function useLazyLoading() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01,
    });

    images.forEach(img => imageObserver.observe(img));

    return () => imageObserver.disconnect();
  }, []);
}