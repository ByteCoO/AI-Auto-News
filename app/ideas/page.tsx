"use client";

import React, { useState, useEffect, useRef } from 'react';

// ──────────────────────────────────────────────
// Type Definitions
// ──────────────────────────────────────────────
type Comment = {
  quote: string;
  upvotes: number;
  source: string;
  label: string;
  link: string;
};

type Trajectory = {
  target: string;
  pricing: string;
  mrr: string;
  time: string;
};

type Advanced = {
  risks?: string[];
  analog?: string;
};

type Opportunity = {
  id: string;
  title: string;
  desc: string;
  score: number;
  confidence: number;
  rev: string;
  demand: string;
  decision: string;
  comments: Comment[];
  steps: string[];
  trajectory: Trajectory;
  advanced?: Advanced;
};



// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────
const TOP_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'mastermind-1smhqxv',
    title: 'High-Signal Feedback Mastermind',
    desc: 'Vetted community for post-revenue founders to trade high-quality audits.',
    score: 75, confidence: 65, rev: '$1k-3k', demand: 'Rising', decision: 'BUILD',
    comments: [
      { quote: "The feedback on most posts is either generic or silent. Same thing happens around PH launches.", upvotes: 9, source: "r/SaaS", label: "Validation", link: "https://www.reddit.com/r/SaaS/comments/1smhqxv/" },
      { quote: "Spent ~19 years running an agency... struggling to get real users outside our own network.", upvotes: 2, source: "Agency Vet", label: "Acquisition", link: "https://www.reddit.com/r/SaaS/comments/1smhqxv/oge9lic/" },
      { quote: "Would be interested in a small group where people actually give real feedback instead of just 'looks good'.", upvotes: 2, source: "Founder", label: "Intent", link: "https://www.reddit.com/r/SaaS/comments/1smhqxv/oge9lic/" },
      { quote: "On initial community nobody gives a f*ck... nobody want to stay active and contribute to others.", upvotes: 1, source: "Builder", label: "Pain", link: "https://www.reddit.com/r/SaaS/comments/1smhqxv/ogg5mmo/" },
      { quote: "If people are giving advice, that's less time focused on their own products. Need skin in the game.", upvotes: 0, source: "r/SaaS", label: "Risk", link: "https://www.reddit.com/r/SaaS/comments/1smhqxv/ogenvl6/" }
    ],
    steps: ["Days 1-3: Filter builders via revenue proof.", "Days 4-10: Setup credit-based 'Feedback Swap'.", "Days 11-30: Launch PH 'Acceleration' service."],
    trajectory: { target: "12 Members", pricing: "$250/mo", mrr: "$3,000/mo", time: "14 Days" },
    advanced: { risks: ["Altruism exhaustion", "Churn of super-users"], analog: "Hampton / Indie Bites ($5k/yr)" }
  },
  {
    id: 'geo-ai',
    title: 'AI Search Optimization (GEO)',
    desc: 'Algorithm shifts creating massive gaps in AI-generated search results.',
    score: 95, confidence: 90, rev: '$1k-5k', demand: 'Exploding', decision: 'STRONG BUILD',
    comments: [
      { quote: "Our form builder Tally just crossed $5M ARR... AI search is our #1 acquisition channel.", upvotes: 271, source: "r/SaaS", label: "Leader", link: "https://www.reddit.com/r/SaaS/comments/1sm90qa/" },
      { quote: "Many bootstrapped founders are still optimizing for google SEO when traffic is coming through Claude/Google SGE.", upvotes: 1, source: "r/SaaS", label: "Trend", link: "https://www.reddit.com/r/SaaS/comments/1sm90qa/ogd3b9k/" },
      { quote: "I just found it a bit pricey for the actual functionality offered.", upvotes: 72, source: "Buyer", label: "Switching", link: "https://www.reddit.com/r/SaaS/comments/1sm90qa/ogdzsxe/" },
      { quote: "Mapping every search term to a 'job' instead of keyword made gaps weirdly obvious for us.", upvotes: 0, source: "Growth", label: "Method", link: "https://www.reddit.com/r/SaaS/comments/1sm90qa/ogf84gy/" },
      { quote: "Referral traffic is now coming through perplexity and ChatGPT web browse.", upvotes: 271, source: "r/SaaS", label: "Signal", link: "https://www.reddit.com/r/SaaS/comments/1sm90qa/" }
    ],
    steps: ["Audit landing pages for GEO compatibility.", "Map user complaints to Jobs to be Done.", "Offer $49/mo Citation Audit service."],
    trajectory: { target: "10 B2B users", pricing: "$290/mo", mrr: "$2,900/mo", time: "30 Days" }
  },
  {
    id: 'intent-outbound',
    title: 'Real-Time Intent Outbound',
    desc: 'Capture users exactly when they post about a specific problem.',
    score: 92, confidence: 85, rev: '$800-1.6k', demand: 'High Intent', decision: 'STRONG BUILD',
    comments: [
      { quote: "To this day about 70% of our revenue still comes from outbound... especially for 0 -> 1 stage.", upvotes: 29, source: "r/SaaS", label: "Revenue", link: "https://www.reddit.com/r/SaaS/comments/1smc3oe/" },
      { quote: "Timing matters. Reaching out right after a pain point post is 10x better than cold emailing.", upvotes: 35, source: "r/SaaS", label: "ROI", link: "https://www.reddit.com/r/SaaS/comments/1smc3oe/" },
      { quote: "I write the first 50 messages from scratch to find winning language.", upvotes: 3, source: "SDR", label: "Method", link: "https://www.reddit.com/r/SaaS/comments/1smc3oe/ogd6z03/" },
      { quote: "Stopped scraping big lists and only hit people who just asked a question.", upvotes: 1, source: "Founder", label: "Reply Rate", link: "https://www.reddit.com/r/SaaS/comments/1smc3oe/oge41cg/" },
      { quote: "Outbound stopped feeling gross once I treated it like joining an existing conversation.", upvotes: 1, source: "r/SaaS", label: "Mindset", link: "https://www.reddit.com/r/SaaS/comments/1smc3oe/oge41cg/" }
    ],
    steps: ["Build keyword scraper for Reddit/X.", "Integrate LLM for high-context replies.", "Sell access to real-time intent channels."],
    trajectory: { target: "20 users", pricing: "$99/mo", mrr: "$1,980/mo", time: "15 Days" }
  },
  {
    id: 'dm-shield',
    title: 'Founder DM Shield',
    desc: 'AI-powered filtering for business accounts facing bot attacks.',
    score: 82, confidence: 80, rev: '$300-600', demand: 'Rising Pain', decision: 'NICHE BUILD',
    comments: [
      { quote: "Every single time I post here lol. I get at least a couple of spam DMs every single time.", upvotes: 141, source: "Founder", label: "Spam", link: "https://www.reddit.com/r/SaaS/comments/1smmfl4/" },
      { quote: "Same here. I get at least a couple of spam DMs every time.", upvotes: 1, source: "r/SaaS", label: "Bot", link: "https://www.reddit.com/r/SaaS/comments/1smmfl4/oggdnf4/" },
      { quote: "Thanks for trying to take care of the slop!", upvotes: 45, source: "Community", label: "Safe", link: "https://www.reddit.com/r/SaaS/comments/1smmfl4/ogfwtkc/" },
      { quote: "Team Thundercock gave me a fair chuckle lmao", upvotes: 3, source: "r/SaaS", label: "Patterns", link: "https://www.reddit.com/r/SaaS/comments/1smmfl4/oggd2on/" },
      { quote: "Yall get this too? It's like we are being tracked.", upvotes: 6, source: "Founder", label: "Victim", link: "https://www.reddit.com/r/SaaS/comments/1smmfl4/" }
    ],
    steps: ["Create an 'auto-archive' extension for bot patterns.", "Release free version to collect data.", "Launch B2B 'Community Protection'."],
    trajectory: { target: "50 users", pricing: "$12/mo", mrr: "$600/mo", time: "10 Days" }
  }
];


