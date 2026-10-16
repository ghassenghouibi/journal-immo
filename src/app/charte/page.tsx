import type { Metadata } from 'next';
import Image from 'next/image';
import { Icon, type IconName } from '@/components/Icon';

export const metadata: Metadata = {
  title: 'Charte graphique',
  robots: { index: false }
};

const COLORS = [
  ['Bleu Journal', '#0772BA', 'RGB 7 114 186', 'Boutons, liens, accents, icônes'],
  ['Bleu profond', '#005687', 'RGB 0 86 135', 'Survol, blocs forts, estimation'],
  ['Anthracite', '#1F1E1F', 'RGB 31 30 31', 'Texte, titres, sections sombres'],
  ['Sable de Sousse', '#F5F1EA', 'RGB 245 241 234', 'Fonds de section, champs'],
  ['Bleu écume', '#E7F1F9', 'RGB 231 241 249', 'Encadrés d’information'],
  ['Blanc', '#FFFFFF', 'RGB 255 255 255', 'Fond principal']
];
const ICONS: IconName[] = ['home', 'search', 'map', 'heart', 'phone', 'pin', 'school', 'waves', 'key', 'area'];
const PHOTOS = ['beach.jpg', 'villa-white-pool.jpg', 'living-wood.jpg', 'living-plants.jpg'];

