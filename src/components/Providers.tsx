'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

const KEY = 'ji_favs';

interface Ctx {
  favs: string[];
  toggleFav: (id: string) => boolean;
  toast: (msg: string) => void;
}
const AppContext = createContext<Ctx | null>(null);

export function useApp() {
  const c = useContext(AppContext);
  if (!c) throw new Error('useApp doit être utilisé dans <Providers>');
  return c;
}

export function Providers({ children }: { children: ReactNode }) {
  const [favs, setFavs] = useState<string[]>([]);
  const [msg, setMsg] = useState('');
  const [shown, setShown] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    try { setFavs(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { /* stockage indisponible */ }
  }, []);

  const toggleFav = useCallback((id: string) => {
    const on = !favs.includes(id);
    const next = on ? [...favs, id] : favs.filter(x => x !== id);
    setFavs(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* stockage indisponible */ }
    return on;
  }, [favs]);

  const toast = useCallback((m: string) => {
    setMsg(m); setShown(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShown(false), 2600);
  }, []);

  return (
    <AppContext.Provider value={{ favs, toggleFav, toast }}>
      {children}
      <div className={`toast ${shown ? 'show' : ''}`} role="status" aria-live="polite">{msg}</div>
    </AppContext.Provider>
  );
}
