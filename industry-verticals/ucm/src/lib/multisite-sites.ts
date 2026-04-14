import type { SiteInfo } from '@sitecore-content-sdk/nextjs';
import sitesJson from '../../.sitecore/sites.json';

/**
 * Default site for local/preview when this app has no dedicated CM site yet.
 * UCM is a healthcare clone; use Nova Medical content until `ucm` exists in CM.
 */
export const UCM_DEFAULT_SITE_NAME = 'nova-medical';

const defaultSiteName = process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME || UCM_DEFAULT_SITE_NAME;

/**
 * `MultisiteMiddleware` picks the first site that matches host `*` (see Sitecore SiteResolver).
 * Re-order so the configured default site wins — same Edge content as running healthcare locally.
 */
export function getMultisiteSites(): SiteInfo[] {
  const list = sitesJson as SiteInfo[];
  return [...list].sort((a, b) => {
    const aFirst = a.name === defaultSiteName ? 0 : 1;
    const bFirst = b.name === defaultSiteName ? 0 : 1;
    if (aFirst !== bFirst) return aFirst - bFirst;
    return 0;
  });
}

export const multisiteSites = getMultisiteSites();
