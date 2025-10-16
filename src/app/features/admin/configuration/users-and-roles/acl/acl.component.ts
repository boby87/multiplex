import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
import { filterDataByTerm } from '../../../../../shared/utility/fonction';
import { Acl, Role} from '../../../../../shared/model/roles';
import { Company } from '../../../../../shared/model/company';
import { RoleService } from '../services/roles.service';
import { AclService } from '../services/Acl.service';

@Component({
  selector: 'app-acl',
  imports: [DynamicTableComponent, PageTitleComponent, SearchBoxComponent],
  templateUrl: './acl.component.html',
  styleUrl: './acl.component.scss',
})
export class AclComponent implements OnInit {
  searchTerm = signal<string>('');
  private activeRoute = inject(ActivatedRoute);
  private roleService = inject(RoleService);
  private aclService = inject(AclService);

  private router = inject(Router);
  labelButton = signal('acl.addButton');
  selectedFilters = signal<SelectField[]>([]);
  roles = signal<Role[]>([]);
  companies = signal<Company[]>([]);
  acls = signal<{ model: string; role: string; permission: string[] }[]>([]);
  title = signal('acl.title');
  breadCrumbItems: TabItem[] = [
    { label: 'acl.breadcrumb.configuration' },
    { label: 'acl.breadcrumb.user-roles' },
    { label: 'acl.breadcrumb.acls', active: true },
  ];
  actions: TableActionButton[] = [
    {
      label: 'acl.actions.edit',
      icon: 'fas fa-pencil-alt text-success',
      doAction: (acl) => this.edit(acl),
    }
]
  columns = signal<(keyof { model: string; role: string; permission: string[] })[]>([
    'model',
    'role',
    'permission',
  ]);

  ngOnInit(): void {
    this.companies.set(this.activeRoute.snapshot.data['companies']['content']);

    this.selectedFilters.set([
      {
        key: 'companies',
        multiple: false,
        label: 'Filter by Company',
        options: this.companies().map(company => company.name),
        action: (key: string, value: string) => this.selectRoleByCompany(key, value),
      },
      {
        key: 'roles',
        multiple: false,
        label: 'Filter By  Roles',
        options: [],
      },
    ] as SelectField[]);
  }

  filteredData = computed(() => filterDataByTerm(this.acls(), this.searchTerm(), this.columns()));

  private selectRoleByCompany(key: string, value: string) {
    const companyId = this.companies().find(c => c.name === value)?.companyId;

    if (companyId) {
      this.acls.set([]);
      this.roleService.filterRoles(companyId).subscribe({
        next: roles => {
          this.roles.set(roles.content)
          this.selectedFilters().forEach(filter => {
            if (filter.key === 'roles') {
              filter.options = roles.content.map(role => role.name!);
              filter.action = (key, value) => this.getAclsByRoleAndCompany(value, companyId);
            }
          });
        },
        error: err => {
          console.error('Erreur lors du chargement des ACLs par société', err);
        },
      });
    } else {
      this.acls.set([]);
    }
  }


  getAclsByRoleAndCompany(roleName: string, companyId: string) {
    this.aclService.getAclsByRoles([roleName], companyId).subscribe({
      next: acls => {
        const result: { model: string; role: string; permission: string[] }[] = acls.flatMap(item =>
          Object.entries(item.permissions!).map(([model, permissions]) => ({
            model,
            role: roleName,
            permission: permissions,
          }))
        );
        this.acls.set(result);
      },
      error: err => {
        console.error('Erreur lors du chargement des ACLs par rôle et société', err);
      },
    });
  }
  edit(oldAcl: { model: string; role: string; permission: string[] }) {
    this.aclService.getAclByCode(oldAcl.model).subscribe({
      next: acl => {
        const aclData = {
          code: oldAcl.model,
          roleId: this.roles().find(role => role.name === oldAcl.role)?.id,
          permissions: oldAcl.permission,
        };
        const serializedOldAcl = encodeURIComponent(JSON.stringify(aclData));
        const serialized = encodeURIComponent(JSON.stringify(acl));
        void this.router.navigate([`/configuration/users_roles/add-acl/`], {
          queryParams: { data: serializedOldAcl, serialized },
        });
      },
      error: err => {
        console.error('Erreur lors de la récupération des détails de l\'ACL:', err);
      },
    })

  }

  delect(acl: Acl) {
    console.log('delect employee', acl);
  }
}
