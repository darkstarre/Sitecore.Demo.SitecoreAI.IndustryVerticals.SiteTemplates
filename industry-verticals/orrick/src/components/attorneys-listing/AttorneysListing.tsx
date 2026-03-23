import { useId } from 'react';
import React from 'react';
import Link from 'next/link';
import {
  Text as ContentSdkText,
  NextImage as ContentSdkImage,
  useSitecore,
  ImageField,
} from '@sitecore-content-sdk/nextjs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Navigation, Pagination } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Attorney } from '@/types/attorneys';
import { ComponentProps } from '@/lib/component-props';
import { SitecoreItem } from '@/types/common';

interface AttorneysListingProps extends ComponentProps {
  fields: {
    items: SitecoreItem<Attorney>[];
  };
}

const PEOPLE_PAGE_SEED = [
  {
    fullName: 'Ali Abugheida',
    jobTitle:
      'Partner, Financial & Fintech Advisory, Strategic Advisory & Government Enforcement (SAGE)',
    url: '/People/Ali-Abugheida',
  },
  {
    fullName: 'Richard Gallagher',
    jobTitle: 'Chief Practice Officer Lit&IP',
    url: '/People/Richard-Gallagher',
  },
  {
    fullName: 'Zachary Finley',
    jobTitle: 'Partner',
    url: '/People/Zachary-Finley',
  },
  {
    fullName: 'Daniel Yost',
    jobTitle: 'Partner',
    url: '/People/Daniel-Yost',
  },
  {
    fullName: 'Kyle Zhu',
    jobTitle: 'Senior Associate',
    url: '/People/Kyle-Zhu',
  },
];

const buildSeedAttorney = (
  seed: (typeof PEOPLE_PAGE_SEED)[number],
  index: number,
  fallbackPhoto?: ImageField
): SitecoreItem<Attorney> => ({
  id: `seed-attorney-${index}`,
  name: seed.fullName.toLowerCase().replace(/\s+/g, '-'),
  displayName: seed.fullName,
  url: seed.url,
  fields: {
    FullName: { value: seed.fullName },
    JobTitle: { value: seed.jobTitle },
    Photo: fallbackPhoto || { value: {} },
    Bio: { value: '' },
  },
});

const AttorneyCard = ({ url, fields }: { url: string; fields: Attorney }) => {
  return (
    <Link
      href={url}
      className="bg-background-secondary dark:bg-background-secondary-dark shadow-soft block overflow-hidden rounded-lg"
    >
      <div className="placeholder-pattern-background aspect-square">
        <ContentSdkImage field={fields.Photo} className="h-full w-full rounded-t-lg object-cover" />
      </div>
      <div className="p-7 text-center">
        <h5>
          <ContentSdkText field={fields.FullName} />
        </h5>
        <p className="text-accent text-lg lg:text-xl">
          <ContentSdkText field={fields.JobTitle} />
        </p>
      </div>
    </Link>
  );
};

export const Default = (props: AttorneysListingProps) => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const routeName = page?.layout?.sitecore?.route?.name?.toLowerCase() || '';
  const sitecoreAttorneys = props.fields.items.filter((item) => item.fields?.FullName);
  const isPeoplePage = routeName === 'people';
  const fallbackPhoto = sitecoreAttorneys[0]?.fields?.Photo;
  const attorneys = isPeoplePage
    ? PEOPLE_PAGE_SEED.map((seed, index) => {
        const existing = sitecoreAttorneys[index];
        return existing
          ? {
              ...existing,
              url: seed.url,
              fields: {
                ...existing.fields,
                FullName: { value: seed.fullName },
                JobTitle: { value: seed.jobTitle },
              },
            }
          : buildSeedAttorney(seed, index, fallbackPhoto);
      })
    : sitecoreAttorneys;

  return (
    <section className={`relative py-16 ${props.params.styles}`} id={id || undefined}>
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-3">
          {attorneys.map((attorney) => (
            <AttorneyCard key={attorney.id} url={attorney.url} fields={attorney.fields} />
          ))}
        </div>
      </div>
    </section>
  );
};

export const Slider = (props: AttorneysListingProps) => {
  const uid = useId();
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const routeName = page?.layout?.sitecore?.route?.name?.toLowerCase() || '';
  const sitecoreAttorneys = props.fields.items.filter((item) => item.fields?.FullName);
  const isPeoplePage = routeName === 'people';
  const fallbackPhoto = sitecoreAttorneys[0]?.fields?.Photo;
  const attorneys = isPeoplePage
    ? PEOPLE_PAGE_SEED.map((seed, index) => {
        const existing = sitecoreAttorneys[index];
        return existing
          ? {
              ...existing,
              url: seed.url,
              fields: {
                ...existing.fields,
                FullName: { value: seed.fullName },
                JobTitle: { value: seed.jobTitle },
              },
            }
          : buildSeedAttorney(seed, index, fallbackPhoto);
      })
    : sitecoreAttorneys;

  return (
    <section
      className={`relative overflow-hidden py-8 ${props.params.styles}`}
      id={id || undefined}
    >
      <div className="relative container space-y-8">
        <div className="slider-btn-wrapper">
          <button className={`slider-btn slider-btn-prev-${uid}`}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button className={`slider-btn slider-btn-next-${uid}`}>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
        <Swiper
          modules={[Navigation, Pagination, Keyboard]}
          spaceBetween={48}
          slidesPerView={1}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          keyboard={{
            enabled: true,
            onlyInViewport: true,
          }}
          navigation={{
            prevEl: `.slider-btn-prev-${uid}`,
            nextEl: `.slider-btn-next-${uid}`,
          }}
          pagination={{
            clickable: true,
            el: '.slider-pagination-wrapper',
            type: 'bullets',
            bulletElement: 'button',
            bulletClass: 'slider-pagination-btn',
            bulletActiveClass: 'active',
          }}
          className="!overflow-visible"
        >
          {attorneys.map((attorney) => {
            return (
              <SwiperSlide key={attorney.id}>
                <AttorneyCard url={attorney.url} fields={attorney.fields} />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="slider-pagination-wrapper"></div>
      </div>
    </section>
  );
};
