'use client'; // 关键！声明这是一个客户端组件

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Post } from './page'; // 复用 Post 类型
import { ArticleCard } from './page'; // 导入我们将在下一步导出的 ArticleCard

export function BlogList({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(2); // 从第2页开始加载
  const [hasMore, setHasMore] = useState(initialPosts.length === 6); // 如果初始文章少于6篇，说明没有更多了
  const [isLoading, setIsLoading] = useState(false);
  const loader = useRef(null); // 用于引用页面底部的加载指示器

  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    const res = await fetch(`/api/posts?page=${page}&limit=6`);
    const newPosts: Post[] = await res.json();

    if (newPosts.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage((prevPage) => prevPage + 1);
    } else {
      setHasMore(false); // API 返回空数组，说明没有更多文章了
    }
    setIsLoading(false);
  }, [page, hasMore, isLoading]);

  // 使用 IntersectionObserver 来监测加载指示器是否进入视口
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 1.0 }
    );

    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loader, loadMorePosts]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>

      {/* 加载指示器 */}
      {hasMore && (
        <div ref={loader} className="col-span-full text-center py-10">
          <p className="text-gray-500">正在加载更多文章...</p>
        </div>
      )}

      {!hasMore && (
         <div className="col-span-full text-center py-10">
          <p className="text-gray-500">已加载全部内容</p>
        </div>
      )}
    </>
  );
}