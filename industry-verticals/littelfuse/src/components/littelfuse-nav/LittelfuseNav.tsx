import React, { useCallback, useMemo, useState } from 'react';
import NextImage from 'next/image';

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
  href?: string;
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
      {
        id: 'products',
        label: 'Products',
        href: '#',
        children: [
          { id: 'prod-1', label: 'Circuit Protection' },
          { id: 'prod-2', label: 'Power Semiconductors' },
          { id: 'prod-3', label: 'Relays & Sensors' },
        ],
      },
      {
        id: 'applications',
        label: 'Applications',
        href: '#',
        children: [
          { id: 'svc-1', label: 'Automotive' },
          { id: 'svc-2', label: 'Industrial' },
          { id: 'svc-3', label: 'Electronics' },
        ],
      },
      {
        id: 'design-center',
        label: 'Design Center',
        href: '#',
        children: [
          { id: 'des-1', label: 'Resources' },
          { id: 'des-2', label: 'Reference Designs' },
          { id: 'des-3', label: 'Tools' },
        ],
      },
      {
        id: 'company',
        label: 'Company',
        href: '#',
        children: [
          { id: 'com-1', label: 'About Littelfuse' },
          { id: 'com-2', label: 'Newsroom' },
          { id: 'com-3', label: 'Investors' },
        ],
      },
      {
        id: 'support',
        label: 'Support',
        href: '#',
        children: [
          { id: 'sup-1', label: 'Contact Support' },
          { id: 'sup-2', label: 'Product Help' },
          { id: 'sup-3', label: 'Documentation' },
        ],
      },
    ],
    []
  );

  const utilityLinks = useMemo(
    () => [
      { id: 'cross-reference', label: 'Cross Reference' },
      { id: 'check-stock', label: 'Check Distributor Stock' },
      { id: 'where-to-buy', label: 'Where to Buy' },
      { id: 'request-sample', label: 'Request Sample' },
      { id: 'lang', label: 'English (EN)' },
      { id: 'login', label: 'Log In / Register' },
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
                  className="text-foreground hover:text-accent focus:ring-accent block px-3 py-2 text-sm focus:ring-2 focus:outline-none"
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
                href={item.href || '#'}
                className="text-foreground hover:text-accent focus:ring-accent px-1 py-2 text-sm font-semibold whitespace-nowrap focus:ring-2 focus:outline-none"
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
                  className="text-foreground hover:text-accent focus:ring-accent ml-1 rounded p-1 focus:ring-2 focus:outline-none"
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
                className={`border-border bg-background z-50 mt-2 space-y-1 rounded-sm border p-2 shadow-md lg:absolute lg:left-0 lg:min-w-56 ${isOpen ? 'block' : 'hidden'}`}
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
      className={`${styles} bg-background border-border relative z-40 border-b`}
      id={id}
      aria-label="Primary Navigation"
    >
      <div className="component-content mx-auto w-full max-w-[1280px]">
        <span className="sr-only">{titleField.value}</span>

        <div className="border-border hidden border-b px-4 py-2 lg:block">
          <ul className="flex items-center justify-end gap-6 text-[11px] font-medium tracking-[0.02em] uppercase">
            {utilityLinks.map((item) => (
              <li key={item.id}>
                <a href="#" className="text-foreground-light hover:text-accent transition-colors">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <a
            href="/"
            className="relative block h-12 w-[205px] shrink-0"
            aria-label="Littelfuse home"
          >
            <NextImage
              src="/Littelfuse_logo%20copy.svg"
              alt="Littelfuse"
              fill
              className="object-contain object-left"
              priority
            />
          </a>

          <ul role="menubar" className="hidden items-center gap-7 lg:flex">
            {primaryList}
          </ul>

          <div className="flex items-center gap-3">
            <form
              role="search"
              aria-label="Site search"
              className="hidden items-center md:flex"
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
                placeholder="Enter a part # or keyword"
                className="border-border bg-background text-foreground placeholder-foreground-muted focus:border-accent focus:ring-accent w-56 border-b px-3 py-2 text-sm focus:ring-2 focus:outline-none lg:w-72"
              />
              <button
                type="submit"
                className="text-foreground hover:text-accent p-2"
                aria-label="Submit search"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>
            </form>
            <button
              type="button"
              className="text-foreground hover:text-accent focus:ring-accent block rounded p-2 focus:ring-2 focus:outline-none lg:hidden"
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

        <div
          className={`border-border border-t px-4 py-4 lg:hidden ${mobileOpen ? 'block' : 'hidden'}`}
        >
          <form
            role="search"
            aria-label="Site search"
            className="mb-4 flex items-center"
            onSubmit={onSubmitSearch}
          >
            <label htmlFor="mobile-nav-search" className="sr-only">
              Search
            </label>
            <input
              id="mobile-nav-search"
              name="q-mobile"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a part # or keyword"
              className="border-border bg-background text-foreground placeholder-foreground-muted focus:border-accent focus:ring-accent w-full border-b px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </form>

          <ul role="menubar" className="mb-4 flex flex-col gap-2">
            {primaryList}
          </ul>

          <ul className="border-border flex flex-col gap-2 border-t pt-3 text-xs font-semibold uppercase">
            {utilityLinks.map((item) => (
              <li key={item.id}>
                <a href="#" className="text-foreground-light hover:text-accent transition-colors">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export const Default = LittelfuseNav;
