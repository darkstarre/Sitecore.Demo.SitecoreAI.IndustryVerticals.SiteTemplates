import { useEffect, JSX } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import {
  SitecoreProvider,
  ComponentPropsContext,
  SitecorePageProps,
  StaticPath,
} from '@sitecore-content-sdk/nextjs';
import { SitecoreClient } from '@sitecore-content-sdk/nextjs/client';
import { extractPath, handleEditorFastRefresh } from '@sitecore-content-sdk/nextjs/utils';
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import client from 'lib/sitecore-client';
import components from '.sitecore/component-map';
import scConfig from 'sitecore.config';

const INTERSTATE_SITE = 'interstate';
const RETAIL_SOURCE_SITE = 'forma-lux';
const interstateClient = new SitecoreClient({
  ...scConfig,
  defaultSite: INTERSTATE_SITE,
});
const retailSourceClient = new SitecoreClient({
  ...scConfig,
  defaultSite: RETAIL_SOURCE_SITE,
});

const hasRenderablePlaceholders = (pageData: SitecorePageProps['page']) => {
  const placeholders = pageData?.layout?.sitecore?.route?.placeholders;
  if (!placeholders) return false;

  return Object.values(placeholders).some(
    (components) => Array.isArray(components) && components.length > 0
  );
};

const replaceRetailBrandText = <T,>(input: T): T => {
  if (typeof input === 'string') {
    return input
      .replace(/Forma Lux/gi, 'Interstate Batteries')
      .replace(/forma-lux/gi, 'interstate')
      .replace(/forma lux/gi, 'Interstate Batteries') as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) => replaceRetailBrandText(item)) as T;
  }

  if (input && typeof input === 'object') {
    const entries = Object.entries(input as Record<string, unknown>).map(([key, value]) => [
      key,
      replaceRetailBrandText(value),
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
      paths = await interstateClient.getPagePaths([INTERSTATE_SITE], context?.locales || []);
    } catch (error) {
      console.log('Error occurred while fetching static paths');
      console.log(error);
      try {
        paths = await retailSourceClient.getPagePaths([RETAIL_SOURCE_SITE], context?.locales || []);
      } catch (fallbackError) {
        console.log('Error occurred while fetching retail fallback static paths');
        console.log(fallbackError);
      }
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
  let usingRetailFallback = false;

  if (context.preview && isDesignLibraryPreviewData(context.previewData)) {
    page = await client.getDesignLibraryData(context.previewData);
  } else {
    page = context.preview
      ? await client.getPreview(context.previewData)
      : await interstateClient.getPage(path, { locale: context.locale });
  }

  const hasInterstatePage = page?.siteName?.toLowerCase() === INTERSTATE_SITE;
  const hasInterstateRenderings = hasRenderablePlaceholders(page);
  if (!hasInterstatePage || !hasInterstateRenderings) {
    // Interstate item exists but may not have page design/renderings yet. Bootstrap from Retail.
    const retailPage = await retailSourceClient.getPage(path, { locale: context.locale });
    if (retailPage) {
      page = retailPage;
      usingRetailFallback = true;
    }
  }

  if (page) {
    page = replaceRetailBrandText(page);

    props = {
      page,
      dictionary: await client.getDictionary({
        site: usingRetailFallback ? RETAIL_SOURCE_SITE : INTERSTATE_SITE,
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
