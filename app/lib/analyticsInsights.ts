export type InsightSeverity = "opportunity" | "watch" | "good" | "info";

export interface Insight {
  severity: InsightSeverity;
  title: string;
  detail: string;
  action: string;
}

export interface SessionStats {
  id: string;
  landingPage: string;
  exitPage: string;
  source: string;
  device: string;
  browser: string;
  views: number;
  bounced: boolean;
  converted: boolean;
  conversionType: string | null;
  engaged: boolean;
  durationMs: number;
  hour: number;
  weekday: number;
  startedAt: number;
}

const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/landing": "Landing",
  "/pricing": "Pricing",
  "/internship": "Internship",
  "/about": "About",
  "/contact": "Contact",
  "/insights": "Insights / Blog",
  "/foundation": "Foundation",
  "/services": "Services",
  "/gallery": "Gallery",
  "/team": "Team",
};

export function pageLabel(path: string): string {
  if (PAGE_LABELS[path]) return PAGE_LABELS[path];
  if (path.startsWith("/insights/")) return "Blog post";
  return path || "Unknown";
}

export function isConversionAction(action: string, page = ""): boolean {
  const a = String(action || "").toLowerCase();
  const p = String(page || "").toLowerCase();
  if (!a) return false;
  if (a.startsWith("scroll_")) return false;
  if (a.includes("whatsapp") || a.includes("start chat") || a.includes("chat with us")) return true;
  if (a.includes("open on what")) return true;
  if (a.startsWith("form_submit")) return true;
  if (a.includes("book a meeting") || a.includes("send message")) return true;
  if (a.includes("apply now") || (p.includes("internship") && a.includes("apply"))) return true;
  return false;
}

export function conversionKind(action: string): string {
  const a = String(action || "").toLowerCase();
  if (a.includes("whatsapp") || a.includes("start chat") || a.includes("chat with us") || a.includes("open on what")) {
    return "WhatsApp";
  }
  if (a.includes("internship") || a.includes("apply")) return "Internship apply";
  if (a.startsWith("form_submit") || a.includes("book a meeting") || a.includes("send message")) return "Contact form";
  return "Lead";
}

export function classifyAction(action: string): string {
  const a = String(action || "").toLowerCase();
  if (a.startsWith("scroll_")) return "Scroll";
  if (isConversionAction(action)) return conversionKind(action);
  if (a.includes("pricing") || a.includes("package")) return "Pricing interest";
  if (a.includes("internship")) return "Internship interest";
  if (a.includes("nav") || a === "home" || a === "about" || a === "contact" || a === "services") return "Navigation";
  if (a.startsWith("link:")) return "Outbound / link";
  return "Click";
}

function eventTime(e: any): number {
  const t = new Date(e.timestamp).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function ghanaHour(ts: number): number {
  try {
    return Number(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Accra",
        hour: "numeric",
        hour12: false,
      }).format(new Date(ts)),
    );
  } catch {
    return new Date(ts).getUTCHours();
  }
}

function ghanaWeekday(ts: number): number {
  try {
    const day = new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Accra",
      weekday: "short",
    }).format(new Date(ts));
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(day);
  } catch {
    return new Date(ts).getUTCDay();
  }
}

