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
  const [isFirstManualLoadDone, setIsFirstManualLoadDone] = useState(false);

  const handleScroll = useCallback(() => {
    // Toggle scroll-to-top button visibility
    if (window.scrollY > 500) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }

    // Only trigger auto-scroll after the first manual load is completed
    if (!hasMore || loading || !isFirstManualLoadDone) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Trigger when 200px from bottom
    if (scrollTop + windowHeight >= documentHeight - 200) {
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore, isFirstManualLoadDone]);

  const handleManualLoad = () => {
    setIsFirstManualLoadDone(true);
    onLoadMore();
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      {children}
      
      {/* Initial Manual Load Button */}
      {hasMore && !isFirstManualLoadDone && (
        <div className="mt-12 mb-8 flex justify-center">
          <button
            onClick={handleManualLoad}
            disabled={loading}
            className="group relative px-10 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'ANALYZING SIGNALS...' : 'LOAD MORE SIGNALS'}
            <span className="absolute -bottom-1 -right-1 w-full h-full bg-yellow-600/20 rounded-2xl -z-10 group-hover:bottom-0 group-hover:right-0 transition-all"></span>
          </button>
        </div>
      )}

      {/* Automatic Loading Indicator */}
      {loading && isFirstManualLoadDone && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-tighter ml-2">Intercepting more signals...</span>
          </div>
        </div>
      )}

      {/* End of Data indicator */}
      {!hasMore && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-yellow-500/10 rounded-full shadow-inner">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">All available signals retrieved</span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
          </div>
        </div>
      )}

      {/* Scroll to Top */}
      <ScrollToTopButton visible={showScrollButton} />
    </>
  );
};
