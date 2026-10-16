'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { agency } from '@/lib/data';
import { Icon } from './Icon';

const HERO_ROUTES = ['/', '/sousse', '/services', '/estimation'];
const LINKS = [
  { href: '/biens?t=vente', key: 'vente', label: 'Acheter' },
  { href: '/biens?t=location', key: 'location', label: 'Louer' },
  { href: '/sousse', key: 'sousse', label: 'Sousse' },
  { href: '/services', key: 'services', label: 'Services' },
  { href: '/contact', key: 'contact', label: 'Contact' }
];

function NavLinks({ active }: { active?: string | null }) {
  return <>{LINKS.map(l => <Link key={l.key} href={l.href} className={l.key === active ? 'is-on' : ''}>{l.label}</Link>)}</>;
}
function ActiveNav() {
  const pathname = usePathname();
  const sp = useSearchParams();
  return <NavLinks active={pathname === '/biens' ? sp.get('t') : pathname.split('/')[1]} />;
}

/** Nom de route utilisé par le CSS (barre d'onglets, pied de page). */
export const routeName = (pathname: string) => {
  const [first, second] = pathname.split('/').filter(Boolean);
  if (!first) return 'home';
  return first === 'biens' && second ? 'bien' : first;
};

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const solid = !HERO_ROUTES.includes(pathname) || scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    document.body.dataset.route = routeName(pathname);
  }, [pathname]);

  useEffect(() => { document.body.classList.toggle('menu-open', open); }, [open]);

  return (
    <>
      <header className={`header ${solid ? 'is-solid' : ''}`}>
        <div className="container header__inner">
          <Link href="/" className="brand" aria-label="Journal Immobilier — accueil">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand__logo brand__logo--light" src="/logo.png" alt="Journal Immobilier" width={348} height={164} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand__logo brand__logo--dark" src="/logo-dark.png" alt="" aria-hidden="true" width={348} height={164} />
          </Link>
          <nav className="nav" aria-label="Navigation principale">
            <Suspense fallback={<NavLinks />}><ActiveNav /></Suspense>
          </nav>
          <div className="header__actions">
            <a className="header__phone" href={agency.phoneHref}><Icon name="phone" /><span>{agency.phone}</span></a>
            <Link className="btn btn--primary btn--sm header__cta" href="/estimation">Estimer mon bien</Link>
            <button className="icon-btn menu-btn" onClick={() => setOpen(o => !o)} aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open}>
              <Icon name={open ? 'x' : 'menu'} />
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
        <div className="drawer__inner">
          <nav className="drawer__nav" onClick={() => setOpen(false)}>
            <Link href="/biens?t=vente">Acheter</Link>
            <Link href="/biens?t=location">Louer</Link>
            <Link href="/sousse">Vivre à Sousse</Link>
            <Link href="/services">Nos services</Link>
            <Link href="/estimation">Estimer mon bien</Link>
            <Link href="/favoris">Mes favoris</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="drawer__foot">
            <a className="btn btn--primary btn--block" href={agency.phoneHref}><Icon name="phone" />Appeler l’agence</a>
            <a className="btn btn--ghost btn--block" href={agency.whatsapp} target="_blank" rel="noopener"><Icon name="chat" />WhatsApp</a>
            <p className="muted small">{agency.address} · {agency.hours}</p>
          </div>
        </div>
      </div>
    </>
  );
}
