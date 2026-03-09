'use client';

import { IGQLImageField, IGQLRichTextField, IGQLTextField } from 'src/types/igql';
import {
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  NextImage as ContentSdkImage,
  withDatasourceCheck,
  ComponentRendering,
  ComponentParams,
} from '@sitecore-content-sdk/nextjs';
import BlobAccent from '../../assets/shapes/BlobAccent';
import { FeatureStyles, CommonStyles } from '@/types/styleFlags';

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
  featureImageDark: IGQLImageField;
}

type FeaturesProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

const LEGACY_FEATURE_TITLE_MAP: Record<string, string> = {
  'laboratory tests': 'Corporate & Transactional',
  'health check': 'Regulatory & Compliance',
  'general dentistry': 'Litigation & Disputes',
};

const LEGACY_FEATURE_DESCRIPTION_MAP: Record<string, string> = {
  'laboratory tests':
    'Structure and close strategic transactions with practical legal guidance for growth-stage and enterprise clients.',
  'health check':
    'Stay ahead of regulatory change with proactive compliance counseling across data, governance, and operations.',
  'general dentistry':
    'Resolve complex commercial disputes with focused advocacy, risk management, and business-first outcomes.',
};

const LEGAL_SECTION_TITLE = 'Our Legal Services';
const LEGAL_SECTION_DESCRIPTION =
  'We provide practical legal counsel across core business priorities, from transactions and compliance to high-stakes disputes.';
const ORRICK_NEWS_HEADING = 'In Focus';
const ORRICK_GREEN = '#2E9B2E';
const ORRICK_NEWS_ITEMS = [
  {
    title: 'Cross-Border Expansion Playbook for Growth Companies',
    type: 'Briefing',
    date: 'March 2, 2026',
  },
  {
    title: 'Data Center Transactions: Structuring Deals for Speed and Certainty',
    type: 'Analysis',
    date: 'February 21, 2026',
  },
  {
    title: 'AI Governance in Practice: 7 Questions Boards Are Asking',
    type: 'Resource',
    date: 'February 11, 2026',
  },
  {
    title: 'Managing Regulatory Risk While Scaling Into New Markets',
    type: 'Perspective',
    date: 'January 30, 2026',
  },
] as const;

const getTextValue = (field?: IGQLTextField) => field?.jsonValue?.value?.toString().trim() || '';
const normalizeKey = (value: string) => value.trim().toLowerCase();

const FeatureItem = ({
  feature,
  useAccentColor,
  layout = 'vertical',
}: {
  feature: FeatureFields;
  useAccentColor: boolean;
  layout: 'vertical' | 'horizontal';
}) => {
  const rawTitle = getTextValue(feature?.featureTitle);
  const rawDescription = getTextValue(feature?.featureDescription);
  const normalizedTitle = normalizeKey(rawTitle);
  const mappedTitle = LEGACY_FEATURE_TITLE_MAP[normalizedTitle];
  const mappedDescription = LEGACY_FEATURE_DESCRIPTION_MAP[normalizedTitle];

  const borderStyles = `border-2 rounded-lg ${
    useAccentColor ? 'border-accent' : 'border-foreground dark:border-foreground-dark'
  }`;

  return (
    <li
      key={feature?.id}
      className={`flex flex-col gap-6 ${
        layout === 'horizontal' ? 'lg:flex-row lg:items-center' : ''
      }`}
    >
      <div
        className={`flex h-20 w-20 shrink-0 items-center justify-center p-3 lg:h-26 lg:w-26 ${borderStyles}`}
      >
        <ContentSdkImage
          field={feature?.featureImage?.jsonValue}
          className={`h-full w-full object-contain ${!useAccentColor ? 'dark:hidden' : ''}`}
        />
        {!useAccentColor && (
          <ContentSdkImage
            field={feature?.featureImageDark?.jsonValue}
            className="hidden h-full w-full object-contain dark:block"
          />
        )}
      </div>
      <div>
        <h5>{mappedTitle || <ContentSdkText field={feature?.featureTitle?.jsonValue} />}</h5>
        <p className="text-lg">
          {mappedDescription || rawDescription || (
            <ContentSdkText field={feature?.featureDescription?.jsonValue} />
          )}
        </p>
      </div>
    </li>
  );
};

