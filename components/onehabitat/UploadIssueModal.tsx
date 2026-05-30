"use client";

import type {
  AIRecommendation,
  BookingFormData,
  IssueSeverity,
  UploadIssueStep,
} from "@/types/upload-issue";

type UploadIssueModalProps = {
  step: UploadIssueStep;
  imagePreview: string | null;
  imageFile: File | null;
  recommendation: AIRecommendation | null;
  booking: BookingFormData;
  isSubmitting: boolean;
  isBooked: boolean;
  submitError: string | null;
  fileError: string | null;
  canBook: boolean;
  onClose: () => void;
  onGoToBooking: () => void;
  onUpdateBooking: (field: keyof BookingFormData, value: string) => void;
  onSubmitBooking: (e: React.FormEvent) => void;
  onBackToResults: () => void;
};

const STEP_LABELS: Record<UploadIssueStep, string> = {
  analyzing: "AI Analysis",
  results: "Recommendations",
  booking: "Book Service",
};

const SEVERITY_STYLES: Record<
  IssueSeverity,
  { bg: string; text: string; label: string }
> = {
  low: {
    bg: "bg-secondary-container",
    text: "text-on-secondary-container",
    label: "Low priority",
  },
  medium: {
    bg: "bg-tertiary-container",
    text: "text-on-tertiary-container",
    label: "Medium priority",
  },
  high: {
    bg: "bg-error-container",
    text: "text-on-error-container",
    label: "High priority",
  },
};

