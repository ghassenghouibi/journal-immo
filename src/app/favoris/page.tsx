'use client';

import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { PropertyCard } from '@/components/PropertyCard';
import { useApp } from '@/components/Providers';
import { SectionHead } from '@/components/SectionHead';
import { properties } from '@/lib/data';

export default function FavorisPage() {
  const { favs } = useApp();
  const list = properties.filter(p => favs.includes(p.id));
  return (
    <section className="section page-top">
      <div className="container">
        <SectionHead eyebrow="Ma sélection" title={<>Mes <em>favoris</em></>} />
        {list.length ? (
          <div className="grid">{list.map(p => <PropertyCard key={p.id} p={p} />)}</div>
        ) : (
          <div className="empty">
            <Icon name="heart" />
            <h3>Aucun favori pour l’instant</h3>
            <p>Touchez le cœur d’une annonce pour la retrouver ici.</p>
            <Link className="btn btn--primary" href="/biens">Parcourir les biens</Link>
          </div>
        )}
      </div>
    </section>
  );
}
