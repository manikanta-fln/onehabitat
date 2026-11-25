"use client";

import { useEffect } from "react";
import { trackGoogleAdsConversion } from "@/lib/analytics/google-ads";

/** Fires the Google Ads "Page view" conversion when this page is shown. */
export default function GoogleAdsPageView() {
  useEffect(() => {
    trackGoogleAdsConversion("pageView");
  }, []);

  return null;
}
