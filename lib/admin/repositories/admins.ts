import { ObjectId, type Db } from "mongodb";
import { ADMIN_COLLECTIONS } from "@/lib/admin/db/collections";
import type { AdminDocument } from "@/types/admin/entities";
import type { AdminRole } from "@/types/admin/auth";
import type { PaginationParams } from "@/types/admin/api";
import { getSkip } from "@/lib/admin/utils/pagination";

export async function findAdminByEmail(db: Db, email: string) {
  return db
    .collection<AdminDocument>(ADMIN_COLLECTIONS.admins)
    .findOne({ email: email.trim().toLowerCase() });
}

export async function findAdminById(db: Db, id: string) {
  if (!ObjectId.isValid(id)) return null;
  return db
    .collection<AdminDocument>(ADMIN_COLLECTIONS.admins)
    .findOne({ _id: new ObjectId(id) });
}

export async function updateAdminLastLogin(db: Db, id: ObjectId) {
  await db.collection<AdminDocument>(ADMIN_COLLECTIONS.admins).updateOne(
    { _id: id },
    { $set: { lastLoginAt: new Date(), updatedAt: new Date() } }
  );
}

export async function listAdmins(db: Db, params: PaginationParams) {
  const filter = {};
  const sortField = params.sortBy ?? "createdAt";
  const sortOrder = params.sortOrder === "asc" ? 1 : -1;

  const [data, total] = await Promise.all([
    db
      .collection<AdminDocument>(ADMIN_COLLECTIONS.admins)
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(getSkip(params))
      .limit(params.limit)
      .toArray(),
    db.collection<AdminDocument>(ADMIN_COLLECTIONS.admins).countDocuments(filter),
  ]);

  return { data, total };
}

export async function createAdmin(
  db: Db,
  input: {
    email: string;
    passwordHash: string;
    name: string;
    role: AdminRole;
  }
) {
  const now = new Date();
  const result = await db.collection<AdminDocument>(ADMIN_COLLECTIONS.admins).insertOne({
    email: input.email.trim().toLowerCase(),
    passwordHash: input.passwordHash,
    name: input.name.trim(),
    role: input.role,
    isActive: true,
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now,
  });
  return result.insertedId;
}

export async function updateAdmin(
  db: Db,
  id: string,
  updates: Partial<Pick<AdminDocument, "name" | "role" | "isActive" | "passwordHash">>
) {
  if (!ObjectId.isValid(id)) return null;
  const result = await db
    .collection<AdminDocument>(ADMIN_COLLECTIONS.admins)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
  return result;
}
