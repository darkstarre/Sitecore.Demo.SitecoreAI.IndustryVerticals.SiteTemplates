'use client';

import React, { useRef, useState } from 'react';
import { ImageField, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { InlineFeaturedArticles } from '../featured-articles/FeaturedArticles';

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

export const DefaultHeroBanner = (props: HeroBannerProps) => {
  const id = props.params.RenderingIdentifier;
  const videoRef = useRef<HTMLVideoElement>(null);
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
      <InlineFeaturedArticles />
    </>
  );
};

export const Default = withDatasourceCheck()<HeroBannerProps>(DefaultHeroBanner);
