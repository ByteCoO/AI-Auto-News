
/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: 'Auto NW News',
  description: 'Your premier source for automated news aggregation, bringing you the latest updates from around the world.',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://www.auto-nw.com/', // Replace with your actual domain
    siteName: 'Auto NW News',
    images: [
      {
        url: 'https://www.auto-nw.com/og-image.png', // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: 'Auto NW News',
      },
    ],
  },
  twitter: {
    handle: '@auto_nw', // Replace with your Twitter handle
    site: '@auto_nw', // Replace with your Twitter site
    cardType: 'summary_large_image',
  },
};

export default defaultSEOConfig;
