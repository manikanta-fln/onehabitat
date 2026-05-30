"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  adminToast,
  dismissAdminToast,
  getAdminValidationMessage,
  subscribeAdminToasts,
  type AdminToastItem,
} from "@/lib/admin/toast";
import { useIsClient } from "@/hooks/admin/use-is-client";

function AdminToastViewport({ items }: { items: AdminToastItem[] }) {
  if (items.length === 0) return null;

  return (
    <div
      className="admin-toast-viewport"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="admin-toast admin-toast--error"
          role="alert"
        >
          <span
            className="material-symbols-outlined admin-toast__icon"
            aria-hidden="true"
          >
            error
          </span>
          <p className="admin-toast__message">{item.message}</p>
          <button
            type="button"
            className="admin-toast__close"
            aria-label="Dismiss notification"
            onClick={() => dismissAdminToast(item.id)}
          >
            <span className="material-symbols-outlined leading-none">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const mounted = useIsClient();
  const [items, setItems] = useState<AdminToastItem[]>([]);

  useEffect(() => subscribeAdminToasts(setItems), []);

  useEffect(() => {
    function handleInvalid(event: Event) {
      const target = event.target;
      if (
        !(target instanceof HTMLInputElement) &&
        !(target instanceof HTMLSelectElement) &&
        !(target instanceof HTMLTextAreaElement)
      ) {
        return;
      }

      if (!target.closest("[data-admin-app]")) return;

      event.preventDefault();
      adminToast.error(getAdminValidationMessage(target));
    }

    document.addEventListener("invalid", handleInvalid, true);
    return () => document.removeEventListener("invalid", handleInvalid, true);
  }, []);

  return (
    <>
      {children}
      {mounted
        ? createPortal(
            <div data-admin-app className="admin-portal-root">
              <AdminToastViewport items={items} />
            </div>,
            document.body
          )
        : null}
    </>
  );
}
