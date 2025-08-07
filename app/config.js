export const BLOOMBERG_BASE_URL = 'https://www.bloomberg.com';

export const NEWS_SOURCES = [
  {
    title: 'Markets',
    apiUrl: '/api/bloomberg-news',
    isPaginated: true,
  },
  {
    title: 'Economics',
    apiUrl: '/api/bloomberg-economics',
    isPaginated: true,
  },
  {
    title: 'General',
    apiUrl: '/api/bloomberg-general',
    isPaginated: true,
  },
  {
    title: 'Popular',
    apiUrl: '/api/bloomberg-popular',
    isPaginated: false,
  },
];