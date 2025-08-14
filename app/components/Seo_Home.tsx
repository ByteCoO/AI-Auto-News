

import React from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

// ============================================================================
// 1. TYPE DEFINITIONS
// ============================================================================

/**
 * Defines the shape of a Post object. 
 * This should be consistent with the data structure in your database.
 */
export interface Post {
  id: number;
  created_at: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  tags: string[] | null;
  status: string | null;
  youtube_url: string | null;
  source: string | null;
}

// ============================================================================
// 2. DATA FETCHING FUNCTION
// ============================================================================

/**
 * Fetches the 3 most recent posts from the internal API endpoint.
 * This will be used by the LatestNewsGrid server component.
 * @returns A promise that resolves to an array of up to 3 Post objects.
 */
const getLatestPosts = async (): Promise<Array<Post>> => {
  try {
    // 直接使用 Supabase 客户端查询数据库
    const { data: posts, error } = await supabase
      .from('posts') // 确保这是你的表名
      .select('*')
      .eq('status', 'published') // 只获取已发布的文章
      .order('created_at', { ascending: false }) // 按创建时间降序排序
      .limit(6); // 限制返回数量为 3

    if (error) {
      console.error('Error fetching latest posts from Supabase:', error.message);
      return [];
    }

    // 'posts' 已经是我们需要的格式了
    return posts || [];

  } catch (error) {
    // 这个 catch 块现在主要用于捕获意外的、非 Supabase 的错误
    if (error instanceof Error) {
        console.error('An unexpected error occurred while fetching latest posts:', error.message);
    }
    return [];
  }
};

// ============================================================================
// 3. PAGE COMPONENTS
// ============================================================================

const HeroSection = () => (
  <section className="bg-gray-900 text-white w-full">
    <div className="mx-auto max-w-screen-xl px-4 py-32 w-full lg:flex lg:h-screen lg:items-center">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight">
          Decoding the Future of AI
          <span className="block w-full py-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
            Daily News
          </span>
          & Cutting-Edge Insights
        </h1>
        <p className="mt-6 mx-auto max-w-xl sm:text-xl/relaxed text-gray-300">
          Track the latest in Artificial Intelligence, from OpenAI & Google's breakthroughs to the impact of Sora & Claude 3. We deliver daily AI headlines, deep-dive analysis, and curated podcast summaries.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/blog" className="block w-full rounded-md bg-blue-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring sm:w-auto">
            Read Latest News
          </Link>
          <Link href="/blog" className="block w-full rounded-md bg-gray-700 px-12 py-3 text-sm font-medium text-white shadow hover:bg-gray-800 focus:outline-none focus:ring sm:w-auto">
            Listen to Podcasts
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/**
 * This is now an async Server Component. It fetches only the latest 3
 * posts by calling the getLatestPosts function and renders them.
 */
const LatestNewsGrid = async () => {
  const latestPosts = await getLatestPosts();

  return (
    <section className="bg-gray-800 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Latest AI Headlines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts && latestPosts.length > 0 ? (
            latestPosts.map(post => (
              <Link href={`/blog/${post.id}`} key={post.id} className="block group bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <img 
                  src={post.cover_image_url || 'https://placehold.co/600x400/0f172a/3b82f6?text=Image'}

                  alt={`Cover for ${post.title}`} 
                  className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity" 
                />
                <div className="p-6">
                  <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full mb-2">
                    {post.category || 'News'}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-white col-span-full text-center">Could not load latest headlines.</p>
          )}
        </div>
      </div>
    </section>
  );
};

const PodcastHighlight = () => (
    <section className="bg-gray-900 py-20">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Featured AI Podcast | Hear the Ideas Shaping Our World</h2>
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden md:flex">
                <div className="md:w-1/3">
                    <img src="/ai/ki (2).png" alt="The AI Breakdown podcast cover art" className="w-full h-full object-cover"/>
                </div>
                <div className="p-8 md:w-2/3 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-white mb-3">[The AI Breakdown] A Conversation with Anthropic's CEO on AI Safety</h3>
                    <p className="text-gray-400 mb-6">
                        This episode delves into the development of large language models and the critical importance of AI alignment. The guest shares unique insights on AI Agents, RAG technology, and the future path to AGI. This summary distills all the core ideas...
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/blog/anthropic-ceo-ai-safety" className="rounded bg-teal-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-600">
                            Read Full Summary
                        </Link>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="rounded border border-gray-600 px-6 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700">
                            Listen on Spotify
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const TopicExplorer = () => {
    const topics = [ 'Deep Dives', 'AI Tools', 'Product Reviews', 'Video Generation', 'LLMs', 'Image Generation', 'Industry Applications', 'AI Ethics & Safety' ];
    return (
        <section className="bg-gray-800 py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-white text-center mb-12">Explore Key Topics</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {topics.map(topic => (
                        <Link href={'/blog'} key={topic} className="bg-gray-700 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                            {topic}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

const NewsletterCTA = () => (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-3">Don't Miss the AI Revolution</h2>
            <p className="mb-8 max-w-2xl mx-auto">Subscribe to our "AI Weekly" newsletter. Get the most important AI news, research, and tools delivered straight to your inbox.</p>
            <form className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
                <input type="email" placeholder="Enter your email address" required className="w-full px-4 py-3 rounded-md text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:outline-none"/>
                <button type="submit" className="bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-md hover:bg-yellow-500 transition-colors">
                    Subscribe Now
                </button>
            </form>
        </div>
    </section>
);

// ============================================================================
// 4. MAIN EXPORTED COMPONENT
// ============================================================================

/**
 * SeoHome is now an async Server Component because it renders LatestNewsGrid,
 * which is also an async component that fetches data.
 */
export default async function SeoHome() {
  return (
    <>
      <main className="bg-gray-900">
        <HeroSection />
        {/*
          * This special comment tells TypeScript to ignore the fact that LatestNewsGrid
          * returns a Promise, which is normal for async Server Components.
          */}
        <LatestNewsGrid />
        <PodcastHighlight />
        <TopicExplorer />
        <NewsletterCTA />
      </main>
    </>
  );
}
