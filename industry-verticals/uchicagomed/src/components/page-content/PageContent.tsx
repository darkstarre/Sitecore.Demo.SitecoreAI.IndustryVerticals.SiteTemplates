import React, { JSX } from 'react';
import Link from 'next/link';
import {
  RichText as ContentSdkRichText,
  useSitecore,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Content: RichTextField;
}

type PageContentProps = ComponentProps & {
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

export const Default = ({ params, fields }: PageContentProps): JSX.Element => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;

  const field = fields?.Content ?? (page.layout.sitecore.route?.fields?.Content as RichTextField);
  const routeName = page.layout.sitecore.route?.name || '';
  const isLocationsLanding = routeName.toLowerCase() === 'locations';

  return (
    <div className={`component content ${styles}`} id={id}>
      <div className="component-content">
        <div className="field-content ck-content">
          {field ? <ContentSdkRichText field={field} /> : '[Content]'}
        </div>
        {isLocationsLanding && (
          <section className="border-border mt-10 border-t pt-8">
            <h3 className="mb-4">Find a Location</h3>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="grid gap-4">
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
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
