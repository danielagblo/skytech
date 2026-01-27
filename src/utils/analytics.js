// Analytics tracking utility for public site

let sessionId;

// Generate or retrieve session ID
function getSessionId() {
  if (sessionId) return sessionId;
  
  const stored = localStorage.getItem('skytech_session_id');
  if (stored) {
    sessionId = stored;
  } else {
    sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('skytech_session_id', sessionId);
  }
  return sessionId;
}

// Detect browser and device info
function getDeviceInfo() {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let deviceType = 'desktop';

  if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
  else if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
  else if (ua.indexOf('Safari') > -1) browser = 'Safari';
  else if (ua.indexOf('Edge') > -1) browser = 'Edge';

  if (/iPhone|iPad|iPod/.test(ua)) deviceType = 'mobile';
  else if (/Android/.test(ua)) deviceType = 'mobile';
  else if (/tablet|iPad/i.test(ua)) deviceType = 'tablet';

  return { browser, deviceType };
}

// Get referrer source
function getSource() {
  const referrer = document.referrer;
  const urlParams = new URLSearchParams(window.location.search);
  const utm_source = urlParams.get('utm_source');

  if (utm_source) return utm_source;
  if (referrer.includes('google')) return 'google';
  if (referrer.includes('facebook')) return 'facebook';
  if (referrer.includes('twitter')) return 'twitter';
  if (referrer.includes('linkedin')) return 'linkedin';
  if (referrer) return 'referral';
  return 'direct';
}

// Track page view
export async function trackPageView(page) {
  const { browser, deviceType } = getDeviceInfo();
  const source = getSource();

  const event = {
    type: 'pageview',
    page,
    sessionId: getSessionId(),
    browser,
    deviceType,
    source,
    url: window.location.href,
    referrer: document.referrer || null,
  };

  try {
    await fetch('http://localhost:3000/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error('Failed to track pageview:', error);
  }
}

// Track user interaction (click, form submit, etc)
export async function trackInteraction(action, element, metadata) {
  const { browser, deviceType } = getDeviceInfo();

  const event = {
    type: 'interaction',
    action,
    element,
    metadata,
    sessionId: getSessionId(),
    browser,
    deviceType,
    page: window.location.pathname,
  };

  try {
    await fetch('http://localhost:3000/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error('Failed to track interaction:', error);
  }
}

// Track form submission
export async function trackFormSubmit(formName, data) {
  await trackInteraction('form_submit', formName, data);
}

// Track button click
export async function trackButtonClick(buttonName) {
  await trackInteraction('button_click', buttonName);
}

// Track scroll depth
export async function trackScrollDepth() {
  const scrollPercent = Math.round(
    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
  );

  if (scrollPercent > 75) {
    await trackInteraction('scroll_depth', 'page', { depth: scrollPercent });
  }
}

// Initialize analytics
export function initAnalytics() {
  // Track initial page view
  trackPageView(window.location.pathname);

  // Track scroll depth on scroll
  window.addEventListener('scroll', trackScrollDepth);

  // Track page changes (for React Router)
  window.addEventListener('popstate', () => {
    trackPageView(window.location.pathname);
  });
}
