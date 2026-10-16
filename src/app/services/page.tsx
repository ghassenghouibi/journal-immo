import type { Metadata } from 'next';
import { Estimation, PageHero, Process, Services, Testimonials } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Nos services',
  description: 'Vente, achat, location, gestion locative et accompagnement des Tunisiens résidant à l’étranger à Sousse.'
};

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Nos services" title={<>Vendre, acheter, louer, <em>gérer</em></>} image="living-wood.jpg"
        sub="Une équipe locale, des méthodes rigoureuses et une présence quotidienne sur le terrain à Sousse." />
      <Services full />
      <Process />
      <Testimonials />
      <Estimation />
    </>
  );
}
