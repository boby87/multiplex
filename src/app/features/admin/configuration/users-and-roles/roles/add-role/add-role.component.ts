import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TabItem } from '../../../../../../shared/model/user';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../../../../shared/model/company';
import { Role } from '../../../../../../shared/model/roles';
import { RoleService } from '../../services/roles.service';
import { ROLE_FIELDS } from '../../../../../../shared/components/templates/roles';
import { toFormGroupArray } from '../../../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';
import { AclService } from '../../services/Acl.service';
import { AclGroupPermissions } from '../../../../../../shared/model/acl.group.permissions';
import { BaseDynamicForm } from '../../../../../../shared/components/input_type/dynamic.form';
import { FormGroupBox } from '../../../../../../shared/components/input_type/form.group.box';
import { DualListbox } from '../../../../../../shared/components/input_type/dual.listbox';
import { getValueOrEmpty } from '../../../../../../shared/utility/fonction';
import { TranslatePipe } from '@ngx-translate/core';
import { Select } from '../../../../../../shared/components/input_type/select';
import { PageTitleComponent } from '../../../../../../shared/ui/page-title/page-title.component';
import {
  DynamicFormAccordionComponent
} from '../../../../../../shared/components/dynamic-form-accordion/dynamic-form-accordion.component';

@Component({
  selector: 'app-add-role',
  imports: [ReactiveFormsModule, TranslatePipe, PageTitleComponent, DynamicFormAccordionComponent],
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.scss',
})
export class AddRoleComponent implements OnInit {
  form = signal(new FormGroup({}));
  fields = signal(ROLE_FIELDS);
  aclPermissions = signal<AclGroupPermissions[]>([]);
  readonly title = signal('user-role.updateTitle');
  readonly breadCrumbItems: TabItem[] = [
    { label: 'user-role.breadcrumb.configuration' },
    { label: 'user-role.breadcrumb.user-roles' },
    { label: 'user-role.breadcrumb.roles' },
    { label: 'user-role.new', active: true },
  ];
  private activeRoute = inject(ActivatedRoute);
  companies = signal<Company[]>([]);
  role = signal<Role>({ name: '', description: '', companies: [] });
  private router = inject(Router);

  private formBuilder = inject(FormBuilder);
  private roleService = inject(RoleService);
  private aclService = inject(AclService);
  ngOnInit(): void {
    this.aclService.getAllAcls().subscribe({
      next: acls => {
        this.aclPermissions.set(acls);
        const generatedFields = this.generateDualListboxAclFields(acls);
        this.fields.update(oldFields => [...oldFields, ...generatedFields]);
        const formGroup = toFormGroupArray(this.formBuilder, this.fields());
        this.form.set(formGroup);
      },
      error: err => {
        console.error('Erreur lors du chargement des ACLs', err);
      },
    });

    const companiesData = this.activeRoute.snapshot.data['companies']?.['content'] || [];
    this.companies.set(companiesData);

    // Mise à jour dynamique du champ "companies" dans les fields
    this.fields.update(oldFields => {
      return oldFields.map(field => {
        if (field.key === 'companies') {
          return new Select({
            ...field,
            options: this.companies().map(company => ({
              key: getValueOrEmpty(company.companyId),
              value: getValueOrEmpty(company.name),
            })),
          });
        }
        return field;
      });
    });

    this.form.set(toFormGroupArray(this.formBuilder, this.fields()));
  }

  generateDualListboxAclFields(data: AclGroupPermissions[]): BaseDynamicForm<any>[] {
    return data.map(moduleGroup => {
      const sectionFields = Object.entries(moduleGroup.permissions).map(([section, actions]) => {
        return new DualListbox({
          key: section,
          label: section,
          classColumn: 'col-md-6',
          options: actions.map(act => ({ key: act, value: act })),
        });
      });

      return new FormGroupBox({
        key: moduleGroup.module,
        label: `Permissions - ${moduleGroup.module}`,
        classColumn: 'col-md-12',
        groupFields: sectionFields,
      });
    });
  }
  onSubmit(): void {
    const aclPermissions: Record<string, string[]> = {};

    this.aclPermissions().forEach(acl => {
      const moduleGroup = this.form().get(acl.module);

      if (moduleGroup instanceof FormGroup) {
        Object.keys(acl.permissions).forEach(section => {
          const control = moduleGroup.get(section);
          if (control && Array.isArray(control.value)) {
            aclPermissions[section] = [...control.value];
          }
        });
      }
    });
    const payload = {
      description: this.form().get('description')?.value,
      companies: [this.form().get('companies')?.value],
      name: this.form().get('name')?.value,
      rolePermissions: aclPermissions,
    };

    this.roleService.createRole(payload).subscribe({
      next: () => {
        this.cancelAction();
      },
      error: err => {
        console.error('Erreur lors de la création du rôle :', err);
      },
    });
  }

  cancelAction(): void {
    void this.router.navigate(['/configuration/users_roles/roles']);
  }
}
