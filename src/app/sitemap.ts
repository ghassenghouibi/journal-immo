import type { MetadataRoute } from 'next';
import { properties } from '@/lib/data';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/biens', '/sousse', '/services', '/estimation', '/contact'];
  return [
    ...pages.map(p => ({ url: `${SITE_URL}${p}`, changeFrequency: 'weekly' as const, priority: p ? 0.7 : 1 })),
    ...properties.map(p => ({ url: `${SITE_URL}/biens/${p.id}`, changeFrequency: 'weekly' as const, priority: 0.8 }))
  ];
}
