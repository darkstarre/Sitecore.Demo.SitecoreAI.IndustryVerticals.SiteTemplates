/**
 * This Layout is needed for Starter Kit.
 */
import React, { JSX } from 'react';
import Head from 'next/head';
import { Placeholder, Field, Page, ImageField } from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'src/components/content-sdk/SitecoreStyles';
import { DesignLibraryLayout } from './DesignLibraryLayout';
import { useRouter } from 'next/router';

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

type RouteWithPlaceholders = {
  placeholders?: Record<string, unknown[]>;
};

const Layout = ({ page }: LayoutProps): JSX.Element => {
  const router = useRouter();
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  const routeWithPlaceholders = route as RouteWithPlaceholders | undefined;
  const fields = route?.fields as RouteFields;
  const mainClassPageEditing = mode.isEditing ? 'editing-mode' : 'prod-mode';
  const hasHeaderComponents = !!routeWithPlaceholders?.placeholders?.['headless-header']?.length;
  const hasMainComponents = !!routeWithPlaceholders?.placeholders?.['headless-main']?.length;
  const hasFooterComponents = !!routeWithPlaceholders?.placeholders?.['headless-footer']?.length;
  const hasAnyRouteComponents = hasHeaderComponents || hasMainComponents || hasFooterComponents;

  const metaDescription =
    fields?.metadataDescription?.value?.toString() || fields?.pageSummary?.value?.toString() || '';
  const metaKeywords = fields?.metadataKeywords?.value?.toString() || '';
  const ogTitle = fields?.metadataTitle?.value?.toString() || 'Page';
  const ogImage = fields?.ogImage?.value?.src;
  const ogDescription =
    fields?.metadataDescription?.value?.toString() || fields?.pageSummary?.value?.toString() || '';
  const currentPath = router.asPath;
  const ogUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}${currentPath}`;

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
        {ogUrl && <meta property="og:url" content={ogUrl} />}
        {/* Custom meta tag for current relative path - used in Search */}
        {currentPath && <meta name="page-path" content={currentPath} />}
      </Head>

      {/* root placeholder for the app, which we add components to using route data */}
      <div className={mainClassPageEditing}>
        {mode.isDesignLibrary ? (
          <DesignLibraryLayout />
        ) : (
          <>
            <header>
              <div id="header">
                {route && hasAnyRouteComponents ? (
                  <Placeholder name="headless-header" rendering={route} />
                ) : (
                  <div className="border-b">
                    <div className="container flex items-center justify-between py-4">
                      <img
                        src="https://static.cdnlogo.com/logos/l/10/littelfuse.svg"
                        alt="Littelfuse"
                        className="h-auto w-40"
                      />
                      <nav className="hidden gap-8 lg:flex">
                        <a
                          href="#"
                          className="text-[0.92rem] font-semibold tracking-[0.07em] text-[#2b2b2b] uppercase"
                        >
                          Products
                        </a>
                        <a
                          href="#"
                          className="text-[0.92rem] font-semibold tracking-[0.07em] text-[#2b2b2b] uppercase"
                        >
                          Industries
                        </a>
                        <a
                          href="#"
                          className="text-[0.92rem] font-semibold tracking-[0.07em] text-[#2b2b2b] uppercase"
                        >
                          Solutions
                        </a>
                        <a
                          href="#"
                          className="text-[0.92rem] font-semibold tracking-[0.07em] text-[#2b2b2b] uppercase"
                        >
                          Resources
                        </a>
                      </nav>
                    </div>
                  </div>
                )}
              </div>
            </header>
            <main>
              <div id="content">
                {route && hasAnyRouteComponents ? (
                  <Placeholder name="headless-main" rendering={route} />
                ) : (
                  <section className="container py-20">
                    <div className="max-w-3xl space-y-4">
                      <p className="text-sm font-semibold tracking-[0.1em] text-[#d71920] uppercase">
                        Littelfuse
                      </p>
                      <h1 className="text-5xl leading-tight font-bold">
                        Site connected, content still being mapped
                      </h1>
                      <p className="text-foreground-light text-lg">
                        Your app is running, but the Home route currently has no components assigned
                        in Sitecore placeholders. Once Header/Main/Footer renderings are mapped and
                        published, this fallback will disappear automatically.
                      </p>
                    </div>
                  </section>
                )}
              </div>
            </main>
            <footer>
              <div id="footer">
                {route && <Placeholder name="headless-footer" rendering={route} />}
              </div>
            </footer>
          </>
        )}
      </div>
    </>
  );
};

export default Layout;
