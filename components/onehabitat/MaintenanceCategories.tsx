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
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDTCis7t2klpL6wiIRbUWIRZXkL_BgH55L4FLX5lbRGVn2OMnsmQny40qyMplKs1SWDWoMWYjfTGUbIL8bZBxLKEXy9DJctYb3LqYl_JPHhfzrJzRDIpNZSFp6sw4zdFFBfg7exhvM2WoUxU51TU8Ly8RbgT9odBTCvfFtxCqOPYVjs5nWvpq5NyeCUbvRALt_EZh1fp53_thVkeb8369s31i1cZAEi8o913ReyAh-dn6vArryrwdEURO8BRvbWvG_-fgMZ6Qg7cQ",
    imageAlt: "Electrical maintenance work",
  },
  {
    id: "carpentry",
    label: "Carpentry",
    icon: "handyman",
    title: "Carpentry Services",
    description:
      "We provide precise carpentry repairs and installations for doors, furniture, and fittings.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDz25cKkOryXda5aWO0IkEl082HTM1NITnCY64dU-4iB_eQEcaSrTQo6Hxyuh5CTgakDDRhFU-npQwDAyanG2Sl6Dg_grZhRngMBaEVGs_IsTpB-zdvdFnzKVew_oiA1P2aqrz_09qozNBzFvTZer9HO76ZFxNuF3Z5GDDm6w8R6FBNKY2CY4WNJm_87rCg6hllCfoLTMAKsRHeEQVFwA-NCixTcvLb1sPkWp8Od6hRBTlnC59_hIG0s_jITvPNE10cKUyo6T-8nQ",
    imageAlt: "Carpentry repair work",
  },
  {
    id: "painting",
    label: "Painting",
    icon: "format_paint",
    title: "Painting Services",
    description:
      "We carry out painting repairs and touch-ups to maintain a clean and fresh finish.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA8C8s0sv_4bdoCeuI40l0WaTA0QGFArGt5NDyajHD0Wt-M3QIS4K0sQWbvzBucrqj-G-cBlfAct-a3DCcc0z_DYY8bLeCNjQ3XQzI_cRAsc4_Svy52l3LY9Lfx0CY__rHpGfQEAHONsR4L7bste2KjAwqZ3j0xFGDUCmiNv_OV3RBgXW5uvDjJKeMj4GjjTAfshCj3jTld3qND04F-BQkCiTtTEjzujvT4y2u-1IqlWrUs0ieDg_9YltfJ5kuN5kQArok5202aPg",
    imageAlt: "Interior painting work",
  },
  {
    id: "seepage",
    label: "Seepage Works",
    icon: "water_drop",
    title: "Seepage Works",
    description:
      "We identify and fix seepage issues to prevent damage and ensure long-term protection.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA8C8s0sv_4bdoCeuI40l0WaTA0QGFArGt5NDyajHD0Wt-M3QIS4K0sQWbvzBucrqj-G-cBlfAct-a3DCcc0z_DYY8bLeCNjQ3XQzI_cRAsc4_Svy52l3LY9Lfx0CY__rHpGfQEAHONsR4L7bste2KjAwqZ3j0xFGDUCmiNv_OV3RBgXW5uvDjJKeMj4GjjTAfshCj3jTld3qND04F-BQkCiTtTEjzujvT4y2u-1IqlWrUs0ieDg_9YltfJ5kuN5kQArok5202aPg",
    imageAlt: "Seepage repair work",
  },
  {
    id: "plumbing",
    label: "Plumbing",
    icon: "plumbing",
    title: "Plumbing Services",
    description:
      "We manage all plumbing repairs and installations for smooth and leak-free operation.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjqFEyDR_aqoF_pqwezCDjvhxmutRoZDd187LNDsEsVF9g2xtRTM6wVbNk0ZtxDMd6uw9fDddyrYfGTSv2xzHUQJvyFkhMycK1jliXKVtyspbyDUHHM3YN1JbPGQlXUtVtHmKPz5Att_fhXYw0WdWWI5U3EO_EqOxnJ8959-iRprlu64alp8TnCm2OkT2nme-g0ys87sVD5zmrYboqLpkcEZTrZNSRZHTNKgspiEc5QUKUhSNDDruxMDvKQqLmdDBORVE537ghtA",
    imageAlt: "Plumbing maintenance work",
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
              <p className="font-body text-body-md text-on-surface-variant mb-lg">
                {activeCategory.description}
              </p>
              <button
                type="button"
                className="bg-primary text-on-primary px-lg py-md rounded-DEFAULT font-label text-label-lg hover:brightness-110 transition-all flex items-center gap-xs shadow-md"
              >
                Book Service{" "}
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </button>
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
