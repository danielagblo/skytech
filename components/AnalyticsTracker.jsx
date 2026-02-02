'use client';

import { useEffect } from 'react';

const sessionId = typeof window !== 'undefined' ? sessionStorage.getItem('analytics_session_id') || crypto.randomUUID() : '';

export default function AnalyticsTracker() {
  useEffect(() => {
    // Store session ID
    if (typeof window !== 'undefined' && !sessionStorage.getItem('analytics_session_id')) {
      sessionStorage.setItem('analytics_session_id', sessionId);
    }

    // Track page view
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'pageview',
            page: window.location.pathname,
            sessionId: sessionStorage.getItem('analytics_session_id'),
            source: document.referrer || 'direct',
            deviceType: getDeviceType(),
            browser: getBrowserName(),
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    };

    trackPageView();

    // Track clicks and form submissions
    const handleClick = async (e) => {
      const target = e.target.closest('a, button, form input[type="submit"]');
      if (!target) return;

      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'interaction',
            action: target.textContent || target.value || 'click',
            page: window.location.pathname,
            sessionId: sessionStorage.getItem('analytics_session_id'),
            deviceType: getDeviceType(),
            browser: getBrowserName(),
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error('Failed to track interaction:', error);
      }
    };

    const handleFormSubmit = async (e) => {
      if (e.target.tagName !== 'FORM') return;

      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'interaction',
            action: 'form_submit',
            page: window.location.pathname,
            sessionId: sessionStorage.getItem('analytics_session_id'),
            deviceType: getDeviceType(),
            browser: getBrowserName(),
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error('Failed to track form submission:', error);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleFormSubmit, true);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleFormSubmit, true);
    };
  }, []);

  return null;
}

function getDeviceType() {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase())) {
    return 'mobile';
  }
  if (/tablet|ipad|playbook|silk/i.test(ua.toLowerCase())) {
    return 'tablet';
  }
  return 'desktop';
}

function getBrowserName() {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.indexOf('Firefox') > -1) return 'Firefox';
  if (ua.indexOf('SamsungBrowser') > -1) return 'Samsung Internet';
  if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
  if (ua.indexOf('Trident') > -1) return 'Internet Explorer';
  if (ua.indexOf('Edge') > -1) return 'Edge';
  if (ua.indexOf('Chrome') > -1) return 'Chrome';
  if (ua.indexOf('Safari') > -1) return 'Safari';
  return 'Other';
}
