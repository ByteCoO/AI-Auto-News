'use client';

import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // 导入 useAuth

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, isLoading } = useAuth(); // 使用 AuthContext

  // 当菜单打开时禁止页面滚动
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    // 可以选择在这里添加 router.refresh() 或其他操作
    setIsMenuOpen(false); // 关闭移动端菜单
  };

  return (
    <nav className="bg-white w-full dark:bg-gray-800 py-3 px-4 shadow-sm dark:shadow-lg transition-colors duration-200 relative z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-800 dark:text-white">🎮 GameVerse</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Home</Link>
            <Link href="/Channels" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">News Channels</Link>

{/*             <Link href="/archive" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Archive</Link>
 */}         {/*    
            <Link href="/ft-news" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">FT-News</Link>
             */}
            <Link href="/price" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Pricing</Link>

          </div>
        </div>
        
        <div className="flex items-center space-x-4 mx-4">
          <ThemeToggle />
          <button aria-label="Notifications" className="text-gray-700 dark:text-gray-300 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3"></span>
          </button>
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="text-gray-700 dark:text-gray-300">Loading...</div>
            ) : user ? (
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 dark:text-gray-300 text-sm">{user.email}</span>
                <button 
                  onClick={handleSignOut} 
                  className="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="whitespace-nowrap inline-flex items-center justify-center px-5 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200">
                Log in
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none z-50"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 transition-transform duration-200" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

     { /* Mobile Navigation Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-200 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Menu */}
      <div 
        className={`fixed top-[61px] right-0 w-64 h-[calc(100vh-61px)] bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ease-in-out transform md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="px-4 py-6 space-y-4 flex flex-col h-full">
          <div className="space-y-4 flex-1">
            <Link 
              href="/"
              className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
           {/*  <Link 
              href="/archive"
              className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Archive
            </Link> */}
           {/*  <Link 
              href="/ft-news" 
              className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              FT-News
            </Link> */}
            <Link 
              href="/price" 
              className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/Channels" 
              className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              News Channels
            </Link>
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {isLoading ? (
              <div className="text-center text-gray-700 dark:text-gray-300 py-2">Loading...</div>
            ) : user ? (
              <button 
                onClick={handleSignOut} 
                className="w-full text-center py-2 px-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 shadow-sm"
              >
                Logout
              </button>
            ) : (
              <Link 
                href="/login" 
                className="block text-center py-2 px-4 rounded-full bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}