'use client';

import {
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  withDatasourceCheck,
  ComponentRendering,
  ComponentParams,
  RichTextField,
  Field,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import BlobAccent from '../../assets/shapes/BlobAccent';
import CurvedClip from '../../assets/shapes/CurvedClip';
import { CommonStyles } from '@/types/styleFlags';

interface Fields {
  Title: Field<string>;
  Description: RichTextField;
}

type ContentSectionProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

const ABOUT_SECTION_KEYWORDS = ['about', 'about us', 'our firm', 'who we are', 'our story'];

const DefaultContentSection = ({ fields, params, rendering }: ContentSectionProps) => {
  const id = params?.RenderingIdentifier;
  const curvedTop = params.styles?.includes(CommonStyles.CurvedTop);
  const curvedBottom = params.styles?.includes(CommonStyles.CurvedBottom);
  const hideBlobAccent = params.styles?.includes(CommonStyles.HideBlobAccent);
  const sectionTitle = fields?.Title?.value?.toString().toLowerCase() || '';
  const sectionDescription =
    (fields?.Description as RichTextField | undefined)?.value?.toString().toLowerCase() || '';
  const isAboutSection = ABOUT_SECTION_KEYWORDS.some(
    (keyword) => sectionTitle.includes(keyword) || sectionDescription.includes(keyword)
  );

  return (
    <section
      className={`relative space-y-8 py-16 ${
        isAboutSection
          ? 'bg-[#c4d9ca] dark:bg-[#254233]'
          : 'bg-background-secondary dark:bg-background-secondary-dark'
      } ${params?.styles}`}
      id={id || undefined}
    >
      {curvedTop && <CurvedClip className="top-0" pos="top" />}
      {curvedBottom && <CurvedClip className="bottom-0" pos="bottom" />}
      {!hideBlobAccent && (
        <BlobAccent
          size="lg"
          className={`absolute top-0 right-0 z-0 lg:right-4 ${
            isAboutSection ? 'text-[#45724d] dark:text-[#90b99a]' : ''
          }`}
        />
      )}
      <div className="relative z-10 container">
        <div className="max-w-4xl">
          <h2 className={isAboutSection ? 'text-[#1f3f2b] dark:text-[#d8e8dd]' : ''}>
            {isAboutSection ? 'About Us' : <ContentSdkText field={fields.Title} />}
          </h2>
          {isAboutSection ? (
            <div className="text-lg text-[#1f3f2b]/85 dark:text-[#d8e8dd]/85">
              <p>
                We advise clients across complex legal, regulatory, and market challenges with a
                practical, business-first approach.
              </p>
              <p className="mt-4">
                Explore: About Us, News, Locations, Innovation, AI Adoption, Alumni, Our Culture,
                Pro Bono, Inclusion &amp; Belonging, and Responsible Business.
              </p>
            </div>
          ) : (
            <ContentSdkRichText className="text-lg" field={fields.Description} />
          )}
        </div>
      </div>
      <Placeholder
        name={`section-wrapper-content-${params?.DynamicPlaceholderId}`}
        rendering={rendering}
      />
    </section>
  );
};

export const Default = withDatasourceCheck()<ContentSectionProps>(DefaultContentSection);
