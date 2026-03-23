import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Default } from '../components/attorney-details/AttorneyDetails';
import { ComponentProps } from 'react';
import { CommonParams, CommonRendering } from './common/commonData';
import {
  BackgroundColorArgs,
  backgroundColorArgTypes,
  defaultBackgroundColorArgs,
} from './common/commonControls';
import { createImageField, createRichTextField, createTextField } from './helpers/createFields';

type StoryProps = ComponentProps<typeof Default> & BackgroundColorArgs;

const meta = {
  title: 'Attorneys/Attorney Details',
  component: Default,
  tags: ['autodocs'],
  argTypes: {
    ...backgroundColorArgTypes,
  },
  args: {
    ...defaultBackgroundColorArgs,
  },
} satisfies Meta<StoryProps>;
export default meta;

type Story = StoryObj<StoryProps>;

const baseFields = {
  Title: createTextField('Attorney Details'),
  FullName: createTextField('Jane Doe'),
  JobTitle: createTextField('Partner'),
  Photo: createImageField(),
  Bio: createRichTextField(3),
};

const baseParams = CommonParams;

const baseRendering = {
  ...CommonRendering,
  componentName: 'Attorney Details',
  params: baseParams,
};

export const AttorneyDetails: Story = {
  render: (args) => {
    return (
      <Default
        fields={baseFields}
        rendering={baseRendering}
        params={{
          ...baseParams,
          styles: `${baseParams.styles} ${args.BackgroundColor}`,
        }}
      />
    );
  },
};

/** Demonstrates Treelist-driven Practices (no pasted HTML for the list body). */
export const LinkedPractices: Story = {
  render: (args) => {
    return (
      <Default
        fields={{
          ...baseFields,
          FullName: createTextField('Demo Attorney'),
          LinkedPracticeCategories: {
            targetItems: [
              { id: 'cat-1', url: '/People', fields: { Title: { value: 'Financial Services' } } },
              { id: 'cat-2', fields: { Title: { value: 'Technology Transactions' } } },
            ],
          },
          Practices: createRichTextField(1),
        }}
        rendering={baseRendering}
        params={{
          ...baseParams,
          styles: `${baseParams.styles} ${args.BackgroundColor}`,
        }}
      />
    );
  },
};
