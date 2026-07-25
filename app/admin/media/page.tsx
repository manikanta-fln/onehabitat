"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { EmptyState, ErrorState, LoadingState } from "@/components/admin/States";
import {
  FilterBar,
  FilterField,
  filterInputClassName,
} from "@/components/admin/FilterBar";
import {
  DEFAULT_MAX_GALLERY_IMAGE_BYTES,
  DEFAULT_MAX_GALLERY_VIDEO_BYTES,
  detectGalleryMediaType,
  formatBytes,
  GALLERY_IMAGE_EXTENSIONS,
  GALLERY_VIDEO_EXTENSIONS,
} from "@/lib/gallery-media-constants";
import { adminFetch, adminUpload, buildQuery } from "@/services/admin/api-client";
import type { PaginatedResult } from "@/types/admin/api";
import type { GalleryMediaPublic } from "@/types/gallery-media";

type MediaListResponse = PaginatedResult<GalleryMediaPublic> & {
  limits: {
    maxImageBytes: number;
    maxVideoBytes: number;
  };
};

type UploadResult = { media: GalleryMediaPublic };

const ACCEPT =
  ".jpg,.jpeg,.png,.avif,.heic,.heif,.mp4,.webm,.mov,.m4v,image/jpeg,image/png,image/avif,image/heic,image/heif,video/mp4,video/webm,video/quicktime";

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth || 1,
        height: img.naturalHeight || 1,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      // HEIC may fail in Chromium — fall back to square so layout still works
      resolve({ width: 1, height: 1 });
    };
    img.src = url;
  });
}

function readVideoDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: video.videoWidth || 16,
        height: video.videoHeight || 9,
      });
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 16, height: 9 });
    };
    video.src = url;
  });
}

