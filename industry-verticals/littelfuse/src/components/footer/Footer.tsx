import {
  ComponentParams,
  ComponentRendering,
  Image,
  ImageField,
  Link,
  LinkField,
  Placeholder,
  RichText,
  RichTextField,
  Text,
  TextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import React from 'react';

/** Littelfuse delivery branding — replaces Forma Lux / retail footer datasource when not in Experience Editor. */
const LITTELFUSE_FOOTER_LOGO_ALT = 'Littelfuse';

const LITTELFUSE_FOOTER_LOGO: ImageField = {
  value: {
    src: '/Littelfuse_logo%20copy.svg',
    width: 280,
    height: 94,
    alt: LITTELFUSE_FOOTER_LOGO_ALT,
  },
};

type LittelfuseFooterStrings = {
  titleOne: string;
  titleTwo: string;
  titleThree: string;
  titleFour: string;
  titleFive: string;
  description: string;
  copyright: string;
};

const LITTELFUSE_FOOTER_ES: LittelfuseFooterStrings = {
  titleOne: 'Productos',
  titleTwo: 'Industrias',
  titleThree: 'Soporte',
  titleFour: 'Síguenos',
  titleFive: 'Recursos',
  description:
    '<p>Soluciones de protección de circuitos, control de energía y sensores para un mundo más seguro y conectado.</p>',
  copyright: '© 2026 Littelfuse, Inc. Todos los derechos reservados.',
};

const LITTELFUSE_FOOTER_FR: LittelfuseFooterStrings = {
  titleOne: 'Produits',
  titleTwo: 'Industries',
  titleThree: 'Assistance',
  titleFour: 'Suivez-nous',
  titleFive: 'Ressources',
  description:
    '<p>Solutions de protection des circuits, de commande électrique et de détection pour un monde plus sûr et connecté.</p>',
  copyright: '© 2026 Littelfuse, Inc. Tous droits réservés.',
};

const LITTELFUSE_FOOTER_EN: LittelfuseFooterStrings = {
  titleOne: 'Products',
  titleTwo: 'Industries',
  titleThree: 'Support',
  titleFour: 'Follow us',
  titleFive: 'Resources',
  description:
    '<p>Circuit protection, power control, and sensing solutions for a safer, more connected world.</p>',
  copyright: 'Copyright © 2026 Littelfuse, Inc. All rights reserved.',
};

function isLittelfuseSite(siteName?: string): boolean {
  const envSite = (process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME ?? '').toLowerCase();
  return envSite.includes('littelfuse') || (siteName ?? '').toLowerCase().includes('littelfuse');
}

function littelfuseFooterStrings(locale?: string): LittelfuseFooterStrings {
  const l = (locale ?? 'en').toLowerCase();
  if (l.startsWith('es')) {
    return LITTELFUSE_FOOTER_ES;
  }
  if (l.startsWith('fr')) {
    return LITTELFUSE_FOOTER_FR;
  }
  return LITTELFUSE_FOOTER_EN;
}

function withLittelfuseFooterFields(base: Fields, locale: string | undefined): Fields {
  const s = littelfuseFooterStrings(locale);
  return {
    ...base,
    Logo: {
      ...base.Logo,
      value: {
        ...LITTELFUSE_FOOTER_LOGO.value,
        alt: base.Logo?.value?.alt || LITTELFUSE_FOOTER_LOGO_ALT,
      },
    },
    TitleOne: { ...base.TitleOne, value: s.titleOne },
    TitleTwo: { ...base.TitleTwo, value: s.titleTwo },
    TitleThree: { ...base.TitleThree, value: s.titleThree },
    TitleFour: { ...base.TitleFour, value: s.titleFour },
    TitleFive: { ...base.TitleFive, value: s.titleFive },
    Description: { ...base.Description, value: s.description },
    CopyrightText: { ...base.CopyrightText, value: s.copyright },
  };
}

interface Fields {
  TitleOne: TextField;
  TitleTwo: TextField;
  TitleThree: TextField;
  TitleFour: TextField;
  TitleFive: TextField;
  CopyrightText: TextField;
  PolicyText: LinkField;
  TermsText: LinkField;
  Logo: ImageField;
  Description: RichTextField;
}

type FooterProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: FooterProps) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const useLittelfuseFooter = !isPageEditing && isLittelfuseSite(page.siteName);
  const fields = useLittelfuseFooter
    ? withLittelfuseFooterFields(props.fields, page.locale)
    : props.fields;

  // rendering item id
  const id = props.params.RenderingIdentifier;

  // placeholders keys
  const phKeyOne = `footer-list-first-${props?.params?.DynamicPlaceholderId}`;
  const phKeyTwo = `footer-list-second-${props?.params?.DynamicPlaceholderId}`;
  const phKeyThree = `footer-list-third-${props?.params?.DynamicPlaceholderId}`;
  const phKeyFour = `footer-list-fourth-${props?.params?.DynamicPlaceholderId}`;
  const phKeyFive = `footer-list-fifth-${props?.params?.DynamicPlaceholderId}`;

  const sections = [
    {
      key: 'first_nav',
      title: <Text field={fields.TitleOne} />,
      content: <Placeholder name={phKeyOne} rendering={props.rendering} />,
    },
    {
      key: 'second_nav',
      title: <Text field={fields.TitleTwo} />,
      content: <Placeholder name={phKeyTwo} rendering={props.rendering} />,
    },
    {
      key: 'third_nav',
      title: <Text field={fields.TitleThree} />,
      content: <Placeholder name={phKeyThree} rendering={props.rendering} />,
    },
    {
      key: 'fourth_nav',
      title: <Text field={fields.TitleFour} />,
      content: <Placeholder name={phKeyFour} rendering={props.rendering} />,
    },
    {
      key: 'fifth_nav',
      title: <Text field={fields.TitleFive} />,
      content: <Placeholder name={phKeyFive} rendering={props.rendering} />,
    },
  ];

  return (
    <section className={`component footer relative ${props.params.styles} overflow-hidden`} id={id}>
      <div className="bg-background-muted">
        <div className="container grid gap-12 py-28.5 lg:grid-cols-[1fr_3fr]">
          <div className="flex flex-col gap-7">
            <div className="sm:max-w-34">
              <Image field={fields.Logo} />
            </div>
            <RichText field={fields.Description} />
          </div>
          <div className="grid gap-13 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5 xl:gap-12">
            {sections.map(({ key, title, content }) => (
              <div key={key}>
                <div className="text-accent mb-8 text-lg font-bold">{title}</div>
                <div className="space-y-4">{content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-background">
        <div className="container flex items-center justify-between py-8.5 max-sm:flex-col max-sm:items-start max-sm:gap-10">
          <div className="max-sm:order-2">
            <Text field={fields.CopyrightText} />
          </div>
          <div className="flex items-center justify-between gap-20 max-lg:gap-10 max-sm:order-1 max-sm:flex-col max-sm:items-start max-sm:gap-5">
            <Link field={fields.TermsText} className="hover:underline" />
            <Link field={fields.PolicyText} className="hover:underline" />
          </div>
        </div>
      </div>
    </section>
  );
};
