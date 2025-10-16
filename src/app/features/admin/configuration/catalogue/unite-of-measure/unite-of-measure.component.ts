import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  defaultPaginatedResponse,
  PaginatedResponse,
} from '../../../../../shared/model/paginatedResponse';
import { TabItem } from '../../../../../shared/model/user';
import { TableActionButton } from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { filterPaginatedByTerm } from '../../../../../shared/utility/fonction';
import { ProductUom } from '../../../../../shared/model/productCategory';
import { PageTitleComponent } from '../../../../../shared/ui/page-title/page-title.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddButtonComponent } from '../../../../../shared/components/add-button/add-button.component';
import { DynamicTablePaginatedComponent } from '../../../../../shared/components/dynamic-table-paginated/dynamic-table-paginated.component';
import { SearchBoxComponent } from '../../../../../shared/components/search-box/search-box.component';

@Component({
  selector: 'app-unite-of-measure',
  imports: [
    PageTitleComponent,
    ReactiveFormsModule,
    AddButtonComponent,
    DynamicTablePaginatedComponent,
    SearchBoxComponent,
  ],
  templateUrl: './unite-of-measure.component.html',
  styleUrl: './unite-of-measure.component.scss',
})
export class UniteOfMeasureComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  productsUom = signal<PaginatedResponse<ProductUom>>(defaultPaginatedResponse);
  private router = inject(Router);
  searchTerm = signal<string>('');
  title = signal('productUom.title');
  labelButton = signal('productUom.addButton');
  breadCrumbItems: TabItem[] = [
    { label: 'productUom.breadcrumb.configuration' },
    { label: 'productUom.breadcrumb.Catalogue' },
    { label: 'productUom.breadcrumb.unity_of_measure', active: true },
  ];
  actions: TableActionButton[] = [
    {
      label: 'productUom.actions.edit',
      icon: ' fas fa-pencil-alt text-success',
      doAction: (item: ProductUom) => this.edit(item),
    }
  ];
  columns = signal<(keyof ProductUom)[]>(['code', 'name', 'description']);

  ngOnInit(): void {
    this.productsUom.set(this.activeRoute.snapshot.data['productsUom']);
  }

  filteredData = computed(() =>
    filterPaginatedByTerm(this.productsUom(), this.searchTerm(), this.columns())
  );

  edit(productUom: ProductUom) {
    const serialized = encodeURIComponent(JSON.stringify(productUom));
    void this.router.navigate(['/configuration/catalogue/add-unite-of-measure'], {
      queryParams: { data: serialized },
    });
  }


}
