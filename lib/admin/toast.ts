export type AdminToastVariant = "error";

export type AdminToastItem = {
  id: string;
  message: string;
  variant: AdminToastVariant;
};

type AdminToastListener = (toasts: AdminToastItem[]) => void;

const AUTO_DISMISS_MS = 5000;
const MAX_TOASTS = 4;

let toasts: AdminToastItem[] = [];
const listeners = new Set<AdminToastListener>();
const dismissTimers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  for (const listener of listeners) {
    listener([...toasts]);
  }
}

function scheduleDismiss(id: string) {
  const existing = dismissTimers.get(id);
  if (existing) clearTimeout(existing);

  dismissTimers.set(
    id,
    setTimeout(() => {
      dismissAdminToast(id);
    }, AUTO_DISMISS_MS)
  );
}

export function dismissAdminToast(id: string) {
  const timer = dismissTimers.get(id);
  if (timer) {
    clearTimeout(timer);
    dismissTimers.delete(id);
  }

  const next = toasts.filter((toast) => toast.id !== id);
  if (next.length === toasts.length) return;

  toasts = next;
  emit();
}

function pushToast(message: string, variant: AdminToastVariant) {
  const trimmed = message.trim();
  if (!trimmed) return;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  toasts = [...toasts, { id, message: trimmed, variant }].slice(-MAX_TOASTS);
  emit();
  scheduleDismiss(id);
}

export const adminToast = {
  error(message: string) {
    pushToast(message, "error");
  },
};

export function subscribeAdminToasts(listener: AdminToastListener) {
  listeners.add(listener);
  listener([...toasts]);
  return () => {
    listeners.delete(listener);
  };
}

export function getAdminErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

export function getAdminValidationMessage(target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  if (target.validationMessage.trim()) {
    return target.validationMessage;
  }

  const label = target.closest("label")?.querySelector(".admin-label")?.textContent?.trim();
  if (label) {
    return `${label} is required.`;
  }

  return "Please check the highlighted fields and try again.";
}
