/* Journal Immobilier — application (routeur hash, vues, cartes) */
(function () {
  'use strict';

  const { agency, agents, quartiers, properties, categories, pois } = JI;
  const app = document.getElementById('app');
  const header = document.getElementById('header');
  const maps = [];

  /* ---------- Utilitaires ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const icon = (n, cls = '') => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const nf = new Intl.NumberFormat('fr-FR');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const img = f => `assets/img/${f}`;

  const price = p => p.transaction === 'location'
    ? `${nf.format(p.price)} DT<small>/mois</small>`
    : `${nf.format(p.price)} DT`;
  const priceShort = p => {
    if (p.transaction === 'location') return `${nf.format(p.price)} DT`;
    if (p.price >= 1e6) return `${(p.price / 1e6).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} M DT`;
    return `${Math.round(p.price / 1000)} k DT`;
  };
  const roomsLabel = p => p.type === 'Local commercial' ? `${p.rooms} pièces` : `S+${p.bedrooms}`;

  function distanceKm(a, b) {
    const R = 6371, rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function distLabel(km) {
    // distance à vol d'oiseau majorée de 25 % pour approcher le trajet réel
    const road = km * 1.25;
    const d = road < 1 ? `${Math.round(road * 1000 / 10) * 10} m` : `${road.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km`;
    if (road <= 2) return { d, t: `${Math.max(1, Math.round(road / 5 * 60))} min`, mode: 'walk' };
    return { d, t: `${Math.max(2, Math.round(road / 35 * 60))} min`, mode: 'car' };
  }
  function nearby(p, perCat = 3) {
    const out = {};
    Object.keys(categories).forEach(c => {
      out[c] = pois.filter(x => x.c === c)
        .map(x => ({ ...x, km: distanceKm(p, x) }))
        .sort((a, b) => a.km - b.km)
        .slice(0, perCat);
    });
    return out;
  }

  /* ---------- Favoris (stockage local, optionnel) ---------- */
  const favs = {
    get() { try { return JSON.parse(localStorage.getItem('ji_favs') || '[]'); } catch (e) { return []; } },
    set(v) { try { localStorage.setItem('ji_favs', JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } },
    has(id) { return this.get().includes(id); },
    toggle(id) {
      const v = this.get(), i = v.indexOf(id);
      i >= 0 ? v.splice(i, 1) : v.push(id);
      this.set(v); updateFavBadge();
      return i < 0;
    }
  };
  function updateFavBadge() {
    const n = favs.get().length, b = $('#favBadge');
    b.hidden = !n; b.textContent = n;
  }

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------- Cartes Leaflet ---------- */
  function makeMap(el, opts = {}) {
    if (typeof L === 'undefined') { el.innerHTML = '<p class="map-fallback">Carte indisponible hors connexion.</p>'; return null; }
    const map = L.map(el, { scrollWheelZoom: false, zoomControl: false, attributionControl: true, ...opts });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    maps.push(map);
    return map;
  }
  const pricePin = (p, active) => L.divIcon({
    className: '', iconSize: null,
    html: `<div class="pin ${active ? 'pin--active' : ''}" data-id="${p.id}">${priceShort(p)}</div>`
  });
  const homePin = () => L.divIcon({
    className: '', iconSize: [44, 44], iconAnchor: [22, 44],
    html: `<div class="home-pin">${icon('home')}</div>`
  });
  const poiPin = c => L.divIcon({
    className: '', iconSize: [30, 30], iconAnchor: [15, 15],
    html: `<div class="poi-pin" style="--c:${categories[c].color}">${icon(categories[c].icon)}</div>`
  });
  const popupCard = p => `
    <a class="map-card" href="#/bien/${p.id}">
      <img src="${img(p.images[0])}" alt="">
      <span><b>${price(p)}</b><em>${esc(p.title)}</em><small>${esc(p.quartier)} · ${p.surface} m²</small></span>
    </a>`;

  /* ---------- Composants ---------- */
  function card(p, opts = {}) {
    const fav = favs.has(p.id);
    return `
    <article class="card ${opts.cls || ''}" data-id="${p.id}">
      <a href="#/bien/${p.id}" class="card__media">
        <img src="${img(p.images[0])}" alt="${esc(p.title)}" loading="lazy">
        <span class="card__tags">
          <span class="tag tag--${p.transaction}">${p.transaction === 'vente' ? 'À vendre' : 'À louer'}</span>
          ${p.badge ? `<span class="tag">${esc(p.badge)}</span>` : ''}
        </span>
      </a>
      <button class="fav ${fav ? 'is-on' : ''}" data-fav="${p.id}" aria-label="Ajouter aux favoris" aria-pressed="${fav}">${icon('heart')}</button>
      <a href="#/bien/${p.id}" class="card__body">
        <span class="card__loc">${icon('pin')}${esc(p.quartier)}, Sousse</span>
        <h3 class="card__title">${esc(p.title)}</h3>
        <span class="specs">
          <span>${icon('door')}${roomsLabel(p)}</span>
          <span>${icon('area')}${p.surface} m²</span>
          ${p.bathrooms ? `<span>${icon('bath')}${p.bathrooms}</span>` : ''}
        </span>
        <span class="card__price">${price(p)}</span>
      </a>
    </article>`;
  }

  function sectionHead(eyebrow, title, link) {
    return `
      <div class="sec-head reveal">
        <div>
          <span class="eyebrow">${eyebrow}</span>
          <h2 class="h2">${title}</h2>
        </div>
        ${link ? `<a class="link-arrow" href="${link.href}">${link.label}${icon('arrow')}</a>` : ''}
      </div>`;
  }

  function searchBox() {
    const opts = quartiers.map(q => `<option>${q.id}</option>`).join('');
    return `
    <form class="search" id="heroSearch" autocomplete="off">
      <div class="seg" role="tablist">
        <label><input type="radio" name="t" value="vente" checked><span>Acheter</span></label>
        <label><input type="radio" name="t" value="location"><span>Louer</span></label>
      </div>
      <div class="search__fields">
        <label class="field"><span>Quartier</span>
          <select name="q"><option value="">Tout Sousse</option>${opts}</select></label>
        <label class="field"><span>Type de bien</span>
          <select name="type"><option value="">Tous types</option><option>Appartement</option><option>Villa</option><option>Duplex</option><option>Studio</option><option>Local commercial</option></select></label>
        <button class="btn btn--primary search__btn" type="submit">${icon('search')}<span>Rechercher</span></button>
      </div>
    </form>`;
  }

  /* ---------- Sections ---------- */
  function secFeatured() {
    const list = properties.filter(p => p.badge).slice(0, 6);
    return `
    <section class="section">
      <div class="container">
        ${sectionHead('Sélection', 'Nos biens <em>à la une</em>', { href: '#/biens', label: 'Voir tous les biens' })}
        <div class="rail reveal">${list.map(p => card(p)).join('')}</div>
      </div>
    </section>`;
  }

  function secStats() {
    return `
    <section class="stats">
      <div class="container stats__grid">
        <div class="reveal"><b data-count="12">0</b><span>ans à Sousse</span></div>
        <div class="reveal"><b data-count="480" data-suffix="+">0</b><span>biens vendus ou loués</span></div>
        <div class="reveal"><b data-count="9">0</b><span>quartiers couverts</span></div>
        <div class="reveal"><b data-count="4.9" data-dec="1">0</b><span>note moyenne clients</span></div>
      </div>
    </section>`;
  }

  function secSousse(full) {
    return `
    <section class="section section--sand" id="sousse">
      <div class="container sousse">
        <div class="sousse__media reveal">
          <img src="${img('beach.jpg')}" alt="Plage méditerranéenne à Sousse" loading="lazy">
          <div class="sousse__stamp"><span>35°49′ N</span><span>10°38′ E</span></div>
        </div>
        <div class="sousse__text reveal">
          <span class="eyebrow">Sousse, Tunisie</span>
          <h2 class="h2">Vivre dans <em>la Perle du Sahel</em></h2>
          <p class="lead">Troisième ville de Tunisie, Sousse conjugue patrimoine, mer et dynamisme. Sa médina, classée au patrimoine mondial de l’UNESCO, veille sur 15 km de plages qui s’étirent de Boujaafar jusqu’à Port El Kantaoui.</p>
          <ul class="facts">
            <li>${icon('waves')}<span><b>Méditerranée toute l’année</b>Plages de Boujaafar, Khezama, Hammam Sousse et Chott Meriem.</span></li>
            <li>${icon('school')}<span><b>Pôle universitaire et médical</b>Université de Sousse, CHU Sahloul et Farhat Hached.</span></li>
            <li>${icon('bus')}<span><b>Bien reliée</b>Autoroute A1 vers Tunis (~1h45), train, métro du Sahel, aéroport de Monastir à 20 min.</span></li>
            <li>${icon('star')}<span><b>Patrimoine vivant</b>Ribat, Grande Mosquée, souks et musée archéologique.</span></li>
          </ul>
          ${full ? '' : `<a class="btn btn--dark" href="#/sousse">Découvrir les quartiers ${icon('arrow')}</a>`}
        </div>
      </div>
    </section>`;
  }

  function secQuartiers() {
    return `
    <section class="section">
      <div class="container">
        ${sectionHead('Quartiers', 'Trouver <em>son</em> Sousse', null)}
        <p class="muted reveal sec-sub">Prix moyens au m² donnés à titre indicatif (appartements, 2026). Touchez un quartier pour voir les biens disponibles.</p>
        <div class="rail rail--q reveal">
          ${quartiers.map(q => {
            const n = properties.filter(p => p.quartier === q.id).length;
            return `
            <a class="qcard" href="#/biens?q=${encodeURIComponent(q.id)}">
              <img src="${img(q.img)}" alt="" loading="lazy">
              <span class="qcard__body">
                <b>${q.id}</b>
                <span>${q.pitch}</span>
                <small>~ ${nf.format(q.m2)} DT/m² · ${n} bien${n > 1 ? 's' : ''}</small>
              </span>
            </a>`;
          }).join('')}
        </div>
      </div>
    </section>`;
  }

  function secMapTeaser() {
    return `
    <section class="section section--tight">
      <div class="container">
        ${sectionHead('Carte', 'Tous nos biens, <em>quartier par quartier</em>', { href: '#/biens?view=map', label: 'Ouvrir la carte' })}
        <div class="map map--teaser reveal" id="teaserMap"></div>
      </div>
    </section>`;
  }

  const services = [
    { i: 'key', t: 'Vente', d: 'Estimation au prix du marché, photos professionnelles, diffusion ciblée et accompagnement jusqu’au contrat chez le notaire.' },
    { i: 'home', t: 'Achat & recherche', d: 'Nous cherchons pour vous, visitons avant vous et vérifions titre foncier, permis et charges.' },
    { i: 'door', t: 'Location & gestion', d: 'Sélection des locataires, état des lieux, encaissement des loyers et suivi technique de votre bien.' },
    { i: 'globe', t: 'Tunisiens à l’étranger', d: 'Visites vidéo, procuration, suivi à distance : achetez ou gérez votre bien depuis l’Europe ou le Golfe en toute sérénité.' }
  ];
  function secServices(full) {
    return `
    <section class="section section--dark" id="services">
      <div class="container">
        ${sectionHead('Savoir-faire', 'Une agence, <em>tout l’immobilier</em>', full ? null : { href: '#/services', label: 'Nos services' })}
        <div class="services">
          ${services.map((s, i) => `
            <div class="service reveal" style="--d:${i * 80}ms">
              <span class="service__ic">${icon(s.i)}</span>
              <h3>${s.t}</h3>
              <p>${s.d}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function secProcess() {
    const steps = [
      ['Premier échange', 'On définit ensemble votre projet, votre budget et vos quartiers.'],
      ['Sélection & visites', 'Des biens vérifiés, visités physiquement ou en vidéo.'],
      ['Offre & compromis', 'Négociation, vérification juridique, promesse de vente.'],
      ['Signature', 'Contrat, enregistrement et remise des clés — on reste joignables après.']
    ];
    return `
    <section class="section">
      <div class="container">
        ${sectionHead('Méthode', 'Comment <em>nous travaillons</em>', null)}
        <ol class="steps">
          ${steps.map((s, i) => `<li class="reveal" style="--d:${i * 80}ms"><b>0${i + 1}</b><h3>${s[0]}</h3><p>${s[1]}</p></li>`).join('')}
        </ol>
        <div class="note reveal">${icon('globe')}<p><b>Acquéreur étranger ?</b> En Tunisie, l’achat d’un bien par un non-résident nécessite en principe une autorisation du gouverneur. Nous vous accompagnons dans les démarches avec nos notaires partenaires.</p></div>
      </div>
    </section>`;
  }

  function secTestimonials() {
    const t = [
      ['« Nous habitions à Lyon et avons acheté notre appartement à Khezama sans prendre l’avion avant la signature. Visites vidéo impeccables. »', 'Sonia & Mehdi', 'Acheteurs, Khezama'],
      ['« Villa vendue en sept semaines au prix estimé. Un vrai suivi, des retours après chaque visite. »', 'Hichem B.', 'Vendeur, Hammam Sousse'],
      ['« La gestion locative nous fait gagner un temps fou : loyers, entretien, tout est géré. »', 'Leïla M.', 'Propriétaire, Sahloul']
    ];
    return `
    <section class="section section--sand">
      <div class="container">
        ${sectionHead('Avis', 'Ils nous ont <em>fait confiance</em>', null)}
        <div class="rail rail--quotes reveal">
          ${t.map(x => `<figure class="quote"><div class="stars">${icon('star').repeat(5)}</div><blockquote>${x[0]}</blockquote><figcaption><b>${x[1]}</b><span>${x[2]}</span></figcaption></figure>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function secEstimation(standalone) {
    return `
    <section class="section ${standalone ? '' : 'section--tight'}" id="estimation">
      <div class="container">
        <div class="estim reveal">
          <div class="estim__text">
            <span class="eyebrow eyebrow--light">Estimation offerte</span>
            <h2 class="h2">Combien vaut <em>votre bien</em> ?</h2>
            <p>Un conseiller du quartier vous rappelle sous 24 h avec une estimation argumentée, basée sur les ventes récentes à Sousse.</p>
            <ul class="checks">
              <li>${icon('check')}Gratuit et sans engagement</li>
              <li>${icon('check')}Visite sur place ou en vidéo</li>
              <li>${icon('check')}Rapport écrit sous 72 h</li>
            </ul>
          </div>
          <form class="form estim__form" data-form="estimation">
            <div class="form__row">
              <label class="field"><span>Type de bien</span><select name="type" required><option>Appartement</option><option>Villa</option><option>Duplex</option><option>Terrain</option><option>Local commercial</option></select></label>
              <label class="field"><span>Quartier</span><select name="q">${quartiers.map(q => `<option>${q.id}</option>`).join('')}<option>Autre</option></select></label>
            </div>
            <div class="form__row">
              <label class="field"><span>Surface (m²)</span><input name="surface" type="number" inputmode="numeric" min="10" placeholder="120" required></label>
              <label class="field"><span>Chambres</span><select name="ch"><option>S+0</option><option>S+1</option><option selected>S+2</option><option>S+3</option><option>S+4</option><option>S+5 et +</option></select></label>
            </div>
            <label class="field"><span>Nom</span><input name="name" autocomplete="name" placeholder="Votre nom" required></label>
            <label class="field"><span>Téléphone</span><input name="tel" type="tel" autocomplete="tel" inputmode="tel" placeholder="+216 …" required></label>
            <div class="estim__live" id="estimLive" hidden></div>
            <button class="btn btn--primary btn--block" type="submit">Recevoir mon estimation</button>
          </form>
        </div>
      </div>
    </section>`;
  }

  function secContact() {
    return `
    <section class="section" id="contact">
      <div class="container contact">
        <div class="contact__info reveal">
          <span class="eyebrow">Contact</span>
          <h2 class="h2">Passez nous voir <em>à Sousse</em></h2>
          <ul class="contact__list">
            <li>${icon('pin')}<span><b>Adresse</b>${agency.address}</span></li>
            <li>${icon('phone')}<span><b>Téléphone</b><a href="${agency.phoneHref}">${agency.phone}</a></span></li>
            <li>${icon('mail')}<span><b>E-mail</b><a href="mailto:${agency.email}">${agency.email}</a></span></li>
            <li>${icon('clock')}<span><b>Horaires</b>${agency.hours}</span></li>
          </ul>
          <div class="contact__btns">
            <a class="btn btn--primary" href="${agency.phoneHref}">${icon('phone')}Appeler</a>
            <a class="btn btn--wa" href="${agency.whatsapp}" target="_blank" rel="noopener">${icon('chat')}WhatsApp</a>
          </div>
          <div class="map map--contact" id="contactMap"></div>
        </div>
        <form class="form contact__form reveal" data-form="contact">
          <h3>Écrivez-nous</h3>
          <div class="seg seg--light">
            <label><input type="radio" name="motif" value="Acheter" checked><span>Acheter</span></label>
            <label><input type="radio" name="motif" value="Vendre"><span>Vendre</span></label>
            <label><input type="radio" name="motif" value="Louer"><span>Louer</span></label>
          </div>
          <label class="field"><span>Nom</span><input name="name" autocomplete="name" required></label>
          <div class="form__row">
            <label class="field"><span>Téléphone</span><input name="tel" type="tel" inputmode="tel" autocomplete="tel" required></label>
            <label class="field"><span>E-mail</span><input name="email" type="email" autocomplete="email"></label>
          </div>
          <label class="field"><span>Message</span><textarea name="msg" rows="4" placeholder="Votre projet en quelques mots…"></textarea></label>
          <button class="btn btn--primary btn--block" type="submit">Envoyer</button>
          <p class="muted small">Réponse sous 24 h ouvrées.</p>
        </form>
      </div>
    </section>`;
  }

  function pageHero(eyebrow, title, image, sub) {
    return `
    <section class="phero">
      <img src="${img(image)}" alt="" class="phero__img">
      <div class="container phero__inner">
        <span class="eyebrow eyebrow--light">${eyebrow}</span>
        <h1 class="h1">${title}</h1>
        ${sub ? `<p>${sub}</p>` : ''}
      </div>
    </section>`;
  }

  /* ---------- Vues ---------- */
  function viewHome() {
    app.innerHTML = `
    <section class="hero">
      <img class="hero__img" src="${img('villa-luxe.jpg')}" alt="Villa avec piscine à Sousse">
      <div class="container hero__inner">
        <span class="eyebrow eyebrow--light hero__eyebrow">Agence immobilière · Sousse, Tunisie</span>
        <h1 class="h1 hero__title">Votre adresse<br>à Sousse, <em>la Perle du Sahel</em></h1>
        <p class="hero__sub">Appartements vue mer, villas avec piscine, maisons de médina : une sélection exigeante, de Boujaafar à Port El Kantaoui.</p>
        ${searchBox()}
      </div>
    </section>
    ${secStats()}
    ${secFeatured()}
    ${secSousse(false)}
    ${secMapTeaser()}
    ${secServices(false)}
    ${secTestimonials()}
    ${secEstimation(false)}
    ${secContact()}`;

    bindSearch();
    const m = makeMap($('#teaserMap'));
    if (m) {
      const b = [];
      properties.forEach(p => {
        L.marker([p.lat, p.lng], { icon: pricePin(p) }).addTo(m).bindPopup(popupCard(p), { closeButton: false, offset: [0, -8] });
        b.push([p.lat, p.lng]);
      });
      m.fitBounds(b, { padding: [30, 30] });
    }
    initContactMap();
  }

  function viewSousse() {
    app.innerHTML = `
      ${pageHero('Guide de quartier', 'Vivre à <em>Sousse</em>', 'beach.jpg', 'Mer, médina, universités et douceur de vivre : nos conseillers vous présentent la ville quartier par quartier.')}
      ${secSousse(true)}
      ${secQuartiers()}
      <section class="section section--tight">
        <div class="container">
          ${sectionHead('Repères', 'Les quartiers <em>sur la carte</em>', null)}
          <div class="map map--teaser reveal" id="quartierMap"></div>
        </div>
      </section>
      ${secEstimation(false)}`;
    const m = makeMap($('#quartierMap'));
    if (m) {
      const b = quartiers.map(q => {
        L.marker([q.lat, q.lng], { icon: L.divIcon({ className: '', iconSize: null, html: `<a class="qpin" href="#/biens?q=${encodeURIComponent(q.id)}">${q.id}</a>` }) }).addTo(m);
        return [q.lat, q.lng];
      });
      m.fitBounds(b, { padding: [40, 40] });
    }
  }

  function viewServices() {
    app.innerHTML = `
      ${pageHero('Nos services', 'Vendre, acheter, louer, <em>gérer</em>', 'living-wood.jpg', 'Une équipe locale, des méthodes rigoureuses et une présence quotidienne sur le terrain à Sousse.')}
      ${secServices(true)}
      ${secProcess()}
      ${secTestimonials()}
      ${secEstimation(false)}`;
  }

  function viewEstimation() {
    app.innerHTML = `${pageHero('Estimation gratuite', 'Le juste prix, <em>sans détour</em>', 'villa-white-pool.jpg', null)}${secEstimation(true)}${secProcess()}`;
  }

  function viewContact() {
    app.innerHTML = `${secContact()}`;
    initContactMap();
  }

  function initContactMap() {
    const el = $('#contactMap'); if (!el) return;
    const m = makeMap(el, { dragging: !L.Browser.mobile });
    if (!m) return;
    m.setView([agency.lat, agency.lng], 15);
    L.marker([agency.lat, agency.lng], { icon: homePin() }).addTo(m).bindPopup('<b>Journal Immobilier</b><br>' + agency.address);
  }

  /* --- Liste des biens --- */
  function parseQuery(qs) {
    const o = {}; new URLSearchParams(qs).forEach((v, k) => { o[k] = v; }); return o;
  }
  function filterProps(f) {
    let r = properties.filter(p =>
      (!f.t || p.transaction === f.t) &&
      (!f.type || p.type === f.type) &&
      (!f.q || p.quartier === f.q) &&
      (!f.max || p.price <= +f.max) &&
      (!f.ch || p.bedrooms >= +f.ch) &&
      (!f.s || p.surface >= +f.s));
    const s = f.sort || 'reco';
    if (s === 'asc') r.sort((a, b) => a.price - b.price);
    if (s === 'desc') r.sort((a, b) => b.price - a.price);
    if (s === 'surface') r.sort((a, b) => b.surface - a.surface);
    return r;
  }
  function budgetOptions(t, sel) {
    const v = t === 'location'
      ? [1000, 1500, 3000, 5000]
      : [250000, 400000, 700000, 1000000, 1500000];
    return `<option value="">Sans limite</option>` + v.map(x => `<option value="${x}" ${+sel === x ? 'selected' : ''}>≤ ${nf.format(x)} DT${t === 'location' ? '/mois' : ''}</option>`).join('');
  }

  function viewListings(f) {
    const res = filterProps(f);
    const active = ['type', 'q', 'max', 'ch', 's'].filter(k => f[k]).length;
    const title = f.t === 'vente' ? 'Biens à vendre' : f.t === 'location' ? 'Biens à louer' : 'Tous nos biens';
    app.innerHTML = `
    <div class="listing ${f.view === 'map' ? 'show-map' : ''}">
      <div class="toolbar">
        <div class="container toolbar__inner">
          <div class="seg seg--light seg--sm" id="tSeg">
            <label><input type="radio" name="t" value="" ${!f.t ? 'checked' : ''}><span>Tous</span></label>
            <label><input type="radio" name="t" value="vente" ${f.t === 'vente' ? 'checked' : ''}><span>Acheter</span></label>
            <label><input type="radio" name="t" value="location" ${f.t === 'location' ? 'checked' : ''}><span>Louer</span></label>
          </div>
          <button class="chip-btn" id="openFilters">${icon('filter')}Filtres${active ? `<b>${active}</b>` : ''}</button>
          <form class="filters" id="filters">
            <div class="filters__head"><b>Filtres</b><button type="button" class="icon-btn" data-close aria-label="Fermer">${icon('x')}</button></div>
            <label class="field"><span>Quartier</span><select name="q"><option value="">Tout Sousse</option>${quartiers.map(q => `<option ${f.q === q.id ? 'selected' : ''}>${q.id}</option>`).join('')}</select></label>
            <label class="field"><span>Type</span><select name="type"><option value="">Tous types</option>${['Appartement', 'Villa', 'Duplex', 'Studio', 'Local commercial'].map(x => `<option ${f.type === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
            <label class="field"><span>Budget max</span><select name="max">${budgetOptions(f.t, f.max)}</select></label>
            <div class="field"><span>Chambres min.</span>
              <div class="pills">${['', '1', '2', '3', '4'].map(x => `<label><input type="radio" name="ch" value="${x}" ${(f.ch || '') === x ? 'checked' : ''}><span>${x ? x + '+' : 'Tout'}</span></label>`).join('')}</div>
            </div>
            <label class="field"><span>Trier par</span><select name="sort">
              <option value="reco">Recommandés</option>
              <option value="asc" ${f.sort === 'asc' ? 'selected' : ''}>Prix croissant</option>
              <option value="desc" ${f.sort === 'desc' ? 'selected' : ''}>Prix décroissant</option>
              <option value="surface" ${f.sort === 'surface' ? 'selected' : ''}>Surface</option>
            </select></label>
            <div class="filters__foot">
              <button type="button" class="btn btn--ghost" id="resetFilters">Effacer</button>
              <button type="submit" class="btn btn--primary" data-close>Voir ${res.length} bien${res.length > 1 ? 's' : ''}</button>
            </div>
          </form>
        </div>
      </div>
      <div class="sheet-backdrop" data-close></div>
      <div class="listing__body container">
        <div class="listing__list">
          <div class="listing__head">
            <h1 class="h3">${title}${f.q ? ` · ${esc(f.q)}` : ''}</h1>
            <span class="muted">${res.length} résultat${res.length > 1 ? 's' : ''}</span>
          </div>
          ${res.length ? `<div class="grid">${res.map(p => card(p)).join('')}</div>` : `
            <div class="empty">${icon('search')}<h3>Aucun bien ne correspond</h3><p>Élargissez vos critères ou laissez-nous votre recherche : nous avons aussi des biens en off-market.</p><a class="btn btn--primary" href="#/biens">Voir tous les biens</a></div>`}
        </div>
        <div class="listing__map"><div class="map" id="listMap"></div></div>
      </div>
      <button class="float-toggle" id="viewToggle">${f.view === 'map' ? `${icon('list')}Liste` : `${icon('map')}Carte`}</button>
    </div>`;

    const go = patch => {
      const n = { ...f, ...patch };
      Object.keys(n).forEach(k => { if (!n[k] || (k === 'sort' && n[k] === 'reco')) delete n[k]; });
      const qs = new URLSearchParams(n).toString();
      location.hash = '#/biens' + (qs ? '?' + qs : '');
    };

    $$('#tSeg input').forEach(i => i.addEventListener('change', () => go({ t: i.value, max: '' })));
    const sheet = $('#filters'), listing = $('.listing');
    $('#openFilters').addEventListener('click', () => listing.classList.add('filters-open'));
    $$('[data-close]').forEach(b => b.addEventListener('click', () => listing.classList.remove('filters-open')));
    sheet.addEventListener('submit', e => { e.preventDefault(); go(Object.fromEntries(new FormData(sheet))); });
    // sur grand écran, appliquer à chaque changement
    sheet.addEventListener('change', () => { if (matchMedia('(min-width: 900px)').matches) go(Object.fromEntries(new FormData(sheet))); });
    $('#resetFilters').addEventListener('click', () => go({ type: '', q: '', max: '', ch: '', s: '', sort: '' }));
    $('#viewToggle').addEventListener('click', () => go({ view: f.view === 'map' ? '' : 'map' }));

    const m = makeMap($('#listMap'));
    if (!m) return;
    const markers = {};
    const pts = res.length ? res : properties;
    pts.forEach(p => {
      markers[p.id] = L.marker([p.lat, p.lng], { icon: pricePin(p), riseOnHover: true })
        .addTo(m).bindPopup(popupCard(p), { closeButton: false, offset: [0, -8] });
    });
    if (pts.length === 1) m.setView([pts[0].lat, pts[0].lng], 14);
    else m.fitBounds(pts.map(p => [p.lat, p.lng]), { padding: [40, 40] });
    setTimeout(() => m.invalidateSize(), 60);

    $$('.listing .card').forEach(c => {
      const mk = markers[c.dataset.id]; if (!mk) return;
      c.addEventListener('mouseenter', () => { mk.setIcon(pricePin(properties.find(p => p.id === c.dataset.id), true)); mk.setZIndexOffset(1000); });
      c.addEventListener('mouseleave', () => { mk.setIcon(pricePin(properties.find(p => p.id === c.dataset.id))); mk.setZIndexOffset(0); });
    });
  }

  /* --- Fiche bien --- */
  function viewProperty(id) {
    const p = properties.find(x => x.id === id);
    if (!p) return viewNotFound();
    const ag = agents[p.agent];
    const near = nearby(p);
    const fav = favs.has(p.id);
    const similar = properties.filter(x => x.id !== p.id && (x.quartier === p.quartier || x.type === p.type) && x.transaction === p.transaction).slice(0, 3);
    const keyFacts = [
      ['door', roomsLabel(p), 'Typologie'],
      ['area', `${p.surface} m²`, 'Surface'],
      p.terrain ? ['map', `${nf.format(p.terrain)} m²`, 'Terrain'] : null,
      p.bedrooms ? ['bed', p.bedrooms, p.bedrooms > 1 ? 'Chambres' : 'Chambre'] : null,
      ['bath', p.bathrooms, 'Salles d’eau'],
      p.floor != null ? ['building', p.floor === 0 ? 'RDC' : `${p.floor}e`, 'Étage'] : null,
      ['clock', p.year, 'Construction']
    ].filter(Boolean);

    app.innerHTML = `
    <article class="detail">
      <div class="gallery">
        <div class="gallery__track" id="gTrack">
          ${p.images.map((f, i) => `<button class="gallery__item" data-i="${i}" aria-label="Agrandir la photo ${i + 1}"><img src="${img(f)}" alt="${esc(p.title)} — photo ${i + 1}" ${i ? 'loading="lazy"' : ''}></button>`).join('')}
        </div>
        <div class="gallery__bar container">
          <a class="round-btn" href="#/biens" data-back aria-label="Retour">${icon('left')}</a>
          <span class="gallery__right">
            <button class="round-btn" id="shareBtn" aria-label="Partager">${icon('share')}</button>
            <button class="round-btn fav-round ${fav ? 'is-on' : ''}" data-fav="${p.id}" aria-label="Favori" aria-pressed="${fav}">${icon('heart')}</button>
          </span>
        </div>
        <span class="gallery__count" id="gCount">1 / ${p.images.length}</span>
      </div>

      <div class="container detail__grid">
        <div class="detail__main">
          <div class="detail__head">
            <span class="card__tags card__tags--static">
              <span class="tag tag--${p.transaction}">${p.transaction === 'vente' ? 'À vendre' : 'À louer'}</span>
              ${p.badge ? `<span class="tag tag--outline">${esc(p.badge)}</span>` : ''}
              <span class="ref">Réf. ${p.id}</span>
            </span>
            <h1 class="h2 detail__title">${esc(p.title)}</h1>
            <p class="detail__loc">${icon('pin')}${esc(p.quartier)}, Sousse — Tunisie</p>
            <p class="detail__price">${price(p)}</p>
          </div>

          <div class="facts-grid">
            ${keyFacts.map(k => `<div><span>${icon(k[0] === 'building' ? 'home' : k[0])}</span><b>${k[1]}</b><small>${k[2]}</small></div>`).join('')}
          </div>

          <section class="block">
            <h2 class="h3">Le bien</h2>
            <p class="prose">${esc(p.description)}</p>
            <ul class="features">${p.features.map(x => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>
          </section>

          <section class="block" id="proximites">
            <h2 class="h3">Proximités & quartier</h2>
            <p class="muted small">Distances indicatives estimées depuis l’adresse du bien.</p>
            <div class="chips" id="poiChips">
              <button class="chip is-on" data-cat="all">Tout</button>
              ${Object.entries(categories).map(([k, c]) => `<button class="chip" data-cat="${k}" style="--c:${c.color}">${icon(c.icon)}${c.short}</button>`).join('')}
            </div>
            <div class="map map--detail" id="detailMap"></div>
            <div class="near">
              ${Object.entries(near).map(([k, list]) => `
                <div class="near__cat" data-cat="${k}">
                  <h3 style="--c:${categories[k].color}"><span>${icon(categories[k].icon)}</span>${categories[k].label}</h3>
                  <ul>${list.map(x => { const d = distLabel(x.km); return `
                    <li><button data-poi="${esc(x.n)}"><span class="near__name">${esc(x.n)}</span><span class="near__dist">${icon(d.mode)}${d.t}<small>${d.d}</small></span></button></li>`; }).join('')}
                  </ul>
                </div>`).join('')}
            </div>
          </section>

          ${p.transaction === 'vente' ? `
          <section class="block" id="simu">
            <h2 class="h3">${icon('calc')}Simuler mon financement</h2>
            <div class="simu">
              <label class="range"><span>Apport personnel <b id="sApportV"></b></span><input type="range" id="sApport" min="10" max="70" step="5" value="30"></label>
              <label class="range"><span>Durée du crédit <b id="sDureeV"></b></span><input type="range" id="sDuree" min="5" max="25" step="1" value="20"></label>
              <label class="range"><span>Taux annuel <b id="sTauxV"></b></span><input type="range" id="sTaux" min="6" max="12" step="0.25" value="9"></label>
              <div class="simu__out"><small>Mensualité estimée</small><b id="sOut"></b><span id="sLoan" class="muted small"></span></div>
            </div>
            <p class="muted small">Simulation indicative hors assurance et frais. Taux à confirmer auprès de votre banque.</p>
          </section>` : ''}
        </div>

        <aside class="detail__aside">
          <div class="agent-card">
            <p class="agent-card__price">${price(p)}</p>
            <div class="agent">
              <span class="avatar">${ag.initials}</span>
              <span><b>${ag.name}</b><small>${ag.role}</small></span>
            </div>
            <a class="btn btn--primary btn--block" href="${agency.phoneHref}">${icon('phone')}Appeler</a>
            <a class="btn btn--wa btn--block" target="_blank" rel="noopener" href="${agency.whatsapp}?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par le bien ${p.id} – ${p.title}.`)}">${icon('chat')}WhatsApp</a>
            <button class="btn btn--ghost btn--block" data-visit>Demander une visite</button>
          </div>
        </aside>
      </div>

      ${similar.length ? `
      <section class="section section--tight">
        <div class="container">
          ${sectionHead('À découvrir aussi', 'Biens <em>similaires</em>', null)}
          <div class="rail">${similar.map(x => card(x)).join('')}</div>
        </div>
      </section>` : ''}

      <div class="cta-bar">
        <a class="btn btn--ghost" href="${agency.phoneHref}" aria-label="Appeler">${icon('phone')}</a>
        <a class="btn btn--wa" target="_blank" rel="noopener" href="${agency.whatsapp}?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par le bien ${p.id}.`)}">${icon('chat')}WhatsApp</a>
        <button class="btn btn--primary" data-visit>Visiter</button>
      </div>
    </article>`;

    // Galerie
    const track = $('#gTrack'), count = $('#gCount');
    track.addEventListener('scroll', () => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      count.textContent = `${Math.min(i + 1, p.images.length)} / ${p.images.length}`;
    }, { passive: true });
    $$('.gallery__item').forEach(b => b.addEventListener('click', () => openLightbox(p.images, +b.dataset.i)));
    $('[data-back]').addEventListener('click', e => { if (history.length > 1) { e.preventDefault(); history.back(); } });

    $('#shareBtn').addEventListener('click', async () => {
      const data = { title: p.title, text: `${p.title} — ${p.quartier}, Sousse`, url: location.href };
      try {
        if (navigator.share) await navigator.share(data);
        else { await navigator.clipboard.writeText(location.href); toast('Lien copié'); }
      } catch (e) { /* partage annulé */ }
    });
    $$('[data-visit]').forEach(b => b.addEventListener('click', () => openVisit(p)));

    // Carte des proximités
    const m = makeMap($('#detailMap'), { dragging: !L.Browser.mobile, tap: false });
    if (m) {
      L.circle([p.lat, p.lng], { radius: 1000, color: '#0772BA', weight: 1, dashArray: '4 6', fillOpacity: .04 }).addTo(m);
      L.marker([p.lat, p.lng], { icon: homePin(), zIndexOffset: 1000 }).addTo(m).bindPopup(`<b>${esc(p.title)}</b>`);
      const layers = {}, byName = {};
      Object.entries(near).forEach(([k, list]) => {
        layers[k] = L.layerGroup(list.map(x => {
          const d = distLabel(x.km);
          const mk = L.marker([x.lat, x.lng], { icon: poiPin(k) }).bindPopup(`<b>${esc(x.n)}</b><br><span class="muted">${categories[k].short} · ${d.d} · ${d.t}</span>`, { closeButton: false });
          byName[x.n] = { mk, k };
          return mk;
        })).addTo(m);
      });
      // cadrer sur le bien et les lieux proches (hors aéroport)
      const fitTo = cats => {
        const pts = [[p.lat, p.lng]];
        cats.forEach(k => near[k].forEach(x => { if (x.km < 6) pts.push([x.lat, x.lng]); }));
        m.fitBounds(pts, { padding: [36, 36], maxZoom: 15 });
      };
      fitTo(Object.keys(near));
      $$('#poiChips .chip').forEach(ch => ch.addEventListener('click', () => {
        const cat = ch.dataset.cat;
        $$('#poiChips .chip').forEach(x => x.classList.toggle('is-on', x === ch));
        Object.entries(layers).forEach(([k, l]) => (cat === 'all' || cat === k) ? l.addTo(m) : m.removeLayer(l));
        $$('.near__cat').forEach(n => n.classList.toggle('is-dim', cat !== 'all' && n.dataset.cat !== cat));
        fitTo(cat === 'all' ? Object.keys(near) : [cat]);
      }));
      $$('[data-poi]').forEach(b => b.addEventListener('click', () => {
        const o = byName[b.dataset.poi]; if (!o) return;
        layers[o.k].addTo(m);
        $('#detailMap').scrollIntoView({ behavior: 'smooth', block: 'center' });
        m.setView(o.mk.getLatLng(), Math.max(m.getZoom(), 15)); o.mk.openPopup();
      }));
    }

    // Simulateur
    if (p.transaction === 'vente') {
      const upd = () => {
        const a = +$('#sApport').value, n = +$('#sDuree').value, t = +$('#sTaux').value;
        const loan = p.price * (1 - a / 100), r = t / 100 / 12, N = n * 12;
        const mth = loan * r / (1 - Math.pow(1 + r, -N));
        $('#sApportV').textContent = `${a} % · ${nf.format(Math.round(p.price * a / 100))} DT`;
        $('#sDureeV').textContent = `${n} ans`;
        $('#sTauxV').textContent = `${t.toLocaleString('fr-FR')} %`;
        $('#sOut').textContent = `${nf.format(Math.round(mth))} DT/mois`;
        $('#sLoan').textContent = `Montant emprunté : ${nf.format(Math.round(loan))} DT`;
        $$('#simu input[type=range]').forEach(i => i.style.setProperty('--p', ((i.value - i.min) / (i.max - i.min) * 100) + '%'));
      };
      $$('#simu input').forEach(i => i.addEventListener('input', upd));
      upd();
    }
  }

  function viewFavoris() {
    const list = properties.filter(p => favs.has(p.id));
    app.innerHTML = `
    <section class="section page-top">
      <div class="container">
        ${sectionHead('Ma sélection', 'Mes <em>favoris</em>', null)}
        ${list.length ? `<div class="grid">${list.map(p => card(p)).join('')}</div>` : `
          <div class="empty">${icon('heart')}<h3>Aucun favori pour l’instant</h3><p>Touchez le cœur d’une annonce pour la retrouver ici, même hors connexion.</p><a class="btn btn--primary" href="#/biens">Parcourir les biens</a></div>`}
      </div>
    </section>`;
  }

  function viewNotFound() {
    app.innerHTML = `<section class="section page-top"><div class="container empty">${icon('home')}<h3>Page introuvable</h3><p>Ce bien n’est plus disponible ou l’adresse est incorrecte.</p><a class="btn btn--primary" href="#/biens">Voir nos biens</a></div></section>`;
  }

  /* ---------- Modales ---------- */
  function openLightbox(images, start) {
    const lb = $('#lightbox');
    lb.innerHTML = `
      <button class="round-btn lightbox__close" aria-label="Fermer">${icon('x')}</button>
      <div class="lightbox__track">${images.map(f => `<img src="${img(f)}" alt="">`).join('')}</div>`;
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    const tr = $('.lightbox__track', lb);
    requestAnimationFrame(() => { tr.scrollLeft = start * tr.clientWidth; });
    const close = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.classList.remove('no-scroll'); document.removeEventListener('keydown', onKey); };
    const onKey = e => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') tr.scrollBy({ left: tr.clientWidth, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') tr.scrollBy({ left: -tr.clientWidth, behavior: 'smooth' });
    };
    $('.lightbox__close', lb).addEventListener('click', close);
    document.addEventListener('keydown', onKey);
  }

  function openVisit(p) {
    const lb = $('#lightbox');
    const days = [];
    const d = new Date();
    while (days.length < 6) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) days.push(new Date(d)); }
    lb.innerHTML = `
      <form class="visit form" data-form="visite">
        <div class="filters__head"><b>Demander une visite</b><button type="button" class="icon-btn" data-x aria-label="Fermer">${icon('x')}</button></div>
        <p class="muted small">${esc(p.title)} · Réf. ${p.id}</p>
        <div class="field"><span>Jour</span><div class="days">${days.map((x, i) => `<label><input type="radio" name="jour" value="${x.toISOString().slice(0, 10)}" ${i ? '' : 'checked'}><span><small>${x.toLocaleDateString('fr-FR', { weekday: 'short' })}</small><b>${x.getDate()}</b><small>${x.toLocaleDateString('fr-FR', { month: 'short' })}</small></span></label>`).join('')}</div></div>
        <div class="field"><span>Créneau</span><div class="pills">${['9h – 12h', '12h – 15h', '15h – 19h', 'Vidéo'].map((x, i) => `<label><input type="radio" name="slot" value="${x}" ${i ? '' : 'checked'}><span>${x}</span></label>`).join('')}</div></div>
        <label class="field"><span>Nom</span><input name="name" autocomplete="name" required></label>
        <label class="field"><span>Téléphone</span><input name="tel" type="tel" inputmode="tel" autocomplete="tel" required></label>
        <button class="btn btn--primary btn--block" type="submit">Confirmer la demande</button>
      </form>`;
    lb.classList.add('open', 'lightbox--sheet'); lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    const close = () => { lb.classList.remove('open', 'lightbox--sheet'); lb.setAttribute('aria-hidden', 'true'); document.body.classList.remove('no-scroll'); };
    $('[data-x]', lb).addEventListener('click', close);
    lb.onclick = e => { if (e.target === lb) close(); };
    $('form', lb).addEventListener('submit', e => { e.preventDefault(); close(); toast('Demande envoyée — votre conseiller vous confirme le créneau.'); });
  }

  /* ---------- Comportements communs ---------- */
  function bindSearch() {
    const f = $('#heroSearch'); if (!f) return;
    f.addEventListener('submit', e => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f));
      Object.keys(d).forEach(k => { if (!d[k]) delete d[k]; });
      location.hash = '#/biens?' + new URLSearchParams(d).toString();
    });
  }

  function bindCommon() {
    // Favoris
    $$('[data-fav]').forEach(b => b.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const on = favs.toggle(b.dataset.fav);
      $$(`[data-fav="${b.dataset.fav}"]`).forEach(x => { x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on); });
      toast(on ? 'Ajouté à vos favoris' : 'Retiré de vos favoris');
      if (!on && currentRoute === 'favoris') render();
    }));
    // Formulaires (démonstration, sans envoi serveur)
    $$('form[data-form]').forEach(f => {
      if (f.dataset.form === 'visite') return;
      f.addEventListener('submit', e => {
        e.preventDefault();
        f.reset();
        toast(f.dataset.form === 'estimation' ? 'Merci ! Un conseiller vous rappelle sous 24 h.' : 'Message envoyé — à très vite !');
      });
    });
    // Fourchette d'estimation instantanée
    const ef = $('form[data-form="estimation"]');
    if (ef) {
      const live = $('#estimLive');
      const upd = () => {
        const s = +ef.surface.value, q = quartiers.find(x => x.id === ef.q.value);
        if (!s || !q) { live.hidden = true; return; }
        const k = ef.type.value === 'Villa' ? 1.15 : ef.type.value === 'Terrain' ? 0.35 : 1;
        const base = s * q.m2 * k;
        live.hidden = false;
        live.innerHTML = `<small>Première fourchette indicative</small><b>${nf.format(Math.round(base * 0.9 / 1000) * 1000)} – ${nf.format(Math.round(base * 1.1 / 1000) * 1000)} DT</b>`;
      };
      ['input', 'change'].forEach(ev => ef.addEventListener(ev, upd));
    }
    // Apparition au scroll
    const io = 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches
      ? new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' })
      : null;
    $$('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));
    // Compteurs
    const co = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      co.unobserve(en.target);
      const el = en.target, end = +el.dataset.count, dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '';
      const t0 = performance.now();
      const step = t => {
        const k = Math.min(1, (t - t0) / 1200), v = end * (1 - Math.pow(1 - k, 3));
        el.textContent = v.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (k === 1 ? suf : '');
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    })) : null;
    $$('[data-count]').forEach(el => co ? co.observe(el) : (el.textContent = el.dataset.count + (el.dataset.suffix || '')));
  }

  /* ---------- Routeur ---------- */
  let currentRoute = '';
  function render() {
    maps.splice(0).forEach(m => m.remove());
    const raw = location.hash.replace(/^#/, '') || '/';
    const [path, qs = ''] = raw.split('?');
    const parts = path.split('/').filter(Boolean);
    const r = parts[0] || 'home';
    currentRoute = r;
    document.body.dataset.route = r;

    if (r === 'home') viewHome();
    else if (r === 'biens') viewListings(parseQuery(qs));
    else if (r === 'bien') viewProperty(decodeURIComponent(parts[1] || ''));
    else if (r === 'favoris') viewFavoris();
    else if (r === 'sousse') viewSousse();
    else if (r === 'services') viewServices();
    else if (r === 'estimation') viewEstimation();
    else if (r === 'contact') viewContact();
    else viewNotFound();

    const q = parseQuery(qs);
    const tab = r === 'home' ? 'home' : r === 'biens' ? (q.view === 'map' ? 'map' : 'biens') : r;
    $$('#tabbar a').forEach(a => a.classList.toggle('is-on', a.dataset.tab === tab));
    $$('.nav a').forEach(a => a.classList.toggle('is-on', a.dataset.nav === (r === 'biens' ? q.t : r)));

    bindCommon();
    closeDrawer();
    window.scrollTo(0, 0);
    onScroll();
    const titles = { biens: 'Nos biens', favoris: 'Mes favoris', sousse: 'Vivre à Sousse', services: 'Services', estimation: 'Estimation gratuite', contact: 'Contact' };
    const prop = r === 'bien' && properties.find(p => p.id === parts[1]);
    document.title = (prop ? `${prop.title} · ${prop.quartier}` : titles[r] || 'Agence immobilière à Sousse, Tunisie') + ' — Journal Immobilier';
  }

  /* ---------- En-tête & menu ---------- */
  function onScroll() {
    const overHero = ['home', 'sousse', 'services', 'estimation'].includes(currentRoute);
    header.classList.toggle('is-solid', !overHero || window.scrollY > 40);
  }
  const drawer = $('#drawer'), menuBtn = $('#menuBtn');
  function closeDrawer() {
    drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open');
  }
  menuBtn.addEventListener('click', () => {
    const open = !drawer.classList.contains('open');
    drawer.classList.toggle('open', open); drawer.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('menu-open', open);
  });
  drawer.addEventListener('click', e => { if (e.target === drawer || e.target.closest('a')) closeDrawer(); });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('hashchange', render);
  $('#year').textContent = new Date().getFullYear();
  updateFavBadge();
  render();
})();
