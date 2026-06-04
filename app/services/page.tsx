import type { Metadata } from "next";
import ProServeFooter from "@/components/proserve/Footer";
import ProServeHeader from "@/components/proserve/Header";
import { SITE_TITLE } from "@/utils/constants";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description:
    "Onehabitat redefines property upkeep as a discipline of precision. We provide a curated suite of services designed for luxury estates and modern infrastructures.",
};

const HERO_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAVBjvq6EWk3DjCWpJtTisvKXjE3fFSFw-SEIYD6g-qvyT-7a616moB464xhivcw_FGIdXrzT46zWX98dqwVjEuCZIMCkUyr130cLjEFbEtClKFuSkOfnXhKe3XfQxJQ5it06zXGEtNQav3IoVXeJ-wYvLIvM9BZ2GkJOBLTiAFMI5RtgjDkXr5Rz6MI5TMonx_HqhDFReAIe-BIRCi23zzMUvZ_GP0de7_xFladqRpl-8njFqeMxsXjoJWwZiiOI8HPv_gRl6L0Q";

const PLUMBING_IMG = "/assets/plumbing-service.png";

const ELECTRICAL_IMG = "/assets/electrical-service.png";

const CARPENTRY_IMG = "/assets/carpentry-service.png";

const PAINTING_IMG = "/assets/painting-service.png";

const SEEPAGE_IMG = "/assets/seepage-service.png";

const PEST_CONTROL_IMG = "/assets/pest-control-service.png";

