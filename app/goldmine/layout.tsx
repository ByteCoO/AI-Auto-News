import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enterprise Churn Radar',
  description: 'Direct interception of high-intent enterprise dissatisfaction signals. Real human pain points extracted and verified via Reddit.',
  alternates: { canonical: '/goldmine' },
};

export default function GoldmineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
