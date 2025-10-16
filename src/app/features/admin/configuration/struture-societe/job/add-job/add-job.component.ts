import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageTitleComponent } from '../../../../../../shared/ui/page-title/page-title.component';
import { POSTE_FIELDS } from '../../../../../../shared/components/templates/poste';
import { ActivatedRoute, Router } from '@angular/router';
import { TabItem } from '../../../../../../shared/model/user';
import { Company, Department, Job } from '../../../../../../shared/model/company';
import { Select } from '../../../../../../shared/components/input_type/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isEmpty } from 'lodash';
import { JobService } from '../../services/job.service';
import { getValueOrEmpty } from '../../../../../../shared/utility/fonction';
import { toFormGroupArray } from '../../../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';
import { DynamicFormGroupComponent } from '../../../../../../shared/components/dynamic-form-group/dynamic-form-group.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-add-job',
  imports: [
    FormsModule,
    PageTitleComponent,
    ReactiveFormsModule,
    DynamicFormGroupComponent,
    TranslatePipe,
  ],
  templateUrl: './add-job.component.html',
  styleUrl: './add-job.component.scss',
})
export class AddJobComponent implements OnInit {
  form = signal(new FormGroup({}));
  fields = signal(POSTE_FIELDS);
  private router = inject(Router);
  title = signal('job.titleNew');
  breadCrumbItems: TabItem[] = [
    { label: 'job.breadcrumb.configuration' },
    { label: 'job.breadcrumb.structure' },
    { label: 'job.breadcrumb.jobs', link: '/structure_societe/jobs' },
    { label: 'job.breadcrumb.new', active: true },
  ];

  private activeRoute = inject(ActivatedRoute);
  private jobService = inject(JobService);
  job = signal<Job>({ name: '', companyId: '', description: '', jobId: '' });

  companies = signal<Company[]>([]);
  departments = signal<Department[]>([]);
  private destroyRef = inject(DestroyRef); // Angular 16+
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form.set(toFormGroupArray(this.formBuilder, this.fields()));
    this.companies.set(this.activeRoute.snapshot.data['companies']['content']);
    this.departments.set(this.activeRoute.snapshot.data['departments']['content']);

    this.fields().forEach(field => {
      if (field.key === 'company' && field.controlType === 'formGroup') {
        field.groupFields?.forEach(nestedField => {
          if (nestedField.key === 'id' && nestedField.controlType === 'select') {
            (nestedField as Select).options = this.companies().map(company => ({
              key: company.companyId!,
              value: company.code!,
            }));
          }
        });
      }
    });

    this.form()
      .get('company')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((formGroup: any) => {
        const companyId = formGroup?.id;

        if (companyId) {
          this.fields.update(currentFields => {
            return currentFields.map(field => {
              if (field.key === 'department' && field.controlType === 'formGroup') {
                field.groupFields?.forEach(nestedField => {
                  if (nestedField.key === 'id' && nestedField.controlType === 'select') {
                    (nestedField as Select).options = this.departments()
                      .filter(department => department.companyId === companyId)
                      .map(department => ({
                        key: getValueOrEmpty(department.departmentId),
                        value: department.name,
                      }));
                  }
                });
              }
              return field;
            });
          });
        }
      });
    this.activeRoute.queryParamMap.subscribe(params => {
      const data = params.get('data');
      if (data) {
        this.job.set(JSON.parse(decodeURIComponent(data)));
        this.form().patchValue(this.job());
        this.form().get('company')?.get('id')?.disable()
      }
    });
  }

  onSubmit(): void {
    const request$ = isEmpty(this.job().jobId)
      ? this.jobService.createJob(this.form().value)
      : this.jobService.updateJob(this.job().jobId ?? '', this.form().value);
    request$.subscribe({
      next: () => {
        this.cancelAction();
      },
    });
  }

  cancelAction(): void {
    void this.router.navigate(['/configuration/structure_societe/jobs']);
  }
}
