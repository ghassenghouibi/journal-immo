# Journal Immobilier — site vitrine (Sousse, Tunisie)

Site statique, sans étape de build, pensé mobile d'abord.

```sh
python3 -m http.server 8000   # puis http://localhost:8000
```

- `index.html` : application monopage (routes `#/`, `#/biens`, `#/bien/JI-101`, `#/sousse`, `#/services`, `#/estimation`, `#/contact`, `#/favoris`)
- `charte.html` : charte graphique dérivée du logo
- `assets/js/data.js` : biens, quartiers, agents et points d'intérêt (fictifs, positions indicatives)
- `assets/js/app.js` : routeur, vues, cartes Leaflet (tuiles OpenStreetMap), proximités, simulateur de crédit, favoris
- `assets/css/style.css` : styles et jetons de la charte

À remplacer avant mise en ligne : téléphone / WhatsApp / e-mail / adresse (`data.js` et `index.html`),
biens et photos, et brancher les formulaires sur un service d'envoi (ils affichent seulement une confirmation).
Pour un trafic important, utiliser un fournisseur de tuiles cartographiques dédié plutôt que tile.openstreetmap.org.
