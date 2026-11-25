/**
 * Aurelle Spaces — Cloudflare Web Analytics Integration
 * 
 * Injects the privacy-first Cloudflare Web Analytics beacon script ONLY when
 * a real `NEXT_PUBLIC_CF_BEACON_TOKEN` is configured in the environment.
 * Never fabricates or hardcodes an analytics token.
 */

import React from "react";
import Script from "next/script";

export function CloudflareAnalytics() {
  const beaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

  // Do not inject scripts if token is missing
  if (!beaconToken || beaconToken.trim().length === 0) {
    return null;
  }

  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: beaconToken.trim() })}
      strategy="afterInteractive"
    />
  );
}

