import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Default, Card, KeyFigures } from '../components/features/Features';
import { ComponentProps } from 'react';
import { CommonParams, CommonRendering } from './common/commonData';
import {
  BackgroundColorArgs,
  backgroundColorArgTypes,
  defaultBackgroundColorArgs,
} from './common/commonControls';
import { createFeatureItems } from './helpers/createItems';
import { createIGQLData } from './helpers/createIGQLData';
import {
  createRichTextField,
  createTextField,
  createIGQLField,
  createLinkField,
  createImageField,
} from './helpers/createFields';
import clsx from 'clsx';

type StoryProps = ComponentProps<typeof Default> &
  BackgroundColorArgs & {
    numberOfItems: number;
  };

type FieldsType = ComponentProps<typeof Default>['fields'];

const keyFiguresMockFields = {
  data: {
    datasource: {
      title: createIGQLField(createTextField('')),
      description: createIGQLField({ value: '' }),
      children: {
        results: [
          {
            id: 'kf-1',
            featureTitle: createIGQLField(createTextField('7,000')),
            featureDescription: createIGQLField(createTextField('Employees')),
            featureImage: createIGQLField(createImageField('placeholder')),
            featureImageDark: createIGQLField(createImageField('placeholder')),
            featureLink: createIGQLField(createLinkField('')),
          },
          {
            id: 'kf-2',
            featureTitle: createIGQLField(createTextField('14')),
            featureDescription: createIGQLField(
              createTextField(
                'Facilities with OSHA VPP Star rating across our operations footprint.',
                1
              )
            ),
            featureImage: createIGQLField(createImageField('placeholder')),
            featureImageDark: createIGQLField(createImageField('placeholder')),
            featureLink: createIGQLField(createLinkField('')),
          },
          {
            id: 'kf-3',
            featureTitle: createIGQLField(createTextField('44,000 MW')),
            featureDescription: createIGQLField(
              createTextField(
                'One of the largest competitive power generators in the U.S., with approximately this nameplate capacity.',
                2
              )
            ),
            featureImage: createIGQLField(createImageField('placeholder')),
            featureImageDark: createIGQLField(createImageField('placeholder')),
            featureLink: createIGQLField(createLinkField('')),
          },
        ],
      },
    },
  },
} as unknown as FieldsType;

const meta = {
  title: 'Page Content/Features',
  component: Default,
  tags: ['autodocs'],
  argTypes: {
    ...backgroundColorArgTypes,
    numberOfItems: {
      name: 'Number of features',
      control: {
        type: 'range',
        min: 1,
        max: 21,
        step: 1,
      },
    },
  },
  args: {
    numberOfItems: 3,
    ...defaultBackgroundColorArgs,
  },
} satisfies Meta<StoryProps>;
export default meta;

type Story = StoryObj<StoryProps>;

const baseParams = CommonParams;

const baseRendering = {
  ...CommonRendering,
  componentName: 'Features',
  params: CommonParams,
};

export const DefaultFeatures: Story = {
  render: (args) => {
    const featureStyles = clsx(baseParams.styles, args.BackgroundColor);
    const params = {
      ...baseParams,
      styles: featureStyles,
    };

    return (
      <Default
        fields={
          createIGQLData({
            createItems: createFeatureItems,
            count: args.numberOfItems,
            topLevelFields: {
              title: createIGQLField(createTextField('Tips for Energy Conservation')),
              description: createIGQLField(createRichTextField(1)),
            },
          }) as unknown as FieldsType
        }
        params={params}
        rendering={baseRendering}
      />
    );
  },
};

export const KeyFiguresBand: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => {
    const featureStyles = clsx(baseParams.styles, args.BackgroundColor);
    const params = {
      ...baseParams,
      styles: featureStyles,
    };
    return (
      <KeyFigures
        fields={keyFiguresMockFields}
        params={params}
        rendering={{ ...baseRendering, params }}
      />
    );
  },
};

export const CardFeatures: Story = {
  parameters: {
    layout: 'padded',
  },
  render: (args) => {
    const featureStyles = clsx(baseParams.styles, args.BackgroundColor);
    const params = {
      ...baseParams,
      styles: featureStyles,
    };

    return (
      <Card
        fields={
          createIGQLData({
            createItems: createFeatureItems,
            count: args.numberOfItems,
            topLevelFields: {
              title: createIGQLField(createTextField('Quick Actions')),
              description: createIGQLField(createRichTextField(1)),
            },
          }) as unknown as FieldsType
        }
        params={params}
        rendering={baseRendering}
      />
    );
  },
};
