'use client';

import React from 'react';
import {
  ImageField,
  ComponentRendering,
  ComponentParams,
  Placeholder,
  withDatasourceCheck,
  TextField,
  Text,
} from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { CommonStyles } from '@/types/styleFlags';

const ORRICK_LOGO_URL =
  'https://upload.wikimedia.org/wikipedia/commons/1/19/Orrick_Herrington_%26_Sutcliffe_logo.svg';

const LEGAL_NOTICE_LINKS = [
  { label: 'Legal Notices', href: '#' },
  { label: 'Privacy Notice', href: '#' },
  { label: 'Cookie Notice', href: '#' },
  { label: 'Attorney Advertising', href: '#' },
  { label: 'Secure Login', href: '#' },
];

const ORRICK_LOCATIONS = [
  'Austin',
  'Beijing',
  'Boston',
  'Brussels',
  'Charlotte',
  'Chicago',
  'Dusseldorf',
  'Houston',
  'London',
  'Los Angeles',
  'Miami',
  'Milan',
  'Munich',
  'New York',
  'Orange County',
  'Paris',
  'Portland',
  'Rome',
  'Sacramento',
  'San Francisco',
  'Santa Monica',
  'Seattle',
  'Silicon Valley',
  'Singapore',
  'Tokyo',
  'Washington, D.C.',
  'Wheeling, WV, (GOIC)',
];

interface Fields {
  Logo: ImageField;
  LogoDark: ImageField;
  TitleOne: TextField;
  TitleTwo: TextField;
  TitleThree: TextField;
  TitleFour: TextField;
}

type FooterProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

const DefaultFooter = (props: FooterProps) => {
  const id = props.params.RenderingIdentifier;

  // placeholders keys
  const phKeyOne = `footer-list-first-${props?.params?.DynamicPlaceholderId}`;
  const phKeyTwo = `footer-list-second-${props?.params?.DynamicPlaceholderId}`;
  const phKeyThree = `footer-list-third-${props?.params?.DynamicPlaceholderId}`;
  const phKeyFour = `footer-list-fourth-${props?.params?.DynamicPlaceholderId}`;
  const phKeyFive = `footer-list-fifth-${props?.params?.DynamicPlaceholderId}`;

  // styles to hide and show sections
  const hideTopSection = props.params?.Styles?.includes(CommonStyles.HideTopSection) || undefined;
  const hideBottomSection =
    props.params?.Styles?.includes(CommonStyles.HideBottomSection) || undefined;

  return (
    <section className={`relative ${props.params.styles} overflow-hidden`} id={id ? id : undefined}>
      {/* footer top section */}
      {!hideTopSection && (
        <div className="bg-background-secondary dark:bg-background-secondary-dark pt-24 pb-16">
          {/* svg accent background */}
          <div className="text-background dark:text-background-dark pointer-events-none absolute -top-px -right-px left-0 leading-none">
            <svg
              viewBox="0 0 1613.26 511.77"
              xmlns="http://www.w3.org/2000/svg"
              className="h-auto w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0V319.73H.02c.95-649,1546.56-112.85,1611.06-90.19h1.67V0H0Z"
                fill="currentColor"
              />
            </svg>
          </div>
          {/* footer top section */}
          <div className="relative z-20 container">
            {/* logo section */}
            <Link href={'/'} className="mb-12 inline-block max-w-50">
              <Image
                src={ORRICK_LOGO_URL}
                alt="Orrick"
                width={300}
                height={169}
                className="h-auto w-full max-w-[220px]"
                priority
              />
            </Link>
            {/* content section */}
            <div className="space-y-4">
              <div>
                <Placeholder name={phKeyFive} rendering={props.rendering} />
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                {LEGAL_NOTICE_LINKS.map((link, index) => (
                  <React.Fragment key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                    {index < LEGAL_NOTICE_LINKS.length - 1 ? <span>|</span> : null}
                  </React.Fragment>
                ))}
              </div>

              <p className="text-sm">© 2026 Orrick, Herrington &amp; Sutcliffe LLP. All rights reserved.</p>

              <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
                {ORRICK_LOCATIONS.map((location, index) => (
                  <React.Fragment key={location}>
                    <span>{location}</span>
                    {index < ORRICK_LOCATIONS.length - 1 ? <span>|</span> : null}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* footer bottom section */}
      {!hideBottomSection && !hideTopSection && false && (
        <div className="container py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="mr-auto" />
          </div>
        </div>
      )}
    </section>
  );
};

export const Default = withDatasourceCheck()<FooterProps>(DefaultFooter);
