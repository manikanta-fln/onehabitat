"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalPortalProps = {
  children: ReactNode;
};

function subscribe() {
  return () => {};
}

/** Renders modals on document.body so fixed centering covers the full viewport. */
export default function ModalPortal({ children }: ModalPortalProps) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted) return null;

  return createPortal(children, document.body);
}
