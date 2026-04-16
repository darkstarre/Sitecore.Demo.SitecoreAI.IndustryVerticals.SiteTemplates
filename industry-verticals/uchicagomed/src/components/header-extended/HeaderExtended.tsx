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
      className={`bg-background dark:bg-background-dark border-border relative border-b py-0 ${props.params.styles}`}
      id={id ? id : undefined}
    >
      <div className="border-border bg-background-secondary border-b py-2 text-xs">
        <div className="container hidden items-center justify-between gap-4 lg:flex">
          <ul className="text-foreground/80 flex flex-wrap items-center gap-4">
            {utilityLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-accent transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="text-foreground/80 flex items-center gap-4">
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
      <div className="container flex items-center gap-3 py-4 lg:gap-6">
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
            className="bg-accent border-accent hover:bg-accent/90 px-5 py-2.5 text-xs font-semibold tracking-[0.08em] text-white uppercase transition-colors"
          >
            Schedule an Appointment
          </ContentSdkLink>
        </div>
      </div>
    </section>
  );
};

export const Default = withDatasourceCheck()<HeaderProps>(DefaultHeaderExtended);
