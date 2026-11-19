import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SaaS Ideas & Opportunities',
  description: 'High-conviction SaaS opportunities tracked from Reddit and Twitter. Real pain points, real budgets, validated by data.',
  alternates: { canonical: '/ideas' },
};

export default function IdeasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
