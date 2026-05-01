import sitesRaw from '.sitecore/sites.json';
import { RUSTOLEUM_CONTENT_SITE_NAME } from 'src/constants/site';

type SiteEntry = (typeof sitesRaw)[number];

function dedupeSitesByName(sites: SiteEntry[]): SiteEntry[] {
  const seen = new Set<string>();
  const out: SiteEntry[] = [];
  for (const s of sites) {
    if (seen.has(s.name)) continue;
    seen.add(s.name);
    out.push(s);
  }
  return out;
}

/** CLI-generated `sites.json` can repeat the same `name`; keep first row only. */
const sitesDeduped = dedupeSitesByName(sitesRaw);

const contentSite = sitesDeduped.find((s) => s.name === RUSTOLEUM_CONTENT_SITE_NAME);

/**
 * Config the Rust-Oleum host uses: bound content site when present, otherwise full deduped list.
 * No manual file edits or extra scripts — duplicates in `sites.json` are ignored here.
 */
export const sitesForMiddleware: SiteEntry[] = contentSite ? [contentSite] : sitesDeduped;
