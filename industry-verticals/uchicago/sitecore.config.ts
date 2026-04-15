import { defineConfig } from '@sitecore-content-sdk/nextjs/config';

/**
 * UChicago rendering host only — keep defaults explicit so Edge and 404/error paths never
 * depend on another vertical's env or regenerated multisite lists.
 */
export default defineConfig({
  defaultSite: 'uchicago',
  defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
  api: {
    edge: {
      contextId:
        process.env.SITECORE_EDGE_CONTEXT_ID ||
        process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID ||
        'missing-edge-context-id',
      clientContextId:
        process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID || 'missing-edge-context-id',
      edgeUrl: process.env.SITECORE_EDGE_URL || process.env.NEXT_PUBLIC_SITECORE_EDGE_URL,
    },
    local: {
      apiKey: process.env.SITECORE_API_KEY || process.env.NEXT_PUBLIC_SITECORE_API_KEY || '',
      apiHost: process.env.SITECORE_API_HOST || process.env.NEXT_PUBLIC_SITECORE_API_HOST || '',
    },
  },
});
