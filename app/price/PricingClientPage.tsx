// 1. 文件顶部保留 'use client' 指令
'use client';

// 2. 导入 React 和 useState
import React, { useState } from 'react';
import ScrollRevealGradient from '../components/ScrollRevealGradient';

// 3. 移除了 metadata 导出，其他代码保持不变

// PricingTier 组件 (无变化)
interface PricingTierProps {
  name: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  ctaText: string;
  highlighted?: boolean;
  description?: string;
}

const PricingTier: React.FC<PricingTierProps & { onButtonClick: () => void }> = ({ name, price, priceSuffix = '/month', features, ctaText, highlighted = false, description, onButtonClick }) => {
  return (
    <div className={`relative border rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl group cursor-pointer touch-manipulation ${
      highlighted 
        ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl ring-2 sm:ring-4 ring-indigo-200 dark:ring-indigo-500/30 h-full hover:shadow-indigo-500/25 hover:ring-indigo-300 dark:hover:ring-indigo-400/50' 
        : 'bg-white dark:bg-slate-800 shadow-lg border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 h-full mt-6 hover:shadow-xl hover:bg-gray-50 dark:hover:bg-slate-700'
    }`}>
      {/* Badge/Icon for highlighted plan */}
      {highlighted && (
        <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 sm:px-5 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg whitespace-nowrap transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            ⭐ Most Popular
          </div>
        </div>
      )}
      
      {/* 为 Basic 和 Pro 卡片添加顶部占位空间，保持对齐 */}
      {!highlighted && <div className="h-3 sm:h-4 mb-1 sm:mb-2" />}
      
      {/* Plan icon */}
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl mb-3 sm:mb-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
        highlighted ? 'bg-white/20 backdrop-blur group-hover:bg-white/30' : 'bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:from-indigo-600 group-hover:to-purple-700'
      }`}>
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          {name === 'Basic' && <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />}
          {name === 'Pro' && <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" />}
          {name === 'Ultra' && <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6 11.459a29.848 29.848 0 00-2.455-1.158 41.029 41.029 0 00-.39 3.114.75.75 0 00.419.74c.528.256 1.046.53 1.554.82-.21-.899-.455-1.746-.721-2.516a.75.75 0 00-.407-.5z" clipRule="evenodd" />}
        </svg>
      </div>

      <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${highlighted ? 'text-white' : 'text-gray-900 dark:text-slate-100'}`}>{name}</h3>
      {description && <p className={`text-xs sm:text-sm font-medium mb-3 sm:mb-4 ${highlighted ? 'text-white/90' : 'text-indigo-600 dark:text-indigo-400'}`}>{description}</p>}
      
      <div className="mb-4 sm:mb-6">
        <span className={`text-3xl sm:text-4xl lg:text-5xl font-black tabular-nums ${highlighted ? 'text-white' : 'text-gray-900 dark:text-slate-100'}`}>{price}</span>
        <span className={`text-sm sm:text-base lg:text-lg ml-1 ${highlighted ? 'text-white/80' : 'text-gray-500 dark:text-slate-400'}`}>{priceSuffix}</span>
      </div>
      
      <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start group/feature">
            <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full mr-2.5 sm:mr-3 mt-0.5 flex items-center justify-center transition-all duration-200 group-hover/feature:scale-110 ${
              highlighted ? 'bg-white/20 group-hover/feature:bg-white/30' : 'bg-green-100 dark:bg-green-900/30 group-hover/feature:bg-green-200 dark:group-hover/feature:bg-green-800/40'
            }`}>
              <svg className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${highlighted ? 'text-white' : 'text-green-600 dark:text-green-400'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className={`text-xs sm:text-sm leading-relaxed ${highlighted ? 'text-white/90' : 'text-gray-700 dark:text-slate-300'}`}>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={onButtonClick}
        className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg group-hover:shadow-xl active:scale-95 touch-manipulation ${
          highlighted
            ? 'bg-white text-indigo-600 hover:bg-gray-50 hover:shadow-2xl transform hover:scale-105 focus:ring-4 focus:ring-white/50'
            : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl transform hover:scale-105 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-500/50'
        }`}
      >
        <span className="inline-flex items-center">
          {ctaText}
          <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
    </div>
  );
};

// UnderDevelopmentModal 组件 (无变化)
const UnderDevelopmentModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">Welcome to the FT News API!</h3>
        <p className="text-gray-700 dark:text-slate-300 mb-2">
          Explore real-time financial news data with our powerful API.
        </p>
        <p className="text-gray-700 dark:text-slate-300 mb-6">
          Click the button below to visit the API documentation and get started.
        </p>
        <a
          href="https://rapidapi.com/fanspan6/api/ft-news-api"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-center block"
        >
          Go to API Website
        </a>
        <button
          onClick={onClose}
          className="w-full bg-indigo-500 hover:bg-indigo-600 my-4 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 dark:bg-indigo-600 dark:hover:bg-indigo-700"
        >
          OK
        </button>
      </div>
    </div>
  );
};

