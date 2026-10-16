import type { Metadata } from 'next';
import { Contact } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez l’agence Journal Immobilier à Sousse : téléphone, WhatsApp, e-mail et adresse.'
};

export default function ContactPage() {
  return <div className="page-top-sm"><Contact /></div>;
}
