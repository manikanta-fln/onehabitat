import type { ObjectId } from "mongodb";

export type GalleryMediaType = "image" | "video";

export type GalleryAspectRatio = "portrait" | "landscape" | "square";

export const GALLERY_CATEGORIES = [
  {
    key: "tiles",
    label: "Tiles",
  },
  {
    key: "modular-kitchen-wardrobe",
    label: "Modular Kitchen and Wardrobe",
  },
  {
    key: "painting",
    label: "Painting",
  },
  {
    key: "electrical",
    label: "Electrical",
  },
  {
    key: "plumbing",
    label: "Plumbing",
  },
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]["key"];

export type GalleryMediaDocument = {
  _id?: ObjectId;
  fileName: string;
  mimeType: string;
  mediaType: GalleryMediaType;
  /** Present on new uploads; older records may omit this */
  category?: GalleryCategory;
  sizeBytes: number;
  width: number;
  height: number;
  aspectRatio: GalleryAspectRatio;
  aspectValue: number;
  title: string;
  alt: string;
  gridFsId: ObjectId;
  uploadedBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type GalleryMediaPublic = {
  id: string;
  fileName: string;
  mimeType: string;
  mediaType: GalleryMediaType;
  category: GalleryCategory | null;
  categoryLabel: string | null;
  sizeBytes: number;
  width: number;
  height: number;
  aspectRatio: GalleryAspectRatio;
  aspectValue: number;
  title: string;
  alt: string;
  url: string;
  createdAt: string;
};

export function isGalleryCategory(value: string): value is GalleryCategory {
  return GALLERY_CATEGORIES.some((item) => item.key === value);
}

export function getGalleryCategoryLabel(
  category: GalleryCategory | null | undefined
): string | null {
  if (!category) return null;
  return GALLERY_CATEGORIES.find((item) => item.key === category)?.label ?? null;
}
