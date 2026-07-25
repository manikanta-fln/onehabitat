import {
  DEFAULT_MAX_GALLERY_IMAGE_BYTES,
  DEFAULT_MAX_GALLERY_VIDEO_BYTES,
  defaultMimeFromExtension,
  detectGalleryMediaType,
} from "@/lib/gallery-media-constants";
import type { GalleryMediaType } from "@/types/gallery-media";
import type { ParsedUploadFile } from "@/lib/form-file";

export type ParsedGalleryUpload = ParsedUploadFile & {
  mediaType: GalleryMediaType;
  width: number;
  height: number;
  title: string;
  alt: string;
};

export type GalleryUploadLimits = {
  maxImageBytes: number;
  maxVideoBytes: number;
};

function parsePositiveInt(value: FormDataEntryValue | null, fallback: number): number {
  if (typeof value !== "string") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.round(parsed);
}

/**
 * Parse a gallery image/video upload from multipart form data.
 * Expects fields: file, width, height, optional title/alt.
 */
export async function parseGalleryMediaFromFormData(
  formData: FormData,
  limits: GalleryUploadLimits = {
    maxImageBytes: DEFAULT_MAX_GALLERY_IMAGE_BYTES,
    maxVideoBytes: DEFAULT_MAX_GALLERY_VIDEO_BYTES,
  }
): Promise<{ ok: true; file: ParsedGalleryUpload } | { ok: false; error: string }> {
  const entry = formData.get("file");

  if (!entry || typeof entry === "string") {
    return { ok: false, error: "No file provided" };
  }

  const blob = entry as Blob;
  const buffer = Buffer.from(await blob.arrayBuffer());

  if (buffer.length === 0) {
    return { ok: false, error: "Empty file" };
  }

  const fileName =
    "name" in entry && typeof entry.name === "string" && entry.name.trim()
      ? entry.name.trim()
      : "upload";

  const mimeType =
    blob.type && blob.type.trim()
      ? blob.type.trim().toLowerCase()
      : defaultMimeFromExtension(fileName);

  const mediaType = detectGalleryMediaType(mimeType, fileName);
  if (!mediaType) {
    return {
      ok: false,
      error:
        "Unsupported file type. Images: JPEG, PNG, AVIF, HEIC. Videos: MP4, WebM, MOV.",
    };
  }

  const maxBytes =
    mediaType === "image" ? limits.maxImageBytes : limits.maxVideoBytes;

  if (buffer.length > maxBytes) {
    const limitMb = Math.round(maxBytes / (1024 * 1024));
    return {
      ok: false,
      error: `${mediaType === "image" ? "Image" : "Video"} exceeds the ${limitMb} MB upload limit`,
    };
  }

  const width = parsePositiveInt(formData.get("width"), 1);
  const height = parsePositiveInt(formData.get("height"), 1);

  const titleRaw = formData.get("title");
  const altRaw = formData.get("alt");
  const title =
    typeof titleRaw === "string" && titleRaw.trim()
      ? titleRaw.trim().slice(0, 120)
      : fileName.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
  const alt =
    typeof altRaw === "string" && altRaw.trim()
      ? altRaw.trim().slice(0, 200)
      : title;

  const resolvedMime =
    mimeType === "application/octet-stream"
      ? defaultMimeFromExtension(fileName)
      : mimeType;

  return {
    ok: true,
    file: {
      buffer,
      fileName,
      mimeType: resolvedMime,
      sizeBytes: buffer.length,
      mediaType,
      width,
      height,
      title,
      alt,
    },
  };
}
