import { SitemapMiddleware } from '@sitecore-content-sdk/nextjs/middleware';
import scClient from 'lib/sitecore-client';
import { multisiteSites } from 'lib/multisite-sites';

/**
 * API route for generating sitemap.xml
 *
 * This Next.js API route dynamically generates and serves the sitemap XML for your site.
 * The sitemap configuration can be managed within XM Cloud.
 */

// Wire up the SitemapMiddleware handler
const handler = new SitemapMiddleware(scClient, multisiteSites).getHandler();

export default handler;
