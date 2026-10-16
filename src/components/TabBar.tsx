'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Icon, type IconName } from './Icon';
import { useApp } from './Providers';

const TABS: { key: string; href: string; icon: IconName; label: string }[] = [
  { key: 'home', href: '/', icon: 'home', label: 'Accueil' },
  { key: 'biens', href: '/biens', icon: 'search', label: 'Biens' },
  { key: 'map', href: '/biens?view=map', icon: 'map', label: 'Carte' },
  { key: 'favoris', href: '/favoris', icon: 'heart', label: 'Favoris' },
  { key: 'contact', href: '/contact', icon: 'phone', label: 'Contact' }
];

function Tabs({ active }: { active?: string }) {
  const { favs } = useApp();
  return (
    <>
      {TABS.map(t => (
        <Link key={t.key} href={t.href} className={t.key === active ? 'is-on' : ''}>
          <Icon name={t.icon} />
          <span>{t.label}</span>
          {t.key === 'favoris' && favs.length > 0 && <b className="tabbar__badge">{favs.length}</b>}
        </Link>
      ))}
    </>
  );
}

function ActiveTabs() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const first = pathname.split('/')[1] || 'home';
  const active = first === 'biens' ? (sp.get('view') === 'map' ? 'map' : 'biens') : first;
  return <Tabs active={active} />;
}

export function TabBar() {
  const pathname = usePathname();
  // la fiche d'un bien a sa propre barre d'action
  if (/^\/biens\/[^/]+/.test(pathname)) return null;
  return (
    <nav className="tabbar" aria-label="Navigation mobile">
      <Suspense fallback={<Tabs />}><ActiveTabs /></Suspense>
    </nav>
  );
}
