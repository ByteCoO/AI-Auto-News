import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-900 py-12 mt-16 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
      {/* Container for centering and max width */}
      <div className="container mx-auto px-4">

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Column 1: Brand/About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              {/* Replace with your Brand Name or Logo */}
              The Developer's Choice for Financial News Integration.
              </h3>
            <p className="mb-4">
            With the FT-News API, unlock a world of financial insights directly within your applications. We provide a scalable and reliable SaaS solution for accessing breaking financial news, historical data, and expert analysis. Build innovative fintech products, inform investment strategies, and provide your users with the timely information they need, all powered by FT-News.
            </p>
           
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:underline hover:text-blue-600 dark:hover:text-blue-400">
                  Home
                </a>
              </li>
              <li>
                <a href="/news-saas-pricing" className="hover:underline hover:text-blue-600 dark:hover:text-blue-400">
                  About Us
                </a>
              </li>
              <li>
                <a href="/news-saas-pricing" className="hover:underline hover:text-blue-600 dark:hover:text-blue-400">
                  Services
                </a>
              </li>
              <li>
                <a href="/ft-news" className="hover:underline hover:text-blue-600 dark:hover:text-blue-400">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-white">
              Contact Us
            </h3>
            <ul className="space-y-2">
               <li>
                 {/* Your original email link */}
                 Email：<a href="mailto:admin@visiong.dpdns.org" className="hover:underline hover:text-blue-600 dark:hover:text-blue-400">
                   admin@visiong.dpdns.org
                 </a>
               </li>
               {/* Optional: Add more contact methods */}
               {/* <li>Phone: (123) 456-7890</li> */}
               {/* <li>Support: <a href="mailto:support@yourcompany.com" className="hover:underline hover:text-blue-600 dark:hover:text-blue-400">support@yourcompany.com</a></li> */}
            </ul>
          </div>

          {/* Column 4: Social Media (Using simple text placeholders) */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-white">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              {/* Replace these with actual social media icons (e.g., using Heroicons, Font Awesome, etc.) */}
              <a href="#" aria-label="Facebook" className="hover:text-blue-600 dark:hover:text-blue-400">
                {/* Example Placeholder Icon/Text */}
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.79c0-2.508 1.493-3.893 3.776-3.893 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C17.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-blue-600 dark:hover:text-blue-400">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 014 10.207v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.12 4.12 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
              {/* Add more social links as needed */}
            </div>
          </div>

        </div> {/* End Main Grid */}

        {/* Bottom Section: Copyright and Legal Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p>
            © {currentYear} Game Visiong. All rights reserved.
          </p>
          <div className="mt-4 space-x-4">
            <a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-400">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-400">
              Terms of Service
            </a>
            {/* Add more legal links if necessary */}
          </div>
        </div>

      </div> {/* End Container */}
    </footer>
  );
}