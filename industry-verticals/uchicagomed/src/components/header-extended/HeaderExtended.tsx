import { ComponentProps } from '@/lib/component-props';
import {
  ImageField,
  LinkField,
  Link as ContentSdkLink,
  Placeholder,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

interface Fields {
  LogoLight: ImageField;
  LogoDark: ImageField;
  PhoneLink: LinkField;
  MailLink: LinkField;
}

interface HeaderProps extends ComponentProps {
  fields: Fields;
}

export const DefaultHeaderExtended = (props: HeaderProps) => {
  const id = props.params.RenderingIdentifier;
  const utilityLinks = [
    { label: 'Patients & Visitors', href: '#' },
    { label: 'Research & Clinical Trials', href: '#' },
    { label: 'For Clinicians', href: '#' },
    { label: 'Health & Science News', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Give', href: '#' },
    { label: 'MyChart', href: '#' },
  ];

  return (
    <section
      className={`bg-background dark:bg-background-dark relative border-b border-slate-200 py-0 dark:border-slate-700 ${props.params.styles}`}
      id={id ? id : undefined}
    >
      <div className="border-b border-slate-200 bg-slate-50 py-2 text-xs dark:border-slate-700 dark:bg-slate-900">
        <div className="container hidden items-center justify-between gap-4 lg:flex">
          <ul className="flex flex-wrap items-center gap-4 text-slate-700 dark:text-slate-200">
            {utilityLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-brand-primary transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4 text-slate-700 dark:text-slate-200">
            <ContentSdkLink
              field={props.fields.MailLink}
              className="inline-flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faEnvelope} width={14} height={14} />
              <span>Email</span>
            </ContentSdkLink>
            <ContentSdkLink
              field={props.fields.PhoneLink}
              className="inline-flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPhone} width={14} height={14} />
              <span>1-888-824-0200</span>
            </ContentSdkLink>
          </div>
        </div>
      </div>
      <div className="container flex items-center gap-3 py-5 lg:gap-6">
        <div className="mr-auto max-w-58">
          <Link href={'/'}>
            <Image
              src="/ucm-logo-horizontal.jpg"
              alt="UChicago Medicine"
              width={360}
              height={48}
              className="h-auto w-auto max-w-full"
              priority
            />
          </Link>
        </div>
        <div className="order-last lg:order-none lg:flex-1">
          <Placeholder
            name={`header-extended-nav-${props?.params?.DynamicPlaceholderId}`}
            rendering={props.rendering}
          />
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <ContentSdkLink
            field={props.fields.PhoneLink}
            className="rounded-sm bg-[#8c1515] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#7b1212]"
          >
            Schedule an Appointment
          </ContentSdkLink>
        </div>
      </div>
    </section>
  );
};

export const Default = withDatasourceCheck()<HeaderProps>(DefaultHeaderExtended);
