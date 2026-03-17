import { generateIndexes } from '@/helpers/generateIndexes';
import { IGQLTextField } from '@/types/igql';
import {
  ComponentParams,
  ComponentRendering,
  Image,
  Link,
  Text,
} from '@sitecore-content-sdk/nextjs';
import React from 'react';
import AccentLine from '@/assets/icons/accent-line/AccentLine';
import { CommonStyles } from '@/types/styleFlags';

interface Fields {
  data: {
    datasource: {
      children: {
        results: Feature[];
      };
      title: IGQLTextField;
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
  // rendering item id
  const id = wrapperProps.props.params.RenderingIdentifier;

  return (
    <section className={`${wrapperProps.props.params.styles}`} id={id ? id : undefined}>
      {wrapperProps.children}
    </section>
  );
};

export const Default = (props: FeaturesProps) => {
  // results of the graphql
  const results = props.fields.data.datasource.children.results;
  const hideAccentLine = props.params.styles?.includes(CommonStyles.HideAccentLine);
  const featureSectionTitle = props.fields.data.datasource.title;

  return (
    <FeatureWrapper props={props}>
      <div className="container grid grid-cols-1 py-20 lg:grid-cols-[1fr_2fr] lg:gap-10">
        <div className="mb-20 lg:mb-0">
          <h2 className="inline-block max-w-md font-bold max-lg:text-[42px]">
            <Text field={featureSectionTitle.jsonValue} />
            {!hideAccentLine && <AccentLine className="w-full max-w-xs" />}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {results.map((item, index) => {
            const title = item.featureTitle.jsonValue;
            const description = item.featureDescription.jsonValue;
            const link = item.featureLink.jsonValue;
            return (
              <div className="flex flex-col" key={index}>
                {/* Title, Link and Description */}
                <div className="mb-5 text-2xl font-bold">
                  <Text field={title} />
                </div>
                <div className="text-foreground mb-3.5 flex-auto leading-7">
                  <Text field={description} />
                </div>
                <div>
                  <Link field={link} className="arrow-btn" />
                </div>
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
  const upperCards = results.slice(0, 3);
  const lowerCards = results.slice(3, 6);
  const featuredCards = lowerCards.length ? lowerCards : upperCards;
  const sectionTitle = props.fields?.data?.datasource?.title;

  return (
    <FeatureWrapper props={props}>
      <div className="container py-16 lg:py-20">
        <div className="border-border bg-background-accent mb-14 grid grid-cols-1 gap-4 rounded-md border p-4 md:grid-cols-2 lg:grid-cols-3">
          {upperCards.map((item, index) => {
            const title = item?.featureTitle?.jsonValue;
            const description = item?.featureDescription?.jsonValue;
            const image = item?.featureImage?.jsonValue;
            const link = item?.featureLink?.jsonValue;

            return (
              <article
                key={item?.featureTitle?.jsonValue?.value || index}
                className="border-border bg-background flex h-full flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-start"
              >
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded sm:h-20 sm:w-28">
                  {image ? (
                    <Image field={image} className="h-full w-full object-cover object-center" />
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col">
                  <h3 className="text-foreground text-base font-semibold">
                    {title ? <Text field={title} /> : 'Feature'}
                  </h3>
                  <p className="text-foreground-light mt-1 flex-auto text-sm leading-6">
                    {description ? <Text field={description} /> : null}
                  </p>
                  <Link
                    field={link}
                    className="text-foreground-light hover:text-accent mt-2 inline-flex text-sm font-medium transition-colors hover:underline"
                  >
                    More Info
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="border-border mb-12 border-t pt-10 lg:mb-14">
          <h2 className="inline-block max-w-2xl font-bold max-lg:text-[42px]">
            {sectionTitle?.jsonValue ? (
              <Text field={sectionTitle.jsonValue} />
            ) : (
              'Featured Products'
            )}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredCards.map((item, index) => {
            const title = item?.featureTitle?.jsonValue;
            const description = item?.featureDescription?.jsonValue;
            const link = item?.featureLink?.jsonValue;
            const image = item?.featureImage?.jsonValue;
            const linkHref = link?.value?.href || '#';
            const titleText = title?.value || 'Product';

            return (
              <article
                className="border-border bg-background-surface flex h-full flex-col overflow-hidden rounded-md border shadow-sm transition-shadow hover:shadow-md"
                key={index}
              >
                <div className="aspect-[16/10] overflow-hidden bg-white">
                  {image ? (
                    <div className="relative h-full w-full">
                      <Image field={image} className="h-full w-full object-cover object-center" />
                      <div className="from-accent/80 absolute inset-x-0 top-0 bg-gradient-to-b to-transparent p-4">
                        <h3 className="text-center text-lg leading-tight font-bold text-white">
                          {titleText}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <div className="text-foreground-muted flex h-full w-full items-center justify-center text-sm">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="text-foreground-light mb-5 flex-auto leading-7">
                    {description ? <Text field={description} /> : null}
                  </div>
                  <a href={linkHref} className="arrow-btn mt-auto" aria-label="Learn more">
                    Learn More
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </FeatureWrapper>
  );
};

export const ThreeColGridCentered = (props: FeaturesProps) => {
  // results of the graphql
  const results = props.fields.data.datasource.children.results;

  return (
    <FeatureWrapper props={props}>
      <div className="container flex flex-col flex-wrap justify-evenly gap-20 md:flex-row lg:gap-20">
        {results.slice(0, 3).map((item, index) => {
          const title = item.featureTitle.jsonValue;
          const description = item.featureDescription.jsonValue;
          const image = item.featureImage.jsonValue;
          return (
            <div className="flex flex-col items-center justify-start 2xl:w-80" key={index}>
              {/* Image */}
              <div className="bg-accent mb-7 flex h-20 w-20 items-center justify-center rounded-full">
                <Image field={image} />
              </div>
              {/* Title and Description */}
              <div className="flex flex-col items-center justify-center">
                <div className="mb-2 leading-0.5">
                  <Text tag="h5" className="text-accent" field={title} />
                </div>
                <div className="text-background-muted-light text-center">
                  <Text field={description} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </FeatureWrapper>
  );
};

export const NumberedGrid = (props: FeaturesProps) => {
  // results of the graphql
  const results = props.fields.data.datasource.children.results;

  return (
    <FeatureWrapper props={props}>
      <div className="container grid grid-cols-1 gap-4 py-24 md:grid-cols-2 lg:grid-cols-3">
        {results.map((item, index) => {
          const title = item?.featureTitle.jsonValue;
          const description = item?.featureDescription.jsonValue;
          return (
            <div
              className="group text-background hover:bg-accent cursor-pointer rounded-xl p-6"
              key={index}
            >
              {/* Generated Number */}
              <h1 className="group-hover:text-background text-background-muted-dark mb-2 text-7xl leading-24">
                {generateIndexes(index)}
              </h1>
              {/* Title and Description */}
              <div>
                <div className="text-accent group-hover:text-background mb-4 text-2xl leading-8 font-bold">
                  <Text field={title} />
                </div>
                <div className="text-background-muted-dark group-hover:text-background leading-7">
                  <Text field={description} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </FeatureWrapper>
  );
};

export const FourColGrid = (props: FeaturesProps) => {
  // results of the graphql
  const results = props.fields.data.datasource.children.results;

  return (
    <FeatureWrapper props={props}>
      <div className="container grid grid-cols-1 gap-20 py-24 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {results.map((item, index) => {
          const title = item.featureTitle.jsonValue;
          const description = item.featureDescription.jsonValue;
          const image = item.featureImage.jsonValue;
          return (
            <div className="grid grid-cols-[1fr_2fr] gap-2.5" key={index}>
              {/* Image */}
              <div className="flex items-center justify-center rounded-full">
                <Image field={image} />
              </div>
              {/* Title and Description */}
              <div className="flex flex-col justify-center">
                <div className="text-xl leading-9 font-bold">
                  <Text className="text-foreground" field={title} />
                </div>
                <div className="text-background-muted-light leading-8">
                  <Text field={description} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </FeatureWrapper>
  );
};

export const ImageCardGrid = (props: FeaturesProps) => {
  const results = props.fields.data.datasource.children.results;

  return (
    <FeatureWrapper props={props}>
      <div className="outline-non container grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        {results.map((item, index) => {
          const title = item.featureTitle.jsonValue;
          const description = item.featureDescription.jsonValue;
          const image = item.featureImage.jsonValue;
          return (
            <div key={index}>
              <div className="mb-7 aspect-4/3 w-full overflow-hidden rounded-lg bg-white">
                <Image field={image} className="h-full w-full object-cover" />
              </div>

              <h6>
                <Text field={title} />
              </h6>

              <p className="text-foreground-muted mt-1 text-lg">
                <Text field={description} />
              </p>
            </div>
          );
        })}
      </div>
    </FeatureWrapper>
  );
};
