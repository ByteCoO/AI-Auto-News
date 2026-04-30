import React from 'react';
import { Lead } from '../types';
import { X, ExternalLink, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';

interface LeadModalProps {
  lead: Lead | null;
  onClose: () => void;
}

export function LeadModal({ lead, onClose }: LeadModalProps) {
  const [activeTab, setActiveTab] = React.useState<'details' | 'json'>('details');

  // Reset tab when lead changes
  React.useEffect(() => {
    if (lead) setActiveTab('details');
  }, [lead]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!lead) return null;

  const isHighIntent = lead.intent_signal === 'HIGH';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col border border-zinc-800"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-white">{lead.context.target_product}</h2>
                <span className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-full border",
                  isHighIntent ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]" : "bg-zinc-800 text-amber-500/60 border-zinc-700"
                )}>
                  {lead.intent_signal} INTENT
                </span>
              </div>
              <p className="text-sm text-zinc-500 font-medium">Lead ID: {lead.lead_id}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                <button
                  onClick={() => setActiveTab('details')}
                  className={cn(
                    "text-xs font-bold px-3 py-1.5 rounded-md transition-all",
                    activeTab === 'details' ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                  )}
                >
                  Insights
                </button>
                <button
                  onClick={() => setActiveTab('json')}
                  className={cn(
                    "text-xs font-bold px-3 py-1.5 rounded-md transition-all flex items-center gap-1",
                    activeTab === 'json' ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                  )}
                >
                  <Code2 className="w-3 h-3" /> Raw JSON
                </button>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white rounded-full transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-zinc-950">
            {activeTab === 'details' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                   <Section title="Context">
                    <Field label="Platform" value={lead.context.platform} />
                    <Field label="User Stage" value={lead.context.user_stage} />
                    <Field label="Urgency" value={lead.context.urgency} />
                    <div className="mt-3 bg-amber-500/10 text-amber-500 p-3 rounded-lg border border-amber-500/20 text-sm">
                      <span className="font-bold flex items-center gap-2 mb-1 text-amber-400">
                         Complaint / Pain Point
                      </span>
                      <span className="text-zinc-300">{lead.context.pain_point}</span>
                    </div>
                  </Section>

                  <Section title="User Profile">
                    <Field label="Type" value={lead.user_profile.user_type} />
                    <Field label="Budget" value={lead.user_profile.estimated_budget || 'Unknown'} />
                    <div className="mt-2 text-sm text-zinc-400">
                      <span className="font-semibold text-zinc-300 block mb-2 mt-4">Existing Tools:</span>
                      <div className="flex flex-wrap gap-2">
                        {lead.user_profile.existing_tools.map(t => (
                          <span key={t} className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-700 text-xs">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-zinc-400">
                      <span className="font-semibold text-zinc-300 block mb-2">Behavior Signals:</span>
                      <ul className="list-disc list-inside space-y-1 text-zinc-300">
                         {lead.user_profile.behavior_signal.map((signal, i) => (
                           <li key={i}>{signal}</li>
                         ))}
                      </ul>
                    </div>
                  </Section>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <Section title="Action Plan" className="border-amber-500/30 bg-amber-500/5">
                    <Field label="Channel" value={lead.action_plan.channel} />
                    <Field label="Timing" value={lead.action_plan.timing} />
                    <Field label="Entry Offer" value={lead.action_plan.entry_offer} />
                    <div className="mt-4 text-sm">
                      <span className="font-semibold text-zinc-300 block mb-2">What to sell:</span>
                      <div className="flex flex-wrap gap-2">
                        {lead.action_plan.what_to_sell.map(t => (
                          <span key={t} className="bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-5 bg-zinc-950/80 border border-zinc-800 p-4 rounded-lg relative">
                      <span className="absolute -top-2.5 left-4 bg-zinc-950 px-2 text-xs font-bold text-amber-500 uppercase tracking-wider">Generated Reply Script</span>
                      <p className="text-zinc-300 text-sm leading-relaxed italic mt-1 font-medium">\"{lead.action_plan.reply_script}\"</p>
                    </div>
                  </Section>

                  <Section title="Sales Intelligence">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                       <Field label="Match Score" value={`${(lead.match_score * 100).toFixed(0)}%`} valueClassName="text-amber-400 font-bold" />
                       <Field label="Conversion Prob." value={`${(lead.sales_intelligence.conversion_probability * 100).toFixed(0)}%`} valueClassName="text-amber-500 font-bold" />
                       <Field label="Est. LTV" value={lead.sales_intelligence.estimated_ltv || 'N/A'} />
                       <Field label="Time to Close" value={lead.sales_intelligence.time_to_close} />
                    </div>
                    <Field label="Competitor" value={lead.sales_intelligence.competitor_weakness} />
                    <Field label="Winning Angle" value={lead.sales_intelligence.winning_angle} className="mt-3" valueClassName="text-amber-400" />
                  </Section>
                  
                  <Section title="Evidence & Source">
                     <div className="bg-zinc-950 p-3 border border-zinc-800 rounded-lg text-sm text-zinc-400 italic border-l-4 border-l-amber-500/50 mb-4 font-mono text-xs">
                       \"{lead.evidence.raw_excerpt}\"
                     </div>
                     <a 
                       href={lead.source.url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-500 hover:text-amber-400 hover:underline"
                     >
                       <ExternalLink className="w-4 h-4" /> View Original Post on {lead.source.subreddit || 'Source'}
                     </a>
                  </Section>
                </div>
              </div>
            ) : (
              <div className="h-full bg-zinc-950 border border-zinc-800 rounded-lg p-6 overflow-auto text-sm font-mono text-amber-500/80 leading-relaxed custom-scrollbar shadow-inner">
                <pre>{JSON.stringify(lead, null, 2)}</pre>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Helpers
function Section({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 p-5", className)}>
      <h3 className="font-bold text-white mb-4 pb-2 border-b border-zinc-800/50">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, className, valueClassName }: { label: string, value: string, className?: string, valueClassName?: string }) {
  return (
    <div className={cn("mb-2 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2", className)}>
      <span className="text-sm font-semibold text-zinc-500 min-w-[120px]">{label}:</span>
      <span className={cn("text-sm text-zinc-100 flex-1", valueClassName)}>{value}</span>
    </div>
  );
}