// 4. 重命名主组件并导出
const PricingClientPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showDevelopmentModal = () => {
    setIsModalOpen(true);
  };

  const closeDevelopmentModal = () => {
    setIsModalOpen(false);
  };

  const pricingTiers = [
    {
      name: 'Basic',
      price: '$0.00',
      priceSuffix: '/mo',
      description: '', 
      features: [
        'Requests: 100 / mo',
        'Limit Type: Hard Limit',
        'Rate Limit: 1000 requests per hour',
      ],
      ctaText: 'Start Free Plan',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$4.99',
      priceSuffix: '/mo',
      description: '',
      features: [
        'Requests: 1,500 / Month',
        'Overage: + $0.004 per additional request',
        'Rate Limit: 2 requests per second',
      ],
      ctaText: 'Choose This Plan',
      highlighted: false,
    },
    {
      name: 'Ultra',
      price: '$14.99',
      priceSuffix: '/mo',
      description: '⭐ Recommended',
      features: [
        'Requests: 10,000 / Month',
        'Overage: + $0.0025 per additional request',
        'Rate Limit: 5 requests per second',
      ],
      ctaText: 'Choose This Plan',
      highlighted: true,
    },
  ];

  return (
    <>
      <UnderDevelopmentModal isOpen={isModalOpen} onClose={closeDevelopmentModal} />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 py-8 sm:py-12 lg:py-16 px-3 sm:px-4 md:px-6 lg:px-8 text-gray-900 dark:text-white relative overflow-hidden font-sans antialiased">
        {/* Floating animated background elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {/* Floating circles */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-400 to-red-500 rounded-full blur-2xl animate-float-slow"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-3xl animate-float-reverse"></div>
          
          {/* Floating triangles */}
          <div className="absolute top-60 left-1/4 w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rotate-45 blur-xl animate-float-diagonal"></div>
          <div className="absolute top-80 right-1/3 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rotate-12 blur-xl animate-float-bounce"></div>
          
          {/* Floating squares */}
          <div className="absolute bottom-60 right-10 w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-600 rounded-lg blur-lg animate-float-spin"></div>
          <div className="absolute top-1/3 left-1/2 w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded blur-md animate-float-wiggle"></div>
          
          {/* Large background orbs */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-indigo-300/30 to-purple-400/30 rounded-full blur-3xl animate-float-slow-large"></div>
          <div className="absolute -bottom-48 -right-48 w-80 h-80 bg-gradient-to-br from-pink-300/25 to-red-400/25 rounded-full blur-3xl animate-float-reverse-large"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-cyan-400/20 rounded-full blur-3xl animate-float-center"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollRevealGradient>
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6 transition-all duration-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/60 hover:scale-105">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Trusted by developers worldwide
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-4 sm:mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 hover:from-purple-600 hover:via-pink-600 hover:to-red-500 transition-all duration-700">
                  News API
                </span>
                <br className="hidden sm:block" />
                <span className="text-gray-900 dark:text-white font-extrabold">Pricing Plans</span>
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 dark:text-slate-300 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-2">
                Choose the perfect plan for your project. Get powerful, flexible news data services with lightning-fast response times.
              </p>
            </div>
          </ScrollRevealGradient>

          <ScrollRevealGradient>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16 lg:mb-20 pt-6">
              {pricingTiers.map((tier) => (
                <PricingTier key={tier.name} {...tier} onButtonClick={showDevelopmentModal} />
              ))}
            </div>
          </ScrollRevealGradient>

          <ScrollRevealGradient>
            <div className="text-center p-6 sm:p-8 lg:p-10 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl sm:rounded-2xl shadow-xl border border-green-200 dark:border-green-700 hover:shadow-2xl transition-all duration-500">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transform transition-all duration-300 hover:scale-110 hover:rotate-12">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Need Something Custom?</h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-slate-300 mb-6 sm:mb-8 max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-2">
                Our plans don't quite fit your needs? Looking for enterprise-level volume or custom integrations? 
                Let's build something amazing together.
              </p>
              <button 
                onClick={showDevelopmentModal} 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 lg:px-10 rounded-lg sm:rounded-xl text-sm sm:text-base lg:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95 touch-manipulation focus:ring-4 focus:ring-green-300 dark:focus:ring-green-500/50"
              >
                <span className="inline-flex items-center">
                  Contact Our Sales Team
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>
            </div>
          </ScrollRevealGradient>

          <ScrollRevealGradient>
            <div className="mt-16 sm:mt-20 lg:mt-24 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100 mb-3 sm:mb-4">Frequently Asked Questions</h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-slate-300 mb-8 sm:mb-12 px-2">Everything you need to know about our pricing and plans</p>
              
              <div className="max-w-3xl lg:max-w-4xl mx-auto text-left space-y-3 sm:space-y-4">
                {[
                  {
                    q: "How are API calls counted?",
                    a: "Each successful API request counts as one call. We provide a detailed usage dashboard with real-time monitoring and historical data to help you track your usage patterns."
                  },
                  {
                    q: "Can I upgrade or downgrade my plan at any time?",
                    a: "Absolutely! You can upgrade or downgrade your plan anytime from your dashboard. Changes take effect immediately for upgrades, and downgrades take effect at the next billing cycle."
                  },
                  {
                    q: "What payment methods are supported?",
                    a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and for enterprise customers, we also support bank transfers, ACH, and custom invoicing."
                  },
                  {
                    q: "Is there a free trial available?",
                    a: "Yes! All new users get 100 free API calls per month with our Basic plan. No credit card required to get started."
                  }
                ].map((faq, index) => (
                  <details key={index} className="group p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/70 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 dark:border-slate-700 touch-manipulation">
                    <summary className="font-semibold text-gray-900 dark:text-slate-100 text-base sm:text-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500/50 rounded-md">
                      <span className="pr-4">{faq.q}</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-open:transform group-open:rotate-180 transition-transform duration-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </summary>
                    <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed pr-8">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </ScrollRevealGradient>

        </div>
      </div>
    </>
  );
};

export default PricingClientPage;