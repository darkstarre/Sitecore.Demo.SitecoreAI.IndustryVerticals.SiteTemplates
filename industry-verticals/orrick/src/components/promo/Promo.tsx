'use client';

import React from 'react';
import Image from 'next/image';
import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  ImageField,
  Field,
  LinkField,
  RichTextField,
  ComponentRendering,
  ComponentParams,
  Placeholder,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import BlobAccent from '../non-sitecore/BlobAccent';
import CurvedClip from '../non-sitecore/CurvedClip';
import { CommonStyles } from '@/types/styleFlags';

interface Fields {
  PromoImageOne: ImageField;
  PromoTitle: Field<string>;
  PromoDescription: RichTextField;
  PromoMoreInfo: LinkField;
}

type PromoProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

const LEGACY_HEALTHCARE_COPY_MARKER = 'redefining healthcare';
const LEGAL_ABOUT_TITLE = 'About Us';
const LEGAL_ABOUT_IMAGE_URL =
  'https://media.ceros.com/orrick/images/2025/02/03/bddc5b20faab4961bd5b8b5626ab3377/header-image.jpg?imageOpt=1&fit=bounds&width=901';
const LEGAL_ABOUT_DESCRIPTION = `
  <p>We guide clients through complex legal, regulatory, and commercial challenges with practical, business-focused advice.</p>
  <p>From strategic transactions to litigation and compliance, our teams deliver clear counsel, responsive collaboration, and results aligned to your goals.</p>
`;

const shouldUseLegalAboutCopy = (props: PromoProps) => {
  const title = props.fields?.PromoTitle?.value?.toString().toLowerCase() || '';
  const description = props.fields?.PromoDescription?.value?.toString().toLowerCase() || '';
  return title.includes('about') && description.includes(LEGACY_HEALTHCARE_COPY_MARKER);
};

const PromoWrapper = ({
  children,
  props,
  imageField,
  imageUrl,
  useLegalAboutTheme,
}: {
  children: React.ReactNode;
  props: PromoProps;
  imageField?: ImageField;
  imageUrl?: string;
  useLegalAboutTheme?: boolean;
}) => {
  const id = props.params.RenderingIdentifier;
  const hideBlobAccent = props.params.styles?.includes(CommonStyles.HideBlobAccent);
  const curvedTop = props.params.styles?.includes(CommonStyles.CurvedTop);
  const curvedBottom = props.params.styles?.includes(CommonStyles.CurvedBottom);
  const curveColorClass = useLegalAboutTheme ? 'text-white dark:text-[#1f2f26]' : '';

  return (
    <section
      className={`component promo relative py-12 sm:py-20 lg:py-32 ${
        useLegalAboutTheme
          ? 'bg-[#c9d9cf] dark:bg-[#254233]'
          : 'bg-background-secondary dark:bg-background-secondary-dark'
      } ${props?.params?.styles}`}
      id={id ? id : undefined}
    >
      {curvedTop && <CurvedClip className={`top-0 ${curveColorClass}`} pos="top" />}
      {curvedBottom && <CurvedClip className={`bottom-0 ${curveColorClass}`} pos="bottom" />}
      {!hideBlobAccent && (
        <BlobAccent
          size="lg"
          className="absolute top-0 left-0 z-0 lg:left-4 lg:[.promo-reversed_&]:right-4 lg:[.promo-reversed_&]:left-auto"
        />
      )}
      <div className="relative z-10 container">
        <div className="grid items-center gap-x-24 gap-y-12 lg:grid-cols-2">
          <div className="shadow-soft relative aspect-square overflow-hidden rounded-lg">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Legal professionals collaborating in a modern office"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="h-full w-full object-cover"
              />
            ) : (
              <ContentSdkImage
                field={imageField || props.fields.PromoImageOne}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="lg:[.promo-reversed_&]:order-first">{children}</div>
        </div>
      </div>
    </section>
  );
};

const DefaultPromo = (props: PromoProps) => {
  const useLegalAboutCopy = shouldUseLegalAboutCopy(props);
  const promoImageField = props.fields.PromoImageOne;
  const promoTitleField = useLegalAboutCopy
    ? ({ value: LEGAL_ABOUT_TITLE } as Field<string>)
    : props.fields.PromoTitle;
  const promoDescriptionField = useLegalAboutCopy
    ? ({ value: LEGAL_ABOUT_DESCRIPTION } as RichTextField)
    : props.fields.PromoDescription;

  return (
    <PromoWrapper
      props={props}
      imageField={promoImageField}
      imageUrl={useLegalAboutCopy ? LEGAL_ABOUT_IMAGE_URL : undefined}
      useLegalAboutTheme={useLegalAboutCopy}
    >
      <h2>
        <ContentSdkText field={promoTitleField} />
      </h2>
      <ContentSdkRichText className="mb-10 text-lg" field={promoDescriptionField} />

      <ContentSdkLink field={props.fields.PromoMoreInfo} className="btn btn-icon">
        {props.fields?.PromoMoreInfo?.value?.text}
        <FontAwesomeIcon icon={faArrowRight} />
      </ContentSdkLink>
    </PromoWrapper>
  );
};

const WithPlaceholderPromo = (props: PromoProps) => {
  const useLegalAboutCopy = shouldUseLegalAboutCopy(props);
  const promoImageField = props.fields.PromoImageOne;
  const promoTitleField = useLegalAboutCopy
    ? ({ value: LEGAL_ABOUT_TITLE } as Field<string>)
    : props.fields.PromoTitle;

  return (
    <PromoWrapper
      props={props}
      imageField={promoImageField}
      imageUrl={useLegalAboutCopy ? LEGAL_ABOUT_IMAGE_URL : undefined}
      useLegalAboutTheme={useLegalAboutCopy}
    >
      <h2>
        <ContentSdkText field={promoTitleField} />
      </h2>
      <Placeholder
        name={`promo-content-${props?.params?.DynamicPlaceholderId}`}
        rendering={props.rendering}
      />
    </PromoWrapper>
  );
};

export const Default = withDatasourceCheck()<PromoProps>(DefaultPromo);
export const WithPlaceholder = withDatasourceCheck()<PromoProps>(WithPlaceholderPromo);
