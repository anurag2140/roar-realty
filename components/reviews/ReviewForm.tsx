"use client";

import { useState, useTransition } from "react";
import { submitReview } from "@/lib/reviews/actions";
import { TESTIMONIAL_REGIONS } from "@/lib/content/defaults";
import { Button } from "@/components/ui/Button";
import { Honeypot, SelectField, TextArea, TextField } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";

export function ReviewForm() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rating, setRating] = useState(5);
  const { toast } = useToast();

  if (sent) {
    return (
      <div className="px-2 py-12 text-center" role="status">
        <div className="mb-4 font-serif text-[32px] italic text-gold-hi">Thank you.</div>
        <p className="mx-auto max-w-sm text-[15px] leading-relaxed text-ivory/60">
          We read every review, check it against our records, and publish it once
          confirmed. That verification step is why the reviews on this page can
          be trusted.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});
        const fd = new FormData(e.currentTarget);
        fd.set("rating", String(rating));
        startTransition(async () => {
          const res = await submitReview(fd);
          if (res.ok) {
            setSent(true);
          } else {
            setError(res.error);
            setFieldErrors(res.fieldErrors ?? {});
            toast(res.error, "error");
          }
        });
      }}
    >
      <Honeypot />

      <fieldset className="border-0 p-0">
        <legend className="mb-2.5 text-[11px] tracking-[0.28em] text-ivory/50 uppercase">
          Your rating
        </legend>
        <div className="flex gap-1.5" role="radiogroup" aria-label="Rating out of five">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              className={`flex h-11 w-11 items-center justify-center text-2xl transition-colors ${
                n <= rating ? "text-gold-hi" : "text-ivory/20 hover:text-ivory/40"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>

      <TextField label="Your name" name="name" required error={fieldErrors.name} />

      <TextArea
        label="Your review"
        name="quote"
        rows={5}
        required
        placeholder="What did we actually do, and what difference did it make?"
        error={fieldErrors.quote}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Where you're based" name="region" defaultValue="">
          <option value="">Select</option>
          {TESTIMONIAL_REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </SelectField>

        <SelectField label="Where you bought" name="market" defaultValue="">
          <option value="">Select</option>
          <option value="Dubai">Dubai</option>
          <option value="Gurgaon & NCR">Gurgaon &amp; NCR</option>
          <option value="Both">Both</option>
        </SelectField>
      </div>

      <TextField
        label="Describe yourself"
        name="role"
        placeholder="NRI investor, first-time buyer, off-plan investor…"
        hint="Shown under your name. Optional."
      />

      <TextField
        label="Email"
        name="email"
        type="email"
        required
        hint="Not published. We use it only to confirm you're a client of ours."
        error={fieldErrors.email}
      />

      <TextField
        label="Phone"
        name="phone"
        type="tel"
        hint="Not published. Optional."
      />

      <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-ivory/60">
        <input
          type="checkbox"
          name="consent"
          value="yes"
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--gold)]"
        />
        I&apos;m happy for Roar Realty to publish this review, with my name, on
        their website.
      </label>
      {fieldErrors.consent && (
        <p role="alert" className="text-xs text-red-400">
          {fieldErrors.consent}
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="mt-1 w-full">
        {pending ? "Sending…" : "Submit review"}
      </Button>

      <p className="text-xs leading-relaxed text-ivory/35">
        Reviews are checked against our transaction records before they appear.
        We don&apos;t publish anonymous or unverifiable ones, which is the only
        reason the ones on this page mean anything.
      </p>
    </form>
  );
}
