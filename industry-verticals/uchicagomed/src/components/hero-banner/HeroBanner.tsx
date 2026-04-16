'use client';

import React from 'react';
import {
  ImageField,
  NextImage as ContentSdkImage,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Image: ImageField;
}

interface HeroBannerProps extends ComponentProps {
  fields: Fields;
}

export const DefaultHeroBanner = (props: HeroBannerProps) => {
  const id = props.params.RenderingIdentifier;

  return (
    <section className={`relative ${props?.params?.styles}`} id={id || undefined}>
      <div className="relative min-h-[68vh]">
        <div className="absolute inset-0 z-0">
          <ContentSdkImage field={props.fields.Image} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/35" />
        </div>
        <div className="relative z-10 container flex min-h-[68vh] items-end py-10 lg:py-14">
          <div className="ml-auto w-full max-w-xl bg-white p-6 shadow-xl sm:p-8">
            <h3 className="mb-5 text-2xl lg:text-3xl">Find a Location</h3>
            <form action="" className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                name="location-search"
                id="location-search"
                placeholder="Search by city, ZIP code, or location name"
                className="form-input sm:col-span-2"
              />
              <input
                type="text"
                name="service-line"
                id="service-line"
                placeholder="Specialty or service"
                className="form-input"
              />
              <input
                type="text"
                name="distance-filter"
                id="distance-filter"
                placeholder="Distance"
                className="form-input"
              />
              <input type="submit" value="Find locations" className="main-btn mt-2 sm:col-span-2" />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Default = withDatasourceCheck()<HeroBannerProps>(DefaultHeroBanner);
