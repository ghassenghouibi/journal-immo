'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import { nf } from '@/lib/utils';
import { Icon } from '../Icon';

function Range({ label, value, display, min, max, step, onChange }: {
  label: string; value: number; display: string; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  return (
    <label className="range">
      <span>{label} <b>{display}</b></span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        style={{ '--p': `${((value - min) / (max - min)) * 100}%` } as CSSProperties}
        onChange={e => onChange(+e.target.value)}
      />
    </label>
  );
}

export function Mortgage({ price }: { price: number }) {
  const [apport, setApport] = useState(30);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(9);

  const loan = price * (1 - apport / 100);
  const r = rate / 100 / 12, n = years * 12;
  const monthly = (loan * r) / (1 - Math.pow(1 + r, -n));

  return (
    <section className="block" id="simu">
      <h2 className="h3"><Icon name="calc" />Simuler mon financement</h2>
      <div className="simu">
        <Range label="Apport personnel" value={apport} min={10} max={70} step={5} onChange={setApport}
          display={`${apport} % · ${nf.format(Math.round((price * apport) / 100))} DT`} />
        <Range label="Durée du crédit" value={years} min={5} max={25} step={1} onChange={setYears} display={`${years} ans`} />
        <Range label="Taux annuel" value={rate} min={6} max={12} step={0.25} onChange={setRate} display={`${rate.toLocaleString('fr-FR')} %`} />
        <div className="simu__out">
          <small>Mensualité estimée</small>
          <b>{nf.format(Math.round(monthly))} DT/mois</b>
          <span className="muted small">Montant emprunté : {nf.format(Math.round(loan))} DT</span>
        </div>
      </div>
      <p className="muted small">Simulation indicative hors assurance et frais. Taux à confirmer auprès de votre banque.</p>
    </section>
  );
}
