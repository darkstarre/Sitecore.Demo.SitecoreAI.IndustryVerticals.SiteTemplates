import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Default } from '../components/section-wrapper/SectionWrapper';
import { ComponentProps } from 'react';
import { renderStorybookPlaceholder } from 'src/stories/helpers/renderStorybookPlaceholder';
import { CommonParams, CommonRendering } from './common/commonData';
import { AppearanceArgs, appearanceArgTypes, defaultAppearanceArgs } from './common/commonControls';
import { createAttorneyItems } from './helpers/createItems';
import { createRichTextField, createTextField } from './helpers/createFields';
import { CommonStyles } from '@/types/styleFlags';
import clsx from 'clsx';

type StoryProps = ComponentProps<typeof Default> & AppearanceArgs;

const meta = {
  title: 'Page Content/Section Wrapper',
  component: Default,
  tags: ['autodocs'],
  argTypes: {
    ...appearanceArgTypes,
  },
  args: {
    ...defaultAppearanceArgs,
  },
} satisfies Meta<StoryProps>;
export default meta;

type Story = StoryObj<StoryProps>;

const baseFields = {
  Title: createTextField('Our Featured Attorneys'),
  Description: createRichTextField(1),
};

const baseParams = CommonParams;

const baseRendering = {
  ...CommonRendering,
  componentName: 'ContentSection',
  params: baseParams,
};

export const ContentSection: Story = {
  render: (args) => {
    const promoStyles = clsx(
      baseParams.styles,
      args.BackgroundColor,
      args.BlobAccent && CommonStyles.HideBlobAccent,
      args.CurvedBottom && CommonStyles.CurvedBottom,
      args.CurvedTop && CommonStyles.CurvedTop
    );

    const params = {
      ...baseParams,
      styles: promoStyles,
    };
    return (
      <Default
        fields={baseFields}
        rendering={{
          ...baseRendering,
          placeholders: {
            [`content-section-content-${baseParams.DynamicPlaceholderId}`]: [
              renderStorybookPlaceholder(),
            ],
          },
        }}
        params={params}
      />
    );
  },
};

export const ContentSectionWithContent: Story = {
  render: (args) => {
    const promoStyles = clsx(
      baseParams.styles,
      args.BackgroundColor,
      args.BlobAccent && CommonStyles.HideBlobAccent,
      args.CurvedBottom && CommonStyles.CurvedBottom,
      args.CurvedTop && CommonStyles.CurvedTop
    );

    const params = {
      ...baseParams,
      styles: promoStyles,
    };
    return (
      <Default
        fields={baseFields}
        rendering={{
          ...baseRendering,
          placeholders: {
            [`content-section-content-${baseParams.DynamicPlaceholderId}`]: [
              {
                ...CommonRendering,
                componentName: 'AttorneysListing',
                params: {
                  ...CommonParams,
                  FieldNames: 'Slider',
                },
                fields: {
                  items: createAttorneyItems(6),
                },
              },
            ],
          },
        }}
        params={params}
      />
    );
  },
};
