'use client';

import { IGQLImageField, IGQLRichTextField, IGQLTextField, IGQLLinkField } from 'src/types/igql';
import {
  Text as ContentSdkText,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  withDatasourceCheck,
  ComponentRendering,
  ComponentParams,
} from '@sitecore-content-sdk/nextjs';

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
  featureImageDark?: IGQLImageField;
  featureLink?: IGQLLinkField;
}

type FeaturesProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

function plainFieldValue(value: unknown): string {
  if (value == null) return '';
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Stat is mostly digits (e.g. 14, 7,000) for side-by-side label layout. */
function isNumericStatTitle(titlePlain: string): boolean {
  return /^[\d,.]+$/.test(titlePlain.trim());
}

const KeyFigureItem = ({ feature }: { feature: FeatureFields }) => {
  const titlePlain = plainFieldValue(feature.featureTitle?.jsonValue?.value);
  const descPlain = plainFieldValue(feature.featureDescription?.jsonValue?.value);
  const src = feature.featureImage?.jsonValue?.value?.src;
  const hasImage = Boolean(src);

  const rowStat = isNumericStatTitle(titlePlain) && descPlain.length > 30;
  const iconLeft = hasImage && descPlain.length <= 55 && !rowStat;
  const imageBelow = hasImage && descPlain.length > 70;

  const imageEl = hasImage ? (
    <div className="flex shrink-0 justify-center lg:justify-start">
      <ContentSdkImage
        field={feature.featureImage.jsonValue}
        className={
          imageBelow
            ? 'max-h-36 w-auto max-w-full object-contain md:max-h-44'
            : 'h-14 w-14 object-contain lg:h-20 lg:w-auto lg:max-w-[180px]'
        }
      />
    </div>
  ) : null;

  const statEl = (
    <ContentSdkText
      field={feature.featureTitle.jsonValue}
      tag="p"
      className="text-accent text-4xl leading-none font-bold tracking-tight md:text-5xl"
    />
  );

  const labelEl = (
    <ContentSdkText
      field={feature.featureDescription.jsonValue}
      tag="p"
      className="text-accent max-w-md text-xs leading-snug font-semibold tracking-[0.2em] uppercase"
    />
  );

  if (rowStat) {
    return (
      <li className="flex flex-col gap-4">
        <div className="flex flex-row flex-wrap items-start gap-4">
          {imageEl}
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-2">
            {statEl}
            {labelEl}
          </div>
        </div>
      </li>
    );
  }

  const body = (
    <div
      className={
        iconLeft
          ? 'flex min-w-0 flex-1 flex-col gap-3 text-center lg:text-left'
          : 'flex flex-col gap-3 text-center lg:items-start lg:text-left'
      }
    >
      {statEl}
      {labelEl}
    </div>
  );

  return (
    <li className="flex flex-col gap-6 lg:gap-8">
      {hasImage && !imageBelow && iconLeft ? (
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
          {imageEl}
          {body}
        </div>
      ) : hasImage && !imageBelow ? (
        <>
          {imageEl}
          {body}
        </>
      ) : hasImage && imageBelow ? (
        <>
          {body}
          {imageEl}
        </>
      ) : (
        body
      )}
    </li>
  );
};

const KeyFiguresFeatures = ({ fields, params }: FeaturesProps) => {
  const id = params?.RenderingIdentifier;
  const features = fields?.data?.datasource?.children?.results;
  const sectionTitle = fields?.data?.datasource?.title?.jsonValue;
  const sectionIntro = fields?.data?.datasource?.description?.jsonValue;
  const hasSectionTitle = Boolean(plainFieldValue(sectionTitle?.value));
  const hasSectionIntro = Boolean(plainFieldValue(sectionIntro?.value));

  return (
    <section
      className={`bg-background relative py-14 lg:py-20 ${params?.styles || ''}`}
      id={id || undefined}
    >
      <div className="container">
        {(hasSectionTitle || hasSectionIntro) && (
          <header className="mb-12 max-w-3xl lg:mb-16">
            {hasSectionTitle && (
              <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
                <ContentSdkText field={sectionTitle} />
              </h2>
            )}
            {hasSectionIntro && (
              <div className="text-foreground-light mt-4 text-lg leading-relaxed">
                <ContentSdkRichText field={sectionIntro} />
              </div>
            )}
          </header>
        )}
        <ul className="grid grid-cols-1 gap-14 md:gap-12 lg:grid-cols-3 lg:gap-10">
          {features?.map((feature) => (
            <KeyFigureItem key={feature.id} feature={feature} />
          ))}
        </ul>
      </div>
    </section>
  );
};

const FeatureItem = ({
  feature,
  layout = 'vertical',
}: {
  feature: FeatureFields;
  layout: 'vertical' | 'horizontal';
}) => {
  if (layout === 'horizontal') {
    // Card variant: horizontal layout with button
    return (
      <li key={feature?.id} className="border-border flex flex-col gap-4 rounded-lg border p-6">
        <div className="mb-3.5 flex items-center gap-1">
          <ContentSdkImage
            field={feature?.featureImage?.jsonValue}
            className="h-8 w-8 flex-shrink-0 object-contain"
          />
          <h5 className="text-base leading-none font-bold">
            <ContentSdkText field={feature?.featureTitle?.jsonValue} />
          </h5>
        </div>
        <p>
          <ContentSdkText field={feature?.featureDescription?.jsonValue} />
        </p>
        {feature?.featureLink?.jsonValue ? (
          <div className="mt-2">
            <ContentSdkLink field={feature.featureLink.jsonValue} className="outline-btn" />
          </div>
        ) : null}
      </li>
    );
  }

  // Default variant: vertical layout with icon on left
  return (
    <li
      key={feature?.id}
      className="border-border bg-background flex flex-col gap-4 rounded-lg border p-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center">
          <ContentSdkImage
            field={feature?.featureImage?.jsonValue}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex-1">
          <h5 className="mb-2 text-base font-semibold">
            <ContentSdkText field={feature?.featureTitle?.jsonValue} />
          </h5>
          <p className="text-foreground-light">
            <ContentSdkText field={feature?.featureDescription?.jsonValue} />
          </p>
        </div>
      </div>
    </li>
  );
};

const DefaultFeatures = ({ fields, params }: FeaturesProps) => {
  const id = params?.RenderingIdentifier;
  const features = fields?.data?.datasource?.children?.results;

  return (
    <section className={`relative py-10 lg:py-16 ${params?.styles || ''}`} id={id || undefined}>
      <div className="container">
        <h2 className="mb-4 text-center text-3xl font-bold">
          <ContentSdkText field={fields?.data?.datasource?.title?.jsonValue} />
        </h2>

        <ul className="mt-12 grid gap-6 lg:grid-cols-2">
          {features?.map((feature) => (
            <FeatureItem key={feature.id} feature={feature} layout="vertical" />
          ))}
        </ul>
      </div>
    </section>
  );
};

const CardFeatures = ({ fields, params }: FeaturesProps) => {
  const id = params?.RenderingIdentifier;
  const features = fields?.data?.datasource?.children?.results;

  return (
    <div className={`relative py-10 lg:py-16 ${params?.styles || ''}`} id={id || undefined}>
      <div className="container">
        <h2 className="mb-6 text-3xl font-bold">
          <ContentSdkText field={fields?.data?.datasource?.title?.jsonValue} />
        </h2>
        <ul className="grid gap-6 lg:grid-cols-3">
          {features?.map((feature) => (
            <FeatureItem key={feature.id} feature={feature} layout="horizontal" />
          ))}
        </ul>
      </div>
    </div>
  );
};

export const Default = withDatasourceCheck()<FeaturesProps>(DefaultFeatures);
export const Card = withDatasourceCheck()<FeaturesProps>(CardFeatures);
/** Corporate “key figures” strip: large stat in Title, caption in Description, optional icon or illustration in Image. */
export const KeyFigures = withDatasourceCheck()<FeaturesProps>(KeyFiguresFeatures);
