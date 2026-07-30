"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type Toast = { id: number; message: string; tone: "info" | "success" | "error" };
type ToastContextValue = {
  toast: (message: string, tone?: Toast["tone"]) => void;
};

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const toast = useCallback((message: string, tone: Toast["tone"] = "info") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Polite: announcements shouldn't interrupt a screen reader mid-sentence. */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="roar-no-print pointer-events-none fixed bottom-6 left-1/2 z-1400 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className={[
              "pointer-events-auto border px-5 py-3 text-sm backdrop-blur-md",
              t.tone === "error"
                ? "border-red-400/40 bg-red-950/80 text-red-100"
                : t.tone === "success"
                  ? "border-gold/40 bg-ink-2/90 text-gold-hi"
                  : "border-gold/25 bg-ink-2/90 text-ivory/80",
            ].join(" ")}
            style={{ animation: "roarModalIn .2s ease-out" }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
