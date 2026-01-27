# Analytics System Implementation

## Overview
A complete analytics system has been added to track visitor behavior, demographics, traffic sources, and page interactions.

## Components Installed

### 1. Analytics Data Layer
- **File**: `/shared-data/analytics.json`
- **Storage**: File-based JSON tracking all visitor events
- **Events tracked**: Page views, button clicks, form submissions, scroll depth

### 2. Analytics Tracking Library
- **File**: `/src/utils/analytics.js`
- **Features**:
  - Session ID generation and management
  - Browser detection (Chrome, Firefox, Safari, Edge)
  - Device type detection (desktop, mobile, tablet)
  - Traffic source detection (direct, Google, Facebook, Twitter, LinkedIn, referral)
  - Page view tracking
  - User interaction tracking
  - Scroll depth monitoring

### 3. Public Site Integration
- **File**: `/src/App.jsx`
- **Integration**:
  - Automatically tracks page views on route changes
  - Initializes analytics session on app load
  - Collects browser, device, and referrer information

### 4. Admin Dashboard Analytics Page
- **File**: `/admin/app/dashboard/analytics/page.tsx`
- **Visualizations**:
  - **Key Metrics**: Total visitors, page views, interactions (card display)
  - **Top Pages**: Bar chart of most-visited pages
  - **Traffic Sources**: Pie chart showing referral sources
  - **Device Types**: Pie chart (desktop, mobile, tablet breakdown)
  - **Top Browsers**: Bar chart of browser distribution
  - **Geographic Data**: Top countries (if geo-IP data available)
  - **Recent Events**: Live event feed of last 20 page views and interactions

### 5. Analytics API Routes
- **File**: `/admin/app/api/analytics/route.ts`
- **Endpoints**:
  - `GET /api/analytics` — Returns aggregated metrics and visualization data
  - `POST /api/analytics` — Records a new visitor event

### 6. Dependencies Added
- `recharts` — React charting library for visualizations

## Data Collected

### Per Event
- `type` — 'pageview' or 'interaction'
- `sessionId` — Unique visitor session
- `timestamp` — When event occurred
- `browser` — Browser name (Chrome, Firefox, Safari, Edge)
- `deviceType` — Device (desktop, mobile, tablet)
- `page` — Current page path
- `source` — Traffic source (direct, google, facebook, twitter, linkedin, referral)
- `url` — Full URL
- `referrer` — Referring URL (if any)
- `action` — Type of interaction (form_submit, button_click, scroll_depth)
- `element` — What was clicked/interacted with
- `metadata` — Additional context (form data, scroll percentage)

## Access the Analytics Dashboard

1. **Start both servers** (if not already running):
   ```bash
   ./dev.sh
   ```

2. **Navigate to Analytics**:
   - Admin dashboard: `http://localhost:3000/dashboard/analytics`
   - Or click "Analytics" quick action card from main dashboard

3. **View Real-Time Data**:
   - Dashboard auto-refreshes every 30 seconds
   - Shows visitor metrics, traffic sources, device breakdown
   - Recent event feed shows last 20 interactions

## How It Works

### Tracking Flow
```
1. User visits public site (http://localhost:5173)
2. App.jsx initializes analytics, generates session ID
3. Page view event sent to /api/analytics
4. Event saved to /shared-data/analytics.json
5. Analytics dashboard fetches and visualizes data
```

### User Interactions Tracked
- **Page Views**: Every navigation
- **Scroll Depth**: When user scrolls past 75% of page
- **Button Clicks**: CTA buttons, navigation links
- **Form Submissions**: Contact form, searches
- **Custom Events**: Via `trackInteraction()` function

## Customization

### Track Additional Events
In any React component:
```jsx
import { trackInteraction, trackFormSubmit, trackButtonClick } from '@/utils/analytics';

// Track a button click
<button onClick={() => trackButtonClick('cta-button')}>
  Click me
</button>

// Track form submission
const handleSubmit = (e) => {
  e.preventDefault();
  trackFormSubmit('contact-form', { email, message });
};

// Custom interaction
trackInteraction('video-play', 'demo-video', { duration: 120 });
```

### Add More Metrics
Edit `/admin/app/api/analytics/route.ts` to add custom aggregations:
- Bounce rate
- Average session duration
- Conversion tracking
- User funnels
- A/B test results

## Geographic Data

Currently, geographic location requires a geo-IP service. To add:
```javascript
// In analytics.js trackPageView():
const response = await fetch('https://ipapi.co/json/');
const geoData = await response.json();
event.country = geoData.country_name;
event.city = geoData.city;
```

Free services:
- `https://ipapi.co/json/` (no API key)
- `https://api.ip.sb/geoip` (no auth)
- MaxMind GeoLite2 (self-hosted)

## Performance Notes

- Analytics requests are fire-and-forget (don't block page rendering)
- Data stored locally in JSON file (suitable for <100K events)
- For scale, consider:
  - Database (PostgreSQL, MongoDB)
  - Analytics service (Segment, Mixpanel, Amplitude)
  - Time-series database (InfluxDB, TimescaleDB)

## Privacy & Compliance

Current implementation:
- ✅ Session-based (not user-tracking)
- ✅ No personal data collected
- ✅ Session ID stored in localStorage (can be cleared)
- ⚠️ Add privacy policy if deployed
- ⚠️ Consider GDPR compliance (cookie consent)

## Testing

After restart, visit:
1. Public site: `http://localhost:5173`
2. Navigate pages, click buttons
3. Go to Admin Analytics: `http://localhost:3000/dashboard/analytics`
4. See real-time metrics and charts

## Troubleshooting

**No data appearing?**
- Restart both servers (`./dev.sh`)
- Check browser console for errors
- Verify `/shared-data/analytics.json` is writable
- Check `/api/analytics` returns data: `curl http://localhost:3000/api/analytics`

**Charts not rendering?**
- Ensure `recharts` installed: `cd admin && npm install recharts`
- Clear browser cache (hard refresh)

**Analytics not tracking?**
- Check browser Network tab for POST to `/api/analytics`
- Verify App.jsx has `initAnalytics()` in useEffect
- Check `/shared-data/analytics.json` for new events
