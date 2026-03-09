import { ComponentProps } from 'react';
import { Default as AttorneysListing, Slider } from '../components/attorneys-listing/AttorneysListing';
import { Meta, StoryObj } from '@storybook/react-vite/*';
import { CommonParams, CommonRendering } from './common/commonData';
import { generateId } from './helpers/generateId';
import { createAttorneyItems } from './helpers/createItems';

type StoryProps = ComponentProps<typeof AttorneysListing> & {
  numberOfItems: number;
};

const meta = {
  title: 'Attorneys/Attorneys Listing',
  component: AttorneysListing,
  tags: ['autodocs'],
  argTypes: {
    numberOfItems: {
      name: 'Number of attorneys',
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
  },
} satisfies Meta<StoryProps>;
export default meta;

type Story = StoryObj<StoryProps>;

const baseParams = {
  ...CommonParams,
};

const baseRendering = {
  ...CommonRendering,
  componentName: 'Attorneys Listing',
  params: baseParams,
};

export const Default: Story = {
  render: (args) => {
    const uid = generateId();
    return (
      <AttorneysListing
        params={{ ...baseParams }}
        rendering={{ ...baseRendering, uid }}
        fields={{
          items: createAttorneyItems(args.numberOfItems),
        }}
      />
    );
  },
};

export const SliderStory: Story = {
  name: 'Slider',
  args: {
    numberOfItems: 5,
  },
  render: (args) => {
    const uid = generateId();
    return (
      <Slider
        params={{ ...baseParams }}
        rendering={{ ...baseRendering, uid }}
        fields={{
          items: createAttorneyItems(args.numberOfItems),
        }}
      />
    );
  },
};
