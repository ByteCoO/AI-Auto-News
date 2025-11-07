
/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: 'Game Visioning: Your Hub for AI, Gaming, and Tech News',
  description: 'Explore the latest in AI, gaming, and technology. Game Visioning delivers daily news, in-depth analysis, and a vibrant community for tech enthusiasts.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://visionong.dpdns.org/',
    siteName: 'Game Visioning',
    images: [
      {
        url: 'https://visionong.dpdns.org/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Game Visioning - Your Hub for AI, Gaming, and Tech News',
      },
    ],
  },
  twitter: {
    handle: '@gamevisioning',
    site: '@gamevisioning',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0',
    },
    {
      name: 'theme-color',
      content: '#000000',
    },
    {
      httpEquiv: 'x-ua-compatible',
      content: 'IE=edge',
    },
  ],
};

export default defaultSEOConfig;
