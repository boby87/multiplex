import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AclGroupPermissions } from '../../../../../../shared/model/acl.group.permissions';
import { TabItem } from '../../../../../../shared/model/user';
import { ActivatedRoute } from '@angular/router';
import { AclService } from '../../services/Acl.service';
import { DynamicFormGroupComponent } from '../../../../../../shared/components/dynamic-form-group/dynamic-form-group.component';
import { PageTitleComponent } from '../../../../../../shared/ui/page-title/page-title.component';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseDynamicForm } from '../../../../../../shared/components/input_type/dynamic.form';
import { DualListbox } from '../../../../../../shared/components/input_type/dual.listbox';
import { toFormGroupArray } from '../../../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';
import { Location } from '@angular/common';
import { RoleAcl } from '../../../../../../shared/model/roles';

@Component({
  selector: 'app-add-acl',
  imports: [DynamicFormGroupComponent, PageTitleComponent, ReactiveFormsModule, TranslatePipe],
  templateUrl: './add-acl.component.html',
  styleUrl: './add-acl.component.scss',
})
export class AddAclComponent implements OnInit {
  readonly form = signal(new FormGroup({}));
  readonly fields = signal<BaseDynamicForm<any>[]>([]);
  readonly title = signal('acl.updateTitle');
  readonly breadCrumbItems: TabItem[] = [
    { label: 'acl.breadcrumb.configuration' },
    { label: 'acl.breadcrumb.user-roles' },
    { label: 'acl.breadcrumb.acls'},
    { label: 'acl.update', active: true },
  ];

  private readonly activeRoute = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly formBuilder = inject(FormBuilder);
  private readonly aclService = inject(AclService);

  readonly oldAcl = signal<RoleAcl>({ code: '', permissions: [] });
  readonly aclToUpdate = signal<RoleAcl>({ code: '', permissions: [] });

  ngOnInit(): void {
    this.parseQueryParams();
  }

  private parseQueryParams(): void {
    this.activeRoute.queryParamMap.subscribe(params => {
      const dataParam = params.get('data');
      const aclParam = params.get('serialized');

      if (!dataParam || !aclParam) return;

      try {
        const oldAclData = JSON.parse(decodeURIComponent(dataParam));
        const aclUpdateData = JSON.parse(decodeURIComponent(aclParam));

        this.oldAcl.set(oldAclData);
        this.aclToUpdate.set(aclUpdateData);

        const generatedFields = this.generateDualListboxAclFields(aclUpdateData, oldAclData);
        this.fields.set([generatedFields]);
        this.form.set(toFormGroupArray(this.formBuilder, this.fields()));
      } catch (error) {
        console.error('Erreur lors de la lecture des ACLs depuis les query params', error);
      }
    });
  }

  private generateDualListboxAclFields(data: RoleAcl, oldAcl: RoleAcl): BaseDynamicForm<any> {
    return new DualListbox({
      key: data.code,
      label: data.code,
      classColumn: 'col-md-12',
      value: oldAcl.permissions,
      options: data.permissions.map(act => ({ key: act, value: act })),
    });
  }

  onSubmit(): void {
    const formValue = this.form().getRawValue();

    const result: { code: string; permissions: string[] }[] = Object.entries(formValue).map(
      ([code, permissions]) => ({
        code,
        permissions: Array.isArray(permissions) ? permissions : [],
      })
    );

    const firstRole = result[0];

    if (!this.oldAcl().roleId) {
      console.error('Role ID manquant, impossible de mettre à jour les ACLs');
      return;
    }

    this.aclService.patchRoleAcl(this.oldAcl().roleId!, firstRole).subscribe({
      next: () => this.cancelAction(),
      error: err => console.error('Erreur lors de la mise à jour des ACLs', err),
    });
  }

  cancelAction(): void {
    this.location.back();
  }
}