export function buildSessions(events: any[]): SessionStats[] {
  const grouped: Record<string, any[]> = {};
  events.forEach((e) => {
    const id = e.sessionId || "unknown";
    if (!grouped[id]) grouped[id] = [];
    grouped[id].push(e);
  });

  return Object.entries(grouped)
    .filter(([id]) => id !== "unknown")
    .map(([id, list]) => {
      const sorted = [...list].sort((a, b) => eventTime(a) - eventTime(b));
      const views = sorted.filter((e) => e.type === "pageview");
      const interactions = sorted.filter((e) => e.type === "interaction");
      const landing = views[0]?.page || sorted[0]?.page || "/";
      const exit = views[views.length - 1]?.page || landing;
      const firstView = views[0] || sorted[0];
      const source =
        firstView?.source && firstView.source !== "internal"
          ? firstView.source
          : views.find((v) => v.source && v.source !== "internal")?.source || "direct";

      const convEvent = interactions.find((e) => isConversionAction(e.action, e.page));
      const maxScroll = interactions.reduce((max, e) => {
        const m = String(e.action || "").match(/^scroll_(\d+)%$/);
        return m ? Math.max(max, Number(m[1])) : max;
      }, 0);
      const clicks = interactions.filter((e) => !String(e.action || "").startsWith("scroll_")).length;
      const start = eventTime(sorted[0]);
      const end = eventTime(sorted[sorted.length - 1]);

      return {
        id,
        landingPage: landing,
        exitPage: exit,
        source: source || "direct",
        device: firstView?.deviceType || "unknown",
        browser: firstView?.browser || "unknown",
        views: views.length,
        bounced: views.length <= 1 && !convEvent,
        converted: Boolean(convEvent),
        conversionType: convEvent ? conversionKind(convEvent.action) : null,
        engaged: views.length > 1 || maxScroll >= 50 || clicks > 0 || Boolean(convEvent),
        durationMs: Math.max(0, end - start),
        hour: ghanaHour(start || Date.now()),
        weekday: ghanaWeekday(start || Date.now()),
        startedAt: start,
      };
    });
}

