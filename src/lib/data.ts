/* Journal Immobilier — données de démonstration (biens fictifs, positions indicatives) */
import type { IconName } from '@/components/Icon';

export type Transaction = 'vente' | 'location';
export type PropertyType = 'Appartement' | 'Villa' | 'Studio' | 'Duplex' | 'Local commercial';
export type AgentId = 'yt' | 'kb' | 'ag';
export type CategoryId = 'ecole' | 'sante' | 'commerce' | 'plage' | 'transport' | 'loisirs';

export interface Property {
  id: string;
  transaction: Transaction;
  type: PropertyType;
  badge: string | null;
  title: string;
  quartier: string;
  price: number;
  surface: number;
  terrain?: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  floor?: number;
  year: number;
  lat: number;
  lng: number;
  agent: AgentId;
  images: string[];
  features: string[];
  description: string;
}

export interface Quartier { id: string; img: string; m2: number; lat: number; lng: number; pitch: string }
export interface Poi { c: CategoryId; n: string; lat: number; lng: number }

export const PROPERTY_TYPES: PropertyType[] = ['Appartement', 'Villa', 'Duplex', 'Studio', 'Local commercial'];

export const agency = {
  name: 'Journal Immobilier',
  city: 'Sousse',
  address: 'Avenue Hédi Chaker, 4000 Sousse, Tunisie',
  phone: '+216 73 000 000',
  phoneHref: 'tel:+21673000000',
  whatsapp: 'https://wa.me/21673000000',
  email: 'contact@journal-immobilier.tn',
  hours: 'Lun – Sam · 9h00 – 19h00',
  lat: 35.8318,
  lng: 10.6305
};

export const agents: Record<AgentId, { name: string; role: string; initials: string }> = {
  yt: { name: 'Yasmine Trabelsi', role: 'Conseillère · Corniche & Khezama', initials: 'YT' },
  kb: { name: 'Karim Ben Salah', role: 'Conseiller · Villas & Kantaoui', initials: 'KB' },
  ag: { name: 'Amira Gharbi', role: 'Location & gestion locative', initials: 'AG' }
};

export const quartiers: Quartier[] = [
  { id: 'Port El Kantaoui', img: 'villa-luxe.jpg', m2: 3800, lat: 35.893, lng: 10.596,
    pitch: 'Marina, golf 36 trous et résidences haut de gamme au nord de Sousse.' },
  { id: 'Boujaafar', img: 'beach.jpg', m2: 3300, lat: 35.833, lng: 10.633,
    pitch: 'La corniche : front de mer, cafés et centre-ville à pied.' },
  { id: 'Khezama', img: 'living-bright.jpg', m2: 2900, lat: 35.846, lng: 10.609,
    pitch: 'Plages, commerces et vie animée — le cœur moderne de Sousse.' },
  { id: 'Sahloul', img: 'building.jpg', m2: 2600, lat: 35.837, lng: 10.590,
    pitch: 'Résidentiel et familial, autour du CHU et des écoles.' },
  { id: 'Hammam Sousse', img: 'villa-palm-pool.jpg', m2: 2500, lat: 35.861, lng: 10.597,
    pitch: 'Villas avec jardin, plages calmes et ambiance de petite ville.' },
  { id: 'Chott Meriem', img: 'villa-white-pool.jpg', m2: 2300, lat: 35.935, lng: 10.561,
    pitch: 'Oliveraies et villas pieds dans l’eau, à 15 min du centre.' },
  { id: 'Médina', img: 'interior-yellow.jpg', m2: 1900, lat: 35.826, lng: 10.637,
    pitch: 'Médina classée UNESCO, ribat et maisons de caractère.' },
  { id: 'Cité Jawhara', img: 'house-modern.jpg', m2: 1800, lat: 35.818, lng: 10.615,
    pitch: 'Central et abordable, idéal premier achat ou investissement.' },
  { id: 'Akouda', img: 'house-dark.jpg', m2: 2000, lat: 35.870, lng: 10.568,
    pitch: 'Calme, terrains généreux, accès direct à l’autoroute A1.' }
];

