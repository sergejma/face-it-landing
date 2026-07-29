// UTM + session + Meta-id attribution for getfaceit.com.
//
// On every page load:
//  1. ensure a session ID exists in localStorage (UUID v4)
//  2. parse UTM params from the URL — if any are present, persist the most
//     recent set in localStorage so the iOS app can later claim them via
//     Universal Link / App Clip
//  3. read the Meta Pixel cookies (_fbc/_fbp); if the URL carries an fbclid
//     but the cookie isn't set yet, synthesize _fbc in Meta's canonical format
//  4. expose the ids on window.__faceItSession (App Store links stay clean —
//     see the note at step 4 below: decorating them broke the store handoff)
//  5. send a one-shot visit event to the recordLandingVisit Cloud Function,
//     INCLUDING fbc/fbp — the server stores them keyed by IP so the
//     subscription pipeline can match a later in-app purchase from the same
//     network back to this ad click (that's the fresh-install path).
//     If the Pixel hadn't set _fbp yet when we fired, a follow-up send
//     delivers the enriched ids.
//
// The session ID flows: landing → iOS app → Cloud Function `claimAttribution`
// → users/{uid}.attribution. The fbc/fbp flow: this file → recordLandingVisit
// → attribution_events + attribution_ip → enrichWebIdentity → Meta CAPI.

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

  const stored = JSON.parse(localStorage.getItem(UTM_KEY) || '{}');

  // 3. Meta click/browser ids. The Pixel sets _fbp on init and _fbc when an
  //    fbclid is present; both loads race with this script, so always re-read
  //    via metaIds() before using them.
  function readCookie(name) {
    const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return m ? decodeURIComponent(m.pop()) : null;
  }
  const fbclid = params.get('fbclid');
  function metaIds() {
    let fbc = readCookie('_fbc');
    if (!fbc && fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
    return { fbc, fbp: readCookie('_fbp') };
  }

  // 4. App Store links stay UNTOUCHED. We used to append fi_session/fbc/fbp
  //    to every apps.apple.com CTA — that was useless (query params on a
  //    store URL never reach the app, neither on fresh install nor via the
  //    installed app) and it BROKE the store handoff on iOS for every visitor
  //    whose browser already carried Meta cookies: the App Store app rejected
  //    the decorated URL as invalid and users bounced back to getfaceit.com.
  //    Attribution runs entirely over the recordLandingVisit beacon below.
  const ids0 = metaIds();
  window.__faceItSession = { sessionId, utm: stored, fbc: ids0.fbc, fbp: ids0.fbp };

  // 5. Visit beacon. One send per session per UTM context; a second, enriched
  //    send goes out when the Meta ids weren't ready the first time (fresh
  //    visit: the Pixel needs a beat to set _fbp). fetch+keepalive instead of
  //    sendBeacon — cross-origin JSON beacons are blocked by CORS rules.
  const baseMarker = `${sessionId}:${hasIncoming ? params.toString() : ''}`;

  function sendVisit(tag) {
    localStorage.setItem(SENT_KEY, baseMarker + tag);
    const ids = metaIds();
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
      fbc:          ids.fbc || null,
      fbp:          ids.fbp || null,
    };
    try {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => { /* silent — never break the page over analytics */ });
    } catch (_err) { /* never break the page over analytics */ }
  }

  const already = localStorage.getItem(SENT_KEY) || '';
  const idsNow = metaIds();
  if (!already.startsWith(baseMarker)) {
    sendVisit('');
    if (!(idsNow.fbc && idsNow.fbp)) {
      setTimeout(() => {
        const ids = metaIds();
        if (ids.fbc || ids.fbp) sendVisit(':ids');
      }, 1800);
    }
  } else if (already === baseMarker && (idsNow.fbc || idsNow.fbp)) {
    // Earlier pageview went out without Meta ids — deliver them now.
    sendVisit(':ids');
  }
})();
