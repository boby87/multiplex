import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AddButtonComponent } from '../../../../../shared/components/add-button/add-button.component';
import { DynamicTableComponent, TableActionButton } from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { PageTitleComponent } from '../../../../../shared/ui/page-title/page-title.component';
import { SearchBoxComponent } from '../../../../../shared/components/search-box/search-box.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  defaultPaginatedResponse,
  PaginatedResponse,
} from '../../../../../shared/model/paginatedResponse';
import { TabItem } from '../../../../../shared/model/user';
import { filterDataByTerm, filterPaginatedByTerm } from '../../../../../shared/utility/fonction';
import { ProductBase } from '../../../../../shared/model/productCategory';
import { DynamicTablePaginatedComponent } from '../../../../../shared/components/dynamic-table-paginated/dynamic-table-paginated.component';

@Component({
  selector: 'app-base-articles',
  imports: [
    AddButtonComponent,
    PageTitleComponent,
    SearchBoxComponent,
    DynamicTablePaginatedComponent,
    DynamicTableComponent,
  ],
  templateUrl: './base-articles.component.html',
  styleUrl: './base-articles.component.scss',
})
export class BaseArticlesComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  productBase = signal<ProductBase[]>([]);
  private router = inject(Router);
  searchTerm = signal<string>('');
  title = signal('baseArticles.title');
  labelButton = signal('baseArticles.addButton');
  breadCrumbItems: TabItem[] = [
    { label: 'baseArticles.breadcrumb.configuration' },
    { label: 'baseArticles.breadcrumb.catalogue' },
    { label: 'baseArticles.breadcrumb.baseArticles', active: true },
  ];
  actions: TableActionButton[] = [
    {
      label: 'baseArticles.actions.edit',
      icon: ' fas fa-pencil-alt text-success',
      doAction: (item: ProductBase) => this.edit(item),
    },
  ];

  columns = signal<(keyof ProductBase)[]>(['code', 'designation', 'superCategory', 'productType']);

  ngOnInit(): void {
    this.productBase.set(this.activeRoute.snapshot.data['baseArticles']['content']);
  }

  filteredData = computed(() =>
    filterDataByTerm(this.productBase(), this.searchTerm(), this.columns())
  );

  edit(item: ProductBase) {
    const serialized = encodeURIComponent(JSON.stringify(item));
    void this.router.navigate(['/configuration/catalogue/add-base-article'], {
      queryParams: { data: serialized },
    });
  }
}
