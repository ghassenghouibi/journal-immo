'use client';

import { useState, type FormEvent } from 'react';
import { quartiers } from '@/lib/data';
import { nf } from '@/lib/utils';
import { useApp } from './Providers';

/** Les formulaires sont en démonstration : ils confirment l'envoi sans contacter de serveur. */
function useDemoSubmit(message: string, after?: () => void) {
  const { toast } = useApp();
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.reset();
    after?.();
    toast(message);
  };
}

const TYPE_FACTOR: Record<string, number> = { Villa: 1.15, Terrain: 0.35 };

export function EstimationForm() {
  const [type, setType] = useState('Appartement');
  const [q, setQ] = useState(quartiers[0].id);
  const [surface, setSurface] = useState('');
  const onSubmit = useDemoSubmit('Merci ! Un conseiller vous rappelle sous 24 h.', () => setSurface(''));

  const m2 = quartiers.find(x => x.id === q)?.m2;
  const base = +surface && m2 ? +surface * m2 * (TYPE_FACTOR[type] ?? 1) : 0;
  const round = (n: number) => nf.format(Math.round(n / 1000) * 1000);

  return (
    <form className="form estim__form" onSubmit={onSubmit}>
      <div className="form__row">
        <label className="field"><span>Type de bien</span>
          <select name="type" value={type} onChange={e => setType(e.target.value)}>
            {['Appartement', 'Villa', 'Duplex', 'Terrain', 'Local commercial'].map(t => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="field"><span>Quartier</span>
          <select name="q" value={q} onChange={e => setQ(e.target.value)}>
            {quartiers.map(x => <option key={x.id}>{x.id}</option>)}
            <option>Autre</option>
          </select>
        </label>
      </div>
      <div className="form__row">
        <label className="field"><span>Surface (m²)</span>
          <input name="surface" type="number" inputMode="numeric" min={10} placeholder="120" required value={surface} onChange={e => setSurface(e.target.value)} />
        </label>
        <label className="field"><span>Chambres</span>
          <select name="ch" defaultValue="S+2">
            {['S+0', 'S+1', 'S+2', 'S+3', 'S+4', 'S+5 et +'].map(x => <option key={x}>{x}</option>)}
          </select>
        </label>
      </div>
      <label className="field"><span>Nom</span><input name="name" autoComplete="name" placeholder="Votre nom" required /></label>
      <label className="field"><span>Téléphone</span><input name="tel" type="tel" autoComplete="tel" inputMode="tel" placeholder="+216 …" required /></label>
      {base > 0 && (
        <div className="estim__live">
          <small>Première fourchette indicative</small>
          <b>{round(base * 0.9)} – {round(base * 1.1)} DT</b>
        </div>
      )}
      <button className="btn btn--primary btn--block" type="submit">Recevoir mon estimation</button>
    </form>
  );
}

export function ContactForm() {
  const onSubmit = useDemoSubmit('Message envoyé — à très vite !');
  return (
    <form className="form contact__form reveal" onSubmit={onSubmit}>
      <h3>Écrivez-nous</h3>
      <div className="seg seg--light" role="radiogroup" aria-label="Motif">
        {['Acheter', 'Vendre', 'Louer'].map((m, i) => (
          <label key={m}><input type="radio" name="motif" value={m} defaultChecked={i === 0} /><span>{m}</span></label>
        ))}
      </div>
      <label className="field"><span>Nom</span><input name="name" autoComplete="name" required /></label>
      <div className="form__row">
        <label className="field"><span>Téléphone</span><input name="tel" type="tel" inputMode="tel" autoComplete="tel" required /></label>
        <label className="field"><span>E-mail</span><input name="email" type="email" autoComplete="email" /></label>
      </div>
      <label className="field"><span>Message</span><textarea name="msg" rows={4} placeholder="Votre projet en quelques mots…" /></label>
      <button className="btn btn--primary btn--block" type="submit">Envoyer</button>
      <p className="muted small">Réponse sous 24 h ouvrées.</p>
    </form>
  );
}
