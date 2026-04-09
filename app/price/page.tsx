'use client';

import React, { useState } from 'react';

// FreePromoModal 组件
const FreePromoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            🎉 Limited Time Offer!
          </h3>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700 rounded-xl p-4 mb-6">
            <p className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
              FREE during promotional period
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              All features available at no cost while the promotion lasts
            </p>
          </div>

          <p className="text-gray-600 dark:text-slate-300 mb-6 text-sm">
            Take advantage of this special offer and unlock full access to our premium features.
          </p>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default function PricingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="w-full bg-white dark:bg-[#090B10] text-gray-900 dark:text-white pt-24 transition-colors duration-300">
      <FreePromoModal isOpen={isModalOpen} onClose={closeModal} />
      
      <div className="w-full">
        {/* Header Section - Full Width */}
        <header className="w-full text-center py-20 px-4 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-800 mb-20">
          <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/20">
            Pricing Plans
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-gray-900 dark:from-white to-gray-500 dark:to-gray-700">
            Scale Your Intelligence
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            Get unfair advantages with real-time commercial signals. Choose a plan that matches your ambition.
          </p>
        </header>

        {/* Pricing Cards - Fully Responsive & Full Width Padding */}
        <div className="w-full px-4 md:px-12 lg:px-24 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
            
            {/* Starter Plan */}
            <div className="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-10 flex flex-col shadow-xl">
              <h3 className="text-2xl font-bold mb-2 tracking-tight">Starter</h3>
              <p className="text-gray-500 text-sm mb-8">Perfect for individual researchers.</p>
              <div className="text-5xl font-black mb-10">$0<span className="text-lg font-normal text-gray-400">/mo</span></div>
              <ul className="space-y-5 mb-12 flex-grow">
                <li className="flex items-center gap-3 text-sm font-bold"><span className="text-green-500">✓</span> Daily Signal Radar</li>
                <li className="flex items-center gap-3 text-sm font-bold"><span className="text-green-500">✓</span> 3 Subreddits Monitored</li>
                <li className="flex items-center gap-3 text-sm font-medium text-gray-400 line-through text-left">AI Intent Tagging</li>
                <li className="flex items-center gap-3 text-sm font-medium text-gray-400 line-through text-left">SaaS Opportunity Engine</li>
              </ul>
              <button onClick={showModal} className="w-full py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 font-black text-xs uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Current Plan</button>
            </div>

            {/* Professional Plan - Highlighted */}
            <div className="relative bg-gray-900 dark:bg-blue-600 text-white border-4 border-blue-500 dark:border-blue-400 rounded-[2.5rem] p-10 flex flex-col shadow-2xl shadow-blue-500/30 transform md:-translate-y-4">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2 tracking-tight">Professional</h3>
              <p className="text-blue-100/70 text-sm mb-8">Built for serious builders & founders.</p>
              <div className="text-5xl font-black mb-10">$4.99<span className="text-lg font-normal opacity-60">/mo</span></div>
              <ul className="space-y-5 mb-12 flex-grow">
                <li className="flex items-center gap-3 text-sm font-bold text-left">✓ Unlimited Subreddits</li>
                <li className="flex items-center gap-3 text-sm font-bold text-left">✓ Real-time AI Analysis</li>
                <li className="flex items-center gap-3 text-sm font-bold text-left">✓ SaaS Opportunity Engine</li>
                <li className="flex items-center gap-3 text-sm font-bold text-left">✓ Full Search & Export</li>
              </ul>
              <button onClick={showModal} className="w-full py-4 rounded-2xl bg-white text-blue-600 font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all">Unlock Radar Pro</button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-10 flex flex-col shadow-xl">
              <h3 className="text-2xl font-bold mb-2 tracking-tight">Enterprise</h3>
              <p className="text-gray-500 text-sm mb-8">Custom intelligence for large teams.</p>
              <div className="text-5xl font-black mb-10">$49.99<span className="text-lg font-normal text-gray-400">/mo</span></div>
              <ul className="space-y-5 mb-12 flex-grow">
                <li className="flex items-center gap-3 text-sm font-bold text-left"><span className="text-green-500">✓</span> Custom API Access</li>
                <li className="flex items-center gap-3 text-sm font-bold text-left"><span className="text-green-500">✓</span> Instant Alerting (Slack)</li>
                <li className="flex items-center gap-3 text-sm font-bold text-left"><span className="text-green-500">✓</span> Dedicated Support</li>
                <li className="flex items-center gap-3 text-sm font-bold text-left"><span className="text-green-500">✓</span> White-label Reports</li>
              </ul>
              <button onClick={showModal} className="w-full py-4 rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all">Contact Sales</button>
            </div>

          </div>
        </div>

        {/* Simple Footer Text */}
        <footer className="w-full text-center py-12 border-t border-gray-100 dark:border-gray-800 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
          © 2026 GameVerse Intelligence. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
