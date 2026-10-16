import { categories, type CategoryId, type Property } from '@/lib/data';
import { img, nf, priceShort } from '@/lib/utils';
import { iconHtml } from '../Icon';
import type { LeafletLib } from './LeafletMap';

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export const pricePin = (L: LeafletLib, p: Property, active = false) => L.divIcon({
  className: '',
  iconSize: undefined,
  html: `<div class="pin ${active ? 'pin--active' : ''}">${priceShort(p)}</div>`
});

export const homePin = (L: LeafletLib) => L.divIcon({
  className: '', iconSize: [44, 44], iconAnchor: [22, 44],
  html: `<div class="home-pin">${iconHtml('home')}</div>`
});

export const poiPin = (L: LeafletLib, c: CategoryId) => L.divIcon({
  className: '', iconSize: [30, 30], iconAnchor: [15, 15],
  html: `<div class="poi-pin" style="--c:${categories[c].color}">${iconHtml(categories[c].icon)}</div>`
});

export const popupCard = (p: Property) => `
  <a class="map-card" href="/biens/${p.id}">
    <img src="${img(p.images[0])}" alt="">
    <span>
      <b>${nf.format(p.price)} DT${p.transaction === 'location' ? '<small>/mois</small>' : ''}</b>
      <em>${esc(p.title)}</em>
      <small>${esc(p.quartier)} · ${p.surface} m²</small>
    </span>
  </a>`;

export { esc };
