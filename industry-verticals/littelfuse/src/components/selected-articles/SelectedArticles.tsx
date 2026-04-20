'use client';

import { ComponentProps } from '@/lib/component-props';
import {
  Field,
  ImageField,
  LinkField,
  Link as ContentSskLink,
  RichTextField,
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import AccentLine from '@/assets/icons/accent-line/AccentLine';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Article } from '@/types/article';
import Link from 'next/link';
import { cn } from '@/shadcn/lib/utils';
import { CommonStyles, LayoutStyles } from '@/types/styleFlags';

interface Fields {
  Title: Field<string>;
  Description: RichTextField;
  ExploreLink: LinkField;
  Articles: Array<Article>;
}

export type CarouselProps = ComponentProps & {
  fields: Fields;
};

/** Same electronics / circuit imagery as the home hero (not retail placeholder assets). */
const LITTELFUSE_DEMO_ARTICLE_IMAGE = {
  src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=800&fit=crop&q=85&auto=format',
  width: 800,
  height: 800,
} as const;

/** Real Littelfuse items for demo when CMS has few/no articles (home carousel, News & Events page). */
const LITTELFUSE_DEMO_ARTICLES: Article[] = [
  {
    id: 'littelfuse-external-article-board-appointment',
    name: 'littelfuse-board-appointment',
    displayName: 'Littelfuse Appoints Holly B. Paeper to Board of Directors',
    url: 'https://investor.littelfuse.com/news/news-details/2026/Littelfuse-Appoints-Holly-B--Paeper-to-Board-of-Directors/default.aspx',
    fields: {
      Title: { value: 'Littelfuse Appoints Holly B. Paeper to Board of Directors' },
      ShortDescription: {
        value:
          'Littelfuse announced Holly B. Paeper joined the Board of Directors and Technology Committee effective March 4, 2026.',
      },
      Content: { value: '' },
      Image: {
        value: {
          ...LITTELFUSE_DEMO_ARTICLE_IMAGE,
          alt: 'Littelfuse board of directors announcement',
        },
      },
      PublishedDate: { value: '2026-03-05' },
      Author: {
        id: 'littelfuse-external-author',
        name: 'littelfuse',
        displayName: 'Littelfuse',
        url: '',
        fields: { AuthorName: { value: 'Littelfuse' } },
      },
      Tags: [],
      Category: {
        id: 'littelfuse-external-category',
        name: 'news',
        displayName: 'News',
        url: '',
        fields: { Category: { value: 'Press Release' } },
      },
    },
  },
  {
    id: 'littelfuse-external-article-relay-launch',
    name: 'littelfuse-cpc1343g-relay-launch',
    displayName: 'Littelfuse Launches CPC1343G OptoMOS Solid-State Relay',
    url: 'https://www.littelfuse.com/company/news-and-events/in-the-news/newspages-articles/press-releases/2026/littelfuse-launches-cpc1343g-optomos-solid-state-relay-for-high-current-high-isolation-applications',
    fields: {
      Title: {
        value:
          'Littelfuse Launches CPC1343G OptoMOS Solid-State Relay for High-Current, High-Isolation Applications',
      },
      ShortDescription: {
        value:
          'Littelfuse introduced the CPC1343G OptoMOS relay for high-current and high-isolation designs in demanding applications.',
      },
      Content: { value: '' },
      Image: {
        value: {
          ...LITTELFUSE_DEMO_ARTICLE_IMAGE,
          alt: 'Littelfuse CPC1343G relay press release',
        },
      },
      PublishedDate: { value: '2026-01-01' },
      Author: {
        id: 'littelfuse-external-author',
        name: 'littelfuse',
        displayName: 'Littelfuse',
        url: '',
        fields: { AuthorName: { value: 'Littelfuse' } },
      },
      Tags: [],
      Category: {
        id: 'littelfuse-external-category',
        name: 'news',
        displayName: 'News',
        url: '',
        fields: { Category: { value: 'Press Release' } },
      },
    },
  },
  {
    id: 'littelfuse-external-article-q4-2025',
    name: 'littelfuse-q4-2025-results',
    displayName: 'Littelfuse Reports Fourth Quarter and Full Year 2025 Results',
    url: 'https://investor.littelfuse.com/news/news-details/2026/Littelfuse-Reports-Fourth-Quarter-and-Full-Year-2025-Results/default.aspx',
    fields: {
      Title: { value: 'Littelfuse Reports Fourth Quarter and Full Year 2025 Results' },
      ShortDescription: {
        value:
          'Fourth quarter net sales of $594 million, up 12% year-over-year, with strong cash generation and expanded adjusted EBITDA margin.',
      },
      Content: { value: '' },
      Image: {
        value: {
          ...LITTELFUSE_DEMO_ARTICLE_IMAGE,
          alt: 'Littelfuse financial results',
        },
      },
      PublishedDate: { value: '2026-01-28' },
      Author: {
        id: 'littelfuse-external-author',
        name: 'littelfuse',
        displayName: 'Littelfuse',
        url: '',
        fields: { AuthorName: { value: 'Littelfuse' } },
      },
      Tags: [],
      Category: {
        id: 'littelfuse-external-category',
        name: 'news',
        displayName: 'News',
        url: '',
        fields: { Category: { value: 'Investor News' } },
      },
    },
  },
  {
    id: 'littelfuse-external-article-basler',
    name: 'littelfuse-basler-acquisition',
    displayName: 'Littelfuse Completes Acquisition of Basler Electric',
    url: 'https://investor.littelfuse.com/news/news-details/2025/Littelfuse-Completes-Acquisition-of-Basler-Electric/',
    fields: {
      Title: { value: 'Littelfuse Completes Acquisition of Basler Electric' },
      ShortDescription: {
        value:
          "Strategic acquisition expands industrial control and protection capabilities and strengthens Littelfuse's position in high-growth markets.",
      },
      Content: { value: '' },
      Image: {
        value: {
          ...LITTELFUSE_DEMO_ARTICLE_IMAGE,
          alt: 'Littelfuse Basler Electric acquisition',
        },
      },
      PublishedDate: { value: '2025-12-11' },
      Author: {
        id: 'littelfuse-external-author',
        name: 'littelfuse',
        displayName: 'Littelfuse',
        url: '',
        fields: { AuthorName: { value: 'Littelfuse' } },
      },
      Tags: [],
      Category: {
        id: 'littelfuse-external-category',
        name: 'news',
        displayName: 'News',
        url: '',
        fields: { Category: { value: 'Press Release' } },
      },
    },
  },
  {
    id: 'littelfuse-external-article-investor-day',
    name: 'littelfuse-investor-day-2026',
    displayName: 'Littelfuse to Host 2026 Investor Day',
    url: 'https://investor.littelfuse.com/news/news-details/2026/Littelfuse-to-Host-2026-Investor-Day/default.aspx',
    fields: {
      Title: { value: 'Littelfuse to Host 2026 Investor Day' },
      ShortDescription: {
        value:
          'Leadership will outline strategy and long-term growth priorities at the May 2026 Investor Day in New York City.',
      },
      Content: { value: '' },
      Image: {
        value: {
          ...LITTELFUSE_DEMO_ARTICLE_IMAGE,
          alt: 'Littelfuse investor day',
        },
      },
      PublishedDate: { value: '2026-02-01' },
      Author: {
        id: 'littelfuse-external-author',
        name: 'littelfuse',
        displayName: 'Littelfuse',
        url: '',
        fields: { AuthorName: { value: 'Littelfuse' } },
      },
      Tags: [],
      Category: {
        id: 'littelfuse-external-category',
        name: 'news',
        displayName: 'News',
        url: '',
        fields: { Category: { value: 'Investor News' } },
      },
    },
  },
];

