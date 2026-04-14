/**
 * Sitecore Edge site name for this vertical. Authoring uses `ucm` under
 * `/sitecore/content/industry-verticals/ucm` (cloned from Nova Medical).
 * Override with `NEXT_PUBLIC_DEFAULT_SITE_NAME` when needed.
 */
export function resolveEdgeSiteName(): string {
  return (process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME || 'ucm').trim();
}
