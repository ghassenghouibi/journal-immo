import Link from 'next/link';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-dark.png" alt="Journal Immobilier" className="footer__logo" width={348} height={164} />
          <p>Agence immobilière indépendante à Sousse depuis 2012. Achat, vente, location et gestion de biens sur toute la Perle du Sahel.</p>
        </div>
        <div>
          <h4>Biens</h4>
          <Link href="/biens?t=vente">Acheter</Link>
          <Link href="/biens?t=location">Louer</Link>
          <Link href="/biens?type=Villa">Villas</Link>
          <Link href="/biens?type=Appartement">Appartements</Link>
        </div>
        <div>
          <h4>Quartiers</h4>
          <Link href="/biens?q=Port%20El%20Kantaoui">Port El Kantaoui</Link>
          <Link href="/biens?q=Khezama">Khezama</Link>
          <Link href="/biens?q=Sahloul">Sahloul</Link>
          <Link href="/biens?q=Boujaafar">Boujaafar</Link>
        </div>
        <div>
          <h4>Agence</h4>
          <Link href="/services">Services</Link>
          <Link href="/estimation">Estimation gratuite</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/charte">Charte graphique</Link>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Journal Immobilier · Sousse, Tunisie</span>
        <span>Biens et données présentés à titre de démonstration.</span>
      </div>
    </footer>
  );
}
