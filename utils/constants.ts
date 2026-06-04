import type { NavLink } from "@/types";

export const BRAND_NAME = "Onehabitat";
export const BRAND_LOGO_SRC = "/assets/one-habitat-logo.svg";
export const SITE_TITLE =
  "Onehabitat - Maintenance that Cares. Interiors That Inspire.";
export const BRAND_EMAIL = "hello@onehabitat.com";
export const BRAND_PHONE = "+91 83417 96243";

export const CONTACT_HREF = "/#contact";

/** WhatsApp business number (India +91) */
export const WHATSAPP_PHONE = "918341796243";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}`;

export const MAIN_NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Interiors", href: "/#interiors" },
  { label: "Inspections", href: "/#inspections" },
  { label: "AMC Plans", href: "/#amc-plans" },
];
