import OnehabitatFooter from "@/components/onehabitat/Footer";
import OnehabitatHeader from "@/components/onehabitat/Header";
import MaintenanceCategories from "@/components/onehabitat/MaintenanceCategories";
import UploadIssueProvider from "@/components/onehabitat/UploadIssueProvider";
import UploadIssueTrigger from "@/components/onehabitat/UploadIssueTrigger";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBuovZ42VZ8nNOkXhOJMQ0-pIEGlWSMXu9UoerWeu5AW29kZHUkfEEqLb2XlGJ-eRhAoEObnbG7aylFV-MqZfc4l8gMMUTAr3OhIzngcdbV1S3k7CseiTOaIId0DhF1ml-ZLzD5O_SbZSewRGJ1sJMrZB7D4ZqRj4A7bzKyiygGmYjbS9TpZU50oQFP-xe4RNjjaL-QcSucmgAPBvaluK8Lmrmd0FCQOcWmN1L1cKZaH_fzujpmSrQ97tLwyuDf9lCJXpYwkU_L0g";

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
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-lg items-center">
          <div className="flex flex-col gap-md">
            <h1 className="font-headline text-headline-xl text-primary leading-tight">
              From Small Repairs to Beautiful Interiors, We Handle It All
            </h1>
            <p className="font-body text-body-lg text-on-surface-variant max-w-[32rem]">
              Upload an issue, get AI analysis, expert guidance, and professional service at your doorstep.
            </p>
            <div className="mt-sm flex w-full flex-col gap-md md:flex-row md:flex-wrap">
              <UploadIssueTrigger variant="primary" className="w-full md:w-auto" />
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-DEFAULT border-2 border-primary px-lg py-md font-label text-label-lg text-primary transition-all hover:bg-primary hover:text-white md:w-auto"
              >
                Get Free Consultation
              </button>
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
            <div className="aspect-square rounded-xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="AI Home Analysis"
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
                <p className="font-headline text-headline-sm">12,000+</p>
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

      <section className="py-xl px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
        <h2 className="font-headline text-headline-lg text-center mb-xl">
          Comprehensive Property Care
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <div className="bg-white p-lg rounded-lg shadow-sm border border-outline-variant/10 hover:shadow-lg transition-all group">
            <span className="material-symbols-outlined text-secondary text-headline-xl mb-md block">
              camera_enhance
            </span>
            <h3 className="font-headline text-headline-sm mb-sm">
              Fix a Problem
            </h3>
            <p className="font-body text-body-sm text-on-surface-variant mb-md">
              Simply upload a photo or video. Our AI detects the issue and
              matches you with the right expert.
            </p>
            <a
              className="text-secondary font-label text-label-lg flex items-center gap-xs"
              href="#"
            >
              Try Detection{" "}
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </a>
          </div>
          <div className="bg-white p-lg rounded-lg shadow-sm border border-outline-variant/10 hover:shadow-lg transition-all group">
            <span className="material-symbols-outlined text-secondary text-headline-xl mb-md block">
              architecture
            </span>
            <h3 className="font-headline text-headline-sm mb-sm">
              Plan Interiors
            </h3>
            <p className="font-body text-body-sm text-on-surface-variant mb-md">
              End-to-end design and execution for your space. Premium finishes,
              bespoke furniture, and perfect fit-outs.
            </p>
            <a
              className="text-secondary font-label text-label-lg flex items-center gap-xs"
              href="#"
            >
              Explore Designs{" "}
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </a>
          </div>
          <div className="bg-white p-lg rounded-lg shadow-sm border border-outline-variant/10 hover:shadow-lg transition-all group">
            <span className="material-symbols-outlined text-secondary text-headline-xl mb-md block">
              verified_user
            </span>
            <h3 className="font-headline text-headline-sm mb-sm">
              Handover Inspection
            </h3>
            <p className="font-body text-body-sm text-on-surface-variant mb-md">
              Professional snag list report before you take keys. We ensure your
              builder delivers the promised quality.
            </p>
            <a
              className="text-secondary font-label text-label-lg flex items-center gap-xs"
              href="#"
            >
              Book Inspection{" "}
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </a>
          </div>
          <div className="bg-white p-lg rounded-lg shadow-sm border border-outline-variant/10 hover:shadow-lg transition-all group">
            <span className="material-symbols-outlined text-secondary text-headline-xl mb-md block">
              event_repeat
            </span>
            <h3 className="font-headline text-headline-sm mb-sm">AMC Plans</h3>
            <p className="font-body text-body-sm text-on-surface-variant mb-md">
              Preventive maintenance for Villas and Apartments. Zero-hassle
              upkeep with 24/7 emergency support.
            </p>
            <a
              className="text-secondary font-label text-label-lg flex items-center gap-xs"
              href="#"
            >
              View Packages{" "}
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </a>
          </div>
        </div>
      </section>

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
            </ul>
            <button
              type="button"
              className="px-lg py-md rounded-DEFAULT w-fit mt-md font-label text-label-lg bg-primary text-on-primary"
            >
              Book a Free Consultation
            </button>
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
            engineers conduct a 200+ point audit of your new property.
          </p>
          <div className="bg-surface-container p-md rounded-lg border-l-4 border-secondary">
            <p className="font-body text-body-md italic text-on-surface">
              &quot;We saved $4,000 in repair costs by identifying structural
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
              Peace of Mind Subscription
            </h2>
            <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Expert property management at a predictable monthly cost. No more
              chasing contractors.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-center">
            <div className="bg-white p-lg rounded-lg shadow-sm flex flex-col gap-md border border-outline-variant/10">
              <h3 className="font-headline text-headline-sm">Essentials</h3>
              <p className="text-headline-md font-bold text-primary">
                $49
                <span className="text-body-sm font-normal text-on-surface-variant">
                  /mo
                </span>
              </p>
              <ul className="space-y-sm my-md">
                <li className="flex items-center gap-xs font-body text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-base">
                    check
                  </span>{" "}
                  2 Maintenance Visits
                </li>
                <li className="flex items-center gap-xs font-body text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-base">
                    check
                  </span>{" "}
                  AC Filter Cleaning
                </li>
                <li className="flex items-center gap-xs font-body text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-base">
                    check
                  </span>{" "}
                  Electrical Audit
                </li>
                <li className="flex items-center gap-xs font-body text-body-sm text-on-surface-variant/40 line-through">
                  <span className="material-symbols-outlined text-base">
                    close
                  </span>{" "}
                  Emergency Support
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
                Premium Plus
              </h3>
              <p className="text-headline-md font-bold text-on-primary-container">
                $99
                <span className="text-body-sm font-normal opacity-80">/mo</span>
              </p>
              <ul className="space-y-sm my-md">
                <li className="flex items-center gap-xs font-body text-body-sm text-on-primary-container">
                  <span className="material-symbols-outlined text-base">
                    check
                  </span>{" "}
                  4 Scheduled Visits
                </li>
                <li className="flex items-center gap-xs font-body text-body-sm text-on-primary-container">
                  <span className="material-symbols-outlined text-base">
                    check
                  </span>{" "}
                  Full Home Deep Clean
                </li>
                <li className="flex items-center gap-xs font-body text-body-sm text-on-primary-container">
                  <span className="material-symbols-outlined text-base">
                    check
                  </span>{" "}
                  24/7 Emergency Response
                </li>
                <li className="flex items-center gap-xs font-body text-body-sm text-on-primary-container">
                  <span className="material-symbols-outlined text-base">
                    check
                  </span>{" "}
                  Plumbing &amp; Electrical Fixes
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
              <h3 className="font-headline text-headline-sm">Villa Care</h3>
              <p className="text-headline-md font-bold text-primary">
                $199
                <span className="text-body-sm font-normal text-on-surface-variant">
                  /mo
                </span>
              </p>
              <ul className="space-y-sm my-md">
                <li className="flex items-center gap-xs font-body text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-base">
                    check
                  </span>{" "}
                  Unlimited Callouts
                </li>
                <li className="flex items-center gap-xs font-body text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-base">
                    check
                  </span>{" "}
                  Pool &amp; Garden Upkeep
                </li>
                <li className="flex items-center gap-xs font-body text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-base">
                    check
                  </span>{" "}
                  Pest Control Included
                </li>
                <li className="flex items-center gap-xs font-body text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-base">
                    check
                  </span>{" "}
                  Priority Concierge
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

      <section className="py-xl px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto">
        <h2 className="font-headline text-headline-lg text-center mb-xl">
          Common Questions
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
              Our AI model is trained on over 50,000 property snag images with a
              94% accuracy rate in identifying common plumbing, electrical, and
              structural issues.
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
              Can I get a custom quote for a large office?
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <div className="mt-md font-body text-body-md text-on-surface-variant">
              Absolutely. We have a dedicated Commercial Division for offices,
              retail spaces, and restaurants. Contact us via the &apos;AMC
              Plans&apos; section for a bespoke proposal.
            </div>
          </details>
        </div>
      </section>

      <OnehabitatFooter />
    </UploadIssueProvider>
  );
}
