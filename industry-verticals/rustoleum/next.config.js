const path = require('path');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  env: {
    // Dev default: use /public/brand/rustoleum-logo.png so logo updates show without Edge publish.
    // Set to 0 to load logo URLs from Edge. Production default is unset → treated as off in client unless set.
    NEXT_PUBLIC_LOCAL_BRAND_LOGO:
      process.env.NEXT_PUBLIC_LOCAL_BRAND_LOGO ??
      (process.env.NODE_ENV !== 'production' ? '1' : '0'),
  },

  outputFileTracingRoot: path.join(__dirname),

  // Allow specifying a distinct distDir when concurrently running app in a container
  distDir: process.env.NEXTJS_DIST_DIR || '.next',

  i18n: {
    // These are all the locales you want to support in your application.
    // These should generally match (or at least be a subset of) those in Sitecore.
    locales: ['en', 'fr-FR', 'es-ES'],
    // This is the locale that will be used when visiting a non-locale
    // prefixed path e.g. `/about`.
    defaultLocale: process.env.DEFAULT_LANGUAGE || process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
  },

  // Enable React Strict Mode
  reactStrictMode: true,

  // Disable the X-Powered-By header. Follows security best practices.
  poweredByHeader: false,

  // use this configuration to ensure that only images from the whitelisted domains
  // can be served from the Next.js Image Optimization API
  // see https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'edge*.**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'xmc-*.**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'starter-verticals-v2.sitecoresandbox.cloud',
        port: '',
      },
    ],
  },

  async rewrites() {
    return [
      // healthz check
      {
        source: '/healthz',
        destination: '/api/healthz',
      },
      // robots route
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
      // sitemap route
      {
        source: '/sitemap:id([\\w-]{0,}).xml',
        destination: '/api/sitemap',
      },
      // feaas api route
      {
        source: '/feaas-render',
        destination: '/api/editing/feaas/render',
      },
    ];
  },

  webpack: (config, options) => {
    if (!options.isServer) {
      // Add a loader to strip out getComponentServerProps from components in the client bundle
      config.module.rules.unshift({
        test: /src\\components\\.*\.tsx$/,
        use: ['@sitecore-content-sdk\\nextjs\\component-props-loader'],
      });
    } else {
      // Force use of CommonJS on the server for FEAAS SDK since Content SDK also uses CommonJS entrypoint to FEAAS SDK.
      // This prevents issues arising due to FEAAS SDK's dual CommonJS/ES module support on the server (via conditional exports).
      // See https://nodejs.org/api/packages.html#dual-package-hazard.
      config.externals = [
        {
          '@sitecore-feaas/clientside/react': 'commonjs @sitecore-feaas/clientside/react',
          '@sitecore/byoc': 'commonjs @sitecore/byoc',
          '@sitecore/byoc/react': 'commonjs @sitecore/byoc/react',
        },
        ...config.externals,
      ];
    }

    return config;
  },
};

module.exports = nextConfig;
