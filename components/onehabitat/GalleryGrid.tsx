"use client";

import { useEffect, useMemo, useState } from "react";
import { GALLERY_CATEGORIES } from "@/types/gallery-media";
import type {
  GalleryCategory,
  GalleryMediaPublic,
} from "@/types/gallery-media";

type GalleryResponse = {
  media: GalleryMediaPublic[];
  categories?: typeof GALLERY_CATEGORIES;
};

type TabKey = "all" | GalleryCategory;

function tileAspect(item: GalleryMediaPublic): string {
  if (item.width > 0 && item.height > 0) {
    return `${item.width} / ${item.height}`;
  }
  if (item.aspectRatio === "portrait") return "3 / 4";
  if (item.aspectRatio === "landscape") return "16 / 10";
  return "1 / 1";
}

function gridSpan(item: GalleryMediaPublic): string {
  if (item.aspectRatio === "landscape") {
    return "sm:col-span-2";
  }
  return "sm:col-span-1";
}

export default function GalleryGrid() {
  const [media, setMedia] = useState<GalleryMediaPublic[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<GalleryMediaPublic | null>(null);
  const [tab, setTab] = useState<TabKey>("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/media", { cache: "no-store" });
        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(body.error ?? "Failed to load gallery");
        }
        const data = (await response.json()) as GalleryResponse;
        if (!cancelled) {
          setMedia(data.media ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load gallery");
          setMedia([]);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const filtered = useMemo(() => {
    if (!media) return [];
    if (tab === "all") return media;
    return media.filter((item) => item.category === tab);
  }, [media, tab]);

  if (media === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black/60" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <p className="text-[17px] text-black/55">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        role="tablist"
        aria-label="Gallery categories"
      >
        <CategoryTab
          label="All"
          selected={tab === "all"}
          onSelect={() => setTab("all")}
        />
        {GALLERY_CATEGORIES.map((category) => (
          <CategoryTab
            key={category.key}
            label={category.label}
            selected={tab === category.key}
            onSelect={() => setTab(category.key)}
          />
        ))}
      </div>

      {media.length === 0 ? (
        <div className="mx-auto max-w-md py-16 text-center">
          <p className="text-[21px] font-medium tracking-tight text-black/80">
            Gallery coming soon
          </p>
          <p className="mt-3 text-[17px] leading-relaxed text-black/45">
            Project photography and walkthroughs will appear here.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mx-auto max-w-md py-16 text-center">
          <p className="text-[21px] font-medium tracking-tight text-black/80">
            No media in this category
          </p>
          <p className="mt-3 text-[17px] leading-relaxed text-black/45">
            Try another tab or upload media for this category from admin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7 xl:grid-cols-4">
          {filtered.map((item) => (
            <GalleryTile
              key={`${tab}-${item.id}`}
              item={item}
              onOpen={() => setActive(item)}
            />
          ))}
        </div>
      )}

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={active.title || "Media preview"}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close preview"
            onClick={() => setActive(null)}
          >
            <span className="material-symbols-outlined text-[1.5rem]">close</span>
          </button>
          <div
            className="relative max-h-[88vh] max-w-[min(1100px,100%)] overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            {active.mediaType === "video" ? (
              <video
                src={active.url}
                controls
                autoPlay
                playsInline
                className="max-h-[88vh] w-full rounded-2xl object-contain"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active.url}
                alt={active.alt || active.title}
                className="max-h-[88vh] w-full rounded-2xl object-contain"
              />
            )}
            {(active.title || active.categoryLabel) && (
              <p className="mt-4 text-center text-[15px] text-white/70">
                {[active.categoryLabel, active.title].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CategoryTab({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      className={`shrink-0 rounded-full px-5 py-2.5 text-[14px] font-medium tracking-tight transition-colors ${
        selected
          ? "bg-black text-white"
          : "bg-black/[0.04] text-black/55 hover:bg-black/[0.08] hover:text-black/80"
      }`}
    >
      {label}
    </button>
  );
}

function GalleryTile({
  item,
  onOpen,
}: {
  item: GalleryMediaPublic;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group w-full overflow-hidden rounded-[22px] bg-[#ececee] text-left outline-none transition-transform duration-500 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-4 ${gridSpan(item)}`}
      aria-label={`View ${item.title || item.fileName}`}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: tileAspect(item) }}
      >
        {item.mediaType === "video" ? (
          <>
            <video
              src={item.url}
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-black shadow-lg backdrop-blur-sm">
                <span className="material-symbols-outlined text-[1.75rem]">
                  play_arrow
                </span>
              </span>
            </span>
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.alt || item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>
    </button>
  );
}
