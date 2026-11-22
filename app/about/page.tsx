import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import OnehabitatFooter from "@/components/onehabitat/Footer";
import OnehabitatHeader from "@/components/onehabitat/Header";
import { BRAND_NAME, SITE_TITLE, WHATSAPP_URL } from "@/utils/constants";

export const metadata: Metadata = {
  title: `About | ${SITE_TITLE}`,
  description: `${BRAND_NAME} is one trusted team for renovations, maintenance, interiors and flat inspections — the right materials within your budget, every repair on record, and 5+ years of snagging expertise.`,
};

const STATS = [
  { value: "5+ yrs", label: "Snagging flats & buildings", featured: true },
  { value: "₹1,500", label: "Flat inspections from" },
  { value: "4", label: "Service lines, one team" },
  { value: "On-demand", label: "Tell us what you need" },
] as const;

const MAINTENANCE_RECORDS = [
  { icon: "checklist", label: "Every checklist completed" },
  { icon: "build", label: "Every repair logged" },
  { icon: "hourglass_bottom", label: "Life of materials tracked" },
] as const;

const INSTALLATIONS = [
  { icon: "grid_view", label: "Tiles" },
  { icon: "carpenter", label: "Carpentry" },
  { icon: "plumbing", label: "Plumbing" },
  { icon: "electrical_services", label: "Electrical" },
] as const;

