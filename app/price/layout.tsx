import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Choose a plan that matches your ambition. Get unfair advantages with real-time commercial signals starting from free.',
  alternates: { canonical: '/price' },
};

export default function PriceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Game Visioning Intelligence Platform',
            description: 'AI-powered business intelligence for discovering commercial signals and SaaS opportunities.',
            offers: [
              {
                '@type': 'Offer',
                name: 'Starter',
                price: '0',
                priceCurrency: 'USD',
                description: 'Daily Signal Radar, 3 Subreddits Monitored',
              },
              {
                '@type': 'Offer',
                name: 'Professional',
                price: '4.99',
                priceCurrency: 'USD',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  price: '4.99',
                  priceCurrency: 'USD',
                  billingDuration: 'P1M',
                },
                description: 'Unlimited Subreddits, Real-time AI Analysis, SaaS Opportunity Engine',
              },
              {
                '@type': 'Offer',
                name: 'Enterprise',
                price: '49.99',
                priceCurrency: 'USD',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  price: '49.99',
                  priceCurrency: 'USD',
                  billingDuration: 'P1M',
                },
                description: 'Custom API Access, Instant Alerting, Dedicated Support',
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
