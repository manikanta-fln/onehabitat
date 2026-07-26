import {
  GridFSBucket,
  ObjectId,
  type Db,
  type Filter,
} from "mongodb";
import {
  ADMIN_COLLECTIONS,
  GALLERY_GRIDFS_BUCKET,
} from "@/lib/admin/db/collections";
import { classifyAspectRatio } from "@/lib/gallery-media-constants";
import type { ParsedGalleryUpload } from "@/lib/form-gallery-media";
import type {
  GalleryCategory,
  GalleryMediaDocument,
} from "@/types/gallery-media";
import type { PaginationParams } from "@/types/admin/api";
import { getSkip } from "@/lib/admin/utils/pagination";

export type GalleryMediaFilters = {
  mediaType?: "image" | "video";
  aspectRatio?: "portrait" | "landscape" | "square";
  category?: GalleryCategory;
};

function getBucket(db: Db) {
  return new GridFSBucket(db, { bucketName: GALLERY_GRIDFS_BUCKET });
}

export async function saveGalleryMedia(
  db: Db,
  file: ParsedGalleryUpload,
  uploadedBy: ObjectId
): Promise<GalleryMediaDocument> {
  const bucket = getBucket(db);
  const { aspectRatio, aspectValue } = classifyAspectRatio(file.width, file.height);
  const now = new Date();

  const uploadStream = bucket.openUploadStream(file.fileName, {
    metadata: {
      mediaType: file.mediaType,
      mimeType: file.mimeType,
      category: file.category,
      uploadedBy: uploadedBy.toString(),
    },
  });

  await new Promise<void>((resolve, reject) => {
    uploadStream.on("error", reject);
    uploadStream.on("finish", () => resolve());
    uploadStream.end(file.buffer);
  });

  const doc: GalleryMediaDocument = {
    fileName: file.fileName,
    mimeType: file.mimeType,
    mediaType: file.mediaType,
    category: file.category,
    sizeBytes: file.sizeBytes,
    width: file.width,
    height: file.height,
    aspectRatio,
    aspectValue,
    title: file.title,
    alt: file.alt,
    gridFsId: uploadStream.id as ObjectId,
    uploadedBy,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db
    .collection<GalleryMediaDocument>(ADMIN_COLLECTIONS.galleryMedia)
    .insertOne(doc);

  return { ...doc, _id: result.insertedId };
}

export async function listGalleryMedia(
  db: Db,
  params: PaginationParams,
  filters: GalleryMediaFilters = {}
) {
  const filter: Filter<GalleryMediaDocument> = {};
  if (filters.mediaType) filter.mediaType = filters.mediaType;
  if (filters.aspectRatio) filter.aspectRatio = filters.aspectRatio;
  if (filters.category) filter.category = filters.category;

  const sortField = params.sortBy ?? "createdAt";
  const sortOrder = params.sortOrder === "asc" ? 1 : -1;

  const [data, total] = await Promise.all([
    db
      .collection<GalleryMediaDocument>(ADMIN_COLLECTIONS.galleryMedia)
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(getSkip(params))
      .limit(params.limit)
      .toArray(),
    db
      .collection<GalleryMediaDocument>(ADMIN_COLLECTIONS.galleryMedia)
      .countDocuments(filter),
  ]);

  return { data, total };
}

export async function listAllGalleryMedia(
  db: Db,
  category?: GalleryCategory
): Promise<GalleryMediaDocument[]> {
  const filter: Filter<GalleryMediaDocument> = {};
  if (category) filter.category = category;

  return db
    .collection<GalleryMediaDocument>(ADMIN_COLLECTIONS.galleryMedia)
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();
}

export async function findGalleryMediaById(
  db: Db,
  id: string
): Promise<GalleryMediaDocument | null> {
  if (!ObjectId.isValid(id)) return null;
  return db
    .collection<GalleryMediaDocument>(ADMIN_COLLECTIONS.galleryMedia)
    .findOne({ _id: new ObjectId(id) });
}

export async function deleteGalleryMedia(
  db: Db,
  id: string
): Promise<boolean> {
  const media = await findGalleryMediaById(db, id);
  if (!media?._id) return false;

  const bucket = getBucket(db);
  try {
    await bucket.delete(media.gridFsId);
  } catch {
    // GridFS file may already be missing; still remove metadata
  }

  const result = await db
    .collection<GalleryMediaDocument>(ADMIN_COLLECTIONS.galleryMedia)
    .deleteOne({ _id: media._id });

  return result.deletedCount === 1;
}

export async function openGalleryMediaStream(db: Db, gridFsId: ObjectId) {
  const bucket = getBucket(db);
  return bucket.openDownloadStream(gridFsId);
}
