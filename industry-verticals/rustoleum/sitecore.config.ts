import { defineConfig } from '@sitecore-content-sdk/nextjs/config';

/**
 * Default site must match the content source for this host (Forma Lux reskin). See `src/constants/site.ts`.
 * @type {import('@sitecore-content-sdk/nextjs/config').SitecoreConfig}
 */
export default defineConfig({
  defaultSite:
    (typeof process.env.NEXT_PUBLIC_CONTENT_SITE_NAME === 'string' &&
      process.env.NEXT_PUBLIC_CONTENT_SITE_NAME.trim()) ||
    'forma-lux',
});
