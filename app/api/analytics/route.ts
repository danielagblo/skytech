import fs from "fs";
import { isMysql } from "../../lib/db";
import * as mysql from "../../lib/mysql";
import { resolveSharedData } from "../../lib/sharedData";

interface AnalyticsEvent {
  sessionId?: string;
  type?: string;
  page?: string;
  action?: string;
  source?: string;
  deviceType?: string;
  browser?: string;
  country?: string;
  timestamp?: string | Date;
}

const EMPTY_METRICS = {
  totalVisitors: 0,
  totalPageViews: 0,
  totalInteractions: 0,
  pages: [],
  sources: [],
  deviceTypes: [],
  browsers: [],
  countries: [],
  recentEvents: [],
};

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
    source: event.source || "",
    device_type: event.deviceType || "",
    browser: event.browser || "",
    country: event.country || "",
    action: event.action || "",
    data: JSON.stringify(event),
    timestamp: new Date(),
  });
}

export async function GET(request: Request) {
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

    // Calculate aggregated metrics
    const uniqueVisitors = new Set(
      analytics.map((e: any) => e.sessionId),
    );
    const pageViews = analytics.filter(
      (e: any) => e.type === "pageview",
    );
    const interactions = analytics.filter(
      (e: any) => e.type === "interaction",
    );

    const metrics = {
      totalVisitors: uniqueVisitors.size,
      totalPageViews: pageViews.length,
      totalInteractions: interactions.length,
      pages: aggregateByPage(pageViews),
      sources: aggregateBySource(analytics),
      deviceTypes: aggregateByDeviceType(analytics),
      browsers: aggregateByBrowser(analytics),
      countries: aggregateByCountry(analytics),
      recentEvents: analytics.slice(-100).reverse(),
    };

    return Response.json(metrics);
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return Response.json(EMPTY_METRICS);
  }
}

export async function POST(request: Request) {
  try {
    const event = await request.json();

    if (isMysql()) {
      try {
        await saveAnalyticsMysql(event);
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
      } catch (e) {
        analytics = [];
      }
    }

    analytics.push({
      ...event,
      timestamp: new Date(),
    });

    // Keep only last 10,000 events to prevent file bloating
    if (analytics.length > 10000) {
      analytics = analytics.slice(-10000);
    }

    fs.writeFileSync(filePath, JSON.stringify(analytics, null, 2));

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to save analytics event:", error);
    // Even if saving to file fails, we don't want to return 500 to the user
    return Response.json({ success: false }, { status: 200 });
  }
}

function aggregateByPage(events: any[]) {
  const pages: Record<string, number> = {};
  events.forEach((e: any) => {
    if (e.page) {
      pages[e.page] = (pages[e.page] || 0) + 1;
    }
  });
  return Object.entries(pages)
    .map(([page, count]) => ({ page, count }))
    .sort((a: any, b: any) => b.count - a.count);
}

function aggregateBySource(events: any[]) {
  const sources: Record<string, number> = {};
  events.forEach((e: any) => {
    const source = e.source || "direct";
    sources[source] = (sources[source] || 0) + 1;
  });
  return Object.entries(sources)
    .map(([source, count]) => ({ source, count }))
    .sort((a: any, b: any) => b.count - a.count);
}

function aggregateByDeviceType(events: any[]) {
  const devices: Record<string, number> = {};
  events.forEach((e: any) => {
    const device = e.deviceType || "unknown";
    devices[device] = (devices[device] || 0) + 1;
  });
  return Object.entries(devices)
    .map(([device, count]) => ({ device, count }))
    .sort((a: any, b: any) => b.count - a.count);
}

function aggregateByBrowser(events: any[]) {
  const browsers: Record<string, number> = {};
  events.forEach((e: any) => {
    const browser = e.browser || "unknown";
    browsers[browser] = (browsers[browser] || 0) + 1;
  });
  return Object.entries(browsers)
    .map(([browser, count]) => ({ browser, count }))
    .sort((a: any, b: any) => b.count - a.count);
}

function aggregateByCountry(events: any[]) {
  const countries: Record<string, number> = {};
  events.forEach((e: any) => {
    if (e.country) {
      countries[e.country] = (countries[e.country] || 0) + 1;
    }
  });
  return Object.entries(countries)
    .map(([country, count]) => ({ country, count }))
    .sort((a: any, b: any) => b.count - a.count);
}