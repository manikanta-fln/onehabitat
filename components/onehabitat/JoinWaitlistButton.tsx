"use client";

import { useCallback, useEffect, useState } from "react";
import type { WaitlistFormData } from "@/types/waitlist";
import { submitJoinlist } from "@/utils/api";
import WaitlistModal from "./WaitlistModal";

const INITIAL_FORM: WaitlistFormData = {
  fullName: "",
  email: "",
};

type JoinWaitlistButtonProps = {
  className?: string;
};

export default function JoinWaitlistButton({ className = "" }: JoinWaitlistButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<WaitlistFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setIsSubmitting(false);
    setSubmitError(null);
    setIsSubmitted(false);
    setForm(INITIAL_FORM);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        closeModal();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSubmitting, closeModal]);

  const handleChange = (field: keyof WaitlistFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitJoinlist({
        entry: form,
        source: "app_launch_section",
      });
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={className}>
        Join the Waitlist
      </button>

      {isOpen ? (
        <WaitlistModal
          form={form}
          isSubmitting={isSubmitting}
          isSubmitted={isSubmitted}
          submitError={submitError}
          onClose={closeModal}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      ) : null}
    </>
  );
}
