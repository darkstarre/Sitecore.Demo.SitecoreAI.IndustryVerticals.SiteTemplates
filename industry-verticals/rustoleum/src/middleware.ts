import { type NextRequest, type NextFetchEvent } from 'next/server';
import {
  defineMiddleware,
  MultisiteMiddleware,
  PersonalizeMiddleware,
  RedirectsMiddleware,
} from '@sitecore-content-sdk/nextjs/middleware';
import sites from '.sitecore/sites.json';
import scConfig from 'sitecore.config';
import { RUSTOLEUM_CONTENT_SITE_NAME } from 'src/constants/site';

/** This host only serves the Forma Lux site tree (Rust-Oleum reskin); keep multisite resolution scoped. */
const sitesForHost = sites.filter((s) => s.name === RUSTOLEUM_CONTENT_SITE_NAME);

const multisite = new MultisiteMiddleware({
  sites: sitesForHost.length ? sitesForHost : sites,
  ...scConfig.api.edge,
  ...scConfig.multisite,
  skip: () => false,
});
const redirects = new RedirectsMiddleware({
  sites: sitesForHost.length ? sitesForHost : sites,
  ...scConfig.api.edge,
  ...scConfig.redirects,
  skip: () => false,
});

const personalize = new PersonalizeMiddleware({
  sites: sitesForHost.length ? sitesForHost : sites,
  ...scConfig.api.edge,
  ...scConfig.personalize,
  skip: () => false,
});

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  return defineMiddleware(multisite, redirects, personalize).exec(req, ev);
}

export const config = {
  matcher: ['/', '/((?!api/|_next/|healthz|sitecore/api/|-/|favicon.ico|sc_logo.svg).*)'],
};
