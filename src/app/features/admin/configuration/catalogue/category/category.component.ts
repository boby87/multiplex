import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCategory } from '../../../../../shared/model/productCategory';
import { AddButtonComponent } from '../../../../../shared/components/add-button/add-button.component';
import { PageTitleComponent } from '../../../../../shared/ui/page-title/page-title.component';
import { SearchBoxComponent } from '../../../../../shared/components/search-box/search-box.component';
import {
  DynamicTableComponent,
  TableActionButton,
} from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { filterDataByTerm } from '../../../../../shared/utility/fonction';
import { TabItem } from '../../../../../shared/model/user';

@Component({
  selector: 'app-category',
  imports: [AddButtonComponent, PageTitleComponent, SearchBoxComponent, DynamicTableComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  title = signal('categories.title');
  labelButton = signal('categories.addButton');
  actions: TableActionButton[] = [
    {
      label: 'categories.actions.edit',
      icon: ' fas fa-pencil-alt text-success',
      doAction: (item: ProductCategory) => this.edit(item),
    },
  ];

  categoryResponse = signal<ProductCategory[]>([]);

  ngOnInit(): void {
    this.categoryResponse.set(this.activatedRoute.snapshot.data['categories']['content']);
  }

  searchTerm = signal<string>('');
  columns = signal<(keyof ProductCategory)[]>(['name', 'code', 'description']);
  updatePage = output<number>();
  breadCrumbItems: TabItem[] = [
    { label: 'categories.breadcrumb.configuration' },
    { label: 'categories.breadcrumb.catalogue' },
    { label: 'categories.breadcrumb.categories', active: true },
  ];

  filteredData = computed(() =>
    filterDataByTerm(this.categoryResponse(), this.searchTerm(), this.columns())
  );

  private edit(item: ProductCategory): void {
    const serialized = encodeURIComponent(JSON.stringify(item));
    void this.router.navigate(['/configuration/catalogue/add-category'], {
      queryParams: { data: serialized },
    });
  }
}
