import {
  Field,
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
  useSitecore,
  Link,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

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

const HERO_TITLE = 'Engineered Circuit Protection for a Connected World';
const HERO_SUBCOPY =
  'Discover high-reliability components and smart protection solutions that help automotive, industrial, and electronics systems run safer and longer.';

export const Default = ({ params, fields }: HeroBannerProps) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const isPageEditing = page.mode.isEditing;

  const hasMedia = fields?.Video?.value?.src || fields?.Image?.value?.src;

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
      <div className="absolute inset-0 z-1">
        {!isPageEditing && fields?.Video?.value?.src ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={fields.Image?.value?.src}
          >
            <source src={fields.Video?.value?.src} type="video/webm" />
          </video>
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
          {HERO_TITLE}
        </h1>

        {/* Description/Tagline - white text */}
        <div className="**:text-background mt-4 max-w-2xl text-xl **:text-center">
          <p>{HERO_SUBCOPY}</p>
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
