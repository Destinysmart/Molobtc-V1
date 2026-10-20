/**
 * MoloBTC Built-in Sovereign Analytics Service
 * 100% Free, Self-Contained, Zero Cookies, Privacy-First.
 * Real-time telemetry engine mimicking enterprise Google Analytics 4 (GA4).
 */

export interface AnalyticsProps {
  [key: string]: string | number | boolean | undefined;
}

function getAnonymousVisitorId(): string {
  if (typeof window === "undefined") return "v_anon";
  try {
    let vid = localStorage.getItem("molo_vid");
    if (!vid) {
      vid = "v_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 8);
      localStorage.setItem("molo_vid", vid);
    }
    return vid;
  } catch {
    return "v_fallback";
  }
}

function getSessionId(): string {
  if (typeof window === "undefined") return "s_anon";
  try {
    let sid = sessionStorage.getItem("molo_sid");
    if (!sid) {
      sid = "s_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6);
      sessionStorage.setItem("molo_sid", sid);
    }
    return sid;
  } catch {
    return "s_fallback";
  }
}

function detectClientContext() {
  if (typeof window === "undefined") {
    return {
      device: "desktop",
      browser: "Chrome",
      os: "macOS",
      screen: "1920x1080",
      referrer: "direct",
      language: "en-US",
    };
  }

  const ua = navigator.userAgent;
  let device = "desktop";
  if (/mobile/i.test(ua)) device = "mobile";
  else if (/tablet|ipad/i.test(ua)) device = "tablet";

  let browser = "Chrome";
  if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/edg/i.test(ua)) browser = "Edge";
  else if (/opera|opr/i.test(ua)) browser = "Opera";

  let os = "macOS";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/linux/i.test(ua)) os = "Linux";

  let ref = "Direct / None";
  if (typeof document !== "undefined" && document.referrer) {
    try {
      const url = new URL(document.referrer);
      if (url.hostname.includes("google")) ref = "google.com (Organic)";
      else if (url.hostname.includes("github")) ref = "github.com (Referral)";
      else if (url.hostname.includes("bitcoinafricastory")) ref = "bitcoinafricastory.com (Press)";
      else if (url.hostname.includes("twitter") || url.hostname.includes("t.co") || url.hostname.includes("x.com")) ref = "x.com (Social)";
      else ref = url.hostname;
    } catch {
      ref = document.referrer.slice(0, 40);
    }
  }

  return {
    device,
    browser,
    os,
    screen: `${window.screen?.width || window.innerWidth}x${window.screen?.height || window.innerHeight}`,
    referrer: ref,
    language: navigator.language || "en",
  };
}

/**
 * Dispatches an event directly to the internal sovereign analytics API.
 * Uses navigator.sendBeacon when possible to ensure zero UX blocking.
 */
export function trackEvent(eventName: string, props?: AnalyticsProps) {
  if (typeof window === "undefined" || !eventName) return;

  const visitorId = getAnonymousVisitorId();
  const sessionId = getSessionId();
  const clientContext = detectClientContext();

  const payload = JSON.stringify({
    eventName,
    visitorId,
    sessionId,
    props: {
      ...clientContext,
      ...(props || {}),
    },
    timestamp: Date.now(),
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      const sent = navigator.sendBeacon("/api/analytics/event", blob);
      if (sent) return;
    }

    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Sovereign analytics fail silently
    });
  } catch {
    // Ignore analytics errors
  }
}

/**
 * Tracks a page visit.
 */
export function trackPageView(path?: string) {
  trackEvent("page_view", {
    path: path || (typeof window !== "undefined" ? window.location.pathname + window.location.hash : "/"),
    title: typeof document !== "undefined" ? document.title : "MoloBTC",
  });
}

/**
 * Tracks sovereign whitepaper and document downloads.
 */
export function trackWhitepaperDownload(docId: string, docTitle: string) {
  trackEvent("Download Whitepaper", {
    documentId: docId,
    title: docTitle,
  });
}

/**
 * Tracks research keyword queries in the search overlay or inline filter.
 */
export function trackSearchQuery(query: string, source: "navbar" | "research_section") {
  if (!query || query.trim().length < 2) return;
  trackEvent("Search Research", {
    query: query.trim().toLowerCase(),
    source,
  });
}

/**
 * Tracks Molo AI queries.
 */
export function trackAiQuestion(prompt: string, topic?: string) {
  trackEvent("Molo AI Query", {
    topic: topic || "General Bitcoin Sovereignty",
    promptLength: prompt.length,
  });
}

/**
 * Tracks clicks on external media interviews and investigative articles.
 */
export function trackMediaClick(
  title: string,
  source: string,
  mediaType: "article" | "video" | "youtube" | string
) {
  trackEvent("Media Coverage Click", {
    title,
    source,
    type: mediaType,
  });
}

/**
 * Tracks Blink Lightning donation button engagements.
 */
export function trackLightningSupport(action: "view" | "donate_click" | "copy_address") {
  trackEvent("Lightning Support", {
    action,
  });
}

/**
 * Tracks GitHub repository outbound links.
 */
export function trackGithubRepoClick(repoName: string) {
  trackEvent("GitHub Repository Visit", {
    repository: repoName,
  });
}
