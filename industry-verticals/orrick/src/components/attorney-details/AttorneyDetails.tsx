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

export interface AttorneyFields {
  Title?: Field<string>;
  FullName?: Field<string>;
  JobTitle?: Field<string>;
  OfficeLocation?: Field<string>;
  PhoneNumber?: Field<string>;
  Email?: Field<string>;
  Address?: RichTextField;
  Photo?: ImageField;
  Bio?: RichTextField;
  Engagements?: RichTextField;
  Insights?: RichTextField;
  Events?: RichTextField;
  Practices?: RichTextField;
  AdmittedIn?: RichTextField;
  CourtAdmissions?: RichTextField;
  Education?: RichTextField;
  Honors?: RichTextField;
}

interface AttorneyDetailsProps extends ComponentProps {
  fields: AttorneyFields;
}

const hasFieldTextValue = (field?: Field<string>): boolean => {
  const value = field?.value;
  return value !== undefined && value !== null && String(value).trim().length > 0;
};

const hasRichTextValue = (field?: RichTextField): boolean => {
  const value = field?.value;
  return value !== undefined && value !== null && String(value).trim().length > 0;
};

const DetailSection = ({
  title,
  field,
  isPageEditing,
}: {
  title: string;
  field?: RichTextField;
  isPageEditing: boolean;
}) => (
  <section className="space-y-3">
    <h3 className="text-xl font-semibold">{title}</h3>
    {hasRichTextValue(field) ? (
      <ContentSdkRichText field={field} />
    ) : (
      <p
        className={`text-base ${
          isPageEditing ? 'text-foreground/80 dark:text-foreground-dark/80' : 'text-muted'
        }`}
      >
        {isPageEditing ? `[${title} content]` : 'Content coming soon.'}
      </p>
    )}
  </section>
);

export const Default = (props: AttorneyDetailsProps) => {
  const { page } = useSitecore();

  const id = props.params.RenderingIdentifier;
  const styles = `${props?.params?.styles || ''}`.trim();
  const isPageEditing = page.mode.isEditing;

  if (!props.fields?.Title) {
    return isPageEditing ? (
      <div className={`component article-listing py-6 ${styles}`} id={id}>
        [Attorney Details]
      </div>
    ) : (
      <></>
    );
  }

  return (
    <section className={`relative py-16 ${styles}`} id={id || undefined}>
      <div className="container space-y-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="placeholder-pattern-background shadow-soft relative aspect-square overflow-hidden rounded-lg">
              <ContentSdkImage field={props.fields?.Photo} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="space-y-6 lg:col-span-5 lg:pt-2">
            <h1 className="mb-2">
              <ContentSdkText field={props.fields?.FullName} />
            </h1>
            <h5 className="text-accent">
              <ContentSdkText field={props.fields?.JobTitle} />
            </h5>
            {hasFieldTextValue(props.fields?.OfficeLocation) ? (
              <p className="text-sm font-medium tracking-wide uppercase">
                <ContentSdkText field={props.fields?.OfficeLocation} />
              </p>
            ) : null}
            <div className="text-lg">
              <ContentSdkRichText field={props.fields?.Bio} />
            </div>
          </div>
          <aside className="space-y-4 lg:col-span-3 lg:pt-2">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-2 text-sm">
              {hasFieldTextValue(props.fields?.PhoneNumber) ? (
                <p>
                  <span className="font-semibold">D: </span>
                  <ContentSdkText field={props.fields?.PhoneNumber} />
                </p>
              ) : (
                <p className={isPageEditing ? '' : 'text-muted'}>
                  <span className="font-semibold">D: </span>
                  {isPageEditing ? '[PhoneNumber]' : 'Not provided'}
                </p>
              )}
              {hasFieldTextValue(props.fields?.Email) ? (
                <p>
                  <span className="font-semibold">E: </span>
                  <ContentSdkText field={props.fields?.Email} />
                </p>
              ) : (
                <p className={isPageEditing ? '' : 'text-muted'}>
                  <span className="font-semibold">E: </span>
                  {isPageEditing ? '[Email]' : 'Not provided'}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <h5 className="text-base font-semibold">Address</h5>
              {hasRichTextValue(props.fields?.Address) ? (
                <ContentSdkRichText field={props.fields?.Address} />
              ) : (
                <p className={`text-sm ${isPageEditing ? '' : 'text-muted'}`}>
                  {isPageEditing ? '[Address content]' : 'Address not provided'}
                </p>
              )}
            </div>
          </aside>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <DetailSection
              title="Engagements"
              field={props.fields?.Engagements}
              isPageEditing={isPageEditing}
            />
            <DetailSection title="Insights" field={props.fields?.Insights} isPageEditing={isPageEditing} />
            <DetailSection title="Events" field={props.fields?.Events} isPageEditing={isPageEditing} />
          </div>
          <div className="space-y-8 lg:col-span-4">
            <DetailSection title="Practices" field={props.fields?.Practices} isPageEditing={isPageEditing} />
            <DetailSection
              title="Admitted In"
              field={props.fields?.AdmittedIn}
              isPageEditing={isPageEditing}
            />
            <DetailSection
              title="Court Admissions"
              field={props.fields?.CourtAdmissions}
              isPageEditing={isPageEditing}
            />
            <DetailSection title="Education" field={props.fields?.Education} isPageEditing={isPageEditing} />
            <DetailSection title="Honors" field={props.fields?.Honors} isPageEditing={isPageEditing} />
          </div>
        </div>
      </div>
    </section>
  );
};
