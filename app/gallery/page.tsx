import type { Metadata } from "next";
import OnehabitatFooter from "@/components/onehabitat/Footer";
import OnehabitatHeader from "@/components/onehabitat/Header";
import GalleryGrid from "@/components/onehabitat/GalleryGrid";
import { BRAND_NAME, SITE_TITLE } from "@/utils/constants";

export const metadata: Metadata = {
  title: `Gallery | ${SITE_TITLE}`,
  description: `Explore ${BRAND_NAME} interiors and project work — curated photography and video from completed homes.`,
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] text-black">
      <OnehabitatHeader />

      <main>
        <section className="px-margin-mobile pb-8 pt-28 md:px-margin-desktop md:pb-12 md:pt-32">
          <div className="mx-auto max-w-7xl">
            <p className="text-[13px] font-medium uppercase tracking-[0.22em] text-black/40">
              Portfolio
            </p>
            <h1 className="mt-4 max-w-3xl text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-black md:text-[64px]">
              Gallery
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-black/50 md:text-[19px]">
              Spaces shaped with precision — interiors and craftsmanship, arranged
              as they were designed to be seen.
            </p>
          </div>
        </section>

        <section className="px-margin-mobile pb-24 md:px-margin-desktop md:pb-32">
          <div className="mx-auto max-w-7xl">
            <GalleryGrid />
          </div>
        </section>
      </main>

      <OnehabitatFooter />
    </div>
  );
}
