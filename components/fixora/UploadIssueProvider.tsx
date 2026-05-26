"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  AIRecommendation,
  BookingFormData,
  UploadIssueStep,
} from "@/types/upload-issue";
import { analyzeIssue, createBooking } from "@/utils/api";
import { isClientImageFile } from "@/lib/form-file";
import UploadIssueModal from "./UploadIssueModal";

type UploadIssueContextValue = {
  triggerCapture: () => void;
  triggerUpload: () => void;
};

const UploadIssueContext = createContext<UploadIssueContextValue | null>(null);

const INITIAL_BOOKING: BookingFormData = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  preferredDate: "",
  notes: "",
};

export function useUploadIssue() {
  const ctx = useContext(UploadIssueContext);
  if (!ctx) {
    throw new Error("useUploadIssue must be used within UploadIssueProvider");
  }
  return ctx;
}

export default function UploadIssueProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<UploadIssueStep>("analyzing");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(
    null
  );
  const [issueId, setIssueId] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingFormData>(INITIAL_BOOKING);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const captureInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const resetFlow = useCallback(() => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setImageFile(null);
    setIssueId(null);
    setRecommendation(null);
    setBooking(INITIAL_BOOKING);
    setStep("analyzing");
    setIsSubmitting(false);
    setIsBooked(false);
    setSubmitError(null);
  }, [imagePreview]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    resetFlow();
  }, [resetFlow]);

  const startAnalysis = useCallback(async (file: File) => {
    const preview = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(preview);
    setRecommendation(null);
    setStep("analyzing");
    setIsModalOpen(true);

    try {
      const { issueId: savedIssueId, recommendation: result } =
        await analyzeIssue(file);
      setIssueId(savedIssueId);
      setRecommendation(result);
      setStep("results");
    } catch (err) {
      setRecommendation({
        detectedIssue: "Unable to analyze image",
        category: "General",
        severity: "medium",
        summary:
          err instanceof Error
            ? err.message
            : "Please try again with a clearer photo of the issue.",
        solutions: ["Retake photo in good lighting", "Contact support for help"],
        estimatedCost: "—",
        estimatedDuration: "—",
      });
      setStep("results");
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && isClientImageFile(file)) {
        void startAnalysis(file);
      }
      e.target.value = "";
    },
    [startAnalysis]
  );

  const triggerCapture = useCallback(() => {
    captureInputRef.current?.click();
  }, []);

  const triggerUpload = useCallback(() => {
    uploadInputRef.current?.click();
  }, []);

  const goToBooking = useCallback(() => {
    setStep("booking");
  }, []);

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
        setSubmitError(
          "Missing issue details. Please upload your issue again."
        );
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await createBooking({
          issueId,
          booking,
          recommendation,
        });
        setIsBooked(true);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "Failed to save booking"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [issueId, booking, recommendation]
  );

  useEffect(() => {
    if (!isModalOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen, closeModal]);

  return (
    <UploadIssueContext.Provider value={{ triggerCapture, triggerUpload }}>
      {children}

      <input
        ref={captureInputRef}
        type="file"
        accept="image/*,.heic,.heif"
        capture="environment"
        className="sr-only"
        aria-hidden
        onChange={handleFileSelect}
      />
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*,.heic,.heif"
        className="sr-only"
        aria-hidden
        onChange={handleFileSelect}
      />

      {isModalOpen && (
        <UploadIssueModal
          step={step}
          imagePreview={imagePreview}
          imageFile={imageFile}
          recommendation={recommendation}
          booking={booking}
          isSubmitting={isSubmitting}
          isBooked={isBooked}
          submitError={submitError}
          canBook={!!issueId}
          onClose={closeModal}
          onGoToBooking={goToBooking}
          onUpdateBooking={updateBooking}
          onSubmitBooking={submitBooking}
          onBackToResults={() => setStep("results")}
        />
      )}
    </UploadIssueContext.Provider>
  );
}
