import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex flex-col space-y-6">
              <div>
                <h3 className="text-gray-800 dark:text-gray-200 font-semibold text-lg mb-3">About</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  GameVerse Intelligence - Your ultimate hub for AI insights and tech intelligence. Discover high-value commercial signals before anyone else.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-gray-800 dark:text-gray-200 font-medium">Email : admin@visiong.dpdns.org</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-gray-800 dark:text-gray-200 font-semibold text-lg mb-6">Quick Links</h3>
            <div className="space-y-3">
              <a href="/" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</a>
              <a href="/trends" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI Trends</a>
              <a href="/price" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a>
              <a href="/login" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Login</a>
            </div>
          </div>

          <div>
            <h3 className="text-gray-800 dark:text-gray-200 font-semibold text-lg mb-6">Legal</h3>
            <div className="space-y-3">
              <a href="#" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Use</a>
              <a href="#" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">GV</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">GameVerse</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">© 2026 GameVerse Intelligence. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;