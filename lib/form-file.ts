const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".heic",
  ".heif",
  ".bmp",
  ".avif",
]);

export type ParsedUploadFile = {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

function extensionFromName(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot >= 0 ? fileName.slice(dot).toLowerCase() : "";
}

function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

function isImageFileName(fileName: string): boolean {
  return IMAGE_EXTENSIONS.has(extensionFromName(fileName));
}

function defaultMimeFromExtension(fileName: string): string {
  const ext = extensionFromName(fileName);
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".heic": "image/heic",
    ".heif": "image/heif",
    ".bmp": "image/bmp",
    ".avif": "image/avif",
  };
  return map[ext] ?? "application/octet-stream";
}

/**
 * Next.js route handlers may provide uploads as File or Blob (not always `instanceof File`).
 */
export async function parseImageFromFormData(
  formData: FormData,
  fieldName = "file"
): Promise<ParsedUploadFile | null> {
  const entry = formData.get(fieldName);

  if (!entry || typeof entry === "string") {
    return null;
  }

  const blob = entry as Blob;
  const buffer = Buffer.from(await blob.arrayBuffer());

  if (buffer.length === 0) {
    return null;
  }

  const fileName =
    "name" in entry && typeof entry.name === "string" && entry.name.trim()
      ? entry.name.trim()
      : "upload.jpg";

  const mimeType =
    blob.type && blob.type.trim()
      ? blob.type.trim()
      : defaultMimeFromExtension(fileName);

  if (!isImageMimeType(mimeType) && !isImageFileName(fileName)) {
    return null;
  }

  return {
    buffer,
    fileName,
    mimeType: isImageMimeType(mimeType) ? mimeType : defaultMimeFromExtension(fileName),
    sizeBytes: buffer.length,
  };
}

export function isClientImageFile(file: File): boolean {
  if (file.type && file.type.startsWith("image/")) {
    return true;
  }
  return isImageFileName(file.name);
}
