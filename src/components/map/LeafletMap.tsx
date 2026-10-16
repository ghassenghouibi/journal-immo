'use client';

import type * as Leaflet from 'leaflet';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export type LeafletLib = typeof Leaflet;
export type MapInit = (L: LeafletLib, map: Leaflet.Map) => void | (() => void);

interface Props {
  init: MapInit;
  className?: string;
  options?: Leaflet.MapOptions;
  /** Désactive le glisser à un doigt sur mobile pour ne pas bloquer le défilement de la page. */
  touchFriendly?: boolean;
}

/**
 * Carte Leaflet chargée uniquement côté navigateur.
 * `init` est appelée une seule fois : changer la `key` du composant pour reconstruire la carte.
 */
export default function LeafletMap({ init, className = '', options, touchFriendly }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const initRef = useRef(init);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let map: Leaflet.Map | undefined;
    let cleanup: void | (() => void);
    let cancelled = false;

    import('leaflet').then(mod => {
      const L = ((mod as unknown as { default?: LeafletLib }).default ?? mod) as LeafletLib;
      if (cancelled) return;
      map = L.map(el, {
        scrollWheelZoom: false,
        zoomControl: false,
        dragging: touchFriendly ? !L.Browser.mobile : true,
        ...options
      });
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
      cleanup = initRef.current(L, map);
    });

    // liens internes dans les popups : navigation côté client
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a');
      const href = a?.getAttribute('href');
      if (href && href.startsWith('/')) { e.preventDefault(); router.push(href); }
    };
    el.addEventListener('click', onClick);

    return () => {
      cancelled = true;
      el.removeEventListener('click', onClick);
      if (cleanup) cleanup();
      map?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref} className={`map ${className}`} />;
}
