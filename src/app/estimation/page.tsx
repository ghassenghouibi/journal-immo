import type { Metadata } from 'next';
import { Estimation, PageHero, Process } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Estimation gratuite',
  description: 'Faites estimer gratuitement votre appartement, villa ou terrain à Sousse par un conseiller du quartier.'
};

export default function EstimationPage() {
  return (
    <>
      <PageHero eyebrow="Estimation gratuite" title={<>Le juste prix, <em>sans détour</em></>} image="villa-white-pool.jpg" />
      <Estimation tight={false} />
      <Process />
    </>
  );
}
