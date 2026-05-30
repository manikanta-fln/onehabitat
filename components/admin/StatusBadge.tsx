"use client";

const STATUS_STYLES: Record<string, string> = {
  analyzed: "bg-secondary-container text-on-secondary-container",
  booked: "bg-primary-container/30 text-on-primary-container",
  pending: "bg-surface-container text-on-surface-variant",
  confirmed: "bg-tertiary-container/40 text-on-tertiary-container",
  scheduled: "bg-primary-container/20 text-primary",
  assigned: "bg-secondary-container/70 text-secondary",
  in_progress: "bg-tertiary-container text-on-tertiary-container",
  completed: "bg-secondary-container text-on-secondary-container",
  cancelled: "bg-error-container text-on-error-container",
  low: "bg-secondary-container text-on-secondary-container",
  medium: "bg-tertiary-container text-on-tertiary-container",
  high: "bg-error-container text-on-error-container",
  warning: "bg-tertiary-container text-on-tertiary-container",
  info: "bg-primary-container/20 text-primary",
  error: "bg-error-container text-on-error-container",
};

export function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone?: string;
}) {
  const key = tone ?? label.toLowerCase().replace(/\s+/g, "_");
  const className = STATUS_STYLES[key] ?? "bg-surface-container text-on-surface-variant";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 font-label text-label-sm capitalize ${className}`}
    >
      {label.replace(/_/g, " ")}
    </span>
  );
}
