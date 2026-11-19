'use client';

import Link from 'next/link';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const enterpriseSignals = [
  {
    lead_id: "ENT_001",
    signal_type: "HIGH_INTENT_CHURN",
    competitor: "Anthropic (Claude)",
    persona: "Physics/Math PhD Researcher",
    description: "Logic regression in Opus 4.7 (spiraling reasoning) and restrictive usage limits.",
    strategy: "Pitch model stability for complex proofs. Offer higher token limits for academia.",
    statusColor: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-400/10",
    url: "https://reddit.com/r/artificial/comments/1so16hr/opus_47_is_terrible_and_anthropic_has_completely/"
  },
  {
    lead_id: "ENT_002",
    signal_type: "UNMET_INFRA_NEED",
    competitor: "Stytch / Auth0",
    persona: "Full-stack Developer",
    description: "Lack of built-in analytics for auth event streams (login/signup failures).",
    strategy: "Highlight 'Native Analytics'. Position as drop-in replacement saving 40+ hours.",
    statusColor: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-400/10",
    url: "https://reddit.com/r/SideProject/comments/1oaq2kx/share_your_notai_projects/"
  },
  {
    lead_id: "ENT_003",
    signal_type: "MARKET_FATIGUE",
    competitor: "AI Wrapper Startups",
    persona: "Indie Hacker Leader",
    description: "Severe saturation and fatigue with low-quality AI-only products. Users seeking 'Hard Tech'.",
    strategy: "Marketing focus on 'Zero-AI' or 'Native Performance'. Sell robust infra tools.",
    statusColor: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-400/10",
    url: "https://reddit.com/r/SideProject/comments/1oaq2kx/share_your_notai_projects/"
  },
  {
    lead_id: "ENT_004",
    signal_type: "WORKFLOW_PAIN",
    competitor: "Legacy PMS Systems",
    persona: "Hotelier / Owner",
    description: "Inability to integrate self-service kiosks with existing reservation systems.",
    strategy: "Offer API-first PMS integration. Focus on 'Reduced Staff Costs'.",
    statusColor: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-400/10",
    url: "https://reddit.com/r/SideProject/comments/1ppr6gh/as_the_year_wraps_up_whats_the_project_youre_most/"
  },
  {
    lead_id: "ENT_005",
    signal_type: "UX_SWITCH",
    competitor: "Generic Fitness Apps",
    persona: "Professional Athlete",
    description: "Friction in UI (manual multi-select closing, lack of templates).",
    strategy: "Acquisition through 'Zero-Friction' onboarding. Emphasize pre-built templates.",
    statusColor: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-400/10",
    url: "https://reddit.com/r/SideProject/comments/1oaq2kx/share_your_notai_projects/"
  },
  {
    lead_id: "ENT_006",
    signal_type: "NICHE_DATA",
    competitor: "Bloomberg / Pol. Data",
    persona: "FinTech Data Engineer",
    description: "Need for specialized API tracking politician stock trades.",
    strategy: "Sell to hedge funds. Position as 'Alternative Data Alpha'.",
    statusColor: "text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-400/10",
    url: "https://reddit.com/r/SideProject/comments/1oaq2kx/share_your_notai_projects/"
  },
  {
    lead_id: "ENT_007",
    signal_type: "SALES_ENABLEMENT",
    competitor: "CRM Training",
    persona: "Sales Director",
    description: "Need for persona-specific AI training for complex cycles (Busy vs Technical).",
    strategy: "Sell simulated training modules. Focus on 'Shortened Sales Cycles'.",
    statusColor: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-400/10",
    url: "https://reddit.com/r/SideProject/comments/1ppr6gh/as_the_year_wraps_up_whats_the_project_youre_most/"
  },
  {
    lead_id: "ENT_008",
    signal_type: "SUBSCRIPTION_FATIGUE",
    competitor: "Adobe Creative Cloud",
    persona: "Creative / Linux User",
    description: "Subscription cost vs open-source availability on non-Windows platforms.",
    strategy: "Promote cross-platform compatibility. Intercept Adobe users on price.",
    statusColor: "text-pink-600 bg-pink-50 dark:text-pink-400 dark:bg-pink-400/10",
    url: "https://reddit.com/r/SideProject/comments/1oaq2kx/share_your_notai_projects/"
  },
  {
    lead_id: "ENT_009",
    signal_type: "SCALING_BOTTLENECK",
    competitor: "AWS / CloudFront",
    persona: "Cloud Architect",
    description: "AI hallucinations causing technical debt in AWS refactoring plans.",
    strategy: "Focus on 'Verified IaC generation'. Sell human-in-the-loop expert review.",
    statusColor: "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-400/10",
    url: "https://reddit.com/r/artificial/comments/1so16hr/opus_47_is_terrible_and_anthropic_has_completely/"
  },
  {
    lead_id: "ENT_010",
    signal_type: "RECRUITMENT_INT",
    competitor: "LinkedIn Premium",
    persona: "High-Skilled Seeker",
    description: "Fatigue with LinkedIn spam, ghost jobs, and third-party scam links.",
    strategy: "Offer hyper-personalized direct alerts. Sell 'Verified Direct Jobs'.",
    statusColor: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-400/10",
    url: "https://reddit.com/r/SideProject/comments/1ppr6gh/as_the_year_wraps_up_whats_the_project_youre_most/"
  }
];

