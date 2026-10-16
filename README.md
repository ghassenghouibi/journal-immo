# Journal Immobilier — site de l'agence (Sousse, Tunisie)

Site Next.js (React, App Router, TypeScript), pensé mobile d'abord et prêt pour Vercel.

```sh
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Déploiement sur Vercel

1. Importer le dépôt GitHub sur [vercel.com/new](https://vercel.com/new) : le framework Next.js est détecté automatiquement, aucun réglage n'est nécessaire.
2. Une fois le domaine choisi, ajouter la variable d'environnement `NEXT_PUBLIC_SITE_URL` (ex. `https://journal-immobilier.tn`) pour les balises SEO, le sitemap et le robots.txt.

## Structure

| Chemin | Rôle |
| --- | --- |
| `src/app/` | Pages : accueil, `/biens` (liste + carte + filtres), `/biens/[id]` (fiche générée statiquement), `/sousse`, `/services`, `/estimation`, `/contact`, `/favoris`, `/charte` |
| `src/lib/data.ts` | Biens, quartiers, agents, points d'intérêt (fictifs, positions indicatives) et coordonnées de l'agence |
| `src/lib/utils.ts` | Formatage des prix, distances et proximités, filtres |
| `src/components/` | En-tête, barre d'onglets mobile, cartes de biens, cartes Leaflet, formulaires, sections |
| `src/app/globals.css` | Styles et jetons de la charte (bleu #0772BA, anthracite #1F1E1F, sable #F5F1EA) |
| `public/` | Logos, favicon, photos |

## À faire avant la mise en ligne

- Remplacer téléphone, WhatsApp, e-mail et adresse dans `src/lib/data.ts` (`agency`).
- Remplacer les biens et photos de démonstration.
- Brancher les formulaires (contact, estimation, visite) sur un service d'envoi : ils affichent pour l'instant seulement une confirmation (`src/components/Forms.tsx`, `src/components/property/Visit.tsx`).
- Pour un trafic important, utiliser un fournisseur de tuiles cartographiques dédié plutôt que `tile.openstreetmap.org` (`src/components/map/LeafletMap.tsx`).
