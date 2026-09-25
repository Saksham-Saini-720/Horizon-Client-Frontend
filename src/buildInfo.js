/**
 * What build the browser is running.
 *
 * The three globals are injected by vite.config.js at build time — they do not
 * exist at runtime, so they cannot be read from an env file or fetched. That is
 * the point: a bundle served from a CDN outlives the deploy that produced it,
 * and this is the only way a user on a stale cached build can tell you which one
 * they have.
 *
 * Mirrors Horizon-Admin/src/buildInfo.js. Duplicated rather than shared because
 * the two apps are separate repos with separate deploys — a shared package would
 * need publishing and versioning of its own to save twenty lines.
 */
export const BUILD = {
  version: __APP_VERSION__,
  commit: __APP_COMMIT__,
  builtAt: __BUILD_TIME__,
};

/** "v1.1.0 · a1b2c3d" — what to render in a footer or About panel. */
export const buildLabel = () =>
  BUILD.commit && BUILD.commit !== "unknown"
    ? `v${BUILD.version} · ${BUILD.commit}`
    : `v${BUILD.version}`;
