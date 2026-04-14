'use client';

import React, { JSX, useState } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

export type HeaderProps = ComponentProps & {
  params: { [key: string]: string };
};

/**
 * Shell for Sitecore `Header` (componentName `Header`). UChicago has no shadcn Drawer — mobile
 * menu uses the same toggle pattern as {@link Navigation}.
 */
export const Default = (props: HeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;
  const phId = DynamicPlaceholderId ?? '1';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`component header relative border-b border-neutral-200 bg-white shadow-sm ${styles ?? ''}`}
      id={id}
    >
      <div className="container flex items-center gap-3 py-3 lg:gap-6">
        <div className="header-block *:shrink max-lg:w-full max-lg:justify-between lg:shrink-0">
          <Placeholder name={`header-left-${phId}`} rendering={props.rendering} />
        </div>

        <div className="hidden lg:flex lg:shrink lg:basis-full lg:justify-center">
          <Placeholder name={`header-nav-${phId}`} rendering={props.rendering} />
        </div>

        <div className="header-block hidden lg:flex lg:shrink-0">
          <Placeholder name={`header-right-${phId}`} rendering={props.rendering} />
        </div>

        <div
          className="z-50 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded border border-neutral-300 lg:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          onKeyDown={(e) => e.key === 'Enter' && setMenuOpen((o) => !o)}
          role="button"
          tabIndex={0}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} width={18} height={18} />
        </div>
      </div>

      <div
        className={`${
          menuOpen ? 'flex' : 'hidden'
        } absolute top-full right-0 left-0 z-[100] flex-col gap-4 border-b border-neutral-200 bg-white px-4 py-4 shadow-lg lg:hidden`}
      >
        <Placeholder name={`header-nav-${phId}`} rendering={props.rendering} />
        <Placeholder name={`header-right-${phId}`} rendering={props.rendering} />
      </div>
    </div>
  );
};
