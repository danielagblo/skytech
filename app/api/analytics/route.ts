import fs from "fs";
import { isMysql } from "../../lib/db";
import * as mysql from "../../lib/mysql";
import { resolveSharedData } from "../../lib/sharedData";

const EMPTY_METRICS = {
  totalVisitors: 0,
  totalPageViews: 0,
  totalInteractions: 0,
  avgPagesPerSession: 0,
  bounceRate: 0,
  todayVisitors: 0,
  todayPageViews: 0,
  pages: [],
  sources: [],
  deviceTypes: [],
  browsers: [],
  countries: [],
  actions: [],
  scrollDepth: [],
  dailyViews: [],
  recentEvents: [],
};

function normalizeSourceLabel(raw: string | undefined | null): string {
  if (!raw || raw === "direct") return "direct";
  const value = String(raw).trim().toLowerCase();
  if (!value || value === "direct") return "direct";

  if (value.startsWith("http")) {
    try {
      const host = new URL(value).hostname.replace(/^www\./, "");
      if (host.includes("google")) return "google";
      if (host.includes("facebook") || host.includes("fb.")) return "facebook";
      if (host.includes("instagram")) return "instagram";
      if (host.includes("linkedin")) return "linkedin";
      if (host.includes("twitter") || host.includes("x.com") || host.includes("t.co")) return "twitter";
      if (host.includes("whatsapp") || host.includes("wa.me")) return "whatsapp";
      if (host.includes("youtube")) return "youtube";
      if (host.includes("tiktok")) return "tiktok";
      return host || "referral";
    } catch {
      return "referral";
    }
  }

  return value.slice(0, 60);
}

