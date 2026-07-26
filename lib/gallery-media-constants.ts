import type {
  GalleryAspectRatio,
  GalleryCategory,
  GalleryMediaType,
} from "@/types/gallery-media";
import { GALLERY_CATEGORIES, isGalleryCategory } from "@/types/gallery-media";

export const GALLERY_IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".avif",
  ".heic",
  ".heif",
]);

export const GALLERY_VIDEO_EXTENSIONS = new Set([
  ".mp4",
  ".webm",
  ".mov",
  ".m4v",
]);

export const GALLERY_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/avif",
  "image/heic",
  "image/heif",
]);

export const GALLERY_VIDEO_MIME_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
]);

/** Default limits when settings are unavailable */
export const DEFAULT_MAX_GALLERY_IMAGE_BYTES = 10 * 1024 * 1024;
export const DEFAULT_MAX_GALLERY_VIDEO_BYTES = 100 * 1024 * 1024;

export { GALLERY_CATEGORIES, isGalleryCategory };

export function extensionFromFileName(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot >= 0 ? fileName.slice(dot).toLowerCase() : "";
}

export function defaultMimeFromExtension(fileName: string): string {
  const ext = extensionFromFileName(fileName);
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".avif": "image/avif",
    ".heic": "image/heic",
    ".heif": "image/heif",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
    ".m4v": "video/x-m4v",
  };
  return map[ext] ?? "application/octet-stream";
}

export function detectGalleryMediaType(
  mimeType: string,
  fileName: string
): GalleryMediaType | null {
  const normalized = mimeType.toLowerCase().trim();
  const ext = extensionFromFileName(fileName);

  if (
    GALLERY_IMAGE_MIME_TYPES.has(normalized) ||
    GALLERY_IMAGE_EXTENSIONS.has(ext)
  ) {
    return "image";
  }

  if (
    GALLERY_VIDEO_MIME_TYPES.has(normalized) ||
    GALLERY_VIDEO_EXTENSIONS.has(ext)
  ) {
    return "video";
  }

  return null;
}

export function classifyAspectRatio(
  width: number,
  height: number
): { aspectRatio: GalleryAspectRatio; aspectValue: number } {
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  const aspectValue = Number((safeWidth / safeHeight).toFixed(4));

  if (aspectValue < 0.85) {
    return { aspectRatio: "portrait", aspectValue };
  }
  if (aspectValue > 1.15) {
    return { aspectRatio: "landscape", aspectValue };
  }
  return { aspectRatio: "square", aspectValue };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function parseGalleryCategory(
  value: FormDataEntryValue | string | null | undefined
): GalleryCategory | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return isGalleryCategory(trimmed) ? trimmed : null;
}
