import { resolveEdgeSiteName } from '../../resolve-edge-site-name';

/**
 * UCM is wired as a **single-site** vertical (same idea as Vistra).
 *
 * This vertical uses a **single** Sitecore site name from {@link resolveEdgeSiteName} (default
 * `ucm`). We do not use generated `.sitecore/sites.json` for middleware so CI does not randomly
 * pick another vertical that also uses `hostName: "*"`.
 */
export function getUcmVerticalSites() {
  const name = resolveEdgeSiteName();
  return [
    {
      name,
      hostName: '*',
      language: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
    },
  ];
}

export const ucmVerticalSites = getUcmVerticalSites();
