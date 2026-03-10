import { createTextField } from '../helpers/createFields';
import { NavItemFields } from '../../components/navigation/Navigation';

export const createNavItem = (text: string, id?: string): NavItemFields => {
  return {
    Id: id || `${text.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    Href: `/${text.replace(/\s+/g, '-')}`,
    Querystring: '',
    DisplayName: text,
    Title: createTextField(text),
    NavigationTitle: createTextField(text),
    Styles: [],
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

export const navRoot: NavItemFields = {
  ...createNavItem('Home', '8d740786-580a-4374-ac68-1020622f70d1'),
  Href: '/',
  Styles: ['level0', 'submenu', 'item0', 'odd', 'first', 'last', 'active'],
};

export const topLevelPages: NavItemFields[] = [
  {
    ...createNavItem('People', '1dcca542-9bca-47db-acd2-0ac28c15052d'),
    Styles: ['level1', 'item0', 'odd', 'first'],
  },
  {
    ...createNavItem('Practices', '8d8252c6-b93b-43a1-959d-7ab0ff749269'),
    Styles: ['level1', 'item1', 'even'],
  },
  {
    ...createNavItem('Insights', 'f1ab5368-6202-4acf-b27f-ab80be5e6bb1'),
    Styles: ['level1', 'submenu', 'item2', 'odd'],
    Children: [
      {
        ...createNavItem('Technology & Innovation', '5e3a6d08-66bc-40b1-8de2-70481a8f0c61'),
        Href: '/Insights/Technology-and-Innovation',
        Styles: ['level2', 'item0', 'odd', 'first'],
      },
      {
        ...createNavItem('Energy & Infrastructure', '33b964b9-d3d9-4689-84f0-5094afc0d08a'),
        Href: '/Insights/Energy-and-Infrastructure',
        Styles: ['level2', 'item1', 'even'],
      },
      {
        ...createNavItem('Finance', 'd2ba02a5-b1c0-435d-ac5b-6c5a0a0437d4'),
        Href: '/Insights/Finance',
        Styles: ['level2', 'item2', 'odd'],
      },
      {
        ...createNavItem('Life Sciences & HealthTech', '87482563-ed64-44da-8a30-b3e178d3bd73'),
        Href: '/Insights/Life-Sciences-and-HealthTech',
        Styles: ['level2', 'item3', 'even'],
      },
    ],
  },
  {
    ...createNavItem('Careers', '55f39209-2ea2-417d-badb-2b7d51c8c87e'),
    Styles: ['level1', 'item3', 'even'],
  },
  {
    ...createNavItem('About', '645d5fb5-1e32-4cc9-9583-61af38b3b5cb'),
    Styles: ['level1', 'submenu', 'item4', 'odd'],
    Children: [
      {
        ...createNavItem('About Us', 'f7424601-f4f0-4f2f-8136-0ac88934f8f6'),
        Href: '/About',
        Styles: ['level2', 'item0', 'odd', 'first'],
      },
      {
        ...createNavItem('News', '36f88b12-f6f0-44ab-af64-f240eb2f4b0a'),
        Href: '/About/News',
        Styles: ['level2', 'item1', 'even'],
      },
      {
        ...createNavItem('Locations', 'a0d675ff-71db-43d7-88fd-370df05f0c3f'),
        Href: '/About/Locations',
        Styles: ['level2', 'item2', 'odd', 'last'],
      },
    ],
  },
  {
    ...createNavItem('Orrick Tech Studio', '0b1e72e6-17c0-4aec-8fe5-7a3aef79232a'),
    Styles: ['level1', 'item5', 'odd', 'last'],
  },
];

export const flatTopLevelPages: NavItemFields[] = [
  {
    ...createNavItem('People'),
    Styles: ['level0', 'item0', 'odd', 'first', 'flat-level1'],
  },
  {
    ...createNavItem('Practices'),
    Styles: ['level0', 'item1', 'even', 'flat-level1'],
  },
  {
    ...createNavItem('Insights'),
    Styles: ['level0', 'item2', 'odd', 'flat-level1'],
  },
  {
    ...createNavItem('Technology & Innovation'),
    Href: '/Insights/Technology-and-Innovation',
    Styles: ['level0', 'item3', 'even', 'flat-level2'],
  },
  {
    ...createNavItem('Energy & Infrastructure'),
    Href: '/Insights/Energy-and-Infrastructure',
    Styles: ['level0', 'item4', 'odd', 'flat-level2'],
  },
  {
    ...createNavItem('Finance'),
    Href: '/Insights/Finance',
    Styles: ['level0', 'item5', 'even', 'flat-level2'],
  },
  {
    ...createNavItem('Life Sciences & HealthTech'),
    Href: '/Insights/Life-Sciences-and-HealthTech',
    Styles: ['level0', 'item6', 'odd', 'flat-level2'],
  },
  {
    ...createNavItem('Careers'),
    Styles: ['level0', 'item7', 'even', 'flat-level1'],
  },
  {
    ...createNavItem('About'),
    Styles: ['level0', 'item8', 'odd', 'flat-level1'],
  },
  {
    ...createNavItem('Orrick Tech Studio'),
    Styles: ['level0', 'item9', 'even', 'last', 'flat-level1'],
  },
];

export const getNavigationFields = (options?: {
  withRoot?: boolean;
  flat?: boolean;
}): Record<string, NavItemFields> => {
  const { withRoot = true, flat = false } = options || {};

  const pages = flat ? flatTopLevelPages : topLevelPages;

  if (withRoot) {
    return {
      '0': {
        ...navRoot,
        Children: pages,
      },
    };
  }

  return arrayToObject(pages);
};
