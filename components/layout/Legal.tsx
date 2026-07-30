export function Legal({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 lg:px-10 lg:pb-32">
      <div className="text-[16px] leading-[1.85] text-ivory/65">{children}</div>
      <p className="mt-14 border-t border-gold/15 pt-6 text-xs text-ivory/35">
        Last updated {new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>
  );
}

export function LegalHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 mb-3 font-display text-2xl text-ivory first:mt-0">
      {children}
    </h2>
  );
}

export function LegalP({ children }: { children: React.ReactNode }) {
  return <p className="mb-4">{children}</p>;
}
