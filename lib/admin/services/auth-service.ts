import { ensureAdminDatabase } from "@/lib/admin/db/init";
import { getDb } from "@/lib/mongodb";
import { verifyPassword } from "@/lib/admin/auth/password";
import {
  createSessionToken,
  getSessionCookieOptions,
} from "@/lib/admin/auth/session";
import {
  findAdminByEmail,
  findAdminById,
  updateAdminLastLogin,
} from "@/lib/admin/repositories/admins";
import { createAuditLog } from "@/lib/admin/repositories/audit-logs";
import type { AdminPublicUser } from "@/types/admin/auth";
import { serializeDate, serializeId } from "@/lib/admin/utils/serialize";

export function toPublicAdminUser(admin: {
  _id?: { toString(): string };
  email: string;
  name: string;
  role: AdminPublicUser["role"];
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): AdminPublicUser {
  return {
    id: serializeId(admin._id),
    email: admin.email,
    name: admin.name,
    role: admin.role,
    isActive: admin.isActive,
    lastLoginAt: serializeDate(admin.lastLoginAt),
    createdAt: serializeDate(admin.createdAt) ?? "",
    updatedAt: serializeDate(admin.updatedAt) ?? "",
  };
}

export async function loginAdmin(input: {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  await ensureAdminDatabase();
  const db = await getDb();
  const admin = await findAdminByEmail(db, input.email);

  if (!admin || !admin.isActive) {
    throw new Error("Invalid email or password");
  }

  const valid = await verifyPassword(input.password, admin.passwordHash);
  if (!valid) {
    throw new Error("Invalid email or password");
  }

  await updateAdminLastLogin(db, admin._id!);

  const token = await createSessionToken({
    adminId: admin._id!.toString(),
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  await createAuditLog(db, {
    session: {
      adminId: admin._id!.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
      exp: 0,
    },
    action: "admin.login",
    entityType: "admin",
    entityId: admin._id!.toString(),
    after: { email: admin.email },
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });

  return {
    token,
    cookieOptions: getSessionCookieOptions(),
    user: toPublicAdminUser(admin),
  };
}

export async function getCurrentAdmin(adminId: string) {
  const db = await getDb();
  const admin = await findAdminById(db, adminId);
  if (!admin || !admin.isActive) return null;
  return toPublicAdminUser(admin);
}
