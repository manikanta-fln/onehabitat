import { ObjectId, type Db } from "mongodb";
import { ADMIN_COLLECTIONS } from "@/lib/admin/db/collections";
import type { AuditLogDocument } from "@/types/admin/entities";
import type { AdminSession } from "@/types/admin/auth";

type CreateAuditLogInput = {
  session: AdminSession;
  action: string;
  entityType: string;
  entityId: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
};

export async function createAuditLog(
  db: Db,
  input: CreateAuditLogInput
): Promise<void> {
  const doc: AuditLogDocument = {
    adminId: new ObjectId(input.session.adminId),
    adminEmail: input.session.email,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    before: input.before ?? null,
    after: input.after ?? null,
    metadata: input.metadata,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    createdAt: new Date(),
  };

  await db.collection<AuditLogDocument>(ADMIN_COLLECTIONS.auditLogs).insertOne(doc);
}

export async function listAuditLogsForEntity(
  db: Db,
  entityType: string,
  entityId: string,
  limit = 50
) {
  return db
    .collection<AuditLogDocument>(ADMIN_COLLECTIONS.auditLogs)
    .find({ entityType, entityId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}
