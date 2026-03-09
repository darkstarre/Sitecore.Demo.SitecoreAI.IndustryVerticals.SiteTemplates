import { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import { SitecoreItem } from './common';

export interface ArticleFields {
  Title: Field<string>;
  Image: ImageField;
}

export type Article = SitecoreItem<ArticleFields>;
