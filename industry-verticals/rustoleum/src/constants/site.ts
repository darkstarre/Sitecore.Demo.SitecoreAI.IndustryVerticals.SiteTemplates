/**
 * Rust-Oleum rendering host: content/layout come from the existing **forma-lux** site in CM/Edge.
 * The Forma Lux tenant and tree stay as-is; this app is a reskin (logo, theme, copy in FE only).
 *
 * Optional override: `NEXT_PUBLIC_CONTENT_SITE_NAME` (defaults to `forma-lux`).
 */
export const RUSTOLEUM_CONTENT_SITE_NAME =
  (typeof process.env.NEXT_PUBLIC_CONTENT_SITE_NAME === 'string' &&
    process.env.NEXT_PUBLIC_CONTENT_SITE_NAME.trim()) ||
  'forma-lux';
