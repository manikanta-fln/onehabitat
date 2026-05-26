import type { Db, ObjectId } from "mongodb";
import type { ImageDocument } from "@/types/database";

export async function saveIssueImage(
  db: Db,
  issueId: ObjectId,
  file: {
    buffer: Buffer;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
  }
): Promise<ObjectId> {
  const imageDoc: ImageDocument = {
    issueId,
    fileName: file.fileName,
    mimeType: file.mimeType,
    data: file.buffer,
    sizeBytes: file.sizeBytes,
    createdAt: new Date(),
  };

  const result = await db.collection<ImageDocument>("images").insertOne(imageDoc);
  return result.insertedId;
}

export async function getIssueImage(
  db: Db,
  issueId: ObjectId
): Promise<ImageDocument | null> {
  return db.collection<ImageDocument>("images").findOne({ issueId });
}
