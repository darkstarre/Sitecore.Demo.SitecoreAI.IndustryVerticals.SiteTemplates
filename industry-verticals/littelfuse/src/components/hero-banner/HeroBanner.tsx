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

/** Fixed Littelfuse hero art (electronics / circuit board) — always used for normal/preview delivery. */
const LITTELFUSE_HERO_IMAGE: ImageField = {
  value: {
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1280&fit=crop&q=85&auto=format',
    width: 1920,
    height: 1280,
    alt: 'Electronic components and circuit technology',
  },
};

function isLittelfuseSite(siteName?: string): boolean {
  const envSite = (process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME ?? '').toLowerCase();
  return envSite.includes('littelfuse') || (siteName ?? '').toLowerCase().includes('littelfuse');
}

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

  if (!fields) {
    return isPageEditing ? (
      <div className={`component hero-banner ${styles}`} id={id}>
        [HERO BANNER]
      </div>
    ) : (
      <></>
    );
  }

  const useFixedLittelfuseHero = !isPageEditing && isLittelfuseSite(page.siteName);
  const heroImageField: ImageField = useFixedLittelfuseHero
    ? {
        ...fields.Image,
        value: {
          ...LITTELFUSE_HERO_IMAGE.value,
          alt: fields.Image?.value?.alt || LITTELFUSE_HERO_IMAGE.value.alt,
        },
      }
    : fields.Image;
  const useBackgroundVideo =
    !isPageEditing && !!fields.Video?.value?.src && !useFixedLittelfuseHero;

  return (
    <div className={`component hero-banner ${styles} relative flex items-center`} id={id}>
      <div className="absolute inset-0 z-0">
        {useBackgroundVideo ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={heroImageField?.value?.src}
          >
            <source src={fields.Video?.value?.src} type="video/webm" />
          </video>
        ) : (
          <>
            <ContentSdkImage
              field={heroImageField}
              className="h-full w-full object-cover md:object-bottom"
              priority
            />
          </>
        )}
        {!hideGradientOverlay && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-85% to-white"></div>
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
      <div className="relative w-full">
        <div className="container mx-auto px-4">
          <div
            className={`flex min-h-[30rem] w-full py-10 lg:min-h-[34rem] lg:w-1/2 lg:items-center ${reverseLayout ? 'lg:mr-auto' : 'lg:ml-auto'}`}
          >
            <div className="max-w-182">
              <div className={clsx({ shim: screenLayer })}>
                <h1 className="text-center text-5xl leading-[110%] font-bold text-white capitalize md:text-7xl md:leading-[130%] lg:text-left xl:text-[80px]">
                  <ContentSdkText field={fields.Title} />
                  {!hideAccentLine && <AccentLine className="mx-auto !h-5 w-[9ch] lg:mx-0" />}
                </h1>

                <div className="mt-7 text-xl text-white md:text-2xl [&_*]:text-white">
                  <ContentSdkRichText
                    field={fields.Description}
                    className="text-center lg:text-left"
                  />
                </div>

                <div className="mt-6 flex w-full justify-center lg:justify-start">
                  {withPlaceholder ? (
                    <Placeholder name={searchBarPlaceholderKey} rendering={rendering} />
                  ) : (
                    <Link field={fields.CtaLink} className="arrow-btn" />
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
      <div className="relative w-full">
        <div className="container mx-auto flex min-h-[30rem] justify-center px-4 lg:min-h-[34rem]">
          <div
            className={`flex flex-col items-center py-10 lg:py-28 ${reverseLayout ? 'justify-end' : 'justify-start'}`}
          >
            <div className={clsx({ shim: screenLayer })}>
              <h1 className="text-center text-5xl leading-[110%] font-bold text-white capitalize md:text-7xl md:leading-[130%] xl:text-[80px]">
                <ContentSdkText field={fields.Title} />
                {!hideAccentLine && <AccentLine className="mx-auto !h-5 w-[9ch]" />}
              </h1>

              <div className="mt-7 text-xl text-white md:text-2xl [&_*]:text-white">
                <ContentSdkRichText field={fields.Description} className="text-center" />
              </div>

              <div className="mt-6 flex w-full justify-center">
                {withPlaceholder ? (
                  <Placeholder name={searchBarPlaceholderKey} rendering={rendering} />
                ) : (
                  <Link field={fields.CtaLink} className="arrow-btn" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroBannerCommon>
  );
};
