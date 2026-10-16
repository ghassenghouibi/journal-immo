import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Cormorant_Garamond, Manrope, Oswald } from 'next/font/google';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { IconSprite } from '@/components/Icon';
import { RevealObserver } from '@/components/Motion';
import { Providers } from '@/components/Providers';
import { TabBar } from '@/components/TabBar';
import { agency } from '@/lib/data';
import { SITE_URL } from '@/lib/site';

const oswald = Oswald({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-oswald' });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-manrope' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], style: ['italic'], variable: '--font-cormorant' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Journal Immobilier — Agence immobilière à Sousse, Tunisie',
    template: '%s — Journal Immobilier'
  },
  description: 'Journal Immobilier, votre agence immobilière à Sousse : achat, vente, location et gestion de biens à Port El Kantaoui, Khezama, Sahloul, Boujaafar, Hammam Sousse et Chott Meriem.',
  openGraph: {
    type: 'website',
    locale: 'fr_TN',
    siteName: 'Journal Immobilier',
    images: [{ url: '/img/villa-luxe.jpg', width: 1400, height: 933 }]
  },
  icons: { apple: '/favicon.svg' }
};

export const viewport: Viewport = {
  themeColor: '#0772BA',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: agency.name,
  url: SITE_URL,
  telephone: agency.phone,
  email: agency.email,
  address: { '@type': 'PostalAddress', streetAddress: 'Avenue Hédi Chaker', postalCode: '4000', addressLocality: 'Sousse', addressCountry: 'TN' },
  geo: { '@type': 'GeoCoordinates', latitude: agency.lat, longitude: agency.lng },
  openingHours: 'Mo-Sa 09:00-19:00',
  areaServed: 'Sousse'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${oswald.variable} ${manrope.variable} ${cormorant.variable}`}>
      <body>
        <IconSprite />
        <a className="skip" href="#main">Aller au contenu</a>
        <Providers>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <TabBar />
          <RevealObserver />
        </Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
