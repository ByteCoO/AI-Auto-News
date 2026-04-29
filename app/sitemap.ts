import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://visionong.dpdns.org'

  const routes = [
    '',
    '/ideas',
    '/trends',
    '/goldmine',
    '/business-insights',
    '/reddit-insights',
    '/price',
    '/about',
    '/feedback',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))
}