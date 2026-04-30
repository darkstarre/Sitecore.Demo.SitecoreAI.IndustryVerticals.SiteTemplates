import {
  Field,
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  useSitecore,
  Placeholder,
  Link,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import AccentLine from '@/assets/icons/accent-line/AccentLine';
import { CommonStyles, HeroBannerStyles, LayoutStyles } from '@/types/styleFlags';
import clsx from 'clsx';

interface Fields {
  Image: ImageField;
  Video: ImageField;
  Title: Field<string>;
  Description: Field<string>;
  CtaLink: LinkField;
}

interface HeroBannerProps extends ComponentProps {
  fields: Fields;
}

const FALLBACK_HERO_IMAGE: ImageField = {
  value: {
    src: '/hussmann-refresh/image-10.png',
    alt: 'Hussmann refrigeration systems',
  },
};

const shouldUseFallbackImage = (src?: string) =>
  !src || src.includes('starter-verticals-v2.sitecoresandbox.cloud');

const HeroBannerCommon = ({
  params,
  fields,
  children,
}: HeroBannerProps & {
  children: React.ReactNode;
}) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const isPageEditing = page.mode.isEditing;
  const hideGradientOverlay = styles?.includes(HeroBannerStyles.HideGradientOverlay);
  const useFallbackImage = shouldUseFallbackImage(fields?.Image?.value?.src);
  const imageField = useFallbackImage ? FALLBACK_HERO_IMAGE : fields.Image;

  if (!fields) {
    return isPageEditing ? (
      <div className={`component hero-banner ${styles}`} id={id}>
        [HERO BANNER]
      </div>
    ) : (
      <></>
    );
  }

  return (
    <div className={`component hero-banner ${styles} relative flex items-center`} id={id}>
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {!isPageEditing && fields?.Video?.value?.src ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={imageField?.value?.src}
          >
            <source src={fields.Video?.value?.src} type="video/webm" />
          </video>
        ) : (
          <>
            {useFallbackImage ? (
              <img
                src={imageField?.value?.src || FALLBACK_HERO_IMAGE.value?.src || ''}
                alt={imageField?.value?.alt || 'Hussmann refrigeration systems'}
                className="h-full w-full object-cover object-center md:object-bottom"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <ContentSdkImage
                field={imageField}
                className="h-full w-full object-cover md:object-bottom"
                priority
              />
            )}
          </>
        )}
        {/* Gradient overlay to fade image/video at bottom */}
        {!hideGradientOverlay && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% via-black/20 to-black/55" />
        )}
      </div>

      {children}
    </div>
  );
};

export const Default = ({ params, fields, rendering }: HeroBannerProps) => {
  const styles = params.styles || '';
  const hideAccentLine = styles.includes(CommonStyles.HideAccentLine);
  const withPlaceholder = styles.includes(HeroBannerStyles.WithPlaceholder);
  const reverseLayout = styles.includes(LayoutStyles.Reversed);
  const screenLayer = styles.includes(HeroBannerStyles.ScreenLayer);
  const searchBarPlaceholderKey = `hero-banner-search-bar-${params.DynamicPlaceholderId}`;

  return (
    <HeroBannerCommon params={params} fields={fields} rendering={rendering}>
      {/* Content Container */}
      <div className="relative w-full">
        <div className="container mx-auto px-4">
          <div
            className={`flex min-h-238 w-full py-10 lg:w-1/2 lg:items-center ${reverseLayout ? 'lg:mr-auto' : 'lg:ml-auto'}`}
          >
            <div className="max-w-182">
              <div className={clsx({ shim: screenLayer })}>
                {/* Title — light text for dark hero imagery */}
                <h1 className="text-center text-5xl leading-[110%] font-bold capitalize text-white md:text-7xl md:leading-[130%] lg:text-left xl:text-[80px]">
                  <ContentSdkText field={fields.Title} />
                  {!hideAccentLine && (
                    <AccentLine className="mx-auto !h-5 w-[9ch] text-white lg:mx-0" />
                  )}
                </h1>

                {/* Description */}
                <div className="mt-7 text-xl text-white/90 md:text-2xl [&_a]:text-white [&_a]:underline [&_strong]:text-white">
                  <ContentSdkRichText
                    field={fields.Description}
                    className="text-center text-white/90 lg:text-left [&_p]:text-white/90"
                  />
                </div>

                {/* CTA Link or Placeholder */}
                <div className="mt-6 flex w-full justify-center lg:justify-start">
                  {withPlaceholder ? (
                    <Placeholder name={searchBarPlaceholderKey} rendering={rendering} />
                  ) : (
                    <Link field={fields.CtaLink} className="arrow-btn hero-banner__cta--light" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroBannerCommon>
  );
};

export const TopContent = ({ params, fields, rendering }: HeroBannerProps) => {
  const styles = params.styles || '';
  const hideAccentLine = styles.includes(CommonStyles.HideAccentLine);
  const withPlaceholder = styles.includes(HeroBannerStyles.WithPlaceholder);
  const reverseLayout = styles.includes(LayoutStyles.Reversed);
  const screenLayer = styles.includes(HeroBannerStyles.ScreenLayer);
  const searchBarPlaceholderKey = `hero-banner-search-bar-${params.DynamicPlaceholderId}`;

  return (
    <HeroBannerCommon params={params} fields={fields} rendering={rendering}>
      {/* Content Container */}
      <div className="relative w-full">
        <div className="container mx-auto flex min-h-238 justify-center px-4">
          <div
            className={`flex flex-col items-center py-10 lg:py-44 ${reverseLayout ? 'justify-end' : 'justify-start'}`}
          >
            <div className={clsx({ shim: screenLayer })}>
              {/* Title — light text for dark hero imagery */}
              <h1 className="text-center text-5xl leading-[110%] font-bold capitalize text-white md:text-7xl md:leading-[130%] xl:text-[80px]">
                <ContentSdkText field={fields.Title} />
                {!hideAccentLine && <AccentLine className="mx-auto !h-5 w-[9ch] text-white" />}
              </h1>

              {/* Description */}
              <div className="mt-7 text-xl text-white/90 md:text-2xl [&_a]:text-white [&_a]:underline [&_strong]:text-white">
                <ContentSdkRichText
                  field={fields.Description}
                  className="text-center text-white/90 [&_p]:text-white/90"
                />
              </div>

              {/* CTA Link or Placeholder */}
              <div className="mt-6 flex w-full justify-center">
                {withPlaceholder ? (
                  <Placeholder name={searchBarPlaceholderKey} rendering={rendering} />
                ) : (
                  <Link field={fields.CtaLink} className="arrow-btn hero-banner__cta--light" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroBannerCommon>
  );
};
