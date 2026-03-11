'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import {
  LinkField,
  Text as ContentSdkText,
  TextField,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { IGQLTextField } from '@/types/igql';
import BlobAccent from '../../assets/shapes/BlobAccent';

const INSIGHTS_ARTICLES = [
  {
    title: 'Cross-Border Expansion Playbook for Growth Companies',
    meta: 'Briefing | March 2, 2026',
    href: '/Insights/Technology-and-Innovation',
  },
  {
    title: 'Data Center Transactions: Structuring Deals for Speed and Certainty',
    meta: 'Analysis | February 21, 2026',
    href: '/Insights/Energy-and-Infrastructure',
  },
  {
    title: 'AI Governance in Practice: 7 Questions Boards Are Asking',
    meta: 'Resource | February 11, 2026',
    href: '/Insights/Finance',
  },
  {
    title: 'Managing Regulatory Risk While Scaling Into New Markets',
    meta: 'Perspective | January 30, 2026',
    href: '/Insights/Finance',
  },
  {
    title: 'Board-Level AI Governance: What Counsel Should Prioritize',
    meta: 'Guide | January 18, 2026',
    href: '/Insights/Technology-and-Innovation',
  },
  {
    title: 'Critical Infrastructure Transactions in Volatile Markets',
    meta: 'Update | January 10, 2026',
    href: '/Insights/Energy-and-Infrastructure',
  },
];

type FeaturedArticleResult = {
  id?: string;
  url?: string;
  fields?: Record<string, { jsonValue?: unknown }>;
};

interface Fields {
  data?: {
    datasource?: {
      title?: IGQLTextField;
      eyebrow?: IGQLTextField;
      children?: {
        results?: FeaturedArticleResult[];
      };
    };
  };
}

type FeaturedArticlesDatasource = NonNullable<NonNullable<Fields['data']>['datasource']>;

type FeaturedArticlesProps = ComponentProps & {
  fields: Fields;
};

type ResolvedArticle = {
  key: string;
  title: string;
  meta: string;
  href: string;
};

const FIELD_KEYS = {
  title: ['articleTitle', 'title', 'headline', 'Title'],
  meta: ['articleMeta', 'meta', 'subtitle', 'dateAndType', 'eyebrow'],
  link: ['articleLink', 'link', 'ctaLink', 'ArticleLink', 'Link'],
} as const;

const getTextValue = (value: unknown): string => {
  if (
    value &&
    typeof value === 'object' &&
    'value' in value &&
    typeof (value as { value?: unknown }).value === 'string'
  ) {
    return (value as { value: string }).value.trim();
  }
  return '';
};

const getTextFromResult = (result: FeaturedArticleResult, keys: readonly string[]): string => {
  const fields = result.fields || {};
  for (const key of keys) {
    const candidate = fields[key]?.jsonValue;
    const text = getTextValue(candidate);
    if (text) return text;
  }
  return '';
};

const getLinkHrefFromResult = (result: FeaturedArticleResult): string | undefined => {
  const fields = result.fields || {};
  for (const key of FIELD_KEYS.link) {
    const candidate = fields[key]?.jsonValue as LinkField['value'] | undefined;
    if (candidate?.href) {
      return candidate.href;
    }
  }
  return result.url;
};

const resolveArticles = (results?: FeaturedArticleResult[]): ResolvedArticle[] => {
  const resolved =
    results
      ?.map((result, index) => {
        const title = getTextFromResult(result, FIELD_KEYS.title);
        const meta = getTextFromResult(result, FIELD_KEYS.meta);
        const href = getLinkHrefFromResult(result);

        if (!title || !href) {
          return null;
        }

        return {
          key: result.id || `${title}-${index}`,
          title,
          meta,
          href,
        };
      })
      .filter((item): item is ResolvedArticle => !!item) || [];

  return resolved.length
    ? resolved
    : INSIGHTS_ARTICLES.map((item) => ({ ...item, key: item.title }));
};

const FeaturedArticlesSection = ({ datasource }: { datasource?: FeaturedArticlesDatasource }) => {
  const insightsRef = useRef<HTMLUListElement>(null);
  const titleField = datasource?.title?.jsonValue as TextField | undefined;
  const eyebrowField = datasource?.eyebrow?.jsonValue as TextField | undefined;
  const articles = resolveArticles(datasource?.children?.results);

  const scrollInsights = (direction: 'prev' | 'next') => {
    const element = insightsRef.current;
    if (!element) return;
    const amount = Math.max(320, Math.round(element.clientWidth * 0.85));
    element.scrollBy({
      left: direction === 'next' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="bg-background dark:bg-background-dark relative overflow-hidden py-14">
      <BlobAccent
        size="lg"
        className="pointer-events-none absolute top-6 -right-18 z-0 text-[#023859]/25 md:-right-8 lg:right-0 dark:text-[#8ec7ff]/20"
      />
      <div className="relative z-10 container space-y-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#023859] uppercase dark:text-[#8ec7ff]">
              {eyebrowField ? <ContentSdkText field={eyebrowField} /> : 'Insights'}
            </p>
            <h2 className="mt-2 text-[#023859] dark:text-[#b9ddff]">
              {titleField ? <ContentSdkText field={titleField} /> : 'Featured Articles'}
            </h2>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => scrollInsights('prev')}
              className="group inline-flex items-center gap-2 text-3xl font-black tracking-tight text-[#023859] transition hover:text-[#1f3f64] dark:text-[#8ec7ff] dark:hover:text-[#c6e4ff]"
              aria-label="Scroll previous articles"
            >
              <svg
                aria-hidden
                viewBox="0 0 12 12"
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
              >
                <path
                  d="M7.8 1.6L3.4 6l4.4 4.4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="h-px w-8 bg-current opacity-70 transition-all duration-200 group-hover:w-10 group-hover:opacity-100" />
            </button>
            <button
              type="button"
              onClick={() => scrollInsights('next')}
              className="group inline-flex items-center gap-2 text-3xl font-black tracking-tight text-[#023859] transition hover:text-[#1f3f64] dark:text-[#8ec7ff] dark:hover:text-[#c6e4ff]"
              aria-label="Scroll more articles"
            >
              <span className="h-px w-8 bg-current opacity-70 transition-all duration-200 group-hover:w-10 group-hover:opacity-100" />
              <svg
                aria-hidden
                viewBox="0 0 12 12"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              >
                <path
                  d="M4.2 1.6L8.6 6l-4.4 4.4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <ul
          ref={insightsRef}
          className="flex snap-x snap-mandatory gap-8 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {articles.map((article) => (
            <li
              key={article.key}
              className="border-border/60 min-w-[290px] snap-start border-t pt-4 md:min-w-[360px]"
            >
              <Link href={article.href} className="group block space-y-3">
                <h3 className="font-heading text-2xl leading-tight text-[#023859] transition group-hover:text-[#1f3f64] dark:text-[#d9ecff] dark:group-hover:text-[#8ec7ff]">
                  {article.title}
                </h3>
                <p className="text-muted text-sm">{article.meta}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export const FeaturedArticles = (props: FeaturedArticlesProps) => (
  <FeaturedArticlesSection datasource={props.fields?.data?.datasource} />
);

export const InlineFeaturedArticles = () => <FeaturedArticlesSection />;

export const Default = withDatasourceCheck()<FeaturedArticlesProps>(FeaturedArticles);
