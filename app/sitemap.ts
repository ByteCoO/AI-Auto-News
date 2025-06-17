// app/sitemap.ts
import { MetadataRoute } from 'next';
import { supabase } from './lib/supabase'; // Assuming this path is correct

// IMPORTANT: Replace 'https://yourdomain.com' with your actual production domain
// or better, set NEXT_PUBLIC_BASE_URL in your environment variables.
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/ft-news`, // Main FT News listing page
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // Add other important static pages here if any
    // Example:
    // {
    //   url: `${BASE_URL}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.5,
    // },
  ];

  try {// Fetch all articles for the sitemap
    const { data: articles, error } = await supabase
      .from('FT_articles')
      .select('id, updated_at, publishedtimestamputc') // Select fields for URL and lastModified
      .order('publishedtimestamputc', { ascending: false });

    if (error) {
      console.error('Error fetching articles for sitemap:', error.message);
      // Still return static entries if dynamic fetch fails
      return sitemapEntries;
    }

    if (articles) {
      articles.forEach(article => {
        const lastModifiedDate = article.updated_at || article.publishedtimestamputc;
        if (article.id && lastModifiedDate) {
          sitemapEntries.push({
            url: `${BASE_URL}/ft-news/${article.id}`,
            lastModified: new Date(lastModifiedDate),
            changeFrequency: 'weekly', // Adjust based on how often articles change
            priority: 0.7,
          });
        }
      });
    }
  } catch (e: unknown) { // Catch unknown for broader error handling
    if (e instanceof Error) {
      console.error('Unexpected error generating sitemap entries:', e.message);
    } else {
      console.error('An unknown error occurred in sitemap generation:', e);
    }
  }

  return sitemapEntries;
}