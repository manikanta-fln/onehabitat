import type { Db } from "mongodb";
import { ADMIN_COLLECTIONS } from "@/lib/admin/db/collections";
import type { DashboardSettingsDocument } from "@/types/admin/entities";

export async function getDashboardSetting(db: Db, key: string) {
  return db
    .collection<DashboardSettingsDocument>(ADMIN_COLLECTIONS.dashboardSettings)
    .findOne({ key });
}

export async function listDashboardSettings(db: Db) {
  return db
    .collection<DashboardSettingsDocument>(ADMIN_COLLECTIONS.dashboardSettings)
    .find({})
    .sort({ key: 1 })
    .toArray();
}

export async function upsertDashboardSetting(
  db: Db,
  key: string,
  value: Record<string, unknown>,
  updatedBy: string | null
) {
  const { ObjectId } = await import("mongodb");
  const now = new Date();

  return db
    .collection<DashboardSettingsDocument>(ADMIN_COLLECTIONS.dashboardSettings)
    .findOneAndUpdate(
      { key },
      {
        $set: {
          value,
          updatedBy: updatedBy && ObjectId.isValid(updatedBy) ? new ObjectId(updatedBy) : null,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: "after" }
    );
}

export async function listRoles(db: Db) {
  return db.collection(ADMIN_COLLECTIONS.roles).find({}).sort({ key: 1 }).toArray();
}

export async function listPermissions(db: Db) {
  return db
    .collection(ADMIN_COLLECTIONS.permissions)
    .find({})
    .sort({ key: 1 })
    .toArray();
}
