'use client';

import React from 'react';
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

const PromoWrapper = ({ children, props }: { children: React.ReactNode; props: PromoProps }) => {
  const id = props.params.RenderingIdentifier;

  return (
    <section
      className={`component promo border-border bg-background-secondary relative border-y py-12 sm:py-16 lg:py-20 ${props?.params?.styles}`}
      id={id ? id : undefined}
    >
      <div className="relative z-10 container">
        <div className="grid items-center gap-x-14 gap-y-10 lg:grid-cols-2">
          <div className="border-border aspect-[4/3] overflow-hidden border bg-white shadow-md">
            <ContentSdkImage
              field={props.fields.PromoImageOne}
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
          </div>
          <div className="lg:[.promo-reversed_&]:order-first">{children}</div>
        </div>
      </div>
    </section>
  );
};

const DefaultPromo = (props: PromoProps) => {
  return (
    <PromoWrapper props={props}>
      <h2 className="max-w-2xl">
        <ContentSdkText field={props.fields.PromoTitle} />
      </h2>
      <ContentSdkRichText
        className="mb-8 max-w-2xl text-base lg:text-lg"
        field={props.fields.PromoDescription}
      />

      <ContentSdkLink field={props.fields.PromoMoreInfo} className="main-btn btn-icon">
        {props.fields?.PromoMoreInfo?.value?.text}
        <FontAwesomeIcon icon={faArrowRight} />
      </ContentSdkLink>
    </PromoWrapper>
  );
};

const WithPlaceholderPromo = (props: PromoProps) => {
  return (
    <PromoWrapper props={props}>
      <h2>
        <ContentSdkText field={props.fields.PromoTitle} />
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
