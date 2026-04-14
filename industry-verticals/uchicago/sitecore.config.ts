import { defineConfig } from '@sitecore-content-sdk/nextjs/config';
import { resolveEdgeSiteName } from './resolve-edge-site-name';

export default defineConfig({
  api: {
    edge: {
      // Keep config validation from crashing local builds before env vars are set.
      // Real values should come from .env.local / Deploy variables.
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
  defaultSite: resolveEdgeSiteName(),
});
