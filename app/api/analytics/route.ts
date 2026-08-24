import fs from "fs";
import { isMysql } from "../../lib/db";
import * as mysql from "../../lib/mysql";
import { resolveSharedData } from "../../lib/sharedData";
import {
  extractCampaign,
  isAdminPath,
  NOISE_ACTIONS,
  normalizePage,
  normalizeSourceLabel,
} from "../../lib/analyticsNormalize";
import {
  buildSessions,
  classifyAction,
  generateInsights,
  isConversionAction,
  pageLabel,
  summarizeWindow,
} from "../../lib/analyticsInsights";

const EMPTY_METRICS = {
  totalVisitors: 0,
  totalPageViews: 0,
  totalInteractions: 0,
  avgPagesPerSession: 0,
  bounceRate: 0,
  todayVisitors: 0,
  todayPageViews: 0,
  engagementRate: 0,
  conversionRate: 0,
  totalConversions: 0,
  medianDurationSec: 0,
  pages: [],
  sources: [],
  deviceTypes: [],
  browsers: [],
  countries: [],
  actions: [],
  actionCategories: [],
  campaigns: [],
  scrollDepth: [],
  dailyViews: [],
  dailyVisitors: [],
  recentEvents: [],
  insights: [] as any[],
  funnel: [] as any[],
  sourceQuality: [],
  landingPages: [],
  deviceQuality: [],
  conversionBreakdown: [],
  hourDistribution: [],
  weekdayDistribution: [],
  comparison: {
    thisWeekSessions: 0,
    lastWeekSessions: 0,
    thisWeekConversions: 0,
    lastWeekConversions: 0,
  },
  sampleSize: 0,
  analyzedThrough: null as string | null,
};

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
    "SELECT type, page, session_id, source, device_type, browser, country, action, timestamp, data FROM analytics_events ORDER BY timestamp ASC",
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
    data: r.data,
    campaign: extractCampaign(r),
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

function filterByDate(events: any[], fromKey: string, toKey: string) {
  return events.filter((e) => {
    const key = toDateKey(e.timestamp);
    return key && key >= fromKey && key <= toKey;
  });
}

