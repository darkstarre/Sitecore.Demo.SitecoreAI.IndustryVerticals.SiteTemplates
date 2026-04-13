import {
  Field,
  ImageField,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  LinkField,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import React from 'react';
import { ComponentProps } from 'lib/component-props';

interface ImageFields {
  Image: ImageField;
  ImageCaption: Field<string>;
  TargetUrl: LinkField;
}

interface ImageProps extends ComponentProps {
  fields: ImageFields;
}

function getImageSrc(field: ImageField | undefined): string | undefined {
  if (!field) return undefined;
  const fromValue = field.value?.src;
  if (typeof fromValue === 'string' && fromValue.trim().length > 0) {
    return fromValue;
  }
  const json = field as { jsonValue?: { value?: { src?: string } } };
  const fromJson = json.jsonValue?.value?.src;
  if (typeof fromJson === 'string' && fromJson.trim().length > 0) {
    return fromJson;
  }
  return undefined;
}

const ImageWrapper: React.FC<{ className: string; id?: string; children: React.ReactNode }> = ({
  className,
  id,
  children,
}) => (
  <div className={className.trim()} id={id}>
    <div className="component-content">{children}</div>
  </div>
);

const ImageDefault: React.FC<ImageProps> = ({ params }) => (
  <ImageWrapper className={`component image ${params.styles}`}>
    <span className="is-empty-hint">Image</span>
  </ImageWrapper>
);

export const Default: React.FC<ImageProps> = (props) => {
  const { page } = useSitecore();
  const { fields, params } = props;
  const { styles, RenderingIdentifier: id } = params;

  if (!fields) {
    return <ImageDefault {...props} />;
  }

  const imageSrc = getImageSrc(fields.Image);
  if (!imageSrc) {
    return (
      <ImageWrapper className={`component image ${styles}`} id={id}>
        {page.mode.isEditing ? <span className="is-empty-hint">Image</span> : null}
        <Text tag="span" className="image-caption" field={fields.ImageCaption} />
      </ImageWrapper>
    );
  }

  const Image = () => <ContentSdkImage field={fields.Image} />;
  const shouldWrapWithLink = !page.mode.isEditing && fields.TargetUrl?.value?.href;

  return (
    <ImageWrapper className={`component image ${styles}`} id={id}>
      {shouldWrapWithLink ? (
        <ContentSdkLink field={fields.TargetUrl}>
          <Image />
        </ContentSdkLink>
      ) : (
        <Image />
      )}
      <Text tag="span" className="image-caption" field={fields.ImageCaption} />
    </ImageWrapper>
  );
};
