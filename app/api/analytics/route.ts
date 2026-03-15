import dbConnect from "../../lib/mongodb";
import Analytics from "../../models/Analytics";

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

export async function GET(request: Request) {
  try {
    await dbConnect();
    const analytics = await Analytics.find({}).lean();

    if (!analytics || analytics.length === 0) {
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
    await dbConnect();

    await Analytics.create({
      ...event,
      timestamp: new Date(),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to save analytics event:", error);
    return Response.json({ error: "Failed to save event" }, { status: 500 });
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
    .sort((a, b) => b.count - a.count);
}

function aggregateBySource(events: any[]) {
  const sources: Record<string, number> = {};
  events.forEach((e: any) => {
    const source = e.source || "direct";
    sources[source] = (sources[source] || 0) + 1;
  });
  return Object.entries(sources)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
}

function aggregateByDeviceType(events: any[]) {
  const devices: Record<string, number> = {};
  events.forEach((e: any) => {
    const device = e.deviceType || "unknown";
    devices[device] = (devices[device] || 0) + 1;
  });
  return Object.entries(devices)
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count);
}

function aggregateByBrowser(events: any[]) {
  const browsers: Record<string, number> = {};
  events.forEach((e: any) => {
    const browser = e.browser || "unknown";
    browsers[browser] = (browsers[browser] || 0) + 1;
  });
  return Object.entries(browsers)
    .map(([browser, count]) => ({ browser, count }))
    .sort((a, b) => b.count - a.count);
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
    .sort((a, b) => b.count - a.count);
}
