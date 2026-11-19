import { loadRedditData, getStats, getHighValueOpportunities, getPainPoints, getBuySignals } from '@/lib/reddit-data';
import RedditOpportunitiesPage from './RedditOpportunitiesClient';

export const metadata = {
  title: 'Reddit Business Opportunity Radar | GameVerse',
  description: 'Extract SaaS ideas, user pain points, and buying signals from high-value Reddit comments',
};

export default function Page() {
  const data = loadRedditData();
  console.log('📊 Reddit data loaded:', data.length, 'records');
  
  const stats = getStats(data);
  const highValueOpportunities = getHighValueOpportunities(data);
  const painPoints = getPainPoints(data);
  const buySignals = getBuySignals(data);

  console.log('📈 Stats:', stats);

  return (
    <RedditOpportunitiesPage
      stats={stats}
      highValueOpportunities={highValueOpportunities}
      painPoints={painPoints}
      buySignals={buySignals}
    />
  );
}
