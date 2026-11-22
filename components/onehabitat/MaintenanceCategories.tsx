"use client";

import { useState } from "react";

type MaintenanceCategory = {
  id: string;
  label: string;
  icon: string;
  title: string;
  description: string;
  startingFrom?: string;
  image: string;
  imageAlt: string;
};

const MAINTENANCE_CATEGORIES: MaintenanceCategory[] = [
  {
    id: "bathroom-makeover",
    label: "Bathroom Makeover",
    icon: "bathtub",
    title: "Bathroom Makeover",
    description:
      "Complete bathroom makeovers with modern fittings, tiling, and waterproofing for a fresh, functional space.",
    image: "/assets/seepage-service.png",
    imageAlt: "Bathroom makeover with waterproofing and modern fittings",
  },
  {
    id: "flats",
    label: "Flats",
    icon: "apartment",
    title: "Flats",
    description:
      "End-to-end maintenance and makeover solutions tailored for apartments and flats of every size.",
    image: "/assets/hero-section.png",
    imageAlt: "Apartment flat maintenance and makeover service",
  },
  {
    id: "villa",
    label: "Villa",
    icon: "villa",
    title: "Villa",
    description:
      "Premium upkeep and renovation services designed for independent villas and large homes.",
    image: "/assets/tiles1.png",
    imageAlt: "Villa renovation and premium maintenance service",
  },
  {
    id: "terrace",
    label: "Terrace",
    icon: "roofing",
    title: "Terrace",
    description:
      "Terrace waterproofing, flooring, and makeover services to protect and transform your open spaces.",
    image: "/assets/tiles2.png",
    imageAlt: "Terrace flooring and waterproofing makeover service",
  },
  {
    id: "balcony",
    label: "Balcony",
    icon: "balcony",
    title: "Balcony",
    description:
      "Stylish balcony makeovers with flooring, railings, and finishes that elevate your outdoor corner.",
    image: "/assets/painting-service.png",
    imageAlt: "Balcony makeover with flooring and finishing service",
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
        <div className="mb-xl text-center">
          <h2 className="font-headline text-headline-lg text-on-surface">
            Renovations
          </h2>
          <p className="mt-sm font-body text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Customised makeovers for bathrooms, flats, villas, terraces and
            balconies — planned around your style and budget, delivered by
            verified experts.
          </p>
        </div>
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
              {activeCategory.startingFrom ? (
                <p className="mt-md font-headline text-headline-sm text-on-surface">
                  Starting from {activeCategory.startingFrom}
                </p>
              ) : null}
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
