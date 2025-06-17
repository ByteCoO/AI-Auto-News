// app/price/page.tsx
'use client';

import React, { useState } from 'react';
import Head from 'next/head';

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
    <div className={`border rounded-lg p-6 flex flex-col ${highlighted ? 'bg-indigo-600 text-white shadow-xl transform scale-105 dark:border-indigo-500' : 'bg-white dark:bg-slate-800 shadow-lg border-gray-200 dark:border-slate-700'}`}>
      <h3 className={`text-2xl font-semibold ${highlighted ? 'text-white' : 'text-gray-900 dark:text-slate-100'}`}>{name}</h3>
      {description && <p className={`mt-2 text-sm ${highlighted ? 'text-indigo-200' : 'text-gray-600 dark:text-slate-400'}`}>{description}</p>}
      <div className="my-4">
        <span className={`text-4xl font-bold ${highlighted ? 'text-white' : 'text-gray-900 dark:text-slate-100'}`}>{price}</span>
        <span className={`${highlighted ? 'text-indigo-200' : 'text-gray-500 dark:text-slate-400'}`}>{priceSuffix}</span>
      </div>
      <ul className="space-y-2 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg className={`w-5 h-5 mr-2 ${highlighted ? 'text-indigo-300' : 'text-green-500 dark:text-green-400'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
            <span className={`${highlighted ? 'text-indigo-100' : 'text-gray-700 dark:text-slate-300'}`}>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onButtonClick}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-300
                    ${highlighted
                      ? 'bg-white text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-100'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700'}`}
      >
        {ctaText}
      </button>
    </div>
  );
};

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

const NewsSaasPricingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showDevelopmentModal = () => {
    setIsModalOpen(true);
  };

  const closeDevelopmentModal = () => {
    setIsModalOpen(false);
  };

  // Updated pricingTiers data
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
      ctaText: 'Start Free Plan', // Assuming this means it's the current plan or an example
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
      <Head>
        <title>News SaaS API Pricing - Get Real-Time News Data</title>
        <meta name="description" content="Explore our flexible News SaaS API pricing plans to meet your needs from personal projects to enterprise applications." />
      </Head>
      <div className="min-h-screen bg-white dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 dark:from-indigo-400 dark:to-pink-400">
              News SaaS API Pricing Plans
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
              Choose the plan that fits your needs and get powerful, flexible news data services instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <PricingTier key={tier.name} {...tier} onButtonClick={showDevelopmentModal} />
            ))}
          </div>

          <div className="mt-16 text-center p-8 bg-gray-100 dark:bg-slate-800/70 rounded-lg shadow-xl">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">Special Requirements?</h2>
            <p className="text-gray-700 dark:text-slate-300 mb-6 max-w-xl mx-auto">
              If the above plans do not fully meet your needs, or you require larger call volumes or customized features, please contact us and we will tailor a solution for you.
            </p>
            <button onClick={showDevelopmentModal} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300 dark:bg-green-600 dark:hover:bg-green-700">
              Contact Sales Team
            </button>
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-slate-200 mb-6">Frequently Asked Questions (FAQ)</h2>
            <div className="max-w-3xl mx-auto text-left space-y-6">
              <details className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/70 transition-colors">
                <summary className="font-medium text-gray-800 dark:text-slate-100">How are API calls counted?</summary>
                <p className="mt-2 text-gray-600 dark:text-slate-300 text-sm">Each successful API request counts as one call. We provide a detailed usage dashboard for you to track.</p>
              </details>
              <details className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/70 transition-colors">
                <summary className="font-medium text-gray-800 dark:text-slate-100">Can I upgrade or downgrade my plan at any time?</summary>
                <p className="mt-2 text-gray-600 dark:text-slate-300 text-sm">Yes, you can upgrade or downgrade your plan at any time in the dashboard according to your business needs. The new plan will take effect in the next billing cycle.</p>
              </details>
              <details className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/70 transition-colors">
                <summary className="font-medium text-gray-800 dark:text-slate-100">What payment methods are supported?</summary>
                <p className="mt-2 text-gray-600 dark:text-slate-300 text-sm">We accept major credit cards. For enterprise customers, we also support bank transfers and other methods.</p>
              </details>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default NewsSaasPricingPage;