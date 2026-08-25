export const GTAG_ADS_ID = "AW-18389826283";

type GtagFn = (...args: unknown[]) => void;

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const fn = (window as Window & { gtag?: GtagFn }).gtag;
  if (typeof fn !== "function") return;
  fn(...args);
}

export function trackGtagPageView(pagePath: string) {
  gtag("event", "page_view", { page_path: pagePath, send_to: GTAG_ADS_ID });
}

export function trackGtagLead(params: {
  eventLabel: string;
  eventCategory?: string;
  pagePath?: string;
}) {
  const pagePath =
    params.pagePath ||
    (typeof window !== "undefined" ? window.location.pathname : "");

  gtag("event", "generate_lead", {
    send_to: GTAG_ADS_ID,
    event_category: params.eventCategory || "contact",
    event_label: params.eventLabel,
    page_path: pagePath,
  });
}
