import { type NextRequest, type NextFetchEvent } from 'next/server';
import {
  defineMiddleware,
  MultisiteMiddleware,
  PersonalizeMiddleware,
  RedirectsMiddleware,
} from '@sitecore-content-sdk/nextjs/middleware';
import scConfig from 'sitecore.config';
import { sitesForMiddleware } from 'lib/app-sites';

const multisite = new MultisiteMiddleware({
  sites: sitesForMiddleware,
  ...scConfig.api.edge,
  ...scConfig.multisite,
  skip: () => false,
});
const redirects = new RedirectsMiddleware({
  sites: sitesForMiddleware,
  ...scConfig.api.edge,
  ...scConfig.redirects,
  skip: () => false,
});

const personalize = new PersonalizeMiddleware({
  sites: sitesForMiddleware,
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
