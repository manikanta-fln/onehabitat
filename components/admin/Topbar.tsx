"use client";

import type { ReactNode } from "react";
import { adminLogout } from "@/services/admin/api-client";

type AdminTopbarProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function AdminTopbar({ title, subtitle, actions }: AdminTopbarProps) {
  return (
    <header className="sticky top-14 z-30 border-b border-outline-variant/10 bg-white/85 backdrop-blur-xl lg:top-0">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-6 lg:px-10">
        <div className="min-w-0 flex-1 text-left">
          <h1 className="font-headline text-headline-sm leading-tight text-on-surface sm:text-headline-md">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 font-body text-body-sm leading-relaxed text-on-surface-variant">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex w-full flex-shrink-0 flex-wrap items-center justify-start gap-2 sm:gap-3 md:w-auto md:justify-end">
          {actions ? (
            <div className="flex flex-wrap items-center justify-start gap-2 sm:gap-3">
              {actions}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => void adminLogout()}
            className="admin-btn-secondary"
          >
            <span className="material-symbols-outlined text-[1.125rem] leading-none">
              logout
            </span>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
