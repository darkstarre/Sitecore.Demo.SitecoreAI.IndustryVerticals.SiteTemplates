import {
  Field,
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  useSitecore,
  Link,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/** Same looping Vimeo hero as https://vistracorp.com/ (data-vimeo-video-id="441098050"). Override via NEXT_PUBLIC_VISTRA_HERO_VIMEO_ID. */
const DEFAULT_VISTRA_HERO_VIMEO_ID = '441098050';

function getVimeoHeroVideoId(): string | undefined {
  const fromEnv = process.env.NEXT_PUBLIC_VISTRA_HERO_VIMEO_ID?.trim();
  if (fromEnv === '0' || fromEnv?.toLowerCase() === 'false') {
    return undefined;
  }
  return fromEnv || DEFAULT_VISTRA_HERO_VIMEO_ID;
}

function vimeoBackgroundSrc(videoId: string): string {
  const params = new URLSearchParams({
    background: '1',
    autoplay: '1',
    loop: '1',
    muted: '1',
    playsinline: '1',
    controls: '0',
    dnt: '1',
    title: '0',
    byline: '0',
    portrait: '0',
  });
  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}

/** When true, Sitecore Video field wins over Vimeo. Default false so Vimeo replaces legacy CMS video/image on live pages. */
function preferCmsHeroVideo(): boolean {
  const v = process.env.NEXT_PUBLIC_VISTRA_HERO_PREFER_CMS_VIDEO?.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

interface Fields {
  Image: ImageField;
  Video: ImageField;
  Title: Field<string>;
  Description: Field<string>;
  CtaLink: LinkField;
  SecondaryCtaLink: LinkField;
}

interface HeroBannerProps extends ComponentProps {
  fields: Fields;
}

export const Default = ({ params, fields }: HeroBannerProps) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const isPageEditing = page.mode.isEditing;

  const vimeoHeroId = getVimeoHeroVideoId();
  const cmsVideoSrc = fields?.Video?.value?.src;
  const useCmsVideo =
    !isPageEditing && Boolean(cmsVideoSrc) && preferCmsHeroVideo();
  const useVimeo = !isPageEditing && Boolean(vimeoHeroId) && !useCmsVideo;

  const hasMedia =
    Boolean(cmsVideoSrc) || Boolean(fields?.Image?.value?.src) || Boolean(vimeoHeroId);

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
    <div className={`component hero-banner relative flex items-center py-24 ${styles}`} id={id}>
      {/* Background Media */}
      <div className="absolute inset-0 z-1 overflow-hidden">
        {useCmsVideo ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={fields.Image?.value?.src}
          >
            <source src={cmsVideoSrc} type="video/webm" />
          </video>
        ) : useVimeo ? (
          <iframe
            title="Hero background video"
            className="pointer-events-none absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[100vw] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 border-0"
            src={vimeoBackgroundSrc(vimeoHeroId!)}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <ContentSdkImage field={fields.Image} className="h-full w-full object-cover" priority />
        )}
      </div>
      {/* Gradient Overlay using primary color */}
      <div className="from-accent-dark to-accent absolute inset-0 z-0 bg-linear-to-r"></div>

      {/* Content Container */}
      <div className="relative z-3 container mx-auto flex flex-col items-center justify-center">
        {/* Title - styled in accent/primary color */}
        <h1 className={`${hasMedia ? 'text-accent' : 'text-background'} text-center`}>
          <ContentSdkText field={fields.Title} />
        </h1>

        {/* Description/Tagline - white text */}
        <div className="**:text-background mt-4 max-w-2xl text-xl **:text-center">
          <ContentSdkRichText field={fields.Description} />
        </div>

        {/* CTA Buttons */}
        {(fields?.CtaLink || fields?.SecondaryCtaLink) && (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {fields?.CtaLink && <Link field={fields.CtaLink} className="main-btn" />}
            {fields?.SecondaryCtaLink && (
              <Link field={fields.SecondaryCtaLink} className="secondary-btn" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
