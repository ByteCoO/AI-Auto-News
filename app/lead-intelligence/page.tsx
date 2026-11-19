import React from 'react';
import { getLeadsFromSupabase } from './utils';
import { LeadDashboardClient } from './components/LeadDashboardClient';
import { LayoutDashboard } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lead Intelligence Dashboard',
  description: 'Analyze and convert real-time high-intent leads from Reddit. AI-powered lead scoring and opportunity tracking.',
  alternates: { canonical: '/lead-intelligence' },
};

export const revalidate = 0;

export default async function LeadIntelligencePage() {
  // 在服务器端直接获取数据
  const leads = await getLeadsFromSupabase();

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100">
      <nav className="bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-lg shadow-lg shadow-amber-500/20">
                <LayoutDashboard className="w-5 h-5 text-zinc-950" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">LeadIntel Dashboard</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500 mb-2 drop-shadow-sm">
            Opportunity Dashboard
          </h1>
          <p className="text-zinc-400 font-medium">Analyze and convert real-time high-intent leads from Reddit.</p>
        </div>

        {/* 将服务器端获取的数据传递给客户端组件进行展示和交互 */}
        <LeadDashboardClient leads={leads} />
      </main>
    </div>
  );
}