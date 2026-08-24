'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Insight {
  severity: 'opportunity' | 'watch' | 'good' | 'info';
  title: string;
  detail: string;
  action: string;
}

interface Analytics {
  totalVisitors: number;
  totalPageViews: number;
  totalInteractions: number;
  avgPagesPerSession: number;
  bounceRate: number;
  todayVisitors: number;
  todayPageViews: number;
  engagementRate: number;
  conversionRate: number;
  totalConversions: number;
  medianDurationSec: number;
  pages: Array<{ page: string; label?: string; count: number }>;
  sources: Array<{ source: string; count: number }>;
  deviceTypes: Array<{ device: string; count: number }>;
  actions: Array<{ action: string; count: number }>;
  actionCategories: Array<{ category: string; count: number }>;
  scrollDepth: Array<{ depth: string; count: number }>;
  dailyViews: Array<{ date: string; count: number }>;
  dailyVisitors: Array<{ date: string; count: number }>;
  recentEvents: any[];
  insights: Insight[];
  funnel: Array<{ step: string; count: number; rate: number }>;
  sourceQuality: Array<{
    source: string;
    sessions: number;
    share: number;
    bounceRate: number;
    pagesPerSession: number;
    conversions: number;
    conversionRate: number;
  }>;
  landingPages: Array<{
    page: string;
    label: string;
    sessions: number;
    bounceRate: number;
    conversions: number;
    conversionRate: number;
  }>;
  deviceQuality: Array<{
    device: string;
    sessions: number;
    share: number;
    bounceRate: number;
    conversionRate: number;
  }>;
  conversionBreakdown: Array<{ type: string; count: number }>;
  hourDistribution: Array<{ hour: number; label: string; sessions: number }>;
  weekdayDistribution: Array<{ weekday: string; sessions: number }>;
  comparison: {
    thisWeekSessions: number;
    lastWeekSessions: number;
    thisWeekConversions: number;
    lastWeekConversions: number;
  };
  sampleSize: number;
  peakHour?: string | null;
  peakDay?: string | null;
}

const SEVERITY = {
  opportunity: {
    badge: 'Do this',
    bar: 'bg-amber-500',
    chip: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  watch: {
    badge: 'Watch',
    bar: 'bg-rose-500',
    chip: 'bg-rose-50 text-rose-800 border-rose-200',
  },
  good: {
    badge: 'Working',
    bar: 'bg-emerald-500',
    chip: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  info: {
    badge: 'Context',
    bar: 'bg-sky-500',
    chip: 'bg-sky-50 text-sky-800 border-sky-200',
  },
};

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-2">{hint}</p>
    </div>
  );
}

