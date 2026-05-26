"use client";

import { useEffect, useRef, useState } from "react";
import { useUploadIssue } from "./UploadIssueProvider";

type UploadIssueTriggerProps = {
  variant?: "primary" | "header";
  className?: string;
};

export default function UploadIssueTrigger({
  variant = "primary",
  className = "",
}: UploadIssueTriggerProps) {
  const { triggerCapture, triggerUpload } = useUploadIssue();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleCapture = () => {
    setIsOpen(false);
    triggerCapture();
  };

  const handleUpload = () => {
    setIsOpen(false);
    triggerUpload();
  };

  const buttonClass =
    variant === "header"
      ? "bg-primary-container text-on-primary-container px-md py-sm rounded-DEFAULT font-label text-label-lg hover:scale-95 active:scale-90 transition-transform inline-flex items-center gap-xs"
      : "bg-primary text-on-primary px-lg py-md rounded-DEFAULT font-label text-label-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-xs";

  return (
    <div ref={wrapperRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClass}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        Upload an Issue
        <span
          className={`material-symbols-outlined text-base transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          expand_more
        </span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute left-0 top-full z-[70] mt-sm min-w-[240px] rounded-lg border border-outline-variant/20 bg-white shadow-xl py-sm overflow-hidden"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleCapture}
            className="flex w-full items-center gap-md px-md py-sm text-left font-label text-label-lg text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-primary text-xl">
              photo_camera
            </span>
            Capture a photo
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={handleUpload}
            className="flex w-full items-center gap-md px-md py-sm text-left font-label text-label-lg text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-primary text-xl">
              upload
            </span>
            Upload from device
          </button>
        </div>
      )}
    </div>
  );
}
