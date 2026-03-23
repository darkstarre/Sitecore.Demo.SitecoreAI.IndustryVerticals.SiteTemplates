'use client';

import styles from './tech-studio-experience.module.css';
import {
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import type { RichTextField, Field } from '@sitecore-content-sdk/nextjs';
import {
  ArrowUpRight,
  BookOpen,
  Cpu,
  FileStack,
  Globe2,
  LineChart,
  MapPin,
  Play,
  Presentation,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import React from 'react';

export type TechStudioMergedContent = {
  PortalLabel: Field<string>;
  WelcomeTitle: Field<string>;
  IntroText: RichTextField;
  SearchPlaceholder: Field<string>;
  SearchButtonText: Field<string>;
  AnnouncementsTitle: Field<string>;
  AnnouncementsContent: RichTextField;
  TasksTitle: Field<string>;
  TasksContent: RichTextField;
  QuickLinksTitle: Field<string>;
  QuickLinksContent: RichTextField;
  ApprovalsTitle: Field<string>;
  ApprovalsContent: RichTextField;
  TodayTitle: Field<string>;
  TodayContent: RichTextField;
  DocumentsTitle: Field<string>;
  DocumentsContent: RichTextField;
};

const hasRichText = (f?: RichTextField): boolean => {
  const v = f?.value;
  return (
    v != null &&
    String(v)
      .replace(/<[^>]+>/g, '')
      .trim().length > 0
  );
};

const introRichClass =
  '[&_.ck-content_a]:font-medium [&_.ck-content_a]:text-cyan-600 [&_.ck-content_a]:underline-offset-2 hover:[&_.ck-content_a]:text-cyan-500 dark:[&_.ck-content_a]:text-cyan-400 ' +
  '[&_.ck-content_p]:leading-relaxed [&_.ck-content_p+p]:mt-4 text-slate-600 dark:text-slate-300';

const FEATURED = [
  {
    tag: 'Resource center',
    title: 'AI for Startups',
    body: 'Tools and guidance to integrate AI into your business responsibly.',
    icon: Sparkles,
    gradient: 'from-violet-500/20 via-fuchsia-500/10 to-transparent',
    iconClass: 'text-violet-600 dark:text-violet-400',
  },
  {
    tag: 'Tool',
    title: 'GenAI Policy Builder',
    body: 'Generate a tailored GenAI policy aligned to practice and regulation.',
    icon: Shield,
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    iconClass: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    tag: 'Tool',
    title: 'European Startup Health Check',
    body: 'Assess readiness for your next phase of growth.',
    icon: LineChart,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    tag: 'Tool',
    title: 'Pitch deck & investor prep',
    body: 'Anatomy of a deck plus a survival kit for VC conversations.',
    icon: Presentation,
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    iconClass: 'text-amber-600 dark:text-amber-400',
  },
] as const;

const TRENDING = [
  'AI for startups',
  'Cap table',
  'Fundraising',
  'Data & privacy',
  'Fintech',
  'M&A',
  'IPO',
  'Section 83(b)',
  'SAFEs',
  'Energy & sustainability',
  'Life sciences',
  'Cross-border',
  'Board governance',
  'Term sheets',
  'Trademarks',
  'Emerging tech',
];

const REGIONS = [
  {
    title: 'United States',
    body: 'For founders and investors building in the U.S.',
    swatch: 'from-blue-600/40 to-cyan-400/30',
  },
  {
    title: 'United Kingdom',
    body: 'Starting and scaling with UK legal and market nuance.',
    swatch: 'from-indigo-600/40 to-violet-400/30',
  },
  {
    title: 'Europe',
    body: 'Pan-European programs, deals, and policy snapshots.',
    swatch: 'from-cyan-600/40 to-emerald-400/25',
  },
] as const;

const FORMS = [
  { title: 'Incorporation (Delaware)', sub: 'Core formation documents', icon: FileStack },
  { title: 'SAFE financing (US)', sub: 'Simple agreement for future equity', icon: Zap },
  { title: 'Cap table (US)', sub: 'Ownership and rounds at a glance', icon: LineChart },
] as const;

const INSIGHTS = [
  {
    stripe: 'from-cyan-500 to-blue-600',
    title: 'The Download',
    body: 'Defense tech, renewable energy in Texas, and market themes.',
  },
  {
    stripe: 'from-violet-500 to-fuchsia-600',
    title: 'AI regulation',
    body: 'Five themes shaping policy and legislation.',
  },
  {
    stripe: 'from-emerald-500 to-teal-600',
    title: 'Data centers',
    body: 'Megawatts to megabytes — developing and financing infrastructure.',
  },
] as const;

const VIDEOS = [
  {
    title: 'Preparing your company for exit',
    sub: 'Corporate best practices and dual-track processes.',
    tint: 'from-slate-800 via-slate-700 to-cyan-900/80',
  },
  {
    title: 'Raising a down round',
    sub: 'What it means and how to get ahead of it.',
    tint: 'from-slate-800 via-indigo-900/90 to-violet-900/80',
  },
  {
    title: 'University licensing',
    sub: 'Spinning out and licensing campus technology.',
    tint: 'from-slate-800 via-emerald-900/80 to-cyan-900/70',
  },
] as const;

function HeroGraphic() {
  return (
    <div className="relative mx-auto aspect-square max-w-[min(100%,420px)] lg:mx-0 lg:max-w-none">
      <div
        className={`${styles.animateOrbit} pointer-events-none absolute inset-[8%] rounded-full border border-cyan-500/20 dark:border-cyan-400/15`}
        aria-hidden
      />
      <div
        className={`${styles.animatePulseGlow} pointer-events-none absolute inset-[18%] rounded-3xl bg-gradient-to-br from-cyan-500/25 via-blue-600/15 to-violet-600/20 blur-2xl`}
        aria-hidden
      />
      <svg
        viewBox="0 0 400 400"
        className={`${styles.animateFloat} relative z-[1] h-full w-full text-cyan-500/90 dark:text-cyan-400/90`}
        aria-hidden
      >
        <defs>
          <linearGradient id="ts-node" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <g stroke="currentColor" strokeWidth="1.2" opacity="0.35" fill="none">
          <path d="M200 80 L320 200 L200 320 L80 200 Z" />
          <path d="M200 60 L340 200 L200 340 L60 200 Z" opacity="0.5" />
        </g>
        {[
          [200, 88],
          [312, 200],
          [200, 312],
          [88, 200],
          [200, 200],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle
              cx={cx}
              cy={cy}
              r={i === 4 ? 18 : 12}
              fill="url(#ts-node)"
              className="drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]"
            />
            {i < 4 ? (
              <line
                x1={200}
                y1={200}
                x2={cx}
                y2={cy}
                stroke="currentColor"
                strokeWidth="0.8"
                opacity="0.25"
              />
            ) : null}
          </g>
        ))}
        <circle
          cx="200"
          cy="200"
          r="120"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="4 8"
          opacity="0.2"
        />
      </svg>
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-[2] flex -translate-x-1/2 gap-2 rounded-full border border-white/20 bg-slate-950/40 px-3 py-1.5 font-mono text-[0.65rem] tracking-widest text-cyan-200/90 uppercase backdrop-blur-md dark:bg-black/30">
        <Cpu className="h-3.5 w-3.5" aria-hidden />
        Live stack
      </div>
    </div>
  );
}

function FeaturedCard({ item, index }: { item: (typeof FEATURED)[number]; index: number }) {
  const Icon = item.icon;
  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-xl hover:shadow-cyan-500/10 dark:border-white/[0.08] dark:bg-slate-950/50 dark:hover:border-cyan-400/35"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-80`}
        aria-hidden
      />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-md bg-slate-900/5 px-2 py-0.5 font-mono text-[0.6rem] font-semibold tracking-wider text-slate-500 uppercase dark:bg-white/10 dark:text-slate-400">
            {item.tag}
          </span>
          <Icon className={`h-6 w-6 shrink-0 ${item.iconClass}`} strokeWidth={1.5} aria-hidden />
        </div>
        <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.body}</p>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 opacity-0 transition group-hover:opacity-100 dark:text-cyan-400">
          Explore <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </article>
  );
}

