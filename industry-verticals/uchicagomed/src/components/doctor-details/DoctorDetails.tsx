import React from 'react';
import {
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  NextImage as ContentSdkImage,
  ImageField,
  Field,
  RichTextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

export interface DoctorFields {
  Title: Field<string>;
  FullName: Field<string>;
  JobTitle: Field<string>;
  Photo: ImageField;
  Bio: RichTextField;
  OfficeLocation?: Field<string>;
  PhoneNumber?: Field<string>;
  Address?: RichTextField;
}

interface DoctorDetailsProps extends ComponentProps {
  fields: DoctorFields;
}

export const Default = (props: DoctorDetailsProps) => {
  const { page } = useSitecore();

  const id = props.params.RenderingIdentifier;
  const styles = `${props?.params?.styles || ''}`.trim();
  const isPageEditing = page.mode.isEditing;
  const officeLocation = props.fields?.OfficeLocation?.value?.toString() || '';
  const phoneNumber = props.fields?.PhoneNumber?.value?.toString() || '';
  const hasAddress = Boolean(props.fields?.Address?.value);
  const hasLocationInfo = Boolean(officeLocation || phoneNumber || hasAddress);

  if (!props.fields?.Title) {
    return isPageEditing ? (
      <div className={`component article-listing py-6 ${styles}`} id={id}>
        [Doctor Details]
      </div>
    ) : (
      <></>
    );
  }

  return (
    <section className={`relative py-16 ${styles}`} id={id || undefined}>
      <div className="container grid gap-8 lg:grid-cols-3">
        <div className="placeholder-pattern-background shadow-soft relative aspect-square overflow-hidden rounded-lg">
          <ContentSdkImage field={props.fields?.Photo} className="h-full w-full object-cover" />
        </div>
        <div className="lg:col-span-2 xl:p-8">
          <h1 className="mb-3">
            <ContentSdkText field={props.fields?.FullName} />
          </h1>
          <h5 className="text-accent mb-8">
            <ContentSdkText field={props.fields?.JobTitle} />
          </h5>
          <div className="text-lg">
            <ContentSdkRichText field={props.fields?.Bio} />
          </div>

          {(hasLocationInfo || isPageEditing) && (
            <div className="border-border mt-10 border-t pt-8">
              <h4 className="mb-6">Locations</h4>
              {hasLocationInfo ? (
                <article className="border-border bg-background-secondary border p-5">
                  {officeLocation && <h6 className="mb-2">{officeLocation}</h6>}
                  {hasAddress && (
                    <div className="text-base">
                      <ContentSdkRichText field={props.fields?.Address} />
                    </div>
                  )}
                  {phoneNumber && <p className="mt-2 font-semibold">Phone: {phoneNumber}</p>}
                </article>
              ) : (
                <p>Add location information for this physician.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
