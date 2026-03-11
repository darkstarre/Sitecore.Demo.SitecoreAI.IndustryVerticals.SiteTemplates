'use client';

import React, { useRef, useState } from 'react';
import { ImageField, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import Link from 'next/link';
import BlobAccent from '../../assets/shapes/BlobAccent';

interface Fields {
  Image: ImageField;
}

interface HeroBannerProps extends ComponentProps {
  fields: Fields;
}

const HERO_VIDEO_URL =
  'https://videos.pexels.com/video-files/8731414/8731414-hd_1920_1080_25fps.mp4';
const HERO_POSTER_URL =
  'https://images.pexels.com/photos/4427430/pexels-photo-4427430.jpeg?auto=compress&cs=tinysrgb&w=2400&h=1200&dpr=2';

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

export const DefaultHeroBanner = (props: HeroBannerProps) => {
  const id = props.params.RenderingIdentifier;
  const videoRef = useRef<HTMLVideoElement>(null);
  const insightsRef = useRef<HTMLUListElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.paused) {
      void video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

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
    <>
      <section className={`relative overflow-hidden ${props?.params?.styles}`} id={id || undefined}>
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            className="h-full min-h-[68vh] w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster={HERO_POSTER_URL}
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
          <div className="from-background/90 via-background/45 to-background/65 dark:from-background-dark/90 dark:via-background-dark/55 dark:to-background-dark/70 absolute inset-0 bg-gradient-to-r" />
        </div>

        <div className="relative z-10 container py-8 lg:py-12">
          <div className="max-w-4xl space-y-6 pt-8 pb-16 lg:pt-12 lg:pb-24">
            <h1 className="text-background dark:text-background-dark font-heading text-5xl leading-[0.96] tracking-[-0.02em] md:text-6xl lg:text-7xl">
              <span className="block">Innovation,</span>
              <span className="block">Sector Leadership</span>
            </h1>
            <p className="text-background/85 dark:text-background-dark/80 max-w-2xl text-lg leading-relaxed">
              Practical legal counsel for ambitious teams building, scaling, and navigating
              high-stakes decisions.
            </p>
            <button
              type="button"
              onClick={togglePlayback}
              className="border-background/70 text-background dark:border-background-dark/70 dark:text-background-dark hover:bg-background hover:text-foreground dark:hover:bg-background-dark dark:hover:text-foreground-dark rounded-full border px-5 py-2 text-sm font-semibold transition"
            >
              {isPaused ? 'Play video' : 'Pause video'}
            </button>
          </div>
        </div>
      </section>

      <section className="bg-background dark:bg-background-dark relative overflow-hidden py-14">
        <BlobAccent
          size="lg"
          className="text-[#023859]/25 dark:text-[#8ec7ff]/20 pointer-events-none absolute top-6 -right-18 z-0 md:-right-8 lg:right-0"
        />
        <div className="relative z-10 container space-y-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[#023859] dark:text-[#8ec7ff] text-xs font-semibold tracking-[0.2em] uppercase">
                Insights
              </p>
              <h2 className="mt-2 text-[#023859] dark:text-[#b9ddff]">Featured Articles</h2>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => scrollInsights('prev')}
                className="group text-[#023859] dark:text-[#8ec7ff] hover:text-[#1f3f64] dark:hover:text-[#c6e4ff] inline-flex items-center gap-2 text-3xl font-black tracking-tight transition"
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
                className="group text-[#023859] dark:text-[#8ec7ff] hover:text-[#1f3f64] dark:hover:text-[#c6e4ff] inline-flex items-center gap-2 text-3xl font-black tracking-tight transition"
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
            {INSIGHTS_ARTICLES.map((article) => (
              <li key={article.title} className="border-border/60 min-w-[290px] snap-start border-t pt-4 md:min-w-[360px]">
                <Link href={article.href} className="group block space-y-3">
                  <h3 className="font-heading text-[#023859] group-hover:text-[#1f3f64] dark:text-[#d9ecff] dark:group-hover:text-[#8ec7ff] text-2xl leading-tight transition">
                    {article.title}
                  </h3>
                  <p className="text-muted text-sm">{article.meta}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export const Default = withDatasourceCheck()<HeroBannerProps>(DefaultHeroBanner);
