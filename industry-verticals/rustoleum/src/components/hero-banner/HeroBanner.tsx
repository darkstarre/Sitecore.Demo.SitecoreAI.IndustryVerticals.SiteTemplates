import {
  Field,
  ImageField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Image: ImageField;
  Video: ImageField;
  Title: Field<string>;
  Description: Field<string>;
}

interface HeroBannerProps extends ComponentProps {
  fields: Fields;
}

/** Default looping technology video when no video is configured in Sitecore */
const DEFAULT_HERO_VIDEO =
  'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-computer-screen-with-programming-code-2467.mp4';

const HeroBannerCommon = ({
  params,
  fields,
  children,
  topContent,
}: HeroBannerProps & { children: React.ReactNode; topContent?: boolean }) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const isPageEditing = page.mode.isEditing;
  const hideGradientOverlay = styles?.includes('hide-gradient-overlay');

  if (!fields) {
    return isPageEditing ? (
      <div className={`component hero-banner min-h-screen ${styles}`} id={id}>
        [HERO BANNER]
      </div>
    ) : (
      <></>
    );
  }

  return (
    <section
      className={`component hero-banner ${styles} relative flex min-h-screen flex-col items-center py-10`}
      id={id}
    >
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {!isPageEditing ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={fields.Image?.value?.src}
          >
            <source
              src={fields?.Video?.value?.src || DEFAULT_HERO_VIDEO}
              type={
                (fields?.Video?.value?.src || '').endsWith('.webm') ? 'video/webm' : 'video/mp4'
              }
            />
          </video>
        ) : (
          <ContentSdkImage
            field={fields.Image}
            className="h-full w-full object-cover md:object-bottom"
            priority
          />
        )}
        {/* Gradient overlay */}
        {hideGradientOverlay && (
          <div
            className={`to-foreground/80 absolute inset-0 ${topContent ? 'bg-gradient-to-t' : 'bg-gradient-to-b'} from-transparent from-40%`}
          ></div>
        )}
      </div>

      {children}
    </section>
  );
};

/* ------------------- Default (bottom-left) ------------------- */
export const Default = ({ params, fields, rendering }: HeroBannerProps) => {
  const styles = params.styles || '';
  const reverseLayout = styles.includes('reversed');

  return (
    <HeroBannerCommon params={params} fields={fields} rendering={rendering}>
      <div className="relative flex h-full w-full flex-grow items-end">
        <div className="container mx-auto flex h-full items-end px-4 py-6">
          <div
            className={`flex w-full ${
              reverseLayout ? 'justify-end text-right' : 'justify-start text-left'
            }`}
          >
            <div>
              <h1 className="font-heading text-on-dark text-4xl tracking-tight capitalize drop-shadow-lg lg:text-7xl">
                <ContentSdkText field={fields.Title} />
              </h1>

              <div className="text-on-dark-muted text-md [&_*]:text-on-dark-muted drop-shadow-md lg:text-xl">
                <ContentSdkRichText field={fields.Description} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroBannerCommon>
  );
};

/* ------------------- TopContent (top-right) ------------------- */
export const TopContent = ({ params, fields, rendering }: HeroBannerProps) => {
  const styles = params.styles || '';
  const reverseLayout = styles.includes('reversed');

  return (
    <HeroBannerCommon params={params} fields={fields} rendering={rendering} topContent>
      <div className="relative flex h-full w-full flex-grow items-start">
        <div className="container mx-auto flex h-full items-start">
          <div
            className={`flex w-full ${
              reverseLayout ? 'justify-start text-left' : 'justify-end text-right'
            }`}
          >
            <div className="">
              <h1 className="font-heading text-on-dark text-4xl tracking-tight capitalize drop-shadow-lg lg:text-7xl">
                <ContentSdkText field={fields.Title} />
              </h1>

              <div className="text-on-dark-muted text-md [&_*]:text-on-dark-muted drop-shadow-md lg:text-xl">
                <ContentSdkRichText field={fields.Description} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroBannerCommon>
  );
};
