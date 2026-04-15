import { NextResponse, type NextRequest } from 'next/server';
import { UCHICAGO_EDGE_SITE_NAME } from '../../resolve-edge-site-name';

const SC_PREVIEW = 'sc_preview';

function matchesOurSite(value: string | undefined | null): boolean {
  if (value == null || value === '') return true;
  return value.trim().toLowerCase() === UCHICAGO_EDGE_SITE_NAME;
}

/**
 * Runs before {@link MultisiteMiddleware}. That middleware prefers `site` / `sc_site` query params
 * and the `sc_site` cookie (when `sc_preview` is set) over host-based resolution. Shared SCAI,
 * bookmarks, or another vertical's tab can leave `gridwell` (etc.) there while this host only
 * serves UChicago — normalize URL and preview cookie so rewrites and layout stay on uchicago.
 */
export const uchicagoSiteLockMiddleware = {
  handle(req: NextRequest, res: NextResponse): NextResponse {
    const url = req.nextUrl.clone();
    let dirty = false;

    for (const key of ['site', 'sc_site'] as const) {
      const raw = url.searchParams.get(key);
      if (raw && !matchesOurSite(raw)) {
        url.searchParams.delete(key);
        dirty = true;
      }
    }

    const normalizedPath = url.pathname.replace(
      /\/_site_[^/]+/i,
      `/_site_${UCHICAGO_EDGE_SITE_NAME}`
    );
    if (normalizedPath !== url.pathname) {
      url.pathname = normalizedPath;
      dirty = true;
    }

    if (dirty) {
      return NextResponse.redirect(url);
    }

    const previewOn = Boolean(req.cookies.get(SC_PREVIEW)?.value);
    const scSite = req.cookies.get('sc_site')?.value;
    if (previewOn && scSite && !matchesOurSite(scSite)) {
      const response = NextResponse.redirect(req.nextUrl);
      response.cookies.set('sc_site', UCHICAGO_EDGE_SITE_NAME, {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      return response;
    }

    return res;
  },
};
