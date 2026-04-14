/**
 * This Layout is needed for Starter Kit.
 */
import React, { JSX } from 'react';
import Head from 'next/head';
import { Placeholder, Field, Page, ImageField } from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'src/components/content-sdk/SitecoreStyles';
import { DesignLibraryLayout } from './DesignLibraryLayout';

interface LayoutProps {
  page: Page;
}

interface RouteFields {
  [key: string]: unknown;
  Title?: Field;
  metadataTitle?: Field;
  metadataKeywords?: Field;
  metadataDescription?: Field;
  pageSummary?: Field;
  ogImage?: ImageField;
}

const Layout = ({ page }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const route = layout?.sitecore?.route;
  const fields = route?.fields as RouteFields;
  const mainClassPageEditing = mode.isEditing ? 'editing-mode' : 'prod-mode';

  const metaDescription =
    fields?.metadataDescription?.value?.toString() || fields?.pageSummary?.value?.toString() || '';
  const metaKeywords = fields?.metadataKeywords?.value?.toString() || '';
  const ogTitle = fields?.metadataTitle?.value?.toString() || 'Page';
  const ogImage = fields?.ogImage?.value?.src;
  const ogDescription =
    fields?.metadataDescription?.value?.toString() || fields?.pageSummary?.value?.toString() || '';

  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layout} />
      <Head>
        <title>{fields?.Title?.value?.toString() || 'Page'}</title>
        <link rel="icon" href="/favicon.ico" />
        {metaDescription && <meta name="description" content={metaDescription} />}
        {metaKeywords && <meta name="keywords" content={metaKeywords} />}
        <link rel="icon" href="/favicon.ico" />
        {ogTitle && <meta property="og:title" content={ogTitle} />}
        {ogDescription && <meta property="og:description " content={ogDescription} />}
        {ogImage && <meta property="og:image" content={ogImage} />}
      </Head>

      {/* root placeholder for the app, which we add components to using route data */}
      <div className={mainClassPageEditing}>
        {mode.isDesignLibrary ? (
          <DesignLibraryLayout />
        ) : !route ? (
          <main className="mx-auto max-w-2xl p-6 text-neutral-900 dark:text-neutral-100">
            <h1 className="mb-2 text-xl font-semibold">No layout data from Sitecore</h1>
            <p className="mb-3 text-sm leading-relaxed">
              The page loaded but there is no route / placeholder data (often a wrong or missing
              site, or an item without the headless layout). Check:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>
                <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">
                  NEXT_PUBLIC_DEFAULT_SITE_NAME
                </code>{' '}
                in{' '}
                <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">.env.local</code>{' '}
                — use <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">ucm</code>{' '}
                in CM and{' '}
                <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">
                  NEXT_PUBLIC_DEFAULT_SITE_NAME=ucm
                </code>
                .
              </li>
              <li>
                Try{' '}
                <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">?site=ucm</code>{' '}
                or clear the{' '}
                <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">sc_site</code>{' '}
                cookie if another site was selected earlier.
              </li>
              <li>
                Edge context id must be for an environment that includes the Nova Medical site.
              </li>
            </ul>
          </main>
        ) : (
          <>
            <header>
              <div id="header">
                <Placeholder name="headless-header" rendering={route} />
              </div>
            </header>
            <main>
              <div id="content">
                <Placeholder name="headless-main" rendering={route} />
              </div>
            </main>
            <footer>
              <div id="footer">
                <Placeholder name="headless-footer" rendering={route} />
              </div>
            </footer>
          </>
        )}
      </div>
    </>
  );
};

export default Layout;
