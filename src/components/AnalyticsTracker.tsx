"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    try {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname }),
      }).catch(() => {});
    } catch {
      // Ignore background tracking errors
    }
  }, [pathname]);

  return null;
}
