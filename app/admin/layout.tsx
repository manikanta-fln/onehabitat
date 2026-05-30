import type { ReactNode } from "react";
import { AdminProviders } from "@/features/admin/providers";
import "./admin.css";

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div data-admin-app className="admin-app font-body antialiased">
      <AdminProviders>{children}</AdminProviders>
    </div>
  );
}