// ──────────────────────────────────────────────
// Helper Functions
// ──────────────────────────────────────────────
const cn = (...classes: (string | false | undefined | null)[]) => classes.filter(Boolean).join(' ');

const getScoreColor = (score: number): string => {
  if (score >= 90) return 'from-emerald-400 to-emerald-300';
  if (score >= 80) return 'from-emerald-400 to-cyan-400';
  if (score >= 70) return 'from-amber-400 to-yellow-300';
  return 'from-slate-400 to-slate-300';
};

const getDecisionBadge = (decision: string): { bg: string; text: string; border: string; icon: string } => {
  if (decision.includes('STRONG')) return { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/40', icon: '🔥' };
  if (decision.includes('BUILD')) return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: '✅' };
  if (decision.includes('NICHE')) return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', icon: '🎯' };
  return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', icon: '📋' };
};



// ══════════════════════════════════════════════
// Badge Component
// ══════════════════════════════════════════════
const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'emerald' | 'amber' | 'red' | 'slate' }) => {
  const variants: Record<string, string> = {
    default: 'bg-white/5 border-white/10 text-slate-300',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    slate: 'bg-slate-800 border-slate-700 text-slate-400',
  };
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider', variants[variant])}>
      {children}
    </span>
  );
};

// ══════════════════════════════════════════════
// StatBox Component
// ══════════════════════════════════════════════
const StatBox = ({ label, value, suffix = '', highlight = false }: { label: string; value: string | number; suffix?: string; highlight?: boolean }) => (
  <div className="bg-[#0D0D0D] p-5 rounded-2xl border border-white/[0.06] hover:border-white/10 transition-all duration-300 group">
    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2 group-hover:text-slate-400 transition-colors">{label}</p>
    <p className={cn('text-2xl font-black', highlight ? 'text-emerald-400' : 'text-white')}>
      {value}<span className="text-sm text-slate-500 font-normal ml-0.5">{suffix}</span>
    </p>
  </div>
);

