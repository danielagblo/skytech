"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const UTM_KEY = "analytics_utm";

function getSessionId() {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem("analytics_session_id");
    if (!id) {
      id =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem("analytics_session_id", id);
    }
    return id;
  } catch {
    return `sess_${Date.now()}`;
  }
}

function getDeviceType() {
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/.test(ua)) return "tablet";
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(ua)) return "mobile";
  return "desktop";
}

function getBrowserName() {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Trident")) return "Internet Explorer";
  return "Other";
}

function readStoredUtm() {
  try {
    const raw = sessionStorage.getItem(UTM_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function captureUtm() {
  const params = new URLSearchParams(window.location.search);
  const utm = {
    source: (params.get("utm_source") || params.get("source") || params.get("ref") || "").toLowerCase(),
    medium: (params.get("utm_medium") || "").toLowerCase(),
    campaign: (params.get("utm_campaign") || "").slice(0, 80),
    content: (params.get("utm_content") || "").slice(0, 80),
  };
  if (utm.source || utm.medium || utm.campaign) {
    sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
    return utm;
  }
  return readStoredUtm();
}

function normalizeSource() {
  const utm = captureUtm();
  if (utm?.source) return utm.source;

  const referrer = document.referrer;
  if (!referrer) return "direct";

  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
    const here = window.location.hostname.replace(/^www\./, "").toLowerCase();
    if (host.includes(here) || here.includes(host)) return "internal";
    if (host.includes("google")) return "google";
    if (host.includes("bing")) return "bing";
    if (host.includes("facebook") || host.includes("fb.")) return "facebook";
    if (host.includes("instagram")) return "instagram";
    if (host.includes("twitter") || host.includes("x.com") || host.includes("t.co")) return "twitter";
    if (host.includes("linkedin")) return "linkedin";
    if (host.includes("whatsapp") || host.includes("wa.me")) return "whatsapp";
    if (host.includes("youtube")) return "youtube";
    if (host.includes("tiktok")) return "tiktok";
    return host;
  } catch {
    return "referral";
  }
}

function shouldSkip(pathname) {
  if (!pathname) return true;
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api")
  );
}

function actionLabel(el) {
  if (!el) return "click";
  const aria = el.getAttribute?.("aria-label");
  if (aria) return aria.trim().slice(0, 80);
  const text = (el.textContent || el.value || "").replace(/\s+/g, " ").trim();
  if (text) return text.slice(0, 80);
  if (el.tagName === "A" && el.getAttribute("href")) return `link:${el.getAttribute("href")}`;
  return `${el.tagName?.toLowerCase() || "element"}_click`;
}

function gtagEvent(name, params) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

function conversionForAction(action, page) {
  const a = String(action || "").toLowerCase();
  if (a.includes("apply now") || page.includes("internship")) {
    if (a.includes("apply")) {
      gtagEvent("generate_lead", { event_category: "internship", event_label: action });
      return;
    }
  }
  if (a.includes("whatsapp") || a.includes("chat with us") || a.includes("start chat")) {
    gtagEvent("generate_lead", { event_category: "whatsapp", event_label: action });
    return;
  }
  if (a.includes("book a meeting") || a.includes("form_submit")) {
    gtagEvent("generate_lead", { event_category: "contact", event_label: action });
  }
}

function contextPayload() {
  const utm = captureUtm() || {};
  return {
    sessionId: getSessionId(),
    source: normalizeSource(),
    medium: utm.medium || "",
    campaign: utm.campaign || "",
    content: utm.content || "",
    deviceType: getDeviceType(),
    browser: getBrowserName(),
    timestamp: new Date().toISOString(),
  };
}

async function postEvent(payload) {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // ignore tracking failures
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const scrollMarks = useRef(new Set());
  const lastPath = useRef("");

  useEffect(() => {
    if (!pathname || shouldSkip(pathname)) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    scrollMarks.current = new Set();

    postEvent({
      type: "pageview",
      page: pathname,
      ...contextPayload(),
    });
    gtagEvent("page_view", { page_path: pathname });
  }, [pathname]);

  useEffect(() => {
    if (shouldSkip(pathname || "")) return;

    const handleClick = (e) => {
      const target = e.target.closest("a, button, [role='button'], input[type='submit']");
      if (!target) return;
      if (target.closest("[data-no-track]")) return;

      const action = actionLabel(target);
      const page = window.location.pathname;
      postEvent({
        type: "interaction",
        action,
        page,
        ...contextPayload(),
      });
      conversionForAction(action, page);
    };

    const handleFormSubmit = (e) => {
      if (e.target.tagName !== "FORM") return;
      const formName = e.target.getAttribute("name") || e.target.id || e.target.action || "form";
      const action = `form_submit:${String(formName).slice(0, 60)}`;
      postEvent({
        type: "interaction",
        action,
        page: window.location.pathname,
        ...contextPayload(),
      });
      conversionForAction(action, window.location.pathname);
    };

    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = Math.round((window.scrollY / scrollable) * 100);
      for (const mark of [25, 50, 75, 100]) {
        if (pct >= mark && !scrollMarks.current.has(mark)) {
          scrollMarks.current.add(mark);
          postEvent({
            type: "interaction",
            action: `scroll_${mark}%`,
            page: window.location.pathname,
            ...contextPayload(),
          });
        }
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleFormSubmit, true);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleFormSubmit, true);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return null;
}
