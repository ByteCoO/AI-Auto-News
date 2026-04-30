import React from 'react';
import { Lead } from '../types';
import { cn } from '../utils';
import { Target, AlertCircle, BarChart3, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const isHighIntent = lead.intent_signal === 'HIGH';
  
  return (
    <motion.div 
      whileHover={{ y: -4, borderColor: 'rgba(245, 158, 11, 0.4)' }}
      className="bg-zinc-900/50 backdrop-blur-sm rounded-xl shadow-lg shadow-black/20 border border-zinc-800 overflow-hidden cursor-pointer transition-colors flex flex-col h-full group"
      onClick={onClick}
    >
      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-2 rounded-lg transition-colors",
              isHighIntent ? "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20" : "bg-zinc-800 text-amber-500/60"
            )}>
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-100 leading-tight">
                {lead.context.target_product}
              </h3>
              <p className="text-xs font-medium text-zinc-500 mt-0.5">
                {lead.context.platform}
              </p>
            </div>
          </div>
          <div className={cn(
            "text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border",
            isHighIntent ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-zinc-800 text-zinc-400 border-zinc-700"
          )}>
            <AlertCircle className="w-3 h-3" />
            {lead.intent_signal}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Pain Point</p>
            <p className="text-sm text-zinc-300 line-clamp-3 leading-relaxed">
              "{lead.context.pain_point}"
            </p>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="pt-4 mt-auto border-t border-zinc-800 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
            <span className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
              <BarChart3 className="w-3 h-3" /> Score
            </span>
            <span className="text-sm font-bold text-amber-400">{(lead.match_score * 100).toFixed(0)}%</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
            <span className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Prob
            </span>
            <span className="text-sm font-bold text-amber-500">{(lead.sales_intelligence.conversion_probability * 100).toFixed(0)}%</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-950/50 border border-zinc-800/50 text-center">
             <span className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Close
            </span>
            <span className="text-xs font-bold text-zinc-300 line-clamp-1">{lead.sales_intelligence.time_to_close}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}