const EXPERTISE = [
  {
    icon: "apartment",
    title: "Rental Property Interiors",
    body: "Durable, tenant-ready interiors that look good and hold their value between leases.",
  },
  {
    icon: "home_repair_service",
    title: "Apartment Maintenance",
    body: "Planned upkeep for apartments, with every visit, repair and material on record.",
  },
  {
    icon: "format_paint",
    title: "Renovations",
    body: "Bathroom, flat, villa, terrace and balcony makeovers tailored to your style and budget.",
  },
] as const;

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center gap-xs rounded-full border border-primary/20 bg-primary-container/30 px-md py-xs font-label text-label-sm text-on-primary-container">
      <span
        className="h-2 w-2 rounded-full bg-primary-container"
        aria-hidden="true"
      />
      {children}
    </span>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <OnehabitatHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-clip px-margin-mobile pb-xl pt-28 md:px-margin-desktop md:pt-36">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary-container/25 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-secondary-container/40 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-xl lg:grid-cols-[1.15fr_1fr]">
            <div className="flex flex-col gap-md">
              <Eyebrow>About {BRAND_NAME}</Eyebrow>
              <h1 className="font-headline text-headline-xl leading-tight text-primary">
                Renovations, maintenance &amp; interiors — done right, within
                your budget.
              </h1>
              <p className="max-w-[36rem] font-body text-body-lg text-on-surface-variant">
                {BRAND_NAME} is one trusted team for your home. We help you
                choose the right materials, keep a record of every repair,
                inspect new flats before handover and install interiors end to
                end.
              </p>
              <div className="mt-sm flex flex-col gap-sm sm:flex-row sm:flex-wrap">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-xs whitespace-nowrap rounded-DEFAULT bg-primary px-md py-md font-label text-label-lg text-on-primary shadow-lg transition-all hover:shadow-xl"
                >
                  <span className="material-symbols-outlined text-[1.25rem] leading-none">
                    chat
                  </span>
                  Contact on WhatsApp
                </a>
                <Link
                  href="/#what-we-do"
                  className="inline-flex items-center justify-center gap-xs whitespace-nowrap rounded-DEFAULT border-2 border-primary px-md py-md font-label text-label-lg text-primary transition-all hover:bg-primary hover:text-on-primary"
                >
                  Explore what we do
                  <span className="material-symbols-outlined text-[1.25rem] leading-none">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-md">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className={`flex min-h-[9rem] flex-col justify-between gap-sm rounded-xl border p-md shadow-sm ${
                    "featured" in stat && stat.featured
                      ? "border-primary bg-primary text-on-primary"
                      : "border-outline-variant/15 bg-white text-on-surface"
                  }`}
                >
                  <dt
                    className={`order-2 font-label text-label-sm ${
                      "featured" in stat && stat.featured
                        ? "text-on-primary/80"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {stat.label}
                  </dt>
                  <dd
                    className={`order-1 whitespace-nowrap font-headline text-[1.125rem] font-semibold leading-none sm:text-headline-md ${
                      "featured" in stat && stat.featured
                        ? "text-on-primary"
                        : "text-primary"
                    }`}
                  >
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Why Onehabitat */}
        <section
          id="why-onehabitat"
          className="scroll-mt-24 border-y border-outline-variant/10 bg-white px-margin-mobile py-xl md:px-margin-desktop"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-xl max-w-3xl text-center">
              <Eyebrow>Why {BRAND_NAME}</Eyebrow>
              <h2 className="mt-md font-headline text-headline-lg text-primary">
                Four reasons homeowners choose us
              </h2>
              <p className="mt-md font-body text-body-lg text-on-surface-variant">
                Whether it&apos;s a makeover, routine upkeep, a new-flat
                inspection or an installation, you get the same honest advice
                and careful execution.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
              {/* 1. Renovation, maintenance & interiors */}
              <article className="group relative overflow-clip rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-md shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md md:col-span-2 xl:p-lg">
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-container/20 blur-2xl"
                  aria-hidden="true"
                />
                <div className="relative flex flex-col gap-md">
                  <CardIcon icon="savings" />
                  <p className="font-label text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Renovation · Maintenance · Interiors
                  </p>
                  <h3 className="font-headline text-headline-md text-on-surface">
                    The best materials within your budget
                  </h3>
                  <p className="max-w-[40rem] font-body text-body-md text-on-surface-variant">
                    We suggest the best-fit materials for what you want to
                    spend, show them to you before work begins, and then
                    execute — so every rupee goes further.
                  </p>
                  <ul className="flex flex-wrap gap-sm">
                    {[
                      "Budget-first planning",
                      "Materials shown before work",
                      "Honest recommendations",
                    ].map((chip) => (
                      <li
                        key={chip}
                        className="inline-flex items-center gap-xs rounded-full border border-outline-variant/20 bg-white px-sm py-xs font-label text-label-sm text-on-surface-variant"
                      >
                        <span className="material-symbols-outlined text-base text-primary">
                          check
                        </span>
                        {chip}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              {/* 3. Flat inspection — featured */}
              <article className="relative flex flex-col justify-between gap-lg overflow-clip rounded-xl bg-inverse-surface p-md text-inverse-on-surface shadow-xl md:col-span-2 lg:col-span-1 lg:row-span-2 xl:p-lg">
                <div
                  className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-primary-container/25 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative flex flex-col gap-md">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
                    <span className="material-symbols-outlined">fact_check</span>
                  </span>
                  <p className="font-label text-label-sm uppercase tracking-wider text-inverse-on-surface/70">
                    Flat Inspection
                  </p>
                  <h3 className="font-headline text-headline-md">
                    5+ years of snagging expertise
                  </h3>
                  <p className="font-body text-body-md text-inverse-on-surface/80">
                    Our experts have more than 5 years of experience snagging
                    flats and buildings — so problems are found before you take
                    possession, not after.
                  </p>
                </div>
                <div className="relative flex flex-col gap-md border-t border-inverse-on-surface/15 pt-md">
                  <div>
                    <p className="font-label text-label-sm text-inverse-on-surface/70">
                      Starting from
                    </p>
                    <p className="font-headline text-headline-lg leading-none text-inverse-primary">
                      ₹1,500
                    </p>
                  </div>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-xs whitespace-nowrap rounded-DEFAULT bg-primary-container px-md py-md font-label text-label-lg text-on-primary-container transition-all hover:brightness-105"
                  >
                    Book an inspection
                    <span className="material-symbols-outlined text-base">
                      arrow_forward
                    </span>
                  </a>
                </div>
              </article>

              {/* 2. Maintenance */}
              <article className="flex flex-col gap-md rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-md shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md xl:p-lg">
                <CardIcon icon="assignment_turned_in" />
                <p className="font-label text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Maintenance
                </p>
                <h3 className="font-headline text-headline-sm text-on-surface">
                  Every job on record
                </h3>
                <p className="font-body text-body-md text-on-surface-variant">
                  We record every checklist, every repair and the life of the
                  materials used, so you always know your home&apos;s history.
                </p>
                <ul className="mt-auto space-y-sm">
                  {MAINTENANCE_RECORDS.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center gap-sm rounded-DEFAULT bg-white px-sm py-sm font-label text-label-sm text-on-surface"
                    >
                      <span className="material-symbols-outlined text-xl text-secondary">
                        {item.icon}
                      </span>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </article>

              {/* 4. Interior installations */}
              <article className="flex flex-col gap-md rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-md shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md xl:p-lg">
                <CardIcon icon="handyman" />
                <p className="font-label text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Interior Installations
                </p>
                <h3 className="font-headline text-headline-sm text-on-surface">
                  Installations handled end to end
                </h3>
                <p className="font-body text-body-md text-on-surface-variant">
                  Beyond design, we install and finish your interiors with our
                  own trusted trades.
                </p>
                <ul className="mt-auto flex flex-wrap gap-sm">
                  {INSTALLATIONS.map((item) => (
                    <li
                      key={item.label}
                      className="inline-flex items-center gap-xs whitespace-nowrap rounded-full border border-outline-variant/20 bg-white px-sm py-xs font-label text-label-sm text-on-surface"
                    >
                      <span className="material-symbols-outlined text-xl text-primary">
                        {item.icon}
                      </span>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* Expertise */}
        <section className="bg-surface-container-low px-margin-mobile py-xl md:px-margin-desktop">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-xl lg:grid-cols-[1fr_1.2fr]">
            <div className="flex flex-col gap-md">
              <Eyebrow>Our expertise</Eyebrow>
              <h2 className="font-headline text-headline-lg text-primary">
                Where we do our best work
              </h2>
              <p className="font-body text-body-lg text-on-surface-variant">
                {BRAND_NAME} is especially good at rental property interiors,
                apartment maintenance and renovations — homes where quality,
                durability and a clear budget matter most.
              </p>
            </div>

            <ol className="flex flex-col gap-md">
              {EXPERTISE.map((item, index) => (
                <li
                  key={item.title}
                  className="group flex items-start gap-md rounded-xl border border-outline-variant/15 bg-white p-md shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md xl:p-lg"
                >
                  <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary-container/80 to-primary-fixed/40 text-primary">
                    <span className="material-symbols-outlined text-xl leading-none">
                      {item.icon}
                    </span>
                    <span className="mt-0.5 font-label text-[11px] leading-none">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-headline text-headline-sm text-on-surface">
                      {item.title}
                    </h3>
                    <p className="mt-xs font-body text-body-md text-on-surface-variant">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* On-demand service */}
        <section className="px-margin-mobile py-xl md:px-margin-desktop">
          <div className="relative mx-auto max-w-7xl overflow-clip rounded-xl bg-primary px-lg py-xl text-on-primary shadow-xl md:px-xl">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-on-primary/10 blur-2xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-primary-container/30 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative grid grid-cols-1 items-center gap-lg md:grid-cols-[1fr_auto]">
              <div className="flex flex-col gap-md">
                <span className="inline-flex w-fit items-center gap-xs rounded-full bg-on-primary/15 px-md py-xs font-label text-label-sm">
                  <span className="material-symbols-outlined text-base">
                    bolt
                  </span>
                  {BRAND_NAME} on-demand service
                </span>
                <h2 className="font-headline text-headline-lg">
                  Tell us your requirement. We&apos;ll suggest the best.
                </h2>
                <p className="max-w-[40rem] font-body text-body-lg text-on-primary/85">
                  Share what you need — a repair, a makeover, an inspection or
                  an installation — and we&apos;ll recommend the right service,
                  materials and expert for it.
                </p>
              </div>
              <div className="flex flex-col gap-sm sm:flex-row md:flex-col">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-xs rounded-DEFAULT bg-white px-lg py-md font-label text-label-lg text-primary shadow-lg transition-all hover:shadow-xl"
                >
                  <span className="material-symbols-outlined text-[1.25rem] leading-none">
                    chat
                  </span>
                  Share your requirement
                </a>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-xs rounded-DEFAULT border-2 border-on-primary/60 px-lg py-md font-label text-label-lg text-on-primary transition-all hover:bg-on-primary hover:text-primary"
                >
                  View services
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <OnehabitatFooter />
    </div>
  );
}

function CardIcon({ icon }: { icon: string }) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary-container/90 to-secondary-fixed/50 text-primary">
      <span className="material-symbols-outlined">{icon}</span>
    </span>
  );
}
