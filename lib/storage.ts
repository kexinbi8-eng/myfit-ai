"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try { const stored = window.localStorage.getItem(key); if (stored) setValue(JSON.parse(stored) as T); } catch { /* keep defaults */ } finally { setHydrated(true); }
  }, [key]);
  useEffect(() => { if (hydrated) window.localStorage.setItem(key, JSON.stringify(value)); }, [key, value, hydrated]);
  return [value, setValue] as const;
}
