'use client';

import type * as Leaflet from 'leaflet';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState, type FormEvent } from 'react';
import { PROPERTY_TYPES, properties, quartiers } from '@/lib/data';
import { filterProps, filtersToQuery, nf, type Filters } from '@/lib/utils';
import { Icon } from './Icon';
import LeafletMap from './map/LeafletMap';
import { popupCard, pricePin } from './map/markers';
import { PropertyCard } from './PropertyCard';

const BUDGETS = { vente: [250000, 400000, 700000, 1000000, 1500000], location: [1000, 1500, 3000, 5000] };
const isDesktop = () => matchMedia('(min-width: 900px)').matches;

export function ListingView({ filters: f }: { filters: Filters }) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const markers = useRef<Record<string, Leaflet.Marker>>({});
  const leaflet = useRef<typeof Leaflet | null>(null);

  const res = filterProps(f);
  const active = (['type', 'q', 'max', 'ch', 's'] as const).filter(k => f[k]).length;
  const showMap = f.view === 'map';
  const title = f.t === 'vente' ? 'Biens à vendre' : f.t === 'location' ? 'Biens à louer' : 'Tous nos biens';
  const budgets = f.t === 'location' ? BUDGETS.location : BUDGETS.vente;

  const go = (patch: Filters) => router.push(filtersToQuery({ ...f, ...patch }), { scroll: false });
  const formValues = (form: HTMLFormElement) => Object.fromEntries(new FormData(form)) as Filters;
  const onSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setSheetOpen(false); go(formValues(e.currentTarget)); };

  const highlight = (id: string, on: boolean) => {
    const mk = markers.current[id], L = leaflet.current, p = properties.find(x => x.id === id);
    if (!mk || !L || !p) return;
    mk.setIcon(pricePin(L, p, on));
    mk.setZIndexOffset(on ? 1000 : 0);
  };

  const pts = res.length ? res : properties;

  return (
    <div className={`listing ${showMap ? 'show-map' : ''} ${sheetOpen ? 'filters-open' : ''}`}>
      <div className="toolbar">
        <div className="container toolbar__inner">
          <div className="seg seg--light seg--sm" role="radiogroup" aria-label="Transaction">
            {[['', 'Tous'], ['vente', 'Acheter'], ['location', 'Louer']].map(([v, l]) => (
              <label key={l}>
                <input type="radio" name="t" value={v} checked={(f.t || '') === v} onChange={() => go({ t: v, max: '' })} />
                <span>{l}</span>
              </label>
            ))}
          </div>
          <button className="chip-btn" onClick={() => setSheetOpen(true)}>
            <Icon name="filter" />Filtres{active > 0 && <b>{active}</b>}
          </button>

          <form className="filters" onSubmit={onSubmit} onChange={e => { if (isDesktop()) go(formValues(e.currentTarget)); }}>
            <div className="filters__head">
              <b>Filtres</b>
              <button type="button" className="icon-btn" onClick={() => setSheetOpen(false)} aria-label="Fermer"><Icon name="x" /></button>
            </div>
            <label className="field"><span>Quartier</span>
              <select name="q" defaultValue={f.q || ''}>
                <option value="">Tout Sousse</option>
                {quartiers.map(q => <option key={q.id}>{q.id}</option>)}
              </select>
            </label>
            <label className="field"><span>Type</span>
              <select name="type" defaultValue={f.type || ''}>
                <option value="">Tous types</option>
                {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="field"><span>Budget max</span>
              <select name="max" defaultValue={f.max || ''}>
                <option value="">Sans limite</option>
                {budgets.map(b => <option key={b} value={b}>≤ {nf.format(b)} DT{f.t === 'location' ? '/mois' : ''}</option>)}
              </select>
            </label>
            <div className="field"><span>Chambres min.</span>
              <div className="pills">
                {['', '1', '2', '3', '4'].map(x => (
                  <label key={x}><input type="radio" name="ch" value={x} defaultChecked={(f.ch || '') === x} /><span>{x ? `${x}+` : 'Tout'}</span></label>
                ))}
              </div>
            </div>
            <label className="field"><span>Trier par</span>
              <select name="sort" defaultValue={f.sort || 'reco'}>
                <option value="reco">Recommandés</option>
                <option value="asc">Prix croissant</option>
                <option value="desc">Prix décroissant</option>
                <option value="surface">Surface</option>
              </select>
            </label>
            {f.t && <input type="hidden" name="t" value={f.t} />}
            {f.view && <input type="hidden" name="view" value={f.view} />}
            <div className="filters__foot">
              <button type="button" className="btn btn--ghost" onClick={() => { setSheetOpen(false); go({ type: '', q: '', max: '', ch: '', s: '', sort: '' }); }}>Effacer</button>
              <button type="submit" className="btn btn--primary">Voir {res.length} bien{res.length > 1 ? 's' : ''}</button>
            </div>
          </form>
        </div>
      </div>
      <div className="sheet-backdrop" onClick={() => setSheetOpen(false)} />

      <div className="listing__body container">
        <div className="listing__list">
          <div className="listing__head">
            <h1 className="h3">{title}{f.q ? ` · ${f.q}` : ''}</h1>
            <span className="muted">{res.length} résultat{res.length > 1 ? 's' : ''}</span>
          </div>
          {res.length ? (
            <div className="grid">
              {res.map((p, i) => (
                <div key={p.id} onMouseEnter={() => highlight(p.id, true)} onMouseLeave={() => highlight(p.id, false)}>
                  <PropertyCard p={p} priority={i < 2} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">
              <Icon name="search" />
              <h3>Aucun bien ne correspond</h3>
              <p>Élargissez vos critères ou laissez-nous votre recherche : nous avons aussi des biens en off-market.</p>
              <Link className="btn btn--primary" href="/biens">Voir tous les biens</Link>
            </div>
          )}
        </div>
        <div className="listing__map">
          <LeafletMap
            init={(L, map) => {
              leaflet.current = L;
              pts.forEach(p => {
                markers.current[p.id] = L.marker([p.lat, p.lng], { icon: pricePin(L, p), riseOnHover: true })
                  .addTo(map)
                  .bindPopup(popupCard(p), { closeButton: false, offset: [0, -8] });
              });
              if (pts.length === 1) map.setView([pts[0].lat, pts[0].lng], 14);
              else map.fitBounds(pts.map(p => [p.lat, p.lng] as [number, number]), { padding: [40, 40] });
              // la carte peut être affichée après coup (bascule mobile)
              const ro = new ResizeObserver(() => map.invalidateSize());
              ro.observe(map.getContainer());
              return () => { ro.disconnect(); markers.current = {}; };
            }}
          />
        </div>
      </div>

      <button className="float-toggle" onClick={() => go({ view: showMap ? '' : 'map' })}>
        {showMap ? <><Icon name="list" />Liste</> : <><Icon name="map" />Carte</>}
      </button>
    </div>
  );
}
