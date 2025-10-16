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
import { Partner, TabItem, TechnicienEntreprise } from '../../../../shared/model/user';
import { filterDataByTerm, getValueOrEmpty } from '../../../../shared/utility/fonction';
import { RouterNavigation } from '../../../../shared/utility/router.navigation';
import { Company } from '../../../../shared/model/company';

@Component({
  selector: 'app-techniciens',
  imports: [AddButtonComponent, PageTitleComponent, SearchBoxComponent, DynamicTableComponent],
  templateUrl: './techniciens.component.html',
  styleUrl: './techniciens.component.scss',
})
export class TechniciensComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private technicians = signal<Partner[]>([]);
  private router = inject(Router);
  title = signal('technician.physical.title');
  labelButton = signal('technician.physical.addButton');
  private activeFilters: Record<string, string> = {};
  private filteredSelected = signal<Partner[]>([]);
  selectedFilters = signal<SelectField[]>([]);

  breadCrumbItems: TabItem[] = [{ label: 'technician.breadcrumb.physicalList', active: true }];
  actions: TableActionButton[] = [
    {
      label: 'technician.physical.actions.edit',
      icon: 'fas fa-pencil-alt text-success',
      doAction: item => this.edit(item),
    },
  ];

  columns = signal<(keyof Partner)[]>(['urlImage','name', 'email', 'phone']);
  searchTerm = signal<string>('');

  ngOnInit(): void {
    const technicianData: Partner[] = this.activeRoute.snapshot.data['technicians']['content'];
    technicianData.forEach(technician => {
      if (technician.picture) {
        technician.urlImage = technician.picture.url;
      }
    });
    this.technicians.set(technicianData);
    this.filteredSelected.set(technicianData);
    this.selectedFilters.set([
      {
        label: 'technicianType',
        key: 'technicianType',
        options: technicianData
          .map(c => getValueOrEmpty(c.technicianType))
          .filter((v, i, a) => v && a.indexOf(v) === i),
        multiple: false,
        action: this.filteredDataSelected.bind(this),
      }
    ] as SelectField[]);
  }

  filteredData = computed(() =>
    filterDataByTerm(this.filteredSelected(), this.searchTerm(), this.columns())
  );

  filteredDataSelected(key: string, value: string) {
    if (value && value.trim() !== '' && value !== 'technicianType') {
      this.activeFilters[key] = value;
    } else {
      delete this.activeFilters[key];
    }
    if (Object.keys(this.activeFilters).length === 0) {
      this.filteredSelected.set(this.technicians());
      return;
    }
    const filtered = this.technicians().filter(emp => {
      return Object.keys(this.activeFilters).every(filterKey => {
        if (filterKey === 'technicianType') {
          return emp.technicianType?.includes(this.activeFilters[filterKey]);
        }
        return true;
      });
    });

    this.filteredSelected.set(filtered);
  }

  edit(technicien: TechnicienEntreprise) {
    const serialized = encodeURIComponent(JSON.stringify(technicien));
    void this.router.navigate([RouterNavigation.ADD_TECHNICIAN_PHYSICAL], {
      queryParams: { data: serialized },
    });
  }

}
