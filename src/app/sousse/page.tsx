import type { Metadata } from 'next';
import { Estimation, PageHero, Quartiers, QuartiersMapSection, SousseIntro } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Vivre à Sousse — guide des quartiers',
  description: 'Port El Kantaoui, Khezama, Sahloul, Boujaafar, Médina, Hammam Sousse, Chott Meriem : prix au m², ambiance et biens disponibles quartier par quartier.'
};

export default function SoussePage() {
  return (
    <>
      <PageHero eyebrow="Guide de quartier" title={<>Vivre à <em>Sousse</em></>} image="beach.jpg"
        sub="Mer, médina, universités et douceur de vivre : nos conseillers vous présentent la ville quartier par quartier." />
      <SousseIntro full />
      <Quartiers />
      <QuartiersMapSection />
      <Estimation />
    </>
  );
}
