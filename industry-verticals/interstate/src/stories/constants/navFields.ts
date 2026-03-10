import { createPlaceholderImageSrc, createTextField } from '../helpers/createFields';

export const createNavItem = (text: string) => {
  return {
    Id: `${text}-${Date.now()}`,
    Href: '#',
    Querystring: '',
    DisplayName: text,
    Title: createTextField(text),
    NavigationTitle: createTextField(text),
  };
};

export const arrayToObject = <T>(arr: T[]): Record<string, T> =>
  arr.reduce(
    (acc, item, index) => {
      acc[String(index)] = item;
      return acc;
    },
    {} as Record<string, T>
  );

export const navRoot = {
  ...createNavItem('Home'),
  Styles: ['level0', 'submenu', 'item0', 'odd', 'first', 'last', 'active'],
};

export const topLevelPages = [
  {
    ...createNavItem('Battery Finder'),
    Styles: ['level1', 'item0', 'odd', 'first'],
  },
  {
    ...createNavItem('Products'),
    Styles: ['level1', 'item1', 'even'],
  },
  {
    ...createNavItem('Services'),
    Styles: ['level1', 'item1', 'even'],
    Children: [
      {
        ...createNavItem('Dealer Network'),
        Styles: ['level2', 'item0', 'odd', 'first'],
      },
      {
        ...createNavItem('Fleet Solutions'),
        Styles: ['level2', 'item1', 'even'],
      },
      {
        ...createNavItem('Warranty'),
        Styles: ['level2', 'item2', 'odd', 'last'],
      },
    ],
  },
  {
    ...createNavItem('Find a Dealer'),
    Styles: ['level1', 'submenu', 'item2', 'odd', 'last'],
  },
];

export const flatTopLevelPages = [
  {
    ...createNavItem('Battery Finder'),
    Styles: ['level0', 'item0', 'odd', 'first', 'flat-level1'],
  },
  {
    ...createNavItem('Products'),
    Styles: ['level0', 'item1', 'even', 'flat-level1'],
  },
  {
    ...createNavItem('Services'),
    Styles: ['level0', 'item1', 'even', 'flat-level1'],
  },
  {
    ...createNavItem('Dealer Network'),
    Styles: ['level0', 'item0', 'odd', 'first', 'flat-level2'],
  },
  {
    ...createNavItem('Fleet Solutions'),
    Styles: ['level0', 'item1', 'even', 'flat-level2'],
  },
  {
    ...createNavItem('Warranty'),
    Styles: ['level0', 'item2', 'odd', 'last', 'flat-level2'],
  },

  {
    ...createNavItem('Find a Dealer'),
    Styles: ['level0', 'submenu', 'item2', 'odd', 'last', 'flat-level1'],
  },
];

export const getNavigationFields = (options?: { withRoot?: boolean; flat?: boolean }) => {
  const { withRoot = true, flat = false } = options || {};

  const pages = flat ? flatTopLevelPages : topLevelPages;

  if (withRoot) {
    return {
      0: {
        ...navRoot,
        Children: pages,
      },
    };
  }

  return arrayToObject(pages);
};

export const logoParam = `<image mediaid="8cc2a449-e23b-488c-bb23-3d7c7a07f6e7" mediaurl="${createPlaceholderImageSrc(true)}" />`;
