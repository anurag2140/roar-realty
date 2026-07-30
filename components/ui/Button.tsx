import Link from "next/link";

type Variant = "gold" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-3 font-sans uppercase tracking-[0.22em] transition-all disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS: Record<Variant, string> = {
  gold: "text-ink font-medium hover:brightness-110 hover:-translate-y-0.5",
  outline:
    "border border-gold/40 text-gold-hi hover:border-gold-hi hover:bg-gold/10",
  ghost: "text-ivory/60 hover:text-gold-hi",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2.5 text-[11px]",
  md: "px-7 py-3.5 text-[13px]",
  lg: "px-9 py-[18px] text-sm",
};

const GOLD_BG = {
  background: "linear-gradient(120deg, var(--gold), var(--goldhi))",
} as const;

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "gold",
  size = "md",
  className = "",
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      style={variant === "gold" ? GOLD_BG : undefined}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "gold",
  size = "md",
  className = "",
  children,
  ...rest
}: CommonProps &
  Omit<React.ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link
      href={href}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} no-underline ${className}`}
      style={variant === "gold" ? GOLD_BG : undefined}
      {...rest}
    >
      {children}
    </Link>
  );
}
