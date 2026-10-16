'use client';

import { useRouter } from 'next/navigation';
import { PROPERTY_TYPES, quartiers } from '@/lib/data';
import { filtersToQuery } from '@/lib/utils';
import { Icon } from './Icon';

export function SearchBox() {
  const router = useRouter();
  return (
    <form
      className="search"
      autoComplete="off"
      onSubmit={e => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
        router.push(filtersToQuery(d));
      }}
    >
      <div className="seg" role="radiogroup" aria-label="Projet">
        <label><input type="radio" name="t" value="vente" defaultChecked /><span>Acheter</span></label>
        <label><input type="radio" name="t" value="location" /><span>Louer</span></label>
      </div>
      <div className="search__fields">
        <label className="field"><span>Quartier</span>
          <select name="q" defaultValue="">
            <option value="">Tout Sousse</option>
            {quartiers.map(q => <option key={q.id}>{q.id}</option>)}
          </select>
        </label>
        <label className="field"><span>Type de bien</span>
          <select name="type" defaultValue="">
            <option value="">Tous types</option>
            {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </label>
        <button className="btn btn--primary search__btn" type="submit"><Icon name="search" /><span>Rechercher</span></button>
      </div>
    </form>
  );
}
