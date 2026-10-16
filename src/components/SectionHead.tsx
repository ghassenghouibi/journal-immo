import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from './Icon';

export function SectionHead({ eyebrow, title, link }: { eyebrow: string; title: ReactNode; link?: { href: string; label: string } }) {
  return (
    <div className="sec-head reveal">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="h2">{title}</h2>
      </div>
      {link && <Link className="link-arrow" href={link.href}>{link.label}<Icon name="arrow" /></Link>}
    </div>
  );
}
