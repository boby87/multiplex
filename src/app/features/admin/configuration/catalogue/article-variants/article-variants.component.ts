import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Price, ProductVariant } from '../../../../../shared/model/productCategory';
import { TabItem } from '../../../../../shared/model/user';
import {
  DynamicTableComponent,
  TableActionButton,
} from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { filterDataByTerm, getValueOrEmpty } from '../../../../../shared/utility/fonction';
import { AddButtonComponent } from '../../../../../shared/components/add-button/add-button.component';
import { PageTitleComponent } from '../../../../../shared/ui/page-title/page-title.component';
import {
  SearchBoxComponent,
  SelectField,
} from '../../../../../shared/components/search-box/search-box.component';
import { RouterNavigation } from '../../../../../shared/utility/router.navigation';

@Component({
  selector: 'app-article-variants',
  imports: [AddButtonComponent, PageTitleComponent, SearchBoxComponent, DynamicTableComponent],
  templateUrl: './article-variants.component.html',
  styleUrl: './article-variants.component.scss',
})
export class ArticleVariantsComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  productVariants = signal<ProductVariant[]>([]);
  private router = inject(Router);
  searchTerm = signal<string>('');
  title = signal<string>('PRODUCT_VARIANT.title');
  labelButton = signal<string>('PRODUCT_VARIANT.addButton');
  breadCrumbItems: TabItem[] = [
    { label: 'PRODUCT_VARIANT.breadcrumb.configuration' },
    { label: 'PRODUCT_VARIANT.breadcrumb.catalogue' },
    { label: 'PRODUCT_VARIANT.breadcrumb.variants', active: true },
  ];
  actions: TableActionButton[] = [
    {
      label: 'PRODUCT_VARIANT.actions.edit',
      icon: ' fas fa-pencil-alt text-success',
      doAction: (item: ProductVariant) => this.edit(item),
    },
  ];

  columns = signal<(keyof ProductVariant)[]>([
    'urlImage',
    'code',
    'designation',
    'detailedDescription',
  ]);
  selectedFilters = signal<SelectField[]>([]);
  private activeFilters: Record<string, string> = {};
  private filteredSelected = signal<ProductVariant[]>([]);
  private priceList = signal<Price>({});

  ngOnInit(): void {
    const productVariantData: ProductVariant[] =
      this.activeRoute.snapshot.data['productVariants']['variants']['content'];
    productVariantData.forEach((product: ProductVariant) => {
      if (product.galleryImages && product.galleryImages.length > 0) {
        product.urlImage = product.galleryImages[0].url;
      }
    });
    this.selectedFilters.set([
      {
        label: 'productCategory',
        key: 'productCategory',
        options: productVariantData
          .map(c => getValueOrEmpty(c.productCategory?.code))
          .filter((v, i, a) => v && a.indexOf(v) === i),
        multiple: false,
        action: this.filteredDataSelected.bind(this),
      },
      {
        label: 'uom',
        key: 'uom',
        options: productVariantData
          .map(c => getValueOrEmpty(c.uom?.code))
          .filter((v, i, a) => v && a.indexOf(v) === i),
        multiple: false,
        action: this.filteredDataSelected.bind(this),
      },
      {
        label: 'type',
        key: 'type',
        options: productVariantData
          .map(c => getValueOrEmpty(c.productSpecs?.type))
          .filter((v, i, a) => v && a.indexOf(v) === i),
        multiple: false,
        action: this.filteredDataSelected.bind(this),
      },
    ] as SelectField[]);
    this.filteredSelected.set(productVariantData);
    this.productVariants.set(productVariantData);
  }

  filteredData = computed(() =>
    filterDataByTerm(this.filteredSelected(), this.searchTerm(), this.columns())
  );

  edit(productVariant: ProductVariant) {
    const serialized = encodeURIComponent(JSON.stringify(productVariant));
    void this.router.navigate([RouterNavigation.ADD_PRODUCT_VARIANT], {
      queryParams: { data: serialized },
    });
  }

  filteredDataSelected(key: string, value: string) {
    if (
      value &&
      value.trim() !== '' &&
      value !== 'uom' &&
      value !== 'type' &&
      value !== 'productCategory'
    ) {
      this.activeFilters[key] = value;
    } else {
      delete this.activeFilters[key];
    }
    if (Object.keys(this.activeFilters).length === 0) {
      this.filteredSelected.set(this.productVariants());
      return;
    }
    const filtered = this.productVariants().filter(emp => {
      return Object.keys(this.activeFilters).every(filterKey => {
        if (filterKey === 'uom') {
          return emp.uom?.code === this.activeFilters[filterKey];
        }
        if (filterKey === 'type') {
          return emp.productSpecs?.type === this.activeFilters[filterKey];
        }
        if (filterKey === 'productCategory') {
          return emp.productCategory?.code === this.activeFilters[filterKey];
        }
        return true;
      });
    });

    this.filteredSelected.set(filtered);
  }
}
