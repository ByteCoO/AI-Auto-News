'use client';

import React, { useState } from 'react';
import { Lead } from '../types';
import { LeadCard } from './LeadCard';
import { LeadModal } from './LeadModal';
import { FinancialCharts } from './FinancialCharts';
import { Users, Target, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export function LeadDashboardClient({ leads }: { leads: Lead[] }) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const highIntentCount = leads.filter(l => l.intent_signal === 'HIGH').length;
  const avgProbability = leads.length > 0 
    ? Math.round(leads.reduce((acc, curr) => acc + curr.sales_intelligence.conversion_probability, 0) / leads.length * 100)
    : 0;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <MetricCard title="Total Leads Discovered" value={leads.length} icon={<Users size={20} />} trend="+12% today" />
        <MetricCard title="High Intent Targets" value={highIntentCount} icon={<Target size={20} />} trend="Action Required" highlight />
        <MetricCard title="Avg Conversion Prob." value={`${avgProbability}%`} icon={<Activity size={20} />} trend="Steady" />
      </div>

      <FinancialCharts leads={leads} />

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          Active Signals
        </h2>
        <div className="text-sm font-medium text-zinc-500">Showing {leads.length} opportunities</div>
      </div>

      <motion.div 
        initial="hidden" animate="visible" 
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {leads.map((lead) => (
          <motion.div key={lead.lead_id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <LeadCard lead={lead} onClick={() => setSelectedLead(lead)} />
          </motion.div>
        ))}
      </motion.div>

      {selectedLead && <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}
    </>
  );
}

function MetricCard({ title, value, icon, trend, highlight }: any) {
  return (
    <div className={`bg-zinc-900/50 backdrop-blur-sm rounded-xl border ${highlight ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-zinc-800 shadow-sm'} p-5 flex flex-col justify-between`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${highlight ? 'bg-amber-500/10 text-amber-400' : 'bg-zinc-800 text-zinc-400'}`}>{icon}</div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${highlight ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>{trend}</span>
      </div>
      <div>
        <h4 className="text-zinc-500 text-sm font-medium mb-1">{title}</h4>
        <span className="text-2xl font-black text-white">{value}</span>
      </div>
    </div>
  );
}