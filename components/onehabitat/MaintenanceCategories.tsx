"use client";

import { useState } from "react";

type MaintenanceCategory = {
  id: string;
  label: string;
  icon: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

const MAINTENANCE_CATEGORIES: MaintenanceCategory[] = [
  {
    id: "electrical",
    label: "Electrical",
    icon: "electrical_services",
    title: "Electrical Services",
    description:
      "We handle all electrical repairs and installations, ensuring safe and reliable power across your home.",
    image: "/assets/electrical-service.png",
    imageAlt: "Professional electrician servicing a home electrical panel",
  },
  {
    id: "carpentry",
    label: "Carpentry",
    icon: "handyman",
    title: "Carpentry Services",
    description:
      "We provide precise carpentry repairs and installations for doors, furniture, and fittings.",
    image: "/assets/carpentry-service.png",
    imageAlt: "Professional carpentry repair and door fitting service",
  },
  {
    id: "painting",
    label: "Painting",
    icon: "format_paint",
    title: "Painting Services",
    description:
      "We carry out painting repairs and touch-ups to maintain a clean and fresh finish.",
    image: "/assets/painting-service.png",
    imageAlt: "Professional interior painting service",
  },
  {
    id: "seepage",
    label: "Seepage Works",
    icon: "water_drop",
    title: "Seepage Works",
    description:
      "We identify and fix seepage issues to prevent damage and ensure long-term protection.",
    image: "/assets/seepage-service.png",
    imageAlt: "Professional seepage and waterproofing repair service",
  },
  {
    id: "plumbing",
    label: "Plumbing",
    icon: "plumbing",
    title: "Plumbing Services",
    description:
      "We manage all plumbing repairs and installations for smooth and leak-free operation.",
    image: "/assets/plumbing-service.png",
    imageAlt: "Professional plumbing repair under sink",
  },
];

export default function MaintenanceCategories() {
  const [activeId, setActiveId] = useState(MAINTENANCE_CATEGORIES[0]!.id);
  const activeCategory =
    MAINTENANCE_CATEGORIES.find((category) => category.id === activeId) ??
    MAINTENANCE_CATEGORIES[0]!;

  return (
    <section className="py-xl bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        <h2 className="font-headline text-headline-lg mb-xl text-center">
          Maintenance Services
        </h2>
        <div className="flex flex-col md:flex-row gap-lg bg-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden min-h-[500px]">
          <div
            role="tablist"
            aria-label="Maintenance service categories"
            className="w-full md:w-1/3 border-r border-outline-variant/10 bg-surface-container-lowest"
          >
            <div className="flex flex-col h-full">
              {MAINTENANCE_CATEGORIES.map((category) => {
                const isActive = category.id === activeId;

                return (
                  <button
                    key={category.id}
                    type="button"
                    role="tab"
                    id={`maintenance-tab-${category.id}`}
                    aria-selected={isActive}
                    aria-controls={`maintenance-panel-${category.id}`}
                    onClick={() => setActiveId(category.id)}
                    className={`flex items-center gap-md text-left transition-all py-3 px-6 flex-1 ${
                      isActive
                        ? "bg-surface-container-low border-l-4 border-primary opacity-100"
                        : "hover:bg-surface-container-low opacity-70 hover:opacity-100 border-l-4 border-transparent"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-xl ${
                        isActive ? "text-primary" : "text-secondary"
                      }`}
                      style={
                        isActive
                          ? { fontVariationSettings: "'FILL' 1" }
                          : undefined
                      }
                    >
                      {category.icon}
                    </span>
                    <span className="font-label font-bold text-on-surface text-label-lg">
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            role="tabpanel"
            id={`maintenance-panel-${activeCategory.id}`}
            aria-labelledby={`maintenance-tab-${activeCategory.id}`}
            className="w-full md:w-2/3 p-lg flex flex-col md:flex-row gap-lg items-center"
          >
            <div className="flex-1 order-2 md:order-1">
              <h3 className="font-headline text-headline-md mb-md text-primary">
                {activeCategory.title}
              </h3>
              <p className="font-body text-body-md text-on-surface-variant">
                {activeCategory.description}
              </p>
            </div>
            <div className="flex-1 order-1 md:order-2">
              <div className="aspect-video md:aspect-square rounded-lg overflow-hidden shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={activeCategory.id}
                  alt={activeCategory.imageAlt}
                  className="w-full h-full object-cover"
                  src={activeCategory.image}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
