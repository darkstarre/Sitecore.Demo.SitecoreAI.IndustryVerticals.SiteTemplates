'use client';

import React, { useMemo, useState } from 'react';
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

type SearchableNavigationItem = {
  id: string;
  label: string;
  href: string;
};

const SECONDARY_NAV_ITEMS = [
  { label: 'Technology & Innovation', href: '/Insights/Technology-and-Innovation' },
  { label: 'Energy & Infrastructure', href: '/Insights/Energy-and-Infrastructure' },
  { label: 'Finance', href: '/Insights/Finance' },
  { label: 'Life Sciences & HealthTech', href: '/Insights/Life-Sciences-and-HealthTech' },
];

const TECH_STUDIO_BACKGROUND_IMAGE = '/tech-studio-nav-bg.jpg';

const getFieldLabel = (item: NavItemFields): string =>
  (
    item.NavigationTitle?.value?.toString() ||
    item.Title?.value?.toString() ||
    item.DisplayName ||
    ''
  ).trim();

const isAttorneysNavigationItem = (item: NavItemFields): boolean => {
  const label = getFieldLabel(item).toLowerCase();
  return label === 'attorneys' || label === 'doctors';
};

const isHomeNavigationItem = (item: NavItemFields): boolean => {
  return getFieldLabel(item).toLowerCase() === 'home';
};

const isTechStudioNavigationItem = (item: NavItemFields): boolean => {
  return getFieldLabel(item).toLowerCase().includes('tech studio');
};

const isCareersNavigationItem = (item: NavItemFields): boolean => {
  return getFieldLabel(item).toLowerCase() === 'careers';
};

const getDisplayLabelForDeduplication = (item: NavItemFields): string => {
  const raw = getFieldLabel(item).toLowerCase();
  if (raw === 'services') return 'practices';
  if (raw === 'doctors') return 'attorneys';
  return raw;
};

const createTechStudioItem = (): NavItemFields => ({
  Id: 'tech-studio-nav-item',
  DisplayName: 'Tech Studio',
  Title: { value: 'Tech Studio' } as TextField,
  NavigationTitle: { value: 'Tech Studio' } as TextField,
  Href: '/Tech-Studio',
  Querystring: '',
  Styles: ['level1', 'item-tech-studio'],
});

const createCareersItem = (): NavItemFields => ({
  Id: 'careers-nav-item',
  DisplayName: 'Careers',
  Title: { value: 'Careers' } as TextField,
  NavigationTitle: { value: 'Careers' } as TextField,
  Href: '/Careers',
  Querystring: '',
  Styles: ['level1', 'item-careers'],
});

const createPeopleItem = (): NavItemFields => ({
  Id: 'people-nav-item',
  DisplayName: 'People',
  Title: { value: 'People' } as TextField,
  NavigationTitle: { value: 'People' } as TextField,
  Href: '/People',
  Querystring: '',
  Styles: ['level1', 'item-people'],
});

const createAboutUsItem = (): NavItemFields => ({
  Id: 'about-us-nav-item',
  DisplayName: 'About Us',
  Title: { value: 'About Us' } as TextField,
  NavigationTitle: { value: 'About Us' } as TextField,
  Href: '/About',
  Querystring: '',
  Styles: ['level1', 'item-about-us'],
});

const withRequiredItems = (items: NavItemFields[]): NavItemFields[] => {
  const hasPeople = items.some((item) => getFieldLabel(item).toLowerCase() === 'people');
  const hasCareers = items.some((item) => getFieldLabel(item).toLowerCase() === 'careers');
  const hasAboutUs = items.some((item) => getFieldLabel(item).toLowerCase() === 'about us');

  const next = [...items];

  if (!hasPeople) {
    next.unshift(createPeopleItem());
  }

  if (!hasCareers) {
    next.push(createCareersItem());
  }

  if (!hasAboutUs) {
    next.push(createAboutUsItem());
  }

  return next;
};

