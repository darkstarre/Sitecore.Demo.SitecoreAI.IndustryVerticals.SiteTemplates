'use client';

import React, { useState } from 'react';
import { Link, TextField, useSitecore } from '@sitecore-content-sdk/nextjs';
import NextLink from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getLinkField, getNavigationText } from '@/helpers/navHelpers';

export interface NavItemFields {
  Id: string;
  DisplayName: string;
  Title: TextField;
  NavigationTitle: TextField;
  Href: string;
  Querystring: string;
  Children?: Array<NavItemFields>;
  Styles: string[];
}

export type NavigationListProps = {
  fields: NavItemFields;
  handleClick: (event?: React.MouseEvent<HTMLElement>) => void;
  relativeLevel: number;
};

type NavigationProps = {
  params?: { [key: string]: string };
  fields: Record<string, NavItemFields>;
};

/** Primary links when CMS navigation has not been resolved (matches demo IA + reference site labels). */
const FALLBACK_PRIMARY: { href: string; label: string }[] = [
  { href: '/', label: 'Home' },
  { href: '/Doctors', label: 'Find a Doctor' },
  { href: '/About-Us', label: 'Find a Location' },
  { href: '/Services', label: 'Conditions & Services' },
];

export const Default = (props: NavigationProps) => {
  const [isOpenMenu, openMenu] = useState(false);
  const { page } = useSitecore();
  const styles =
    props.params != null
      ? `${props.params.GridParameters ?? ''} ${props?.params?.Styles ?? ''}`.trimEnd()
      : '';
  const id = props.params != null ? props.params.RenderingIdentifier : null;

  const fieldEntries = Object.values(props.fields).filter(Boolean);
  const hasFields = fieldEntries.length > 0;
  /** Always use demo links when Edge/CM returns no navigation field data (including Experience Editor). */
  const showFallback = !hasFields;

  const handleToggleMenu = (event?: React.MouseEvent<HTMLElement>, flag?: boolean): void => {
    if (event && page.mode.isEditing) {
      event.preventDefault();
    }

    if (flag !== undefined) {
      return openMenu(flag);
    }

    openMenu(!isOpenMenu);
  };

  if (showFallback) {
    return (
      <div className={`component navigation ucm-primary-nav ${styles}`} id={id ? id : undefined}>
        {page.mode.isEditing ? (
          <p className="mb-2 rounded bg-amber-50 px-2 py-1 text-xs text-amber-900 ring-1 ring-amber-200">
            Preview menu (no navigation data). Assign a navigation root in the rendering so this
            replaces with CMS-driven links.
          </p>
        ) : null}
        <div
          className="z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded border border-neutral-300 lg:hidden"
          onClick={() => handleToggleMenu()}
          onKeyDown={(e) => e.key === 'Enter' && handleToggleMenu()}
          role="button"
          tabIndex={0}
          aria-expanded={isOpenMenu}
          aria-label={isOpenMenu ? 'Close menu' : 'Open menu'}
        >
          <FontAwesomeIcon icon={isOpenMenu ? faTimes : faBars} width={18} height={18} />
        </div>
        <nav
          className={`${
            isOpenMenu ? 'flex' : 'hidden'
          } absolute top-full right-0 left-0 z-[100] border-b border-neutral-200 bg-white py-4 shadow-lg lg:static lg:flex lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          <ul className="container flex flex-col gap-1 lg:mx-0 lg:flex-row lg:flex-wrap lg:items-center lg:gap-1 xl:gap-2">
            {FALLBACK_PRIMARY.map((item) => (
              <li key={item.href}>
                <NextLink
                  href={item.href}
                  className="block rounded px-3 py-2 text-[0.9375rem] font-medium text-neutral-800 hover:bg-neutral-100 hover:text-[#6d1325] lg:inline-block lg:py-1"
                  onClick={() => handleToggleMenu(undefined, false)}
                >
                  {item.label}
                </NextLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }

  const list = fieldEntries.map((element: NavItemFields, key: number) => (
    <NavigationList
      key={`${key}${element.Id}`}
      fields={element}
      handleClick={(event: React.MouseEvent<HTMLElement>) => handleToggleMenu(event, false)}
      relativeLevel={1}
    />
  ));

  return (
    <div className={`component navigation ucm-primary-nav ${styles}`} id={id ? id : undefined}>
      <div
        className="z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded border border-neutral-300 lg:hidden"
        onClick={() => handleToggleMenu()}
        onKeyDown={(e) => e.key === 'Enter' && handleToggleMenu()}
        role="button"
        tabIndex={0}
        aria-expanded={isOpenMenu}
        aria-label={isOpenMenu ? 'Close menu' : 'Open menu'}
      >
        <FontAwesomeIcon icon={isOpenMenu ? faTimes : faBars} width={18} height={18} />
      </div>

      <div className="component-content">
        <nav
          className={`${
            isOpenMenu ? 'flex' : 'hidden'
          } absolute top-full right-0 left-0 z-[100] border-b border-neutral-200 bg-white py-4 shadow-lg lg:static lg:flex lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          <ul className="container flex flex-col gap-1 lg:mx-0 lg:flex-row lg:flex-wrap lg:items-center lg:gap-1 xl:gap-2">
            {list}
          </ul>
        </nav>
      </div>
    </div>
  );
};

const NavigationList = (props: NavigationListProps) => {
  const { page } = useSitecore();
  const [active, setActive] = useState(false);
  const classNameList = `${props?.fields?.Styles.concat('rel-level' + props.relativeLevel).join(
    ' '
  )}`;

  const isRootItem = props.fields.Styles.includes('level0');

  let children: React.JSX.Element[] = [];
  if (props.fields.Children && props.fields.Children.length) {
    children = props.fields.Children.map((element: NavItemFields, index: number) => (
      <NavigationList
        key={`${index}${element.Id}`}
        fields={element}
        handleClick={props.handleClick}
        relativeLevel={props.relativeLevel + 1}
      />
    ));
  }

  return (
       <li
      className={`${classNameList} group relative flex flex-col ${active ? 'active' : ''}`}
      key={props.fields.Id}
      tabIndex={0}
    >
      <div className="flex items-center gap-1">
        <Link
          field={getLinkField(props)}
          editable={page.mode.isEditing}
          onClick={props.handleClick}
          className={`whitespace-nowrap rounded px-3 py-2 text-[0.9375rem] font-medium text-neutral-800 hover:bg-neutral-100 hover:text-[#6d1325] lg:py-1 ${
            isRootItem ? 'tracking-normal' : ''
          }`}
        >
          {getNavigationText(props)}
        </Link>
        {children.length > 0 && !isRootItem ? (
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center lg:hidden"
            onClick={() => setActive((a) => !a)}
            onKeyDown={(e) => e.key === 'Enter' && setActive((a) => !a)}
            role="button"
            tabIndex={0}
            aria-label={active ? 'Collapse submenu' : 'Expand submenu'}
          >
            <FontAwesomeIcon
              icon={active ? faChevronUp : faChevronDown}
              width={14}
              height={14}
              className="cursor-pointer text-neutral-600"
            />
          </div>
        ) : null}
      </div>
      {children.length > 0 ? (
        <ul
          className={`z-[110] flex min-w-[12rem] flex-col gap-0.5 ${
            isRootItem
              ? 'lg:absolute lg:top-full lg:left-0 lg:mt-1 lg:hidden lg:rounded-md lg:border lg:border-neutral-200 lg:bg-white lg:p-2 lg:shadow-lg lg:group-hover:flex lg:group-focus-within:flex'
              : `bg-neutral-50 py-1 pl-2 lg:absolute lg:top-0 lg:left-full lg:ml-1 lg:rounded-md lg:border lg:border-neutral-200 lg:bg-white lg:p-2 lg:shadow-md ${
                  active ? 'flex' : 'hidden'
                }`
          }`}
        >
          {children}
        </ul>
      ) : null}
    </li>
  );
};
