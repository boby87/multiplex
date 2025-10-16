import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Partner, TabItem, TechnicienEntreprise } from '../../../../shared/model/user';
import {
  DynamicTableComponent,
  TableActionButton,
} from '../../../../shared/components/dynamic-table/dynamic-table.component';
import { PageTitleComponent } from '../../../../shared/ui/page-title/page-title.component';
import {
  SearchBoxComponent,
  SelectField,
} from '../../../../shared/components/search-box/search-box.component';
import { AddButtonComponent } from '../../../../shared/components/add-button/add-button.component';
import { filterDataByTerm, getValueOrEmpty } from '../../../../shared/utility/fonction';
import { RouterNavigation } from '../../../../shared/utility/router.navigation';

@Component({
  selector: 'app-technicien-business',
  imports: [PageTitleComponent, SearchBoxComponent, AddButtonComponent, DynamicTableComponent],
  templateUrl: './technicien-business.component.html',
  styleUrl: './technicien-business.component.scss',
})
export class TechnicienBusinessComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private techniciens = signal<Partner[]>([]);
  private router = inject(Router);
  breadCrumbItems: TabItem[] = [{ label: 'technician.breadcrumb.physicalList', active: true }];
  searchTerm = signal<string>('');
  title = signal('technician.business.title');
  labelButton = signal('technician.business.addButton');
  actions: TableActionButton[] = [
    {
      label: 'technician.business.actions.edit',
      icon: 'fas fa-pencil-alt text-success',
      doAction: item => this.edit(item),
    },
  ];

  columns = signal<(keyof Partner)[]>([
    'company',
    'name',
    'technicianType',
    'technicianCategory',
    'technicianGrade',
    'taxRegime',
  ]);
  selectedFilters = signal<SelectField[]>([]);
  private activeFilters: Record<string, string> = {};
  private filteredSelected = signal<Partner[]>([]);

  ngOnInit(): void {
    const companyData: Partner[] = this.activeRoute.snapshot.data['technicians']['content'];
    companyData.forEach((item: Partner) => {
      item.company = item.companies?.map(comp => comp.company.name).join(', ') || '';
    });

    this.selectedFilters.set([
      {
        label: 'company',
        key: 'company',
        options: companyData
          .map(c => getValueOrEmpty(c.company))
          .filter((v, i, a) => v && a.indexOf(v) === i),
        multiple: false,
        action: this.filteredDataSelected.bind(this),
      },
      {
        label: 'technicianGrade',
        key: 'technicianGrade',
        options: companyData
          .map(c => getValueOrEmpty(c.technicianCategory))
          .filter((v, i, a) => v && a.indexOf(v) === i),
        multiple: false,
        action: this.filteredDataSelected.bind(this),
      },
      {
        label: 'taxRegime',
        key: 'taxRegime',
        options: companyData
          .map(c => getValueOrEmpty(c.taxRegime))
          .filter((v, i, a) => v && a.indexOf(v) === i),
        multiple: false,
        action: this.filteredDataSelected.bind(this),
      },
    ] as SelectField[]);
    this.filteredSelected.set(companyData);
    this.techniciens.set(companyData);
  }

  filteredData = computed(() =>
    filterDataByTerm(this.filteredSelected(), this.searchTerm(), this.columns())
  );

  edit(technician: TechnicienEntreprise) {
    const serialized = encodeURIComponent(JSON.stringify(technician));
    void this.router.navigate([RouterNavigation.ADD_TECHNICIAN_BUSINESS], {
      queryParams: { data: serialized },
    });
  }

  filteredDataSelected(key: string, value: string) {
    if (
      value &&
      value.trim() !== '' &&
      value !== 'company' &&
      value !== 'technicianGrade' &&
      value !== 'taxRegime'
    ) {
      this.activeFilters[key] = value;
    } else {
      delete this.activeFilters[key];
    }
    if (Object.keys(this.activeFilters).length === 0) {
      this.filteredSelected.set(this.techniciens());
      return;
    }
    const filtered = this.techniciens().filter(emp => {
      return Object.keys(this.activeFilters).every(filterKey => {
        if (filterKey === 'company') {
          return emp.company?.includes(this.activeFilters[filterKey]);
        }
        if (filterKey === 'technicianGrade') {
          return emp.technicianGrade === this.activeFilters[filterKey];
        }
        if (filterKey === 'taxRegime') {
          return emp.taxRegime === this.activeFilters[filterKey];
        }
        return true;
      });
    });

    this.filteredSelected.set(filtered);
  }
}
