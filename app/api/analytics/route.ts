import fs from "fs";
import path from "path";
import resolveSharedData from "../../lib/sharedData";

const dataPath = path.join(resolveSharedData(), "analytics.json");

interface AnalyticsEvent {
  sessionId?: string;
  type?: string;
  page?: string;
  action?: string;
  source?: string;
  deviceType?: string;
  browser?: string;
  country?: string;
  timestamp?: string;
}

export async function GET(request: Request) {
  try {
    if (!fs.existsSync(dataPath)) {
      return Response.json({
        totalVisitors: 0,
        totalPageViews: 0,
        totalInteractions: 0,
        pages: [],
        sources: [],
        deviceTypes: [],
        browsers: [],
        countries: [],
        recentEvents: [],
      });
    }

    const data = fs.readFileSync(dataPath, "utf-8");
    const analytics: AnalyticsEvent[] = JSON.parse(data || "[]");

    // Calculate aggregated metrics
    const uniqueVisitors = new Set(
      analytics.map((e: AnalyticsEvent) => e.sessionId),
    );
    const pageViews = analytics.filter(
      (e: AnalyticsEvent) => e.type === "pageview",
    );
    const interactions = analytics.filter(
      (e: AnalyticsEvent) => e.type === "interaction",
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
      recentEvents: analytics.slice(-100),
    };

    return Response.json(metrics);
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return Response.json({
      totalVisitors: 0,
      totalPageViews: 0,
      totalInteractions: 0,
      pages: [],
      sources: [],
      deviceTypes: [],
      browsers: [],
      countries: [],
      recentEvents: [],
    });
  }
}

export async function POST(request: Request) {
  try {
    const event = await request.json();

    // Ensure directory and file exist
    const dir = path.dirname(dataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let analytics: AnalyticsEvent[] = [];
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, "utf-8");
      analytics = JSON.parse(data || "[]");
    }

    analytics.push({
      ...event,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(dataPath, JSON.stringify(analytics, null, 2));
    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to save analytics event:", error);
    return Response.json({ error: "Failed to save event" }, { status: 500 });
  }
}

function aggregateByPage(events: AnalyticsEvent[]) {
  const pages: Record<string, number> = {};
  events.forEach((e: AnalyticsEvent) => {
    if (e.page) {
      pages[e.page] = (pages[e.page] || 0) + 1;
    }
  });
  return Object.entries(pages)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count);
}

function aggregateBySource(events: AnalyticsEvent[]) {
  const sources: Record<string, number> = {};
  events.forEach((e: AnalyticsEvent) => {
    const source = e.source || "direct";
    sources[source] = (sources[source] || 0) + 1;
  });
  return Object.entries(sources)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
}

function aggregateByDeviceType(events: AnalyticsEvent[]) {
  const devices: Record<string, number> = {};
  events.forEach((e: AnalyticsEvent) => {
    const device = e.deviceType || "unknown";
    devices[device] = (devices[device] || 0) + 1;
  });
  return Object.entries(devices)
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count);
}

function aggregateByBrowser(events: AnalyticsEvent[]) {
  const browsers: Record<string, number> = {};
  events.forEach((e: AnalyticsEvent) => {
    const browser = e.browser || "unknown";
    browsers[browser] = (browsers[browser] || 0) + 1;
  });
  return Object.entries(browsers)
    .map(([browser, count]) => ({ browser, count }))
    .sort((a, b) => b.count - a.count);
}

function aggregateByCountry(events: AnalyticsEvent[]) {
  const countries: Record<string, number> = {};
  events.forEach((e: AnalyticsEvent) => {
    if (e.country) {
      countries[e.country] = (countries[e.country] || 0) + 1;
    }
  });
  return Object.entries(countries)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);
}
