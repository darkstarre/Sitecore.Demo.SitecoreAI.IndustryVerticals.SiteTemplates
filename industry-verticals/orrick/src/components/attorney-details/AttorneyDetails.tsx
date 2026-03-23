import React from 'react';
import Link from 'next/link';
import {
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  NextImage as ContentSdkImage,
  ImageField,
  Field,
  RichTextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/** Resolved item from Treelist / multilist fields (Layout / Edge shapes vary slightly). */
export type LinkedContentItem = {
  id?: string;
  url?: string;
  name?: string;
  displayName?: string;
  fields?: Record<string, Field<string> | undefined>;
};

export interface AttorneyFields {
  Title?: Field<string>;
  FullName?: Field<string>;
  JobTitle?: Field<string>;
  OfficeLocation?: Field<string>;
  PhoneNumber?: Field<string>;
  Email?: Field<string>;
  Address?: RichTextField;
  Photo?: ImageField;
  Bio?: RichTextField;
  Engagements?: RichTextField;
  Practices?: RichTextField;
  AdmittedIn?: RichTextField;
  CourtAdmissions?: RichTextField;
  Education?: RichTextField;
  Honors?: RichTextField;
  /** Treelist → Category Folder items (demo: taxonomy-driven practice list). */
  LinkedPracticeCategories?: unknown;
}

interface AttorneyDetailsProps extends ComponentProps {
  fields: AttorneyFields;
}

const richText = (html: string): RichTextField => ({
  value: `<div class="ck-content">${html}</div>`,
});

type AttorneySeed = {
  keys: string[];
  fields: AttorneyFields;
};

const ALI_ABUGHEIDA_DEFAULTS: AttorneyFields = {
  Title: { value: 'Ali Abugheida' },
  FullName: { value: 'Ali Abugheida' },
  JobTitle: { value: 'Partner' },
  OfficeLocation: { value: 'San Francisco' },
  PhoneNumber: { value: '+1 415 619 3418' },
  Email: { value: '[email protected]' },
  Address: richText(
    '<p>The Orrick Building<br/>405 Howard Street<br/>San Francisco, CA 94105-2669<br/>United States</p>'
  ),
  Bio: richText(
    '<p>Ali Abugheida represents corporate and individual clients in complex civil litigation and government enforcement matters, including fraud, breach of contract, TILA, RESPA, FDCPA, TCPA and unfair/deceptive trade-practice claims.</p><p>Before joining Orrick, Ali was a partner at Buckley LLP and began his career at WilmerHale.</p>'
  ),
  Engagements: richText(
    '<ul><li>Defended multiple PACE administrators in putative class actions, including a denial of class certification.</li><li>Defended a foreign bank in a $200M+ fraud action, resulting in dismissal at the pleading stage.</li><li>Represented financial institutions in enforcement matters involving CFPB, DFPI and District Attorneys.</li></ul>'
  ),
  Practices: richText(
    '<ul><li>Financial &amp; Fintech Advisory</li><li>Strategic Advisory &amp; Government Enforcement (SAGE)</li><li>Fintech</li><li>Financial Services Investigations &amp; Enforcement</li></ul>'
  ),
  AdmittedIn: richText('<ul><li>California</li></ul>'),
  CourtAdmissions: richText(
    '<p><strong>United States Courts of Appeals</strong></p><ul><li>First Circuit</li><li>Sixth Circuit</li><li>Ninth Circuit</li></ul><p><strong>United States District Courts</strong></p><ul><li>Eastern District of Texas</li><li>Eastern District of California</li><li>Central District of California</li><li>Northern District of California</li><li>Southern District of California</li></ul>'
  ),
  Education: richText(
    '<ul><li>University of Southern California Gould School of Law, J.D., 2012, <em>Order of the Coif</em></li><li>University of California, San Diego, B.A., 2009, <em>cum laude</em></li></ul>'
  ),
  Honors: richText('<ul><li>Editor, <em>Southern California Law Review</em></li></ul>'),
};

const RICHARD_GALLAGHER_DEFAULTS: AttorneyFields = {
  Title: { value: 'Richard Gallagher' },
  FullName: { value: 'Richard Gallagher' },
  JobTitle: { value: 'Chief Practice Officer Lit&IP' },
  OfficeLocation: { value: 'San Francisco' },
  Bio: richText(
    '<p>Richard (Rick) Gallagher has over two decades of experience litigating disputes in state and federal courts and handling corporate governance risk matters, including internal investigations and SEC/DOJ matters.</p>'
  ),
  Engagements: richText(
    '<ul><li>Represented a life sciences company in an SEC investigation that was terminated with no action.</li><li>Won dismissal of federal securities class actions for major financial and HR services organizations.</li><li>Represents private equity and asset management clients in post-closing and enforcement disputes.</li></ul>'
  ),
  Practices: richText(
    '<ul><li>Complex Litigation &amp; Dispute Resolution</li><li>White Collar, Investigations, Securities Litigation &amp; Compliance</li></ul>'
  ),
};

const ZACHARY_FINLEY_DEFAULTS: AttorneyFields = {
  Title: { value: 'Zachary Finley' },
  FullName: { value: 'Zachary Finley' },
  JobTitle: { value: 'Partner' },
  OfficeLocation: { value: 'San Francisco' },
  Bio: richText(
    '<p>Zachary Finley leads Orrick&apos;s global Banking &amp; Finance group and advises borrowers, lenders and sponsors on syndicated, private credit, project finance and restructuring transactions.</p><p>He is recognized for extensive data center and digital infrastructure financing experience.</p>'
  ),
  Engagements: richText(
    '<ul><li>Advised data center and digital infrastructure clients on financings exceeding billions in aggregate value.</li><li>Represented sponsors and portfolio companies on acquisition and recapitalization financings.</li><li>Represented arrangers and lenders in large secured credit and restructuring matters.</li></ul>'
  ),
  Practices: richText(
    '<ul><li>Banking &amp; Finance</li><li>Data Centers</li><li>Energy &amp; Infrastructure</li></ul>'
  ),
};

const DANIEL_YOST_DEFAULTS: AttorneyFields = {
  Title: { value: 'Daniel Yost' },
  FullName: { value: 'Daniel Yost' },
  JobTitle: { value: 'Partner' },
  OfficeLocation: { value: 'San Francisco; Silicon Valley' },
  Bio: richText(
    '<p>Daniel Yost negotiates complex commercial and technology transactions and advises on intellectual property strategy across software, life sciences, energy and emerging technologies.</p>'
  ),
  Engagements: richText(
    '<ul><li>Led technology, licensing and distribution arrangements across multiple innovation sectors.</li><li>Advised on collaborations, M&amp;A and strategic transactions for science-based companies.</li><li>Counsels on open-source compliance, data/privacy and commercialization strategy.</li></ul>'
  ),
  Practices: richText(
    '<ul><li>Technology Transactions</li><li>Intellectual Property</li><li>Technology Companies Group</li></ul>'
  ),
};

const KYLE_ZHU_DEFAULTS: AttorneyFields = {
  Title: { value: 'Kyle Zhu' },
  FullName: { value: 'Kyle Zhu' },
  JobTitle: { value: 'Senior Associate' },
  OfficeLocation: { value: 'New York' },
  Bio: richText(
    '<p>Kyle Zhu is a senior associate in Orrick&apos;s Mergers &amp; Acquisitions and Private Equity group, advising public and private clients on domestic and cross-border transactions.</p>'
  ),
  Engagements: richText(
    '<ul><li>Advised technology and AI clients on strategic acquisitions and exits.</li><li>Counseled energy and infrastructure clients in significant M&amp;A transactions.</li><li>Represented private equity and life sciences clients in buy-side and sell-side deals.</li></ul>'
  ),
  Practices: richText(
    '<ul><li>Mergers &amp; Acquisitions</li><li>Private Equity</li><li>Technology &amp; Innovation</li></ul>'
  ),
};

const ATTORNEY_SEED_DATA: AttorneySeed[] = [
  { keys: ['ali-abugheida', 'ali abugheida'], fields: ALI_ABUGHEIDA_DEFAULTS },
  {
    keys: ['richard-gallagher', 'richard gallagher', 'rick gallagher'],
    fields: RICHARD_GALLAGHER_DEFAULTS,
  },
  { keys: ['zachary-finley', 'zachary finley', 'zach finley'], fields: ZACHARY_FINLEY_DEFAULTS },
  { keys: ['daniel-yost', 'daniel yost'], fields: DANIEL_YOST_DEFAULTS },
  { keys: ['kyle-zhu', 'kyle zhu'], fields: KYLE_ZHU_DEFAULTS },
];

const getLinkedTargetItems = (field: unknown): LinkedContentItem[] => {
  if (field === undefined || field === null) return [];
  if (typeof field !== 'object') return [];
  const f = field as {
    targetItems?: LinkedContentItem[];
    jsonValue?: { targetItems?: LinkedContentItem[] };
    value?: unknown;
  };
  if (Array.isArray(f.targetItems) && f.targetItems.length > 0) {
    return f.targetItems;
  }
  if (f.jsonValue && Array.isArray(f.jsonValue.targetItems) && f.jsonValue.targetItems.length > 0) {
    return f.jsonValue.targetItems;
  }
  if (Array.isArray(f.value)) {
    return f.value as LinkedContentItem[];
  }
  return [];
};

const getItemTitle = (item: LinkedContentItem): string => {
  const raw = item.fields;
  const titleField =
    raw?.Title?.value ?? raw?.title?.value ?? raw?.Headline?.value ?? raw?.headline?.value;
  const fromFields =
    titleField !== undefined && titleField !== null ? String(titleField).trim() : '';
  return fromFields || item.displayName || item.name || 'Untitled';
};

const ItemHref = ({ href, children }: { href?: string; children: React.ReactNode }) => {
  if (!href?.trim()) {
    return <span>{children}</span>;
  }
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return (
      <a
        href={href}
        className="underline underline-offset-2 hover:opacity-80"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className="underline underline-offset-2 hover:opacity-80">
      {children}
    </Link>
  );
};

const hasFieldTextValue = (field?: Field<string>): boolean => {
  const value = field?.value;
  return value !== undefined && value !== null && String(value).trim().length > 0;
};

const hasRichTextValue = (field?: RichTextField): boolean => {
  const value = field?.value;
  return value !== undefined && value !== null && String(value).trim().length > 0;
};

const hasImageValue = (field?: ImageField): boolean => {
  const v = field?.value;
  if (v === undefined || v === null) return false;
  if (typeof v === 'string') return String(v).trim().length > 0;
  const src = (v as { src?: string }).src;
  return src !== undefined && String(src).trim().length > 0;
};

/**
 * Prefer non-empty CMS values; fill from seed without dropping Sitecore field metadata
 * (so empty `{ value: '' }` from layout does not wipe demo defaults or break inline edit).
 */
const mergeStringField = (
  incoming: Field<string> | undefined,
  seed: Field<string> | undefined
): Field<string> | undefined => {
  if (hasFieldTextValue(incoming)) return incoming;
  if (!seed) return incoming;
  if (!incoming) return seed;
  return { ...incoming, value: seed.value } as Field<string>;
};

const mergeRichTextField = (
  incoming: RichTextField | undefined,
  seed: RichTextField | undefined
): RichTextField | undefined => {
  if (hasRichTextValue(incoming)) return incoming;
  if (!seed) return incoming;
  if (!incoming) return seed;
  return { ...incoming, value: seed.value } as RichTextField;
};

const mergeImageField = (
  incoming: ImageField | undefined,
  seed: ImageField | undefined
): ImageField | undefined => {
  if (hasImageValue(incoming)) return incoming;
  if (!seed) return incoming;
  if (!incoming) return seed;
  return { ...incoming, value: seed.value } as ImageField;
};

const mergeAttorneyFieldsWithSeed = (
  seed: AttorneyFields | undefined,
  props: AttorneyFields
): AttorneyFields => {
  const s = seed ?? {};
  return {
    Title: mergeStringField(props.Title, s.Title),
    FullName: mergeStringField(props.FullName, s.FullName),
    JobTitle: mergeStringField(props.JobTitle, s.JobTitle),
    OfficeLocation: mergeStringField(props.OfficeLocation, s.OfficeLocation),
    PhoneNumber: mergeStringField(props.PhoneNumber, s.PhoneNumber),
    Email: mergeStringField(props.Email, s.Email),
    Address: mergeRichTextField(props.Address, s.Address),
    Photo: mergeImageField(props.Photo, s.Photo),
    Bio: mergeRichTextField(props.Bio, s.Bio),
    Engagements: mergeRichTextField(props.Engagements, s.Engagements),
    Practices: mergeRichTextField(props.Practices, s.Practices),
    AdmittedIn: mergeRichTextField(props.AdmittedIn, s.AdmittedIn),
    CourtAdmissions: mergeRichTextField(props.CourtAdmissions, s.CourtAdmissions),
    Education: mergeRichTextField(props.Education, s.Education),
    Honors: mergeRichTextField(props.Honors, s.Honors),
    LinkedPracticeCategories: props.LinkedPracticeCategories,
  };
};

const DetailSection = ({
  title,
  field,
  isPageEditing,
}: {
  title: string;
  field?: RichTextField;
  isPageEditing: boolean;
}) => (
  <section className="space-y-3">
    <h3 className="text-xl font-semibold">{title}</h3>
    {hasRichTextValue(field) ? (
      <ContentSdkRichText field={field} />
    ) : (
      <p
        className={`text-base ${
          isPageEditing ? 'text-foreground/80 dark:text-foreground-dark/80' : 'text-muted'
        }`}
      >
        {isPageEditing ? `[${title} content]` : 'Content coming soon.'}
      </p>
    )}
  </section>
);

/** Rich text and/or linked Sitecore items (Treelist) for demo-friendly “data-driven” sections. */
const LinkedDetailSection = ({
  title,
  linkedField,
  linkedCaption,
  richTextField,
  isPageEditing,
}: {
  title: string;
  linkedField?: unknown;
  linkedCaption: string;
  richTextField?: RichTextField;
  isPageEditing: boolean;
}) => {
  const linked = getLinkedTargetItems(linkedField);
  const hasLinks = linked.length > 0;
  const hasRich = hasRichTextValue(richTextField);

  return (
    <section className="space-y-3">
      <h3 className="text-xl font-semibold">{title}</h3>
      {hasLinks ? (
        <div className="space-y-2">
          <p className="text-muted dark:text-foreground-dark/70 text-sm italic">{linkedCaption}</p>
          <ul className="list-disc space-y-1 pl-5 text-base">
            {linked.map((item, index) => (
              <li key={item.id || `${getItemTitle(item)}-${index}`}>
                <ItemHref href={item.url}>{getItemTitle(item)}</ItemHref>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {hasRich ? (
        <div
          className={
            hasLinks ? 'border-border dark:border-border-dark mt-4 border-t pt-4' : undefined
          }
        >
          {hasLinks ? (
            <p className="text-muted dark:text-foreground-dark/70 mb-2 text-xs font-semibold tracking-wide uppercase">
              Additional detail
            </p>
          ) : null}
          <ContentSdkRichText field={richTextField} />
        </div>
      ) : null}
      {!hasLinks && !hasRich ? (
        <p
          className={`text-base ${
            isPageEditing ? 'text-foreground/80 dark:text-foreground-dark/80' : 'text-muted'
          }`}
        >
          {isPageEditing ? `[${title} content]` : 'Content coming soon.'}
        </p>
      ) : null}
    </section>
  );
};

export const Default = (props: AttorneyDetailsProps) => {
  const { page } = useSitecore();

  const id = props.params.RenderingIdentifier;
  const styles = `${props?.params?.styles || ''}`.trim();
  const isPageEditing = page.mode.isEditing;
  const routeName = page?.layout?.sitecore?.route?.name?.toLowerCase() || '';
  const fullName = props.fields?.FullName?.value?.toLowerCase() || '';
  const matchText = `${routeName} ${fullName}`;
  const matchedSeed = ATTORNEY_SEED_DATA.find((seed) =>
    seed.keys.some((key) => matchText.includes(key))
  );
  const fields: AttorneyFields = mergeAttorneyFieldsWithSeed(matchedSeed?.fields, props.fields);

  if (!fields?.Title && !fields?.FullName) {
    return isPageEditing ? (
      <div className={`component article-listing py-6 ${styles}`} id={id}>
        [Attorney Details]
      </div>
    ) : (
      <></>
    );
  }

  return (
    <section className={`relative py-16 ${styles}`} id={id || undefined}>
      <div className="container space-y-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="placeholder-pattern-background shadow-soft relative aspect-square overflow-hidden rounded-lg">
              <ContentSdkImage field={fields?.Photo} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="space-y-6 lg:col-span-5 lg:pt-2">
            <h1 className="mb-2">
              <ContentSdkText field={fields?.FullName} />
            </h1>
            <h5 className="text-accent">
              <ContentSdkText field={fields?.JobTitle} />
            </h5>
            {hasFieldTextValue(fields?.OfficeLocation) ? (
              <p className="text-sm font-medium tracking-wide uppercase">
                <ContentSdkText field={fields?.OfficeLocation} />
              </p>
            ) : null}
            <div className="text-lg">
              <ContentSdkRichText field={fields?.Bio} />
            </div>
          </div>
          <aside className="space-y-4 lg:col-span-3 lg:pt-2">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-2 text-sm">
              {hasFieldTextValue(fields?.PhoneNumber) ? (
                <p>
                  <span className="font-semibold">D: </span>
                  <ContentSdkText field={fields?.PhoneNumber} />
                </p>
              ) : (
                <p className={isPageEditing ? '' : 'text-muted'}>
                  <span className="font-semibold">D: </span>
                  {isPageEditing ? '[PhoneNumber]' : 'Not provided'}
                </p>
              )}
              {hasFieldTextValue(fields?.Email) ? (
                <p>
                  <span className="font-semibold">E: </span>
                  <ContentSdkText field={fields?.Email} />
                </p>
              ) : (
                <p className={isPageEditing ? '' : 'text-muted'}>
                  <span className="font-semibold">E: </span>
                  {isPageEditing ? '[Email]' : 'Not provided'}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <h5 className="text-base font-semibold">Address</h5>
              {hasRichTextValue(fields?.Address) ? (
                <ContentSdkRichText field={fields?.Address} />
              ) : (
                <p className={`text-sm ${isPageEditing ? '' : 'text-muted'}`}>
                  {isPageEditing ? '[Address content]' : 'Address not provided'}
                </p>
              )}
            </div>
          </aside>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <DetailSection
              title="Engagements"
              field={fields?.Engagements}
              isPageEditing={isPageEditing}
            />
          </div>
          <div className="space-y-8 lg:col-span-4">
            <LinkedDetailSection
              title="Practices"
              linkedField={fields?.LinkedPracticeCategories}
              linkedCaption="Linked practice areas — picked from the shared Category folder (taxonomy), not free‑typed lists."
              richTextField={fields?.Practices}
              isPageEditing={isPageEditing}
            />
            <DetailSection
              title="Admitted In"
              field={fields?.AdmittedIn}
              isPageEditing={isPageEditing}
            />
            <DetailSection
              title="Court Admissions"
              field={fields?.CourtAdmissions}
              isPageEditing={isPageEditing}
            />
            <DetailSection
              title="Education"
              field={fields?.Education}
              isPageEditing={isPageEditing}
            />
            <DetailSection title="Honors" field={fields?.Honors} isPageEditing={isPageEditing} />
          </div>
        </div>
      </div>
    </section>
  );
};
