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
import { RUSTOLEUM_BRAND_LOGO_PATH } from '@/lib/rustoleumBrandLogo';

interface ImageFields {
  Image: ImageField;
  ImageCaption: Field<string>;
  TargetUrl: LinkField;
}

interface ImageProps extends ComponentProps {
  fields: ImageFields;
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
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = params;

  /** Header logo slot (Partial Design / Header) always uses the Rust-Oleum mark from /public. */
  const useHeaderBrandLogo = !!fields && DynamicPlaceholderId === '4';

  if (!fields) {
    return <ImageDefault {...props} />;
  }
  const logoAlt =
    (fields.Image?.value?.alt as string | undefined) ||
    (fields.Image?.value?.title as string | undefined) ||
    'Rust-Oleum';

  const Image = () =>
    useHeaderBrandLogo ? (
      <img
        src={RUSTOLEUM_BRAND_LOGO_PATH}
        alt={logoAlt}
        className="h-8 w-auto max-w-[220px] object-contain object-left"
      />
    ) : (
      <ContentSdkImage field={fields.Image} />
    );
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
