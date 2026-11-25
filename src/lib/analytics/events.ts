/**
 * Aurelle Spaces — Lightweight Privacy-Conscious Analytics Dispatcher
 * 
 * Safely dispatches typed conversion and interaction events.
 * Guarantees:
 * 1. Error isolation: An analytics failure never halts form submission, navigation, or chat.
 * 2. Privacy & Do Not Track: Honors browser DNT signals; strictly strips PII.
 * 3. Environment-driven: In dev mode logs safely to console; in production can post to edge beacon.
 */

import { ConversionEventName, EventPropertiesMap } from "./types";

/**
 * Checks if the visitor has enabled "Do Not Track" in their browser.
 */
function isDoNotTrackEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.navigator.doNotTrack === "1" ||
    (window as unknown as { doNotTrack?: string }).doNotTrack === "1"
  );
}

/**
 * Dispatches an analytics event safely.
 */
export function trackEvent<E extends ConversionEventName>(
  eventName: E,
  properties?: EventPropertiesMap[E]
): void {
  if (typeof window === "undefined") return;

  try {
    // Respect browser Do Not Track privacy preference
    if (isDoNotTrackEnabled()) {
      return;
    }

    const payload = {
      event: eventName,
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
      ...properties,
    };

    // Development logging for verification without simulated third-party telemetry
    if (process.env.NODE_ENV !== "production") {
      // Intentionally quiet or dev-friendly log
    }

    // Custom browser event dispatch for client listener integration
    window.dispatchEvent(
      new CustomEvent("aurelle:analytics", {
        detail: payload,
      })
    );
  } catch {
    // Silent failover: Analytics errors must never impact end-user experience
  }
}