export function TechStudioExperience({ content }: { content: TechStudioMergedContent }) {
  const trendingDup = [...TRENDING, ...TRENDING];

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/65 p-8 shadow-2xl shadow-slate-900/[0.07] backdrop-blur-2xl md:p-10 dark:border-white/10 dark:bg-slate-950/55 dark:shadow-cyan-500/[0.08]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent dark:via-cyan-400/50"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-br from-cyan-400/35 to-blue-600/25 blur-3xl dark:from-cyan-500/30 dark:to-blue-600/20"
          aria-hidden
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className={`${styles.staggerIn} min-w-0`}>
            <span className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 font-mono text-[0.65rem] font-semibold tracking-[0.2em] text-cyan-700 uppercase dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-300">
              <span
                className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-500 motion-reduce:animate-none dark:bg-cyan-400"
                aria-hidden
              />
              <ContentSdkText field={content.PortalLabel} />
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-[2.35rem] lg:leading-tight dark:bg-gradient-to-br dark:from-white dark:via-cyan-50 dark:to-blue-200 dark:bg-clip-text dark:text-transparent">
              <ContentSdkText field={content.WelcomeTitle} />
            </h1>
            <div className={`mt-4 max-w-xl text-base ${introRichClass}`}>
              <ContentSdkRichText field={content.IntroText} />
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <span
                  className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 dark:text-slate-500"
                  aria-hidden
                >
                  <BookOpen className="h-4 w-4" strokeWidth={2} />
                </span>
                <input
                  type="search"
                  placeholder={content.SearchPlaceholder.value}
                  className="w-full rounded-xl border border-slate-200/90 bg-white/90 py-3 pr-4 pl-10 text-sm text-slate-900 shadow-inner placeholder:text-slate-400 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400/40"
                />
              </div>
              <button
                type="button"
                className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-600/25 transition hover:from-cyan-500 hover:to-blue-500 hover:shadow-cyan-500/35 active:scale-[0.98] dark:from-cyan-500 dark:to-blue-600 dark:shadow-cyan-500/20"
              >
                <ContentSdkText field={content.SearchButtonText} />
              </button>
            </div>
          </div>
          <HeroGraphic />
        </div>
      </div>

      {/* Featured */}
      <section className="rounded-2xl border border-slate-200/90 bg-white/70 p-6 shadow-lg backdrop-blur-xl md:p-8 dark:border-white/[0.1] dark:bg-slate-950/50">
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/25 ring-1 ring-cyan-500/25 dark:ring-cyan-400/30">
            <Sparkles className="h-5 w-5 text-cyan-600 dark:text-cyan-400" strokeWidth={1.5} />
          </span>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            <ContentSdkText field={content.AnnouncementsTitle} />
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURED.map((item, i) => (
            <FeaturedCard key={item.title} item={item} index={i} />
          ))}
        </div>
        {hasRichText(content.AnnouncementsContent) ? (
          <div
            className={`mt-6 border-t border-slate-200/80 pt-6 text-sm dark:border-white/10 ${introRichClass}`}
          >
            <ContentSdkRichText field={content.AnnouncementsContent} />
          </div>
        ) : null}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Trending */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-violet-950/[0.03] to-white/80 p-6 shadow-lg backdrop-blur-xl lg:col-span-1 dark:border-white/[0.1] dark:from-violet-950/20 dark:to-slate-950/50">
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/25 to-fuchsia-600/20 ring-1 ring-violet-400/30">
              <Zap className="h-5 w-5 text-violet-600 dark:text-violet-400" strokeWidth={1.5} />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              <ContentSdkText field={content.TasksTitle} />
            </h2>
          </div>
          <p className="mb-3 text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
            Scroll · hover to pause
          </p>
          <div className="relative -mx-2 overflow-hidden py-1">
            <div className={`${styles.marqueeTrack} gap-2 pr-2`}>
              {trendingDup.map((label, i) => (
                <span
                  key={`${label}-${i}`}
                  className="shrink-0 rounded-full border border-slate-200/80 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-cyan-400/50 hover:text-cyan-700 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-cyan-400/40 dark:hover:text-cyan-300"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          {hasRichText(content.TasksContent) ? (
            <div
              className={`mt-4 border-t border-slate-200/80 pt-4 text-xs dark:border-white/10 ${introRichClass}`}
            >
              <ContentSdkRichText field={content.TasksContent} />
            </div>
          ) : null}
        </section>

        {/* Regions */}
        <section className="rounded-2xl border border-slate-200/90 bg-white/75 p-6 shadow-lg backdrop-blur-xl lg:col-span-2 dark:border-white/[0.1] dark:bg-slate-950/50">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 ring-1 ring-cyan-500/25">
              <Globe2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" strokeWidth={1.5} />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              <ContentSdkText field={content.QuickLinksTitle} />
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {REGIONS.map((r) => (
              <article
                key={r.title}
                className="group relative overflow-hidden rounded-xl border border-slate-200/80 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/35 hover:shadow-lg dark:border-white/[0.08] dark:hover:border-cyan-400/30"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${r.swatch} opacity-40 transition group-hover:opacity-60`}
                  aria-hidden
                />
                <MapPin
                  className="relative mb-2 h-5 w-5 text-cyan-600 dark:text-cyan-400"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <h3 className="relative text-base font-bold text-slate-900 dark:text-white">
                  {r.title}
                </h3>
                <p className="relative mt-1 text-sm text-slate-600 dark:text-slate-400">{r.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Programs:{' '}
            <span className="text-slate-600 dark:text-slate-300">Greenhouse @ Tech Studio</span>, UK
            Founder Series, Life Sciences &amp; Healthtech, Deal Flow 5.0 — plus more on{' '}
            <a
              href="https://www.orrick.com/tech-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cyan-600 underline-offset-2 hover:underline dark:text-cyan-400"
            >
              orrick.com/tech-studio
            </a>
            .
          </p>
          {hasRichText(content.QuickLinksContent) ? (
            <div
              className={`mt-5 border-t border-slate-200/80 pt-5 text-sm dark:border-white/10 ${introRichClass}`}
            >
              <ContentSdkRichText field={content.QuickLinksContent} />
            </div>
          ) : null}
        </section>
      </div>

      {/* Forms + bento row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="rounded-2xl border border-slate-200/90 bg-white/75 p-6 shadow-lg backdrop-blur-xl lg:col-span-5 dark:border-white/[0.1] dark:bg-slate-950/50">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/25 to-orange-600/20 ring-1 ring-amber-400/35">
              <FileStack className="h-5 w-5 text-amber-600 dark:text-amber-400" strokeWidth={1.5} />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              <ContentSdkText field={content.ApprovalsTitle} />
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {FORMS.map(({ title, sub, icon: Icon }) => (
              <button
                key={title}
                type="button"
                className="group flex w-full items-center gap-4 rounded-xl border border-slate-200/80 bg-gradient-to-r from-white to-slate-50/80 p-4 text-left transition hover:border-cyan-400/40 hover:shadow-md dark:border-white/[0.08] dark:from-slate-900/90 dark:to-slate-950/50 dark:hover:border-cyan-400/35"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 ring-1 ring-cyan-500/20 dark:bg-cyan-400/10 dark:text-cyan-400">
                  <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-slate-900 dark:text-white">
                    {title}
                  </span>
                  <span className="block text-sm text-slate-500 dark:text-slate-400">{sub}</span>
                </span>
                <ArrowUpRight className="ml-auto h-5 w-5 shrink-0 text-slate-400 opacity-0 transition group-hover:text-cyan-600 group-hover:opacity-100 dark:group-hover:text-cyan-400" />
              </button>
            ))}
          </div>
          {hasRichText(content.ApprovalsContent) ? (
            <div
              className={`mt-5 border-t border-slate-200/80 pt-5 text-sm dark:border-white/10 ${introRichClass}`}
            >
              <ContentSdkRichText field={content.ApprovalsContent} />
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-slate-200/90 bg-white/75 p-6 shadow-lg backdrop-blur-xl lg:col-span-7 dark:border-white/[0.1] dark:bg-slate-950/50">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500/15 to-blue-600/10 px-2.5 py-1 font-mono text-[0.65rem] font-semibold tracking-[0.2em] text-cyan-700 uppercase ring-1 ring-cyan-500/20 dark:text-cyan-300 dark:ring-cyan-400/25">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-40 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500 dark:bg-cyan-400" />
              </span>
              Live
            </span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              <ContentSdkText field={content.TodayTitle} />
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {INSIGHTS.map((card) => (
              <article
                key={card.title}
                className="group overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/50 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/[0.08] dark:bg-slate-900/40"
              >
                <div className={`h-1.5 bg-gradient-to-r ${card.stripe}`} aria-hidden />
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {card.body}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 opacity-0 transition group-hover:opacity-100 dark:text-cyan-400">
                    Read <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </article>
            ))}
          </div>
          {hasRichText(content.TodayContent) ? (
            <div
              className={`mt-5 border-t border-slate-200/80 pt-5 text-sm dark:border-white/10 ${introRichClass}`}
            >
              <ContentSdkRichText field={content.TodayContent} />
            </div>
          ) : null}
        </section>
      </div>

      {/* Videos */}
      <section className="rounded-2xl border border-slate-200/90 bg-white/75 p-6 shadow-lg backdrop-blur-xl md:p-8 dark:border-white/[0.1] dark:bg-slate-950/50">
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/25 ring-1 ring-cyan-500/25">
            <Play
              className="h-5 w-5 fill-current text-cyan-600 dark:text-cyan-400"
              strokeWidth={1.5}
            />
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            <ContentSdkText field={content.DocumentsTitle} />
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {VIDEOS.map((v) => (
            <article
              key={v.title}
              className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-950 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 dark:border-white/10"
            >
              <div className={`relative aspect-video bg-gradient-to-br ${v.tint}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white ring-2 ring-white/30 backdrop-blur-sm transition group-hover:scale-110">
                    <Play className="ml-1 h-7 w-7 fill-white" aria-hidden />
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white">{v.title}</h3>
                <p className="mt-1 text-sm text-slate-300">{v.sub}</p>
              </div>
            </article>
          ))}
        </div>
        {hasRichText(content.DocumentsContent) ? (
          <div
            className={`mt-6 border-t border-slate-200/80 pt-6 text-sm dark:border-white/10 ${introRichClass}`}
          >
            <ContentSdkRichText field={content.DocumentsContent} />
          </div>
        ) : null}
      </section>
    </>
  );
}
