import Link from 'next/link';
import { Icon } from '@/components/Icon';

export default function NotFound() {
  return (
    <section className="section page-top">
      <div className="container empty">
        <Icon name="home" />
        <h3>Page introuvable</h3>
        <p>Ce bien n’est plus disponible ou l’adresse est incorrecte.</p>
        <Link className="btn btn--primary" href="/biens">Voir nos biens</Link>
      </div>
    </section>
  );
}
