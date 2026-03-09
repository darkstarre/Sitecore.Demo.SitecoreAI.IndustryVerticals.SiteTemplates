'use client';

import React, { useState } from 'react';
import { Link, TextField, useSitecore } from '@sitecore-content-sdk/nextjs';
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

const getFieldLabel = (item: NavItemFields): string =>
  (
    item.NavigationTitle?.value?.toString() ||
    item.Title?.value?.toString() ||
    item.DisplayName ||
    ''
  ).trim();

const createTechStudioItem = (): NavItemFields => ({
  Id: 'tech-studio-nav-item',
  DisplayName: 'Tech Studio',
  Title: { value: 'Tech Studio' } as TextField,
  NavigationTitle: { value: 'Tech Studio' } as TextField,
  Href: '/Tech-Studio',
  Querystring: '',
  Styles: ['level1', 'item-tech-studio'],
});

const withProminentTechStudio = (
  fields: Record<string, NavItemFields>
): Record<string, NavItemFields> => {
  const entries = Object.entries(fields);
  const next: Record<string, NavItemFields> = {};

  entries.forEach(([key, item]) => {
    if (!item) {
      return;
    }

    if (item.Styles?.includes('level0') && item.Children?.length) {
      const hasTechStudio = item.Children.some((child) =>
        getFieldLabel(child).toLowerCase().includes('tech studio')
      );
      next[key] = hasTechStudio
        ? {
            ...item,
            Children: [
              ...item.Children.filter(
                (child) => !getFieldLabel(child).toLowerCase().includes('tech studio')
              ),
              item.Children.find((child) =>
                getFieldLabel(child).toLowerCase().includes('tech studio')
              )!,
            ],
          }
        : {
            ...item,
            Children: [...item.Children, createTechStudioItem()],
          };
      return;
    }

    next[key] = item;
  });

  const hasTechStudioTopLevel = Object.values(next).some((item) =>
    getFieldLabel(item).toLowerCase().includes('tech studio')
  );

  if (
    !hasTechStudioTopLevel &&
    !Object.values(next).some((item) => item.Styles?.includes('level0'))
  ) {
    next.techStudio = createTechStudioItem();
  }

  return next;
};

export const Default = (props: NavigationProps) => {
  const [isOpenMenu, openMenu] = useState(false);
  const { page } = useSitecore();
  const normalizedFields = withProminentTechStudio(props.fields);
  const styles =
    props.params != null
      ? `${props.params.GridParameters ?? ''} ${props?.params?.Styles ?? ''}`.trimEnd()
      : '';
  const id = props.params != null ? props.params.RenderingIdentifier : null;

  if (!Object.values(normalizedFields).length) {
    return (
      <div className={`component navigation ${styles}`} id={id ? id : undefined}>
        <div className="component-content">[Navigation]</div>
      </div>
    );
  }

  const handleToggleMenu = (event?: React.MouseEvent<HTMLElement>, flag?: boolean): void => {
    if (event && page.mode.isEditing) {
      event.preventDefault();
    }

    if (flag !== undefined) {
      return openMenu(flag);
    }

    openMenu(!isOpenMenu);
  };

  const list = Object.values(normalizedFields)
    .filter((element) => element)
    .map((element: NavItemFields, key: number) => (
      <NavigationList
        key={`${key}${element.Id}`}
        fields={element}
        handleClick={(event: React.MouseEvent<HTMLElement>) => handleToggleMenu(event, false)}
        relativeLevel={1}
      />
    ));

  return (
    <div className={`component navigation font-heading text-lg ${styles}`} id={id ? id : undefined}>
      <div
        className="z-50 flex h-6 w-6 cursor-pointer items-center justify-center lg:hidden"
        onClick={() => handleToggleMenu()}
      >
        <FontAwesomeIcon icon={isOpenMenu ? faTimes : faBars} width={16} height={16} />
      </div>

      <div className="component-content">
        <nav
          className={`${
            isOpenMenu ? 'flex' : 'hidden'
          } bg-background dark:bg-background-dark absolute top-full right-0 left-0 z-100 border-t lg:static lg:flex lg:border-0`}
        >
          <ul
            className={`container flex flex-col gap-x-8 pb-8 lg:flex-row lg:items-center lg:pb-0 xl:gap-x-10`}
          >
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
  const hasChildren = !!props.fields.Children?.length;
  const isTechStudio = getFieldLabel(props.fields).toLowerCase().includes('tech studio');
  const children = (props.fields.Children || []).map((element: NavItemFields, index: number) => (
    <NavigationList
      key={`${index}${element.Id}`}
      fields={element}
      handleClick={props.handleClick}
      relativeLevel={props.relativeLevel + 1}
    />
  ));

  return (
    <li
      className={`${classNameList} group relative flex flex-col ${isRootItem ? 'lg:flex-row' : ''} gap-x-8 gap-y-4 xl:gap-x-10 ${active ? 'active' : ''} uppercase`}
      key={props.fields.Id}
      tabIndex={0}
    >
      <div className="flex items-center gap-1">
        <Link
          field={getLinkField(props)}
          editable={page.mode.isEditing}
          onClick={props.handleClick}
          className={`whitespace-nowrap transition ${
            isTechStudio
              ? 'text-[1.2em] font-semibold tracking-tight normal-case [text-shadow:0_0_10px_rgba(120,155,72,0.55)] hover:[text-shadow:0_0_14px_rgba(120,155,72,0.8)]'
              : ''
          }`}
        >
          {getNavigationText(props)}
        </Link>
        {hasChildren && !isRootItem ? (
          <div
            className="flex h-6 w-6 items-center justify-center lg:hidden"
            onClick={() => setActive((a) => !a)}
          >
            <FontAwesomeIcon
              icon={active ? faChevronUp : faChevronDown}
              width={16}
              height={16}
              className="cursor-pointer"
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      {hasChildren ? (
        <ul
          className={
            isRootItem
              ? 'mt-2 flex flex-col gap-4 pl-4 lg:mt-0 lg:flex-row lg:items-center lg:gap-8 lg:pl-0'
              : `bg-background dark:bg-background-dark border-border/40 mt-2 flex flex-col gap-3 pl-4 text-sm tracking-wide ${
                  active ? 'block' : 'hidden'
                } lg:invisible lg:absolute lg:top-full lg:left-0 lg:mt-3 lg:block lg:min-w-[260px] lg:rounded-md lg:border lg:p-4 lg:pl-4 lg:opacity-0 lg:shadow-md lg:transition lg:group-hover:visible lg:group-hover:opacity-100`
          }
        >
          {children}
        </ul>
      ) : null}
    </li>
  );
};
