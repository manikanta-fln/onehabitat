/**
 * Google Ads conversion tracking (gtag.js).
 *
 * The base tag is loaded by `components/analytics/GoogleAdsTag.tsx`.
 * Conversions are fired from the real user actions (successful form
 * submissions, quote/contact clicks) — never on page load, except the
 * dedicated "pageView" conversion.
 *
 * Tracking only runs in production builds and never on `/admin` pages.
 */

export const GOOGLE_ADS_ID = "AW-18323190521";

export const GOOGLE_ADS_CONVERSIONS = {
  /** Submit lead form: bookings, waitlist, consultation */
  lead: `${GOOGLE_ADS_ID}/Jx1DCIuLq74dEPnllqFE`,
  /** Page view of a key page (/services) */
  pageView: `${GOOGLE_ADS_ID}/zfwFCI6Lq74dEPnllqFE`,
  /** Request quote: chatbot "Get exact quote" on an interior estimate */
  quote: `${GOOGLE_ADS_ID}/Pt8UCNuNq74dEPnllqFE`,
  /** Contact: WhatsApp, email and phone links */
  contact: `${GOOGLE_ADS_ID}/MkiPCN6Nq74dEPnllqFE`,
} as const;

export type GoogleAdsConversion = keyof typeof GOOGLE_ADS_CONVERSIONS;

export const GOOGLE_ADS_ENABLED = process.env.NODE_ENV === "production";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __googleAdsConfigured?: boolean;
  }
}

export function isGoogleAdsExcludedPath(pathname: string | null | undefined): boolean {
  return Boolean(pathname && (pathname === "/admin" || pathname.startsWith("/admin/")));
}

/**
 * Sets up `dataLayer`/`gtag` and queues the `js` + `config` commands once.
 * Idempotent, so whichever runs first (the tag component or an early
 * conversion) initialises it; gtag.js processes the queue when it loads.
 * Returns false when tracking is disabled for this page/build.
 */
export function initGoogleAds(): boolean {
  if (!GOOGLE_ADS_ENABLED || typeof window === "undefined") return false;
  if (isGoogleAdsExcludedPath(window.location.pathname)) return false;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // gtag.js requires the `arguments` object itself, not an array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }

  if (!window.__googleAdsConfigured) {
    window.gtag("js", new Date());
    window.gtag("config", GOOGLE_ADS_ID);
    window.__googleAdsConfigured = true;
  }

  return true;
}

/** Fires one Google Ads conversion. Safe no-op when tracking is disabled or blocked. */
export function trackGoogleAdsConversion(conversion: GoogleAdsConversion): void {
  try {
    if (!initGoogleAds()) return;
    window.gtag!("event", "conversion", {
      send_to: GOOGLE_ADS_CONVERSIONS[conversion],
    });
  } catch {
    // Tracking must never break the user flow.
  }
}

/** Links whose click counts as a "contact" conversion. */
export function isContactHref(href: string): boolean {
  return (
    href.startsWith("https://wa.me/") ||
    href.startsWith("https://api.whatsapp.com/") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}