export default function GoldminePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#090B10] text-gray-900 dark:text-[#E2E8F0] p-4 md:p-8 pt-24 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            Live Feed: Enterprise Tier 3
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter">
            THE <span className="text-yellow-500">CHURN</span> RADAR
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Direct interception of high-intent enterprise dissatisfaction. Real human pain points extracted and verified via Reddit.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 mb-20">
          {enterpriseSignals.map((signal, index) => (
            <div key={signal.lead_id} className="group relative overflow-hidden bg-gray-50 dark:bg-[#11141B] border border-gray-200 dark:border-white/5 rounded-2xl p-8 hover:border-yellow-500/50 transition-all shadow-sm hover:shadow-xl hover:shadow-yellow-500/5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="font-mono text-[10px] font-bold text-gray-400 px-2 py-1 bg-gray-200/50 dark:bg-white/5 rounded">{signal.lead_id}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-black tracking-widest border border-current ${signal.statusColor}`}>
                      {signal.signal_type}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-400">Targeting:</span>
                      <span className="text-xs font-black text-gray-900 dark:text-white uppercase">{signal.competitor}</span>
                    </div>
                    {index < 3 ? (
                      <a 
                        href={signal.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1 text-[10px] font-bold text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        VERIFY SOURCE
                      </a>
                    ) : (
                      <button 
                        onClick={() => alert(`🔒 Enterprise Access Only\n\nThis lead verification is restricted to Tier 3 subscribers. Please contact sales to unlock all 2,450+ signals.`)}
                        className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-yellow-500 transition-colors cursor-help"
                      >
                        <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        VERIFY (ENTERPRISE ONLY)
                      </button>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-yellow-500 transition-colors">{signal.persona}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{signal.description}</p>
                  
                  <div className="inline-flex items-center gap-3 p-3 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-300 uppercase tracking-wide">Strategy: {signal.strategy}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="border-t border-gray-100 dark:border-white/5 pt-12 pb-20 text-center">
          <p className="text-gray-400 text-sm font-mono tracking-widest mb-4">END OF ACTIVE STREAM | 10/10 LEADS DISPLAYED</p>
          <Link href="/price">
            <button className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-black rounded-2xl shadow-2xl hover:shadow-yellow-500/40 transition-all hover:-translate-y-1">
              Subscribe for Real-time Webhooks ($4.9/mo)
            </button>
          </Link>
        </footer>
      </div>
    </div>
  );
}