export default function UploadIssueModal({
  step,
  imagePreview,
  imageFile,
  recommendation,
  booking,
  isSubmitting,
  isBooked,
  submitError,
  fileError,
  canBook,
  onClose,
  onGoToBooking,
  onUpdateBooking,
  onSubmitBooking,
  onBackToResults,
}: UploadIssueModalProps) {
  const steps: UploadIssueStep[] = ["analyzing", "results", "booking"];
  const currentIndex = steps.indexOf(step);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-margin-mobile md:p-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-issue-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-inverse-surface/50 backdrop-blur-sm"
        aria-label="Close modal"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl border border-outline-variant/20">
        <div className="flex items-start justify-between gap-md border-b border-outline-variant/10 px-lg py-md shrink-0">
          <div className="min-w-0 flex-1 text-left">
            <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide">
              Onehabitat AI
            </p>
            <h2
              id="upload-issue-modal-title"
              className="font-headline text-headline-md text-primary leading-tight"
            >
              {isBooked ? "Booking Confirmed" : STEP_LABELS[step]}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              close
            </span>
          </button>
        </div>

        {!isBooked && (
          <div className="grid grid-cols-3 gap-sm px-lg pt-md shrink-0">
            {steps.map((s, i) => (
              <div
                key={s}
                className="flex min-h-[2.5rem] min-w-0 flex-col items-center justify-end gap-xs"
              >
                <div
                  className={`h-1 w-full rounded-full transition-colors ${
                    i <= currentIndex ? "bg-primary" : "bg-outline-variant/30"
                  }`}
                />
                <span
                  className={`block w-full px-0.5 text-center font-body text-[11px] leading-tight sm:text-body-sm ${
                    i <= currentIndex
                      ? "font-medium text-primary"
                      : "text-on-surface-variant/70"
                  }`}
                >
                  {STEP_LABELS[s]}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-lg py-md text-left">
          {isBooked ? (
            <div className="flex flex-col items-center gap-md py-lg text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container text-secondary">
                <span
                  className="material-symbols-outlined text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
              <h3 className="font-headline text-headline-sm text-on-surface">
                Service request received
              </h3>
              <p className="max-w-md font-body text-body-md leading-relaxed text-on-surface-variant">
                A Onehabitat expert will contact you within 2 hours to confirm your
                appointment for{" "}
                <strong className="font-semibold text-on-surface">
                  {recommendation?.detectedIssue}
                </strong>
                .
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-sm inline-flex items-center justify-center bg-primary px-lg py-md font-label text-label-lg text-on-primary rounded-DEFAULT hover:brightness-110 transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {fileError && step === "results" && (
                <p
                  role="status"
                  className="mb-md rounded-DEFAULT border border-tertiary/30 bg-tertiary-container/30 px-md py-sm text-left font-body text-body-sm leading-relaxed text-on-surface-variant"
                >
                  {fileError}
                </p>
              )}

              {imagePreview && step !== "analyzing" && (
                <div className="mb-md flex items-center gap-md">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-outline-variant/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Uploaded issue"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {imageFile && (
                    <p className="min-w-0 flex-1 font-body text-body-sm leading-snug text-on-surface-variant break-all line-clamp-2">
                      {imageFile.name}
                    </p>
                  )}
                </div>
              )}

              {step === "analyzing" && (
                <div className="flex flex-col gap-lg text-left">
                  {imagePreview && (
                    <div className="w-full overflow-hidden rounded-lg border border-outline-variant/20 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Uploaded issue"
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-start gap-md">
                    <div className="relative mt-0.5 h-16 w-16 shrink-0">
                      <div className="absolute inset-0 rounded-full border-4 border-outline-variant/20" />
                      <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
                      <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-3xl text-primary">
                        psychology
                      </span>
                    </div>

                    <div className="min-w-0 flex-1 space-y-sm pt-1">
                      <h3 className="font-headline text-headline-sm leading-snug text-on-surface">
                        Analyzing your issue…
                      </h3>
                      <p className="font-body text-body-md leading-relaxed text-on-surface-variant">
                        Our AI is identifying the problem, assessing severity, and
                        preparing recommended solutions for you.
                      </p>
                      <p className="font-body text-body-sm leading-snug text-on-surface-variant/80">
                        This usually takes a few seconds
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {step === "results" && recommendation && (
                <div className="flex flex-col gap-md text-left">
                  <div className="flex flex-wrap items-center gap-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-sm py-xs font-label text-label-sm leading-none ${SEVERITY_STYLES[recommendation.severity].bg} ${SEVERITY_STYLES[recommendation.severity].text}`}
                    >
                      {SEVERITY_STYLES[recommendation.severity].label}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-surface-container px-sm py-xs font-label text-label-sm leading-none text-on-surface-variant">
                      {recommendation.category}
                    </span>
                  </div>

                  <h3 className="font-headline text-headline-sm leading-snug text-primary">
                    {recommendation.detectedIssue}
                  </h3>
                  <p className="font-body text-body-md leading-relaxed text-on-surface-variant">
                    {recommendation.summary}
                  </p>

                  <div className="rounded-lg border border-outline-variant/10 bg-surface-container-low p-md">
                    <h4 className="mb-sm flex items-center gap-xs font-headline text-headline-sm leading-snug text-on-surface">
                      <span className="material-symbols-outlined shrink-0 text-xl text-secondary">
                        auto_awesome
                      </span>
                      <span>AI recommended solutions</span>
                    </h4>
                    <ul className="space-y-sm">
                      {recommendation.solutions.map((solution) => (
                        <li
                          key={solution}
                          className="flex items-start gap-sm text-left font-body text-body-sm leading-relaxed text-on-surface-variant"
                        >
                          <span className="material-symbols-outlined mt-0.5 shrink-0 text-base text-primary">
                            check_circle
                          </span>
                          <span className="min-w-0 flex-1">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-md">
                    <div className="rounded-lg border border-outline-variant/10 p-md text-left">
                      <p className="mb-xs font-label text-label-sm leading-snug text-on-surface-variant">
                        Est. cost (INR)
                      </p>
                      <p className="font-headline text-headline-sm leading-snug text-primary">
                        {recommendation.estimatedCost}
                      </p>
                    </div>
                    <div className="rounded-lg border border-outline-variant/10 p-md text-left">
                      <p className="mb-xs font-label text-label-sm leading-snug text-on-surface-variant">
                        Duration
                      </p>
                      <p className="font-headline text-headline-sm leading-snug text-primary">
                        {recommendation.estimatedDuration}
                      </p>
                    </div>
                  </div>

                  {!canBook && (
                    <p className="font-body text-body-sm leading-relaxed text-on-surface-variant">
                      Booking is unavailable until your issue is saved. Start
                      MongoDB and upload again to book a service.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={onGoToBooking}
                    disabled={!canBook}
                    className="mt-sm inline-flex w-full items-center justify-center gap-xs rounded-DEFAULT bg-primary px-lg py-md font-label text-label-lg text-on-primary hover:brightness-110 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Book this service
                    <span className="material-symbols-outlined text-base">
                      arrow_forward
                    </span>
                  </button>
                </div>
              )}

              {step === "booking" && recommendation && (
                <form
                  onSubmit={onSubmitBooking}
                  className="flex flex-col gap-md text-left"
                >
                  <div className="mb-sm rounded-lg border border-primary/20 bg-primary-container/30 p-md text-left">
                    <p className="mb-xs font-label text-label-sm leading-snug text-on-primary-container">
                      Booking for
                    </p>
                    <p className="font-headline text-headline-sm leading-snug text-on-primary-container">
                      {recommendation.detectedIssue}
                    </p>
                    <p className="mt-xs font-body text-body-sm leading-snug text-on-surface-variant">
                      {recommendation.category} · {recommendation.estimatedCost}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
                    <label className="flex flex-col gap-xs text-left sm:col-span-2">
                      <span className="font-label text-label-sm leading-snug text-on-surface-variant">
                        Full name *
                      </span>
                      <input
                        required
                        type="text"
                        value={booking.fullName}
                        onChange={(e) =>
                          onUpdateBooking("fullName", e.target.value)
                        }
                        className="w-full rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm text-left font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="John Doe"
                      />
                    </label>
                    <label className="flex flex-col gap-xs text-left">
                      <span className="font-label text-label-sm leading-snug text-on-surface-variant">
                        Phone *
                      </span>
                      <input
                        required
                        type="tel"
                        value={booking.phone}
                        onChange={(e) =>
                          onUpdateBooking("phone", e.target.value)
                        }
                        className="w-full rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm text-left font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="+1 (555) 000-0000"
                      />
                    </label>
                    <label className="flex flex-col gap-xs text-left">
                      <span className="font-label text-label-sm leading-snug text-on-surface-variant">
                        Email *
                      </span>
                      <input
                        required
                        type="email"
                        value={booking.email}
                        onChange={(e) =>
                          onUpdateBooking("email", e.target.value)
                        }
                        className="w-full rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm text-left font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="you@email.com"
                      />
                    </label>
                    <label className="flex flex-col gap-xs text-left sm:col-span-2">
                      <span className="font-label text-label-sm leading-snug text-on-surface-variant">
                        Service address *
                      </span>
                      <input
                        required
                        type="text"
                        value={booking.address}
                        onChange={(e) =>
                          onUpdateBooking("address", e.target.value)
                        }
                        className="w-full rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm text-left font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Street, city, zip"
                      />
                    </label>
                    <label className="flex flex-col gap-xs text-left sm:col-span-2">
                      <span className="font-label text-label-sm leading-snug text-on-surface-variant">
                        Preferred date *
                      </span>
                      <input
                        required
                        type="date"
                        value={booking.preferredDate}
                        onChange={(e) =>
                          onUpdateBooking("preferredDate", e.target.value)
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm text-left font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </label>
                    <label className="flex flex-col gap-xs text-left sm:col-span-2">
                      <span className="font-label text-label-sm leading-snug text-on-surface-variant">
                        Additional notes
                      </span>
                      <textarea
                        rows={3}
                        value={booking.notes}
                        onChange={(e) =>
                          onUpdateBooking("notes", e.target.value)
                        }
                        className="w-full resize-none rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm text-left font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Access instructions, preferred time window, etc."
                      />
                    </label>
                  </div>

                  {submitError && (
                    <p
                      role="alert"
                      className="rounded-DEFAULT border border-error/30 bg-error-container/30 px-md py-sm text-left font-body text-body-sm leading-relaxed text-on-error-container"
                    >
                      {submitError}
                    </p>
                  )}

                  <div className="flex flex-col-reverse gap-md pt-sm sm:flex-row">
                    <button
                      type="button"
                      onClick={onBackToResults}
                      className="inline-flex flex-1 items-center justify-center rounded-DEFAULT border-2 border-outline-variant/30 px-lg py-md font-label text-label-lg text-on-surface-variant hover:bg-surface-container-low transition-all"
                    >
                      Back to results
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex flex-1 items-center justify-center gap-xs rounded-DEFAULT bg-primary px-lg py-md font-label text-label-lg text-on-primary hover:brightness-110 transition-all disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary/30 border-t-on-primary" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          Confirm booking
                          <span className="material-symbols-outlined text-base">
                            event_available
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
