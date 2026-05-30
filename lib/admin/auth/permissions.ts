import type { AdminPermission, AdminRole } from "@/types/admin/auth";

const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    "dashboard:read",
    "issues:read",
    "issues:write",
    "bookings:read",
    "bookings:write",
    "customers:read",
    "customers:write",
    "analytics:read",
    "analytics:export",
    "settings:read",
    "settings:write",
    "users:read",
    "users:write",
    "audit:read",
  ],
  admin: [
    "dashboard:read",
    "issues:read",
    "issues:write",
    "bookings:read",
    "bookings:write",
    "customers:read",
    "customers:write",
    "analytics:read",
    "analytics:export",
    "settings:read",
    "settings:write",
    "users:read",
    "users:write",
    "audit:read",
  ],
  operations: [
    "dashboard:read",
    "issues:read",
    "issues:write",
    "bookings:read",
    "bookings:write",
    "customers:read",
    "customers:write",
    "analytics:read",
  ],
  viewer: [
    "dashboard:read",
    "issues:read",
    "bookings:read",
    "customers:read",
    "analytics:read",
  ],
};

export function getPermissionsForRole(role: AdminRole): AdminPermission[] {
  return ROLE_PERMISSIONS[role];
}

export function hasPermission(
  role: AdminRole,
  permission: AdminPermission
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function canManageRole(actorRole: AdminRole, targetRole: AdminRole): boolean {
  if (actorRole === "super_admin") return true;
  if (actorRole === "admin") return targetRole !== "super_admin";
  return false;
}

export const PERMISSION_DEFINITIONS: {
  key: AdminPermission;
  name: string;
  description: string;
}[] = [
  { key: "dashboard:read", name: "View Dashboard", description: "Access dashboard KPIs and widgets" },
  { key: "issues:read", name: "View Issues", description: "Read issue records" },
  { key: "issues:write", name: "Manage Issues", description: "Update and archive issues" },
  { key: "bookings:read", name: "View Bookings", description: "Read booking records" },
  { key: "bookings:write", name: "Manage Bookings", description: "Update booking status and assignments" },
  { key: "customers:read", name: "View Customers", description: "Read customer records" },
  { key: "customers:write", name: "Manage Customers", description: "Update customer information" },
  { key: "analytics:read", name: "View Analytics", description: "Access analytics reports" },
  { key: "analytics:export", name: "Export Analytics", description: "Export CSV and Excel reports" },
  { key: "settings:read", name: "View Settings", description: "Read platform settings" },
  { key: "settings:write", name: "Manage Settings", description: "Update platform settings" },
  { key: "users:read", name: "View Admin Users", description: "Read admin user accounts" },
  { key: "users:write", name: "Manage Admin Users", description: "Create and update admin users" },
  { key: "audit:read", name: "View Audit Logs", description: "Read audit trail" },
];

export const ROLE_DEFINITIONS: {
  key: AdminRole;
  name: string;
  description: string;
}[] = [
  { key: "super_admin", name: "Super Admin", description: "Full platform access including user management" },
  { key: "admin", name: "Admin", description: "Full operational access except super admin management" },
  { key: "operations", name: "Operations", description: "Day-to-day issue and booking management" },
  { key: "viewer", name: "Viewer", description: "Read-only access to operational data" },
];
