"use client";

import type { ReactNode } from "react";

type AdminPageContentProps = {
  children: ReactNode;
  className?: string;
};

export function AdminPageContent({
  children,
  className = "",
}: AdminPageContentProps) {
  return (
    <div className={`mx-auto flex w-full max-w-[1600px] flex-col gap-6 ${className}`}>
      {children}
    </div>
  );
}
