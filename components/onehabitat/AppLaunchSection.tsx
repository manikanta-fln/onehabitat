"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import JoinWaitlistButton from "@/components/onehabitat/JoinWaitlistButton";
import { CONTACT_HREF } from "@/utils/constants";

/** iPhone 13 width (390px); height reduced for layout — width unchanged */
const IPHONE_13_WIDTH_PX = 390;
const IPHONE_13_DISPLAY_HEIGHT_PX = 620;

const PHONE_NAV_ITEMS = [
  { icon: "home", label: "Home", active: true },
  { icon: "home_repair_service", label: "Services", active: false },
  { icon: "forum", label: "Society", active: false },
  { icon: "person", label: "Profile", active: false },
] as const;

const FEATURES = [
  { icon: "build", label: "AI Maintenance Requests" },
  { icon: "track_changes", label: "Smart Repair Tracking" },
  { icon: "design_services", label: "Interior Design Assistance" },
  { icon: "door_sensor", label: "Visitor & Gate Management" },
  { icon: "storefront", label: "Home Services Marketplace" },
  { icon: "forum", label: "Society Communication Hub" },
  { icon: "notifications_active", label: "Smart Notifications" },
  { icon: "analytics", label: "Apartment Analytics" },
] as const;

export default function AppLaunchSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          section.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const scrollToFeatures = () => {
    document
      .getElementById("app-launch-features")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <section
      ref={sectionRef}
      id="app-launch"
      aria-labelledby="app-launch-heading"
      className="app-launch-section relative overflow-hidden py-xl scroll-mt-24"
    >
      <div
        className="app-launch-gradient pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl lg:gap-lg items-center">
          <div className="app-launch-content flex flex-col gap-md">
            <span className="app-launch-badge inline-flex w-fit items-center gap-xs rounded-full border border-primary/20 bg-primary-container/30 px-md py-xs font-label text-label-sm text-on-primary-container">
              <span
                className="app-launch-badge-dot h-2 w-2 rounded-full bg-primary-container"
                aria-hidden="true"
              />
              Launching Soon
            </span>

            <div className="flex flex-col gap-sm">
              <h2
                id="app-launch-heading"
                className="font-headline text-headline-lg md:text-headline-xl text-on-surface leading-tight"
              >
                The Future of Apartment Living is Coming
              </h2>
              <p className="font-headline text-headline-sm text-primary">
                A Smart AI-Powered App for Repairs, Interiors &amp; Complete
                Home Care
              </p>
              <p className="font-label text-label-lg text-on-surface-variant">
                Gate Management, Services &amp; Maintenance — All in One Place
              </p>
            </div>

            <p className="font-body text-body-md text-on-surface-variant max-w-xl">
              Experience a revolutionary AI-powered platform designed to simplify
              apartment life. Manage repairs, book services, monitor maintenance
              requests, connect with residents, handle gate access, plan
              interiors, and take care of your home — all from one intelligent
              platform.
            </p>

            <div
              className="app-launch-coming-card rounded-xl border border-outline-variant/20 bg-white/80 p-md shadow-sm backdrop-blur-sm"
              role="status"
              aria-label="Product launch status: coming soon"
            >
              <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wider">
                Launching Soon
              </p>
              <div
                className="mt-sm flex items-center gap-sm"
                aria-hidden="true"
              >
                <span className="app-launch-indicator h-2.5 w-2.5 rounded-full bg-primary-container" />
                <span className="app-launch-indicator app-launch-indicator-delay-1 h-2.5 w-2.5 rounded-full bg-secondary-container" />
                <span className="app-launch-indicator app-launch-indicator-delay-2 h-2.5 w-2.5 rounded-full bg-tertiary-container" />
                <span className="font-headline text-headline-sm text-on-surface ml-xs">
                  Coming Soon
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-md mt-xs">
              <JoinWaitlistButton className="inline-flex items-center justify-center rounded-DEFAULT bg-primary px-lg py-md font-label text-label-lg text-on-primary shadow-lg transition-all hover:shadow-xl hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
              <button
                type="button"
                onClick={scrollToFeatures}
                className="inline-flex items-center justify-center rounded-DEFAULT border-2 border-primary px-lg py-md font-label text-label-lg text-primary transition-all hover:bg-primary hover:text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Learn More
              </button>
            </div>
          </div>

          <div
            className="app-launch-visual relative flex items-center justify-center py-md lg:justify-end lg:py-0"
            aria-hidden="true"
          >
            <div
              className="app-launch-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-container/25 blur-3xl"
              style={{
                height: `min(100%, ${IPHONE_13_DISPLAY_HEIGHT_PX}px)`,
                width: `min(90%, ${IPHONE_13_WIDTH_PX}px)`,
              }}
            />
            <div className="app-launch-phone relative mx-auto w-[390px] max-w-full">
              <div
                className="relative w-full rounded-[2.75rem] border-[6px] border-on-surface/10 bg-on-surface p-2 shadow-2xl"
                style={{ height: IPHONE_13_DISPLAY_HEIGHT_PX }}
              >
                <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[2.25rem] bg-surface-container-lowest">
                  <div className="flex shrink-0 items-center justify-between border-b border-outline-variant/15 bg-surface-container-low px-md py-sm">
                    <span className="font-label text-label-sm text-on-surface">
                      Onehabitat
                    </span>
                    <span className="material-symbols-outlined text-primary text-lg">
                      apartment
                    </span>
                  </div>
                  <div className="flex min-h-0 flex-1 flex-col gap-sm overflow-hidden p-md pb-sm">
                    <div className="bg-glass rounded-lg border border-outline-variant/10 p-sm shadow-sm">
                      <div className="flex items-start gap-sm">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container/40 text-primary">
                          <span className="material-symbols-outlined text-lg">
                            psychology
                          </span>
                        </span>
                        <div>
                          <p className="font-label text-label-sm text-on-surface">
                            AI Assistant
                          </p>
                          <p className="font-body text-body-sm text-on-surface-variant">
                            3 maintenance requests need attention
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-sm">
                      <div className="rounded-lg bg-surface-container p-sm">
                        <span className="material-symbols-outlined text-primary text-xl">
                          build
                        </span>
                        <p className="mt-xs font-label text-label-sm text-on-surface">
                          Repairs
                        </p>
                        <p className="font-body text-body-sm text-primary">
                          2 active
                        </p>
                      </div>
                      <div className="rounded-lg bg-surface-container p-sm">
                        <span className="material-symbols-outlined text-secondary text-xl">
                          door_sensor
                        </span>
                        <p className="mt-xs font-label text-label-sm text-on-surface">
                          Gate
                        </p>
                        <p className="font-body text-body-sm text-on-surface-variant">
                          4 visitors
                        </p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-secondary-fixed/50 p-sm">
                      <p className="font-label text-label-sm text-on-surface">
                        Society Hub
                      </p>
                      <p className="font-body text-body-sm text-on-surface-variant">
                        New notice · AMC renewal
                      </p>
                    </div>
                  </div>
                  <nav
                    className="shrink-0 border-t border-outline-variant/15 bg-surface-container-lowest"
                    aria-hidden="true"
                  >
                    <ul className="flex items-center justify-around px-xs pt-sm pb-xs">
                      {PHONE_NAV_ITEMS.map((item) => (
                        <li
                          key={item.label}
                          className="flex min-w-0 flex-1 flex-col items-center gap-0.5"
                        >
                          <span
                            className={`material-symbols-outlined text-[22px] leading-none ${
                              item.active ? "text-primary" : "text-outline"
                            }`}
                            style={
                              item.active
                                ? { fontVariationSettings: "'FILL' 1" }
                                : undefined
                            }
                          >
                            {item.icon}
                          </span>
                          <span
                            className={`font-label text-[10px] leading-tight ${
                              item.active
                                ? "text-primary"
                                : "text-on-surface-variant"
                            }`}
                          >
                            {item.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div
                      className="mx-auto mb-xs h-[4px] w-[100px] max-w-[40%] rounded-full bg-on-surface/15"
                      aria-hidden="true"
                    />
                  </nav>
                </div>
              </div>
              <div className="app-launch-float-card absolute -left-4 top-[10%] hidden sm:flex items-center gap-xs rounded-lg border border-outline-variant/15 bg-white px-sm py-xs shadow-lg">
                <span className="material-symbols-outlined text-primary text-base">
                  verified
                </span>
                <span className="font-label text-label-sm text-on-surface">
                  Smart Home
                </span>
              </div>
              <div className="app-launch-float-card app-launch-float-delay absolute -right-3 bottom-[12%] hidden sm:flex items-center gap-xs rounded-lg border border-outline-variant/15 bg-white px-sm py-xs shadow-lg">
                <span className="material-symbols-outlined text-secondary text-base">
                  hub
                </span>
                <span className="font-label text-label-sm text-on-surface">
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          id="app-launch-features"
          className="app-launch-features mt-xl scroll-mt-24"
        >
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {FEATURES.map((feature, index) => (
              <li
                key={feature.label}
                className="app-launch-feature-card group flex items-start gap-sm rounded-xl border border-outline-variant/15 bg-white/90 p-md shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-md"
                style={{ "--stagger": index } as CSSProperties}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary transition-colors group-hover:bg-primary-container/40">
                  <span className="material-symbols-outlined">{feature.icon}</span>
                </span>
                <span className="font-label text-label-lg text-on-surface-variant group-hover:text-on-surface transition-colors">
                  {feature.label}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-lg text-center font-body text-body-sm text-on-surface-variant">
            Questions about early access?{" "}
            <a
              href={CONTACT_HREF}
              className="text-primary underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
            >
              Contact our team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
