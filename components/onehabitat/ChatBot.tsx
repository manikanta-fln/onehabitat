"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AIRecommendation,
  BookingFormData,
  IssueSeverity,
} from "@/types/upload-issue";
import {
  analyzeIssue,
  createBooking,
  sendChatMessage,
} from "@/utils/api";
import { isClientImageFile } from "@/lib/form-file";
import { IssueDiagnosticDetails } from "@/components/shared/IssueDiagnosticDetails";
import { InteriorEstimateCard } from "@/components/onehabitat/InteriorEstimateCard";
import type { InteriorEstimate } from "@/types/interiors";
import { WHATSAPP_URL } from "@/utils/constants";

/**
 * Conversational front-end for the existing "Upload an Issue" flow, extended
 * with a free-text assistant.
 *
 * It reuses the same `analyzeIssue` (/api/issues/analyze) and `createBooking`
 * (/api/bookings) endpoints, types, and `IssueDiagnosticDetails` renderer as
 * UploadIssueProvider / UploadIssueModal. Free-text questions and the whole
 * transcript are sent to and stored by `/api/chat`.
 */

type ChatPhase = "intro" | "analyzing" | "results" | "booking" | "booked";

type CtaVariant = "start" | "answer" | "result" | "estimate";

const ESTIMATE_PROMPT =
  "Sure! Tell me your home size (e.g. 2BHK or 1100 sqft), full interiors or renovation, finish level (economy / premium / luxury) and your budget. For example: \"2BHK full interiors, premium, budget 12 lakh\" — or ask for one trade, like \"painting cost for 3BHK\".";

type ChatMessage =
  | { id: number; role: "bot" | "user"; type: "text"; text: string }
  | { id: number; role: "user"; type: "image"; src: string; name: string }
  | {
      id: number;
      role: "bot";
      type: "recommendation";
      recommendation: AIRecommendation;
    }
  | { id: number; role: "bot"; type: "estimate"; estimate: InteriorEstimate }
  | { id: number; role: "bot"; type: "typing" }
  | { id: number; role: "bot"; type: "cta"; variant: CtaVariant };

const TYPING_ID = -1;

const INITIAL_BOOKING: BookingFormData = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  preferredDate: "",
  notes: "",
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
  urgent: {
    bg: "bg-error",
    text: "text-on-primary",
    label: "Urgent",
  },
};

const GREETING_NEXT_ID = 3;

function buildGreeting(): ChatMessage[] {
  return [
    {
      id: 0,
      role: "bot",
      type: "text",
      text: "Hi! I'm the Onehabitat assistant. 👋",
    },
    {
      id: 1,
      role: "bot",
      type: "text",
      text: "Ask me anything about home repairs, interiors or renovations — get an indicative interior estimate, or share a photo of an issue for an instant AI diagnosis.",
    },
    { id: 2, role: "bot", type: "cta", variant: "start" },
  ];
}

