'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import PostCardOverlay from '@/components/PostCardOverlay';
import Newsletter from '@/components/Newsletter';
import AdsSpace from '@/components/AdsSpace';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image: string;
  avatar: string;
}

const BlogListingPage = () => {
  const [posts] = useState<Post[]>([
    {
      id: 1,
      title: 'The Impact of Technology on the Workplace: How Technology is Changing',
      excerpt: 'Traveling is an enriching experience that opens up new horizons, exposes us to different cultures, and creates memories that last a lifetime.',
      date: 'August 20, 2022',
      author: 'Tracey Wilson',
      category: 'Technology',
      image: 'https://placehold.co/360x240/4B6BFB/FFFFFF?text=Featured+Post',
      avatar: 'https://placehold.co/56x56/4B6BFB/FFFFFF?text=TW'
    },
    {
      id: 2,
      title: 'The Impact of Technology on the Workplace: How Technology is Changing',
      excerpt: 'Traveling is an enriching experience that opens up new horizons, exposes us to different cultures, and creates memories that last a lifetime.',
      date: 'August 20, 2022',
      author: 'Jason Francisco',
      category: 'Technology',
      image: 'https://placehold.co/360x240/4B6BFB/FFFFFF?text=Post+2',
      avatar: 'https://placehold.co/36x36/4B6BFB/FFFFFF?text=JF'
    },
    {
      id: 3,
      title: 'The Impact of Technology on the Workplace: How Technology is Changing',
      excerpt: 'Traveling is an enriching experience that opens up new horizons, exposes us to different cultures, and creates memories that last a lifetime.',
      date: 'August 20, 2022',
      author: 'Elizabeth Slavin',
      category: 'Technology',
      image: 'https://placehold.co/360x240/4B6BFB/FFFFFF?text=Post+3',
      avatar: 'https://placehold.co/36x36/4B6BFB/FFFFFF?text=ES'
    },
    {
      id: 4,
      title: 'The Impact of Technology on the Workplace: How Technology is Changing',
      excerpt: 'Traveling is an enriching experience that opens up new horizons, exposes us to different cultures, and creates memories that last a lifetime.',
      date: 'August 20, 2022',
      author: 'Ernie Smith',
      category: 'Technology',
      image: 'https://placehold.co/360x240/4B6BFB/FFFFFF?text=Post+4',
      avatar: 'https://placehold.co/36x36/4B6BFB/FFFFFF?text=ES'
    },
    {
      id: 5,
      title: 'The Impact of Technology on the Workplace: How Technology is Changing',
      excerpt: 'Traveling is an enriching experience that opens up new horizons, exposes us to different cultures, and creates memories that last a lifetime.',
      date: 'August 20, 2022',
      author: 'Eric Smith',
      category: 'Technology',
      image: 'https://placehold.co/360x240/4B6BFB/FFFFFF?text=Post+5',
      avatar: 'https://placehold.co/36x36/4B6BFB/FFFFFF?text=ES'
    },
    {
      id: 6,
      title: 'The Impact of Technology on the Workplace: How Technology is Changing',
      excerpt: 'Traveling is an enriching experience that opens up new horizons, exposes us to different cultures, and creates memories that last a lifetime.',
      date: 'August 20, 2022',
      author: 'Tracey Wilson',
      category: 'Technology',
      image: 'https://placehold.co/360x240/4B6BFB/FFFFFF?text=Post+6',
      avatar: 'https://placehold.co/36x36/4B6BFB/FFFFFF?text=TW'
    },
    {
      id: 7,
      title: 'The Impact of Technology on the Workplace: How Technology is Changing',
      excerpt: 'Traveling is an enriching experience that opens up new horizons, exposes us to different cultures, and creates memories that last a lifetime.',
      date: 'August 20, 2022',
      author: 'Jason Francisco',
      category: 'Technology',
      image: 'https://placehold.co/360x240/4B6BFB/FFFFFF?text=Post+7',
      avatar: 'https://placehold.co/36x36/4B6BFB/FFFFFF?text=JF'
    },
    {
      id: 8,
      title: 'The Impact of Technology on the Workplace: How Technology is Changing',
      excerpt: 'Traveling is an enriching experience that opens up new horizons, exposes us to different cultures, and creates memories that last a lifetime.',
      date: 'August 20, 2022',
      author: 'Elizabeth Slavin',
      category: 'Technology',
      image: 'https://placehold.co/360x240/4B6BFB/FFFFFF?text=Post+8',
      avatar: 'https://placehold.co/36x36/4B6BFB/FFFFFF?text=ES'
    },
    {
      id: 9,
      title: 'The Impact of Technology on the Workplace: How Technology is Changing',
      excerpt: 'Traveling is an enriching experience that opens up new horizons, exposes us to different cultures, and creates memories that last a lifetime.',
      date: 'August 20, 2022',
      author: 'Ernie Smith',
      category: 'Technology',
      image: 'https://placehold.co/360x240/4B6BFB/FFFFFF?text=Post+9',
      avatar: 'https://placehold.co/36x36/4B6BFB/FFFFFF?text=ES'
    }
  ]);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="w-full px-4 py-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-secondary-800">Blog Listing</h1>
            <nav className="flex items-center space-x-2">
              <a href="#" className="text-secondary-600 hover:text-primary">Home</a>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-secondary-500">Blog Listing</span>
            </nav>
          </div>
          
          <PostCardOverlay 
            title={featuredPost.title}
            date={featuredPost.date}
            author={featuredPost.author}
            category={featuredPost.category}
            image={featuredPost.image}
            avatar={featuredPost.avatar}
          />
        </div>
      </div>
      
      <div className="w-full px-4 py-12">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            <main className="w-full lg:w-2/3">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-secondary-800">Latest Post</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {otherPosts.map(post => (
                  <PostCard 
                    key={post.id}
                    title={post.title}
                    date={post.date}
                    author={post.author}
                    category={post.category}
                    image={post.image}
                    avatar={post.avatar}
                  />
                ))}
              </div>
              
              <div className="mt-12 flex justify-center">
                <button className="px-6 py-3 border border-secondary-500 text-secondary-500 rounded-md hover:bg-secondary-50 transition-colors">
                  Load More
                </button>
              </div>
            </main>
            
            <aside className="w-full lg:w-1/3">
              <div className="sticky top-24">
                <AdsSpace />
                <Newsletter />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogListingPage;