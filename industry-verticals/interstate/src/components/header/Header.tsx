import React, { JSX } from 'react';
import Link from 'next/link';
import { ComponentProps } from '@/lib/component-props';
import { Placeholder } from '@sitecore-content-sdk/nextjs';

export type HeaderProps = ComponentProps & {
  params: { [key: string]: string };
};

export const Default = (props: HeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;

  return (
    <div className={`component header bg-background border-b border-[#cfe0bf] ${styles}`} id={id}>
      <div className="bg-[#79be43] py-2 text-center text-xs font-bold tracking-[0.14em] text-white uppercase">
        America&apos;s #1 replacement battery network
      </div>
      <div className="container flex items-center gap-3 py-3 lg:gap-5">
        <div className="max-lg:order-1 lg:flex-[1_1]">
          <Link href="/" className="inline-flex items-baseline gap-1.5">
            <span className="text-2xl font-black tracking-tight text-[#0d2f5f] uppercase">
              Interstate
            </span>
            <span className="text-xs font-extrabold tracking-[0.12em] text-[#6db83d] uppercase">
              Batteries
            </span>
          </Link>
        </div>
        <div className="max-lg:order-0 max-lg:mr-auto max-lg:w-2/3 lg:flex-[4_1]">
          <Placeholder name={`header-nav-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>
        <div className="max-lg:order-2 lg:flex-[1_1]">
          <Placeholder name={`header-right-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>
      </div>
    </div>
  );
};
