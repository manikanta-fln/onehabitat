"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AdminToastProvider } from "@/components/admin/AdminToast";
import {
  AdminQueryProvider,
  createAdminQueryClient,
} from "@/hooks/admin/query-provider";

export function AdminProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createAdminQueryClient);

  return (
    <AdminQueryProvider client={queryClient}>
      <AdminToastProvider>{children}</AdminToastProvider>
    </AdminQueryProvider>
  );
}

export function useDebouncedValue<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
