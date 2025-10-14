import { Metadata, ResolvingMetadata } from 'next';
import React from 'react';
import { marked } from 'marked';
import { supabase } from '@/lib/supabaseClient';

// --- Dynamic Metadata Generation ---

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const post = await getPostById(id);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The post you are looking for does not exist.',
    }
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.title,
    description: post.excerpt || 'An insightful article from Game Visioning.',
    alternates: {
      canonical: `/blog/${post.id}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || 'An insightful article from Game Visioning.',
      url: `/blog/${post.id}`,
      images: post.cover_image_url ? [post.cover_image_url, ...previousImages] : [...previousImages],
    },
  }
}


// --- 类型定义和工具函数 (有修改) ---
interface Post {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  content: string | null;
  content_cn: string | null; // 新增：中文翻译内容
  audio_url: string | null;  // 新增：音频文件URL
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
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

// --- 数据获取函数 (无变化) ---

// 1. 修改: 获取所有已发布文章的 ID，供 generateStaticParams 使用
async function getAllPublishedPostIds(): Promise<{ id: string }[]> {
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
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

async function getRelatedPosts(currentPostId: string, category: string | null): Promise<Post[]> {
  if (!category) {
    return [];
  }

  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', category)
      .neq('id', currentPostId)
      .limit(3);

    if (error) {
      console.error(`Error fetching related posts for category ${category}:`, error.message);
      return [];
    }

    return posts || [];

  } catch (error) {
    if (error instanceof Error) {
      console.error('An unexpected error occurred while fetching related posts:', error.message);
    }
    return [];
  }
}

// --- 静态页面生成配置 (无变化) ---

export async function generateStaticParams() {
  const posts = await getAllPublishedPostIds();
  // 将 id 转换为字符串，因为 params 必须是字符串
  return posts.map((post) => ({
    id: post.id.toString(),
  }));
}
// 3. 新增: 允许动态生成未在构建时生成的页面 (例如新发布的文章)
export const dynamicParams = true;

// 4. 新增: 设置页面的重新验证周期为8分钟 (ISR)
export const revalidate = 480;


// --- 页面组件 (有修改) ---
export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  const relatedPosts = await getRelatedPosts(params.id, post?.category || null);

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
  const parsedContentCn = post.content_cn ? marked.parse(post.content_cn) as string : null;

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

        {post.audio_url && (
          <div className="my-8">
            <audio controls className="w-full rounded-lg shadow-lg">
              <source src={post.audio_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

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
          ) : (
            <img 
              loading="lazy"
              src={post.cover_image_url || 'https://placehold.co/600x400/0f172a/3b82f6?text=Image'} 
              alt={post.cover_image_alt || `Cover for ${post.title}`} 
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

        {parsedContentCn && (
          <details className="mt-12 group bg-slate-800/50 rounded-lg p-6">
            <summary className="text-lg font-semibold text-slate-100 cursor-pointer list-none flex items-center gap-2 hover:text-sky-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-open:rotate-90 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              View Chinese Translation
            </summary>
            <article
              className="
                prose prose-lg max-w-none prose-invert mt-4
                prose-p:leading-relaxed prose-p:text-slate-300
                prose-headings:text-slate-100 prose-headings:font-bold
                prose-a:text-sky-400 hover:prose-a:text-sky-500
              "
            >
              <div dangerouslySetInnerHTML={{ __html: parsedContentCn }} />
            </article>
          </details>
        )}

        {post.source && (
          <footer className="mt-12 pt-8 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              Source: <span className="text-slate-400 font-medium">{post.source}</span>
            </p>
          </footer>
        )}

        {relatedPosts.length > 0 && (
          <aside className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <a key={relatedPost.id} href={`/blog/${relatedPost.id}`} className="block bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition-colors">
                  <h3 className="text-xl font-bold text-white mb-2">{relatedPost.title}</h3>
                </a>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}