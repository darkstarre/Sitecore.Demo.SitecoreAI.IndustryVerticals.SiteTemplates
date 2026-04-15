import { defineConfig } from '@sitecore-content-sdk/nextjs/config';
/**
 * @type {import('@sitecore-content-sdk/nextjs/config').SitecoreConfig}
 * See the documentation for `defineConfig`:
 * https://doc.sitecore.com/xmc/en/developers/content-sdk/the-sitecore-configuration-file.html
 *
 * Matches {@link industry-verticals/vistra/sitecore.config.ts}: defaults + env drive Edge.
 * Multisite host resolution uses `.sitecore/sites.json` (uchicago listed first, twice, like vistra).
 */
export default defineConfig({});
