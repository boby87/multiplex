import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Company } from '../../../../../shared/model/company';
import { Partner, TabItem } from '../../../../../shared/model/user';
import {
  DynamicTableComponent,
  TableActionButton,
} from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AddButtonComponent } from '../../../../../shared/components/add-button/add-button.component';
import {
  SearchBoxComponent,
  SelectField,
} from '../../../../../shared/components/search-box/search-box.component';
import { PageTitleComponent } from '../../../../../shared/ui/page-title/page-title.component';
import { CompanyService } from '../services/company.service';
import { filterDataByTerm, getValueOrEmpty } from '../../../../../shared/utility/fonction';

@Component({
  selector: 'app-companies',
  imports: [AddButtonComponent, SearchBoxComponent, PageTitleComponent, DynamicTableComponent],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss',
})
export class CompaniesComponent implements OnInit {
  companies = signal<Company[]>([]);
  title = signal<string>('companie.titleList');
  labelButton = signal<string>('companie.addButton');
  breadCrumbItems: TabItem[] = [
    { label: 'companie.breadcrumb.configuration' },
    { label: 'companie.breadcrumb.structure' },
    { label: 'companie.breadcrumb.companies', active: true },
  ];
  actions: TableActionButton[] = [
    {
      label: 'companie.actions.edit',
      icon: 'fas fa-pencil-alt text-success',
      doAction: (item: Company) => this.edit(item),
    },
  ];
  selectedFilters = signal<SelectField[]>([]);
  private activeFilters: Record<string, string> = {};
  private filteredSelected = signal<Company[]>([]);
  columns = signal<(keyof Company)[]>(['urlImage', 'name', 'legalName', 'code', 'status']);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  searchTerm = signal<string>('');

  ngOnInit(): void {
    const companiesData: Company[] = this.activeRoute.snapshot.data['companies']['content'];
    companiesData.forEach((company: Company) => {
      if (company.logo) {
        company.urlImage = company.logo.url;
      }
    });
    this.selectedFilters.set([{
      label: 'legale',
      key: 'legale',
      options: companiesData.map(c => getValueOrEmpty(c.legals?.taxAttachmentCenter)).filter((v, i, a) => v && a.indexOf(v) === i),
      multiple: false,
      action: this.filteredDataSelected.bind(this)
    },{
      label: 'status',
      key: 'status',
      options: companiesData.map(c => getValueOrEmpty(c.status)).filter((v, i, a) => v && a.indexOf(v) === i),
      multiple: false,
      action: this.filteredDataSelected.bind(this)
    },
      {
        label: 'CompanyParent',
        key: 'parent',
        options: companiesData.map(c => getValueOrEmpty(c.parent?.code)).filter((v, i, a) => v && a.indexOf(v) === i),
        multiple: false,
        action: this.filteredDataSelected.bind(this)
      }
    ] as SelectField[])
    this.companies.set(companiesData);
    this.filteredSelected.set(companiesData);


  }



  filteredData = computed(() =>
    filterDataByTerm(this.filteredSelected(), this.searchTerm(), this.columns())
  );

  edit(company: Company) {
    const serialized = encodeURIComponent(JSON.stringify(company));
    void this.router.navigate(['/configuration/structure_societe/add-company'], {
      queryParams: { data: serialized },
    });
  }

  filteredDataSelected(key: string, value: string) {
    if (value && value.trim() !== '' && value !== 'legale' && value !== 'status'&& value !== 'CompanyParent') {
      this.activeFilters[key] = value;
    } else {
      delete this.activeFilters[key];
    }
    if (Object.keys(this.activeFilters).length === 0) {
      this.filteredSelected.set(this.companies());
      return;
    }
    const filtered = this.companies().filter(emp => {
      return Object.keys(this.activeFilters).every(filterKey => {
        if (filterKey === 'legale') {
          return emp.legals?.taxAttachmentCenter === this.activeFilters[filterKey];
        }
        if (filterKey === 'parent') {
          return emp.parent?.code === this.activeFilters[filterKey];
        }
        if (filterKey === 'status') {
          return emp.status === this.activeFilters[filterKey];
        }
        return true;
      });
    });

    this.filteredSelected.set(filtered);
  }

}
