'use client';

import React, { useState, useRef } from 'react';
import { Link, TextField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { ArrowLeft, X } from 'lucide-react';
import { useClickAway } from '@/hooks/useClickAway';
import { useStopResponsiveTransition } from '@/hooks/useStopResponsiveTransition';
import { INTERSTATE_BRAND_LOGO_ALT, INTERSTATE_BRAND_LOGO_SRC } from '@/constants/brandLogo';
import {
  getLinkContent,
  getLinkField,
  isNavLevel,
  isNavRootItem,
  prepareFields,
} from '@/helpers/navHelpers';
import clsx from 'clsx';
import { isParamEnabled } from '@/helpers/isParamEnabled';
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from '@/shadcn/components/ui/drawer';

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

interface NavigationListItemProps {
  fields: NavItemFields;
  handleClick: (event?: React.MouseEvent<HTMLElement>) => void;
  logoSrc?: string;
  isSimpleLayout?: boolean;
}

export interface NavigationProps extends ComponentProps {
  fields: Record<string, NavItemFields>;
}

/* Nav look & feel: src/assets/components/navigation-sitecore.css (HMR while authoring) */

/** Classes from Sitecore Presentation → Styles (params.styles); Placeholder merges selected style item `Value` here. */
const navItemInteractiveClass = (fields: NavItemFields) =>
  clsx('navigation-item navigation-item-primary', fields?.Styles?.join(' '));

const NavigationListItem: React.FC<NavigationListItemProps> = ({
  fields,
  handleClick,
  logoSrc,
  isSimpleLayout,
}) => {
  const { page } = useSitecore();
  const [isActiveLocal, setIsActiveLocal] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  useClickAway(dropdownRef, () => setIsActiveLocal(false));

  const isRootItem = isNavRootItem(fields);
  const isTopLevelPage = isNavLevel(fields, 1);

  const hasChildren = !!fields.Children?.length;
  const isLogoRootItem = isRootItem && logoSrc;
  const hasDropdownMenu = hasChildren && isTopLevelPage;

  const clickHandler = (event: React.MouseEvent<HTMLElement>) => {
    handleClick(event);
    setIsActiveLocal(false);
  };

  const childrenMarkup = hasChildren
    ? fields.Children!.map((child) => (
        <NavigationListItem
          key={child.Id}
          fields={child}
          handleClick={clickHandler}
          isSimpleLayout={isSimpleLayout}
          logoSrc={logoSrc}
        />
      ))
    : null;

  return (
    <li
      ref={dropdownRef}
      tabIndex={0}
      role="menuitem"
      className={clsx(
        'nav-item-root relative flex flex-col gap-x-8 gap-y-4 xl:gap-x-14',
        fields?.Styles?.join(' '),
        isRootItem && 'lg:flex-row',
        isLogoRootItem && 'shrink-0 max-lg:hidden',
        isLogoRootItem && isSimpleLayout && 'lg:mr-auto'
      )}
    >
      <div className="">
        {hasDropdownMenu ? (
          <Drawer
            open={isActiveLocal}
            onOpenChange={(open) => setIsActiveLocal(open)}
            direction="left"
          >
            <DrawerTrigger asChild>
              <button
                type="button"
                aria-label={`Open submenu for ${fields.DisplayName}`}
                className={navItemInteractiveClass(fields)}
                onClick={(e) => {
                  e.preventDefault();
                  setIsActiveLocal((a) => !a);
                }}
              >
                {getLinkContent(fields, logoSrc)}
              </button>
            </DrawerTrigger>

            <DrawerContent className="bg-background-accent flex flex-col p-5 max-lg:!w-xl max-lg:!max-w-full">
              <DrawerClose asChild className="hidden self-end lg:block">
                <button aria-label="Close submenu">
                  <X className="size-5" />
                </button>
              </DrawerClose>
              <DrawerClose asChild className="lg:hidden">
                <button aria-label="Close submenu">
                  <ArrowLeft className="size-5" />
                </button>
              </DrawerClose>
              <div className="px-12">
                {logoSrc && (
                  <img src={logoSrc} alt={fields.DisplayName} className="mt-14 mb-18 h-auto w-36" />
                )}

                <div className="text-foreground-light mb-6 text-sm font-medium">
                  {getLinkContent(fields, logoSrc)}
                </div>
                <nav aria-label={`${fields.DisplayName} submenu`}>
                  <ul className="flex flex-col gap-6">{childrenMarkup}</ul>
                </nav>
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <Link
            field={getLinkField(fields)}
            editable={page.mode.isEditing}
            onClick={clickHandler}
            className={navItemInteractiveClass(fields)}
          >
            {getLinkContent(fields, logoSrc)}
          </Link>
        )}
      </div>
    </li>
  );
};

const InterstateNavBrandLogo = ({
  isSimpleLayout,
  showMobileStackedLogo,
}: {
  isSimpleLayout: boolean;
  showMobileStackedLogo: boolean;
}) => (
  <>
    {showMobileStackedLogo && (
      <li className="list-none lg:hidden">
        <Link href="/" className="block py-1">
          <img
            src={INTERSTATE_BRAND_LOGO_SRC}
            alt={INTERSTATE_BRAND_LOGO_ALT}
            className="interstate-nav-logo-img h-auto w-40 max-w-full object-contain object-left"
          />
        </Link>
      </li>
    )}
    <li
      className={clsx(
        'nav-item-root relative flex shrink-0 list-none flex-col gap-x-8 gap-y-4 max-lg:hidden lg:flex-row xl:gap-x-14',
        isSimpleLayout && 'lg:mr-auto'
      )}
    >
      <Link href="/" className="flex min-h-[2.5rem] items-center self-stretch py-0.5">
        <img
          src={INTERSTATE_BRAND_LOGO_SRC}
          alt={INTERSTATE_BRAND_LOGO_ALT}
          className="interstate-nav-logo-img h-auto w-[10.5rem] max-w-none object-contain object-left sm:w-[11.5rem]"
        />
      </Link>
    </li>
  </>
);

export const Default = ({ params, fields }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id, SimpleLayout: simpleLayout } = params;
  const renderingStyles = clsx(styles);

  useStopResponsiveTransition();

  const hasNavData = Object.values(fields).some((v) => !!v);
  const logoSrc = INTERSTATE_BRAND_LOGO_SRC;
  const hasBrandLogoInGreenBar = Boolean(logoSrc);
  const isSimpleLayout = isParamEnabled(simpleLayout);

  if (!hasNavData) {
    return (
      <div
        className={clsx('component navigation navigation-interstate-brand', renderingStyles)}
        id={id}
      >
        <nav className="min-h-full min-w-0 flex-1">
          <ul
            role="menubar"
            className="navigation-menu container flex min-h-full flex-col items-start gap-4 px-4 py-3 text-lg lg:flex-row lg:items-center lg:justify-center lg:gap-x-8 lg:px-0 lg:py-0"
          >
            {hasBrandLogoInGreenBar && (
              <InterstateNavBrandLogo
                isSimpleLayout={isSimpleLayout}
                showMobileStackedLogo
              />
            )}
          </ul>
        </nav>
        {page.mode.isEditing && (
          <div className="component-content px-4 text-sm text-white/80">[Navigation]</div>
        )}
      </div>
    );
  }

  const handleToggleMenu = (event?: React.MouseEvent<HTMLElement>, forceState?: boolean) => {
    if (event && page.mode.isEditing) {
      event.preventDefault();
    }
    setIsMenuOpen(forceState ?? !isMenuOpen);
  };

  const preparedFields = prepareFields(fields, !isSimpleLayout);
  const rootItem = Object.values(preparedFields).find((item) => isNavRootItem(item));
  const hasLogoRootItem = rootItem && logoSrc;

  const navigationItems = Object.values(preparedFields)
    .filter((item): item is NavItemFields => !!item)
    .filter((item) => !isNavRootItem(item))
    .map((item) => (
      <NavigationListItem
        key={item.Id}
        fields={item}
        handleClick={(event) => handleToggleMenu(event, false)}
        logoSrc={logoSrc}
        isSimpleLayout={!!isSimpleLayout}
      />
    ));

  return (
    <div
      className={clsx('component navigation navigation-interstate-brand', renderingStyles)}
      id={id}
    >
      <nav className="min-h-full min-w-0 flex-1">
        <ul
          role="menubar"
          className={clsx(
            'navigation-menu container flex min-h-full flex-row items-center gap-x-8 gap-y-4 text-lg lg:justify-center [.component.header_&]:px-0 max-lg:flex-col max-lg:items-start max-lg:px-4 max-lg:py-3 [.drawer-content_&]:flex-col [.drawer-content_&]:items-start [.drawer-content_&]:px-4',
            isSimpleLayout && !hasLogoRootItem && !hasBrandLogoInGreenBar && 'lg:justify-end'
          )}
        >
          {hasBrandLogoInGreenBar && (
            <InterstateNavBrandLogo
              isSimpleLayout={isSimpleLayout}
              showMobileStackedLogo
            />
          )}
          {navigationItems}
        </ul>
      </nav>
    </div>
  );
};