function weekDelta(current: number, previous: number): string {
  if (!previous && !current) return 'flat vs last week';
  if (!previous) return 'new this week';
  const change = Math.round(((current - previous) / previous) * 100);
  if (change === 0) return 'same as last week';
  return `${change > 0 ? '+' : ''}${change}% vs last week`;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 45000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!analytics || !analytics.sampleSize) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Traffic & Insights</h1>
        <p className="mt-3 text-slate-600 max-w-lg mx-auto">
          No public visits recorded yet. Browse the live site (not the admin) once or twice, then refresh —
          insights appear after real visitor sessions land.
        </p>
        <button
          type="button"
          onClick={fetchAnalytics}
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  const insights = analytics.insights || [];
  const funnel = analytics.funnel || [];
  const sourceQuality = analytics.sourceQuality || [];
  const landingPages = (analytics.landingPages || []).slice(0, 8);
  const categories = analytics.actionCategories || [];
  const trend = (analytics.dailyVisitors?.length ? analytics.dailyVisitors : analytics.dailyViews) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Traffic & Insights</h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Decision-ready analysis of how people arrive, explore, and convert — not just raw page views.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchAnalytics}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Refresh analysis
        </button>
      </div>

      {/* Insights first */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">What the data is telling you</h2>
          <p className="text-xs text-slate-500">
            {analytics.sampleSize} sessions · Ghana time
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {insights.map((insight, idx) => {
            const tone = SEVERITY[insight.severity] || SEVERITY.info;
            return (
              <div
                key={`${insight.title}-${idx}`}
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className={`absolute left-0 top-0 h-full w-1.5 ${tone.bar}`} />
                <div className="pl-3">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${tone.chip}`}>
                      {tone.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{insight.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{insight.detail}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    Next step: <span className="font-medium text-slate-700">{insight.action}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label="Sessions"
          value={analytics.totalVisitors}
          hint={`${analytics.todayVisitors} today · ${weekDelta(analytics.comparison?.thisWeekSessions || 0, analytics.comparison?.lastWeekSessions || 0)}`}
        />
        <StatCard
          label="Page views"
          value={analytics.totalPageViews}
          hint={`${analytics.avgPagesPerSession} pages / visit`}
        />
        <StatCard
          label="Engagement"
          value={`${analytics.engagementRate ?? 0}%`}
          hint="Visited 2+ pages, scrolled, or clicked"
        />
        <StatCard
          label="Bounce"
          value={`${analytics.bounceRate}%`}
          hint="Left after a single page"
        />
        <StatCard
          label="Lead rate"
          value={`${analytics.conversionRate ?? 0}%`}
          hint={`${analytics.totalConversions ?? 0} WhatsApp / form / apply events`}
        />
        <StatCard
          label="Median stay"
          value={analytics.medianDurationSec ? `${analytics.medianDurationSec}s` : '—'}
          hint={analytics.peakDay && analytics.peakHour ? `Peak ${analytics.peakDay} ~${analytics.peakHour}` : 'Multi-page sessions'}
        />
      </div>

      {/* Funnel + trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-1">Visitor funnel</h3>
          <p className="text-sm text-slate-500 mb-5">From arrival → real engagement → lead</p>
          <div className="space-y-4">
            {funnel.map((step, i) => {
              const width = Math.max(12, step.rate);
              return (
                <div key={step.step}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-slate-800">
                      {i + 1}. {step.step}
                    </span>
                    <span className="text-slate-600">
                      {step.count} <span className="text-slate-400">({step.rate}%)</span>
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${i === 2 ? 'bg-emerald-500' : i === 1 ? 'bg-indigo-500' : 'bg-blue-500'}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {(analytics.conversionBreakdown || []).length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
              {analytics.conversionBreakdown.map((c) => (
                <span
                  key={c.type}
                  className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 text-xs font-semibold"
                >
                  {c.type}: {c.count}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-1">Sessions (last 14 days)</h3>
          <p className="text-sm text-slate-500 mb-4">Unique visits per day</p>
          {trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" name="Sessions" stroke="#4f46e5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-12">No trend yet</p>
          )}
        </div>
      </div>

      {/* Source quality */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
        <h3 className="font-bold text-slate-900 mb-1">Source quality</h3>
        <p className="text-sm text-slate-500 mb-4">
          Which channels bring browsers vs buyers — ranked by session volume
        </p>
        {sourceQuality.length > 0 ? (
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-2 pr-3 font-semibold">Source</th>
                <th className="py-2 pr-3 font-semibold">Sessions</th>
                <th className="py-2 pr-3 font-semibold">Share</th>
                <th className="py-2 pr-3 font-semibold">Bounce</th>
                <th className="py-2 pr-3 font-semibold">Pages/visit</th>
                <th className="py-2 pr-3 font-semibold">Leads</th>
                <th className="py-2 font-semibold">Lead rate</th>
              </tr>
            </thead>
            <tbody>
              {sourceQuality.map((row) => (
                <tr key={row.source} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2.5 pr-3 font-semibold text-slate-900 capitalize">{row.source}</td>
                  <td className="py-2.5 pr-3 text-slate-700">{row.sessions}</td>
                  <td className="py-2.5 pr-3 text-slate-700">{row.share}%</td>
                  <td className={`py-2.5 pr-3 font-medium ${row.bounceRate >= 70 ? 'text-rose-600' : 'text-slate-700'}`}>
                    {row.bounceRate}%
                  </td>
                  <td className="py-2.5 pr-3 text-slate-700">{row.pagesPerSession}</td>
                  <td className="py-2.5 pr-3 text-slate-700">{row.conversions}</td>
                  <td className={`py-2.5 font-semibold ${row.conversionRate > 0 ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {row.conversionRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-slate-500 text-center py-8">No source data yet</p>
        )}
      </div>

      {/* Landing pages + devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
          <h3 className="font-bold text-slate-900 mb-1">Landing page performance</h3>
          <p className="text-sm text-slate-500 mb-4">Where sessions start, and whether they convert</p>
          {landingPages.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="py-2 pr-2 font-semibold">Page</th>
                  <th className="py-2 pr-2 font-semibold">Starts</th>
                  <th className="py-2 pr-2 font-semibold">Bounce</th>
                  <th className="py-2 font-semibold">Lead %</th>
                </tr>
              </thead>
              <tbody>
                {landingPages.map((row) => (
                  <tr key={row.page} className="border-b border-slate-100">
                    <td className="py-2 pr-2">
                      <div className="font-semibold text-slate-900">{row.label}</div>
                      <div className="text-xs text-slate-400">{row.page}</div>
                    </td>
                    <td className="py-2 pr-2 text-slate-700">{row.sessions}</td>
                    <td className="py-2 pr-2 text-slate-700">{row.bounceRate}%</td>
                    <td className={`py-2 font-semibold ${row.conversionRate > 0 ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {row.conversionRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-slate-500 text-center py-8">No landing data yet</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-1">Device quality</h3>
          <p className="text-sm text-slate-500 mb-4">Bounce and lead rate by device</p>
          {(analytics.deviceQuality || []).length > 0 ? (
            <div className="space-y-4">
              {analytics.deviceQuality.map((d) => (
                <div key={d.device} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-slate-900 capitalize">{d.device}</p>
                    <p className="text-sm text-slate-500">{d.share}% of traffic</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Sessions</p>
                      <p className="font-bold text-slate-900">{d.sessions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Bounce</p>
                      <p className="font-bold text-slate-900">{d.bounceRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Lead rate</p>
                      <p className="font-bold text-emerald-700">{d.conversionRate}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No device data yet</p>
          )}
        </div>
      </div>

      {/* Behavior + when */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-1">What people do on the site</h3>
          <p className="text-sm text-slate-500 mb-4">Grouped clicks and actions (noise removed)</p>
          {categories.length > 0 ? (
            <div className="space-y-3">
              {categories.slice(0, 10).map((item) => {
                const max = categories[0]?.count || 1;
                return (
                  <div key={item.category} className="flex items-center gap-3">
                    <p className="w-36 text-sm text-slate-800 truncate">{item.category}</p>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-violet-500 h-2 rounded-full"
                        style={{ width: `${(item.count / max) * 100}%` }}
                      />
                    </div>
                    <p className="w-10 text-right text-sm font-semibold text-slate-700">{item.count}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No meaningful actions yet</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-1">When people visit (Ghana time)</h3>
          <p className="text-sm text-slate-500 mb-4">Best window to staff WhatsApp replies</p>
          {(analytics.weekdayDistribution || []).some((d) => d.sessions > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analytics.weekdayDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="weekday" fontSize={12} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="sessions" name="Sessions" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-8">No timing data yet</p>
          )}
          {(analytics.hourDistribution || []).length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Top hours</p>
              <div className="flex flex-wrap gap-2">
                {[...analytics.hourDistribution]
                  .sort((a, b) => b.sessions - a.sessions)
                  .slice(0, 5)
                  .map((h) => (
                    <span
                      key={h.hour}
                      className="rounded-lg bg-sky-50 border border-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-900"
                    >
                      {h.label} · {h.sessions}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top pages chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4">Most viewed pages</h3>
        {(analytics.pages || []).length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={(analytics.pages || []).slice(0, 10)} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="label" width={110} fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" name="Views" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-slate-500 text-center py-12">No page data yet</p>
        )}
      </div>

      {/* Recent activity - secondary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4">Recent activity</h3>
        {analytics.recentEvents?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 font-semibold text-slate-900">Type</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-900">Page / Action</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-900">Source</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-900">Device</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-900">Time</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentEvents.slice(0, 25).map((event, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2 px-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          event.type === 'pageview'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {event.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-600 max-w-xs truncate">
                      {event.type === 'interaction' ? event.action || event.page : event.page}
                    </td>
                    <td className="py-2 px-3 text-slate-600">{event.source || '—'}</td>
                    <td className="py-2 px-3 text-slate-600">{event.deviceType || '—'}</td>
                    <td className="py-2 px-3 text-slate-500 text-xs whitespace-nowrap">
                      {event.timestamp ? new Date(event.timestamp).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 text-center py-12">No recent events yet</p>
        )}
      </div>
    </div>
  );
}