export default function ChartePage() {
  return (
    <div className="charte page-top">
      <section className="ch-hero">
        <div className="container">
          <span className="eyebrow">Identité visuelle · v1</span>
          <h1 className="h1">Charte <em>graphique</em></h1>
          <p>Dérivée du logo existant : le bleu des toits, l’anthracite du lettrage et une typographie condensée. Nous y ajoutons un sable méditerranéen et une italique élégante pour une image d’agence haut de gamme, ancrée à Sousse.</p>
        </div>
      </section>

      <section className="ch-sec">
        <div className="container">
          <h2 className="h3">01 — Logo</h2>
          <p className="muted">Le logo se compose de trois toits (symbole) et du nom en capitales condensées. Il ne doit jamais être redessiné : utiliser les fichiers fournis.</p>
          <div className="ch-grid ch-grid--3">
            {/* eslint-disable @next/next/no-img-element */}
            <div className="tile"><img className="zone" src="/logo.png" alt="Logo version couleur" /><small>Couleur · fonds clairs · <code>/logo.png</code></small></div>
            <div className="tile tile--dark"><img src="/logo-dark.png" alt="Logo version fond sombre" /><small>Fonds sombres · <code>/logo-dark.png</code></small></div>
            <div className="tile tile--blue"><img className="white-logo" src="/logo.png" alt="Logo monochrome blanc" /><small>Monochrome blanc · sur photo ou bleu</small></div>
          </div>
          <div className="ch-grid ch-grid--2" style={{ marginTop: 16 }}>
            <div className="do"><h4>À faire</h4><ul><li>Zone de protection = hauteur du « J » tout autour (pointillés).</li><li>Taille minimale : 120 px de large à l’écran, 30 mm en print.</li><li>Sur photo : version blanche, avec un voile sombre si nécessaire.</li></ul></div>
            <div className="dont"><h4>À éviter</h4><ul><li>Déformer, incliner ou recolorer le logo.</li><li>Ajouter des ombres, contours ou effets.</li><li>Placer la version couleur sur un fond chargé ou bleu.</li></ul></div>
          </div>
          <div className="ch-grid ch-grid--4" style={{ marginTop: 16 }}>
            <div className="tile tile--sm"><img src="/favicon.svg" alt="Icône d’application" style={{ width: 72 }} /><small>Icône / favicon · <code>favicon.svg</code></small></div>
            {/* eslint-enable @next/next/no-img-element */}
          </div>
        </div>
      </section>

      <section className="ch-sec">
        <div className="container">
          <h2 className="h3">02 — Couleurs</h2>
          <p className="muted">Le bleu est relevé directement sur le logo. Il sert aux actions et aux accents, jamais en grands aplats de texte.</p>
          <div className="ch-grid ch-grid--3">
            {COLORS.map(([name, hex, rgb, use]) => (
              <div key={hex} className="swatch">
                <div className="swatch__c" style={{ background: hex }} />
                <div className="swatch__t"><b>{name}</b><code>{hex} · {rgb}</code><span>{use}</span></div>
              </div>
            ))}
          </div>
          <div className="ratio" aria-label="Proportions d’usage">
            <span style={{ flex: 55, background: '#fff' }}>Blanc 55 %</span>
            <span style={{ flex: 20, background: '#F5F1EA' }}>Sable 20 %</span>
            <span style={{ flex: 15, background: '#1F1E1F', color: '#fff' }}>Anthracite 15 %</span>
            <span style={{ flex: 10, background: '#0772BA', color: '#fff' }}>Bleu 10 %</span>
          </div>
        </div>
      </section>

      <section className="ch-sec">
        <div className="container">
          <h2 className="h3">03 — Typographie</h2>
          <p className="muted">Trois familles, toutes gratuites sur Google Fonts. Oswald reprend le caractère condensé du logo, Manrope assure la lisibilité sur mobile, Cormorant apporte la touche éditoriale.</p>
          <div className="ch-grid ch-grid--3">
            <div className="type"><span className="type__sample" style={{ fontFamily: 'var(--f-display)', fontWeight: 600, textTransform: 'uppercase' }}>Aa</span><b>Oswald 500 / 600</b><span className="muted">Titres, prix, chiffres. Toujours en capitales.</span></div>
            <div className="type"><span className="type__sample" style={{ fontFamily: 'var(--f-body)', fontWeight: 600 }}>Aa</span><b>Manrope 400 – 700</b><span className="muted">Texte courant, boutons, formulaires, sur-titres espacés.</span></div>
            <div className="type"><span className="type__sample" style={{ fontFamily: 'var(--f-accent)', fontStyle: 'italic', fontWeight: 500, color: 'var(--blue)' }}>Aa</span><b>Cormorant Garamond italique</b><span className="muted">Un ou deux mots d’accent dans un titre, citations.</span></div>
          </div>
          <div style={{ marginTop: 32 }}>
            <span className="eyebrow">Sur-titre · Manrope 700 · 12 px · +22 %</span>
            <h3 className="h2">Vivre dans <em>la Perle du Sahel</em></h3>
            <p className="lead" style={{ maxWidth: '56ch' }}>Texte courant en Manrope 16–18 px, interlignage 1,6. Le ton est chaleureux, précis et sans jargon ; on vouvoie toujours le client.</p>
          </div>
        </div>
      </section>

      <section className="ch-sec">
        <div className="container">
          <h2 className="h3">04 — Iconographie & composants</h2>
          <p className="muted">Icônes au trait de 1,8 px, angles arrondis, en anthracite ou en bleu. Boutons en pilule, cartes à coins arrondis de 16 px.</p>
          <div className="icons">{ICONS.map(i => <span key={i}><Icon name={i} /></span>)}</div>
          <div className="comp" style={{ marginTop: 28 }}>
            <span className="btn btn--primary">Action principale</span>
            <span className="btn btn--dark">Secondaire</span>
            <span className="btn btn--ghost">Discrète</span>
            <span className="btn btn--wa"><Icon name="chat" />WhatsApp</span>
            <span className="tag tag--vente">À vendre</span>
            <span className="tag tag--location">À louer</span>
            <span className="tag tag--outline">Exclusivité</span>
          </div>
        </div>
      </section>

      <section className="ch-sec" style={{ borderBottom: 0 }}>
        <div className="container">
          <h2 className="h3">05 — Photographie</h2>
          <p className="muted">Lumière naturelle, horizons dégagés, matières claires. On privilégie la mer, la lumière du Sahel et les volumes ; pas de grand-angle déformant ni de filtres saturés.</p>
          <div className="ch-grid ch-grid--4">
            {PHOTOS.map(f => <div key={f} className="ch-photo"><Image src={`/img/${f}`} alt="" fill sizes="(min-width: 700px) 25vw, 100vw" /></div>)}
          </div>
        </div>
      </section>
    </div>
  );
}
