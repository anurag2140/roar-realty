"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Modal } from "@/components/ui/Modal";
import { LeadForm, type LeadFormProps } from "@/components/forms/LeadForm";
import type { SiteSettings } from "@/lib/sanity/types";

type EnquiryTarget = { id: string; name: string; slug: string } | null;

type OpenOptions = {
  formType: LeadFormProps["formType"];
  property?: EnquiryTarget;
  title?: string;
  description?: string;
  submitLabel?: string;
  showBudget?: boolean;
  messageLabel?: string;
  messagePlaceholder?: string;
};

type EnquiryContextValue = {
  open: (options: OpenOptions) => void;
  /** Convenience wrappers for the two most common CTAs. */
  requestGlassFile: (property: EnquiryTarget) => void;
  scheduleVisit: (property: EnquiryTarget) => void;
};

const EnquiryContext = createContext<EnquiryContextValue>({
  open: () => {},
  requestGlassFile: () => {},
  scheduleVisit: () => {},
});

export function useEnquiry() {
  return useContext(EnquiryContext);
}

/**
 * One modal instance for the whole app. Any component — a property card, a
 * sticky bar, an empty search result — can open an enquiry without each one
 * carrying its own dialog and focus-trap.
 */
export function EnquiryProvider({
  children,
}: {
  children: React.ReactNode;
  settings: SiteSettings | null;
}) {
  const [options, setOptions] = useState<OpenOptions | null>(null);

  const open = useCallback((next: OpenOptions) => setOptions(next), []);

  const requestGlassFile = useCallback(
    (property: EnquiryTarget) =>
      setOptions({
        formType: "glass-file",
        property,
        title: "Request the Glass File",
        description:
          "Complete title chain, encumbrances, dues, litigation history and true carpet-area maths, sent to you before you commit to anything.",
        submitLabel: "Send me the Glass File →",
        messageLabel: "Anything specific you want checked?",
        messagePlaceholder: "Title chain, builder track record, possession timeline…",
      }),
    []
  );

  const scheduleVisit = useCallback(
    (property: EnquiryTarget) =>
      setOptions({
        formType: "site-visit",
        property,
        title: "Schedule a site visit",
        description:
          "Tell us when suits you. We'll confirm within one working day, and we don't bring anyone else along.",
        submitLabel: "Request this visit →",
        messageLabel: "Preferred day and time",
        messagePlaceholder: "Saturday morning, or any weekday after 6pm…",
      }),
    []
  );

  const value = useMemo(
    () => ({ open, requestGlassFile, scheduleVisit }),
    [open, requestGlassFile, scheduleVisit]
  );

  return (
    <EnquiryContext.Provider value={value}>
      {children}

      <Modal
        open={Boolean(options)}
        onClose={() => setOptions(null)}
        title={options?.title ?? "Speak to us"}
        description={options?.description}
        size="sm"
      >
        {options && (
          <div className="px-8 pt-4 pb-9">
            <LeadForm
              formType={options.formType}
              property={options.property ?? null}
              submitLabel={options.submitLabel}
              showBudget={options.showBudget}
              messageLabel={options.messageLabel}
              messagePlaceholder={options.messagePlaceholder}
            />
          </div>
        )}
      </Modal>
    </EnquiryContext.Provider>
  );
}
