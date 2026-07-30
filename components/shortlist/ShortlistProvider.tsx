"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const KEY = "roar_shortlist";
const COMPARE_KEY = "roar_compare";
const EVENT = "roar:shortlist-change";

type ShortlistContextValue = {
  ids: string[];
  compareIds: string[];
  has: (id: string) => boolean;
  inCompare: (id: string) => boolean;
  toggle: (id: string) => boolean;
  toggleCompare: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
  clearCompare: () => void;
  ready: boolean;
};

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

export function useShortlist(): ShortlistContextValue {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error("useShortlist must be used inside ShortlistProvider");
  return ctx;
}

function read(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function write(key: string, ids: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    /* quota or private mode — the in-memory list still works this session */
  }
}

/**
 * Saved properties and comparison set, persisted in localStorage.
 *
 * No login: asking a buyer to create an account before they can save a flat is
 * the fastest way to lose them. The trade-off is the list is per-device, which
 * the shortlist page says plainly.
 */
export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage after mount. It cannot be read during render
  // without breaking SSR, so the initial state is empty and `ready` tells
  // consumers when the real list has arrived.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIds(read(KEY));
    setCompareIds(read(COMPARE_KEY));
    setReady(true);

    // Keep multiple tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setIds(read(KEY));
      if (e.key === COMPARE_KEY) setCompareIds(read(COMPARE_KEY));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback((id: string) => {
    let added = false;
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      added = next.length > prev.length;
      write(KEY, next);
      window.dispatchEvent(new CustomEvent(EVENT));
      return next;
    });
    return added;
  }, []);

  const toggleCompare = useCallback((id: string) => {
    let added = false;
    setCompareIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      added = next.length > prev.length;
      write(COMPARE_KEY, next);
      return next;
    });
    return added;
  }, []);

  const remove = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.filter((x) => x !== id);
      write(KEY, next);
      window.dispatchEvent(new CustomEvent(EVENT));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setIds([]);
    write(KEY, []);
    window.dispatchEvent(new CustomEvent(EVENT));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
    write(COMPARE_KEY, []);
  }, []);

  const value = useMemo<ShortlistContextValue>(
    () => ({
      ids,
      compareIds,
      has: (id) => ids.includes(id),
      inCompare: (id) => compareIds.includes(id),
      toggle,
      toggleCompare,
      remove,
      clear,
      clearCompare,
      ready,
    }),
    [ids, compareIds, toggle, toggleCompare, remove, clear, clearCompare, ready]
  );

  return (
    <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>
  );
}