const dedupeTopLevelItems = (items: NavItemFields[]): NavItemFields[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getDisplayLabelForDeduplication(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const withCareersBeforeTechStudio = (items: NavItemFields[]): NavItemFields[] => {
  const next = [...items];
  const careersIndex = next.findIndex((item) => isCareersNavigationItem(item));
  const techStudioIndex = next.findIndex((item) => isTechStudioNavigationItem(item));

  if (careersIndex === -1 || techStudioIndex === -1 || careersIndex < techStudioIndex) {
    return next;
  }

  const [careersItem] = next.splice(careersIndex, 1);
  const updatedTechStudioIndex = next.findIndex((item) => isTechStudioNavigationItem(item));
  next.splice(updatedTechStudioIndex, 0, careersItem);
  return next;
};

const collectSearchableItems = (items: NavItemFields[]): SearchableNavigationItem[] => {
  const collected: SearchableNavigationItem[] = [];

  const visit = (item: NavItemFields) => {
    const label = getFieldLabel(item);
    if (!label || isHomeNavigationItem(item) || isAttorneysNavigationItem(item)) {
      return;
    }

    collected.push({
      id: item.Id,
      label,
      href: item.Href || '/',
    });

    (item.Children || []).forEach((child) => visit(child));
  };

  items.forEach((item) => visit(item));
  return dedupeTopLevelItems(
    collected.map((item) => ({
      Id: item.id,
      DisplayName: item.label,
      Title: { value: item.label } as TextField,
      NavigationTitle: { value: item.label } as TextField,
      Href: item.href,
      Querystring: '',
      Styles: [],
    }))
  ).map((item) => ({
    id: item.Id,
    label: getFieldLabel(item),
    href: item.Href || '/',
  }));
};

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showNoResults, setShowNoResults] = useState(false);
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

  const topLevelItems = withCareersBeforeTechStudio(
    withRequiredItems(
      dedupeTopLevelItems(
        Object.values(normalizedFields)
          .filter((element) => element)
          .flatMap((element) => {
            if (isHomeNavigationItem(element) && element.Children?.length) {
              return element.Children;
            }
            return [element];
          })
          .filter((element) => !isAttorneysNavigationItem(element) && !isHomeNavigationItem(element))
      )
    )
  );
  const searchableItems = useMemo(
    () => collectSearchableItems(topLevelItems),
    [topLevelItems]
  );
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const searchMatches =
    trimmedQuery.length > 0
      ? searchableItems.filter((item) => item.label.toLowerCase().includes(trimmedQuery))
      : [];

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedQuery) {
      setShowNoResults(false);
      return;
    }

    if (!searchMatches.length) {
      setShowNoResults(true);
      return;
    }

    setShowNoResults(false);
    window.location.href = searchMatches[0].href;
  };

  const list = topLevelItems
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
          } bg-background dark:bg-background-dark absolute top-full right-0 left-0 z-100 flex-col border-t lg:static lg:flex lg:flex-col lg:border-0`}
        >
          <div className="flex w-full flex-col">
            <ul
              className={`container flex flex-col gap-x-8 pb-8 lg:flex-row lg:items-center lg:pb-0 xl:gap-x-10`}
            >
              {list}
            </ul>
            <form
              className="mt-4 mb-4 flex w-full flex-col gap-2 border-t border-[#b7cabc] bg-[#c9d9cf] px-4 py-3 rounded-tl-md rounded-bl-sm rounded-tr-[2.25rem] rounded-br-[1.25rem] lg:mt-3 lg:ml-6 lg:pr-10 dark:border-[#365344] dark:bg-[#254233]"
              onSubmit={handleSearchSubmit}
            >
              <div className="flex w-full flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-6">
                <div className="flex w-full min-w-0 flex-nowrap items-center gap-4 overflow-x-auto text-sm normal-case whitespace-nowrap">
                  {SECONDARY_NAV_ITEMS.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-[#1f3f64] hover:text-[#173252] underline-offset-2 hover:underline dark:text-[#d6e8dd] dark:hover:text-white"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
                <div className="flex w-full items-center gap-2 lg:w-auto lg:min-w-[380px]">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      if (showNoResults) {
                        setShowNoResults(false);
                      }
                    }}
                    placeholder="Search people, practices, insights..."
                    aria-label="Search site navigation"
                    className="h-10 w-full rounded-md border border-[#9ab2a4] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#789b48]/40 dark:border-[#4a6a5a] dark:bg-[#1b2f25]"
                  />
                  <button
                    type="submit"
                    className="h-10 rounded-md bg-[#1f3f64] px-4 text-sm font-medium text-white hover:bg-[#173252] dark:bg-[#1b3554] dark:hover:bg-[#162b44]"
                  >
                    Search
                  </button>
                </div>
              </div>
              {trimmedQuery.length > 0 && searchMatches.length > 0 ? (
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm normal-case">
                  {searchMatches.slice(0, 6).map((match) => (
                    <a
                      key={match.id}
                      href={match.href}
                      className="text-foreground/80 hover:text-foreground dark:text-foreground-dark/80 dark:hover:text-foreground-dark underline-offset-2 hover:underline"
                    >
                      {match.label}
                    </a>
                  ))}
                </div>
              ) : null}
              {showNoResults ? (
                <p className="text-sm normal-case text-[#b74b4b] dark:text-[#ff9b9b]">
                  No matching navigation results for "{searchQuery.trim()}".
                </p>
              ) : null}
            </form>
          </div>
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
  const isTechStudio = getFieldLabel(props.fields).toLowerCase().includes('tech studio');
  const visibleChildren = (props.fields.Children || []).filter(
    (element) => !isAttorneysNavigationItem(element)
  );
  const hasChildren = visibleChildren.length > 0;
  const children = visibleChildren
    .map((element: NavItemFields, index: number) => (
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
              ? 'relative isolate inline-flex min-w-[11rem] items-center justify-end overflow-hidden rounded-xl py-2 pr-4 pl-12 text-[1.1em] font-semibold tracking-tight normal-case shadow-[0_0_14px_rgba(120,155,72,0.4)] hover:shadow-[0_0_18px_rgba(120,155,72,0.55)]'
              : ''
          }`}
        >
          {isTechStudio ? (
            <>
              <span
                aria-hidden
                className="absolute inset-0 -z-20 bg-cover bg-left"
                style={{ backgroundImage: `url(${TECH_STUDIO_BACKGROUND_IMAGE})` }}
              />
              <span className="relative z-10 translate-x-1">{getNavigationText(props)}</span>
            </>
          ) : (
            getNavigationText(props)
          )}
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
