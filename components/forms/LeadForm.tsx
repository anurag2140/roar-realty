"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { submitLead } from "@/lib/leads/actions";
import { turnstileSiteKey } from "@/lib/env";
import { Button } from "@/components/ui/Button";
import { Honeypot, SelectField, TextArea, TextField } from "@/components/ui/Field";
import { Turnstile } from "./Turnstile";
import { useToast } from "@/components/ui/Toast";

export type LeadFormProps = {
  formType:
    | "enquiry"
    | "glass-file"
    | "site-visit"
    | "brochure"
    | "exit-intent"
    | "contact"
    | "shortlist";
  property?: { id: string; name: string; slug: string } | null;
  /** Extra copy shown above the fields. */
  intro?: string;
  submitLabel?: string;
  showBudget?: boolean;
  showMessage?: boolean;
  messageLabel?: string;
  messagePlaceholder?: string;
  successHeading?: string;
  successBody?: string;
  onSuccess?: () => void;
  compact?: boolean;
};

const BUDGETS = [
  "Under ₹1 Cr",
  "₹1–3 Cr",
  "₹3–5 Cr",
  "₹5–10 Cr",
  "₹10–20 Cr",
  "₹20 Cr+",
  "Not sure yet",
];

export function LeadForm({
  formType,
  property,
  intro,
  submitLabel = "Request my shortlist →",
  showBudget = false,
  showMessage = true,
  messageLabel = "What are you looking for?",
  messagePlaceholder = "A 4BHK on Golf Course Road, ready to move, ₹6–8 Cr…",
  successHeading = "Consider it heard.",
  successBody = "Your brief is with our Gurugram desk.\nExpect your shortlist within 48 hours.",
  onSuccess,
  compact = false,
}: LeadFormProps) {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const renderedAt = useRef<string>(String(Date.now()));
  const { toast } = useToast();

  // Attribution: capture UTMs on first landing and keep them for the session,
  // so a lead submitted three pages later is still credited correctly.
  const [attribution, setAttribution] = useState({
    sourcePage: "",
    referrer: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmTerm: "",
    utmContent: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stored = (() => {
      try {
        return JSON.parse(sessionStorage.getItem("roar_utm") || "{}");
      } catch {
        return {};
      }
    })();

    const utm = {
      utmSource: params.get("utm_source") || stored.utmSource || "",
      utmMedium: params.get("utm_medium") || stored.utmMedium || "",
      utmCampaign: params.get("utm_campaign") || stored.utmCampaign || "",
      utmTerm: params.get("utm_term") || stored.utmTerm || "",
      utmContent: params.get("utm_content") || stored.utmContent || "",
    };

    if (Object.values(utm).some(Boolean)) {
      sessionStorage.setItem("roar_utm", JSON.stringify(utm));
    }

    setAttribution({
      sourcePage: window.location.pathname + window.location.search,
      referrer: stored.referrer || document.referrer || "",
      ...utm,
    });
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const fd = new FormData(e.currentTarget);
    fd.set("formType", formType);
    fd.set("renderedAt", renderedAt.current);
    fd.set("turnstileToken", turnstileToken);
    Object.entries(attribution).forEach(([k, v]) => fd.set(k, v));
    if (property) {
      fd.set("propertyId", property.id);
      fd.set("propertyName", property.name);
      fd.set("propertySlug", property.slug);
    }

    startTransition(async () => {
      const result = await submitLead(fd);
      if (result.ok) {
        setSent(true);
        formRef.current?.reset();
        onSuccess?.();
        // Lets Google Ads / Meta pick the conversion up without a page change.
        window.dispatchEvent(new CustomEvent("roar:lead", { detail: { formType } }));
      } else {
        setError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        toast(result.error, "error");
      }
    });
  }

  if (sent) {
    return (
      <div className="px-2 py-12 text-center" role="status">
        <div className="mb-4 font-serif text-[34px] italic text-gold-hi">
          {successHeading}
        </div>
        <div className="text-[15px] leading-relaxed whitespace-pre-line text-ivory/55">
          {successBody}
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {intro && <p className="text-sm leading-relaxed text-ivory/55">{intro}</p>}

      {property && (
        <div className="border border-gold/20 bg-gold/5 px-4 py-3">
          <div className="text-[10px] tracking-[0.24em] text-gold uppercase">Enquiring about</div>
          <div className="mt-1 font-display text-lg text-ivory">{property.name}</div>
        </div>
      )}

      <Honeypot />

      <TextField
        label="Your name"
        name="name"
        type="text"
        required
        autoComplete="name"
        placeholder="Aarav Mehta"
        error={fieldErrors.name}
        data-autofocus
      />

      <TextField
        label="Phone"
        name="phone"
        type="tel"
        required
        autoComplete="tel"
        inputMode="tel"
        placeholder="+91 98100 00000"
        error={fieldErrors.phone}
      />

      {!compact && (
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          hint="Optional — but it's how we send your shortlist."
          error={fieldErrors.email}
        />
      )}

      {showBudget && (
        <SelectField label="Budget" name="budget" defaultValue="">
          <option value="">Select a range</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </SelectField>
      )}

      {showMessage && (
        <TextArea
          label={messageLabel}
          name="message"
          rows={3}
          placeholder={messagePlaceholder}
          error={fieldErrors.message}
        />
      )}

      {turnstileSiteKey && (
        <Turnstile siteKey={turnstileSiteKey} onVerify={setTurnstileToken} />
      )}

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="mt-1 w-full">
        {pending ? "Sending…" : submitLabel}
      </Button>

      <p className="text-xs leading-relaxed text-ivory/35">
        We reply within one working day. Your details are never sold or shared — that&apos;s rule zero.
      </p>
    </form>
  );
}
