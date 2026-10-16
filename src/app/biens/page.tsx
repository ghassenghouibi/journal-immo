import type { Metadata } from 'next';
import { ListingView } from '@/components/ListingView';
import { FILTER_KEYS, type Filters } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Biens à vendre et à louer à Sousse',
  description: 'Appartements, villas, duplex et locaux à vendre ou à louer à Sousse : Port El Kantaoui, Khezama, Sahloul, Boujaafar, Hammam Sousse…'
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function BiensPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const filters: Filters = {};
  FILTER_KEYS.forEach(k => {
    const v = sp[k];
    if (typeof v === 'string' && v) filters[k] = v;
  });
  // remonter la vue à chaque changement de filtres pour reconstruire liste et carte
  return <ListingView key={JSON.stringify(filters)} filters={filters} />;
}
