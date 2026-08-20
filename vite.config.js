import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// Hosts the app talks to in EVERY environment: the API plus geocoding and IP
// country lookup. Keep this in sync with the connect-src list in index.html —
// anything here that the production policy omits will be blocked once deployed.
const SHARED_CONNECT = [
  'https://api.thehorizonproperties.com',
  'https://nominatim.openstreetmap.org',
  'https://api.bigdatacloud.net',
  'https://photon.komoot.io',
  'https://ipapi.co',
].join(' ');

// Loopback variants for dev. CSP matches hosts literally, so `localhost` does
// NOT cover `127.0.0.1` or `[::1]` — the Vite dev server binds to [::1], and a
// blocked HMR websocket retries in a loop, which is what a burst of repeated
// connect-src violations looks like.
const DEV_CONNECT = [
  'ws://localhost:*',
  'wss://localhost:*',
  'ws://127.0.0.1:*',
  'ws://[::1]:*',
  'http://localhost:*',
  'http://127.0.0.1:*',
  'http://[::1]:*',
].join(' ');

/**
 * Serving dev through a tunnel (ngrok / cloudflared / localtunnel).
 *
 * Opt-in: set TUNNEL_HOST in .env to the tunnel's hostname (no scheme) and
 * everything below switches on. Unset, dev behaves exactly as before — this is
 * why it lives here rather than in a separate config file the way the admin
 * console does it.
 *
 * The .env has documented TUNNEL_HOST and VITE_ALLOWED_HOSTS as "read by
 * vite.config.js" for a while, but nothing here read them: there was no
 * allowedHosts, no HMR override and no proxy, so a tunnel got as far as Vite's
 * host check and stopped with "Blocked request. This host is not allowed."
 *
 * Four things have to change, and the fourth is specific to this app:
 *
 *  1. allowedHosts — Vite rejects Host headers it does not recognise.
 *  2. hmr over wss:443 — the browser reaches the tunnel on 443, not the dev
 *     port, so the websocket must be told the public host and port or it
 *     retries in a loop.
 *  3. proxy /api — the backend on localhost:3000 is unreachable from whatever
 *     device opened the tunnel, and an https page cannot call http://localhost
 *     anyway. Proxying makes the API same-origin, which also means only ONE
 *     tunnel is needed rather than a second one for the backend, and sidesteps
 *     CORS (the tunnel origin is not in the backend's CORS_ORIGIN list).
 *  4. connect-src — unlike the admin console this app ships a dev CSP, and the
 *     list below is loopback-only. The HMR socket to wss://<tunnel> is a
 *     cross-origin connect as far as CSP is concerned, so without adding the
 *     host the socket is blocked and HMR dies silently behind a wall of
 *     violation reports.
 */
// Comma-separated extras, for a reserved custom domain that is not the tunnel
// host itself. Documented in .env as VITE_ALLOWED_HOSTS.
const splitHosts = (value) =>
  (value ?? '')
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean);

// Built per-invocation rather than at module scope, because the tunnel host may
// arrive from .env via loadEnv rather than from the process environment — and a
// module-scope constant would be computed before that file is ever read, so the
// CSP would silently omit the host it needs while everything else picked it up.
const devCsp = (tunnelHost) => {
  const tunnelConnect = tunnelHost
    ? ` wss://${tunnelHost} https://${tunnelHost}`
    : '';

  return (
  [
    "default-src 'self'",
    // 'unsafe-eval' is needed by the dev-only tooling; the production policy in
    // index.html deliberately omits it.
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    `connect-src 'self' ${DEV_CONNECT} ${SHARED_CONNECT}${tunnelConnect}`,
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; ') + ';'
  );
};

/**
 * Browsers enforce EVERY Content-Security-Policy they receive and a resource
 * must satisfy all of them, so the effective policy is the intersection and the
 * strictest value always wins. That makes shipping both a <meta> CSP and a
 * header CSP a standing trap: the production meta tag (no localhost, no
 * 'unsafe-eval') silently overrode the permissive dev header and blocked every
 * localhost API call and the HMR socket.
 *
 * So: index.html carries the PRODUCTION policy, and we strip it during `serve`
 * so dev is governed solely by the header above. One list per environment.
 */
const stripCspMetaInDev = () => ({
  name: 'strip-csp-meta-in-dev',
  apply: 'serve',
  transformIndexHtml: (html) =>
    html.replace(
      /[ \t]*<meta\s+http-equiv=["']Content-Security-Policy["'][^>]*>\s*\n?/i,
      '',
    ),
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Third argument '' loads every key, not just VITE_-prefixed ones — TUNNEL_HOST
  // is server-side only and must never reach the client bundle, so it is
  // deliberately not VITE_-prefixed and would be invisible to the default load.
  const env = loadEnv(mode, process.cwd(), '');
  // process.env wins so a one-off `TUNNEL_HOST=… npm run dev` works without
  // editing .env — which matters because the hostname is only known after the
  // tunnel agent has started.
  const tunnelHost = (process.env.TUNNEL_HOST ?? env.TUNNEL_HOST ?? '').trim();
  const tunnelling = Boolean(tunnelHost);
  const extraHosts = splitHosts(
    process.env.VITE_ALLOWED_HOSTS ?? env.VITE_ALLOWED_HOSTS,
  );

  if (tunnelling) {
    // Point the app at the proxy instead of the absolute localhost URL in .env,
    // without editing .env — that file is shared with the normal dev flow.
    // Must be process.env, not `define`: in dev Vite leaves import.meta.env.VITE_*
    // member accesses alone and supplies them at runtime, so a `define` entry
    // never lands and the app keeps calling localhost:3000 cross-origin.
    process.env.VITE_API_BASE_URL = '/api/v1';
  }

  return {
    plugins: [
      react(),
      eslint({
        failOnError: false,
      }),
      stripCspMetaInDev(),
    ],
    server: {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Content-Security-Policy': devCsp(tunnelHost),
      },
      ...(tunnelling && {
        host: true, // bind 0.0.0.0 so the tunnel agent can reach it
        // The tunnel host plus any extras. A list rather than `true`: this app
        // is reachable on a LAN once host:true is set, and a blanket allow is a
        // DNS-rebinding foothold. The admin console can afford `true`; this one
        // knows its hostname, so it names it.
        allowedHosts: [tunnelHost, ...extraHosts],
        hmr: {
          protocol: 'wss',
          host: tunnelHost,
          clientPort: 443,
        },
        proxy: {
          '/api': {
            target: env.PROXY_TARGET || 'http://localhost:3000',
            changeOrigin: true,
            // Backend sets cookies for localhost; drop the Domain so the browser
            // scopes them to the tunnel host instead of discarding them.
            cookieDomainRewrite: '',
            configure: (proxy) => {
              // changeOrigin only rewrites Host. The browser still forwards
              // `Origin: https://<tunnel>`, which is not in the backend's
              // CORS_ORIGIN allowlist, so cors() rejects it. Rewriting to an
              // already-allowlisted origin fixes that without pinning a tunnel
              // URL that changes on every restart. Harmless for the browser: it
              // made a same-origin request to /api and never applies CORS to
              // the response.
              proxy.on('proxyReq', (proxyReq) => {
                proxyReq.setHeader(
                  'origin',
                  env.PROXY_ORIGIN || 'http://localhost:5173',
                );
              });
            },
          },
        },
      }),
    },
  };
});
