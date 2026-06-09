import OnehabitatFooter from "@/components/onehabitat/Footer";
import OnehabitatHeader from "@/components/onehabitat/Header";
import AppLaunchSection from "@/components/onehabitat/AppLaunchSection";
import MaintenanceCategories from "@/components/onehabitat/MaintenanceCategories";
import UploadIssueProvider from "@/components/onehabitat/UploadIssueProvider";
import FreeConsultationButton from "@/components/onehabitat/FreeConsultationButton";
import UploadIssueTrigger from "@/components/onehabitat/UploadIssueTrigger";

const HERO_IMAGE = "/assets/hero-section.png";

const WALL_CEILING_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA8C8s0sv_4bdoCeuI40l0WaTA0QGFArGt5NDyajHD0Wt-M3QIS4K0sQWbvzBucrqj-G-cBlfAct-a3DCcc0z_DYY8bLeCNjQ3XQzI_cRAsc4_Svy52l3LY9Lfx0CY__rHpGfQEAHONsR4L7bste2KjAwqZ3j0xFGDUCmiNv_OV3RBgXW5uvDjJKeMj4GjjTAfshCj3jTld3qND04F-BQkCiTtTEjzujvT4y2u-1IqlWrUs0ieDg_9YltfJ5kuN5kQArok5202aPg";

const INTERIOR_IMAGE_1 = WALL_CEILING_IMAGE;

const INTERIOR_IMAGE_2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDzbSVn5t-eigbQr1tlZDCRTtFpVQxC9-dDk184dazH7HIOCF1n-wqTuM24xGFaElh1ddwcQlNmKhb7NYuYEqa8EDrexU6T5mBsBfpzOMU2uyOq4GZgqMhc6aqDZvFtvPZAIau0G0QkY508Cx0SO0onxwEpsXkcfbfltDwDn9c8T_72r95FwCgVYoohocf-0ke3TAGrGUByyKtz8T_Nd5iMOYE44hG5vDSkgTHCO9CtSm92I9fYK2-ufDUxZsGNv3_xHI4_9BNI8g";

