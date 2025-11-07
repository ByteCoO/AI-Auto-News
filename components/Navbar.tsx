import React from 'react';

const Navbar = () => {
  return (
    <header className="bg-white py-8 border-b border-secondary-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-24 h-9 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">MetaBlog</span>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-10">
            <a href="#" className="text-secondary-600 hover:text-primary font-medium">Home</a>
            <a href="/bloglist" className="text-primary font-medium">Blog</a>
            <a href="#" className="text-secondary-600 hover:text-primary font-medium">Single Post</a>
            <a href="#" className="text-secondary-600 hover:text-primary font-medium">Pages</a>
            <a href="#" className="text-secondary-600 hover:text-primary font-medium">Contact</a>
          </nav>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="bg-secondary-100 rounded-md px-4 py-2 pl-10 text-sm w-40 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 absolute left-3 top-2.5 text-secondary-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            <button className="w-12 h-7 bg-secondary-100 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;