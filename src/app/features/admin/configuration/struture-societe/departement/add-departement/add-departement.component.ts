import { Component, inject, OnInit, signal } from '@angular/core';

import { isEmpty } from 'lodash';
import { PageTitleComponent } from '../../../../../../shared/ui/page-title/page-title.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DEPARTEMENT_FIELDS } from '../../../../../../shared/components/templates/departement';
import { TabItem } from '../../../../../../shared/model/user';
import { ActivatedRoute, Router } from '@angular/router';
import { Company, Department } from '../../../../../../shared/model/company';
import { Select } from '../../../../../../shared/components/input_type/select';
import { DepartmentService } from '../../services/department.service';
import { toFormGroupArray } from '../../../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';
import { DynamicFormGroupComponent } from '../../../../../../shared/components/dynamic-form-group/dynamic-form-group.component';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectField } from '../../../../../../shared/components/search-box/search-box.component';

@Component({
  selector: 'app-add-departement',
  imports: [PageTitleComponent, ReactiveFormsModule, DynamicFormGroupComponent, TranslatePipe],
  templateUrl: './add-departement.component.html',
  styleUrl: './add-departement.component.scss',
})
export class AddDepartementComponent implements OnInit {
  form = signal(new FormGroup({}));
  fields = signal(DEPARTEMENT_FIELDS);
  title = signal('department.titleNew');
  breadCrumbItems: TabItem[] = [
    { label: 'department.breadcrumb.configuration' },
    { label: 'department.breadcrumb.structure' },
    { label: 'department.breadcrumb.departments', link: '/structure_societe/departements' },
    { label: 'department.breadcrumb.new', active: true },
  ];

  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  department = signal<Department>({ companyId: '', departmentId: '', name: '' });

  private formBuilder = inject(FormBuilder);
  private departmentService = inject(DepartmentService);


  ngOnInit(): void {
    const companies: Company[] = this.activeRoute.snapshot.data['companies']['content'];
    this.form.set(toFormGroupArray(this.formBuilder, this.fields()));

    this.activeRoute.queryParamMap.subscribe(params => {
      const data = params.get('data');
      if (data) {
        this.department.set(JSON.parse(decodeURIComponent(data)));
        this.form().patchValue(this.department());
        this.form().get('company')?.get('id')?.disable()
      }
    });
    this.departmentService.getAll().subscribe({
      next: departmentsParents => {
        this.fields().forEach(field => {
          if (field.key === 'parent' && field.controlType === 'formGroup') {
            field.groupFields?.forEach(nestedField => {
              if (nestedField.key === 'id' && nestedField.controlType === 'select') {
                (nestedField as Select).options = departmentsParents.content.map(cur => ({
                  key: cur.departmentId,
                  value: cur.name,
                }));
              }
            });
          } else if (field.key === 'company' && field.controlType === 'formGroup') {
            field.groupFields?.forEach(nestedField => {
              if (nestedField.key === 'id' && nestedField.controlType === 'select') {
                (nestedField as Select).options = companies.map(company => ({
                  key: company.companyId!,
                  value: company.code!,
                }));
              }
            });
          }
        });
      },
    });
  }

  onSubmit(): void {
    const request$ = isEmpty(this.department().departmentId)
      ? this.departmentService.createDepartment(this.form().value as Department)
      : this.departmentService.updateDepartment(
          this.department().departmentId,
          this.form().value as Department
        );
    request$.subscribe({
      next: () => {
        this.cancelAction();
      },
    });
  }

  cancelAction(): void {
    void this.router.navigate(['/configuration/structure_societe/departements']);
  }
}
