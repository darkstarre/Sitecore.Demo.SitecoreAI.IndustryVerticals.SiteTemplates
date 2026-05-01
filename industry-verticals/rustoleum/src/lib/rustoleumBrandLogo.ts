/** Static file in /public — see authoring `rustoleum-media/.../Logo.yml` for CM sync. */
export const RUSTOLEUM_BRAND_LOGO_PATH = '/brand/rustoleum-logo.png';

/** Sitecore media id used by header Image, footer, and Navigation `Logo` param. */
export const RUSTOLEUM_LOGO_MEDIA_ID = '8f822ad5-3603-4a41-9fb7-41869da2ef4c';

/**
 * When `NEXT_PUBLIC_LOCAL_BRAND_LOGO=1` (default in dev via next.config), optional tooling
 * can still use this flag; the nav/header always use {@link RUSTOLEUM_BRAND_LOGO_PATH}.
 */
export function isLocalRustoleumBrandLogo(): boolean {
  return process.env.NEXT_PUBLIC_LOCAL_BRAND_LOGO === '1';
}

/** @deprecated Alias for generated import-map; prefer `isLocalRustoleumBrandLogo` (not a React hook). */
export const useLocalRustoleumBrandLogo = isLocalRustoleumBrandLogo;

export function contentReferencesRustoleumLogo(content: unknown): boolean {
  if (content == null) return false;
  const id = RUSTOLEUM_LOGO_MEDIA_ID.replace(/-/g, '').toLowerCase();
  const haystack = JSON.stringify(content).toLowerCase().replace(/-/g, '');
  return haystack.includes(id);
}

/** This app always uses the Rust-Oleum brand mark in the nav (ignores other tenants’ Logo param URLs). */
export function resolveNavLogoSrc(logoImage?: string | undefined): string {
  void logoImage;
  return RUSTOLEUM_BRAND_LOGO_PATH;
}
