import type { ObjectId } from "mongodb";

export type GalleryMediaType = "image" | "video";

export type GalleryAspectRatio = "portrait" | "landscape" | "square";

export type GalleryMediaDocument = {
  _id?: ObjectId;
  fileName: string;
  mimeType: string;
  mediaType: GalleryMediaType;
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
