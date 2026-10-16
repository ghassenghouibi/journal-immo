import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Icon, type IconName } from '@/components/Icon';
import { Price, PropertyCard, TransactionTag } from '@/components/PropertyCard';
import { Gallery } from '@/components/property/Gallery';
import { Mortgage } from '@/components/property/Mortgage';
import { Proximites } from '@/components/property/Proximites';
import { VisitButton } from '@/components/property/Visit';
import { SectionHead } from '@/components/SectionHead';
import { agency, agents, getProperty, properties } from '@/lib/data';
import { SITE_URL } from '@/lib/site';
import { img, nf, priceText, roomsLabel } from '@/lib/utils';

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return properties.map(p => ({ id: p.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProperty((await params).id);
  if (!p) return {};
  const title = `${p.title} · ${p.quartier}`;
  const description = `${p.type} ${roomsLabel(p)} de ${p.surface} m² ${p.transaction === 'vente' ? 'à vendre' : 'à louer'} à ${p.quartier}, Sousse — ${priceText(p)}.`;
  return {
    title, description,
    alternates: { canonical: `/biens/${p.id}` },
    openGraph: { title, description, images: [{ url: img(p.images[0]) }] }
  };
}

export default async function PropertyPage({ params }: { params: Params }) {
  const p = getProperty((await params).id);
  if (!p) notFound();

  const ag = agents[p.agent];
  const similar = properties
    .filter(x => x.id !== p.id && x.transaction === p.transaction && (x.quartier === p.quartier || x.type === p.type))
    .slice(0, 3);
  const keyFacts = ([
    ['door', roomsLabel(p), 'Typologie'],
    ['area', `${p.surface} m²`, 'Surface'],
    p.terrain ? ['map', `${nf.format(p.terrain)} m²`, 'Terrain'] : null,
    p.bedrooms ? ['bed', p.bedrooms, p.bedrooms > 1 ? 'Chambres' : 'Chambre'] : null,
    ['bath', p.bathrooms, 'Salles d’eau'],
    p.floor != null ? ['home', p.floor === 0 ? 'RDC' : `${p.floor}e`, 'Étage'] : null,
    ['clock', p.year, 'Construction']
  ] as const).filter(Boolean) as unknown as [IconName, string | number, string][];

  const waText = encodeURIComponent(`Bonjour, je suis intéressé(e) par le bien ${p.id} – ${p.title}.`);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: p.title,
    description: p.description,
    url: `${SITE_URL}/biens/${p.id}`,
    image: p.images.map(f => `${SITE_URL}${img(f)}`),
    offers: { '@type': 'Offer', price: p.price, priceCurrency: 'TND', businessFunction: p.transaction === 'vente' ? 'http://purl.org/goodrelations/v1#Sell' : 'http://purl.org/goodrelations/v1#LeaseOut' },
    contentLocation: { '@type': 'Place', name: `${p.quartier}, Sousse`, geo: { '@type': 'GeoCoordinates', latitude: p.lat, longitude: p.lng } }
  };

  return (
    <article className="detail">
      <Gallery p={p} />

      <div className="container detail__grid">
        <div className="detail__main">
          <div className="detail__head">
            <span className="card__tags card__tags--static">
              <TransactionTag p={p} />
              {p.badge && <span className="tag tag--outline">{p.badge}</span>}
              <span className="ref">Réf. {p.id}</span>
            </span>
            <h1 className="h2 detail__title">{p.title}</h1>
            <p className="detail__loc"><Icon name="pin" />{p.quartier}, Sousse — Tunisie</p>
            <p className="detail__price"><Price p={p} /></p>
          </div>

          <div className="facts-grid">
            {keyFacts.map(([icon, value, label]) => (
              <div key={label}><span><Icon name={icon} /></span><b>{value}</b><small>{label}</small></div>
            ))}
          </div>

          <section className="block">
            <h2 className="h3">Le bien</h2>
            <p className="prose">{p.description}</p>
            <ul className="features">{p.features.map(x => <li key={x}><Icon name="check" />{x}</li>)}</ul>
          </section>

          <Proximites p={p} />
          {p.transaction === 'vente' && <Mortgage price={p.price} />}
        </div>

        <aside className="detail__aside">
          <div className="agent-card">
            <p className="agent-card__price"><Price p={p} /></p>
            <div className="agent">
              <span className="avatar">{ag.initials}</span>
              <span><b>{ag.name}</b><small>{ag.role}</small></span>
            </div>
            <a className="btn btn--primary btn--block" href={agency.phoneHref}><Icon name="phone" />Appeler</a>
            <a className="btn btn--wa btn--block" target="_blank" rel="noopener" href={`${agency.whatsapp}?text=${waText}`}><Icon name="chat" />WhatsApp</a>
            <VisitButton p={p} className="btn btn--ghost btn--block">Demander une visite</VisitButton>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="section section--tight">
          <div className="container">
            <SectionHead eyebrow="À découvrir aussi" title={<>Biens <em>similaires</em></>} />
            <div className="rail">{similar.map(x => <PropertyCard key={x.id} p={x} />)}</div>
          </div>
        </section>
      )}

      <div className="cta-bar">
        <a className="btn btn--ghost" href={agency.phoneHref} aria-label="Appeler"><Icon name="phone" /></a>
        <a className="btn btn--wa" target="_blank" rel="noopener" href={`${agency.whatsapp}?text=${waText}`}><Icon name="chat" />WhatsApp</a>
        <VisitButton p={p} className="btn btn--primary">Visiter</VisitButton>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
