import { resolveEdgeSiteName } from '../../resolve-edge-site-name';

/** Single-site list for multisite middleware and sitemap/robots handlers. */
export function getUchicagoVerticalSites() {
  const name = resolveEdgeSiteName();
  return [
    {
      name,
      hostName: '*',
      language: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
    },
  ];
}

export const uchicagoVerticalSites = getUchicagoVerticalSites();
