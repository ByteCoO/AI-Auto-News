import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Feedback',
  description: 'Share your feedback and help us evolve Game Visioning. Your voice shapes the future of our AI-powered platform.',
  alternates: { canonical: '/feedback' },
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
