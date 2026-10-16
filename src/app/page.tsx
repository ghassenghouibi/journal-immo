import Image from 'next/image';
import { SearchBox } from '@/components/SearchBox';
import { Contact, Estimation, Featured, MapTeaser, Services, SousseIntro, Stats, Testimonials } from '@/components/sections';
import { img } from '@/lib/utils';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <Image className="hero__img" src={img('villa-luxe.jpg')} alt="Villa avec piscine à Sousse" fill priority sizes="100vw" />
        <div className="container hero__inner">
          <span className="eyebrow eyebrow--light hero__eyebrow">Agence immobilière · Sousse, Tunisie</span>
          <h1 className="h1 hero__title">Votre adresse<br />à Sousse, <em>la Perle du Sahel</em></h1>
          <p className="hero__sub">Appartements vue mer, villas avec piscine, maisons de médina : une sélection exigeante, de Boujaafar à Port El Kantaoui.</p>
          <SearchBox />
        </div>
      </section>
      <Stats />
      <Featured />
      <SousseIntro />
      <MapTeaser />
      <Services />
      <Testimonials />
      <Estimation />
      <Contact />
    </>
  );
}
