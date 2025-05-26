// app/news-saas-pricing/page.tsx
'use client';

import React from 'react';
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

const PricingTier: React.FC<PricingTierProps> = ({ name, price, priceSuffix = '/month', features, ctaText, highlighted = false, description }) => {
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

const NewsSaasPricingPage = () => {
  const pricingTiers = [
    {
      name: 'Free Plan',
      price: 'Free',
      priceSuffix: '',
      description: 'Daily, up to 250 API calls per day, 5 years of historical data.',
      features: [
        'Financial Modeling Prep API',
        'Free usage',
        'Daily updates',
        '250 API calls per day',
        'Up to 5 years of historical data'
      ],
      ctaText: 'Choose Free',
    },
    {
      name: 'Starter Plan',
      price: '$19.00',
      priceSuffix: '/month (billed annually)',
      description: 'Up to 300 API calls per minute, up to 5 years of historical data, US market.',
      features: [
        'Financial Modeling Prep API',
        'Starter plan',
        '300 API calls per minute',
        'Up to 5 years of historical data',
        'US market'
      ],
      ctaText: 'Choose Starter',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Contact Us',
      priceSuffix: '',
      description: 'Tailored for large enterprises to meet complex needs.',
      features: [
        'Unlimited API calls (on demand)',
        'Customized news sources',
        'In-depth industry analysis reports',
        'Dedicated customer success manager',
        'SLA guarantee',
        'Private deployment options'
      ],
      ctaText: 'Contact Sales',
    },
  ];

  return (
    <>
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
              <PricingTier key={tier.name} {...tier} />
            ))}
          </div>

          <div className="mt-16 text-center p-8 bg-gray-100 dark:bg-slate-800/70 rounded-lg shadow-xl">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">Special Requirements?</h2>
            <p className="text-gray-700 dark:text-slate-300 mb-6 max-w-xl mx-auto">
              If the above plans do not fully meet your needs, or you require larger call volumes or customized features, please contact us and we will tailor a solution for you.
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300 dark:bg-green-600 dark:hover:bg-green-700">
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