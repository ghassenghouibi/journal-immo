import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { agency, properties, quartiers } from '@/lib/data';
import { img, nf } from '@/lib/utils';
import { ContactForm, EstimationForm } from '../Forms';
import { Icon, type IconName } from '../Icon';
import { AgencyMap, PropertiesMap, QuartiersMap } from '../map/Maps';
import { Counter } from '../Motion';
import { PropertyCard } from '../PropertyCard';
import { SectionHead } from '../SectionHead';

export { SectionHead };

export function PageHero({ eyebrow, title, image, sub }: { eyebrow: string; title: ReactNode; image: string; sub?: string }) {
  return (
    <section className="phero">
      <Image src={img(image)} alt="" fill priority sizes="100vw" className="phero__img" />
      <div className="container phero__inner">
        <span className="eyebrow eyebrow--light">{eyebrow}</span>
        <h1 className="h1">{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
    </section>
  );
}

export function Stats() {
  return (
    <section className="stats">
      <div className="container stats__grid">
        <div className="reveal"><Counter to={12} /><span>ans à Sousse</span></div>
        <div className="reveal"><Counter to={480} suffix="+" /><span>biens vendus ou loués</span></div>
        <div className="reveal"><Counter to={9} /><span>quartiers couverts</span></div>
        <div className="reveal"><Counter to={4.9} decimals={1} /><span>note moyenne clients</span></div>
      </div>
    </section>
  );
}

export function Featured() {
  const list = properties.filter(p => p.badge).slice(0, 6);
  return (
    <section className="section">
      <div className="container">
        <SectionHead eyebrow="Sélection" title={<>Nos biens <em>à la une</em></>} link={{ href: '/biens', label: 'Voir tous les biens' }} />
        <div className="rail reveal">{list.map(p => <PropertyCard key={p.id} p={p} />)}</div>
      </div>
    </section>
  );
}

const FACTS: { i: IconName; t: string; d: string }[] = [
  { i: 'waves', t: 'Méditerranée toute l’année', d: 'Plages de Boujaafar, Khezama, Hammam Sousse et Chott Meriem.' },
  { i: 'school', t: 'Pôle universitaire et médical', d: 'Université de Sousse, CHU Sahloul et Farhat Hached.' },
  { i: 'bus', t: 'Bien reliée', d: 'Autoroute A1 vers Tunis (~1h45), train, métro du Sahel, aéroport de Monastir à 20 min.' },
  { i: 'star', t: 'Patrimoine vivant', d: 'Ribat, Grande Mosquée, souks et musée archéologique.' }
];

export function SousseIntro({ full = false }: { full?: boolean }) {
  return (
    <section className="section section--sand" id="sousse">
      <div className="container sousse">
        <div className="sousse__media reveal">
          <Image src={img('beach.jpg')} alt="Plage méditerranéenne à Sousse" fill sizes="(min-width: 900px) 50vw, 100vw" />
          <div className="sousse__stamp"><span>35°49′ N</span><span>10°38′ E</span></div>
        </div>
        <div className="sousse__text reveal">
          <span className="eyebrow">Sousse, Tunisie</span>
          <h2 className="h2">Vivre dans <em>la Perle du Sahel</em></h2>
          <p className="lead">Troisième ville de Tunisie, Sousse conjugue patrimoine, mer et dynamisme. Sa médina, classée au patrimoine mondial de l’UNESCO, veille sur 15 km de plages qui s’étirent de Boujaafar jusqu’à Port El Kantaoui.</p>
          <ul className="facts">
            {FACTS.map(f => <li key={f.t}><Icon name={f.i} /><span><b>{f.t}</b>{f.d}</span></li>)}
          </ul>
          {!full && <Link className="btn btn--dark" href="/sousse">Découvrir les quartiers <Icon name="arrow" /></Link>}
        </div>
      </div>
    </section>
  );
}

export function Quartiers() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead eyebrow="Quartiers" title={<>Trouver <em>son</em> Sousse</>} />
        <p className="muted reveal sec-sub">Prix moyens au m² donnés à titre indicatif (appartements). Touchez un quartier pour voir les biens disponibles.</p>
        <div className="rail rail--q reveal">
          {quartiers.map(q => {
            const n = properties.filter(p => p.quartier === q.id).length;
            return (
              <Link key={q.id} className="qcard" href={`/biens?q=${encodeURIComponent(q.id)}`}>
                <Image src={img(q.img)} alt="" fill sizes="(min-width: 1000px) 400px, 84vw" />
                <span className="qcard__body">
                  <b>{q.id}</b>
                  <span>{q.pitch}</span>
                  <small>~ {nf.format(q.m2)} DT/m² · {n} bien{n > 1 ? 's' : ''}</small>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function MapTeaser() {
  return (
    <section className="section section--tight">
      <div className="container">
        <SectionHead eyebrow="Carte" title={<>Tous nos biens, <em>quartier par quartier</em></>} link={{ href: '/biens?view=map', label: 'Ouvrir la carte' }} />
        <div className="reveal"><PropertiesMap className="map--teaser" /></div>
      </div>
    </section>
  );
}

export function QuartiersMapSection() {
  return (
    <section className="section section--tight">
      <div className="container">
        <SectionHead eyebrow="Repères" title={<>Les quartiers <em>sur la carte</em></>} />
        <div className="reveal"><QuartiersMap className="map--teaser" /></div>
      </div>
    </section>
  );
}

const SERVICES: { i: IconName; t: string; d: string }[] = [
  { i: 'key', t: 'Vente', d: 'Estimation au prix du marché, photos professionnelles, diffusion ciblée et accompagnement jusqu’au contrat chez le notaire.' },
  { i: 'home', t: 'Achat & recherche', d: 'Nous cherchons pour vous, visitons avant vous et vérifions titre foncier, permis et charges.' },
  { i: 'door', t: 'Location & gestion', d: 'Sélection des locataires, état des lieux, encaissement des loyers et suivi technique de votre bien.' },
  { i: 'globe', t: 'Tunisiens à l’étranger', d: 'Visites vidéo, procuration, suivi à distance : achetez ou gérez votre bien depuis l’Europe ou le Golfe en toute sérénité.' }
];

export function Services({ full = false }: { full?: boolean }) {
  return (
    <section className="section section--dark" id="services">
      <div className="container">
        <SectionHead eyebrow="Savoir-faire" title={<>Une agence, <em>tout l’immobilier</em></>} link={full ? undefined : { href: '/services', label: 'Nos services' }} />
        <div className="services">
          {SERVICES.map((s, i) => (
            <div key={s.t} className="service reveal" style={{ '--d': `${i * 80}ms` } as CSSProperties}>
              <span className="service__ic"><Icon name={s.i} /></span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  ['Premier échange', 'On définit ensemble votre projet, votre budget et vos quartiers.'],
  ['Sélection & visites', 'Des biens vérifiés, visités physiquement ou en vidéo.'],
  ['Offre & compromis', 'Négociation, vérification juridique, promesse de vente.'],
  ['Signature', 'Contrat, enregistrement et remise des clés — on reste joignables après.']
];

export function Process() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead eyebrow="Méthode" title={<>Comment <em>nous travaillons</em></>} />
        <ol className="steps">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="reveal" style={{ '--d': `${i * 80}ms` } as CSSProperties}>
              <b>0{i + 1}</b><h3>{t}</h3><p>{d}</p>
            </li>
          ))}
        </ol>
        <div className="note reveal">
          <Icon name="globe" />
          <p><b>Acquéreur étranger ?</b> En Tunisie, l’achat d’un bien par un non-résident nécessite en principe une autorisation du gouverneur. Nous vous accompagnons dans les démarches avec nos notaires partenaires.</p>
        </div>
      </div>
    </section>
  );
}

const QUOTES = [
  ['« Nous habitions à Lyon et avons acheté notre appartement à Khezama sans prendre l’avion avant la signature. Visites vidéo impeccables. »', 'Sonia & Mehdi', 'Acheteurs, Khezama'],
  ['« Villa vendue en sept semaines au prix estimé. Un vrai suivi, des retours après chaque visite. »', 'Hichem B.', 'Vendeur, Hammam Sousse'],
  ['« La gestion locative nous fait gagner un temps fou : loyers, entretien, tout est géré. »', 'Leïla M.', 'Propriétaire, Sahloul']
];

export function Testimonials() {
  return (
    <section className="section section--sand">
      <div className="container">
        <SectionHead eyebrow="Avis" title={<>Ils nous ont <em>fait confiance</em></>} />
        <div className="rail rail--quotes reveal">
          {QUOTES.map(([q, n, r]) => (
            <figure key={n} className="quote">
              <div className="stars">{[0, 1, 2, 3, 4].map(i => <Icon key={i} name="star" />)}</div>
              <blockquote>{q}</blockquote>
              <figcaption><b>{n}</b><span>{r}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Estimation({ tight = true }: { tight?: boolean }) {
  return (
    <section className={`section ${tight ? 'section--tight' : ''}`} id="estimation">
      <div className="container">
        <div className="estim reveal">
          <div className="estim__text">
            <span className="eyebrow eyebrow--light">Estimation offerte</span>
            <h2 className="h2">Combien vaut <em>votre bien</em> ?</h2>
            <p>Un conseiller du quartier vous rappelle sous 24 h avec une estimation argumentée, basée sur les ventes récentes à Sousse.</p>
            <ul className="checks">
              <li><Icon name="check" />Gratuit et sans engagement</li>
              <li><Icon name="check" />Visite sur place ou en vidéo</li>
              <li><Icon name="check" />Rapport écrit sous 72 h</li>
            </ul>
          </div>
          <EstimationForm />
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container contact">
        <div className="contact__info reveal">
          <span className="eyebrow">Contact</span>
          <h2 className="h2">Passez nous voir <em>à Sousse</em></h2>
          <ul className="contact__list">
            <li><Icon name="pin" /><span><b>Adresse</b>{agency.address}</span></li>
            <li><Icon name="phone" /><span><b>Téléphone</b><a href={agency.phoneHref}>{agency.phone}</a></span></li>
            <li><Icon name="mail" /><span><b>E-mail</b><a href={`mailto:${agency.email}`}>{agency.email}</a></span></li>
            <li><Icon name="clock" /><span><b>Horaires</b>{agency.hours}</span></li>
          </ul>
          <div className="contact__btns">
            <a className="btn btn--primary" href={agency.phoneHref}><Icon name="phone" />Appeler</a>
            <a className="btn btn--wa" href={agency.whatsapp} target="_blank" rel="noopener"><Icon name="chat" />WhatsApp</a>
          </div>
          <AgencyMap />
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