function pct(part: number, whole: number): number {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function median(nums: number[]): number {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function groupCount<T>(items: T[], keyFn: (item: T) => string) {
  const map: Record<string, number> = {};
  items.forEach((item) => {
    const key = keyFn(item);
    if (!key) return;
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

export function summarizeWindow(sessions: SessionStats[], events: any[]) {
  const n = sessions.length;
  const bounced = sessions.filter((s) => s.bounced).length;
  const converted = sessions.filter((s) => s.converted).length;
  const engaged = sessions.filter((s) => s.engaged).length;
  const views = sessions.reduce((sum, s) => sum + s.views, 0);
  const durations = sessions.filter((s) => s.durationMs > 0 && s.views > 1).map((s) => s.durationMs);

  const conversions = events.filter(
    (e) => e.type === "interaction" && isConversionAction(e.action, e.page),
  );
  const conversionBreakdown = groupCount(conversions, (e) => conversionKind(e.action));

  const sourceRows = groupCount(sessions, (s) => s.source).map((row) => {
    const subset = sessions.filter((s) => s.source === row.key);
    const conv = subset.filter((s) => s.converted).length;
    const bounce = subset.filter((s) => s.bounced).length;
    return {
      source: row.key,
      sessions: subset.length,
      share: pct(subset.length, n),
      bounceRate: pct(bounce, subset.length),
      pagesPerSession: Math.round((avg(subset.map((s) => s.views)) || 0) * 10) / 10,
      conversions: conv,
      conversionRate: pct(conv, subset.length),
    };
  });

  const landingRows = groupCount(sessions, (s) => s.landingPage).map((row) => {
    const subset = sessions.filter((s) => s.landingPage === row.key);
    const conv = subset.filter((s) => s.converted).length;
    const bounce = subset.filter((s) => s.bounced).length;
    return {
      page: row.key,
      label: pageLabel(row.key),
      sessions: subset.length,
      bounceRate: pct(bounce, subset.length),
      conversions: conv,
      conversionRate: pct(conv, subset.length),
    };
  });

  const deviceRows = groupCount(sessions, (s) => s.device || "unknown").map((row) => {
    const subset = sessions.filter((s) => (s.device || "unknown") === row.key);
    return {
      device: row.key,
      sessions: subset.length,
      share: pct(subset.length, n),
      bounceRate: pct(subset.filter((s) => s.bounced).length, subset.length),
      conversionRate: pct(subset.filter((s) => s.converted).length, subset.length),
    };
  });

  const hourRows = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    label: `${String(hour).padStart(2, "0")}:00`,
    sessions: sessions.filter((s) => s.hour === hour).length,
  }));

  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekdayRows = weekdayNames.map((name, weekday) => ({
    weekday: name,
    sessions: sessions.filter((s) => s.weekday === weekday).length,
  }));

  const peakHour = [...hourRows].sort((a, b) => b.sessions - a.sessions)[0];
  const peakDay = [...weekdayRows].sort((a, b) => b.sessions - a.sessions)[0];

  return {
    sessions: n,
    bounced,
    converted,
    engaged,
    views,
    bounceRate: pct(bounced, n),
    conversionRate: pct(converted, n),
    engagementRate: pct(engaged, n),
    pagesPerSession: Math.round((n ? views / n : 0) * 10) / 10,
    medianDurationSec: Math.round(median(durations) / 1000),
    conversionBreakdown,
    sourceRows,
    landingRows,
    deviceRows,
    hourRows,
    weekdayRows,
    peakHour: peakHour?.sessions ? peakHour.label : null,
    peakDay: peakDay?.sessions ? peakDay.weekday : null,
  };
}

function deltaLabel(current: number, previous: number, unit = ""): string {
  if (!previous && !current) return "flat";
  if (!previous) return "new this week";
  const change = Math.round(((current - previous) / previous) * 100);
  if (change === 0) return "unchanged vs last week";
  const sign = change > 0 ? "+" : "";
  return `${sign}${change}% vs last week${unit ? ` ${unit}` : ""}`;
}

export function generateInsights(params: {
  all: ReturnType<typeof summarizeWindow>;
  recent: ReturnType<typeof summarizeWindow>;
  previous: ReturnType<typeof summarizeWindow>;
  sampleNote: string;
}): Insight[] {
  const { all, recent, previous, sampleNote } = params;
  const insights: Insight[] = [];

  if (all.sessions < 8) {
    insights.push({
      severity: "info",
      title: "Not enough visits yet for firm conclusions",
      detail: `${sampleNote} Insights get reliable around 30+ sessions. Treat the numbers below as early signals, not proof.`,
      action: "Keep the tracker live and review again after a week of public traffic.",
    });
    return insights;
  }

  const topSource = all.sourceRows[0];
  const bestSource = [...all.sourceRows]
    .filter((s) => s.sessions >= 5)
    .sort((a, b) => b.conversionRate - a.conversionRate || b.sessions - a.sessions)[0];
  const weakSource = [...all.sourceRows]
    .filter((s) => s.sessions >= 8 && s.bounceRate >= 70 && s.conversionRate === 0)
    .sort((a, b) => b.bounceRate - a.bounceRate)[0];
  const homeLand = all.landingRows.find((r) => r.page === "/");
  const landingLand = all.landingRows.find((r) => r.page === "/landing");
  const internLand = all.landingRows.find((r) => r.page === "/internship");
  const pricingLand = all.landingRows.find((r) => r.page === "/pricing");
  const mobile = all.deviceRows.find((d) => d.device === "mobile");
  const desktop = all.deviceRows.find((d) => d.device === "desktop");
  const whatsapp = all.conversionBreakdown.find((c) => c.key === "WhatsApp");
  const forms = all.conversionBreakdown.find((c) => c.key === "Contact form");

  if (all.bounceRate >= 65) {
    insights.push({
      severity: "opportunity",
      title: `${all.bounceRate}% of visits leave after one page`,
      detail: `Most people are not exploring. That usually means the first screen does not match why they came, or the next step is unclear.`,
      action: homeLand && homeLand.bounceRate >= 60
        ? "Tighten the homepage hero: one promise, one primary button (WhatsApp or Get a quote), and less competing CTAs."
        : "Check the top landing page below and put a clearer next step above the fold.",
    });
  } else if (all.bounceRate <= 40 && all.sessions >= 20) {
    insights.push({
      severity: "good",
      title: "People are exploring, not bouncing immediately",
      detail: `Bounce is ${all.bounceRate}% with ${all.pagesPerSession} pages per visit. The site is holding attention reasonably well.`,
      action: "Protect the pages that convert. Do not bury WhatsApp or contact behind extra clicks.",
    });
  }

  if (all.conversionRate === 0 && all.sessions >= 15) {
    insights.push({
      severity: "opportunity",
      title: "Traffic is arriving, but almost nobody is starting a conversation",
      detail: `${all.sessions} sessions produced 0 tracked leads (WhatsApp, forms, or apply). Awareness is happening; the ask is not.`,
      action: "Make WhatsApp and contact impossible to miss on Home, Landing, and Pricing. Test the floating button prompt on mobile.",
    });
  } else if (all.converted > 0) {
    const mix = all.conversionBreakdown.map((c) => `${c.count} ${c.key}`).join(", ");
    insights.push({
      severity: "good",
      title: `${all.conversionRate}% of sessions become a lead`,
      detail: `${all.converted} converting sessions so far (${mix || "leads"}). ${deltaLabel(recent.converted, previous.converted)}.`,
      action: whatsapp && (!forms || whatsapp.count >= (forms.count || 0))
        ? "WhatsApp is the main closer — keep the lead form short and reply fast during peak hours."
        : "Forms are working. Follow up those submissions the same day; they are warmer than anonymous visits.",
    });
  }

  if (topSource) {
    if (topSource.source === "direct" && topSource.share >= 50) {
      insights.push({
        severity: "watch",
        title: `${topSource.share}% of visits are Direct`,
        detail:
          "Direct includes typed URLs, bookmarks, in-app browsers that strip referrers (Instagram/TikTok/WhatsApp), and some ads. It is not all 'people who already know you'.",
        action: "Use UTM links on every social post and ad (utm_source=instagram, tiktok, facebook) so those visits stop hiding inside Direct.",
      });
    } else {
      insights.push({
        severity: "info",
        title: `${pageLabelSource(topSource.source)} is your largest channel (${topSource.share}%)`,
        detail: `Bounce ${topSource.bounceRate}%, conversion ${topSource.conversionRate}%, ${topSource.pagesPerSession} pages/visit.`,
        action: bestSource && bestSource.source !== topSource.source
          ? `${pageLabelSource(bestSource.source)} converts better (${bestSource.conversionRate}%). Put more budget and posts there, and copy what that landing page does.`
          : `Keep feeding ${pageLabelSource(topSource.source)}, and send those visitors to a page that matches the ad/post promise.`,
      });
    }
  }

  if (bestSource && bestSource.conversionRate >= 8 && bestSource.sessions >= 5) {
    insights.push({
      severity: "opportunity",
      title: `${pageLabelSource(bestSource.source)} is your best-converting source`,
      detail: `${bestSource.conversionRate}% of those sessions convert (${bestSource.conversions} of ${bestSource.sessions}).`,
      action: "Double down: more posts/ads with the same message, and land them on the page that already converts.",
    });
  }

  if (weakSource) {
    insights.push({
      severity: "watch",
      title: `${pageLabelSource(weakSource.source)} traffic is leaking`,
      detail: `${weakSource.bounceRate}% bounce and 0 conversions from ${weakSource.sessions} sessions.`,
      action: "Either stop sending that traffic to Home, or give it a dedicated landing page that matches the post/ad.",
    });
  }

  if (mobile && mobile.share >= 55) {
    insights.push({
      severity: mobile.bounceRate >= 65 || (desktop && desktop.conversionRate > mobile.conversionRate + 5)
        ? "opportunity"
        : "info",
      title: `${mobile.share}% of visits are on phones`,
      detail: `Mobile bounce ${mobile.bounceRate}%, conversion ${mobile.conversionRate}%.${
        desktop ? ` Desktop converts at ${desktop.conversionRate}%.` : ""
      }`,
      action:
        mobile.bounceRate >= 65
          ? "Prioritize mobile: faster hero, larger WhatsApp tap target, less text above the fold."
          : "Design and test on a phone first. Most decisions happen there.",
    });
  }

  if (internLand && internLand.sessions >= 5) {
    insights.push({
      severity: internLand.conversionRate > 0 ? "good" : "watch",
      title: internLand.conversionRate > 0
        ? "Internship page is attracting real applicants"
        : "Internship page gets visits but few applications",
      detail: `${internLand.sessions} landed there · bounce ${internLand.bounceRate}% · apply rate ${internLand.conversionRate}%.`,
      action: internLand.conversionRate > 0
        ? "Keep internship ads/posts pointed at /internship, not Home."
        : "Shorten the apply path. Put Apply now on the first screen and cut extra fields.",
    });
  }

  if (pricingLand && pricingLand.sessions >= 5) {
    insights.push({
      severity: pricingLand.conversionRate > 0 ? "good" : "opportunity",
      title: "Pricing is being shopped",
      detail: `${pricingLand.sessions} sessions started on Pricing. Conversion ${pricingLand.conversionRate}%, bounce ${pricingLand.bounceRate}%.`,
      action: pricingLand.conversionRate > 0
        ? "Those visitors are buyers. Keep packages clear and WhatsApp on every card."
        : "If people read prices then leave, add a 'not sure? chat' line under the packages.",
    });
  }

  if (landingLand && landingLand.sessions >= 5 && homeLand) {
    const landingWins = landingLand.conversionRate > homeLand.conversionRate;
    insights.push({
      severity: landingWins ? "opportunity" : "info",
      title: landingWins
        ? "The /landing page outperforms Home for conversions"
        : "Home and Landing are competing for the same job",
      detail: `Landing: ${landingLand.conversionRate}% convert / ${landingLand.bounceRate}% bounce. Home: ${homeLand.conversionRate}% / ${homeLand.bounceRate}%.`,
      action: landingWins
        ? "Send ads and WhatsApp bios to /landing, not the homepage."
        : "Pick one primary acquisition page so messaging stays consistent.",
    });
  }

  if (all.peakHour && all.peakDay) {
    insights.push({
      severity: "info",
      title: `Busiest window: ${all.peakDay} around ${all.peakHour} (Ghana time)`,
      detail: "Reply speed on WhatsApp during this window will convert more of the demand you already paid to attract.",
      action: "Staff chat coverage for that window. Slow replies after a WhatsApp tap waste the click.",
    });
  }

  const weekSessionsDelta = recent.sessions - previous.sessions;
  if (all.sessions >= 15 && (previous.sessions >= 5 || recent.sessions >= 5)) {
    insights.push({
      severity: weekSessionsDelta < 0 ? "watch" : weekSessionsDelta > 0 ? "good" : "info",
      title: `This week: ${recent.sessions} sessions (${deltaLabel(recent.sessions, previous.sessions)})`,
      detail: `Leads ${recent.converted} (${deltaLabel(recent.converted, previous.converted)}). Bounce ${recent.bounceRate}% vs ${previous.bounceRate}% last week.`,
      action: weekSessionsDelta < 0
        ? "Traffic dipped. Check whether ads/posts paused, or if a campaign landing page 404s."
        : "Volume is holding or growing. Improve conversion rate next — cheaper than buying more clicks.",
    });
  }

  return insights.slice(0, 8);
}

function pageLabelSource(source: string): string {
  const map: Record<string, string> = {
    direct: "Direct / unknown",
    google: "Google",
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    whatsapp: "WhatsApp",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    twitter: "X / Twitter",
    bing: "Bing",
    internal: "Internal",
  };
  return map[source] || source;
}

export { pageLabelSource };
