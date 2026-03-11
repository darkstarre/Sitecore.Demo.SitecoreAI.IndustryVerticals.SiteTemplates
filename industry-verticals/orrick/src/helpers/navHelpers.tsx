import { Text as ContentSdkText, LinkField } from '@sitecore-content-sdk/nextjs';
import { NavigationListProps } from '@/components/navigation/Navigation';

const FORCED_LABEL_BY_ID: Record<string, string> = {
  'about-us-nav-item': 'About Us',
};

const normalizeNavigationLabel = (value?: string): string => {
  const text = (value || '').trim();
  const lower = text.toLowerCase();

  if (lower === 'services') return 'Practices';
  if (lower === 'doctors') return 'Attorneys';

  return text;
};

const normalizeNavigationHref = (href?: string): string | undefined => {
  if (!href) return href;
  return href.replace('/Doctors', '/Attorneys');
};

export const getNavigationText = function (props: NavigationListProps) {
  let text;
  const forcedLabel = FORCED_LABEL_BY_ID[props.fields.Id];
  if (forcedLabel) {
    return forcedLabel;
  }

  const sourceText =
    props.fields.NavigationTitle?.value?.toString() ||
    props.fields.Title?.value?.toString() ||
    props.fields.DisplayName;
  const normalizedText = normalizeNavigationLabel(sourceText);

  if (props.fields.NavigationTitle && normalizedText === sourceText) {
    text = <ContentSdkText field={props.fields.NavigationTitle} />;
  } else if (props.fields.Title && normalizedText === sourceText) {
    text = <ContentSdkText field={props.fields.Title} />;
  } else {
    text = normalizedText;
  }

  return text;
};

export const getLinkField = (props: NavigationListProps): LinkField => ({
  value: {
    href: normalizeNavigationHref(props.fields.Href),
    title: getLinkTitle(props),
    querystring: props.fields.Querystring,
  },
});

const getLinkTitle = (props: NavigationListProps): string | undefined => {
  const forcedLabel = FORCED_LABEL_BY_ID[props.fields.Id];
  if (forcedLabel) {
    return forcedLabel;
  }

  let title: string | undefined;
  if (props.fields.NavigationTitle?.value) {
    title = props.fields.NavigationTitle.value.toString();
  } else if (props.fields.Title?.value) {
    title = props.fields.Title.value.toString();
  } else {
    title = props.fields.DisplayName;
  }

  return normalizeNavigationLabel(title);
};
