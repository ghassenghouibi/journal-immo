'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { Property } from '@/lib/data';
import { img } from '@/lib/utils';
import { Icon } from '../Icon';
import { FavButton } from '../PropertyCard';
import { useApp } from '../Providers';

function Lightbox({ images, start, onClose }: { images: string[]; start: number; onClose: () => void }) {
  const track = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const tr = track.current;
    if (tr) tr.scrollLeft = start * tr.clientWidth;
    document.body.classList.add('no-scroll');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close.current();
      if (e.key === 'ArrowRight') tr?.scrollBy({ left: tr.clientWidth, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') tr?.scrollBy({ left: -tr.clientWidth, behavior: 'smooth' });
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('no-scroll'); document.removeEventListener('keydown', onKey); };
  }, [start]);

  return (
    <div className="lightbox open" role="dialog" aria-modal="true" aria-label="Photos">
      <button className="round-btn lightbox__close" onClick={onClose} aria-label="Fermer"><Icon name="x" /></button>
      <div className="lightbox__track" ref={track}>
        {images.map(f => <div key={f} className="lightbox__slide"><Image src={img(f)} alt="" fill sizes="100vw" /></div>)}
      </div>
    </div>
  );
}

export function Gallery({ p }: { p: Property }) {
  const router = useRouter();
  const { toast } = useApp();
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);

  const share = async () => {
    const url = location.href;
    try {
      if (navigator.share) await navigator.share({ title: p.title, text: `${p.title} — ${p.quartier}, Sousse`, url });
      else { await navigator.clipboard.writeText(url); toast('Lien copié'); }
    } catch { /* partage annulé */ }
  };

  return (
    <div className="gallery">
      <div className="gallery__track" onScroll={e => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
        {p.images.map((f, i) => (
          <button key={f + i} className="gallery__item" onClick={() => setZoom(i)} aria-label={`Agrandir la photo ${i + 1}`}>
            <Image src={img(f)} alt={`${p.title} — photo ${i + 1}`} fill priority={i === 0} sizes={i === 0 ? '(min-width: 900px) 50vw, 100vw' : '(min-width: 900px) 25vw, 100vw'} />
          </button>
        ))}
      </div>
      <div className="gallery__bar container">
        <button className="round-btn" aria-label="Retour" onClick={() => (history.length > 1 ? router.back() : router.push('/biens'))}><Icon name="left" /></button>
        <span className="gallery__right">
          <button className="round-btn" onClick={share} aria-label="Partager"><Icon name="share" /></button>
          <FavButton id={p.id} variant="round" />
        </span>
      </div>
      <span className="gallery__count">{Math.min(index + 1, p.images.length)} / {p.images.length}</span>
      {zoom !== null && <Lightbox images={p.images} start={zoom} onClose={() => setZoom(null)} />}
    </div>
  );
}