export const properties: Property[] = [
  {
    id: 'JI-101', transaction: 'vente', type: 'Villa', badge: 'Exclusivité',
    title: 'Villa contemporaine avec piscine', quartier: 'Port El Kantaoui',
    price: 1350000, surface: 320, terrain: 650, rooms: 6, bedrooms: 4, bathrooms: 3, year: 2021,
    lat: 35.8952, lng: 10.5918, agent: 'kb',
    images: ['villa-cube-pool.jpg', 'living-wood.jpg', 'kitchen-1.jpg', 'bedroom-2.jpg', 'living-2.jpg'],
    features: ['Piscine', 'Jardin paysager', 'Garage 2 voitures', 'Climatisation centrale', 'Chauffage au sol', 'Terrasse vue mer', 'Domotique', 'Alarme'],
    description: 'À deux pas de la marina, cette villa d’architecte baigne dans la lumière. Le séjour cathédrale s’ouvre sur la piscine et un jardin méditerranéen planté d’oliviers. Quatre suites dont une parentale avec dressing, une cuisine équipée et une terrasse en rooftop avec vue sur la mer.'
  },
  {
    id: 'JI-102', transaction: 'vente', type: 'Appartement', badge: 'Vue mer',
    title: 'Appartement S+2 face à la mer', quartier: 'Boujaafar',
    price: 420000, surface: 115, rooms: 3, bedrooms: 2, bathrooms: 2, floor: 5, year: 2018,
    lat: 35.8352, lng: 10.6322, agent: 'yt',
    images: ['living-bright.jpg', 'apt-living.jpg', 'bedroom-1.jpg', 'kitchen-1.jpg'],
    features: ['Ascenseur', 'Balcon vue mer', 'Parking sous-sol', 'Climatisation', 'Concierge', 'Cuisine équipée'],
    description: 'Sur la corniche de Boujaafar, un appartement traversant au 5e étage avec un large balcon tourné vers la Méditerranée. Plage, cafés et médina accessibles à pied. Résidence sécurisée avec concierge et place de parking.'
  },
  {
    id: 'JI-103', transaction: 'vente', type: 'Appartement', badge: 'Nouveauté',
    title: 'Appartement S+3 haut standing', quartier: 'Sahloul',
    price: 365000, surface: 140, rooms: 4, bedrooms: 3, bathrooms: 2, floor: 2, year: 2023,
    lat: 35.8388, lng: 10.5872, agent: 'kb',
    images: ['building.jpg', 'living-2.jpg', 'kitchen-1.jpg', 'bedroom-2.jpg'],
    features: ['Résidence neuve', 'Ascenseur', 'Double vitrage', 'Chauffage central', 'Parking', 'Cellier'],
    description: 'Dans une résidence récente de Sahloul, proche du CHU et des écoles, un S+3 familial aux prestations soignées : grand séjour, cuisine ouverte, suite parentale et deux chambres. Idéal pour une famille ou un investissement locatif.'
  },
  {
    id: 'JI-104', transaction: 'location', type: 'Studio', badge: 'Meublé',
    title: 'Studio meublé proche plage', quartier: 'Khezama',
    price: 750, surface: 45, rooms: 1, bedrooms: 1, bathrooms: 1, floor: 3, year: 2015,
    lat: 35.8476, lng: 10.6124, agent: 'ag',
    images: ['interior-yellow.jpg', 'living-plants.jpg', 'kitchen-1.jpg'],
    features: ['Meublé', 'Climatisation', 'Internet fibre', 'Ascenseur', 'Plage à 400 m'],
    description: 'Studio entièrement meublé et lumineux à Khezama Est, à quelques minutes à pied de la plage et des commerces. Parfait pour un étudiant, un jeune actif ou un pied-à-terre.'
  },
  {
    id: 'JI-105', transaction: 'vente', type: 'Villa', badge: 'Coup de cœur',
    title: 'Villa S+4 avec jardin et piscine', quartier: 'Hammam Sousse',
    price: 890000, surface: 260, terrain: 520, rooms: 5, bedrooms: 4, bathrooms: 3, year: 2016,
    lat: 35.8618, lng: 10.5955, agent: 'kb',
    images: ['villa-palm-pool.jpg', 'living-blue.jpg', 'kitchen-1.jpg', 'bedroom-1.jpg'],
    features: ['Piscine', 'Jardin', 'Garage', 'Cuisine équipée', 'Climatisation', 'Puits / citerne'],
    description: 'Villa familiale sur deux niveaux dans un quartier calme de Hammam Sousse. Jardin planté de palmiers, piscine, grand séjour ouvert et quatre chambres à l’étage. Écoles et plage à proximité.'
  },
  {
    id: 'JI-106', transaction: 'vente', type: 'Duplex', badge: null,
    title: 'Duplex S+3 avec terrasse', quartier: 'Cité Jawhara',
    price: 298000, surface: 150, rooms: 4, bedrooms: 3, bathrooms: 2, floor: 3, year: 2012,
    lat: 35.8186, lng: 10.6152, agent: 'yt',
    images: ['house-modern.jpg', 'living-plants.jpg', 'apt-living.jpg', 'bedroom-1.jpg'],
    features: ['Terrasse 40 m²', 'Deux niveaux', 'Parking', 'Climatisation', 'Proche transports'],
    description: 'Un duplex généreux au dernier étage avec une terrasse de 40 m² sans vis-à-vis. Quartier central et vivant, à proximité du stade, de la gare de louages et des écoles.'
  },
  {
    id: 'JI-107', transaction: 'vente', type: 'Villa', badge: 'Pieds dans l’eau',
    title: 'Villa d’exception en bord de mer', quartier: 'Chott Meriem',
    price: 1750000, surface: 380, terrain: 1100, rooms: 7, bedrooms: 5, bathrooms: 4, year: 2019,
    lat: 35.9362, lng: 10.5655, agent: 'kb',
    images: ['villa-luxe.jpg', 'living-wood.jpg', 'bedroom-2.jpg', 'living-2.jpg'],
    features: ['Accès plage privé', 'Piscine à débordement', 'Pool house', 'Oliveraie', 'Garage 3 voitures', 'Appartement gardien'],
    description: 'Rare sur le marché : une villa contemporaine directement sur la plage de Chott Meriem, au milieu d’une oliveraie centenaire. Volumes spectaculaires, cinq suites, piscine à débordement face à la mer.'
  },
  {
    id: 'JI-108', transaction: 'vente', type: 'Appartement', badge: 'Nouveauté',
    title: 'Appartement S+1 neuf', quartier: 'Khezama',
    price: 215000, surface: 78, rooms: 2, bedrooms: 1, bathrooms: 1, floor: 1, year: 2024,
    lat: 35.8432, lng: 10.6018, agent: 'yt',
    images: ['apt-living.jpg', 'kitchen-1.jpg', 'bedroom-1.jpg'],
    features: ['Neuf', 'Ascenseur', 'Balcon', 'Parking', 'Climatisation'],
    description: 'Dans une résidence livrée en 2024 à Khezama Ouest, un S+1 bien agencé avec balcon et parking. Bonne rentabilité locative grâce à la proximité de la zone touristique et des universités.'
  },
  {
    id: 'JI-109', transaction: 'location', type: 'Local commercial', badge: null,
    title: 'Plateau de bureaux en centre-ville', quartier: 'Boujaafar',
    price: 2800, surface: 180, rooms: 5, bedrooms: 0, bathrooms: 2, floor: 1, year: 2010,
    lat: 35.8296, lng: 10.6328, agent: 'ag',
    images: ['office.jpg', 'living-2.jpg'],
    features: ['Open space', '4 bureaux fermés', 'Climatisation', 'Fibre optique', 'Ascenseur'],
    description: 'Plateau de bureaux rénové à proximité de l’avenue Habib Bourguiba : open space, quatre bureaux fermés et salle de réunion. Visibilité et accès faciles, gare à 5 minutes à pied.'
  },
  {
    id: 'JI-110', transaction: 'location', type: 'Villa', badge: 'Exclusivité',
    title: 'Villa S+4 au golf d’El Kantaoui', quartier: 'Port El Kantaoui',
    price: 4500, surface: 280, terrain: 600, rooms: 5, bedrooms: 4, bathrooms: 3, year: 2014,
    lat: 35.8968, lng: 10.5862, agent: 'ag',
    images: ['villa-terrace-pool.jpg', 'living-wood.jpg', 'bedroom-2.jpg', 'kitchen-1.jpg'],
    features: ['Piscine', 'Meublée', 'Jardin entretenu', 'Vue golf', 'Gardien'],
    description: 'Villa meublée en bordure du golf d’El Kantaoui, louée à l’année. Grande terrasse avec piscine, quatre chambres, jardin entretenu et gardiennage. Marina à quelques minutes.'
  },
  {
    id: 'JI-111', transaction: 'location', type: 'Appartement', badge: 'Meublé',
    title: 'Appartement S+2 meublé', quartier: 'Sahloul',
    price: 1300, surface: 98, rooms: 3, bedrooms: 2, bathrooms: 1, floor: 4, year: 2017,
    lat: 35.8334, lng: 10.5946, agent: 'ag',
    images: ['living-blue.jpg', 'bedroom-1.jpg', 'kitchen-1.jpg'],
    features: ['Meublé', 'Ascenseur', 'Climatisation', 'Parking', 'Proche CHU Sahloul'],
    description: 'Appartement meublé et soigné à Sahloul, à quelques minutes du CHU et de la faculté. Deux chambres, séjour lumineux, cuisine équipée. Disponible immédiatement.'
  },
  {
    id: 'JI-112', transaction: 'vente', type: 'Villa', badge: null,
    title: 'Villa moderne S+4 au calme', quartier: 'Akouda',
    price: 980000, surface: 290, terrain: 800, rooms: 5, bedrooms: 4, bathrooms: 3, year: 2022,
    lat: 35.8702, lng: 10.5694, agent: 'kb',
    images: ['villa-modern-pool.jpg', 'house-dark.jpg', 'living-2.jpg', 'bedroom-2.jpg'],
    features: ['Piscine', 'Panneaux solaires', 'Garage', 'Jardin', 'Accès autoroute A1'],
    description: 'Villa récente aux lignes épurées sur un terrain de 800 m² à Akouda. Panneaux solaires, piscine et grandes baies vitrées. À 10 minutes de Sousse et à proximité immédiate de l’autoroute.'
  }
];

