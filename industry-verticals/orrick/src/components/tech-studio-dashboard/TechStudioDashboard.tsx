import { Field, RichTextField, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import React from 'react';
import { TechStudioBackdropLayers } from './TechStudioBackdropLayers';
import { TechStudioExperience } from './TechStudioExperience';

/**
 * Same field shape as `PortalDashboard` — mirror datasource template fields in Sitecore.
 * Default copy is inspired by the public hub: https://www.orrick.com/tech-studio
 */
export type TechStudioDashboardFields = {
  PortalLabel?: Field<string>;
  WelcomeTitle?: Field<string>;
  IntroText?: RichTextField;
  SearchPlaceholder?: Field<string>;
  SearchButtonText?: Field<string>;
  AnnouncementsTitle?: Field<string>;
  AnnouncementsContent?: RichTextField;
  TasksTitle?: Field<string>;
  TasksContent?: RichTextField;
  QuickLinksTitle?: Field<string>;
  QuickLinksContent?: RichTextField;
  ApprovalsTitle?: Field<string>;
  ApprovalsContent?: RichTextField;
  TodayTitle?: Field<string>;
  TodayContent?: RichTextField;
  DocumentsTitle?: Field<string>;
  DocumentsContent?: RichTextField;
};

type TechStudioDashboardProps = ComponentProps & {
  fields: TechStudioDashboardFields;
};

const richTextFallback = (html: string): RichTextField => ({
  value: `<div class="ck-content">${html}</div>`,
});

const emptyRich = (): RichTextField => ({ value: '<div class="ck-content"></div>' });

const fallbackFields: Required<TechStudioDashboardFields> = {
  PortalLabel: { value: 'Orrick Tech Studio' },
  WelcomeTitle: {
    value: 'For innovators, from innovators — legal & business resources to scale your business',
  },
  IntroText: richTextFallback(
    '<p>Welcome to Tech Studio: a self-service resource to help companies grow and thrive at every stage—from formation and IP to fundraising, governance, and exit.</p>'
  ),
  SearchPlaceholder: { value: 'Search resources, tools, topics, or regions' },
  SearchButtonText: { value: 'Search' },
  AnnouncementsTitle: { value: 'Featured' },
  AnnouncementsContent: emptyRich(),
  TasksTitle: { value: 'Trending topics' },
  TasksContent: emptyRich(),
  QuickLinksTitle: { value: 'Regions' },
  QuickLinksContent: emptyRich(),
  ApprovalsTitle: { value: 'Forms & tools' },
  ApprovalsContent: emptyRich(),
  TodayTitle: { value: 'Insights' },
  TodayContent: emptyRich(),
  DocumentsTitle: { value: 'Videos' },
  DocumentsContent: emptyRich(),
};

const mergeRich = (incoming: RichTextField | undefined, fallback: RichTextField): RichTextField => {
  const v = incoming?.value;
  if (
    incoming &&
    v != null &&
    String(v)
      .replace(/<[^>]+>/g, '')
      .trim().length > 0
  ) {
    return incoming;
  }
  return fallback;
};

const mergeFields = (fields?: TechStudioDashboardFields): Required<TechStudioDashboardFields> => ({
  PortalLabel: fields?.PortalLabel || fallbackFields.PortalLabel,
  WelcomeTitle: fields?.WelcomeTitle || fallbackFields.WelcomeTitle,
  IntroText: mergeRich(fields?.IntroText, fallbackFields.IntroText),
  SearchPlaceholder: fields?.SearchPlaceholder || fallbackFields.SearchPlaceholder,
  SearchButtonText: fields?.SearchButtonText || fallbackFields.SearchButtonText,
  AnnouncementsTitle: fields?.AnnouncementsTitle || fallbackFields.AnnouncementsTitle,
  AnnouncementsContent: mergeRich(
    fields?.AnnouncementsContent,
    fallbackFields.AnnouncementsContent
  ),
  TasksTitle: fields?.TasksTitle || fallbackFields.TasksTitle,
  TasksContent: mergeRich(fields?.TasksContent, fallbackFields.TasksContent),
  QuickLinksTitle: fields?.QuickLinksTitle || fallbackFields.QuickLinksTitle,
  QuickLinksContent: mergeRich(fields?.QuickLinksContent, fallbackFields.QuickLinksContent),
  ApprovalsTitle: fields?.ApprovalsTitle || fallbackFields.ApprovalsTitle,
  ApprovalsContent: mergeRich(fields?.ApprovalsContent, fallbackFields.ApprovalsContent),
  TodayTitle: fields?.TodayTitle || fallbackFields.TodayTitle,
  TodayContent: mergeRich(fields?.TodayContent, fallbackFields.TodayContent),
  DocumentsTitle: fields?.DocumentsTitle || fallbackFields.DocumentsTitle,
  DocumentsContent: mergeRich(fields?.DocumentsContent, fallbackFields.DocumentsContent),
});

const TechStudioDashboardBase = ({ fields }: { fields?: TechStudioDashboardFields }) => {
  const content = mergeFields(fields);

  return (
    <section className="relative w-full min-w-0 flex-[1_1_100%] overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 py-16 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <TechStudioBackdropLayers />
      <div className="relative z-10 w-full max-w-none space-y-10 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <TechStudioExperience content={content} />
      </div>
    </section>
  );
};

export const TechStudioDashboardFallback = () => <TechStudioDashboardBase />;

export const Default = (props: TechStudioDashboardProps) => (
  <TechStudioDashboardBase fields={props.fields} />
);

export default withDatasourceCheck()<TechStudioDashboardProps>(Default);