function daysAgoKey(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
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

    const publicEvents = analytics
      .map((e: any) => ({
        ...e,
        page: normalizePage(e.page),
        source: normalizeSourceLabel(e.source),
        campaign: extractCampaign(e),
      }))
      .filter((e: any) => !isAdminPath(e.page));

    const pageViews = publicEvents.filter((e: any) => e.type === "pageview");
    const interactions = publicEvents.filter((e: any) => e.type === "interaction");
    const sessions = buildSessions(publicEvents);
    const allSummary = summarizeWindow(sessions, publicEvents);

    const todayKey = new Date().toISOString().slice(0, 10);
    const weekStart = daysAgoKey(6);
    const prevWeekStart = daysAgoKey(13);
    const prevWeekEnd = daysAgoKey(7);

    const thisWeekEvents = filterByDate(publicEvents, weekStart, todayKey);
    const lastWeekEvents = filterByDate(publicEvents, prevWeekStart, prevWeekEnd);
    const recentSummary = summarizeWindow(buildSessions(thisWeekEvents), thisWeekEvents);
    const previousSummary = summarizeWindow(buildSessions(lastWeekEvents), lastWeekEvents);

    const todayEvents = publicEvents.filter((e: any) => toDateKey(e.timestamp) === todayKey);
    const todayVisitors = new Set(todayEvents.map((e: any) => e.sessionId).filter(Boolean)).size;
    const todayPageViews = todayEvents.filter((e: any) => e.type === "pageview").length;

    const dailyMap: Record<string, { views: number; visitors: Set<string> }> = {};
    for (let i = 13; i >= 0; i--) {
      const key = daysAgoKey(i);
      dailyMap[key] = { views: 0, visitors: new Set() };
    }
    pageViews.forEach((e: any) => {
      const key = toDateKey(e.timestamp);
      if (key in dailyMap) {
        dailyMap[key].views += 1;
        if (e.sessionId) dailyMap[key].visitors.add(e.sessionId);
      }
    });

    const pagesAgg = aggregateCount(pageViews, (e) => e.page || "/");
    const sourcesAgg = aggregateCount(
      sessions.map((s) => ({ source: s.source })),
      (e) => e.source || "direct",
    );
    const devicesAgg = aggregateCount(
      sessions.map((s) => ({ deviceType: s.device })),
      (e) => e.deviceType || "unknown",
    );
    const browsersAgg = aggregateCount(
      sessions.map((s) => ({ browser: s.browser })),
      (e) => e.browser || "unknown",
    );
    const countriesAgg = aggregateCount(
      publicEvents.filter((e: any) => e.country),
      (e) => e.country,
    );
    const campaignsAgg = aggregateCount(
      pageViews.filter((e: any) => e.campaign),
      (e) => String(e.campaign).slice(0, 80),
    );
    const meaningfulActions = interactions.filter(
      (e: any) =>
        e.action &&
        !String(e.action).startsWith("scroll_") &&
        !NOISE_ACTIONS.has(String(e.action)),
    );
    const actionsAgg = aggregateCount(meaningfulActions, (e) => String(e.action).slice(0, 80));
    const actionCategories = aggregateCount(meaningfulActions, (e) => classifyAction(e.action));
    const scrollAgg = aggregateCount(
      interactions.filter((e: any) => String(e.action || "").startsWith("scroll_")),
      (e) => String(e.action).replace("scroll_", ""),
    );

    const conversions = interactions.filter((e: any) => isConversionAction(e.action, e.page));
    const engagedSessions = sessions.filter((s) => s.engaged).length;
    const convertedSessions = sessions.filter((s) => s.converted).length;

    const funnel = [
      { step: "Visited", count: sessions.length, rate: 100 },
      {
        step: "Engaged",
        count: engagedSessions,
        rate: sessions.length ? Math.round((engagedSessions / sessions.length) * 100) : 0,
      },
      {
        step: "Became a lead",
        count: convertedSessions,
        rate: sessions.length ? Math.round((convertedSessions / sessions.length) * 100) : 0,
      },
    ];

    const insights = generateInsights({
      all: allSummary,
      recent: recentSummary,
      previous: previousSummary,
      sampleNote: `Based on ${sessions.length} unique sessions and ${pageViews.length} page views.`,
    });

    return Response.json({
      totalVisitors: sessions.length,
      totalPageViews: pageViews.length,
      totalInteractions: interactions.length,
      avgPagesPerSession: allSummary.pagesPerSession,
      bounceRate: allSummary.bounceRate,
      todayVisitors,
      todayPageViews,
      engagementRate: allSummary.engagementRate,
      conversionRate: allSummary.conversionRate,
      totalConversions: conversions.length,
      medianDurationSec: allSummary.medianDurationSec,
      pages: pagesAgg.map((r) => ({
        page: r.key,
        label: pageLabel(r.key),
        count: r.count,
      })),
      sources: sourcesAgg.map((r) => ({ source: r.key, count: r.count })),
      deviceTypes: devicesAgg.map((r) => ({ device: r.key, count: r.count })),
      browsers: browsersAgg.map((r) => ({ browser: r.key, count: r.count })),
      countries: countriesAgg.map((r) => ({ country: r.key, count: r.count })),
      campaigns: campaignsAgg.slice(0, 20).map((r) => ({ campaign: r.key, count: r.count })),
      actions: actionsAgg.slice(0, 25).map((r) => ({ action: r.key, count: r.count })),
      actionCategories: actionCategories.map((r) => ({ category: r.key, count: r.count })),
      scrollDepth: scrollAgg.map((r) => ({ depth: r.key, count: r.count })),
      dailyViews: Object.entries(dailyMap).map(([date, v]) => ({
        date: date.slice(5),
        count: v.views,
      })),
      dailyVisitors: Object.entries(dailyMap).map(([date, v]) => ({
        date: date.slice(5),
        count: v.visitors.size,
      })),
      recentEvents: publicEvents.slice(-100).reverse(),
      insights,
      funnel,
      sourceQuality: allSummary.sourceRows,
      landingPages: allSummary.landingRows,
      deviceQuality: allSummary.deviceRows,
      conversionBreakdown: allSummary.conversionBreakdown.map((r) => ({
        type: r.key,
        count: r.count,
      })),
      hourDistribution: allSummary.hourRows.filter((h) => h.sessions > 0),
      weekdayDistribution: allSummary.weekdayRows,
      comparison: {
        thisWeekSessions: recentSummary.sessions,
        lastWeekSessions: previousSummary.sessions,
        thisWeekConversions: recentSummary.converted,
        lastWeekConversions: previousSummary.converted,
      },
      sampleSize: sessions.length,
      analyzedThrough: todayKey,
      peakHour: allSummary.peakHour,
      peakDay: allSummary.peakDay,
    });
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return Response.json(EMPTY_METRICS);
  }
}

export async function POST(request: Request) {
  try {
    const event = await request.json();

    if (typeof event.page === "string" && isAdminPath(event.page)) {
      return Response.json({ success: true, skipped: true });
    }

    const normalized = {
      ...event,
      page: normalizePage(event.page),
      source: normalizeSourceLabel(event.source),
      campaign: String(event.campaign || "").slice(0, 80),
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
