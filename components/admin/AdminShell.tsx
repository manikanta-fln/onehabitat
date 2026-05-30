"use client";

import type { ReactNode } from "react";
import { AdminSidebar } from "./Sidebar";
import { AdminTopbar } from "./Topbar";

type AdminShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function AdminShell({
  children,
  title,
  subtitle,
  actions,
}: AdminShellProps) {
  return (
    <div className="bg-[#f5f5f7] text-on-surface">
      <AdminSidebar />
      <div className="flex min-h-[100dvh] flex-col pt-14 lg:pt-0 lg:pl-[280px]">
        <AdminTopbar title={title} subtitle={subtitle} actions={actions} />
        <main className="flex-1 px-4 pb-6 pt-4 md:px-8 md:pt-6 lg:px-10 lg:pb-8">
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
