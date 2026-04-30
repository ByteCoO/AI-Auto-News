'use client';

import React, { useState } from 'react';
import { leadsData } from './data/leads';
import { Lead } from './types';
import { LeadCard } from './components/LeadCard';
import { LeadModal } from './components/LeadModal';
import { FinancialCharts } from './components/FinancialCharts';
import { LayoutDashboard, Users, Target, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeadIntelligencePage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Stats
  const highIntentCount = leadsData.filter(l => l.intent_signal === 'HIGH').length;
  const avgProbability = Math.round(
    leadsData.reduce((acc, curr) => acc + curr.sales_intelligence.conversion_probability, 0) / leadsData.length * 100
  );

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100">
      {/* Local Navbar for the dashboard */}
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
        
        {/* Header section with metrics */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500 mb-2 drop-shadow-sm">
            Opportunity Dashboard
          </h1>
          <p className="text-zinc-400 font-medium">Analyze and convert real-time high-intent leads.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <MetricCard title="Total Leads Discovered" value={leadsData.length} icon={<Users size={20} />} trend="+12% today" />
          <MetricCard title="High Intent Targets" value={highIntentCount} icon={<Target size={20} />} trend="Action Required" highlight />
          <MetricCard title="Avg Conversion Prob." value={`${avgProbability}%`} icon={<Activity size={20} />} trend="Steady" />
        </div>

        <FinancialCharts leads={leadsData} />

        {/* Leads Grid */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Active Signals
          </h2>
          <div className="text-sm font-medium text-zinc-500">
            Showing {leadsData.length} opportunities
          </div>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {leadsData.map((lead) => (
            <motion.div
              key={lead.lead_id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <LeadCard lead={lead} onClick={() => setSelectedLead(lead)} />
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Modal */}
      {selectedLead && (
        <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  );
}

// Simple Metric Card component
function MetricCard({ title, value, icon, trend, highlight }: { title: string, value: string | number, icon: React.ReactNode, trend: string, highlight?: boolean }) {
  return (
    <div className={`bg-zinc-900/50 backdrop-blur-sm rounded-xl border ${highlight ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-zinc-800 shadow-sm'} p-5 flex flex-col justify-between transition-colors`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${highlight ? 'bg-amber-500/10 text-amber-400' : 'bg-zinc-800 text-zinc-400'}`}>
          {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${highlight ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
          {trend}
        </span>
      </div>
      <div>
        <h4 className="text-zinc-500 text-sm font-medium mb-1">{title}</h4>
        <span className="text-2xl font-black text-white">{value}</span>
      </div>
    </div>
  );
}