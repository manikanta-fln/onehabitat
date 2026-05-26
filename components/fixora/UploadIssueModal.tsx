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
        <div className="flex items-center justify-between border-b border-outline-variant/10 px-lg py-md shrink-0">
          <div>
            <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wider">
              Fixora AI
            </p>
            <h2
              id="upload-issue-modal-title"
              className="font-headline text-headline-md text-primary"
            >
              {isBooked ? "Booking Confirmed" : STEP_LABELS[step]}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              close
            </span>
          </button>
        </div>

        {!isBooked && (
          <div className="flex gap-sm px-lg pt-md shrink-0">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 flex-col gap-xs min-w-0">
                <div
                  className={`h-1 rounded-full transition-colors ${
                    i <= currentIndex ? "bg-primary" : "bg-outline-variant/30"
                  }`}
                />
                <span
                  className={`block truncate font-body text-body-sm leading-tight ${
                    i <= currentIndex
                      ? "text-primary font-medium"
                      : "text-on-surface-variant/70"
                  }`}
                >
                  {STEP_LABELS[s]}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-lg py-md">
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
              <p className="font-body text-body-md text-on-surface-variant max-w-md">
                A Fixora expert will contact you within 2 hours to confirm your
                appointment for{" "}
                <strong className="text-on-surface">
                  {recommendation?.detectedIssue}
                </strong>
                .
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-sm bg-primary text-on-primary px-lg py-md rounded-DEFAULT font-label text-label-lg hover:brightness-110 transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {imagePreview && step !== "analyzing" && (
                <div className="mb-md flex gap-md items-start">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-outline-variant/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Uploaded issue"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {imageFile && (
                    <p className="font-body text-body-sm text-on-surface-variant pt-xs break-all line-clamp-2">
                      {imageFile.name}
                    </p>
                  )}
                </div>
              )}

              {step === "analyzing" && (
                <div className="flex flex-col items-center gap-lg py-md">
                  {imagePreview && (
                    <div className="w-full max-w-xs mx-auto overflow-hidden rounded-lg border border-outline-variant/20 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Uploaded issue"
                        className="w-full aspect-[4/3] object-cover"
                      />
                    </div>
                  )}

                  <div className="relative h-20 w-20 shrink-0">
                    <div className="absolute inset-0 rounded-full border-4 border-outline-variant/20" />
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
                    <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-primary text-3xl">
                      psychology
                    </span>
                  </div>

                  <div className="w-full max-w-md mx-auto text-center space-y-sm px-sm">
                    <h3 className="font-headline text-headline-sm text-on-surface">
                      Analyzing your issue…
                    </h3>
                    <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
                      Our AI is identifying the problem, assessing severity,
                      and preparing recommended solutions for you.
                    </p>
                    <p className="font-body text-body-sm text-on-surface-variant/80">
                      This usually takes a few seconds
                    </p>
                  </div>
                </div>
              )}

              {step === "results" && recommendation && (
                <div className="flex flex-col gap-md">
                  <div className="flex flex-wrap items-center gap-sm">
                    <span
                      className={`rounded-full px-sm py-xs font-label text-label-sm ${SEVERITY_STYLES[recommendation.severity].bg} ${SEVERITY_STYLES[recommendation.severity].text}`}
                    >
                      {SEVERITY_STYLES[recommendation.severity].label}
                    </span>
                    <span className="rounded-full bg-surface-container px-sm py-xs font-label text-label-sm text-on-surface-variant">
                      {recommendation.category}
                    </span>
                  </div>

                  <h3 className="font-headline text-headline-sm text-primary">
                    {recommendation.detectedIssue}
                  </h3>
                  <p className="font-body text-body-md text-on-surface-variant">
                    {recommendation.summary}
                  </p>

                  <div className="rounded-lg bg-surface-container-low p-md border border-outline-variant/10">
                    <h4 className="font-headline text-headline-sm mb-sm text-on-surface flex items-center gap-xs">
                      <span className="material-symbols-outlined text-secondary text-xl">
                        auto_awesome
                      </span>
                      AI recommended solutions
                    </h4>
                    <ul className="space-y-sm">
                      {recommendation.solutions.map((solution) => (
                        <li
                          key={solution}
                          className="flex items-start gap-sm font-body text-body-sm text-on-surface-variant"
                        >
                          <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">
                            check_circle
                          </span>
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-md">
                    <div className="rounded-lg border border-outline-variant/10 p-md">
                      <p className="font-label text-label-sm text-on-surface-variant mb-xs">
                        Est. cost (INR)
                      </p>
                      <p className="font-headline text-headline-sm text-primary">
                        {recommendation.estimatedCost}
                      </p>
                    </div>
                    <div className="rounded-lg border border-outline-variant/10 p-md">
                      <p className="font-label text-label-sm text-on-surface-variant mb-xs">
                        Duration
                      </p>
                      <p className="font-headline text-headline-sm text-primary">
                        {recommendation.estimatedDuration}
                      </p>
                    </div>
                  </div>

                  {!canBook && (
                    <p className="font-body text-body-sm text-on-surface-variant">
                      Analysis could not be saved. Close and try uploading again
                      to book a service.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={onGoToBooking}
                    disabled={!canBook}
                    className="w-full bg-primary text-on-primary px-lg py-md rounded-DEFAULT font-label text-label-lg hover:brightness-110 transition-all flex items-center justify-center gap-xs mt-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Book this service
                    <span className="material-symbols-outlined text-base">
                      arrow_forward
                    </span>
                  </button>
                </div>
              )}

              {step === "booking" && recommendation && (
                <form onSubmit={onSubmitBooking} className="flex flex-col gap-md">
                  <div className="rounded-lg bg-primary-container/30 border border-primary/20 p-md mb-sm">
                    <p className="font-label text-label-sm text-on-primary-container mb-xs">
                      Booking for
                    </p>
                    <p className="font-headline text-headline-sm text-on-primary-container">
                      {recommendation.detectedIssue}
                    </p>
                    <p className="font-body text-body-sm text-on-surface-variant mt-xs">
                      {recommendation.category} · {recommendation.estimatedCost}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                    <label className="flex flex-col gap-xs sm:col-span-2">
                      <span className="font-label text-label-sm text-on-surface-variant">
                        Full name *
                      </span>
                      <input
                        required
                        type="text"
                        value={booking.fullName}
                        onChange={(e) =>
                          onUpdateBooking("fullName", e.target.value)
                        }
                        className="rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="John Doe"
                      />
                    </label>
                    <label className="flex flex-col gap-xs">
                      <span className="font-label text-label-sm text-on-surface-variant">
                        Phone *
                      </span>
                      <input
                        required
                        type="tel"
                        value={booking.phone}
                        onChange={(e) =>
                          onUpdateBooking("phone", e.target.value)
                        }
                        className="rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="+1 (555) 000-0000"
                      />
                    </label>
                    <label className="flex flex-col gap-xs">
                      <span className="font-label text-label-sm text-on-surface-variant">
                        Email *
                      </span>
                      <input
                        required
                        type="email"
                        value={booking.email}
                        onChange={(e) =>
                          onUpdateBooking("email", e.target.value)
                        }
                        className="rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="you@email.com"
                      />
                    </label>
                    <label className="flex flex-col gap-xs sm:col-span-2">
                      <span className="font-label text-label-sm text-on-surface-variant">
                        Service address *
                      </span>
                      <input
                        required
                        type="text"
                        value={booking.address}
                        onChange={(e) =>
                          onUpdateBooking("address", e.target.value)
                        }
                        className="rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Street, city, zip"
                      />
                    </label>
                    <label className="flex flex-col gap-xs sm:col-span-2">
                      <span className="font-label text-label-sm text-on-surface-variant">
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
                        className="rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </label>
                    <label className="flex flex-col gap-xs sm:col-span-2">
                      <span className="font-label text-label-sm text-on-surface-variant">
                        Additional notes
                      </span>
                      <textarea
                        rows={3}
                        value={booking.notes}
                        onChange={(e) =>
                          onUpdateBooking("notes", e.target.value)
                        }
                        className="rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        placeholder="Access instructions, preferred time window, etc."
                      />
                    </label>
                  </div>

                  {submitError && (
                    <p
                      role="alert"
                      className="rounded-DEFAULT border border-error/30 bg-error-container/30 px-md py-sm font-body text-body-sm text-on-error-container"
                    >
                      {submitError}
                    </p>
                  )}

                  <div className="flex flex-col-reverse sm:flex-row gap-md pt-sm">
                    <button
                      type="button"
                      onClick={onBackToResults}
                      className="flex-1 border-2 border-outline-variant/30 text-on-surface-variant px-lg py-md rounded-DEFAULT font-label text-label-lg hover:bg-surface-container-low transition-all"
                    >
                      Back to results
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-primary text-on-primary px-lg py-md rounded-DEFAULT font-label text-label-lg hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-xs"
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
