'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Property } from '@/lib/data';
import { Icon } from '../Icon';
import { useApp } from '../Providers';

function nextOpenDays(count: number) {
  const days: Date[] = [];
  const d = new Date();
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) days.push(new Date(d)); // agence fermée le dimanche
  }
  return days;
}

function VisitSheet({ p, onClose }: { p: Property; onClose: () => void }) {
  const { toast } = useApp();
  const days = useMemo(() => nextOpenDays(6), []);
  useEffect(() => {
    document.body.classList.add('no-scroll');
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('no-scroll'); document.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return (
    <div className="lightbox lightbox--sheet open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <form
        className="visit form"
        role="dialog"
        aria-modal="true"
        aria-label="Demander une visite"
        onSubmit={e => { e.preventDefault(); onClose(); toast('Demande envoyée — votre conseiller vous confirme le créneau.'); }}
      >
        <div className="filters__head">
          <b>Demander une visite</b>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer"><Icon name="x" /></button>
        </div>
        <p className="muted small">{p.title} · Réf. {p.id}</p>
        <div className="field"><span>Jour</span>
          <div className="days">
            {days.map((x, i) => (
              <label key={i}>
                <input type="radio" name="jour" value={x.toLocaleDateString('fr-CA')} defaultChecked={i === 0} />
                <span>
                  <small>{x.toLocaleDateString('fr-FR', { weekday: 'short' })}</small>
                  <b>{x.getDate()}</b>
                  <small>{x.toLocaleDateString('fr-FR', { month: 'short' })}</small>
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="field"><span>Créneau</span>
          <div className="pills">
            {['9h – 12h', '12h – 15h', '15h – 19h', 'Vidéo'].map((x, i) => (
              <label key={x}><input type="radio" name="slot" value={x} defaultChecked={i === 0} /><span>{x}</span></label>
            ))}
          </div>
        </div>
        <label className="field"><span>Nom</span><input name="name" autoComplete="name" required /></label>
        <label className="field"><span>Téléphone</span><input name="tel" type="tel" inputMode="tel" autoComplete="tel" required /></label>
        <button className="btn btn--primary btn--block" type="submit">Confirmer la demande</button>
      </form>
    </div>
  );
}

export function VisitButton({ p, className, children }: { p: Property; className: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>{children}</button>
      {open && <VisitSheet p={p} onClose={() => setOpen(false)} />}
    </>
  );
}
