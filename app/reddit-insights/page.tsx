import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import React from 'react';

// Section Title Component
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-l-4 border-blue-600 pl-4 uppercase tracking-tight">
    {children}
  </h2>
);

export default async function RedditInsightsPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Fetch data from Supabase
  const [
    { data: painPoints, error: ppError },
    { data: opportunities, error: opError }
  ] = await Promise.all([
    supabase.from('pain_points').select('*').order('severity', { ascending: false }),
    supabase.from('opportunities').select('*'),
  ]);

  if (ppError || opError) {
    console.error('Supabase Error:', ppError || opError);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#090B10] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white sm:text-6xl tracking-tight">
            REDDIT SAAS INSIGHTS
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Validated market pain points and high-potential business opportunities extracted from raw community discussions.
          </p>
        </div>

        {/* 1. Pain Points Wall */}
        <section className="mb-24">
          <SectionTitle>Market Pain Points</SectionTitle>
          {(!painPoints || painPoints.length === 0) ? (
            <div className="bg-white dark:bg-[#151921] p-10 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
              <p className="text-gray-500">No pain points found in database. Please ensure data is uploaded correctly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {painPoints.map((pp) => (
                <div key={pp.id} className="group bg-white dark:bg-[#151921] rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8 border border-gray-100 dark:border-gray-800 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${pp.severity >= 8 ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>
                      SEVERITY: {pp.severity}/10
                    </div>
                    <div className="text-gray-400 text-xs font-medium uppercase">{pp.frequency} Frequency</div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">{pp.problem_title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed flex-grow">{pp.root_cause}</p>
                  
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl mb-6">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-2">Evidence Quote</p>
                    <p className="text-sm italic text-gray-700 dark:text-gray-300">"{pp.example_quote}"</p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-50 dark:border-gray-800">
                    <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Target Audience</span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{pp.target_user}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 2. Opportunities Section */}
        <section className="mb-20">
          <SectionTitle>Product Ideas & Opportunities</SectionTitle>
          <div className="grid grid-cols-1 gap-8">
            {opportunities?.map((op) => (
              <div key={op.id} className="flex flex-col lg:flex-row bg-white dark:bg-[#151921] rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="bg-blue-600 lg:w-1/3 p-10 flex flex-col justify-center text-white">
                  <div className="inline-block px-3 py-1 bg-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 w-fit">
                    {op.product_type}
                  </div>
                  <h3 className="text-3xl font-black mb-4 leading-tight">{op.idea_name}</h3>
                  <div className="space-y-1">
                    <p className="text-blue-200 text-xs font-bold uppercase tracking-wide">Pricing Model</p>
                    <p className="text-white font-medium">{op.pricing_model}</p>
                  </div>
                </div>
                
                <div className="lg:w-2/3 p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase mb-3 tracking-wider">Problem Solved</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{op.problem_solved}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase mb-3 tracking-wider">Moat & Competitive Advantage</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{op.moat_strategy}</p>
                    </div>
                  </div>
                  
                  <div className="mt-10 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-gray-400 uppercase">Competition Level:</span>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        {op.competition_level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