function shouldMergeLittelfuseDemoArticles(datasourceTitleLower: string): boolean {
  const t = datasourceTitleLower;
  return (
    t.includes('carousel 2') ||
    t.includes('news and events') ||
    t.includes('news & events') ||
    t.includes('newsevents') ||
    t.includes('in the news') ||
    (t.includes('browse') && t.includes('range')) ||
    (t.includes('news') && t.includes('event'))
  );
}

const mergeUniqueArticlesByUrl = (items: Article[]) => {
  const seenUrls = new Set<string>();

  return items.filter((item) => {
    if (!item?.url || seenUrls.has(item.url)) {
      return false;
    }

    seenUrls.add(item.url);
    return true;
  });
};

const ARTICLE_CARD_IMAGE_FALLBACK = { width: 800, height: 800 };

function hasValidImageDimensions(v: ImageField['value'] | undefined): boolean {
  if (!v) return false;
  const w = typeof v.width === 'string' ? parseFloat(v.width) : v.width;
  const h = typeof v.height === 'string' ? parseFloat(v.height) : v.height;
  return (
    typeof w === 'number' &&
    !Number.isNaN(w) &&
    w > 0 &&
    typeof h === 'number' &&
    !Number.isNaN(h) &&
    h > 0
  );
}

function ensureArticleImageDimensions(item: Article): Article {
  const img = item.fields?.Image;
  const v = img?.value;
  if (!v?.src || hasValidImageDimensions(v)) {
    return item;
  }

  return {
    ...item,
    fields: {
      ...item.fields,
      Image: {
        ...img,
        value: {
          ...v,
          width: ARTICLE_CARD_IMAGE_FALLBACK.width,
          height: ARTICLE_CARD_IMAGE_FALLBACK.height,
        },
      },
    },
  };
}

