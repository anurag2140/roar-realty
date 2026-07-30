export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mx-auto max-w-[1400px] px-5 pt-16 pb-10 lg:px-10 lg:pt-24 lg:pb-14">
      {eyebrow && (
        <div className="mb-4 text-[11px] tracking-[0.4em] text-gold uppercase sm:text-[13px]">
          {eyebrow}
        </div>
      )}
      <h1 className="m-0 max-w-4xl font-display text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.06] text-balance text-ivory">
        {title}
      </h1>
      {intro && (
        <p className="mt-6 max-w-2xl text-[17px] leading-[1.8] text-ivory/60">{intro}</p>
      )}
      {children}
    </header>
  );
}
