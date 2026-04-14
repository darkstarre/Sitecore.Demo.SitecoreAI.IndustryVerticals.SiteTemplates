import { useEffect } from 'react';
import client from 'lib/sitecore-client';
import { LayoutServiceData, HTMLLink } from '@sitecore-content-sdk/nextjs';

/**
 * Component to render `<link>` elements for Sitecore styles
 */
const SitecoreStyles = ({
  layoutData,
  enableStyles,
  enableThemes,
}: {
  layoutData: LayoutServiceData;
  enableStyles?: boolean;
  enableThemes?: boolean;
}) => {
  const headLinks = client.getHeadLinks(layoutData, { enableStyles, enableThemes });

  useEffect(() => {
    if (headLinks.length === 0) {
      return;
    }

    const createdLinks: HTMLLinkElement[] = [];
    headLinks.forEach(({ rel, href }: HTMLLink) => {
      const existing = document.head.querySelector(
        `link[rel="${rel}"][href="${href}"][data-sitecore-style="true"]`
      ) as HTMLLinkElement | null;
      if (existing) {
        return;
      }

      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      link.setAttribute('data-sitecore-style', 'true');
      document.head.appendChild(link);
      createdLinks.push(link);
    });

    return () => {
      createdLinks.forEach((link) => link.remove());
    };
  }, [headLinks]);

  return null;
};

export default SitecoreStyles;
