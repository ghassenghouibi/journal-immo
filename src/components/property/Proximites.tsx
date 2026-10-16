'use client';

import type { CSSProperties } from 'react';
import type * as Leaflet from 'leaflet';
import { useRef, useState } from 'react';
import { categories, type CategoryId, type Property } from '@/lib/data';
import { distLabel, nearby } from '@/lib/utils';
import { Icon } from '../Icon';
import LeafletMap from '../map/LeafletMap';
import { esc, homePin, poiPin } from '../map/markers';

type Cat = CategoryId | 'all';
const CATS = Object.keys(categories) as CategoryId[];

export function Proximites({ p }: { p: Property }) {
  const near = nearby(p);
  const [cat, setCat] = useState<Cat>('all');
  const api = useRef<{ show: (c: Cat) => void; focus: (name: string) => void } | null>(null);
  const mapBox = useRef<HTMLDivElement>(null);

  const select = (c: Cat) => { setCat(c); api.current?.show(c); };

  return (
    <section className="block" id="proximites">
      <h2 className="h3">Proximités & quartier</h2>
      <p className="muted small">Distances indicatives estimées depuis l’adresse du bien.</p>
      <div className="chips">
        <button className={`chip ${cat === 'all' ? 'is-on' : ''}`} onClick={() => select('all')}>Tout</button>
        {CATS.map(k => (
          <button key={k} className={`chip ${cat === k ? 'is-on' : ''}`} style={{ '--c': categories[k].color } as CSSProperties} onClick={() => select(k)}>
            <Icon name={categories[k].icon} />{categories[k].short}
          </button>
        ))}
      </div>

      <div ref={mapBox}>
        <LeafletMap
          className="map--detail"
          touchFriendly
          init={(L, map) => {
            L.circle([p.lat, p.lng], { radius: 1000, color: '#0772BA', weight: 1, dashArray: '4 6', fillOpacity: 0.04 }).addTo(map);
            L.marker([p.lat, p.lng], { icon: homePin(L), zIndexOffset: 1000 }).addTo(map).bindPopup(`<b>${esc(p.title)}</b>`);

            const layers = {} as Record<CategoryId, Leaflet.LayerGroup>;
            const byName: Record<string, { mk: Leaflet.Marker; k: CategoryId }> = {};
            CATS.forEach(k => {
              layers[k] = L.layerGroup(near[k].map(x => {
                const d = distLabel(x.km);
                const mk = L.marker([x.lat, x.lng], { icon: poiPin(L, k) })
                  .bindPopup(`<b>${esc(x.n)}</b><br><span class="muted">${categories[k].short} · ${d.d} · ${d.t}</span>`, { closeButton: false });
                byName[x.n] = { mk, k };
                return mk;
              })).addTo(map);
            });

            // cadrer sur le bien et les lieux proches (l'aéroport, trop loin, est exclu)
            const fitTo = (cs: CategoryId[]) => {
              const pts: [number, number][] = [[p.lat, p.lng]];
              cs.forEach(k => near[k].forEach(x => { if (x.km < 6) pts.push([x.lat, x.lng]); }));
              map.fitBounds(pts, { padding: [36, 36], maxZoom: 15 });
            };
            fitTo(CATS);

            api.current = {
              show: c => {
                CATS.forEach(k => (c === 'all' || c === k ? layers[k].addTo(map) : map.removeLayer(layers[k])));
                fitTo(c === 'all' ? CATS : [c]);
              },
              focus: name => {
                const o = byName[name];
                if (!o) return;
                layers[o.k].addTo(map);
                map.setView(o.mk.getLatLng(), Math.max(map.getZoom(), 15));
                o.mk.openPopup();
              }
            };
            return () => { api.current = null; };
          }}
        />
      </div>

      <div className="near">
        {CATS.map(k => (
          <div key={k} className={`near__cat ${cat !== 'all' && cat !== k ? 'is-dim' : ''}`}>
            <h3 style={{ '--c': categories[k].color } as CSSProperties}><span><Icon name={categories[k].icon} /></span>{categories[k].label}</h3>
            <ul>
              {near[k].map(x => {
                const d = distLabel(x.km);
                return (
                  <li key={x.n}>
                    <button onClick={() => { mapBox.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); api.current?.focus(x.n); }}>
                      <span className="near__name">{x.n}</span>
                      <span className="near__dist"><Icon name={d.mode} />{d.t}<small>{d.d}</small></span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
