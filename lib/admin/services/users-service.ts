import { getDb } from "@/lib/mongodb";
import {
  listAdmins,
  createAdmin,
  updateAdmin,
  findAdminByEmail,
  findAdminById,
} from "@/lib/admin/repositories/admins";
import { createAuditLog } from "@/lib/admin/repositories/audit-logs";
import { hashPassword, validatePasswordStrength } from "@/lib/admin/auth/password";
import { canManageRole } from "@/lib/admin/auth/permissions";
import { toPublicAdminUser } from "@/lib/admin/services/auth-service";
import {
  buildPaginationResult,
} from "@/lib/admin/utils/pagination";
import type { PaginationParams } from "@/types/admin/api";
import type { AdminRole, AdminSession } from "@/types/admin/auth";
import { ADMIN_ROLES } from "@/types/admin/auth";

export async function getAdminUsersList(params: PaginationParams) {
  const db = await getDb();
  const { data, total } = await listAdmins(db, params);
  return buildPaginationResult(data.map(toPublicAdminUser), total, params);
}

export async function createAdminUser(
  input: {
    email: string;
    password: string;
    name: string;
    role: AdminRole;
  },
  session: AdminSession,
  meta?: { ipAddress?: string; userAgent?: string }
) {
  if (!ADMIN_ROLES.includes(input.role)) {
    throw new Error("Invalid role");
  }

  if (!canManageRole(session.role, input.role)) {
    throw new Error("You cannot assign this role");
  }

  const passwordError = validatePasswordStrength(input.password);
  if (passwordError) throw new Error(passwordError);

  const db = await getDb();
  const existing = await findAdminByEmail(db, input.email);
  if (existing) throw new Error("An admin with this email already exists");

  const adminId = await createAdmin(db, {
    email: input.email,
    passwordHash: await hashPassword(input.password),
    name: input.name,
    role: input.role,
  });

  await createAuditLog(db, {
    session,
    action: "admin.create",
    entityType: "admin",
    entityId: adminId.toString(),
    after: { email: input.email.toLowerCase(), role: input.role },
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  const created = await findAdminById(db, adminId.toString());
  return created ? toPublicAdminUser(created) : null;
}

export async function patchAdminUser(
  id: string,
  input: {
    name?: string;
    role?: AdminRole;
    isActive?: boolean;
    password?: string;
  },
  session: AdminSession,
  meta?: { ipAddress?: string; userAgent?: string }
) {
  const db = await getDb();
  const before = await findAdminById(db, id);
  if (!before) return null;

  if (input.role) {
    if (!ADMIN_ROLES.includes(input.role)) throw new Error("Invalid role");
    if (!canManageRole(session.role, input.role)) {
      throw new Error("You cannot assign this role");
    }
    if (!canManageRole(session.role, before.role)) {
      throw new Error("You cannot modify this admin");
    }
  }

  if (session.adminId === id && input.isActive === false) {
    throw new Error("You cannot deactivate your own account");
  }

  const updates: Parameters<typeof updateAdmin>[2] = {};
  if (input.name) updates.name = input.name;
  if (input.role) updates.role = input.role;
  if (typeof input.isActive === "boolean") updates.isActive = input.isActive;
  if (input.password) {
    const passwordError = validatePasswordStrength(input.password);
    if (passwordError) throw new Error(passwordError);
    updates.passwordHash = await hashPassword(input.password);
  }

  const updated = await updateAdmin(db, id, updates);
  if (!updated) return null;

  await createAuditLog(db, {
    session,
    action: "admin.update",
    entityType: "admin",
    entityId: id,
    before: { email: before.email, role: before.role, isActive: before.isActive },
    after: { email: updated.email, role: updated.role, isActive: updated.isActive },
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  return toPublicAdminUser(updated);
}
