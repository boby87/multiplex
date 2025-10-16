import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AddButtonComponent } from '../../../../shared/components/add-button/add-button.component';
import {
  DynamicTableComponent,
  TableActionButton,
} from '../../../../shared/components/dynamic-table/dynamic-table.component';
import { PageTitleComponent } from '../../../../shared/ui/page-title/page-title.component';
import {
  SearchBoxComponent,
  SelectField,
} from '../../../../shared/components/search-box/search-box.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Partner, TabItem } from '../../../../shared/model/user';
import { filterDataByTerm } from '../../../../shared/utility/fonction';

@Component({
  selector: 'app-employees',
  imports: [AddButtonComponent, PageTitleComponent, SearchBoxComponent, DynamicTableComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
})
export class EmployeesComponent implements OnInit {
  private employees = signal<Partner[]>([]);
  searchTerm = signal<string>('');
  private activeRoute = inject(ActivatedRoute);

  private router = inject(Router);
  title = signal('employee.title');
  labelButton = signal('employee.addButton');
  selectedFilters = signal<SelectField[]>([]);
  private filteredEmployees = signal<Partner[]>([]);
  private activeFilters: Record<string, string> = {};

  breadCrumbItems: TabItem[] = [
    { label: 'employee.breadcrumb.humanResources', link: 'human_resources' },
    { label: 'employee.breadcrumb.employees', active: true },
  ];
  actions: TableActionButton[] = [
    {
      label: 'employee.actions.edit',
      icon: 'fas fa-pencil-alt text-success',
      doAction: (item: Partner) => this.edit(item),
    },
  ];

  columns = signal<(keyof Partner)[]>(['company', 'username', 'firstname', 'email', 'phone']);

  ngOnInit(): void {
    const companyData: Partner[] =this.activeRoute.snapshot.data['employees']['partners']['content']
    companyData.forEach((item: Partner) => {
      item.company = item.companies?.map(comp => comp.company.name).join(', ') || '';
    })
    this.employees.set(companyData);
    this.filteredEmployees.set(companyData);
    const selectedFilter = [
      this.buildSelectField('companies', 'Sociétés', company => company.company.name),
      this.buildSelectField('departments', 'Départements', company => company.department.name),
      this.buildSelectField('job', 'Postes', company => company.job.name),
    ];
    this.selectedFilters.set(selectedFilter);
  }

  filteredData = computed(() =>
    filterDataByTerm(this.filteredEmployees(), this.searchTerm(), this.columns())
  );

  filteredDataSelected(key: string, value: string) {
    if (value && value.trim() !== '') {
      this.activeFilters[key] = value;
    } else {
      delete this.activeFilters[key]; // supprime le filtre si vide
    }

    const filtered = this.employees().filter(
      emp =>
        emp.companies?.some(company => {
          const matchCompany = this.activeFilters['companies']
            ? company.company?.name?.includes(this.activeFilters['companies'])
            : true;
          const matchDepartment = this.activeFilters['departments']
            ? company.department?.name?.includes(this.activeFilters['departments'])
            : true;
          const matchJob = this.activeFilters['job']
            ? company.job?.name?.includes(this.activeFilters['job'])
            : true;

          return matchCompany && matchDepartment && matchJob;
        }) ?? false
    );

    this.filteredEmployees.set(filtered);
  }

  edit(employee: Partner) {
    const serialized = encodeURIComponent(JSON.stringify(employee));
    void this.router.navigate(['/human_resources/add-employees'], {
      queryParams: { data: serialized },
    });
  }


  private buildSelectField(
    key: 'companies' | 'departments' | 'job',
    label: string,
    extractor: (company: any) => string
  ): SelectField {
    const options = Array.from(
      new Set(
        this.employees()
          .flatMap(emp => emp.companies?.map(extractor) || [])
          .filter(opt => !!opt?.trim())
      )
    );

    return { key, label, options, multiple: true, action: this.filteredDataSelected.bind(this) };
  }
}