export default function ServicesPage() {
  return (
    <div className="proserve-page bg-background text-on-background font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
      <ProServeHeader />

      <main>
        <section className="relative h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="High-end maintenance"
              className="w-full h-full object-cover grayscale opacity-20 scale-105"
              src={HERO_BG}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
          </div>
          <div className="relative z-10 max-w-container-max mx-auto px-gutter w-full">
            <div className="max-w-4xl">
              <span className="inline-block font-label-caps text-label-caps text-primary mb-6 tracking-[0.3em]">
                CRAFTING PERFECTION
              </span>
              <h1 className="font-display-xl text-display-xl leading-none mb-8">
                Architectural Standards
                <br />
                in Daily Maintenance.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-12">
                DN ProServe redefines property upkeep as a discipline of
                precision. We provide a curated suite of services designed for
                luxury estates and modern infrastructures, where invisibility is
                the ultimate mark of success.
              </p>
              <div className="flex gap-4">
                <a
                  className="bg-primary text-white px-10 py-5 rounded-full font-label-caps tracking-widest hover:bg-primary/90 transition-colors"
                  href="#disciplines"
                >
                  Explore Catalog
                </a>
                <a
                  className="border border-outline-variant px-10 py-5 rounded-full font-label-caps tracking-widest hover:bg-surface-container-low transition-colors"
                  href="#"
                >
                  View AMC Plans
                </a>
              </div>
            </div>
          </div>
        </section>

        <div id="disciplines">
          <section className="py-section-padding border-t border-outline-variant/30">
            <div className="max-w-container-max mx-auto px-gutter grid grid-cols-12 gap-gutter items-center">
              <div className="col-span-12 lg:col-span-6">
                <span className="text-primary font-label-caps mb-4 block">
                  01 / HYDRAULIC SYSTEMS
                </span>
                <h2 className="font-headline-lg text-headline-lg mb-8">
                  Plumbing Mastery
                </h2>
                <p className="font-body-lg text-on-surface-variant mb-12">
                  Water systems are the lifeblood of a property. Our plumbing
                  solutions go beyond repair—we engineer systems for peak
                  hydraulic efficiency and absolute silent operation.
                </p>
                <div className="mb-12">
                  <h4 className="font-label-caps text-xs text-on-surface-variant mb-6">
                    WHAT WE OFFER
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-surface-container-low border border-outline-variant text-sm rounded-full">
                      Pressure Optimization
                    </span>
                    <span className="px-4 py-2 bg-surface-container-low border border-outline-variant text-sm rounded-full">
                      Smart Leak Sensors
                    </span>
                    <span className="px-4 py-2 bg-surface-container-low border border-outline-variant text-sm rounded-full">
                      Luxury Fixture Care
                    </span>
                    <span className="px-4 py-2 bg-surface-container-low border border-outline-variant text-sm rounded-full">
                      Desalination Units
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-12 border-l-2 border-primary-container pl-8">
                  <div>
                    <p className="font-label-caps text-xs text-primary mb-2">
                      WHY IT MATTERS
                    </p>
                    <p className="text-sm">
                      Prevents structural water damage and ensures consistent
                      flow dynamics.
                    </p>
                  </div>
                  <div>
                    <p className="font-label-caps text-xs text-primary mb-2">
                      AMC COVERAGE
                    </p>
                    <p className="text-sm">
                      Includes quarterly health checks and 24/7 emergency
                      response.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="bg-primary-container text-on-primary-container px-8 py-4 rounded font-label-caps text-xs tracking-widest"
                  >
                    BOOK SERVICE
                  </button>
                  <button
                    type="button"
                    className="text-primary font-label-caps text-xs tracking-widest border-b border-primary py-4"
                  >
                    GET AMC QUOTE
                  </button>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-6 mt-12 lg:mt-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Plumbing Excellence"
                  className="rounded-xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                  src={PLUMBING_IMG}
                />
              </div>
            </div>
          </section>

          <section className="py-section-padding bg-surface-container-lowest">
            <div className="max-w-container-max mx-auto px-gutter grid grid-cols-12 gap-gutter items-center">
              <div className="col-span-12 lg:col-span-6 lg:order-2">
                <span className="text-primary font-label-caps mb-4 block">
                  02 / POWER &amp; ILLUMINATION
                </span>
                <h2 className="font-headline-lg text-headline-lg mb-8">
                  Electrical Engineering
                </h2>
                <p className="font-body-lg text-on-surface-variant mb-12">
                  Modern properties are tech-heavy environments. We ensure your
                  electrical infrastructure is resilient, safe, and ready for
                  future integrations.
                </p>
                <div className="mb-12">
                  <h4 className="font-label-caps text-xs text-on-surface-variant mb-6">
                    WHAT WE OFFER
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-white border border-outline-variant text-sm rounded-full">
                      Phase Balancing
                    </span>
                    <span className="px-4 py-2 bg-white border border-outline-variant text-sm rounded-full">
                      Home Automation
                    </span>
                    <span className="px-4 py-2 bg-white border border-outline-variant text-sm rounded-full">
                      Thermal Audits
                    </span>
                    <span className="px-4 py-2 bg-white border border-outline-variant text-sm rounded-full">
                      UPS Maintenance
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-12 border-l-2 border-primary-container pl-8">
                  <div>
                    <p className="font-label-caps text-xs text-primary mb-2">
                      WHY IT MATTERS
                    </p>
                    <p className="text-sm">
                      Reduces fire hazards and protects expensive electronics
                      from surges.
                    </p>
                  </div>
                  <div>
                    <p className="font-label-caps text-xs text-primary mb-2">
                      AMC COVERAGE
                    </p>
                    <p className="text-sm">
                      Comprehensive panel servicing and periodic load testing
                      included.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="bg-primary-container text-on-primary-container px-8 py-4 rounded font-label-caps text-xs tracking-widest"
                  >
                    BOOK SERVICE
                  </button>
                  <button
                    type="button"
                    className="text-primary font-label-caps text-xs tracking-widest border-b border-primary py-4"
                  >
                    GET AMC QUOTE
                  </button>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-6 lg:order-1 mt-12 lg:mt-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Electrical Work"
                  className="rounded-xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                  src={ELECTRICAL_IMG}
                />
              </div>
            </div>
          </section>

          <section className="py-section-padding">
            <div className="max-w-container-max mx-auto px-gutter grid grid-cols-12 gap-gutter items-center">
              <div className="col-span-12 lg:col-span-6">
                <span className="text-primary font-label-caps mb-4 block">
                  03 / STRUCTURAL FINISHING
                </span>
                <h2 className="font-headline-lg text-headline-lg mb-8">
                  Bespoke Carpentry
                </h2>
                <p className="font-body-lg text-on-surface-variant mb-12">
                  Preserving the tactile elegance of your interiors. From hinge
                  adjustments to full restoration, we treat wood with the
                  reverence it deserves.
                </p>
                <div className="mb-12">
                  <h4 className="font-label-caps text-xs text-on-surface-variant mb-6">
                    WHAT WE OFFER
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-surface-container-low border border-outline-variant text-sm rounded-full">
                      Cabinet Restoration
                    </span>
                    <span className="px-4 py-2 bg-surface-container-low border border-outline-variant text-sm rounded-full">
                      Floor Sanding
                    </span>
                    <span className="px-4 py-2 bg-surface-container-low border border-outline-variant text-sm rounded-full">
                      Locksmithing
                    </span>
                    <span className="px-4 py-2 bg-surface-container-low border border-outline-variant text-sm rounded-full">
                      Furniture Repair
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-12 border-l-2 border-primary-container pl-8">
                  <div>
                    <p className="font-label-caps text-xs text-primary mb-2">
                      WHY IT MATTERS
                    </p>
                    <p className="text-sm">
                      Maintains aesthetics and prevents wear-and-tear from
                      becoming permanent.
                    </p>
                  </div>
                  <div>
                    <p className="font-label-caps text-xs text-primary mb-2">
                      AMC COVERAGE
                    </p>
                    <p className="text-sm">
                      Annual polishing and hinge lubrication for all doors and
                      windows.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="bg-primary-container text-on-primary-container px-8 py-4 rounded font-label-caps text-xs tracking-widest"
                  >
                    BOOK SERVICE
                  </button>
                  <button
                    type="button"
                    className="text-primary font-label-caps text-xs tracking-widest border-b border-primary py-4"
                  >
                    GET AMC QUOTE
                  </button>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-6 mt-12 lg:mt-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Carpentry"
                  className="rounded-xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                  src={CARPENTRY_IMG}
                />
              </div>
            </div>
          </section>

          <section className="py-section-padding bg-surface-container-lowest">
            <div className="max-w-container-max mx-auto px-gutter">
              <div className="text-center mb-margin-desktop">
                <span className="text-primary font-label-caps mb-4 block">
                  04 / SURFACE AESTHETICS
                </span>
                <h2 className="font-headline-lg text-headline-lg">
                  Protective Painting &amp; Finishing
                </h2>
              </div>
              <div className="max-w-3xl mx-auto mb-12">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Professional interior painting service"
                  className="w-full rounded-xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                  src={PAINTING_IMG}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-12">
                <div className="bg-white p-10 rounded-xl border border-outline-variant">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">
                      shield
                    </span>
                    <h3 className="font-headline-md">Surface Protection</h3>
                  </div>
                  <p className="text-on-surface-variant mb-8">
                    Long-term durability focused on safeguarding against
                    moisture, UV, and structural decay.
                  </p>
                  <ul className="space-y-4 text-sm font-medium mb-8">
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Waterproofing Membranes
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Anti-Carbonation Coatings
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Efflorescence Removal
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-10 rounded-xl border border-outline-variant">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">
                      palette
                    </span>
                    <h3 className="font-headline-md">Finishing &amp; Details</h3>
                  </div>
                  <p className="text-on-surface-variant mb-8">
                    Artisanal application focusing on texture, color accuracy,
                    and seamless architectural integration.
                  </p>
                  <ul className="space-y-4 text-sm font-medium mb-8">
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Venetian Plastering
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Airless Spraying
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Heritage Restoration
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-surface-container p-8 rounded-xl flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                  <p className="font-label-caps text-xs text-primary mb-2">
                    AMC INTEGRATION
                  </p>
                  <p className="text-sm font-medium">
                    AMC members receive annual touch-up services to keep
                    high-traffic zones pristine.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="bg-primary-container text-on-primary-container px-8 py-4 rounded font-label-caps text-xs tracking-widest whitespace-nowrap"
                  >
                    START PROJECT
                  </button>
                  <button
                    type="button"
                    className="bg-white px-8 py-4 rounded border border-outline-variant font-label-caps text-xs tracking-widest"
                  >
                    GET AMC
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-section-padding">
            <div className="max-w-container-max mx-auto px-gutter grid grid-cols-12 gap-gutter items-center">
              <div className="col-span-12 lg:col-span-6 lg:order-2">
                <span className="text-primary font-label-caps mb-4 block">
                  05 / CURATED OUTDOORS
                </span>
                <h2 className="font-headline-lg text-headline-lg mb-8">
                  Living Ecosystems
                </h2>
                <p className="font-body-lg text-on-surface-variant mb-12">
                  We don&apos;t just plant; we orchestrate nature. Our garden
                  setups blend automated irrigation with horticultural expertise
                  for a low-maintenance, high-reward sanctuary.
                </p>
                <div className="mb-12">
                  <h4 className="font-label-caps text-xs text-on-surface-variant mb-6">
                    WHAT WE OFFER
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-surface-container-low border border-outline-variant text-sm rounded-full">
                      Vertical Gardens
                    </span>
                    <span className="px-4 py-2 bg-surface-container-low border border-outline-variant text-sm rounded-full">
                      Auto-Irrigation
                    </span>
                    <span className="px-4 py-2 bg-surface-container-low border border-outline-variant text-sm rounded-full">
                      Lawn Aeration
                    </span>
                    <span className="px-4 py-2 bg-surface-container-low border border-outline-variant text-sm rounded-full">
                      Soil Fortification
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-12 border-l-2 border-primary-container pl-8">
                  <div>
                    <p className="font-label-caps text-xs text-primary mb-2">
                      WHY IT MATTERS
                    </p>
                    <p className="text-sm">
                      Enhances property value and provides a natural temperature
                      buffer for the home.
                    </p>
                  </div>
                  <div>
                    <p className="font-label-caps text-xs text-primary mb-2">
                      AMC COVERAGE
                    </p>
                    <p className="text-sm">
                      Weekly grooming, pest control, and fertilization schedules.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="bg-primary-container text-on-primary-container px-8 py-4 rounded font-label-caps text-xs tracking-widest"
                  >
                    BOOK SERVICE
                  </button>
                  <button
                    type="button"
                    className="text-primary font-label-caps text-xs tracking-widest border-b border-primary py-4"
                  >
                    GET AMC QUOTE
                  </button>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-6 lg:order-1 mt-12 lg:mt-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Lush Garden"
                  className="rounded-xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                  src={SEEPAGE_IMG}
                />
              </div>
            </div>
          </section>

          <section className="py-section-padding bg-surface-container-lowest">
            <div className="max-w-container-max mx-auto px-gutter grid grid-cols-12 gap-gutter items-center">
              <div className="col-span-12 lg:col-span-6">
                <span className="text-primary font-label-caps mb-4 block">
                  06 / PEST MANAGEMENT
                </span>
                <h2 className="font-headline-lg text-headline-lg mb-8">
                  Pest Control Services
                </h2>
                <p className="font-body-lg text-on-surface-variant mb-12">
                  Professional pest control solutions for homes and businesses.
                  Safe, effective, and long-lasting protection against termites,
                  cockroaches, rodents, mosquitoes, bed bugs, and other pests.
                </p>
                <div className="mb-12">
                  <h4 className="font-label-caps text-xs text-on-surface-variant mb-6">
                    WHAT WE OFFER
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-white border border-outline-variant text-sm rounded-full">
                      Termite Treatment
                    </span>
                    <span className="px-4 py-2 bg-white border border-outline-variant text-sm rounded-full">
                      Cockroach Control
                    </span>
                    <span className="px-4 py-2 bg-white border border-outline-variant text-sm rounded-full">
                      Rodent Proofing
                    </span>
                    <span className="px-4 py-2 bg-white border border-outline-variant text-sm rounded-full">
                      Mosquito Management
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-12 border-l-2 border-primary-container pl-8">
                  <div>
                    <p className="font-label-caps text-xs text-primary mb-2">
                      WHY IT MATTERS
                    </p>
                    <p className="text-sm">
                      Protects health, hygiene, and structural integrity across
                      your property.
                    </p>
                  </div>
                  <div>
                    <p className="font-label-caps text-xs text-primary mb-2">
                      STARTING FROM
                    </p>
                    <p className="text-sm font-medium">₹680</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="bg-primary-container text-on-primary-container px-8 py-4 rounded font-label-caps text-xs tracking-widest"
                  >
                    BOOK SERVICE
                  </button>
                  <button
                    type="button"
                    className="text-primary font-label-caps text-xs tracking-widest border-b border-primary py-4"
                  >
                    GET AMC QUOTE
                  </button>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-6 mt-12 lg:mt-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Professional pest control technician treating a home kitchen"
                  className="rounded-xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                  src={PEST_CONTROL_IMG}
                />
              </div>
            </div>
          </section>
        </div>

        <section className="py-section-padding bg-black text-white">
          <div className="max-w-container-max mx-auto px-gutter text-center">
            <span className="text-primary-container font-label-caps tracking-widest mb-6 block">
              PROACTIVE BY DESIGN
            </span>
            <h2 className="font-headline-lg text-headline-lg mb-12">
              The Preventive Philosophy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              <div className="space-y-6 border-t border-white/20 pt-8">
                <h3 className="font-headline-md text-2xl">Diagnostic Audits</h3>
                <p className="text-white/60">
                  We use thermal imaging and ultrasonic sensors to find issues
                  before they manifest as visible damage.
                </p>
              </div>
              <div className="space-y-6 border-t border-white/20 pt-8">
                <h3 className="font-headline-md text-2xl">Lifecycle Tracking</h3>
                <p className="text-white/60">
                  Every motor, pipe, and panel in your property is logged into our
                  system with a predictive maintenance schedule.
                </p>
              </div>
              <div className="space-y-6 border-t border-white/20 pt-8">
                <h3 className="font-headline-md text-2xl">Root-Cause Fixes</h3>
                <p className="text-white/60">
                  We don&apos;t patch symptoms. We re-engineer the flaw to ensure
                  it never returns, saving you thousands in long-term repairs.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-section-padding bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-16">
                <h2 className="font-headline-lg text-4xl mb-8">
                  Seamless Integration with AMC
                </h2>
                <p className="font-body-lg text-on-surface-variant mb-12">
                  While all services are available on-demand, they are designed
                  to work harmoniously within our Annual Maintenance Contracts.
                  AMC members benefit from priority scheduling, reduced rates, and
                  a dedicated property concierge.
                </p>
                <ul className="space-y-6 mb-12">
                  <li className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-lg">
                        verified
                      </span>
                    </div>
                    <span className="font-semibold">
                      Priority 4-Hour Response Time
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-lg">
                        payments
                      </span>
                    </div>
                    <span className="font-semibold">
                      25% Discount on Spare Parts
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-lg">
                        calendar_month
                      </span>
                    </div>
                    <span className="font-semibold">
                      Quarterly Comprehensive Audits
                    </span>
                  </li>
                </ul>
                <button
                  type="button"
                  className="bg-primary text-white px-12 py-5 rounded-full font-label-caps tracking-widest hover:bg-primary/90 transition-colors"
                >
                  Compare AMC Plans
                </button>
              </div>
              <div className="lg:w-1/2 bg-primary flex items-center justify-center p-16 text-white">
                <div className="text-center">
                  <div className="text-8xl font-black mb-4">98%</div>
                  <p className="font-label-caps tracking-widest uppercase">
                    Client Retention Rate
                  </p>
                  <p className="mt-8 text-white/70 max-w-sm mx-auto">
                    Once clients experience the Aureate standard, they never go
                    back to traditional maintenance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ProServeFooter />
    </div>
  );
}
