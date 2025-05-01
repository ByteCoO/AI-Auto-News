import React from 'react';
import Link from 'next/link'; // Use Next.js Link for internal navigation
import Image from 'next/image'; // Use Next.js Image for optimized images
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:py-4 md:space-x-10">

          {/* Logo and Search Section */}
          <div className="flex justify-start items-center lg:w-0 lg:flex-1 space-x-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
                <span className="sr-only">B-L-Y</span>
                {/* Replace with your actual logo */}
                {/* <Image src="/dribbble-logo.svg" alt="Dribbble Logo" width={100} height={28} /> */}
                {/* Text fallback if no image */}
                 <span className="text-2xl font-bold font-cursive text-gray-900 italic">B-L-Y</span>
            </Link>

            {/* Search Bar - Hidden on small screens, adjust breakpoints as needed */}
            <div className="hidden sm:flex items-center bg-gray-100 rounded-full px-2 py-1 w-full max-w-sm lg:max-w-md flex-grow">
              <input
                type="text"
                name="search"
                id="search"
                className="flex-grow bg-transparent border-none focus:ring-0 outline-none placeholder-gray-500 text-gray-800 px-3 py-1 text-sm"
                placeholder="What are you looking for?"
              />
              <button className="flex items-center text-sm text-gray-700 font-medium px-3 py-1 border-l border-gray-300 ml-2 hover:bg-gray-200 rounded-full transition-colors">
                Shots
                <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-500" aria-hidden="true" />
              </button>
              <button className="flex-shrink-0 bg-pink-500 hover:bg-pink-600 rounded-full p-2 ml-2 transition-colors">
                <span className="sr-only">Search</span>
                <MagnifyingGlassIcon className="h-5 w-5 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Navigation and Auth Section */}
          <div className="flex items-center justify-end space-x-4 md:space-x-6 lg:space-x-8">
            {/* Main Navigation - Hidden on small screens */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <Link href="/explore" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center">
                  Explore
                  <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-400" aria-hidden="true" />
              </Link>
              <Link href="/hire" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center">
                  Hire a Designer
                  <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-400" aria-hidden="true" />
              </Link>
              <Link href="/jobs" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Find Jobs
              </Link>
              <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Blog
              </Link>
            </nav>

            {/* Auth Links */}
            <div className="flex items-center space-x-4">
              <Link href="/signup" className="whitespace-nowrap text-sm font-medium text-gray-600 hover:text-gray-900">
                  Sign up
              </Link>
              <Link href="/login" className="whitespace-nowrap inline-flex items-center justify-center px-5 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 transition-colors">
                  Log in
              </Link>
            </div>

            {/* Mobile Menu Button - Placeholder for functionality */}
            <div className="md:hidden">
              <button className="p-2 text-gray-500 hover:text-gray-800">
                 {/* Add Hamburger Icon here */}
                <span className="sr-only">Open menu</span>
                {/* <Bars3Icon className="h-6 w-6" aria-hidden="true" /> */}
              </button>
            </div>
             {/* Mobile Search Icon - Placeholder for functionality */}
             <div className="sm:hidden">
              <button className="p-2 text-gray-500 hover:text-gray-800">
                 <span className="sr-only">Search</span>
                 <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

         {/* Search Bar for small screens (Optional: appears below header or in mobile menu) */}
         {/* <div className="sm:hidden px-4 pb-3">
            <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 w-full">
              <input type="text" name="search_mobile" id="search_mobile" className="flex-grow bg-transparent border-none focus:ring-0 outline-none placeholder-gray-500 text-gray-800 px-3 py-1 text-sm" placeholder="What are you looking for?"/>
              <button className="flex-shrink-0 bg-pink-500 hover:bg-pink-600 rounded-full p-2 ml-2 transition-colors">
                <span className="sr-only">Search</span>
                <MagnifyingGlassIcon className="h-5 w-5 text-white" aria-hidden="true" />
              </button>
            </div>
        </div> */}

      </div>
    </header>
  );
}

export default Header;