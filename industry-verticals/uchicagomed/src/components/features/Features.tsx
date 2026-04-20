'use client';

import { IGQLImageField, IGQLRichTextField, IGQLTextField } from 'src/types/igql';
import Link from 'next/link';
import {
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  NextImage as ContentSdkImage,
  withDatasourceCheck,
  ComponentRendering,
  ComponentParams,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { FeatureStyles } from '@/types/styleFlags';

interface Fields {
  data: {
    datasource: {
      children: {
        results: FeatureFields[];
      };
      title: IGQLTextField;
      description: IGQLRichTextField;
    };
  };
}

interface FeatureFields {
  id: string;
  featureTitle: IGQLTextField;
  featureDescription: IGQLTextField;
  featureImage: IGQLImageField;
  featureImageDark: IGQLImageField;
}

type FeaturesProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

type LocationSummary = {
  name: string;
  href: string;
  addressLine1: string;
  cityStateZip: string;
  phone: string;
  mapQuery: string;
};

const LOCATION_SUMMARIES: LocationSummary[] = [
  {
    name: 'Hyde Park Campus',
    href: '/Locations/Hyde-Park-Campus',
    addressLine1: '5841 S Maryland Ave',
    cityStateZip: 'Chicago, IL 60637',
    phone: '(773) 702-1000',
    mapQuery: '5841 S Maryland Ave Chicago IL 60637',
  },
  {
    name: 'River East Center',
    href: '/Locations/River-East-Center',
    addressLine1: '355 E Grand Ave',
    cityStateZip: 'Chicago, IL 60611',
    phone: '(773) 702-1000',
    mapQuery: '355 E Grand Ave Chicago IL 60611',
  },
  {
    name: 'Oak Lawn Center',
    href: '/Locations/Oak-Lawn-Center',
    addressLine1: '6700 W 95th St',
    cityStateZip: 'Oak Lawn, IL 60453',
    phone: '(773) 702-1000',
    mapQuery: '6700 W 95th St Oak Lawn IL 60453',
  },
];

const FeatureItem = ({
  feature,
  useAccentColor,
  layout = 'vertical',
}: {
  feature: FeatureFields;
  useAccentColor: boolean;
  layout: 'vertical' | 'horizontal';
}) => {
  const borderStyles = `border ${
    useAccentColor ? 'border-accent/30' : 'border-border dark:border-border-dark'
  }`;

  return (
    <li
      key={feature?.id}
      className={`bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg ${borderStyles} ${
        layout === 'horizontal'
          ? 'flex flex-col gap-5 lg:flex-row lg:items-center'
          : 'flex flex-col gap-5'
      }`}
    >
      <div
        className={`flex h-18 w-18 shrink-0 items-center justify-center p-3 lg:h-20 lg:w-20 ${borderStyles}`}
      >
        <ContentSdkImage
          field={feature?.featureImage?.jsonValue}
          className={`h-full w-full object-contain ${!useAccentColor ? 'dark:hidden' : ''}`}
        />
        {!useAccentColor && (
          <ContentSdkImage
            field={feature?.featureImageDark?.jsonValue}
            className="hidden h-full w-full object-contain dark:block"
          />
        )}
      </div>
      <div>
        <h5 className="mb-2">
          <ContentSdkText field={feature?.featureTitle?.jsonValue} />
        </h5>
        <p className="text-base">
          <ContentSdkText field={feature?.featureDescription?.jsonValue} />
        </p>
      </div>
    </li>
  );
};

const DefaultFeatures = ({ fields, params }: FeaturesProps) => {
  const { page } = useSitecore();
  const id = params?.RenderingIdentifier;
  const features = fields?.data?.datasource?.children?.results;
  const useAccentColor = params?.styles.includes(FeatureStyles.UseAccentColor);
  const routeName = page.layout.sitecore.route?.name || '';
  const isLocationsLanding = routeName.toLowerCase() === 'locations';

  return (
    <section
      className={`border-border relative border-t py-14 lg:py-16 ${params?.styles}`}
      id={id || undefined}
    >
      <div className="relative z-10 container">
        <div className="border-accent max-w-4xl border-l-4 pl-5">
          <h2>
            <ContentSdkText field={fields?.data?.datasource?.title?.jsonValue} />
          </h2>
          <ContentSdkRichText
            className="text-base lg:text-lg"
            field={fields?.data?.datasource?.description?.jsonValue}
          />
        </div>
        {isLocationsLanding ? (
          <div className="mt-10 space-y-6 lg:mt-12">
            <div className="space-y-4">
              <div className="border-border bg-background-secondary overflow-hidden border">
                <iframe
                  title="UChicago Medicine locations map"
                  src="https://www.google.com/maps?q=UChicago+Medicine+Chicago&output=embed"
                  className="h-[360px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="border-border bg-background-secondary border p-4 text-sm">
                If the embedded map is blank in preview, use the &quot;Open in Google Maps&quot;
                links for each location.
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {LOCATION_SUMMARIES.map((location) => (
                <article
                  key={location.name}
                  className="border-border bg-background-secondary border p-5"
                >
                  <h6 className="mb-2">{location.name}</h6>
                  <p>{location.addressLine1}</p>
                  <p>{location.cityStateZip}</p>
                  <p className="mt-2 font-semibold">{location.phone}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent mt-3 inline-block font-semibold"
                  >
                    Open in Google Maps
                  </a>
                  <span className="text-border mx-2">|</span>
                  <Link
                    href={location.href}
                    className="text-accent mt-3 inline-block font-semibold"
                  >
                    View location details
                  </Link>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <ul className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-3">
            {features?.map((feature) => (
              <FeatureItem
                key={feature.id}
                feature={feature}
                useAccentColor={useAccentColor}
                layout="vertical"
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

const SimpleFeatures = ({ fields, params }: FeaturesProps) => {
  const id = params?.RenderingIdentifier;
  const features = fields?.data?.datasource?.children?.results;
  const useAccentColor = params?.styles.includes(FeatureStyles.UseAccentColor);

  return (
    <div className={`relative ${params?.styles}`} id={id || undefined}>
      <ul className="grid gap-4">
        {features?.map((feature) => (
          <FeatureItem
            key={feature.id}
            feature={feature}
            useAccentColor={useAccentColor}
            layout="horizontal"
          />
        ))}
      </ul>
    </div>
  );
};

export const Default = withDatasourceCheck()<FeaturesProps>(DefaultFeatures);
export const Simple = withDatasourceCheck()<FeaturesProps>(SimpleFeatures);
