import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { ADMIN_COLLECTIONS } from "@/lib/admin/db/collections";
import {
  DEFAULT_MAX_GALLERY_IMAGE_BYTES,
  DEFAULT_MAX_GALLERY_VIDEO_BYTES,
} from "@/lib/gallery-media-constants";
import { parseGalleryMediaFromFormData } from "@/lib/form-gallery-media";
import {
  deleteGalleryMedia,
  findGalleryMediaById,
  listAllGalleryMedia,
  listGalleryMedia,
  openGalleryMediaStream,
  saveGalleryMedia,
  type GalleryMediaFilters,
} from "@/lib/admin/repositories/gallery-media";
import { buildPaginationResult } from "@/lib/admin/utils/pagination";
import { serializeDate, serializeId } from "@/lib/admin/utils/serialize";
import type { PaginationParams } from "@/types/admin/api";
import type {
  GalleryCategory,
  GalleryMediaDocument,
  GalleryMediaPublic,
} from "@/types/gallery-media";
import {
  getGalleryCategoryLabel,
  isGalleryCategory,
} from "@/types/gallery-media";

function toPublic(media: GalleryMediaDocument): GalleryMediaPublic {
  const id = serializeId(media._id);
  const category =
    media.category && isGalleryCategory(media.category) ? media.category : null;

  return {
    id,
    fileName: media.fileName,
    mimeType: media.mimeType,
    mediaType: media.mediaType,
    category,
    categoryLabel: getGalleryCategoryLabel(category),
    sizeBytes: media.sizeBytes,
    width: media.width,
    height: media.height,
    aspectRatio: media.aspectRatio,
    aspectValue: media.aspectValue,
    title: media.title,
    alt: media.alt,
    url: `/api/media/${id}`,
    createdAt: serializeDate(media.createdAt) ?? "",
  };
}

async function getUploadLimits() {
  const db = await getDb();
  const setting = await db
    .collection(ADMIN_COLLECTIONS.dashboardSettings)
    .findOne({ key: "gallery_upload" });

  const value = (setting?.value ?? {}) as Record<string, unknown>;
  const maxImageBytes =
    typeof value.maxImageBytes === "number" && value.maxImageBytes > 0
      ? value.maxImageBytes
      : DEFAULT_MAX_GALLERY_IMAGE_BYTES;
  const maxVideoBytes =
    typeof value.maxVideoBytes === "number" && value.maxVideoBytes > 0
      ? value.maxVideoBytes
      : DEFAULT_MAX_GALLERY_VIDEO_BYTES;

  return { maxImageBytes, maxVideoBytes };
}

export async function getAdminGalleryMedia(
  params: PaginationParams,
  filters: GalleryMediaFilters
) {
  const db = await getDb();
  const { data, total } = await listGalleryMedia(db, params, filters);

  return buildPaginationResult(
    data.map((row) => ({
      ...toPublic(row),
      uploadedBy: serializeId(row.uploadedBy),
    })),
    total,
    params
  );
}

export async function getPublicGalleryMedia(category?: GalleryCategory) {
  const db = await getDb();
  const data = await listAllGalleryMedia(db, category);
  return { media: data.map(toPublic) };
}

export async function uploadGalleryMedia(
  formData: FormData,
  adminId: string
) {
  const limits = await getUploadLimits();
  const parsed = await parseGalleryMediaFromFormData(formData, limits);

  if (!parsed.ok) {
    const error = new Error(parsed.error) as Error & { status: number };
    error.status = 400;
    throw error;
  }

  const db = await getDb();
  const saved = await saveGalleryMedia(
    db,
    parsed.file,
    new ObjectId(adminId)
  );

  return toPublic(saved);
}

export async function removeGalleryMedia(id: string) {
  const db = await getDb();
  const deleted = await deleteGalleryMedia(db, id);
  if (!deleted) {
    const error = new Error("Media not found") as Error & { status: number };
    error.status = 404;
    throw error;
  }
}

export async function getGalleryMediaFile(id: string) {
  const db = await getDb();
  const media = await findGalleryMediaById(db, id);
  if (!media) return null;

  const stream = await openGalleryMediaStream(db, media.gridFsId);
  return { media, stream };
}

export async function getGalleryUploadLimits() {
  return getUploadLimits();
}
