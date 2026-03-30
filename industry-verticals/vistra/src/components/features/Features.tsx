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

const keyFigureIconFrame =
  'bg-accent/8 ring-accent/12 flex items-center justify-center rounded-2xl p-3 ring-1';

const KeyFigureItem = ({ feature }: { feature: FeatureFields }) => {
  const titlePlain = plainFieldValue(feature.featureTitle?.jsonValue?.value);
  const descPlain = plainFieldValue(feature.featureDescription?.jsonValue?.value);
  const src = feature.featureImage?.jsonValue?.value?.src;
  const hasImage = Boolean(src);

  const rowStat = isNumericStatTitle(titlePlain) && descPlain.length > 30;
  const iconLeft = hasImage && descPlain.length <= 55 && !rowStat;
  const imageBelow = hasImage && descPlain.length > 70;

  const imageEl = hasImage ? (
    <div
      className={`flex shrink-0 justify-center lg:justify-start ${imageBelow ? '' : keyFigureIconFrame}`}
    >
      <ContentSdkImage
        field={feature.featureImage.jsonValue}
        className={
          imageBelow
            ? 'max-h-40 w-auto max-w-full object-contain md:max-h-48'
            : 'size-12 object-contain md:size-16 lg:size-[4.5rem]'
        }
      />
    </div>
  ) : null;

  const statEl = (
    <ContentSdkText
      field={feature.featureTitle.jsonValue}
      tag="p"
      className="text-accent text-[2.75rem] leading-[0.95] font-bold tracking-tight md:text-6xl lg:text-[3.35rem]"
    />
  );

  const labelEl = (
    <ContentSdkText
      field={feature.featureDescription.jsonValue}
      tag="p"
      className={
        rowStat
          ? 'text-accent max-w-[15rem] text-[0.65rem] leading-snug font-bold tracking-[0.18em] uppercase sm:max-w-xs sm:text-xs'
          : 'text-accent mt-3 max-w-[16.5rem] text-[0.65rem] leading-snug font-bold tracking-[0.18em] uppercase md:max-w-xs md:text-xs'
      }
    />
  );

  if (rowStat) {
    return (
      <li className="relative flex min-h-0 flex-col gap-5 lg:min-h-[11rem]">
        <div
          className="bg-accent absolute top-0 left-0 hidden h-1 w-10 rounded-full lg:block"
          aria-hidden
        />
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6 lg:flex-col lg:items-start">
          {imageEl}
          <div className="flex min-w-0 flex-wrap items-baseline justify-center gap-x-3 gap-y-2 sm:justify-start">
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
          ? 'flex min-w-0 flex-1 flex-col gap-1 text-center sm:text-left'
          : 'flex flex-col gap-1 text-center sm:items-start sm:text-left'
      }
    >
      <div className="bg-accent mx-auto h-1 w-10 rounded-full sm:mx-0 lg:hidden" aria-hidden />
      {statEl}
      {labelEl}
    </div>
  );

  return (
    <li className="relative flex min-h-0 flex-col gap-6 lg:min-h-[11rem] lg:gap-8">
      <div
        className="bg-accent absolute top-0 left-0 hidden h-1 w-10 rounded-full lg:block"
        aria-hidden
      />
      {hasImage && !imageBelow && iconLeft ? (
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6 lg:flex-col lg:items-start">
          {imageEl}
          {body}
        </div>
      ) : hasImage && !imageBelow ? (
        <>
          {imageEl}
          {body}
        </>
      ) : hasImage && imageBelow ? (
        <div className="flex flex-col gap-6">
          {body}
          <div className="flex justify-center sm:justify-start">{imageEl}</div>
        </div>
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
      className={`relative py-12 md:py-16 lg:py-[4.5rem] ${params?.styles || ''}`}
      id={id || undefined}
    >
      <div className="container">
        <div className="from-background-accent/35 border-border/55 via-background to-background-accent/25 relative overflow-hidden rounded-2xl border bg-linear-to-br px-6 py-10 shadow-[0_1px_0_rgba(15,31,61,0.06)] md:px-10 md:py-12 lg:px-14 lg:py-14">
          <div
            className="bg-accent/8 pointer-events-none absolute -top-24 -right-16 size-56 rounded-full blur-3xl"
            aria-hidden
          />
          <div
            className="bg-warning/10 pointer-events-none absolute -bottom-20 -left-10 size-48 rounded-full blur-2xl"
            aria-hidden
          />

          {(hasSectionTitle || hasSectionIntro) && (
            <header className="relative mb-10 max-w-3xl md:mb-12 lg:mb-14">
              {hasSectionTitle && (
                <h2 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
                  <ContentSdkText field={sectionTitle} />
                </h2>
              )}
              {hasSectionIntro && (
                <div className="text-foreground-light mt-3 max-w-2xl text-base leading-relaxed md:text-lg">
                  <ContentSdkRichText field={sectionIntro} />
                </div>
              )}
            </header>
          )}
          <ul className="divide-border/40 lg:divide-border/35 relative grid grid-cols-1 gap-12 divide-y sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 sm:divide-y-0 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none lg:grid-rows-1 lg:gap-0 lg:divide-x lg:divide-y-0 [&>li]:py-6 sm:[&>li]:py-0 lg:[&>li]:px-8 lg:[&>li]:py-2 xl:[&>li]:px-10">
            {features?.map((feature) => (
              <KeyFigureItem key={feature.id} feature={feature} />
            ))}
          </ul>
        </div>
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
