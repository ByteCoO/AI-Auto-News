import React from 'react';
import { marked } from 'marked';
import { supabase } from '@/lib/supabaseClient';

// --- 类型定义和工具函数 (无变化) ---
interface Post {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  tags: string[] | null;
  status: string;
  youtube_url: string | null;
  source: string | null;
}

function getYoutubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') return urlObj.pathname.slice(1);
    if (urlObj.hostname.includes('youtube.com')) return urlObj.searchParams.get('v');
    return null;
  } catch (error) {
    console.error('Invalid URL for YouTube video');
    return null;
  }
}

// --- 数据获取函数 (有修改和新增) ---

// 1. 修改: 获取所有已发布文章的 ID，供 generateStaticParams 使用
async function getAllPublishedPostIds(): Promise<{ id: string }[]> {
  try {
    // 只查询 id 列，非常高效
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id') // 只选择 id 列
      .eq('status', 'published'); // 只选择已发布的文章

    if (error) {
      console.error("Failed to fetch all post IDs for static generation:", error.message);
      return [];
    }

    // data 的格式是 [{id: '...'}, {id: '...'}]，正是我们需要的
    return posts || [];

  } catch (error) {
    if (error instanceof Error) {
      console.error("An unexpected error occurred during static param generation:", error.message);
    }
    return [];
  }
}


async function getPostById(id: string): Promise<Post | null> {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .eq('status', 'published') // 重要：确保只有已发布的文章才能通过 URL 访问
      .single(); // 使用 .single() 因为我们期望只返回一条记录

    if (error) {
      // 'PGRST116' 是 Supabase/PostgREST 在 .single() 找不到记录时返回的特定错误码
      if (error.code !== 'PGRST116') {
        console.error(`Error fetching post ${id} from Supabase:`, error.message);
      }
      return null;
    }

    return post;

  } catch (error) {
    if (error instanceof Error) {
        console.error(`An unexpected error occurred for post ${id}:`, error.message);
    }
    return null;
  }
}

// --- 静态页面生成配置 (核心新增部分) ---

export async function generateStaticParams() {
  const posts = await getAllPublishedPostIds();
  // 将 id 转换为字符串，因为 params 必须是字符串
  return posts.map((post) => ({
    id: post.id.toString(),
  }));
}
// 3. 新增: 允许动态生成未在构建时生成的页面 (例如新发布的文章)
export const dynamicParams = true;


// --- 页面组件 (无变化) ---
export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">404</h1>
          <p className="mt-2 text-lg text-slate-400">Post not found.</p>
        </div>
      </div>
    );
  }

  const youtubeVideoId = post.youtube_url ? getYoutubeVideoId(post.youtube_url) : null;
  const parsedContent = post.content ? marked.parse(post.content) as string : '<p>No content available.</p>';

  return (
    <div className="bg-slate-900 text-slate-300 font-sans">
      <div className="max-w-4xl mx-auto py-16 px-6 lg:px-8">
        
        <header className="mb-8 md:mb-12 text-center">
          {post.category && (
            <span className="inline-block bg-sky-500/10 text-sky-400 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight !leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-slate-400">
            Published on {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        {post.tags && post.tags.length > 0 && (
          <div className="flex justify-center flex-wrap gap-2 mb-10">
            {post.tags.map((tag) => (
              <span key={tag} className="bg-slate-800 text-sky-400 text-sm font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-slate-700 transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <figure className="mb-12">
          {youtubeVideoId ? (
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                title={`YouTube video: ${post.title}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          ) : post.cover_image_url && (
            <img 
              src={post.cover_image_url} 
              alt={`Cover for ${post.title}`}
              className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-xl"
            />
          )}
        </figure>
        
        <article 
          className="
            prose prose-lg max-w-none prose-invert
            prose-p:leading-relaxed prose-p:text-slate-300
            prose-headings:text-slate-100 prose-headings:font-bold
            prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4
            prose-a:text-sky-400 hover:prose-a:text-sky-500 prose-a:transition-colors
            prose-strong:text-slate-100
            prose-code:bg-slate-800 prose-code:text-violet-400 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:font-mono
            prose-blockquote:border-l-4 prose-blockquote:border-slate-600 prose-blockquote:pl-4 prose-blockquote:text-slate-400
          "
        >
          <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
        </article>

        {post.source && (
          <footer className="mt-12 pt-8 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              Source: <span className="text-slate-400 font-medium">{post.source}</span>
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}