import { useEffect, JSX } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import sites from '.sitecore/sites.json';
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import {
  SitecoreProvider,
  ComponentPropsContext,
  SitecorePageProps,
  StaticPath,
  SiteInfo,
} from '@sitecore-content-sdk/nextjs';
import { extractPath, handleEditorFastRefresh } from '@sitecore-content-sdk/nextjs/utils';
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import client from 'lib/sitecore-client';
import components from '.sitecore/component-map';
import scConfig from 'sitecore.config';

const hasRenderablePlaceholders = (pageData: SitecorePageProps['page']) => {
  const placeholders = pageData?.layout?.sitecore?.route?.placeholders;
  if (!placeholders) return false;

  return Object.values(placeholders).some(
    (renderings) => Array.isArray(renderings) && renderings.length > 0
  );
};

const replaceLegacyBrandText = <T,>(input: T): T => {
  if (typeof input === 'string') {
    return input.replace(/forma\s+lux/gi, 'Interstate Batteries') as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) => replaceLegacyBrandText(item)) as T;
  }

  if (input && typeof input === 'object') {
    const entries = Object.entries(input as Record<string, unknown>).map(([key, value]) => [
      key,
      replaceLegacyBrandText(value),
    ]);
    return Object.fromEntries(entries) as T;
  }

  return input;
};

const SitecorePage = ({ page, notFound, componentProps }: SitecorePageProps): JSX.Element => {
  useEffect(() => {
    // Since Sitecore Editor does not support Fast Refresh, need to refresh editor chromes after Fast Refresh finished
    handleEditorFastRefresh();
  }, []);

  if (notFound || !page) {
    // Shouldn't hit this (as long as 'notFound' is being returned below), but just to be safe
    return <NotFound />;
  }

  return (
    <ComponentPropsContext value={componentProps || {}}>
      <SitecoreProvider componentMap={components} api={scConfig.api} page={page}>
        <Layout page={page} />
      </SitecoreProvider>
    </ComponentPropsContext>
  );
};

// This function gets called at build and export time to determine
// pages for SSG ("paths", as tokenized array).
export const getStaticPaths: GetStaticPaths = async (context) => {
  // Fallback, along with revalidate in getStaticProps (below),
  // enables Incremental Static Regeneration. This allows us to
  // leave certain (or all) paths empty if desired and static pages
  // will be generated on request (development mode in this example).
  // Alternatively, the entire sitemap could be pre-rendered
  // ahead of time (non-development mode in this example).
  // See https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration

  let paths: StaticPath[] = [];
  let fallback: boolean | 'blocking' = 'blocking';

  if (process.env.NODE_ENV !== 'development' && scConfig.generateStaticPaths) {
    try {
      paths = await client.getPagePaths(
        sites.map((site: SiteInfo) => site.name),
        context?.locales || []
      );
    } catch (error) {
      console.log('Error occurred while fetching static paths');
      console.log(error);
    }

    fallback = process.env.EXPORT_MODE ? false : fallback;
  }

  return {
    paths,
    fallback,
  };
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation (or fallback) is enabled and a new request comes in.
export const getStaticProps: GetStaticProps = async (context) => {
  let props = {};
  const path = extractPath(context);
  let page;

  if (context.preview && isDesignLibraryPreviewData(context.previewData)) {
    page = await client.getDesignLibraryData(context.previewData);
  } else {
    page = context.preview
      ? await client.getPreview(context.previewData)
      : await client.getPage(path, { locale: context.locale });
  }

  // Interstate safety net:
  // until Interstate placeholders are mapped in Sitecore, reuse Forma Lux route
  // so the site does not render blank in preview/runtime.
  if (
    process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME === 'interstate-batteries' &&
    (!page || !hasRenderablePlaceholders(page))
  ) {
    const fallbackPage = await client.getPage('/_site_forma-lux', { locale: context.locale });
    if (fallbackPage) {
      page = fallbackPage;
    }
  }

  if (process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME === 'interstate-batteries' && page) {
    page = replaceLegacyBrandText(page);
  }

  if (page) {
    props = {
      page,
      dictionary: await client.getDictionary({
        site: page.siteName,
        locale: page.locale,
      }),
      componentProps: await client.getComponentData(page.layout, context, components),
    };
  }
  return {
    props,
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 5 seconds
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 5 seconds
    revalidate: 5, // In seconds
    notFound: !page,
  };
};

export default SitecorePage;
