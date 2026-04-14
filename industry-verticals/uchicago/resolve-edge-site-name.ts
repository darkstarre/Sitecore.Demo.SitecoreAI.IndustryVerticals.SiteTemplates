/**
 * Sitecore Edge site name for this vertical.
 */
export function resolveEdgeSiteName(): string {
  return (process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME || 'uchicago').trim();
}
