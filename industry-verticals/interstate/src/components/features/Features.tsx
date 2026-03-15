import { IGQLTextField } from '@/types/igql';
import {
  ComponentParams,
  ComponentRendering,
  Image,
  Text,
  Link,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import React from 'react';

interface Fields {
  data?: {
    datasource?: {
      children?: {
        results?: Feature[];
      };
      title?: IGQLTextField;
      description?: IGQLTextField;
    };
  };
}

interface Feature {
  featureImage: { jsonValue: { value: { src: string; alt?: string } } };
  featureTitle: { jsonValue: { value: string } };
  featureDescription: { jsonValue: { value: string } };
  featureLink: { jsonValue: { value: { href: string } } };
}

type FeaturesProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

type FeatureWrapperProps = {
  props: FeaturesProps;
  children: React.ReactNode;
};

const FeatureWrapper = (wrapperProps: FeatureWrapperProps) => {
  const id = wrapperProps.props.params.RenderingIdentifier;

  return (
    <section className={`${wrapperProps.props.params.styles}`} id={id ? id : undefined}>
      {wrapperProps.children}
    </section>
  );
};

export const Default = (props: FeaturesProps) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const datasource = props.fields?.data?.datasource;
  const title = datasource?.title;
  const description = datasource?.description;
  const results = datasource?.children?.results || [];

  return (
    <FeatureWrapper props={props}>
      <div className="container py-10 lg:py-16">
        {/* Section Heading */}
        <div className="mb-10">
          {(title?.jsonValue || isPageEditing) && (
            <h2 className="text-4xl md:text-5xl">
              {title?.jsonValue ? <Text field={title.jsonValue} /> : null}
            </h2>
          )}
          {(description?.jsonValue || isPageEditing) && (
            <p className="mt-2 text-base">
              {description?.jsonValue ? <Text field={description.jsonValue} /> : null}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {results.map((item, index) => {
            const title = item.featureTitle.jsonValue;
            const description = item.featureDescription.jsonValue;
            const image = item.featureImage.jsonValue;
            const link = item.featureLink?.jsonValue;

            const content = (
              <>
                <div className="group mb-7 aspect-square w-full overflow-hidden transition-transform duration-300">
                  <Image
                    field={image}
                    className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                </div>

                <h3 className="text-2xl md:text-3xl">
                  <Text field={title} />
                </h3>

                <p className="mt-2 text-base md:text-lg">
                  <Text field={description} />
                </p>
              </>
            );

            return (
              <div key={index}>
                {link?.value?.href ? <Link field={link}>{content}</Link> : <div>{content}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </FeatureWrapper>
  );
};

export const ImageGrid = (props: FeaturesProps) => {
  const results = props.fields?.data?.datasource?.children?.results || [];

  return (
    <FeatureWrapper props={props}>
      <div className="container grid grid-cols-1 gap-4 py-9 md:grid-cols-2 lg:grid-cols-5">
        {results.map((item, index) => {
          const imageField = item?.featureImage.jsonValue;
          return (
            <div className="flex items-center justify-center py-9 lg:py-2" key={index}>
              {imageField && <Image field={imageField} className="max-h-20 object-contain" />}
            </div>
          );
        })}
      </div>
    </FeatureWrapper>
  );
};

export const FourColGrid = (props: FeaturesProps) => {
  const results = props.fields?.data?.datasource?.children?.results || [];

  return (
    <FeatureWrapper props={props}>
      <div className="container grid grid-cols-1 gap-15 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {results.map((item, index) => {
          const title = item.featureTitle.jsonValue;
          const description = item.featureDescription.jsonValue;

          return (
            <div key={index} className="flex flex-col justify-center">
              <h3 className="text-xl font-bold">
                <Text field={title} />
              </h3>

              <p className="mt-2 text-base">
                <Text field={description} />
              </p>
            </div>
          );
        })}
      </div>
    </FeatureWrapper>
  );
};
