'use client';

import { useState, useEffect, useCallback } from 'react';

interface ScrollToTopButtonProps {
  visible: boolean;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ visible }) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-yellow-500 to-amber-500 dark:from-yellow-400 dark:to-amber-400 text-gray-900 rounded-full shadow-2xl shadow-yellow-500/30 dark:shadow-yellow-500/20 hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-yellow-600 dark:border-yellow-300"
      aria-label="Scroll to top"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
};

interface InfiniteScrollContainerProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

export const InfiniteScrollContainer: React.FC<InfiniteScrollContainerProps> = ({
  children,
  onLoadMore,
  hasMore,
  loading,
}) => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = useCallback(() => {
    // 显示/隐藏回到顶部按钮
    if (window.scrollY > 500) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }

    // 检测是否滚动到底部
    if (!hasMore || loading) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 当距离底部还有 200px 时触发加载
    if (scrollTop + windowHeight >= documentHeight - 200) {
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      {children}
      
      {/* 加载指示器 */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">Loading more signals...</span>
          </div>
        </div>
      )}

      {/* 没有更多数据提示 */}
      {!hasMore && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
            <span className="text-xs text-gray-500 dark:text-gray-400">✨ You've reached the end</span>
          </div>
        </div>
      )}

      {/* 回到顶部按钮 */}
      <ScrollToTopButton visible={showScrollButton} />
    </>
  );
};
