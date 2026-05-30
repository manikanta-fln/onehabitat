export const ADMIN_ROLES = [
  "super_admin",
  "admin",
  "operations",
  "viewer",
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export type AdminPermission =
  | "dashboard:read"
  | "issues:read"
  | "issues:write"
  | "bookings:read"
  | "bookings:write"
  | "customers:read"
  | "customers:write"
  | "analytics:read"
  | "analytics:export"
  | "settings:read"
  | "settings:write"
  | "users:read"
  | "users:write"
  | "audit:read";

export type AdminSession = {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
  exp: number;
};

export type AdminPublicUser = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};
