import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AddButtonComponent } from '../../../../../shared/components/add-button/add-button.component';
import {
  DynamicTableComponent,
  TableActionButton,
} from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { PageTitleComponent } from '../../../../../shared/ui/page-title/page-title.component';
import {
  SearchBoxComponent,
  SelectField,
} from '../../../../../shared/components/search-box/search-box.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from '../../../../../shared/model/company';
import { TabItem } from '../../../../../shared/model/user';
import { filterDataByTerm, getValueOrEmpty } from '../../../../../shared/utility/fonction';

@Component({
  selector: 'app-departement',
  imports: [AddButtonComponent, PageTitleComponent, SearchBoxComponent, DynamicTableComponent],
  templateUrl: './departement.component.html',
  styleUrl: './departement.component.scss',
})
export class DepartementComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  departments = signal<Department[]>([]);
  private router = inject(Router);
  breadCrumbItems: TabItem[] = [
    { label: 'department.breadcrumb.configuration' },
    { label: 'department.breadcrumb.structure' },
    { label: 'department.breadcrumb.departments', active: true },
  ];

  searchTerm = signal<string>('');
  title = signal<string>('department.titleList');
  labelButton = signal<string>('department.addButton');
  actions: TableActionButton[] = [
    {
      label: 'department.actions.edit',
      icon: 'fas fa-pencil-alt text-success',
      doAction: (item: Department) => this.edit(item),
    },
  ];

  columns = signal<(keyof Department)[]>([ 'name', 'parentName', 'companyName']);
  selectedFilters = signal<SelectField[]>([]);
  private activeFilters: Record<string, string> = {};
  private filteredSelected = signal<Department[]>([]);

  ngOnInit(): void {
    const departmentsData: Department[] = this.activeRoute.snapshot.data['departments']['content'];

    this.selectedFilters.set([
      {
        label: 'company',
        key: 'company',
        options: departmentsData
          .map(c => getValueOrEmpty(c.company?.code))
          .filter((v, i, a) => v && a.indexOf(v) === i),
        multiple: false,
        action: this.filteredDataSelected.bind(this),
      },
    ] as SelectField[]);
    this.departments.set(departmentsData);
    this.filteredSelected.set(departmentsData);
  }

  filteredData = computed(() =>
    filterDataByTerm(this.filteredSelected(), this.searchTerm(), this.columns())
  );

  edit(department: Department) {
    const serialized = encodeURIComponent(JSON.stringify(department));
    void this.router.navigate(['/configuration/structure_societe/add-departement'], {
      queryParams: { data: serialized },
    });
  }

  filteredDataSelected(key: string, value: string) {
    if (value && value.trim() !== '' && value !== 'company') {
      this.activeFilters[key] = value;
    } else {
      delete this.activeFilters[key];
    }
    if (Object.keys(this.activeFilters).length === 0) {
      this.filteredSelected.set(this.departments());
      return;
    }
    const filtered = this.departments().filter(emp => {
      return Object.keys(this.activeFilters).every(filterKey => {
        if (filterKey === 'company') {
          return emp.company?.code === this.activeFilters[filterKey];
        }
        return true;
      });
    });

    this.filteredSelected.set(filtered);
  }
}
