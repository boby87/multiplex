import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { categoryResolver } from './category/category.resolver';
import { baseArticlesResolver } from './base-articles/base.articles.resolver';
import { variantesArticlesResolver } from './article-variants/variantes.articles.resolver';
import { uniteOfMeasureResolver } from './unite-of-measure/unite.of.measure.resolver';
import { pricesResolver } from '../tarification/prices/prices.resolver';

const routes: Routes = [
  {
    path: 'product-categories',
    loadComponent: () => import('./category/category.component').then(m => m.CategoryComponent),
    resolve: {
      categories: categoryResolver,
    },
  },
  {
    path: 'add-category',
    loadComponent: () =>
      import('./category/category-form/category-form.component').then(m => m.CategoryFormComponent),
    resolve: {
      categories: categoryResolver,
    },
  },
  {
    path: 'base-products',
    loadComponent: () =>
      import('./base-articles/base-articles.component').then(m => m.BaseArticlesComponent),
    resolve: {
      baseArticles: baseArticlesResolver,
    },
  },
  {
    path: 'add-base-article',
    loadComponent: () =>
      import('./base-articles/add-base-article/add-base-article.component').then(
        m => m.AddBaseArticleComponent
      ),
    resolve: {
      baseArticles: baseArticlesResolver,
    },
  },
  {
    path: 'product-variants',
    loadComponent: () =>
      import('./article-variants/article-variants.component').then(m => m.ArticleVariantsComponent),
    resolve: {
      productVariants: variantesArticlesResolver,
    },
  },
  {
    path: 'add-variants-articles',
    loadComponent: () =>
      import('./article-variants/add-article-variants/add-article-variants.component').then(
        m => m.AddArticleVariantsComponent
      ),
    resolve: {
      baseArticles: baseArticlesResolver,
      productVariants: variantesArticlesResolver,
      pricing: pricesResolver,

    },
  },

  {
    path: 'uoms',
    loadComponent: () =>
      import('./unite-of-measure/unite-of-measure.component').then(m => m.UniteOfMeasureComponent),
    resolve: {
      productsUom: uniteOfMeasureResolver,
    },
  },
  {
    path: 'add-unite-of-measure',
    loadComponent: () =>
      import('./unite-of-measure/add-unite-of-measure/add-unite-of-measure.component').then(
        m => m.AddUniteOfMeasureComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogueRoutingModule {}
