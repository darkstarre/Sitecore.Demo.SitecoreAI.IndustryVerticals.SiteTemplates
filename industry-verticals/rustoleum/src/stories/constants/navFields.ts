import { createTextField } from '../helpers/createFields';

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

/* Rust-Oleum-style primary navigation (mirrors live site structure) */
export const topLevelPages = [
  {
    ...createNavItem('Our Products'),
    Styles: ['level1', 'item0', 'odd', 'first'],
    Children: [
      {
        ...createNavItem('Paints, Stains & Sealers'),
        Styles: ['level2', 'item0', 'odd', 'first'],
      },
      {
        ...createNavItem('Primers'),
        Styles: ['level2', 'item1', 'even'],
      },
      {
        ...createNavItem('Cleaners'),
        Styles: ['level2', 'item2', 'odd'],
      },
      {
        ...createNavItem('Professionals'),
        Styles: ['level2', 'item3', 'even'],
      },
      {
        ...createNavItem('Automotive'),
        Styles: ['level2', 'item4', 'odd'],
      },
      {
        ...createNavItem('Abrasives'),
        Styles: ['level2', 'item5', 'even'],
      },
      {
        ...createNavItem('Browse by Brands'),
        Styles: ['level2', 'item6', 'odd', 'last'],
      },
    ],
  },
  {
    ...createNavItem('Professional Solutions'),
    Styles: ['level1', 'item1', 'even'],
  },
  {
    ...createNavItem('Inspiration'),
    Styles: ['level1', 'item2', 'odd'],
  },
  {
    ...createNavItem('Resource Center'),
    Styles: ['level1', 'item3', 'even'],
  },
  {
    ...createNavItem('About'),
    Styles: ['level1', 'item4', 'odd', 'last'],
  },
];

export const flatTopLevelPages = [
  {
    ...createNavItem('Our Products'),
    Styles: ['level0', 'item0', 'odd', 'first', 'flat-level1'],
  },
  {
    ...createNavItem('Professional Solutions'),
    Styles: ['level0', 'item1', 'even', 'flat-level1'],
  },
  {
    ...createNavItem('Inspiration'),
    Styles: ['level0', 'item2', 'odd', 'flat-level1'],
  },
  {
    ...createNavItem('Resource Center'),
    Styles: ['level0', 'item3', 'even', 'flat-level1'],
  },
  {
    ...createNavItem('About'),
    Styles: ['level0', 'item4', 'odd', 'last', 'flat-level1'],
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

/** Matches CM `Logo` media item; `mediaurl` supports Storybook / disconnected dev. */
export const logoParam = `<image mediaid="8f822ad5-3603-4a41-9fb7-41869da2ef4c" mediaurl="/brand/rustoleum-logo.png" alt="Rust-Oleum" />`;