const DefaultFeatures = ({ fields, params }: FeaturesProps) => {
  const id = params?.RenderingIdentifier;
  const features = fields?.data?.datasource?.children?.results;
  const sectionTitle = getTextValue(fields?.data?.datasource?.title);
  const isLegacyHealthcareSection = normalizeKey(sectionTitle) === 'our special services';
  const hideBlobAccent = params?.styles.includes(CommonStyles.HideBlobAccent);
  const useAccentColor = params?.styles.includes(FeatureStyles.UseAccentColor);

  return (
    <section className={`relative py-16 ${params?.styles}`} id={id || undefined}>
      {!hideBlobAccent && <BlobAccent className="absolute top-16 right-4 z-0" />}
      <div className="relative z-10 container">
        {isLegacyHealthcareSection ? (
          <div className="space-y-10">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p
                  className="text-xs font-semibold tracking-[0.2em] uppercase"
                  style={{ color: ORRICK_GREEN }}
                >
                  Legal Insights
                </p>
                <h2 className="font-heading mt-2 text-5xl" style={{ color: ORRICK_GREEN }}>
                  {ORRICK_NEWS_HEADING}
                </h2>
              </div>
              <div
                className="hidden items-center gap-6 pt-6 lg:flex"
                style={{ color: ORRICK_GREEN }}
              >
                <button
                  className="h-11 w-11 rounded-full border text-2xl transition"
                  style={{ borderColor: `${ORRICK_GREEN}4D` }}
                >
                  ←
                </button>
                <button
                  className="h-11 w-11 rounded-full border text-2xl transition"
                  style={{ borderColor: `${ORRICK_GREEN}4D` }}
                >
                  →
                </button>
              </div>
            </div>
            <ul className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
              {ORRICK_NEWS_ITEMS.map((item) => (
                <li
                  key={item.title}
                  className="space-y-4 border-t pt-4"
                  style={{ borderColor: `${ORRICK_GREEN}33` }}
                >
                  <h3
                    className="font-heading text-4xl leading-tight md:text-3xl"
                    style={{ color: ORRICK_GREEN }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm" style={{ color: `${ORRICK_GREEN}CC` }}>
                    <span>{item.type}</span>
                    <span className="mx-2">|</span>
                    <span>{item.date}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <div className="max-w-4xl">
              <h2>
                {isLegacyHealthcareSection ? (
                  LEGAL_SECTION_TITLE
                ) : (
                  <ContentSdkText field={fields?.data?.datasource?.title?.jsonValue} />
                )}
              </h2>
              {isLegacyHealthcareSection ? (
                <p className="text-lg">{LEGAL_SECTION_DESCRIPTION}</p>
              ) : (
                <ContentSdkRichText
                  className="text-lg"
                  field={fields?.data?.datasource?.description?.jsonValue}
                />
              )}
            </div>
            <ul className="mt-16 grid gap-12 lg:grid-cols-3">
              {features?.map((feature) => (
                <FeatureItem
                  key={feature.id}
                  feature={feature}
                  useAccentColor={useAccentColor}
                  layout="vertical"
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
};

const SimpleFeatures = ({ fields, params }: FeaturesProps) => {
  const id = params?.RenderingIdentifier;
  const features = fields?.data?.datasource?.children?.results;
  const useAccentColor = params?.styles.includes(FeatureStyles.UseAccentColor);

  return (
    <div className={`relative ${params?.styles}`} id={id || undefined}>
      <ul className="grid gap-6">
        {features?.map((feature) => (
          <FeatureItem
            key={feature.id}
            feature={feature}
            useAccentColor={useAccentColor}
            layout="horizontal"
          />
        ))}
      </ul>
    </div>
  );
};

export const Default = withDatasourceCheck()<FeaturesProps>(DefaultFeatures);
export const Simple = withDatasourceCheck()<FeaturesProps>(SimpleFeatures);
