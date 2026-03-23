import {
  Field,
  RichTextField,
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import React from 'react';

type PortalDashboardFields = {
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

type PortalDashboardProps = ComponentProps & {
  fields: PortalDashboardFields;
};

const richTextFallback = (html: string): RichTextField => ({
  value: `<div class="ck-content">${html}</div>`,
});

const fallbackFields: Required<PortalDashboardFields> = {
  PortalLabel: { value: 'Internal Portal' },
  WelcomeTitle: { value: 'Welcome back, Orrick Legal Operations' },
  IntroText: richTextFallback(
    '<p>Centralize legal workflows, policy updates, approvals and shared resources in one place.</p>'
  ),
  SearchPlaceholder: { value: 'Search matters, templates, policies, or people' },
  SearchButtonText: { value: 'Search Portal' },
  AnnouncementsTitle: { value: 'Announcements' },
  AnnouncementsContent: richTextFallback(
    '<ul><li>Quarterly compliance training due Friday.</li><li>Client portal upgrade this weekend.</li><li>Updated conflict-check workflow now requires additional fields.</li></ul>'
  ),
  TasksTitle: { value: 'My Tasks' },
  TasksContent: richTextFallback(
    '<ul><li>Review NDA redlines for Project Northstar.</li><li>Approve outside counsel invoice batch.</li><li>Prepare Q2 board meeting legal summary.</li></ul>'
  ),
  QuickLinksTitle: { value: 'Quick Links' },
  QuickLinksContent: richTextFallback(
    '<ul><li><a href="/portal?view=matter-intake">Matter Intake</a></li><li><a href="/portal?view=time-entry">Time Entry</a></li><li><a href="/portal?view=knowledge-base">Knowledge Base</a></li></ul>'
  ),
  ApprovalsTitle: { value: 'My Approvals' },
  ApprovalsContent: richTextFallback(
    '<ul><li><a href="/portal?view=approval-ocg">Outside Counsel Guideline Exception - Due Today</a></li><li><a href="/portal?view=approval-dpa">Vendor DPA - Analytics Platform - Due Tomorrow</a></li></ul>'
  ),
  TodayTitle: { value: 'Today' },
  TodayContent: richTextFallback(
    '<ul><li>Litigation team standup - 9:30 AM</li><li>M&A diligence review - 11:00 AM</li><li>Client advisory prep - 2:00 PM</li></ul>'
  ),
  DocumentsTitle: { value: 'Shared Documents' },
  DocumentsContent: richTextFallback(
    '<ul><li>Master Services Agreement Template</li><li>Data Processing Addendum (Global)</li><li>Incident Response Runbook</li></ul>'
  ),
};

const mergeFields = (fields?: PortalDashboardFields): Required<PortalDashboardFields> => ({
  PortalLabel: fields?.PortalLabel || fallbackFields.PortalLabel,
  WelcomeTitle: fields?.WelcomeTitle || fallbackFields.WelcomeTitle,
  IntroText: fields?.IntroText || fallbackFields.IntroText,
  SearchPlaceholder: fields?.SearchPlaceholder || fallbackFields.SearchPlaceholder,
  SearchButtonText: fields?.SearchButtonText || fallbackFields.SearchButtonText,
  AnnouncementsTitle: fields?.AnnouncementsTitle || fallbackFields.AnnouncementsTitle,
  AnnouncementsContent: fields?.AnnouncementsContent || fallbackFields.AnnouncementsContent,
  TasksTitle: fields?.TasksTitle || fallbackFields.TasksTitle,
  TasksContent: fields?.TasksContent || fallbackFields.TasksContent,
  QuickLinksTitle: fields?.QuickLinksTitle || fallbackFields.QuickLinksTitle,
  QuickLinksContent: fields?.QuickLinksContent || fallbackFields.QuickLinksContent,
  ApprovalsTitle: fields?.ApprovalsTitle || fallbackFields.ApprovalsTitle,
  ApprovalsContent: fields?.ApprovalsContent || fallbackFields.ApprovalsContent,
  TodayTitle: fields?.TodayTitle || fallbackFields.TodayTitle,
  TodayContent: fields?.TodayContent || fallbackFields.TodayContent,
  DocumentsTitle: fields?.DocumentsTitle || fallbackFields.DocumentsTitle,
  DocumentsContent: fields?.DocumentsContent || fallbackFields.DocumentsContent,
});

const PortalDashboardBase = ({ fields }: { fields?: PortalDashboardFields }) => {
  const content = mergeFields(fields);

  return (
    <section className="bg-background py-14">
      <div className="container space-y-8">
        <div className="border-border bg-background-accent rounded-lg border p-6">
          <p className="text-foreground-light text-sm font-medium">
            <ContentSdkText field={content.PortalLabel} />
          </p>
          <h1 className="text-foreground mt-2 text-3xl font-semibold lg:text-4xl">
            <ContentSdkText field={content.WelcomeTitle} />
          </h1>
          <div className="text-foreground-light mt-3 max-w-3xl">
            <ContentSdkRichText field={content.IntroText} />
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              placeholder={content.SearchPlaceholder.value}
              className="border-border bg-background text-foreground placeholder-foreground-light focus:border-accent focus:ring-accent w-full rounded-md border px-4 py-2.5 text-sm focus:ring-2 focus:outline-none"
            />
            <button className="bg-accent hover:bg-accent-hover rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-colors">
              <ContentSdkText field={content.SearchButtonText} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="border-border bg-background rounded-lg border p-6 lg:col-span-2">
            <h2 className="text-foreground text-xl font-semibold">
              <ContentSdkText field={content.AnnouncementsTitle} />
            </h2>
            <div className="mt-4 text-sm">
              <ContentSdkRichText field={content.AnnouncementsContent} />
            </div>
          </article>
          <article className="border-border bg-background rounded-lg border p-6">
            <h2 className="text-foreground text-xl font-semibold">
              <ContentSdkText field={content.TasksTitle} />
            </h2>
            <div className="mt-4 text-sm">
              <ContentSdkRichText field={content.TasksContent} />
            </div>
          </article>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="border-border bg-background rounded-lg border p-6 lg:col-span-2">
            <h2 className="text-foreground text-xl font-semibold">
              <ContentSdkText field={content.QuickLinksTitle} />
            </h2>
            <div className="mt-4 text-sm">
              <ContentSdkRichText field={content.QuickLinksContent} />
            </div>
          </article>
          <article className="border-border bg-background rounded-lg border p-6">
            <h2 className="text-foreground text-xl font-semibold">
              <ContentSdkText field={content.ApprovalsTitle} />
            </h2>
            <div className="mt-4 text-sm">
              <ContentSdkRichText field={content.ApprovalsContent} />
            </div>
          </article>
        </div>

        <article className="border-border bg-background rounded-lg border p-6">
          <h2 className="text-foreground text-xl font-semibold">
            <ContentSdkText field={content.TodayTitle} />
          </h2>
          <div className="mt-4 text-sm">
            <ContentSdkRichText field={content.TodayContent} />
          </div>
        </article>

        <article className="border-border bg-background rounded-lg border p-6">
          <h2 className="text-foreground text-xl font-semibold">
            <ContentSdkText field={content.DocumentsTitle} />
          </h2>
          <div className="mt-4 text-sm">
            <ContentSdkRichText field={content.DocumentsContent} />
          </div>
        </article>
      </div>
    </section>
  );
};

export const PortalDashboardFallback = () => <PortalDashboardBase />;

export const Default = (props: PortalDashboardProps) => (
  <PortalDashboardBase fields={props.fields} />
);

export default withDatasourceCheck()<PortalDashboardProps>(Default);