export default function OnehabitatChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<ChatPhase>("intro");
  const [messages, setMessages] = useState<ChatMessage[]>(buildGreeting);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(
    null
  );
  const [issueId, setIssueId] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingFormData>(INITIAL_BOOKING);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const nextId = useRef(GREETING_NEXT_ID);
  const conversationIdRef = useRef<string | null>(null);
  const objectUrls = useRef<string[]>([]);
  const captureInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const makeId = useCallback(() => nextId.current++, []);

  const botText = useCallback(
    (text: string): ChatMessage => ({
      id: nextId.current++,
      role: "bot",
      type: "text",
      text,
    }),
    []
  );

  const ctaMessage = useCallback(
    (variant: CtaVariant): ChatMessage => ({
      id: nextId.current++,
      role: "bot",
      type: "cta",
      variant,
    }),
    []
  );

  const canBook = !!issueId;
  const busy = phase === "analyzing" || isSending;

  // Best-effort transcript logging (does not block the UI).
  const logEvent = useCallback(
    (event: string, content: string, meta?: Record<string, unknown>) => {
      void sendChatMessage({
        type: "event",
        conversationId: conversationIdRef.current ?? undefined,
        event,
        content,
        meta,
      })
        .then((res) => {
          conversationIdRef.current = res.conversationId;
        })
        .catch(() => {
          /* logging is best-effort */
        });
    },
    []
  );

  // Auto-scroll to the latest message.
  useEffect(() => {
    if (!isOpen) return;
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, phase, isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  // Revoke object URLs on unmount.
  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const openWhatsApp = useCallback(() => {
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  }, []);

  const triggerUpload = useCallback(() => uploadInputRef.current?.click(), []);
  const triggerCapture = useCallback(() => captureInputRef.current?.click(), []);

  const runAnalysis = useCallback(
    async (file: File) => {
      if (!isClientImageFile(file)) {
        setMessages((prev) => [
          ...prev,
          botText(
            "That doesn't look like an image. Please upload a JPG, PNG, or WEBP photo."
          ),
        ]);
        return;
      }

      const src = URL.createObjectURL(file);
      objectUrls.current.push(src);
      setSubmitError(null);
      setPhase("analyzing");

      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "user", type: "image", src, name: file.name },
        { id: TYPING_ID, role: "bot", type: "typing" },
      ]);

      try {
        const {
          issueId: savedIssueId,
          recommendation: result,
          saved,
        } = await analyzeIssue(file);

        if (!saved || !savedIssueId) {
          throw new Error(
            "Your issue was analyzed but couldn't be saved, so booking is unavailable. Please check the server configuration and try again."
          );
        }

        setIssueId(savedIssueId);
        setRecommendation(result);
        setPhase("results");
        setMessages((prev) => [
          ...prev.filter((m) => m.type !== "typing"),
          { id: makeId(), role: "bot", type: "recommendation", recommendation: result },
          botText(
            `Here's what I found. I'd recommend a ${result.category.toLowerCase()} service — I can help you book a verified expert.`
          ),
          ctaMessage("result"),
        ]);
        logEvent("image_analyzed", `Photo analyzed: ${result.detectedIssue}`, {
          issueId: savedIssueId,
          category: result.category,
          severity: result.severity,
        });
      } catch (err) {
        setPhase("intro");
        setMessages((prev) => [
          ...prev.filter((m) => m.type !== "typing"),
          botText(
            err instanceof Error
              ? err.message
              : "Something went wrong analyzing your photo. Please try again."
          ),
          ctaMessage("answer"),
        ]);
      }
    },
    [botText, ctaMessage, makeId, logEvent]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (file) void runAnalysis(file);
    },
    [runAnalysis]
  );

  const sendText = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const content = inputValue.trim();
      if (!content || busy) return;

      setInputValue("");
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "user", type: "text", text: content },
        { id: TYPING_ID, role: "bot", type: "typing" },
      ]);
      setIsSending(true);

      try {
        const res = await sendChatMessage({
          type: "message",
          conversationId: conversationIdRef.current ?? undefined,
          content,
        });
        conversationIdRef.current = res.conversationId;
        const reply = botText(
          res.reply ?? "I'm here to help with your home maintenance needs."
        );
        setMessages((prev) => [
          ...prev.filter((m) => m.type !== "typing"),
          ...(res.estimate
            ? [
                reply,
                {
                  id: makeId(),
                  role: "bot" as const,
                  type: "estimate" as const,
                  estimate: res.estimate,
                },
                ctaMessage("estimate"),
              ]
            : [reply, ctaMessage("answer")]),
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev.filter((m) => m.type !== "typing"),
          botText(
            err instanceof Error
              ? err.message
              : "Sorry, I couldn't process that. Please try again, or contact our team."
          ),
          ctaMessage("answer"),
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [inputValue, busy, botText, ctaMessage, makeId]
  );

  const startEstimate = useCallback(() => {
    if (busy) return;
    setMessages((prev) => [...prev, botText(ESTIMATE_PROMPT)]);
    logEvent("interior_estimate_started", "Customer opened the interior estimate");
  }, [busy, botText, logEvent]);

  const startBooking = useCallback(() => {
    if (!recommendation || !canBook) return;
    setBooking(INITIAL_BOOKING);
    setSubmitError(null);
    setPhase("booking");
    setMessages((prev) => [
      ...prev,
      botText(
        `Great — let's book your ${recommendation.detectedIssue}. Please share your details below.`
      ),
    ]);
  }, [recommendation, canBook, botText]);

  const updateBooking = useCallback(
    (field: keyof BookingFormData, value: string) => {
      setBooking((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const submitBooking = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!issueId || !recommendation) {
        setSubmitError("Missing issue details. Please upload your issue again.");
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await createBooking({ issueId, booking, recommendation });
        setPhase("booked");
        setMessages((prev) => [
          ...prev,
          botText(
            `All set! ✅ A Onehabitat expert will contact you within 2 hours to confirm your appointment for ${recommendation.detectedIssue}.`
          ),
          ctaMessage("answer"),
        ]);
        logEvent(
          "booking_confirmed",
          `Booking confirmed for ${recommendation.detectedIssue}`,
          { issueId }
        );
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "Failed to save booking"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [issueId, booking, recommendation, botText, ctaMessage, logEvent]
  );

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        data-onehabitat-assistant
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close assistant" : "Open Onehabitat assistant"}
        aria-expanded={isOpen}
        className="fixed bottom-28 right-margin-mobile z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform hover:scale-110 md:right-margin-desktop"
      >
        <span className="material-symbols-outlined text-3xl">
          {isOpen ? "close" : "chat"}
        </span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          data-onehabitat-assistant
          aria-modal="false"
          aria-label="Onehabitat assistant"
          className="fixed inset-x-0 bottom-0 top-0 z-[60] flex flex-col overflow-hidden border border-outline-variant/20 bg-white shadow-2xl sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(640px,calc(100vh-3rem))] sm:w-[400px] sm:rounded-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-md border-b border-outline-variant/10 bg-primary px-lg py-md text-on-primary shrink-0">
            <div className="flex items-center gap-sm min-w-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-on-primary/15">
                <span className="material-symbols-outlined">support_agent</span>
              </span>
              <div className="min-w-0">
                <p className="font-headline text-headline-sm leading-tight">
                  Onehabitat AI
                </p>
                <p className="font-body text-body-sm leading-tight opacity-80">
                  Ask · Upload · Book
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-on-primary/15"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Transcript */}
          <div className="flex-1 space-y-md overflow-y-auto bg-surface-container-lowest px-md py-md">
            {messages.map((message) =>
              message.type === "cta" ? (
                <CtaBlock
                  key={message.id}
                  variant={message.variant}
                  canBook={canBook}
                  onUpload={triggerUpload}
                  onCapture={triggerCapture}
                  onContact={openWhatsApp}
                  onBook={startBooking}
                  onEstimate={startEstimate}
                />
              ) : (
                <ChatBubble key={message.id} message={message} />
              )
            )}
            <div ref={scrollAnchorRef} />
          </div>

          {/* Action area */}
          <div className="border-t border-outline-variant/10 bg-white px-md py-md shrink-0">
            {phase === "booking" ? (
              <form onSubmit={submitBooking} className="flex flex-col gap-sm">
                <input
                  required
                  type="text"
                  value={booking.fullName}
                  onChange={(e) => updateBooking("fullName", e.target.value)}
                  placeholder="Full name *"
                  className="w-full rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex gap-sm">
                  <input
                    required
                    type="tel"
                    value={booking.phone}
                    onChange={(e) => updateBooking("phone", e.target.value)}
                    placeholder="Phone *"
                    className="w-full min-w-0 rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <input
                    required
                    type="email"
                    value={booking.email}
                    onChange={(e) => updateBooking("email", e.target.value)}
                    placeholder="Email *"
                    className="w-full min-w-0 rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <input
                  required
                  type="text"
                  value={booking.address}
                  onChange={(e) => updateBooking("address", e.target.value)}
                  placeholder="Service address *"
                  className="w-full rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <label className="flex flex-col gap-xs">
                  <span className="font-label text-label-sm text-on-surface-variant">
                    Preferred date *
                  </span>
                  <input
                    required
                    type="date"
                    value={booking.preferredDate}
                    onChange={(e) =>
                      updateBooking("preferredDate", e.target.value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <textarea
                  rows={2}
                  value={booking.notes}
                  onChange={(e) => updateBooking("notes", e.target.value)}
                  placeholder="Additional notes (optional)"
                  className="w-full resize-none rounded-DEFAULT border border-outline-variant/30 bg-surface-container-lowest px-md py-sm font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />

                {submitError && (
                  <p
                    role="alert"
                    className="rounded-DEFAULT border border-error/30 bg-error-container/30 px-md py-sm font-body text-body-sm text-on-error-container"
                  >
                    {submitError}
                  </p>
                )}

                <div className="flex gap-sm pt-xs">
                  <button
                    type="button"
                    onClick={() => setPhase("results")}
                    className="flex items-center justify-center rounded-DEFAULT border-2 border-outline-variant/30 px-md py-sm font-label text-label-lg text-on-surface-variant transition-all hover:bg-surface-container-low"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex flex-1 items-center justify-center gap-xs rounded-DEFAULT bg-primary px-md py-sm font-label text-label-lg text-on-primary transition-all hover:brightness-110 disabled:opacity-60"
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
            ) : (
              <form onSubmit={sendText} className="flex items-center gap-xs">
                <button
                  type="button"
                  onClick={triggerUpload}
                  disabled={busy}
                  aria-label="Upload photo"
                  title="Upload photo"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container-low disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-xl">image</span>
                </button>
                <button
                  type="button"
                  onClick={triggerCapture}
                  disabled={busy}
                  aria-label="Capture photo"
                  title="Capture photo"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container-low disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-xl">
                    photo_camera
                  </span>
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={busy}
                  placeholder="Ask about repairs, interiors, costs…"
                  aria-label="Message"
                  className="min-w-0 flex-1 rounded-full border border-outline-variant/30 bg-surface-container-lowest px-md py-sm font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={busy || !inputValue.trim()}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-xl">send</span>
                </button>
              </form>
            )}
          </div>

          {/* Hidden inputs — same accept/capture config as UploadIssueProvider */}
          <input
            ref={captureInputRef}
            type="file"
            accept="image/*,.heic,.heif"
            capture="environment"
            className="hidden"
            tabIndex={-1}
            aria-hidden
            onChange={handleFileChange}
          />
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*,.heic,.heif"
            className="hidden"
            tabIndex={-1}
            aria-hidden
            onChange={handleFileChange}
          />
        </div>
      )}
    </>
  );
}

function CtaBlock({
  variant,
  canBook,
  onUpload,
  onCapture,
  onContact,
  onBook,
  onEstimate,
}: {
  variant: CtaVariant;
  canBook: boolean;
  onUpload: () => void;
  onCapture: () => void;
  onContact: () => void;
  onBook: () => void;
  onEstimate: () => void;
}) {
  const primaryBtn =
    "flex items-center justify-center gap-xs rounded-full bg-primary px-md py-sm font-label text-label-sm text-on-primary transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50";
  const outlineBtn =
    "flex items-center justify-center gap-xs rounded-full border border-primary/40 px-md py-sm font-label text-label-sm text-primary transition-all hover:bg-primary hover:text-on-primary";

  if (variant === "start") {
    return (
      <div className="flex flex-col gap-xs">
        <p className="font-label text-label-sm text-on-surface-variant">
          Get started
        </p>
        <div className="flex flex-wrap gap-xs">
          <button type="button" onClick={onUpload} className={primaryBtn}>
            <span className="material-symbols-outlined text-base">upload</span>
            Upload a photo
          </button>
          <button type="button" onClick={onCapture} className={outlineBtn}>
            <span className="material-symbols-outlined text-base">
              photo_camera
            </span>
            Capture a photo
          </button>
          <button type="button" onClick={onEstimate} className={outlineBtn}>
            <span className="material-symbols-outlined text-base">chair</span>
            Interior estimate
          </button>
        </div>
      </div>
    );
  }

  if (variant === "estimate") {
    return (
      <div className="flex flex-wrap gap-xs">
        <button type="button" onClick={onContact} className={primaryBtn}>
          <span className="material-symbols-outlined text-base">chat</span>
          Get exact quote
        </button>
        <button type="button" onClick={onEstimate} className={outlineBtn}>
          <span className="material-symbols-outlined text-base">tune</span>
          New estimate
        </button>
      </div>
    );
  }

  if (variant === "result") {
    return (
      <div className="flex flex-wrap gap-xs">
        <button
          type="button"
          onClick={onBook}
          disabled={!canBook}
          className={primaryBtn}
        >
          Book this service
          <span className="material-symbols-outlined text-base">
            arrow_forward
          </span>
        </button>
        <button type="button" onClick={onUpload} className={outlineBtn}>
          New photo
        </button>
        <button type="button" onClick={onContact} className={outlineBtn}>
          Contact our team
        </button>
      </div>
    );
  }

  // variant === "answer"
  return (
    <div className="flex flex-col gap-xs">
      <p className="font-label text-label-sm text-on-surface-variant">
        To get this solved
      </p>
      <div className="flex flex-wrap gap-xs">
        <button type="button" onClick={onContact} className={primaryBtn}>
          <span className="material-symbols-outlined text-base">chat</span>
          Contact our team
        </button>
        <button type="button" onClick={onUpload} className={outlineBtn}>
          <span className="material-symbols-outlined text-base">upload</span>
          Upload an issue
        </button>
        <button type="button" onClick={onCapture} className={outlineBtn}>
          <span className="material-symbols-outlined text-base">
            photo_camera
          </span>
          Capture an issue
        </button>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: Exclude<ChatMessage, { type: "cta" }> }) {
  if (message.type === "typing") {
    return (
      <div className="flex justify-start">
        <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-surface-container px-md py-sm">
          <span className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant/60 [animation-delay:-0.2s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant/60 [animation-delay:-0.1s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant/60" />
        </div>
      </div>
    );
  }

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        {message.type === "image" ? (
          <div className="max-w-[75%] overflow-hidden rounded-2xl rounded-br-sm border border-primary/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={message.src}
              alt={message.name}
              className="h-auto max-h-48 w-full object-cover"
            />
          </div>
        ) : (
          <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-md py-sm font-body text-body-md text-on-primary">
            {message.text}
          </p>
        )}
      </div>
    );
  }

  // Bot messages
  if (message.type === "estimate") {
    return (
      <div className="flex justify-start">
        <div className="max-w-[95%] rounded-2xl rounded-bl-sm border border-outline-variant/10 bg-white p-md shadow-sm">
          <InteriorEstimateCard estimate={message.estimate} />
        </div>
      </div>
    );
  }

  if (message.type === "recommendation") {
    return (
      <div className="flex justify-start">
        <div className="max-w-[90%] rounded-2xl rounded-bl-sm border border-outline-variant/10 bg-white p-md shadow-sm">
          <RecommendationCard recommendation={message.recommendation} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <p className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-sm bg-surface-container px-md py-sm font-body text-body-md text-on-surface">
        {message.text}
      </p>
    </div>
  );
}

function RecommendationCard({
  recommendation,
}: {
  recommendation: AIRecommendation;
}) {
  const severity = SEVERITY_STYLES[recommendation.severity];

  return (
    <div className="flex flex-col gap-sm text-left">
      <div className="flex flex-wrap items-center gap-xs">
        <span
          className={`inline-flex items-center rounded-full px-sm py-xs font-label text-label-sm leading-none ${severity.bg} ${severity.text}`}
        >
          {severity.label}
        </span>
        <span className="inline-flex items-center rounded-full bg-surface-container px-sm py-xs font-label text-label-sm leading-none text-on-surface-variant">
          {recommendation.category}
        </span>
      </div>

      <h3 className="font-headline text-headline-sm leading-snug text-primary">
        {recommendation.detectedIssue}
      </h3>
      <p className="font-body text-body-sm leading-relaxed text-on-surface-variant">
        {recommendation.summary}
      </p>

      <div className="rounded-lg border border-outline-variant/10 bg-surface-container-low p-sm">
        <p className="mb-xs flex items-center gap-xs font-label text-label-sm text-on-surface">
          <span className="material-symbols-outlined text-base text-secondary">
            auto_awesome
          </span>
          Recommended solutions
        </p>
        <ul className="space-y-xs">
          {recommendation.solutions.map((solution) => (
            <li
              key={solution}
              className="flex items-start gap-xs font-body text-body-sm leading-relaxed text-on-surface-variant"
            >
              <span className="material-symbols-outlined mt-0.5 shrink-0 text-base text-primary">
                check_circle
              </span>
              <span className="min-w-0 flex-1">{solution}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-sm">
        <div className="rounded-lg border border-outline-variant/10 p-sm">
          <p className="font-label text-label-sm text-on-surface-variant">
            Est. cost
          </p>
          <p className="font-headline text-body-md font-semibold leading-snug text-primary">
            {recommendation.estimatedCost}
          </p>
        </div>
        <div className="rounded-lg border border-outline-variant/10 p-sm">
          <p className="font-label text-label-sm text-on-surface-variant">
            Duration
          </p>
          <p className="font-headline text-body-md font-semibold leading-snug text-primary">
            {recommendation.estimatedDuration}
          </p>
        </div>
      </div>

      {recommendation.diagnostic ? (
        <details className="group rounded-lg border border-outline-variant/10 p-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between font-label text-label-sm text-primary">
            View full AI diagnostic
            <span className="material-symbols-outlined text-base transition-transform group-open:rotate-180">
              expand_more
            </span>
          </summary>
          <div className="mt-sm">
            <IssueDiagnosticDetails diagnostic={recommendation.diagnostic} />
          </div>
        </details>
      ) : null}
    </div>
  );
}