function isLittelfuseSite(siteName?: string): boolean {
  const envSite = (process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME ?? '').toLowerCase();
  return envSite.includes('littelfuse') || (siteName ?? '').toLowerCase().includes('littelfuse');
}

/** Retail starter / FormaLux image paths still common in cloned Littelfuse content. */
function isRetailStarterArticleImageSrc(src: string): boolean {
  const s = src.toLowerCase();
  if (s.includes('unsplash.com/photo-1518770660439')) return false;
  return (
    s.includes('featuredproduct') ||
    s.includes('drill') ||
    s.includes('flosser') ||
    s.includes('usb-c') ||
    s.includes('homepagepromoctas') ||
    /\/image\s*copy\./i.test(src)
  );
}

function replaceRetailStarterArticleImage(item: Article): Article {
  const src = item.fields?.Image?.value?.src;
  if (typeof src !== 'string' || !isRetailStarterArticleImageSrc(src)) {
    return item;
  }

  return {
    ...item,
    fields: {
      ...item.fields,
      Image: {
        ...item.fields?.Image,
        value: {
          ...LITTELFUSE_DEMO_ARTICLE_IMAGE,
          alt: item.fields?.Image?.value?.alt || 'Littelfuse news',
        },
      },
    },
  };
}

export const Default = (props: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { page } = useSitecore();

  const id = props.params.RenderingIdentifier;
  const dataSourceTitle = props.fields?.Title?.value?.toLowerCase() || '';
  const mergeLittelfuseDemos = shouldMergeLittelfuseDemoArticles(dataSourceTitle);
  const sitecoreArticles = props.fields?.Articles || [];
  let articles = (
    mergeLittelfuseDemos
      ? mergeUniqueArticlesByUrl([...LITTELFUSE_DEMO_ARTICLES, ...sitecoreArticles])
      : sitecoreArticles
  ).map(ensureArticleImageDimensions);

  if (isLittelfuseSite(page.siteName)) {
    articles = articles.map(replaceRetailStarterArticleImage);
  }
  const slidesPerViewByArticleSize = articles.length <= 2 ? 1 : 2;
  const multipleArticles = articles.length > 1;
  const isReversed = props?.params?.styles?.includes(LayoutStyles.Reversed);
  const swiperFirstRef = useRef<SwiperClass | null>(null);
  const swiperSecondRef = useRef<SwiperClass | null>(null);
  const hideAccentLine = props.params.styles?.includes(CommonStyles.HideAccentLine);

  const handleNext = () => {
    if (currentIndex < articles.length - 1) {
      swiperFirstRef.current?.slideNext();
      swiperSecondRef.current?.slideNext();
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      swiperFirstRef.current?.slidePrev();
      swiperSecondRef.current?.slidePrev();
      setCurrentIndex(currentIndex - 1);
    }
  };

  const containerAlignment = isReversed ? 'container-align-left' : 'container-align-right';

  const flexDirectionClass = isReversed ? 'md:flex-row-reverse' : 'md:flex-row';

  const translateClass =
    articles.length > 1 ? (isReversed ? 'lg:-translate-x-3' : 'lg:translate-x-3') : '';

  const aspectClass = articles.length >= 2 ? 'lg:aspect-2/3' : 'lg:aspect-2/1';

  const gridItemClass = cn(
    'col-span-1',
    articles.length === 1 ? 'lg:col-span-full' : 'lg:col-span-1',
    isReversed && 'lg:order-2'
  );

  return (
    <section className={`${props.params.styles} py-20`} id={id ? id : undefined}>
      <div className={cn(containerAlignment, 'relative overflow-hidden')}>
        <div
          className={cn('flex', 'flex-col', flexDirectionClass, 'items-center', 'w-full', 'gap-10')}
        >
          <div className="w-full space-y-5 md:w-1/3">
            <h2 className="inline-block max-w-md">
              <Text field={props.fields.Title} />
              {!hideAccentLine && <AccentLine className="w-full max-w-xs" />}
            </h2>

            <div className="max-w-md">
              <ContentSdkRichText field={props.fields.Description} />
            </div>

            <ContentSskLink field={props.fields.ExploreLink} className="arrow-btn" />
          </div>

          <div className={cn('w-full', 'md:w-2/3', 'lg:transform', translateClass)}>
            <div className="relative overflow-hidden">
              <div className={`grid grid-cols-1 gap-5 lg:grid-cols-3`}>
                <div className={gridItemClass}>
                  <div className="relative">
                    <Swiper
                      modules={[Autoplay, Pagination]}
                      slidesPerView={1}
                      initialSlide={0}
                      loop={true}
                      autoplay={false}
                      className="article-carousel-first"
                      autoHeight={true}
                      pagination={{
                        el: '.article-carousel-pagination',
                        clickable: false,
                      }}
                      allowTouchMove={false}
                      simulateTouch={false}
                      onSwiper={(swiper) => {
                        swiperFirstRef.current = swiper;
                      }}
                    >
                      {articles.map((article) => {
                        return (
                          <SwiperSlide key={article.id}>
                            <Link href={article.url}>
                              <div className={`overflow-hidden rounded-lg`}>
                                <ContentSdkImage
                                  field={article.fields.Image}
                                  className={cn(
                                    'aspect-square h-full w-full object-cover',
                                    aspectClass
                                  )}
                                />
                              </div>

                              {article.fields?.Title?.value && (
                                <div className="absolute bottom-0 z-20 m-3 max-w-full xl:m-4">
                                  <div className="flex items-end">
                                    <div className="bg-background/75 max-w-full space-y-1 overflow-hidden p-5 text-ellipsis">
                                      <div className="flex items-center gap-1 overflow-hidden text-xs font-extralight text-ellipsis whitespace-nowrap">
                                        <div className="h-[1px] w-7 bg-black"></div>
                                        <div className="text-foreground/75">
                                          <Text
                                            editable={false}
                                            field={article.fields?.Category?.fields?.Category}
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <h6 className="line-clamp-2 max-w-full overflow-hidden wrap-anywhere text-ellipsis">
                                          <Text editable={false} field={article.fields?.Title} />
                                        </h6>
                                      </div>
                                    </div>
                                    <div className="bg-accent inline-block p-2">
                                      <ArrowRight
                                        size={16}
                                        strokeWidth={1}
                                        className="text-background"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Link>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                </div>

                {multipleArticles && (
                  <div className="lg:col-span-2">
                    <div className="flex h-full flex-col">
                      <div className="hidden flex-shrink-0 lg:block">
                        <Swiper
                          modules={[Autoplay]}
                          slidesPerView={slidesPerViewByArticleSize}
                          loop={true}
                          spaceBetween={20}
                          autoplay={false}
                          allowTouchMove={false}
                          simulateTouch={false}
                          className="article-carousel-second"
                          onSwiper={(swiper) => {
                            swiperSecondRef.current = swiper;
                          }}
                          initialSlide={1}
                          breakpoints={{
                            640: {
                              slidesPerView: 1,
                              spaceBetween: 20,
                            },
                            1024: {
                              slidesPerView: slidesPerViewByArticleSize,
                              spaceBetween: 20,
                            },
                          }}
                        >
                          {articles.map((article) => (
                            <SwiperSlide key={article.id}>
                              <Link href={article.url}>
                                <div className="overflow-hidden rounded-lg">
                                  <ContentSdkImage
                                    field={article.fields.Image}
                                    className={`h-full w-full object-cover ${articles.length >= 3 ? 'aspect-4/5' : 'aspect-[3/1.8]'}`}
                                  />
                                </div>
                              </Link>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                      <div className={`mx-auto my-auto`}>
                        <div className="inline-flex flex-row items-center gap-5">
                          <div className="flex items-center">
                            <button
                              className={`swiper-btn-prev text-accent ${
                                currentIndex === 0 && 'article-carousel-btn-disabled'
                              }`}
                              disabled={currentIndex === 0}
                              name="previous-article"
                              aria-label="Previous article"
                              onClick={handlePrev}
                            >
                              <ChevronLeft />
                            </button>
                          </div>
                          <div className="article-carousel-pagination flex flex-wrap"></div>
                          <div className="flex items-center">
                            <button
                              disabled={currentIndex === articles.length - 1}
                              className={`swiper-btn-prev text-accent ${
                                currentIndex === articles.length - 1 &&
                                'article-carousel-btn-disabled'
                              }`}
                              name="next-article"
                              aria-label="Next article"
                              onClick={handleNext}
                            >
                              <ChevronRight />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
