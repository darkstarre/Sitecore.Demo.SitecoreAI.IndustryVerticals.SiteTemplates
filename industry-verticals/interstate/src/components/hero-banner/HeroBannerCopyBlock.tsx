import React from 'react';
import { Link, LinkField, Placeholder } from '@sitecore-content-sdk/nextjs';
import AccentLine from '@/assets/icons/accent-line/AccentLine';

interface HeroBannerCopyBlockProps {
  title: string;
  subcopy: string;
  ctaLink: LinkField;
  withPlaceholder: boolean;
  searchBarPlaceholderKey: string;
  rendering: unknown;
  hideAccentLine: boolean;
}

const HeroBannerCopyBlock = ({
  title,
  subcopy,
  ctaLink,
  withPlaceholder,
  searchBarPlaceholderKey,
  rendering,
  hideAccentLine,
}: HeroBannerCopyBlockProps) => {
  const headingAlignClass = '!text-center';
  const ctaAlignClass = 'justify-center';
  const wrapperClass = 'mx-auto flex w-full max-w-4xl flex-col items-center';
  const accentLineClass = 'mx-auto !mt-2 !h-5 w-[9ch]';

  return (
    <section className="hero-banner-copy w-full bg-background py-10 lg:py-14">
      <div className="container mx-auto flex justify-center px-4">
        <div className={wrapperClass} style={{ textAlign: 'center' }}>
          <h1
            className={`${headingAlignClass} text-4xl leading-[110%] font-extrabold text-[#0d2f5f] capitalize md:text-6xl xl:text-7xl`}
          >
            {title}
            {!hideAccentLine && <AccentLine className={accentLineClass} />}
          </h1>

          <div className={`mt-5 text-lg text-foreground md:text-2xl ${headingAlignClass}`}>
            <p>{subcopy}</p>
          </div>

          <div className={`mt-8 flex w-full ${ctaAlignClass}`}>
            {withPlaceholder ? (
              <Placeholder name={searchBarPlaceholderKey} rendering={rendering} />
            ) : (
              <Link field={ctaLink} className="main-btn !w-auto !px-6 !py-3 !text-base" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBannerCopyBlock;
