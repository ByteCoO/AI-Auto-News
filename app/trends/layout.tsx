import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Trends Radar',
  description: 'Real-time tracking of high-intent user signals from premium developer and startup communities. Discover commercial signals before anyone else.',
  alternates: { canonical: '/trends' },
};

export default function TrendsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
