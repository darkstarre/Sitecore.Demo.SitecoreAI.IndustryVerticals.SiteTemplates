import { ComponentProps } from '@/lib/component-props';
import {
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faSearch } from '@fortawesome/free-solid-svg-icons';

interface Fields {
  LogoLight: ImageField;
  LogoDark: ImageField;
  PhoneLink: LinkField;
  MailLink: LinkField;
}

interface HeaderProps extends ComponentProps {
  fields?: Partial<Fields>;
}

/** Top utility strip — layout inspired by https://www.uchicagomedicine.org/ (demo links only). */
const utilityLinks: { label: string; href: string }[] = [
  { label: 'Patients & Visitors', href: '/About-Us' },
  { label: 'Research & Clinical Trials', href: '#' },
  { label: 'For Clinicians', href: '#' },
  { label: 'Health & Science News', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Give', href: '#' },
  { label: 'MyChart', href: '#' },
];

function logoHasSrc(field: ImageField | undefined): boolean {
  const v = field?.value as { src?: string } | undefined;
  return typeof v?.src === 'string' && v.src.length > 0;
}

/** Wrong-tenant logos sometimes leak via shared Edge tenants or CM overrides — never show them here. */
function logoFieldIsForeignVertical(field: ImageField | undefined): boolean {
  const v = field?.value as { src?: string; alt?: string } | undefined;
  const haystack = `${v?.src ?? ''} ${v?.alt ?? ''}`.toLowerCase();
  return haystack.includes('gridwell');
}

function linkHasHref(field: LinkField | undefined): boolean {
  const v = field?.value as { href?: string } | undefined;
  return typeof v?.href === 'string' && v.href.length > 0;
}

/**
 * Renders without `withDatasourceCheck` so the utility bar and shell always appear when the
 * Header Extended rendering is on the page (missing datasource was hiding the entire header).
 */
export const Default = (props: HeaderProps) => {
  const id = props.params.RenderingIdentifier;
  const f = props.fields ?? (props.rendering?.fields as Partial<Fields> | undefined);
  const logoLight = f?.LogoLight;
  const logoDark = f?.LogoDark;
  const showLogoLight = logoHasSrc(logoLight) && !logoFieldIsForeignVertical(logoLight);
  const showLogoDark = logoHasSrc(logoDark) && !logoFieldIsForeignVertical(logoDark);
  /** Matches serialized partial design keys `header-extended-nav-3` when CM omits params. */
  const phId = props.params?.DynamicPlaceholderId ?? '3';

  return (
    <section
      className={`ucm-header text-neutral-900 ${props.params.styles ?? ''}`}
      id={id ? id : undefined}
    >
      <div className="bg-[#3d3d3d] text-[0.8125rem] text-white">
        <div className="container flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-1 flex max-w-full flex-wrap items-center gap-x-0 gap-y-1 overflow-x-auto px-1 sm:flex-nowrap sm:overflow-visible">
            {utilityLinks.map((item, i) => (
              <span key={item.label} className="inline-flex items-center">
                {i > 0 ? <span className="mx-2 text-neutral-500" aria-hidden="true" /> : null}
                <Link
                  href={item.href}
                  className="whitespace-nowrap hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </div>
          <Link
            href="#"
            className="shrink-0 font-medium text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Comer Children&apos;s Hospital
          </Link>
        </div>
      </div>

      <div className="border-b border-neutral-200 bg-white shadow-sm">
        <div className="container flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:gap-6">
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center lg:max-w-[28rem]">
            <div className="shrink-0">
              <Link href={'/'} className="block">
                {showLogoLight ? (
                  <ContentSdkImage
                    field={logoLight!}
                    width={320}
                    height={42}
                    className="dark:hidden"
                    priority
                  />
                ) : (
                  <span className="block py-1 text-lg font-semibold tracking-tight text-[#6d1325] dark:hidden">
                    UChicago Medicine
                  </span>
                )}
                {showLogoDark ? (
                  <ContentSdkImage
                    field={logoDark!}
                    width={320}
                    height={42}
                    className="hidden dark:block"
                    priority
                  />
                ) : (
                  <span className="hidden py-1 text-lg font-semibold tracking-tight text-[#6d1325] dark:block">
                    UChicago Medicine
                  </span>
                )}
              </Link>
            </div>
            <p className="hidden max-w-[12.5rem] text-xs leading-snug font-semibold tracking-wide text-neutral-600 sm:block lg:text-[0.8125rem]">
              At the Forefront of Medicine
            </p>
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:justify-end">
            <div className="min-w-0 flex-1 lg:max-w-none">
              <Placeholder name={`header-extended-nav-${phId}`} rendering={props.rendering} />
            </div>
            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-neutral-100 pt-3 lg:border-t-0 lg:pt-0">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                aria-label="Search"
              >
                <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
              </button>
              <div className="hidden sm:block">
                <Placeholder
                  name={`header-extended-theme-switcher-${phId}`}
                  rendering={props.rendering}
                />
              </div>
              <div className="flex items-center gap-2 border-l border-neutral-200 pl-3">
                {linkHasHref(f?.MailLink) ? (
                  <ContentSdkLink
                    field={f!.MailLink!}
                    className="flex h-9 w-9 items-center justify-center rounded text-[#6d1325] hover:bg-neutral-100"
                  >
                    <FontAwesomeIcon icon={faEnvelope} width={16} height={16} />
                  </ContentSdkLink>
                ) : (
                  <a
                    href="mailto:info@uchospitals.edu"
                    className="flex h-9 w-9 items-center justify-center rounded text-[#6d1325] hover:bg-neutral-100"
                    aria-label="Email"
                  >
                    <FontAwesomeIcon icon={faEnvelope} width={16} height={16} />
                  </a>
                )}
                {linkHasHref(f?.PhoneLink) ? (
                  <ContentSdkLink
                    field={f!.PhoneLink!}
                    className="flex h-9 w-9 items-center justify-center rounded text-[#6d1325] hover:bg-neutral-100"
                  >
                    <FontAwesomeIcon icon={faPhone} width={14} height={14} />
                  </ContentSdkLink>
                ) : (
                  <a
                    href="tel:18888240200"
                    className="flex h-9 w-9 items-center justify-center rounded text-[#6d1325] hover:bg-neutral-100"
                    aria-label="Phone"
                  >
                    <FontAwesomeIcon icon={faPhone} width={14} height={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
