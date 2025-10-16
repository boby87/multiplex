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
import { TabItem } from '../../../../../shared/model/user';
import { Role } from '../../../../../shared/model/roles';
import { MatDialog } from '@angular/material/dialog';
import { filterDataByTerm } from '../../../../../shared/utility/fonction';

@Component({
  selector: 'app-roles',
  imports: [AddButtonComponent, PageTitleComponent, SearchBoxComponent, DynamicTableComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  readonly dialog = inject(MatDialog);
  private roles = signal<Role[]>([]);
  searchTerm = signal<string>('');
  columns = signal<(keyof Role)[]>(['name', 'allowedCompanies', 'description']);
  labelButton = signal('user-role.addButton');
  title = signal('user-role.title');
  actions: TableActionButton[] = [
  ];

  readonly breadCrumbItems: TabItem[] = [
    { label: 'user-role.breadcrumb.configuration' },
    { label: 'user-role.breadcrumb.user-roles' },
    { label: 'user-role.breadcrumb.roles', active: true },
  ];

  selectedFilters = signal<SelectField[]>([]);
  private activeFilters: Record<string, string> = {};
  private filteredSelected = signal<Role[]>([]);

  ngOnInit(): void {
    const rolesData: Role[] = this.activeRoute.snapshot.data['roles']['content'];
    this.roles.set(rolesData);
    this.roles().forEach(role => {
      role.allowedCompanies = role.companies?.join(', ');
    });
    this.selectedFilters.set([
      {
        label: 'company',
        key: 'company',
        options: rolesData
          .flatMap(c => c.companies?.map(value => value))
          .filter((v, i, a) => v && a.indexOf(v) === i),
        multiple: false,
        action: this.filteredDataSelected.bind(this),
      },
    ] as SelectField[]);
    this.filteredSelected.set(rolesData);
  }

  filteredData = computed(() =>
    filterDataByTerm(this.filteredSelected(), this.searchTerm(), this.columns())
  );

  filteredDataSelected(key: string, value: string) {
    if (value && value.trim() !== '' && value !== 'company') {
      this.activeFilters[key] = value;
    } else {
      delete this.activeFilters[key];
    }
    if (Object.keys(this.activeFilters).length === 0) {
      this.filteredSelected.set(this.roles());
      return;
    }
    const filtered = this.roles().filter(emp => {
      return Object.keys(this.activeFilters).every(filterKey => {
        if (filterKey === 'company') {
          return emp.companies?.includes(this.activeFilters[filterKey]);
        }
        return true;
      });
    });

    this.filteredSelected.set(filtered);
  }

  edit(role: Role) {
    const serialized = encodeURIComponent(JSON.stringify(role));
    void this.router.navigate(['/configuration/users_roles/add_role'], {
      queryParams: { data: serialized },
    });
  }
}
