// UTM + session attribution for getfaceit.com.
//
// On every page load:
//  1. ensure a session ID exists in localStorage (UUID v4)
//  2. parse UTM params from the URL — if any are present, persist the most
//     recent set in localStorage so the iOS app can later claim them via
//     Universal Link / App Clip
//  3. send a one-shot event to the recordLandingVisit Cloud Function
//
// The session ID flows: landing → iOS app → Cloud Function `claimAttribution`
// → users/{uid}.attribution.

(() => {
  'use strict';

  const ENDPOINT =
    'https://europe-west1-face-it-app-ffc21.cloudfunctions.net/recordLandingVisit';

  const SESSION_KEY = 'fi_session_id';
  const UTM_KEY = 'fi_utm';
  const SENT_KEY = 'fi_landing_sent';

  // 1. Session ID — persistent across pageviews until localStorage is cleared
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  // 2. UTM capture — only overwrite if the URL has at least one utm_*
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const incoming = {};
  let hasIncoming = false;
  for (const key of utmKeys) {
    const value = params.get(key);
    if (value) {
      incoming[key] = value;
      hasIncoming = true;
    }
  }

  if (hasIncoming) {
    localStorage.setItem(UTM_KEY, JSON.stringify({ ...incoming, ts: Date.now() }));
  }

  // 3. Fire one event per session per UTM context. We don't want to spam
  //    on every internal nav, but we do want to record fresh UTM hits.
  const sentMarker = `${sessionId}:${hasIncoming ? params.toString() : ''}`;
  if (localStorage.getItem(SENT_KEY) === sentMarker) return;
  localStorage.setItem(SENT_KEY, sentMarker);

  const stored = JSON.parse(localStorage.getItem(UTM_KEY) || '{}');

  const payload = {
    sessionId,
    utm_source:   stored.utm_source   || null,
    utm_medium:   stored.utm_medium   || null,
    utm_campaign: stored.utm_campaign || null,
    utm_content:  stored.utm_content  || null,
    utm_term:     stored.utm_term     || null,
    referrer:     document.referrer || null,
    landingPath:  window.location.pathname + window.location.search,
    userAgent:    navigator.userAgent || null,
  };

  // Send beacon if available (won't block navigation), fall back to fetch
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(ENDPOINT, blob);
    } else {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => { /* silent */ });
    }
  } catch (_err) {
    // never break the page over analytics
  }

  // Expose session ID for any in-page sign-up handlers (App Store CTA can
  // append it as a query param to a Universal Link).
  window.__faceItSession = { sessionId, utm: stored };
})();
