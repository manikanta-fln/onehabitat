import { getDb } from "@/lib/mongodb";
import {
  listDashboardSettings,
  upsertDashboardSetting,
  listRoles,
  listPermissions,
} from "@/lib/admin/repositories/settings";
import { createAuditLog } from "@/lib/admin/repositories/audit-logs";
import { serializeDate } from "@/lib/admin/utils/serialize";
import type { AdminSession } from "@/types/admin/auth";

export async function getSettingsBundle() {
  const db = await getDb();
  const [settings, roles, permissions] = await Promise.all([
    listDashboardSettings(db),
    listRoles(db),
    listPermissions(db),
  ]);

  return {
    settings: settings.map((setting) => ({
      key: setting.key,
      value: setting.value,
      updatedAt: serializeDate(setting.updatedAt) ?? "",
    })),
    roles: roles.map((role) => ({
      key: role.key,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    })),
    permissions: permissions.map((permission) => ({
      key: permission.key,
      name: permission.name,
      description: permission.description,
    })),
  };
}

export async function updateSetting(
  key: string,
  value: Record<string, unknown>,
  session: AdminSession,
  meta?: { ipAddress?: string; userAgent?: string }
) {
  const db = await getDb();
  const before = (await listDashboardSettings(db)).find((item) => item.key === key);
  const updated = await upsertDashboardSetting(db, key, value, session.adminId);

  await createAuditLog(db, {
    session,
    action: "settings.update",
    entityType: "dashboard_settings",
    entityId: key,
    before: before ? { value: before.value } : null,
    after: { value },
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  return {
    key: updated?.key ?? key,
    value: updated?.value ?? value,
    updatedAt: serializeDate(updated?.updatedAt) ?? "",
  };
}
