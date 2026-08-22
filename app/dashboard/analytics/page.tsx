'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Analytics {
  totalVisitors: number;
  totalPageViews: number;
  totalInteractions: number;
  avgPagesPerSession: number;
  bounceRate: number;
  todayVisitors: number;
  todayPageViews: number;
  pages: Array<{ page: string; count: number }>;
  sources: Array<{ source: string; count: number }>;
  deviceTypes: Array<{ device: string; count: number }>;
  browsers: Array<{ browser: string; count: number }>;
  countries: Array<{ country: string; count: number }>;
  actions: Array<{ action: string; count: number }>;
  scrollDepth: Array<{ depth: string; count: number }>;
  dailyViews: Array<{ date: string; count: number }>;
  recentEvents: any[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

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
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
      <p className="text-sm text-slate-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-2">{hint}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
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

  if (!analytics) {
    return <div className="text-center text-slate-600 py-12">No analytics data yet</div>;
  }

  const topPages = (analytics.pages || []).slice(0, 10);
  const topSources = (analytics.sources || []).slice(0, 8);
  const topActions = (analytics.actions || []).slice(0, 12);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Traffic & Analytics</h1>
          <p className="text-slate-600 mt-2">
            Website views, traffic sources, and visitor behavior
          </p>
        </div>
        <button
          type="button"
          onClick={fetchAnalytics}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Visitors" value={analytics.totalVisitors} hint="Unique sessions" />
        <StatCard label="Page Views" value={analytics.totalPageViews} hint="All time" />
        <StatCard label="Today Views" value={analytics.todayPageViews ?? 0} hint={`${analytics.todayVisitors ?? 0} visitors today`} />
        <StatCard label="Interactions" value={analytics.totalInteractions} hint="Clicks, forms, scrolls" />
        <StatCard label="Pages / Visit" value={analytics.avgPagesPerSession ?? 0} hint="Average depth" />
        <StatCard label="Bounce Rate" value={`${analytics.bounceRate ?? 0}%`} hint="Single-page sessions" />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4">Page Views (Last 14 Days)</h3>
        {analytics.dailyViews?.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analytics.dailyViews}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-slate-500 text-center py-12">No trend data yet</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Top Pages</h3>
          {topPages.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPages} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="page" width={100} fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-12">No page data yet</p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Traffic Sources</h3>
          {topSources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={topSources}
                    dataKey="count"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                  >
                    {topSources.map((_, index) => (
                      <Cell key={`src-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {topSources.map((s, i) => (
                  <div key={s.source} className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                      <span className="truncate text-slate-700">{s.source}</span>
                    </span>
                    <span className="font-semibold text-slate-900">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-12">No traffic data yet</p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Devices</h3>
          {analytics.deviceTypes?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={analytics.deviceTypes}
                  dataKey="count"
                  nameKey="device"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(props: any) =>
                    `${props.device || props.name} ${((props.percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {analytics.deviceTypes.map((_, index) => (
                    <Cell key={`dev-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-12">No device data yet</p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Browsers</h3>
          {analytics.browsers?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={analytics.browsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="browser" fontSize={12} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-12">No browser data yet</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-1">What visitors are doing</h3>
          <p className="text-sm text-slate-500 mb-4">Top clicks and form actions</p>
          {topActions.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {topActions.map((item) => {
                const max = topActions[0]?.count || 1;
                return (
                  <div key={item.action} className="flex items-center gap-3">
                    <p className="w-40 sm:w-56 text-sm text-slate-800 truncate" title={item.action}>
                      {item.action}
                    </p>
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
            <p className="text-slate-500 text-center py-12">No interaction data yet</p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-1">Scroll depth</h3>
          <p className="text-sm text-slate-500 mb-4">How far visitors scroll on pages</p>
          {analytics.scrollDepth?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={analytics.scrollDepth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="depth" fontSize={12} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-12">No scroll data yet</p>
          )}
        </div>
      </div>

      {analytics.countries?.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Top Countries</h3>
          <div className="space-y-3">
            {analytics.countries.slice(0, 10).map((country) => (
              <div key={country.country} className="flex items-center gap-3">
                <p className="w-32 text-sm font-semibold text-slate-900">{country.country}</p>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(country.count / Math.max(...analytics.countries.map((c) => c.count))) * 100}%`,
                    }}
                  />
                </div>
                <p className="w-12 text-right text-sm text-slate-600">{country.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4">Recent Activity</h3>
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
                {analytics.recentEvents.slice(0, 30).map((event, idx) => (
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
                      {event.type === 'interaction'
                        ? event.action || event.page
                        : event.page}
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
