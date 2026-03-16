import React, { useCallback, useMemo, useState } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';

type TextFieldType = { value: string };

interface Fields {
  Title: TextFieldType;
}

interface SitecoreRenderingParams {
  styles?: string;
  RenderingIdentifier?: string;
}

interface RenderingMeta {
  uid?: string;
  params?: Record<string, unknown>;
  dataSource?: string;
}

interface LittelfuseNavProps {
  fields?: Fields;
  params?: SitecoreRenderingParams;
  rendering?: RenderingMeta;
}

type MenuItem = {
  id: string;
  label: string;
  children?: Array<{ id: string; label: string }>;
};

export const LittelfuseNav = (
  props: LittelfuseNavProps = { fields: { Title: { value: 'Navigation' } }, params: {} }
) => {
  const styles = `component two-level-navigation ${props?.params?.styles || ''}`.trim();
  const id = props?.params?.RenderingIdentifier;
  const titleField = props?.fields?.Title ?? { value: 'Navigation' };

  const menuData: MenuItem[] = useMemo(
    () => [
      { id: 'home', label: 'Home' },
      {
        id: 'products',
        label: 'Products',
        children: [
          { id: 'prod-1', label: 'New Arrivals' },
          { id: 'prod-2', label: 'Best Sellers' },
          { id: 'prod-3', label: 'Sale' },
        ],
      },
      {
        id: 'services',
        label: 'Services',
        children: [
          { id: 'svc-1', label: 'Consulting' },
          { id: 'svc-2', label: 'Implementation' },
          { id: 'svc-3', label: 'Support' },
        ],
      },
      {
        id: 'about',
        label: 'About',
        children: [
          { id: 'abt-1', label: 'Company' },
          { id: 'abt-2', label: 'Careers' },
          { id: 'abt-3', label: 'Press' },
        ],
      },
      { id: 'contact', label: 'Contact' },
    ],
    []
  );

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const primaryItems = useMemo(() => menuData, [menuData]);
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), []);

  const onSubmitSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  const onToggleSubmenu = useCallback((idItem: string) => {
    setOpenSubmenuId((curr) => (curr === idItem ? null : idItem));
  }, []);

  const primaryList = useMemo(
    () =>
      primaryItems.map((item) => {
        const hasChildren = !!item.children && item.children.length > 0;
        const isOpen = openSubmenuId === item.id;
        const childList = hasChildren
          ? item.children!.map((child) => (
              <li key={child.id} role="none">
                <a
                  href="#"
                  className="block px-3 py-2 text-sm text-green-700 hover:text-green-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  role="menuitem"
                  aria-label={child.label}
                >
                  {child.label}
                </a>
              </li>
            ))
          : null;

        return (
          <li key={item.id} className="relative" role="none">
            <div className="flex items-center" role="none">
              <a
                href="#"
                className="px-3 py-2 text-green-700 hover:text-green-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
                role="menuitem"
                aria-label={item.label}
              >
                {item.label}
              </a>
              {hasChildren ? (
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  aria-controls={`submenu-${item.id}`}
                  className="ml-1 rounded p-1 text-green-700 hover:text-green-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  onClick={() => onToggleSubmenu(item.id)}
                >
                  <span className="sr-only">Toggle submenu</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ) : null}
            </div>
            {hasChildren ? (
              <ul
                id={`submenu-${item.id}`}
                role="menu"
                className={`mt-2 space-y-1 rounded-md border border-green-200 bg-white p-2 shadow-md lg:absolute lg:left-0 lg:min-w-56 dark:bg-zinc-900 ${isOpen ? 'block' : 'hidden'}`}
              >
                {childList}
              </ul>
            ) : null}
          </li>
        );
      }),
    [onToggleSubmenu, openSubmenuId, primaryItems]
  );

  return (
    <nav
      className={`${styles} bg-white p-4 dark:bg-zinc-900`}
      id={id}
      aria-label="Primary Navigation"
    >
      <div className="component-content">
        <div className="flex items-center justify-between">
          <Text tag="h2" field={titleField} className="text-xl font-semibold text-green-800" />
          <div className="flex items-center gap-3">
            <form
              role="search"
              aria-label="Site search"
              className="flex items-center"
              onSubmit={onSubmitSearch}
            >
              <label htmlFor="nav-search" className="sr-only">
                Search
              </label>
              <input
                id="nav-search"
                name="q"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-40 rounded-l-md border border-green-300 px-3 py-2 text-green-800 placeholder-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none md:w-64"
              />
              <button
                type="submit"
                className="rounded-r-md border border-l-0 border-green-300 bg-green-600 px-3 py-2 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                aria-label="Submit search"
              >
                Go
              </button>
            </form>
            <button
              type="button"
              className="block rounded p-2 text-green-700 hover:text-green-800 focus:ring-2 focus:ring-green-500 focus:outline-none lg:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              onClick={toggleMobile}
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
        <div className={`mt-4 lg:mt-6 ${mobileOpen ? 'block' : 'hidden'} lg:block`}>
          <ul
            role="menubar"
            className="flex flex-col gap-2 text-base lg:flex-row lg:items-center lg:gap-6"
          >
            {primaryList}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export const Default = LittelfuseNav;
