import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Game Visioning - our mission, team, and the story behind the AI-powered business intelligence platform.',
  alternates: { canonical: '/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Game Visioning',
            description: 'Learn about our mission, team, and the story behind the AI-powered business intelligence platform.',
            url: 'https://visionong.dpdns.org/about',
            mainEntity: {
              '@type': 'Organization',
              name: 'Game Visioning',
              url: 'https://visionong.dpdns.org',
              foundingDate: '2023',
              description: 'AI-powered business intelligence platform that helps entrepreneurs discover real user needs through data.',
            },
          }),
        }}
      />
      {children}
    </>
  );
}
