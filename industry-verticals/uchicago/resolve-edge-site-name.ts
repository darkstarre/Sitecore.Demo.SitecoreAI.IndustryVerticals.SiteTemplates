/**
 * Site name as configured on the Sitecore site item (Site Grouping → SiteName), used for Edge
 * layout, dictionary, and static paths for this Next.js host.
 *
 * This app only ever serves the UChicago vertical. Do **not** read `NEXT_PUBLIC_DEFAULT_SITE_NAME`
 * here: XM Cloud and local `.env` files are often copied from another demo (`gridwell`, `vistra`,
 * etc.). When that variable points at another site, Experience Edge returns that site's layout and
 * navigation while you still run the uchicago rendering host.
 */
export const UCHICAGO_EDGE_SITE_NAME = 'uchicago' as const;

export function resolveEdgeSiteName(): typeof UCHICAGO_EDGE_SITE_NAME {
  return UCHICAGO_EDGE_SITE_NAME;
}
