'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Property } from '@/lib/data';
import { img, nf, roomsLabel } from '@/lib/utils';
import { Icon } from './Icon';
import { useApp } from './Providers';

export function Price({ p }: { p: Property }) {
  return <>{nf.format(p.price)} DT{p.transaction === 'location' && <small>/mois</small>}</>;
}

export function FavButton({ id, variant = 'card' }: { id: string; variant?: 'card' | 'round' }) {
  const { favs, toggleFav, toast } = useApp();
  const on = favs.includes(id);
  return (
    <button
      className={`${variant === 'card' ? 'fav' : 'round-btn fav-round'} ${on ? 'is-on' : ''}`}
      aria-label={on ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      aria-pressed={on}
      onClick={e => {
        e.preventDefault(); e.stopPropagation();
        toast(toggleFav(id) ? 'Ajouté à vos favoris' : 'Retiré de vos favoris');
      }}
    >
      <Icon name="heart" />
    </button>
  );
}

export function TransactionTag({ p }: { p: Property }) {
  return <span className={`tag tag--${p.transaction}`}>{p.transaction === 'vente' ? 'À vendre' : 'À louer'}</span>;
}

export function PropertyCard({ p, priority = false }: { p: Property; priority?: boolean }) {
  return (
    <article className="card">
      <Link href={`/biens/${p.id}`} className="card__media">
        <Image src={img(p.images[0])} alt={p.title} fill priority={priority} sizes="(min-width: 1000px) 400px, (min-width: 600px) 46vw, 84vw" />
        <span className="card__tags">
          <TransactionTag p={p} />
          {p.badge && <span className="tag">{p.badge}</span>}
        </span>
      </Link>
      <FavButton id={p.id} />
      <Link href={`/biens/${p.id}`} className="card__body">
        <span className="card__loc"><Icon name="pin" />{p.quartier}, Sousse</span>
        <h3 className="card__title">{p.title}</h3>
        <span className="specs">
          <span><Icon name="door" />{roomsLabel(p)}</span>
          <span><Icon name="area" />{p.surface} m²</span>
          {p.bathrooms > 0 && <span><Icon name="bath" />{p.bathrooms}</span>}
        </span>
        <span className="card__price"><Price p={p} /></span>
      </Link>
    </article>
  );
}
