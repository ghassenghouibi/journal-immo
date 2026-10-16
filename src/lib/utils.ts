import { categories, pois, properties, type CategoryId, type Poi, type Property } from './data';

export const nf = new Intl.NumberFormat('fr-FR');
export const img = (f: string) => `/img/${f}`;

export const priceShort = (p: Property) => {
  if (p.transaction === 'location') return `${nf.format(p.price)} DT`;
  if (p.price >= 1e6) return `${(p.price / 1e6).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} M DT`;
  return `${Math.round(p.price / 1000)} k DT`;
};
export const priceText = (p: Property) => `${nf.format(p.price)} DT${p.transaction === 'location' ? '/mois' : ''}`;
export const roomsLabel = (p: Property) => (p.type === 'Local commercial' ? `${p.rooms} pièces` : `S+${p.bedrooms}`);

type LatLng = { lat: number; lng: number };
export function distanceKm(a: LatLng, b: LatLng) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function distLabel(km: number) {
  // distance à vol d'oiseau majorée de 25 % pour approcher le trajet réel
  const road = km * 1.25;
  const d = road < 1 ? `${Math.round(road * 100) * 10} m` : `${road.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km`;
  if (road <= 2) return { d, t: `${Math.max(1, Math.round((road / 5) * 60))} min`, mode: 'walk' as const };
  return { d, t: `${Math.max(2, Math.round((road / 35) * 60))} min`, mode: 'car' as const };
}

export type NearPoi = Poi & { km: number };
export function nearby(p: Property, perCat = 3) {
  const out = {} as Record<CategoryId, NearPoi[]>;
  (Object.keys(categories) as CategoryId[]).forEach(c => {
    out[c] = pois
      .filter(x => x.c === c)
      .map(x => ({ ...x, km: distanceKm(p, x) }))
      .sort((a, b) => a.km - b.km)
      .slice(0, perCat);
  });
  return out;
}

export interface Filters { t?: string; type?: string; q?: string; max?: string; ch?: string; s?: string; sort?: string; view?: string }
export const FILTER_KEYS: (keyof Filters)[] = ['t', 'type', 'q', 'max', 'ch', 's', 'sort', 'view'];

export function filterProps(f: Filters) {
  const r = properties.filter(p =>
    (!f.t || p.transaction === f.t) &&
    (!f.type || p.type === f.type) &&
    (!f.q || p.quartier === f.q) &&
    (!f.max || p.price <= +f.max) &&
    (!f.ch || p.bedrooms >= +f.ch) &&
    (!f.s || p.surface >= +f.s));
  if (f.sort === 'asc') r.sort((a, b) => a.price - b.price);
  if (f.sort === 'desc') r.sort((a, b) => b.price - a.price);
  if (f.sort === 'surface') r.sort((a, b) => b.surface - a.surface);
  return r;
}

export function filtersToQuery(f: Filters) {
  const o: Record<string, string> = {};
  FILTER_KEYS.forEach(k => { const v = f[k]; if (v && !(k === 'sort' && v === 'reco')) o[k] = v; });
  const qs = new URLSearchParams(o).toString();
  return '/biens' + (qs ? `?${qs}` : '');
}
