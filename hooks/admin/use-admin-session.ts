"use client";

import { useQuery } from "@tanstack/react-query";
import { getPermissionsForRole } from "@/lib/admin/auth/permissions";
import { adminFetch } from "@/services/admin/api-client";
import type { AdminPermission, AdminPublicUser } from "@/types/admin/auth";

type MeResponse = {
  user: AdminPublicUser;
  session: { role: AdminPublicUser["role"] };
};

export function useAdminSession() {
  return useQuery({
    queryKey: ["admin", "session"],
    queryFn: () => adminFetch<MeResponse>("/api/admin/auth/login"),
  });
}

export function useAdminPermission(permission: AdminPermission) {
  const { data } = useAdminSession();
  if (!data?.session.role) return false;
  return getPermissionsForRole(data.session.role).includes(permission);
}
