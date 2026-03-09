import React from 'react';
import { Link as ContentSdkLink, Text, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface LinkListProps extends ComponentProps {
  fields?: {
    /**
     * The Integrated graphQL query result. This illustrates the way to access the datasource children.
     */
    data?: {
      datasource?: {
        children?: {
          results?: Array<{
            field?: {
              link?: LinkField;
            };
          }>;
        };
        field?: {
          title?: TextField;
        };
      };
    };
  };
}

const LinkListItem = ({
  index,
  total,
  field,
}: {
  index: number;
  total: number;
  field: LinkField;
}) => {
  const classNames = [
    `item${index}`,
    index % 2 === 0 ? 'odd' : 'even',
    index === 0 ? 'first' : '',
    index === total - 1 ? 'last' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={classNames}>
      <div className="field-link">
        <ContentSdkLink field={field} />
      </div>
    </li>
  );
};

export const Default = ({ params, fields }: LinkListProps) => {
  const datasource = fields?.data?.datasource;
  const styles = `component link-list ${params.styles || ''}`.trim();
  const id = params.RenderingIdentifier;

  const getLinksFromDatasource = (): LinkField[] => {
    if (!datasource) {
      return [];
    }

    // Common shape used by integrated GraphQL children queries.
    const childrenResults = datasource.children?.results ?? [];
    const childrenLinks = childrenResults
      .map((item) => item?.field?.link)
      .filter((link): link is LinkField => !!link);

    if (childrenLinks.length > 0) {
      return childrenLinks;
    }

    // Fallback for datasource field-based list shapes.
    const fieldName = params.FieldNames;
    const loweredFieldName = fieldName
      ? `${fieldName.charAt(0).toLowerCase()}${fieldName.slice(1)}`
      : undefined;
    const fieldBag = (datasource as unknown as { field?: Record<string, unknown> })?.field;
    const listSource =
      (fieldBag && fieldName && fieldBag[fieldName]) || // e.g. SecondaryNavigation
      (fieldBag && loweredFieldName && fieldBag[loweredFieldName]); // e.g. secondaryNavigation

    if (!listSource || typeof listSource !== 'object') {
      return [];
    }

    const asRecord = listSource as {
      results?: Array<{ field?: { link?: LinkField }; link?: LinkField }>;
      targetItems?: Array<{ field?: { link?: LinkField }; link?: LinkField }>;
    };

    const resultLinks =
      asRecord.results
        ?.map((item) => item?.field?.link || item?.link)
        .filter((link): link is LinkField => !!link) ?? [];

    if (resultLinks.length > 0) {
      return resultLinks;
    }

    return (
      asRecord.targetItems
        ?.map((item) => item?.field?.link || item?.link)
        .filter((link): link is LinkField => !!link) ?? []
    );
  };

  const renderContent = () => {
    if (!datasource) {
      return <h3>Link List</h3>;
    }

    const validLinks = getLinksFromDatasource();

    const links = validLinks.map((linkField, index) => (
      <LinkListItem
        key={`${index}-${linkField.value?.href || linkField.value?.text || 'link'}`}
        index={index}
        total={validLinks.length}
        field={linkField}
      />
    ));

    return (
      <>
        <Text tag="h3" field={datasource.field?.title} />
        <ul>{links}</ul>
      </>
    );
  };

  return (
    <div className={styles} id={id}>
      <div className="component-content">{renderContent()}</div>
    </div>
  );
};

/**
 * SXA rendering variant used by header links.
 * Must be an explicit function export so component-map generation picks it up.
 */
export const SecondaryNavigation = (props: LinkListProps) => <Default {...props} />;
