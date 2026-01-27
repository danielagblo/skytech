'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Analytics {
  totalVisitors: number;
  totalPageViews: number;
  totalInteractions: number;
  pages: Array<{ page: string; count: number }>;
  sources: Array<{ source: string; count: number }>;
  deviceTypes: Array<{ device: string; count: number }>;
  browsers: Array<{ browser: string; count: number }>;
  countries: Array<{ country: string; count: number }>;
  recentEvents: any[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30s
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="text-center text-slate-600 py-12">No analytics data yet</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-600 mt-2">Track visitor behavior, traffic sources, and interactions</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Total Visitors</p>
          <p className="text-4xl font-bold text-slate-900">{analytics.totalVisitors}</p>
          <p className="text-xs text-slate-500 mt-2">Unique sessions</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Page Views</p>
          <p className="text-4xl font-bold text-slate-900">{analytics.totalPageViews}</p>
          <p className="text-xs text-slate-500 mt-2">Total page visits</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Interactions</p>
          <p className="text-4xl font-bold text-slate-900">{analytics.totalInteractions}</p>
          <p className="text-xs text-slate-500 mt-2">Clicks, forms, etc</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Top Pages</h3>
          {analytics.pages.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.pages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-12">No page data yet</p>
          )}
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Traffic Sources</h3>
          {analytics.sources.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.sources}
                  dataKey="count"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {analytics.sources.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-12">No traffic data yet</p>
          )}
        </div>

        {/* Device Types */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Device Types</h3>
          {analytics.deviceTypes.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.deviceTypes}
                  dataKey="count"
                  nameKey="device"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {analytics.deviceTypes.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-12">No device data yet</p>
          )}
        </div>

        {/* Browsers */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Top Browsers</h3>
          {analytics.browsers.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.browsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="browser" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-12">No browser data yet</p>
          )}
        </div>
      </div>

      {/* Geographic Data */}
      {analytics.countries.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Top Countries</h3>
          <div className="space-y-3">
            {analytics.countries.slice(0, 10).map((country) => (
              <div key={country.country} className="flex items-center gap-3">
                <p className="w-32 text-sm font-semibold text-slate-900">{country.country}</p>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(country.count / Math.max(...analytics.countries.map(c => c.count))) * 100}%` }}
                  />
                </div>
                <p className="w-12 text-right text-sm text-slate-600">{country.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Events */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4">Recent Events (Last 20)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 font-semibold text-slate-900">Type</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-900">Event</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-900">Device</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-900">Time</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentEvents.slice(-20).reverse().map((event, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 px-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      event.type === 'pageview' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                    }`}>
                      {event.type}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-600">{event.page || event.action}</td>
                  <td className="py-2 px-3 text-slate-600">{event.deviceType}</td>
                  <td className="py-2 px-3 text-slate-500 text-xs">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
