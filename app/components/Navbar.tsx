'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, isLoading } = useAuth();
  const pathname = usePathname();

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
    setIsMenuOpen(false);
  };

  // 判断链接是否激活的辅助函数
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white w-full dark:bg-gray-800 py-3 px-4 shadow-sm dark:shadow-lg transition-colors duration-200 fixed top-0 left-0 right-0 z-50 border-b border-gray-100 dark:border-gray-700">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">🎮 GameVerse</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="/trends" 
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                isActive('/trends') 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              AI Trends Radar
            </Link>
            <Link 
              href="/price" 
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                isActive('/price') 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Pricing
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-500 dark:text-gray-400 text-xs font-mono">{user.email}</span>
                <button onClick={handleSignOut} className="text-xs font-bold text-red-500 hover:text-red-600">Logout</button>
              </div>
            ) : (
              <Link href="/login" className="px-5 py-2 rounded-full text-xs font-bold bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
                Log in
              </Link>
            )}
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700 dark:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 space-y-4">
          <button onClick={() => setIsMenuOpen(false)} className="mb-8 text-gray-500">✕ Close</button>
          <Link href="/trends" onClick={() => setIsMenuOpen(false)} className={`block p-4 rounded-xl font-bold ${isActive('/trends') ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400'}`}>AI Trends</Link>
          <Link href="/price" onClick={() => setIsMenuOpen(false)} className={`block p-4 rounded-xl font-bold ${isActive('/price') ? 'bg-purple-600 text-white' : 'text-gray-600 dark:text-gray-400'}`}>Pricing</Link>
          {!user && <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block p-4 font-bold text-blue-500 border-t border-gray-100 dark:border-gray-800 mt-4">Log in</Link>}
        </div>
      </div>
    </nav>
  );
}
