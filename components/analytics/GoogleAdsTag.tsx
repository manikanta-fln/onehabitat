"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  GOOGLE_ADS_ENABLED,
  GOOGLE_ADS_ID,
  initGoogleAds,
  isContactHref,
  isGoogleAdsExcludedPath,
  trackGoogleAdsConversion,
} from "@/lib/analytics/google-ads";

/**
 * Loads the Google Ads tag (gtag.js) on public pages in production, and
 * counts clicks on WhatsApp / email / phone links as "contact" conversions
 * (one delegated listener instead of editing every link).
 */
export default function GoogleAdsTag() {
  const pathname = usePathname();
  const excluded = isGoogleAdsExcludedPath(pathname);

  useEffect(() => {
    if (excluded || !initGoogleAds()) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a[href]");
      const href = link?.getAttribute("href");
      if (href && isContactHref(href)) {
        trackGoogleAdsConversion("contact");
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [excluded]);

  if (!GOOGLE_ADS_ENABLED || excluded) return null;

  return (
    <Script
      id="google-ads-gtag"
      src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
      strategy="afterInteractive"
    />
  );
}