/* Points d’intérêt — positions indicatives */
export const categories: Record<CategoryId, { label: string; short: string; icon: IconName; color: string }> = {
  ecole:     { label: 'Écoles & universités', short: 'Écoles',     icon: 'school', color: '#0772BA' },
  sante:     { label: 'Santé',                short: 'Santé',      icon: 'health', color: '#D64545' },
  commerce:  { label: 'Commerces',            short: 'Commerces',  icon: 'cart',   color: '#C98A1B' },
  plage:     { label: 'Plages & mer',         short: 'Plages',     icon: 'waves',  color: '#139FA8' },
  transport: { label: 'Transports',           short: 'Transports', icon: 'bus',    color: '#5B4FC4' },
  loisirs:   { label: 'Culture & loisirs',    short: 'Loisirs',    icon: 'star',   color: '#2F8F4E' }
};

export const pois: Poi[] = [
  // Écoles & universités
  { c: 'ecole', n: 'Lycée pilote de Sousse', lat: 35.8232, lng: 10.6062 },
  { c: 'ecole', n: 'École primaire Khezama', lat: 35.8462, lng: 10.6081 },
  { c: 'ecole', n: 'Collège Sahloul', lat: 35.8352, lng: 10.5905 },
  { c: 'ecole', n: 'Faculté de médecine de Sousse', lat: 35.8318, lng: 10.6150 },
  { c: 'ecole', n: 'École internationale (cursus français)', lat: 35.8885, lng: 10.5948 },
  { c: 'ecole', n: 'École primaire Hammam Sousse', lat: 35.8642, lng: 10.6004 },
  { c: 'ecole', n: 'ISITCom Hammam Sousse', lat: 35.8592, lng: 10.5925 },
  { c: 'ecole', n: 'Jardin d’enfants Chott Meriem', lat: 35.9318, lng: 10.5598 },
  { c: 'ecole', n: 'École primaire Akouda', lat: 35.8716, lng: 10.5652 },
  { c: 'ecole', n: 'Lycée Jawhara', lat: 35.8168, lng: 10.6182 },
  { c: 'ecole', n: 'Crèche Les Petits Dauphins', lat: 35.8402, lng: 10.6290 },
  // Santé
  { c: 'sante', n: 'CHU Sahloul', lat: 35.8362, lng: 10.5918 },
  { c: 'sante', n: 'CHU Farhat Hached', lat: 35.8302, lng: 10.6262 },
  { c: 'sante', n: 'Clinique Les Oliviers', lat: 35.8412, lng: 10.6042 },
  { c: 'sante', n: 'Pharmacie de la Marina', lat: 35.8922, lng: 10.5962 },
  { c: 'sante', n: 'Polyclinique Hammam Sousse', lat: 35.8602, lng: 10.6002 },
  { c: 'sante', n: 'Pharmacie Chott Meriem', lat: 35.9335, lng: 10.5615 },
  { c: 'sante', n: 'Centre médical Akouda', lat: 35.8695, lng: 10.5668 },
  // Commerces
  { c: 'commerce', n: 'Mall of Sousse', lat: 35.8762, lng: 10.5772 },
  { c: 'commerce', n: 'Hypermarché Sousse Nord', lat: 35.8482, lng: 10.5962 },
  { c: 'commerce', n: 'Monoprix Khezama', lat: 35.8456, lng: 10.6102 },
  { c: 'commerce', n: 'Marché central', lat: 35.8268, lng: 10.6355 },
  { c: 'commerce', n: 'Souks de la médina', lat: 35.8255, lng: 10.6375 },
  { c: 'commerce', n: 'Marché de Chott Meriem', lat: 35.9342, lng: 10.5608 },
  { c: 'commerce', n: 'Supérette Sahloul', lat: 35.8372, lng: 10.5880 },
  { c: 'commerce', n: 'Galerie commerciale El Kantaoui', lat: 35.8935, lng: 10.5985 },
  // Plages
  { c: 'plage', n: 'Plage de Boujaafar', lat: 35.8346, lng: 10.6382 },
  { c: 'plage', n: 'Plage de Khezama', lat: 35.8502, lng: 10.6182 },
  { c: 'plage', n: 'Plage de Hammam Sousse', lat: 35.8642, lng: 10.6102 },
  { c: 'plage', n: 'Marina de Port El Kantaoui', lat: 35.8932, lng: 10.6012 },
  { c: 'plage', n: 'Plage de Chott Meriem', lat: 35.9372, lng: 10.5702 },
  // Transports
  { c: 'transport', n: 'Gare de Sousse Bab Jedid', lat: 35.8236, lng: 10.6390 },
  { c: 'transport', n: 'Gare Sousse Ville (Bab Bhar)', lat: 35.8282, lng: 10.6393 },
  { c: 'transport', n: 'Station de louages', lat: 35.8182, lng: 10.6292 },
  { c: 'transport', n: 'Arrêt bus Sahloul', lat: 35.8372, lng: 10.5935 },
  { c: 'transport', n: 'Arrêt bus Khezama', lat: 35.8448, lng: 10.6072 },
  { c: 'transport', n: 'Arrêt bus Hammam Sousse', lat: 35.8622, lng: 10.5982 },
  { c: 'transport', n: 'Autoroute A1 – échangeur Sousse Nord', lat: 35.8635, lng: 10.5555 },
  { c: 'transport', n: 'Aéroport Monastir Habib-Bourguiba', lat: 35.7581, lng: 10.7547 },
  // Culture & loisirs
  { c: 'loisirs', n: 'Ribat de Sousse', lat: 35.8276, lng: 10.6385 },
  { c: 'loisirs', n: 'Musée archéologique (Kasbah)', lat: 35.8232, lng: 10.6345 },
  { c: 'loisirs', n: 'Golf d’El Kantaoui', lat: 35.8952, lng: 10.5848 },
  { c: 'loisirs', n: 'Parc d’attractions El Kantaoui', lat: 35.8882, lng: 10.6002 },
  { c: 'loisirs', n: 'Stade olympique de Sousse', lat: 35.8286, lng: 10.6202 },
  { c: 'loisirs', n: 'Promenade de la corniche', lat: 35.8402, lng: 10.6322 }
];

export const getProperty = (id: string) => properties.find(p => p.id === id);
