"use client";

import { type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "@/hooks/admin/use-is-client";

function ModalPortal({ children }: { children: ReactNode }) {
  const mounted = useIsClient();

  if (!mounted) return null;
  return createPortal(
    <div data-admin-app className="admin-portal-root">
      {children}
    </div>,
    document.body
  );
}

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  destructive?: boolean;
};

export function ConfirmationModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  loading,
  destructive,
}: ModalProps) {
  if (!open) return null;

  return (
    <ModalPortal>
      <div
        className="admin-modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-confirmation-title"
      >
        <button
          type="button"
          className="admin-modal-backdrop"
          aria-label="Close dialog"
          onClick={onCancel}
        />
        <div className="admin-modal-panel p-6">
          <h2
            id="admin-confirmation-title"
            className="font-headline text-headline-sm text-on-surface"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-2 font-body text-body-sm leading-relaxed text-on-surface-variant">
              {description}
            </p>
          ) : null}
          <div className="admin-modal-footer mt-6 border-t-0 p-0">
            <button type="button" onClick={onCancel} className="admin-btn-secondary">
              {cancelLabel}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className={`admin-btn-primary disabled:opacity-60 ${
                destructive ? "!bg-error" : ""
              }`}
            >
              {loading ? "Working…" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

type FormModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
};

export function FormModal({ open, title, children, onClose, footer }: FormModalProps) {
  if (!open) return null;

  return (
    <ModalPortal>
      <div
        className="admin-modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-form-modal-title"
      >
        <button
          type="button"
          className="admin-modal-backdrop"
          aria-label="Close dialog"
          onClick={onClose}
        />
        <div className="admin-modal-panel admin-modal-panel--form">
          <div className="admin-modal-header">
            <h2
              id="admin-form-modal-title"
              className="min-w-0 flex-1 font-headline text-headline-sm text-on-surface"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="admin-modal-close"
            >
              <span className="material-symbols-outlined leading-none">close</span>
            </button>
          </div>
          <div className="admin-modal-body admin-modal-body--scroll">{children}</div>
          {footer ? <div className="admin-modal-footer">{footer}</div> : null}
        </div>
      </div>
    </ModalPortal>
  );
}

export function ImagePreviewModal({
  open,
  src,
  alt,
  onClose,
}: {
  open: boolean;
  src: string | null;
  alt: string;
  onClose: () => void;
}) {
  if (!open || !src) return null;

  return (
    <ModalPortal>
      <div
        className="admin-modal-overlay admin-modal-overlay--preview"
        role="dialog"
        aria-modal="true"
        aria-label={alt}
      >
        <button
          type="button"
          className="admin-modal-backdrop admin-modal-backdrop--dark"
          aria-label="Close preview"
          onClick={onClose}
        />
        <div className="admin-modal-panel admin-modal-panel--preview">
          <div className="mb-3 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="admin-modal-close"
            >
              <span className="material-symbols-outlined leading-none text-on-surface">close</span>
            </button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="mx-auto max-h-[75vh] w-full object-contain" />
        </div>
      </div>
    </ModalPortal>
  );
}

export function DetailDrawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <ModalPortal>
      <div className="admin-modal-overlay admin-modal-overlay--drawer">
        <button
          type="button"
          className="admin-modal-backdrop"
          aria-label="Close drawer"
          onClick={onClose}
        />
        <aside className="admin-drawer-panel">
          <div className="admin-modal-header sticky top-0 z-10 bg-white/95 backdrop-blur">
            <h2 className="min-w-0 flex-1 font-headline text-headline-sm text-on-surface">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="admin-modal-close"
            >
              <span className="material-symbols-outlined leading-none">close</span>
            </button>
          </div>
          <div className="admin-modal-body">{children}</div>
        </aside>
      </div>
    </ModalPortal>
  );
}
