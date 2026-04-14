import { defineConfig } from '@sitecore-content-sdk/nextjs/config';
import { resolveEdgeSiteName } from './resolve-edge-site-name';

/**
 * @type {import('@sitecore-content-sdk/nextjs/config').SitecoreConfig}
 * See: https://doc.sitecore.com/xmc/en/developers/content-sdk/the-sitecore-configuration-file.html
 *
 * Env: Next.js loads .env* during `next dev` / `next build`. For `sitecore-tools`, see sitecore.cli.config.ts.
 */
export default defineConfig({
  api: {
    edge: {
      contextId:
        process.env.SITECORE_EDGE_CONTEXT_ID ||
        process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID ||
        '',
      clientContextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID || '',
      edgeUrl: process.env.SITECORE_EDGE_URL || process.env.NEXT_PUBLIC_SITECORE_EDGE_URL,
    },
    local: {
      apiKey: process.env.SITECORE_API_KEY || process.env.NEXT_PUBLIC_SITECORE_API_KEY || '',
      apiHost: process.env.SITECORE_API_HOST || process.env.NEXT_PUBLIC_SITECORE_API_HOST || '',
    },
  },
  // Sitecore site name for Edge (not the Deploy rendering-host slug). See resolve-edge-site-name.ts.
  defaultSite: resolveEdgeSiteName(),
  defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
  editingSecret: process.env.SITECORE_EDITING_SECRET,
});
