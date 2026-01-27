import fs from 'fs';
import path from 'path';

// Path relative to the admin directory (cwd in Next.js)
const dataPath = path.join(process.cwd(), '../shared-data/analytics.json');

export async function GET(request: Request) {
  try {
    const data = fs.readFileSync(dataPath, 'utf-8');
    const analytics = JSON.parse(data);
    
    // Calculate aggregated metrics
    const uniqueVisitors = new Set(analytics.map(e => e.sessionId));
    const pageViews = analytics.filter(e => e.type === 'pageview');
    const interactions = analytics.filter(e => e.type === 'interaction');
    
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
    console.error('Failed to fetch analytics:', error);
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const event = await request.json();
    const data = fs.readFileSync(dataPath, 'utf-8');
    const analytics = JSON.parse(data);
    
    analytics.push({
      ...event,
      timestamp: new Date().toISOString(),
    });
    
    fs.writeFileSync(dataPath, JSON.stringify(analytics, null, 2));
    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to save analytics event:', error);
    return Response.json({ error: 'Failed to save event' }, { status: 500 });
  }
}

function aggregateByPage(events: any[]) {
  const pages: Record<string, number> = {};
  events.forEach(e => {
    pages[e.page] = (pages[e.page] || 0) + 1;
  });
  return Object.entries(pages)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count);
}

function aggregateBySource(events: any[]) {
  const sources: Record<string, number> = {};
  events.forEach(e => {
    const source = e.source || 'direct';
    sources[source] = (sources[source] || 0) + 1;
  });
  return Object.entries(sources)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
}

function aggregateByDeviceType(events: any[]) {
  const devices: Record<string, number> = {};
  events.forEach(e => {
    const device = e.deviceType || 'unknown';
    devices[device] = (devices[device] || 0) + 1;
  });
  return Object.entries(devices)
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count);
}

function aggregateByBrowser(events: any[]) {
  const browsers: Record<string, number> = {};
  events.forEach(e => {
    const browser = e.browser || 'unknown';
    browsers[browser] = (browsers[browser] || 0) + 1;
  });
  return Object.entries(browsers)
    .map(([browser, count]) => ({ browser, count }))
    .sort((a, b) => b.count - a.count);
}

function aggregateByCountry(events: any[]) {
  const countries: Record<string, number> = {};
  events.forEach(e => {
    if (e.country) {
      countries[e.country] = (countries[e.country] || 0) + 1;
    }
  });
  return Object.entries(countries)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);
}
