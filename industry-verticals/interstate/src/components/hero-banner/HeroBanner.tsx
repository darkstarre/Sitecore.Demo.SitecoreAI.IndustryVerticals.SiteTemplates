import { Field, LinkField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { CommonStyles, HeroBannerStyles } from '@/types/styleFlags';
import HeroBannerCopyBlock from './HeroBannerCopyBlock';
import { Default as LocationFinder } from '@/components/location-finder/LocationFinder';

interface Fields {
  Image: { value?: { alt?: string } };
  Video: { value?: { src?: string } };
  Title: Field<string>;
  Description: Field<string>;
  CtaLink: LinkField;
}

interface HeroBannerProps extends ComponentProps {
  fields: Fields;
}

const HERO_TITLE = 'Outrageously Dependable Power';
const HERO_SUBCOPY =
  'Find dependable power for every drive, job, and adventure with trusted batteries and local expert support.';
const HERO_IMAGE_URL =
  'https://www.interstatebatteries.com/-/media/project/interstate-batteries/final-images/landing-pages/mrdependable-pphero-interstate-batteries-desktop.png?w=1440&hash=7A14B3D0879211A20E4636DF0524C7FC';

const HeroBannerCommon = ({ params, fields }: HeroBannerProps) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const isPageEditing = page.mode.isEditing;

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
    <div
      className={`component hero-banner ${styles} relative h-[340px] overflow-hidden md:h-[460px] lg:h-[580px]`}
      id={id}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE_URL}
          alt={fields.Image?.value?.alt || 'Interstate Batteries hero image'}
          className="h-full w-full bg-[#16361f] object-contain object-center"
        />
      </div>
    </div>
  );
};

export const Default = ({ params, fields, rendering }: HeroBannerProps) => {
  const styles = params.styles || '';
  const hideAccentLine = styles.includes(CommonStyles.HideAccentLine);
  const withPlaceholder = styles.includes(HeroBannerStyles.WithPlaceholder);
  const searchBarPlaceholderKey = `hero-banner-search-bar-${params.DynamicPlaceholderId}`;

  return (
    <>
      <HeroBannerCommon params={params} fields={fields} rendering={rendering} />
      <HeroBannerCopyBlock
        title={HERO_TITLE}
        subcopy={HERO_SUBCOPY}
        ctaLink={fields.CtaLink}
        withPlaceholder={withPlaceholder}
        searchBarPlaceholderKey={searchBarPlaceholderKey}
        rendering={rendering}
        hideAccentLine={hideAccentLine}
      />
      <LocationFinder
        params={{
          styles: '',
          RenderingIdentifier: `${params.DynamicPlaceholderId}-hero-location-finder`,
        }}
      />
    </>
  );
};

export const TopContent = ({ params, fields, rendering }: HeroBannerProps) => {
  const styles = params.styles || '';
  const hideAccentLine = styles.includes(CommonStyles.HideAccentLine);
  const withPlaceholder = styles.includes(HeroBannerStyles.WithPlaceholder);
  const searchBarPlaceholderKey = `hero-banner-search-bar-${params.DynamicPlaceholderId}`;

  return (
    <>
      <HeroBannerCommon params={params} fields={fields} rendering={rendering} />
      <HeroBannerCopyBlock
        title={HERO_TITLE}
        subcopy={HERO_SUBCOPY}
        ctaLink={fields.CtaLink}
        withPlaceholder={withPlaceholder}
        searchBarPlaceholderKey={searchBarPlaceholderKey}
        rendering={rendering}
        hideAccentLine={hideAccentLine}
      />
      <LocationFinder
        params={{
          styles: '',
          RenderingIdentifier: `${params.DynamicPlaceholderId}-hero-location-finder`,
        }}
      />
    </>
  );
};
