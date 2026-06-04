"use client";

import type { ConsultationFormData } from "@/types/consultation";

const INPUT_CLASS =
  "w-full rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm text-left font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

type ConsultationModalProps = {
  form: ConsultationFormData;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitError: string | null;
  onClose: () => void;
  onChange: (field: keyof ConsultationFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function ConsultationModal({
  form,
  isSubmitting,
  isSubmitted,
  submitError,
  onClose,
  onChange,
  onSubmit,
}: ConsultationModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-margin-mobile md:p-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-inverse-surface/50 backdrop-blur-sm"
        aria-label="Close modal"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-outline-variant/20 bg-white shadow-2xl">
        <div className="flex shrink-0 items-start justify-between gap-md border-b border-outline-variant/10 px-lg py-md">
          <div className="min-w-0 flex-1 text-left">
            <p className="font-label text-label-sm uppercase tracking-wide text-on-surface-variant">
              Onehabitat
            </p>
            <h2
              id="consultation-modal-title"
              className="font-headline text-headline-md leading-tight text-primary"
            >
              {isSubmitted ? "Request Received" : "Free Consultation"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-surface-container-low"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              close
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-lg py-md text-left">
          {isSubmitted ? (
            <div className="flex flex-col items-center gap-md py-lg text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container text-secondary">
                <span
                  className="material-symbols-outlined text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
              <p className="max-w-md font-body text-body-md text-on-surface-variant">
                Thank you, {form.fullName.trim()}. Our team will contact you shortly
                to schedule your free consultation.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-sm inline-flex items-center justify-center rounded-DEFAULT bg-primary px-lg py-md font-label text-label-lg text-on-primary transition-all hover:brightness-110"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-md">
              <p className="font-body text-body-md text-on-surface-variant">
                Share your details and we&apos;ll reach out to help with repairs,
                interiors, or complete home care.
              </p>

              <label className="flex flex-col gap-xs text-left">
                <span className="font-label text-label-sm leading-snug text-on-surface-variant">
                  Full name *
                </span>
                <input
                  required
                  type="text"
                  value={form.fullName}
                  onChange={(e) => onChange("fullName", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>

              <label className="flex flex-col gap-xs text-left">
                <span className="font-label text-label-sm leading-snug text-on-surface-variant">
                  Mobile number *
                </span>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
              </label>

              <label className="flex flex-col gap-xs text-left">
                <span className="font-label text-label-sm leading-snug text-on-surface-variant">
                  Address *
                </span>
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) => onChange("address", e.target.value)}
                  className={`${INPUT_CLASS} resize-none`}
                  placeholder="Apartment, street, city"
                  autoComplete="street-address"
                />
              </label>

              <label className="flex flex-col gap-xs text-left">
                <span className="font-label text-label-sm leading-snug text-on-surface-variant">
                  Email <span className="font-normal">(optional)</span>
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="you@email.com"
                  autoComplete="email"
                />
              </label>

              {submitError ? (
                <p
                  role="alert"
                  className="rounded-DEFAULT border border-error/30 bg-error-container/30 px-md py-sm font-body text-body-sm text-on-error-container"
                >
                  {submitError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-xs rounded-DEFAULT bg-primary px-lg py-md font-label text-label-lg text-on-primary transition-all hover:brightness-110 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary/30 border-t-on-primary" />
                    Submitting…
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