export default function AdminMediaPage() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mediaType, setMediaType] = useState("");
  const [aspectRatio, setAspectRatio] = useState("");
  const [page, setPage] = useState(1);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadingCount, setUploadingCount] = useState(0);

  const listQuery = useQuery({
    queryKey: ["admin", "media", page, mediaType, aspectRatio],
    queryFn: () =>
      adminFetch<MediaListResponse>(
        `/api/admin/media${buildQuery({
          page,
          limit: 24,
          mediaType: mediaType || undefined,
          aspectRatio: aspectRatio || undefined,
          sortBy: "createdAt",
          sortOrder: "desc",
        })}`
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/api/admin/media/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
    },
  });

  const limits = listQuery.data?.limits ?? {
    maxImageBytes: DEFAULT_MAX_GALLERY_IMAGE_BYTES,
    maxVideoBytes: DEFAULT_MAX_GALLERY_VIDEO_BYTES,
  };

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (list.length === 0) return;

      setUploadError(null);
      setUploadingCount(list.length);

      const errors: string[] = [];

      for (const file of list) {
        const kind = detectGalleryMediaType(file.type, file.name);
        if (!kind) {
          errors.push(`${file.name}: unsupported type`);
          continue;
        }

        const maxBytes =
          kind === "image" ? limits.maxImageBytes : limits.maxVideoBytes;
        if (file.size > maxBytes) {
          errors.push(
            `${file.name}: exceeds ${formatBytes(maxBytes)} ${kind} limit`
          );
          continue;
        }

        try {
          const dims =
            kind === "image"
              ? await readImageDimensions(file)
              : await readVideoDimensions(file);

          const formData = new FormData();
          formData.append("file", file);
          formData.append("width", String(dims.width));
          formData.append("height", String(dims.height));
          formData.append(
            "title",
            file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ")
          );

          await adminUpload<UploadResult>("/api/admin/media", formData);
        } catch (error) {
          errors.push(
            `${file.name}: ${error instanceof Error ? error.message : "upload failed"}`
          );
        }
      }

      setUploadingCount(0);
      if (errors.length > 0) {
        setUploadError(errors.join(" · "));
      }
      void queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
    },
    [limits.maxImageBytes, limits.maxVideoBytes, queryClient]
  );

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragOver(false);
    if (event.dataTransfer.files?.length) {
      void uploadFiles(event.dataTransfer.files);
    }
  }

  const rows = listQuery.data?.data ?? [];
  const totalPages = listQuery.data?.pagination.totalPages ?? 1;

  return (
    <AdminShell
      title="Media"
      subtitle="Upload images and videos for the public gallery"
    >
      <div className="space-y-6">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`rounded-2xl border-2 border-dashed bg-white p-8 text-center transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-outline-variant/25"
          }`}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-low text-primary">
            <span className="material-symbols-outlined text-3xl">cloud_upload</span>
          </div>
          <h3 className="mt-4 font-headline text-headline-sm text-on-surface">
            Upload gallery media
          </h3>
          <p className="mx-auto mt-2 max-w-lg font-body text-body-sm text-on-surface-variant">
            Images: JPEG, PNG, AVIF, HEIC (max {formatBytes(limits.maxImageBytes)}).
            Videos: MP4, WebM, MOV (max {formatBytes(limits.maxVideoBytes)}).
            Files are placed on the public gallery by aspect ratio.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="admin-btn-primary"
              disabled={uploadingCount > 0}
              onClick={() => inputRef.current?.click()}
            >
              <span className="material-symbols-outlined text-[1.125rem] leading-none">
                add_photo_alternate
              </span>
              {uploadingCount > 0
                ? `Uploading ${uploadingCount}…`
                : "Choose files"}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              multiple
              className="hidden"
              onChange={(event) => {
                if (event.target.files?.length) {
                  void uploadFiles(event.target.files);
                  event.target.value = "";
                }
              }}
            />
          </div>
          {uploadError ? (
            <p className="mt-4 font-body text-body-sm text-error">{uploadError}</p>
          ) : null}
        </div>

        <FilterBar>
          <FilterField label="Type">
            <select
              value={mediaType}
              onChange={(event) => {
                setMediaType(event.target.value);
                setPage(1);
              }}
              className={filterInputClassName()}
            >
              <option value="">All</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
            </select>
          </FilterField>
          <FilterField label="Aspect">
            <select
              value={aspectRatio}
              onChange={(event) => {
                setAspectRatio(event.target.value);
                setPage(1);
              }}
              className={filterInputClassName()}
            >
              <option value="">All</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
              <option value="square">Square</option>
            </select>
          </FilterField>
        </FilterBar>

        {listQuery.isLoading ? <LoadingState label="Loading media…" /> : null}
        {listQuery.isError ? (
          <ErrorState
            description={
              listQuery.error instanceof Error ? listQuery.error.message : undefined
            }
            onRetry={() => void listQuery.refetch()}
          />
        ) : null}

        {listQuery.data && rows.length === 0 ? (
          <EmptyState
            title="No media yet"
            description="Upload images or videos to populate the public gallery."
          />
        ) : null}

        {rows.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {rows.map((item) => (
                <MediaThumbnail
                  key={item.id}
                  item={item}
                  deleting={
                    deleteMutation.isPending &&
                    deleteMutation.variables === item.id
                  }
                  onDelete={() => {
                    if (
                      window.confirm(
                        `Delete “${item.title || item.fileName}” from the gallery?`
                      )
                    ) {
                      deleteMutation.mutate(item.id);
                    }
                  }}
                />
              ))}
            </div>
            {totalPages > 1 ? (
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <span className="font-label text-label-sm text-on-surface-variant">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </AdminShell>
  );
}

function MediaThumbnail({
  item,
  onDelete,
  deleting,
}: {
  item: GalleryMediaPublic;
  onDelete: () => void;
  deleting: boolean;
}) {
  const isVideo = item.mediaType === "video";
  const ext = item.fileName.slice(item.fileName.lastIndexOf(".")).toLowerCase();
  const likelyUnsupportedStill =
    GALLERY_IMAGE_EXTENSIONS.has(ext) &&
    (ext === ".heic" || ext === ".heif");

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-outline-variant/10">
      <div className="relative aspect-square bg-surface-container-low">
        {isVideo ? (
          <video
            src={item.url}
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : likelyUnsupportedStill ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl">image</span>
            <span className="font-label text-label-sm uppercase">{ext.slice(1)}</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.alt || item.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
        <div className="absolute left-2 top-2 flex gap-1">
          <span className="rounded-full bg-black/55 px-2 py-0.5 font-label text-[10px] uppercase tracking-wide text-white">
            {item.aspectRatio}
          </span>
          {isVideo || GALLERY_VIDEO_EXTENSIONS.has(ext) ? (
            <span className="rounded-full bg-black/55 px-2 py-0.5 font-label text-[10px] uppercase tracking-wide text-white">
              video
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
          aria-label={`Delete ${item.title}`}
        >
          <span className="material-symbols-outlined text-[1.125rem] leading-none">
            delete
          </span>
        </button>
      </div>
      <div className="space-y-1 p-3 text-left">
        <p className="truncate font-label text-label-lg text-on-surface">
          {item.title || item.fileName}
        </p>
        <p className="font-body text-body-sm text-on-surface-variant">
          {formatBytes(item.sizeBytes)}
        </p>
      </div>
    </article>
  );
}
