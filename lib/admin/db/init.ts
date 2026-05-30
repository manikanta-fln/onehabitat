import type { Db } from "mongodb";
import {
  PERMISSION_DEFINITIONS,
  ROLE_DEFINITIONS,
  getPermissionsForRole,
} from "@/lib/admin/auth/permissions";
import { hashPassword } from "@/lib/admin/auth/password";
import { ADMIN_COLLECTIONS } from "@/lib/admin/db/collections";
import { getDb } from "@/lib/mongodb";
import type {
  AdminDocument,
  PermissionDocument,
  RoleDocument,
} from "@/types/admin/entities";

let initPromise: Promise<void> | null = null;

export async function ensureAdminDatabase(): Promise<void> {
  if (!initPromise) {
    initPromise = initializeAdminDatabase().catch((error) => {
      initPromise = null;
      throw error;
    });
  }
  await initPromise;
}

async function initializeAdminDatabase(): Promise<void> {
  const db = await getDb();
  await Promise.all([
    createIndexes(db),
    seedPermissions(db),
    seedRoles(db),
    seedDefaultAdmin(db),
    seedDashboardSettings(db),
  ]);
}

async function createIndexes(db: Db): Promise<void> {
  await Promise.all([
    db.collection(ADMIN_COLLECTIONS.admins).createIndexes([
      { key: { email: 1 }, unique: true, name: "admins_email_unique" },
      { key: { role: 1 }, name: "admins_role" },
      { key: { isActive: 1 }, name: "admins_is_active" },
    ]),
    db.collection(ADMIN_COLLECTIONS.roles).createIndexes([
      { key: { key: 1 }, unique: true, name: "roles_key_unique" },
    ]),
    db.collection(ADMIN_COLLECTIONS.permissions).createIndexes([
      { key: { key: 1 }, unique: true, name: "permissions_key_unique" },
    ]),
    db.collection(ADMIN_COLLECTIONS.auditLogs).createIndexes([
      { key: { createdAt: -1 }, name: "audit_logs_created_at" },
      { key: { entityType: 1, entityId: 1 }, name: "audit_logs_entity" },
      { key: { adminId: 1, createdAt: -1 }, name: "audit_logs_admin" },
    ]),
    db.collection(ADMIN_COLLECTIONS.bookingStatusHistory).createIndexes([
      { key: { bookingId: 1, createdAt: -1 }, name: "booking_status_history_booking" },
    ]),
    db.collection(ADMIN_COLLECTIONS.dashboardSettings).createIndexes([
      { key: { key: 1 }, unique: true, name: "dashboard_settings_key_unique" },
    ]),
    db.collection(ADMIN_COLLECTIONS.customers).createIndexes([
      { key: { email: 1 }, unique: true, name: "customers_email_unique" },
      { key: { updatedAt: -1 }, name: "customers_updated_at" },
    ]),
    db.collection(ADMIN_COLLECTIONS.issues).createIndexes([
      { key: { status: 1, createdAt: -1 }, name: "issues_status_created_at" },
      { key: { archived: 1, createdAt: -1 }, name: "issues_archived_created_at" },
      { key: { "recommendation.category": 1 }, name: "issues_category" },
      { key: { "recommendation.severity": 1 }, name: "issues_severity" },
    ]),
    db.collection(ADMIN_COLLECTIONS.bookings).createIndexes([
      { key: { createdAt: -1 }, name: "bookings_created_at" },
      { key: { customerId: 1 }, name: "bookings_customer_id" },
      { key: { issueId: 1 }, name: "bookings_issue_id" },
      { key: { status: 1, createdAt: -1 }, name: "bookings_status_created_at" },
      { key: { "booking.preferredDate": 1 }, name: "bookings_preferred_date" },
    ]),
    db.collection(ADMIN_COLLECTIONS.images).createIndexes([
      { key: { issueId: 1 }, unique: true, name: "images_issue_id_unique" },
    ]),
  ]);
}

async function seedPermissions(db: Db): Promise<void> {
  const now = new Date();
  for (const permission of PERMISSION_DEFINITIONS) {
    await db.collection<PermissionDocument>(ADMIN_COLLECTIONS.permissions).updateOne(
      { key: permission.key },
      {
        $set: {
          name: permission.name,
          description: permission.description,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
  }
}

async function seedRoles(db: Db): Promise<void> {
  const now = new Date();
  for (const role of ROLE_DEFINITIONS) {
    await db.collection<RoleDocument>(ADMIN_COLLECTIONS.roles).updateOne(
      { key: role.key },
      {
        $set: {
          name: role.name,
          description: role.description,
          permissions: getPermissionsForRole(role.key),
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
  }
}

async function seedDefaultAdmin(db: Db): Promise<void> {
  const email = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD;
  const name = process.env.ADMIN_SEED_NAME?.trim() || "Super Admin";

  if (!email || !password) return;

  const existing = await db
    .collection<AdminDocument>(ADMIN_COLLECTIONS.admins)
    .findOne({ email });

  if (existing) return;

  const now = new Date();
  await db.collection<AdminDocument>(ADMIN_COLLECTIONS.admins).insertOne({
    email,
    passwordHash: await hashPassword(password),
    name,
    role: "super_admin",
    isActive: true,
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now,
  });
}

async function seedDashboardSettings(db: Db): Promise<void> {
  const now = new Date();
  const defaults = [
    {
      key: "company",
      value: {
        brandName: "Onehabitat",
        brandEmail: "hello@onehabitat.com",
        brandPhone: "+91 83417 96243",
      },
    },
    {
      key: "upload",
      value: {
        maxImageBytes: 50 * 1024 * 1024,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/heic"],
      },
    },
    {
      key: "dashboard_preferences",
      value: {
        defaultDateRangeDays: 30,
        refreshIntervalSeconds: 60,
      },
    },
  ];

  for (const setting of defaults) {
    await db.collection(ADMIN_COLLECTIONS.dashboardSettings).updateOne(
      { key: setting.key },
      {
        $setOnInsert: {
          value: setting.value,
          updatedBy: null,
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true }
    );
  }
}
