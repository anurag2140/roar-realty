"use client";

import { useId } from "react";

const LABEL =
  "flex flex-col gap-2.5 text-[11px] tracking-[0.28em] text-ivory/50 uppercase";
const CONTROL =
  "border-0 border-b border-gold/30 bg-transparent py-2 font-sans text-[17px] text-ivory outline-none transition-colors focus:border-b-gold-hi";

type BaseProps = {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
};

export function TextField({
  label,
  error,
  hint,
  required,
  className = "",
  ...rest
}: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <label className={LABEL} htmlFor={id}>
      <span>
        {label}
        {required && <span aria-hidden className="ml-1 text-gold">*</span>}
      </span>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={[error && errorId, hint && hintId].filter(Boolean).join(" ") || undefined}
        className={`${CONTROL} ${error ? "border-b-red-400" : ""} ${className}`}
        {...rest}
      />
      {hint && !error && (
        <span id={hintId} className="text-[11px] tracking-normal normal-case text-ivory/35">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} role="alert" className="text-[11px] tracking-normal normal-case text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}

export function TextArea({
  label,
  error,
  hint,
  required,
  className = "",
  ...rest
}: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <label className={LABEL} htmlFor={id}>
      <span>
        {label}
        {required && <span aria-hidden className="ml-1 text-gold">*</span>}
      </span>
      <textarea
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${CONTROL} resize-y ${error ? "border-b-red-400" : ""} ${className}`}
        {...rest}
      />
      {hint && !error && (
        <span className="text-[11px] tracking-normal normal-case text-ivory/35">{hint}</span>
      )}
      {error && (
        <span id={errorId} role="alert" className="text-[11px] tracking-normal normal-case text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}

export function SelectField({
  label,
  error,
  required,
  children,
  className = "",
  ...rest
}: BaseProps & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <label className={LABEL} htmlFor={id}>
      <span>
        {label}
        {required && <span aria-hidden className="ml-1 text-gold">*</span>}
      </span>
      <select
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        className={`${CONTROL} [&>option]:bg-ink-2 ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && (
        <span role="alert" className="text-[11px] tracking-normal normal-case text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}

/**
 * Honeypot. Bots fill every field they find; humans never see this one.
 * Hidden with position/opacity rather than `display:none`, because some bots
 * skip display:none inputs specifically to dodge this trick.
 */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0">
      <label htmlFor="roar-company-website">Company website</label>
      <input
        id="roar-company-website"
        name="companyWebsite"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
