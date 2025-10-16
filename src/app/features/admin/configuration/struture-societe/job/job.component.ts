import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Job } from '../../../../../shared/model/company';
import { ActivatedRoute, Router } from '@angular/router';
import { TabItem } from '../../../../../shared/model/user';
import {
  DynamicTableComponent,
  TableActionButton,
} from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { AddButtonComponent } from '../../../../../shared/components/add-button/add-button.component';
import {
  SearchBoxComponent,
  SelectField,
} from '../../../../../shared/components/search-box/search-box.component';
import { PageTitleComponent } from '../../../../../shared/ui/page-title/page-title.component';
import { filterDataByTerm, getValueOrEmpty } from '../../../../../shared/utility/fonction';

@Component({
  selector: 'app-job',
  imports: [AddButtonComponent, SearchBoxComponent, PageTitleComponent, DynamicTableComponent],
  templateUrl: './job.component.html',
  styleUrl: './job.component.scss',
})
export class JobComponent implements OnInit {
  jobs = signal<Job[]>([]);
  searchTerm = signal<string>('');

  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  breadCrumbItems: TabItem[] = [
    { label: 'job.breadcrumb.configuration' },
    { label: 'job.breadcrumb.structure' },
    { label: 'job.breadcrumb.jobs', active: true },
  ];
  title = signal<string>('job.titleList');
  labelButton = signal<string>('job.addButton');
  actions: TableActionButton[] = [
    {
      label: 'job.actions.edit',
      icon: 'fas fa-pencil-alt text-success',
      doAction: (item: Job) => this.edit(item),
    },
  ];

  columns = signal<(keyof Job)[]>(['name', 'companyName', 'departmentName', 'description']);
  selectedFilters = signal<SelectField[]>([]);
  private activeFilters: Record<string, string> = {};
  private filteredSelected = signal<Job[]>([]);
  ngOnInit(): void {
    const jobData: Job[] = this.activeRoute.snapshot.data['jobs']['content'];

    this.selectedFilters.set([
      {
        label: 'company',
        key: 'company',
        options: jobData
          .map(c => getValueOrEmpty(c.company?.code))
          .filter((v, i, a) => v && a.indexOf(v) === i),
        multiple: false,
        action: this.filteredDataSelected.bind(this),
      },
      {
        label: 'department',
        key: 'department',
        options: jobData
          .map(c => getValueOrEmpty(c.department?.name))
          .filter((v, i, a) => v && a.indexOf(v) === i),
        multiple: false,
        action: this.filteredDataSelected.bind(this),
      },
    ] as SelectField[]);
    this.jobs.set(jobData);
    this.filteredSelected.set(jobData);
  }

  filteredData = computed(() =>
    filterDataByTerm(this.filteredSelected(), this.searchTerm(), this.columns())
  );

  edit(job: Job) {
    const serialized = encodeURIComponent(JSON.stringify(job));
    void this.router.navigate(['/configuration/structure_societe/add-job'], {
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
      this.filteredSelected.set(this.jobs());
      return;
    }
    const filtered = this.jobs().filter(emp => {
      return Object.keys(this.activeFilters).every(filterKey => {
        if (filterKey === 'company') {
          return emp.company?.code === this.activeFilters[filterKey];
        }
        if (filterKey === 'department') {
          return emp.department?.name === this.activeFilters[filterKey];
        }
        return true;
      });
    });

    this.filteredSelected.set(filtered);
  }
}