// ══════════════════════════════════════════════
// CommentCard Component
// ══════════════════════════════════════════════
const CommentCard = ({ comment }: { comment: Comment }) => (
  <div className="bg-[#0D0D0D] p-6 rounded-2xl border border-white/[0.05] hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between group animate-in fade-in">
    <div className="flex items-start gap-2 mb-4">
      <span className="text-emerald-400/60 text-lg leading-none mt-0.5">❝</span>
      <p className="text-slate-300 italic text-sm leading-relaxed">{comment.quote}</p>
    </div>
    <div className="flex justify-between items-end mt-4 pt-4 border-t border-white/[0.04]">
      <div className="flex flex-col gap-1">
        <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
          <span className="bg-emerald-500/10 px-2 py-0.5 rounded-md">👍 {comment.upvotes}</span>
        </span>
        <span className="text-slate-600 text-[10px]">{comment.source} · {comment.label}</span>
      </div>
      <a href={comment.link} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-emerald-500 hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 px-3 py-1.5 rounded-lg transition-all">
        VERIFY ↗
      </a>
    </div>
  </div>
);
// ══════════════════════════════════════════════
// OpportunityCard Component
// ══════════════════════════════════════════════
const OpportunityCard = ({ opp, index }: { opp: Opportunity; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const visibleComments = expanded ? opp.comments : opp.comments.slice(0, 2);
  const decisionStyle = getDecisionBadge(opp.decision);
  const scoreGradient = getScoreColor(opp.score);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={cardRef}
      className={cn(
        'bg-[#080808] border border-white/[0.07] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 mb-20',
        'hover:border-emerald-500/15 hover:shadow-emerald-500/5',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* ── Header: Title + Decision ── */}
      <div className="bg-gradient-to-br from-[#0C0C0C] via-[#0A0A0A] to-[#060606] p-8 md:p-10 border-b border-white/[0.04]">
        <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{decisionStyle.icon}</span>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">{opp.title}</h2>
            </div>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl">{opp.desc}</p>
          </div>
          <div className={cn('px-5 py-3 rounded-2xl border text-center shrink-0', decisionStyle.bg, decisionStyle.border)}>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">Decision</p>
            <p className={cn('text-lg font-black', decisionStyle.text)}>{opp.decision}</p>
          </div>
        </div>

        {/* ── 统计指标 ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatBox label="Opportunity Score" value={opp.score} suffix="/100" highlight={opp.score >= 90} />
          <StatBox label="Confidence" value={opp.confidence} suffix="%" highlight={opp.confidence >= 85} />
          <div className="bg-[#0D0D0D] p-5 rounded-2xl border border-white/[0.06] hover:border-white/10 transition-all duration-300 group">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2 group-hover:text-slate-400 transition-colors">Demand Level</p>
            <p className="text-lg font-black text-emerald-400">{opp.demand}</p>
          </div>
          <div className="bg-[#0D0D0D] p-5 rounded-2xl border border-white/[0.06] hover:border-white/10 transition-all duration-300 group">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2 group-hover:text-slate-400 transition-colors">Revenue Potential</p>
            <p className="text-lg font-black text-white italic">{opp.rev}</p>
          </div>
        </div>

        {/* ── 评分进度条 ── */}
        <div className="mt-6">
          <div className="flex justify-between text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-2">
            <span>Signal Strength</span>
            <span className="text-slate-500">{opp.score}%</span>
          </div>
          <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-1000', scoreGradient)}
              style={{ width: isVisible ? `${opp.score}%` : '0%', transitionDelay: `${index * 100 + 300}ms` }}
            />
          </div>
        </div>
      </div>

      {/* ── 用户评论 ── */}
      <div className="p-8 md:p-10 border-b border-white/[0.04] bg-black/30">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-sm">💬</span>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Real User Voices</p>
            <p className="text-xs text-slate-600">Verified comments from Reddit</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleComments.map((comment, i) => (
            <CommentCard key={i} comment={comment} />
          ))}
        </div>
        {opp.comments.length > 2 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-bold text-emerald-500 hover:text-emerald-300 underline decoration-emerald-500/20 hover:decoration-emerald-500/40 transition-all px-4 py-2"
            >
              {expanded ? '↑ Show Less' : `↓ View All ${opp.comments.length} User Voices`}
            </button>
          </div>
        )}
      </div>

      {/* ── 执行步骤 & 预期轨迹 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 md:p-10 border-r border-white/[0.04]">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Execution Roadmap
          </h3>
          <div className="space-y-4">
            {opp.steps.map((step, i) => (
              <div key={i} className="flex gap-4 group">
                <span className="text-emerald-500/40 font-mono text-xs mt-0.5">0{i + 1}</span>
                <p className="text-slate-300 text-sm group-hover:text-white transition-colors">{step}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-8 md:p-10 bg-emerald-500/[0.02]">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Target Trajectory
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Target</p>
              <p className="text-white font-bold">{opp.trajectory.target}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Timeframe</p>
              <p className="text-white font-bold">{opp.trajectory.time}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Pricing</p>
              <p className="text-emerald-400 font-bold">{opp.trajectory.pricing}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">MRR Goal</p>
              <p className="text-cyan-400 font-bold">{opp.trajectory.mrr}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function IdeasPage() {
  const triggerFeedback = () => {
    window.dispatchEvent(new CustomEvent('open-feedback'));
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
      {/* Top Tip Banner */}
      <div className="bg-emerald-500/10 border-b border-white/[0.05] py-2.5 text-center relative z-50">
        <p className="text-[10px] md:text-xs font-bold text-emerald-400 tracking-widest uppercase">
          Want to explore more business ideas? <button onClick={triggerFeedback} className="underline decoration-emerald-500/30 hover:text-emerald-300 ml-1 transition-colors cursor-pointer">
            Click here to leave a message
          </button>
        </p>
      </div>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <Badge variant="emerald">Market Intelligence v2.1</Badge>
          <h1 className="mt-8 text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            Signal <span className="text-emerald-500">vs</span> Noise
          </h1>
          <p className="mt-6 text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            We track thousands of Reddit & Twitter conversations to find high-conviction 
            SaaS opportunities where the pain is real and the budget exists.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        {/* Opportunities List */}
        <div className="mb-32">
          {TOP_OPPORTUNITIES.map((opp, i) => (
            <OpportunityCard key={opp.id} opp={opp} index={i} />
          ))}
        </div>



        {/* Footer */}
        <footer className="mt-60 pt-20 border-t border-white/[0.05] text-center">
          <p className="text-slate-600 text-xs font-bold uppercase tracking-[0.3em]">Built for 2025 Speed</p>
        </footer>
      </div>
    </main>
  );
}