export default function HomePage() {
  return (
    <UploadIssueProvider>
      <OnehabitatHeader />

      <section className="pt-xl pb-lg px-margin-mobile md:px-margin-desktop mt-xl overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.08fr] gap-lg items-center">
          <div className="flex flex-col gap-md">
            <h1 className="font-headline text-headline-xl text-primary leading-tight">
              From Small Repairs to Complete Home Makeovers
              <span className="mt-sm block font-body text-body-lg font-normal text-on-surface-variant">
                Powered by Smart AI Maintenance.
              </span>
            </h1>
            <p className="font-body text-body-lg text-on-surface-variant max-w-[32rem]">
              Upload an issue, get AI analysis, expert guidance, and professional service at your doorstep.
            </p>
            <div className="mt-sm flex w-full flex-col gap-md md:flex-row md:flex-wrap">
              <UploadIssueTrigger variant="primary" className="w-full md:w-auto" />
              <FreeConsultationButton className="flex w-full items-center justify-center rounded-DEFAULT border-2 border-primary px-lg py-md font-label text-label-lg text-primary transition-all hover:bg-primary hover:text-white md:w-auto" />
            </div>
            <div className="flex flex-wrap gap-gutter items-center mt-md text-on-surface-variant">
              <span className="flex items-center gap-xs font-label text-label-sm">
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                Verified Experts
              </span>
              <span className="flex items-center gap-xs font-label text-label-sm">
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  psychology
                </span>
                AI-assisted Analysis
              </span>
              <span className="flex items-center gap-xs font-label text-label-sm">
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  speed
                </span>
                Fast Response
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square w-full rounded-xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Smart AI home maintenance — upload a photo for instant analysis"
                className="w-full h-full object-cover"
                src={HERO_IMAGE}
              />
            </div>
            <div className="absolute -bottom-base -left-base bg-white p-md rounded-lg shadow-xl flex items-center gap-sm">
              <div className="w-12 h-12 bg-secondary-fixed rounded-full flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">
                  home_repair_service
                </span>
              </div>
              <div>
                <p className="font-headline text-headline-sm">20+</p>
                <p className="font-label text-label-sm opacity-60">
                  Repairs Completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xl bg-white border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline text-headline-lg text-center mb-xl text-on-surface">
            How Onehabitat Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg relative">
            <div className="hidden lg:block absolute top-12 left-1/4 right-1/4 h-px bg-outline-variant/30 -z-0" />
            <div className="flex flex-col items-center text-center group relative z-10">
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-md border-4 border-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-primary text-4xl">
                  camera
                </span>
              </div>
              <h3 className="font-headline text-headline-sm mb-sm text-on-surface">
                Upload Photo
              </h3>
              <p className="font-body text-body-sm text-on-surface-variant px-md">
                Capture the issue with your phone camera.
              </p>
            </div>
            <div className="flex flex-col items-center text-center group relative z-10">
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-md border-4 border-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-primary text-4xl">
                  psychology
                </span>
              </div>
              <h3 className="font-headline text-headline-sm mb-sm text-on-surface">
                AI Analysis
              </h3>
              <p className="font-body text-body-sm text-on-surface-variant px-md">
                Our engine detects the root cause immediately.
              </p>
            </div>
            <div className="flex flex-col items-center text-center group relative z-10">
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-md border-4 border-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-primary text-4xl">
                  receipt_long
                </span>
              </div>
              <h3 className="font-headline text-headline-sm mb-sm text-on-surface">
                Get Estimate
              </h3>
              <p className="font-body text-body-sm text-on-surface-variant px-md">
                Receive a transparent, fixed-price quote.
              </p>
            </div>
            <div className="flex flex-col items-center text-center group relative z-10">
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-md border-4 border-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-primary text-4xl">
                  event_available
                </span>
              </div>
              <h3 className="font-headline text-headline-sm mb-sm text-on-surface">
                Book Service
              </h3>
              <p className="font-body text-body-sm text-on-surface-variant px-md">
                Expert arrives and executes the fix professionally.
              </p>
            </div>
          </div>
        </div>
      </section>

      <MaintenanceCategories />

      <section
        id="interiors"
        className="py-xl bg-surface-container-low text-on-surface scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Modern Kitchen"
                className="rounded-lg shadow-lg w-full aspect-square object-cover"
                src={INTERIOR_IMAGE_1}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Living Room"
                className="rounded-lg shadow-lg w-full aspect-[4/5] object-cover mt-md"
                src={INTERIOR_IMAGE_2}
              />
            </div>
          </div>
          <div className="order-1 lg:order-2 flex flex-col gap-md">
            <h2 className="font-headline text-headline-lg text-primary">
              Execution-Focused Interior Solutions
            </h2>
            <p className="font-body text-body-lg text-on-surface-variant">
              We don&apos;t just design; we build. From modular kitchens to
              full-home transformations, we manage the entire execution
              lifecycle.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-md mt-sm">
              <li className="flex items-center gap-sm font-label text-label-lg text-on-surface-variant">
                <span className="material-symbols-outlined text-primary">
                  check_circle
                </span>{" "}
                Modular Kitchens
              </li>
              <li className="flex items-center gap-sm font-label text-label-lg text-on-surface-variant">
                <span className="material-symbols-outlined text-primary">
                  check_circle
                </span>{" "}
                Wardrobes &amp; Storage
              </li>
              <li className="flex items-center gap-sm font-label text-label-lg text-on-surface-variant">
                <span className="material-symbols-outlined text-primary">
                  check_circle
                </span>{" "}
                TV &amp; Entertainment Units
              </li>
              <li className="flex items-center gap-sm font-label text-label-lg text-on-surface-variant">
                <span className="material-symbols-outlined text-primary">
                  check_circle
                </span>{" "}
                False Ceilings &amp; Lighting
              </li>
              <li className="flex items-center gap-sm font-label text-label-lg text-on-surface-variant">
                <span className="material-symbols-outlined text-primary">
                  check_circle
                </span>{" "}
                Painting
              </li>
              <li className="flex items-center gap-sm font-label text-label-lg text-on-surface-variant">
                <span className="material-symbols-outlined text-primary">
                  check_circle
                </span>{" "}
                Pergola
              </li>
              <li className="flex items-center gap-sm font-label text-label-lg text-on-surface-variant">
                <span className="material-symbols-outlined text-primary">
                  check_circle
                </span>{" "}
                Tiles &amp; Water Proofing
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section
        id="inspections"
        className="py-xl px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto flex flex-col md:flex-row gap-xl items-center scroll-mt-24"
      >
        <div className="flex-1 flex flex-col gap-md">
          <h2 className="font-headline text-headline-lg text-on-surface">
            Pre-Handover Inspection &amp; Quality Audit
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant">
            Don&apos;t inherit the builder&apos;s mistakes. Our certified
            experts conduct a 200+ point audit of your new property.
          </p>
          <div className="bg-surface-container p-md rounded-lg border-l-4 border-secondary">
            <p className="font-body text-body-md italic text-on-surface">
              &quot;We saved ₹10,000 in repair costs by identifying structural
              snags before the final payment.&quot;
            </p>
            <p className="font-body text-body-sm mt-xs text-on-surface-variant">
              — Satisfied Homeowner
            </p>
          </div>
          <button
            type="button"
            className="border-2 border-primary text-primary px-lg py-md rounded-DEFAULT w-fit font-label text-label-lg hover:bg-primary hover:text-white transition-all"
          >
            View Sample Report
          </button>
        </div>
        <div className="flex-1 relative">
          <div className="bg-white p-lg rounded-lg shadow-xl border border-outline-variant/20 relative overflow-hidden">
            <div className="flex items-center justify-between mb-md">
              <span className="font-headline text-headline-sm">
                Snag List Report
              </span>
              <span className="bg-error-container text-on-error-container px-sm py-xs rounded-full text-xs font-bold">
                14 Issues Found
              </span>
            </div>
            <div className="space-y-md">
              <div className="flex gap-md items-center border-b border-outline-variant/10 pb-md">
                <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center text-error">
                  <span className="material-symbols-outlined">water_drop</span>
                </div>
                <div>
                  <p className="font-label text-label-lg">Bathroom Seepage</p>
                  <p className="font-body text-body-sm text-on-surface-variant">
                    High moisture detected in master toilet wall.
                  </p>
                </div>
              </div>
              <div className="flex gap-md items-center border-b border-outline-variant/10 pb-md">
                <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">square_foot</span>
                </div>
                <div>
                  <p className="font-label text-label-lg">Tiles Alignment</p>
                  <p className="font-body text-body-sm text-on-surface-variant">
                    Living room skirting uneven by 4mm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="amc-plans"
        className="py-xl bg-surface-container-low text-on-surface scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-xl">
            <h2 className="font-headline text-headline-lg text-primary">
              AMC Plans
            </h2>
            <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Annual maintenance for apartments and villas — electrician, plumber,
              and carpenter visits bundled at a predictable cost.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-center">
            <div className="bg-white p-lg rounded-lg shadow-sm flex flex-col gap-md border border-outline-variant/10">
              <h3 className="font-headline text-headline-sm">1 BHK / 2 BHK</h3>
              <p className="text-headline-md font-bold text-primary">
                Starting from ₹1,500
                <span className="text-body-sm font-normal text-on-surface-variant">
                  /-
                </span>
              </p>
              <ul className="space-y-sm my-md">
                <li className="flex items-center gap-xs font-body text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-base">
                    check
                  </span>{" "}
                  Electrician — 2 visits
                </li>
                <li className="flex items-center gap-xs font-body text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-base">
                    check
                  </span>{" "}
                  Plumber — 2 visits
                </li>
                <li className="flex items-center gap-xs font-body text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-base">
                    check
                  </span>{" "}
                  Carpenter — 1 visit
                </li>
              </ul>
              <button
                type="button"
                className="bg-primary text-on-primary py-md rounded-DEFAULT font-label text-label-lg mt-auto hover:brightness-110 transition-all"
              >
                Subscribe Now
              </button>
            </div>
            <div className="bg-primary-container p-lg rounded-lg shadow-xl border-2 border-secondary scale-105 relative flex flex-col gap-md">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white px-md py-xs rounded-full text-xs font-bold uppercase tracking-widest">
                Most Popular
              </span>
              <h3 className="font-headline text-headline-sm text-on-primary-container">
                3 BHK
              </h3>
              <p className="text-headline-md font-bold text-on-primary-container">
                Starting from ₹2,899
                <span className="text-body-sm font-normal opacity-80">/-</span>
              </p>
              <ul className="space-y-sm my-md">
                <li className="flex items-center gap-xs font-body text-body-sm text-on-primary-container">
                  <span className="material-symbols-outlined text-base">
                    check
                  </span>{" "}
                  Electrician — 3 visits
                </li>
                <li className="flex items-center gap-xs font-body text-body-sm text-on-primary-container">
                  <span className="material-symbols-outlined text-base">
                    check
                  </span>{" "}
                  Plumber — 3 visits
                </li>
                <li className="flex items-center gap-xs font-body text-body-sm text-on-primary-container">
                  <span className="material-symbols-outlined text-base">
                    check
                  </span>{" "}
                  Carpenter — 2 visits
                </li>
              </ul>
              <button
                type="button"
                className="bg-primary text-on-primary py-md rounded-DEFAULT font-label text-label-lg mt-auto hover:brightness-110 transition-all"
              >
                Subscribe Now
              </button>
            </div>
            <div className="bg-white p-lg rounded-lg shadow-sm flex flex-col gap-md border border-outline-variant/10">
              <h3 className="font-headline text-headline-sm">Villa</h3>
              <p className="text-headline-md font-bold text-primary">
                Starting from ₹5,699
                <span className="text-body-sm font-normal text-on-surface-variant">
                  /-
                </span>
              </p>
              <ul className="space-y-sm my-md">
                <li className="flex items-center gap-xs font-body text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-base">
                    check
                  </span>{" "}
                  Electrician — 5 visits
                </li>
                <li className="flex items-center gap-xs font-body text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-base">
                    check
                  </span>{" "}
                  Plumber — 5 visits
                </li>
                <li className="flex items-center gap-xs font-body text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-base">
                    check
                  </span>{" "}
                  Carpenter — 3 visits
                </li>
              </ul>
              <button
                type="button"
                className="bg-primary text-on-primary py-md rounded-DEFAULT font-label text-label-lg mt-auto hover:brightness-110 transition-all"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <AppLaunchSection />

      <section className="py-xl px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto">
        <h2 className="font-headline text-headline-lg text-center mb-xl">
          Frequently Asked Questions
        </h2>
        <div className="space-y-md">
          <details className="group bg-white p-md rounded-lg shadow-sm border border-outline-variant/10">
            <summary className="list-none flex justify-between items-center cursor-pointer font-headline text-headline-sm">
              How accurate is the AI detection?
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <div className="mt-md font-body text-body-md text-on-surface-variant">
              Our AI model is trained on thousands of home maintenance images and
              delivers reliable issue detection for plumbing, electrical,
              waterproofing, and structural concerns. Every result is reviewed by
              our team before a service is recommended.
            </div>
          </details>
          <details className="group bg-white p-md rounded-lg shadow-sm border border-outline-variant/10">
            <summary className="list-none flex justify-between items-center cursor-pointer font-headline text-headline-sm">
              How do I upload an issue and book a service?
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <div className="mt-md font-body text-body-md text-on-surface-variant">
              Tap &quot;Upload an Issue&quot; on the homepage, take or upload a
              photo, and our AI will analyse it instantly. You&apos;ll receive a
              summary, recommended fix, and estimated scope — then you can book a
              verified professional directly from the results screen.
            </div>
          </details>
          <details className="group bg-white p-md rounded-lg shadow-sm border border-outline-variant/10">
            <summary className="list-none flex justify-between items-center cursor-pointer font-headline text-headline-sm">
              Are the technicians in-house?
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <div className="mt-md font-body text-body-md text-on-surface-variant">
              Yes, 100% of our lead experts are Onehabitat employees. We do not use
              third-party freelance marketplaces for core service delivery to
              maintain quality standards.
            </div>
          </details>
          <details className="group bg-white p-md rounded-lg shadow-sm border border-outline-variant/10">
            <summary className="list-none flex justify-between items-center cursor-pointer font-headline text-headline-sm">
              What types of home issues can you handle?
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <div className="mt-md font-body text-body-md text-on-surface-variant">
              We cover small repairs through complete home makeovers — including
              plumbing leaks, electrical faults, wall damage, seepage,
              waterproofing, painting, and general maintenance. Upload a photo and
              our AI will identify the category and suggest the right service.
            </div>
          </details>
          <details className="group bg-white p-md rounded-lg shadow-sm border border-outline-variant/10">
            <summary className="list-none flex justify-between items-center cursor-pointer font-headline text-headline-sm">
              How quickly will someone respond after I book?
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <div className="mt-md font-body text-body-md text-on-surface-variant">
              Urgent issues are prioritised for same-day or next-day visits where
              available. Standard bookings are typically scheduled within 1–2
              business days. You&apos;ll receive confirmation with your preferred
              date once the booking is submitted.
            </div>
          </details>
          <details className="group bg-white p-md rounded-lg shadow-sm border border-outline-variant/10">
            <summary className="list-none flex justify-between items-center cursor-pointer font-headline text-headline-sm">
              Can I get a custom quote for a large property or office?
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <div className="mt-md font-body text-body-md text-on-surface-variant">
              Absolutely. We have a dedicated team for larger homes, offices,
              retail spaces, and annual maintenance contracts. Contact us via the
              details in the footer or request a free consultation from the homepage.
            </div>
          </details>
        </div>
      </section>

      <OnehabitatFooter />
    </UploadIssueProvider>
  );
}
