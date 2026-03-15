import React, { JSX } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { Placeholder } from '@sitecore-content-sdk/nextjs';

export type HeaderProps = ComponentProps & {
  params: { [key: string]: string };
};

const HEADER_FALLBACK_LINKS = [
  { id: 'home', title: 'Home', href: '/' },
  { id: 'products', title: 'Products', href: '/Products' },
  { id: 'solutions', title: 'Solutions', href: '/Solutions' },
  { id: 'locations', title: 'Find a Location', href: '/Find-A-Location' },
  { id: 'about', title: 'About Us', href: '/About-Us' },
];

export const Default = (props: HeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;
  const navPlaceholderName = `header-nav-${DynamicPlaceholderId}`;
  const placeholders = (props.rendering as { placeholders?: Record<string, unknown[]> })
    ?.placeholders;
  const hasNavRendering = !!placeholders?.[navPlaceholderName]?.length;

  return (
    <div className={`component header bg-[#2f6f5b] text-white ${styles}`} id={id}>
      <div className="flex w-full items-center px-4 lg:px-8">
        <div className="max-lg:order-1 lg:flex-[1_1]">
          <Placeholder name={`header-left-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>
        <div className="w-full flex-1 max-lg:order-0">
          {hasNavRendering ? (
            <Placeholder name={navPlaceholderName} rendering={props.rendering} />
          ) : (
            <nav className="z-100 flex w-full bg-transparent">
              <ul
                role="menubar"
                className="flex w-full flex-col items-center justify-center gap-x-8 gap-y-4 px-4 py-6 text-lg font-semibold lg:flex-row lg:px-8 xl:gap-x-16"
              >
                <li className="shrink-0 max-lg:hidden">
                  <a href="/" className="navigation-mobile-trigger">
                    <img
                      src="/Interstate_Batteries_logo.png"
                      alt="Interstate Batteries"
                      className="h-auto w-36"
                    />
                  </a>
                </li>
                {HEADER_FALLBACK_LINKS.map((link) => (
                  <li key={link.id} className="relative flex flex-col gap-x-8 gap-y-4 xl:gap-x-14">
                    <a
                      href={link.href}
                      className="font-semibold whitespace-nowrap text-white transition-colors hover:text-white/80"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
        <div className="max-lg:order-2 lg:flex-[1_1]">
          <Placeholder name={`header-right-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>
      </div>
    </div>
  );
};
