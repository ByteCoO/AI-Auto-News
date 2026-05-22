import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import {
  RocketLaunchIcon,
  ChartBarIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import OpportunityFilters from './OpportunityFilters';

export const metadata = {
  title: 'SaaS Opportunity Radar - AI-Powered Market Intelligence',
  description: 'Discover validated SaaS opportunities extracted from real Reddit discussions.',
};

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getOpportunities() {
  const { data, error } = await supabase
    .from('v5_opportunities')
    .select('*')
    .order('demand_score', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    return [];
  }
  return data || [];
}

export default async function SaaSOpportunitiesPage() {
  const opportunities = await getOpportunities();

  return (
    <div className="w-full" style={{ fontFamily: 'var(--font-body)' }}>
      <OpportunityFilters opportunities={opportunities} />

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="relative rounded-2xl overflow-hidden p-8 md:p-12 text-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981)' }}>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Want the Full Picture?
          </h2>
          <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">
            Free users see summary cards. <strong className="text-white">Pro subscribers</strong> get:
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto mb-8">
            {[
              'Full evidence extraction with Reddit quotes',
              'Hot lead DM templates ready to send',
              'Complete 30-day execution plans',
              'Revenue simulation with realistic numbers',
              'Competition analysis & gap scores',
              'Weekly new opportunities delivered',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-left bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                <span className="text-sm text-white">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/price"
              className="btn-accent text-lg px-8 py-3"
            >
              See Pricing Plans
              <ArrowTrendingUpIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/lead-intelligence"
              className="inline-flex items-center justify-center px-8 py-3 text-white font-semibold border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
            >
              Explore Lead Intelligence
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-6xl mx-auto px-4 pb-16 text-center">
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Data sourced from <span className="font-medium">{opportunities.length} analyzed Reddit discussions</span> across r/SaaS, r/startups, r/ProductManagement, and more.
          <br />
          Updated continuously by our AI pipeline.
        </p>
      </section>
    </div>
  );
}
