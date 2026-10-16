'use client';

import { agency, properties, quartiers } from '@/lib/data';
import LeafletMap from './LeafletMap';
import { homePin, popupCard, pricePin } from './markers';

/** Tous les biens, épinglés avec leur prix. */
export function PropertiesMap({ className = '' }: { className?: string }) {
  return (
    <LeafletMap
      className={className}
      init={(L, map) => {
        properties.forEach(p => {
          L.marker([p.lat, p.lng], { icon: pricePin(L, p) })
            .addTo(map)
            .bindPopup(popupCard(p), { closeButton: false, offset: [0, -8] });
        });
        map.fitBounds(properties.map(p => [p.lat, p.lng] as [number, number]), { padding: [30, 30] });
      }}
    />
  );
}

export function QuartiersMap({ className = '' }: { className?: string }) {
  return (
    <LeafletMap
      className={className}
      init={(L, map) => {
        quartiers.forEach(q => {
          L.marker([q.lat, q.lng], {
            icon: L.divIcon({ className: '', iconSize: undefined, html: `<a class="qpin" href="/biens?q=${encodeURIComponent(q.id)}">${q.id}</a>` })
          }).addTo(map);
        });
        map.fitBounds(quartiers.map(q => [q.lat, q.lng] as [number, number]), { padding: [40, 40] });
      }}
    />
  );
}

export function AgencyMap() {
  return (
    <LeafletMap
      className="map--contact"
      touchFriendly
      init={(L, map) => {
        map.setView([agency.lat, agency.lng], 15);
        L.marker([agency.lat, agency.lng], { icon: homePin(L) }).addTo(map)
          .bindPopup(`<b>Journal Immobilier</b><br>${agency.address}`);
      }}
    />
  );
}
