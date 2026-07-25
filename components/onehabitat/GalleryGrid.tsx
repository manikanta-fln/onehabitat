"use client";

import { useEffect, useRef, useState } from "react";
import type { GalleryMediaPublic } from "@/types/gallery-media";

type GalleryResponse = {
  media: GalleryMediaPublic[];
};

export default function GalleryGrid() {
  const [media, setMedia] = useState<GalleryMediaPublic[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<GalleryMediaPublic | null>(null);

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
          setMedia(data.media);
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

  if (media.length === 0) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <p className="text-[21px] font-medium tracking-tight text-black/80">
          Gallery coming soon
        </p>
        <p className="mt-3 text-[17px] leading-relaxed text-black/45">
          Project photography and walkthroughs will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 gap-6 sm:columns-2 sm:gap-7 lg:columns-3 lg:gap-8 xl:columns-4">
        {media.map((item, index) => (
          <GalleryTile
            key={item.id}
            item={item}
            index={index}
            onOpen={() => setActive(item)}
          />
        ))}
      </div>

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
            {active.title ? (
              <p className="mt-4 text-center text-[15px] text-white/70">
                {active.title}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function GalleryTile({
  item,
  index,
  onOpen,
}: {
  item: GalleryMediaPublic;
  index: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "40px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      className={`group mb-6 inline-block w-full break-inside-avoid overflow-hidden rounded-[22px] bg-[#ececee] text-left outline-none transition-all duration-700 ease-out focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-4 sm:mb-7 lg:mb-8 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${Math.min(index, 8) * 45}ms` }}
      aria-label={`View ${item.title || item.fileName}`}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio:
            item.width > 0 && item.height > 0
              ? `${item.width} / ${item.height}`
              : undefined,
        }}
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