function toDateKey(ts: string | Date | undefined): string {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function aggregateCount(events: any[], keyFn: (e: any) => string) {
  const map: Record<string, number> = {};
  events.forEach((e) => {
    const key = keyFn(e);
    if (!key) return;
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

async function getAnalyticsMysql(): Promise<any[]> {
  await mysql.initSchema();
  const rows = await mysql.query(
    "SELECT type, page, session_id, source, device_type, browser, country, action, timestamp FROM analytics_events ORDER BY timestamp ASC",
  );
  return rows.map((r) => ({
    sessionId: r.session_id,
    type: r.type,
    page: r.page,
    action: r.action,
    source: r.source,
    deviceType: r.device_type,
    browser: r.browser,
    country: r.country,
    timestamp: r.timestamp,
  }));
}

async function saveAnalyticsMysql(event: any): Promise<void> {
  await mysql.initSchema();
  await mysql.insert("analytics_events", {
    type: event.type || "",
    page: event.page || "",
    session_id: event.sessionId || "",
    source: normalizeSourceLabel(event.source),
    device_type: event.deviceType || "",
    browser: event.browser || "",
    country: event.country || "",
    action: String(event.action || "").slice(0, 255),
    data: JSON.stringify(event),
    timestamp: new Date(),
  });
}

export async function GET() {
  try {
    let analytics: any[];

    if (isMysql()) {
      analytics = await getAnalyticsMysql();
    } else {
      const filePath = resolveSharedData("analytics.json");
      analytics = [];
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf8");
        try {
          analytics = JSON.parse(data);
        } catch (e) {
          console.error("Failed to parse analytics.json:", e);
          analytics = [];
        }
      }
    }

    if (!analytics || analytics.length === 0) {
      return Response.json(EMPTY_METRICS);
    }

    const uniqueVisitors = new Set(analytics.map((e: any) => e.sessionId).filter(Boolean));
    const pageViews = analytics.filter((e: any) => e.type === "pageview");
    const interactions = analytics.filter((e: any) => e.type === "interaction");

    const viewsBySession: Record<string, number> = {};
    pageViews.forEach((e: any) => {
      if (!e.sessionId) return;
      viewsBySession[e.sessionId] = (viewsBySession[e.sessionId] || 0) + 1;
    });
    const sessionIds = Object.keys(viewsBySession);
    const bounced = sessionIds.filter((id) => viewsBySession[id] === 1).length;
    const avgPagesPerSession =
      sessionIds.length > 0
        ? Math.round((pageViews.length / sessionIds.length) * 10) / 10
        : 0;
    const bounceRate =
      sessionIds.length > 0 ? Math.round((bounced / sessionIds.length) * 100) : 0;

    const todayKey = new Date().toISOString().slice(0, 10);
    const todayEvents = analytics.filter((e: any) => toDateKey(e.timestamp) === todayKey);
    const todayVisitors = new Set(todayEvents.map((e: any) => e.sessionId).filter(Boolean)).size;
    const todayPageViews = todayEvents.filter((e: any) => e.type === "pageview").length;

    const dailyMap: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().slice(0, 10)] = 0;
    }
    pageViews.forEach((e: any) => {
      const key = toDateKey(e.timestamp);
      if (key in dailyMap) dailyMap[key] += 1;
    });

    const pagesAgg = aggregateCount(pageViews, (e) => e.page || "/");
    const sourcesAgg = aggregateCount(pageViews, (e) => normalizeSourceLabel(e.source));
    const devicesAgg = aggregateCount(analytics, (e) => e.deviceType || "unknown");
    const browsersAgg = aggregateCount(analytics, (e) => e.browser || "unknown");
    const countriesAgg = aggregateCount(
      analytics.filter((e: any) => e.country),
      (e) => e.country,
    );
    const actionsAgg = aggregateCount(
      interactions.filter((e: any) => e.action && !String(e.action).startsWith("scroll_")),
      (e) => String(e.action).slice(0, 80),
    );
    const scrollAgg = aggregateCount(
      interactions.filter((e: any) => String(e.action || "").startsWith("scroll_")),
      (e) => String(e.action).replace("scroll_", ""),
    );

    return Response.json({
      totalVisitors: uniqueVisitors.size,
      totalPageViews: pageViews.length,
      totalInteractions: interactions.length,
      avgPagesPerSession,
      bounceRate,
      todayVisitors,
      todayPageViews,
      pages: pagesAgg.map((r) => ({ page: r.key, count: r.count })),
      sources: sourcesAgg.map((r) => ({ source: r.key, count: r.count })),
      deviceTypes: devicesAgg.map((r) => ({ device: r.key, count: r.count })),
      browsers: browsersAgg.map((r) => ({ browser: r.key, count: r.count })),
      countries: countriesAgg.map((r) => ({ country: r.key, count: r.count })),
      actions: actionsAgg.slice(0, 25).map((r) => ({ action: r.key, count: r.count })),
      scrollDepth: scrollAgg.map((r) => ({ depth: r.key, count: r.count })),
      dailyViews: Object.entries(dailyMap).map(([date, count]) => ({
        date: date.slice(5),
        count,
      })),
      recentEvents: analytics.slice(-100).reverse(),
    });
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return Response.json(EMPTY_METRICS);
  }
}

export async function POST(request: Request) {
  try {
    const event = await request.json();

    if (
      typeof event.page === "string" &&
      (event.page.startsWith("/dashboard") || event.page.startsWith("/login"))
    ) {
      return Response.json({ success: true, skipped: true });
    }

    const normalized = {
      ...event,
      source: normalizeSourceLabel(event.source),
      action: event.action ? String(event.action).slice(0, 255) : "",
    };

    if (isMysql()) {
      try {
        await saveAnalyticsMysql(normalized);
        return Response.json({ success: true });
      } catch (error) {
        console.error("Failed to save analytics event to MySQL:", error);
        return Response.json({ success: false }, { status: 200 });
      }
    }

    const filePath = resolveSharedData("analytics.json");
    let analytics: any[] = [];

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      try {
        analytics = JSON.parse(data);
      } catch {
        analytics = [];
      }
    }

    analytics.push({
      ...normalized,
      timestamp: new Date(),
    });

    if (analytics.length > 10000) {
      analytics = analytics.slice(-10000);
    }

    fs.writeFileSync(filePath, JSON.stringify(analytics, null, 2));

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to save analytics event:", error);
    return Response.json({ success: false }, { status: 200 });
  }
}
