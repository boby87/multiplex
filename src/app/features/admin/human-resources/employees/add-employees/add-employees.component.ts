import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PageTitleComponent } from '../../../../../shared/ui/page-title/page-title.component';
import { EmployeeContract, Partner, TabItem } from '../../../../../shared/model/user';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EMPLOYEE_CONTRACT_FIELDS,
  PARTNER_FIELDS,
  USER_INFOS_FIELDS,
} from '../../../../../shared/components/templates/employee';
import {
  DynamicFormArryComponent,
  toFormGroupArray,
} from '../../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';
import { PartnerService } from '../../service/partner.service';
import { Company, Department, Job } from '../../../../../shared/model/company';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isEmpty } from 'lodash';
import { from, mergeMap } from 'rxjs';
import { extractFilesAsEntries, getValueOrEmpty } from '../../../../../shared/utility/fonction';
import { TranslatePipe } from '@ngx-translate/core';
import { Role } from '../../../../../shared/model/roles';
import { CompanyFieldUpdateStrategy } from './strategy/company.field.update.strategy';
import { ManagerFieldUpdateStrategy } from './strategy/manager.field.update.strategy';
import { DepartmentFieldUpdateStrategy } from './strategy/department.field.update.strategy';
import { RolesFieldUpdateStrategy } from './strategy/roles.field.update.strategy';
import { JobFieldUpdateStrategy } from './strategy/job.field.update.strategy';
import { FieldUpdateContext } from './strategy/field.update.strategy';
import { TabsComponent } from '../../../../../shared/components/tabs/tabs.component';
import { FieldUpdateRegistryStrategy } from './strategy/field.update.registry.strategy';
import { FileBox } from '../../../../../shared/components/input_type/file.box';
import { MediaConfig } from '../../../../../shared/model/media';

@Component({
  selector: 'app-add-employees',
  imports: [
    FormsModule,
    PageTitleComponent,
    ReactiveFormsModule,
    DynamicFormArryComponent,
    TranslatePipe,
    TabsComponent,
  ],
  templateUrl: './add-employees.component.html',
  styleUrl: './add-employees.component.scss',
})
export class AddEmployeesComponent implements OnInit {
  tabs = [
    {
      id: 'general-info',
      form: () => this.partnerForm(),
      fields: () => this.partnerFields(),
      label: 'employee.tabs.generalInfo',
    },

    {
      id: 'user-info',
      form: () => this.userInfoForm(),
      fields: () => this.userInfoFields(),
      label: 'employee.tabs.userInfo',
    },
    {
      id: 'contact-and-pay',
      form: () => this.contactForm(),
      fields: () => this.contactFields(),
      label: 'employee.tabs.contactAndPay',
    },
  ];

  breadCrumbItems: TabItem[] = [
    { label: 'employee.breadcrumb.humanResources', link: 'human_resources' },
    { label: 'employee.breadcrumb.employees', link: '/human_resources/employees' },
    { label: 'employee.breadcrumb.new', active: true },
  ];

  title = signal('employee.titleNew');
  employee = signal<Partner>({});

  contactForm = signal(new FormGroup({}));
  partnerForm = signal(new FormGroup({}));
  userInfoForm = signal(new FormGroup({}));

  partnerFields = signal(PARTNER_FIELDS);
  contactFields = signal(EMPLOYEE_CONTRACT_FIELDS);
  userInfoFields = signal(USER_INFOS_FIELDS);

  activeTab = 'general-info';

  private formBuilder = inject(FormBuilder);
  private partnerService = inject(PartnerService);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef); // Angular 16+

  private employees = signal<Partner[]>([]);
  private companies = signal<Company[]>([]);
  private roles = signal<Role[]>([]);
  private jobs = signal<Job[]>([]);
  private departments = signal<Department[]>([]);
  private medias = signal<MediaConfig>({});

  ngOnInit(): void {
    this.employees.set(this.activeRoute.snapshot.data['employees']['partners']['content']);
    this.medias.set(this.activeRoute.snapshot.data['employees']['medias']);
    this.roles.set(this.activeRoute.snapshot.data['roles']['content']);
    this.companies.set(this.activeRoute.snapshot.data['companies']['content']);
    this.jobs.set(this.activeRoute.snapshot.data['jobs']['content']);
    this.departments.set(this.activeRoute.snapshot.data['departments']['content']);

    this.partnerForm.set(toFormGroupArray(this.formBuilder, this.partnerFields()));
    this.userInfoForm.set(toFormGroupArray(this.formBuilder, this.userInfoFields()));
    this.updateContractsFields();

    const registry = new FieldUpdateRegistryStrategy([
      new CompanyFieldUpdateStrategy(() => this.companies()),
      new ManagerFieldUpdateStrategy(() => this.employees()),
      new DepartmentFieldUpdateStrategy(() => this.departments()),
      new RolesFieldUpdateStrategy(() => this.roles()),
      new JobFieldUpdateStrategy(() => this.jobs()),
    ]);
    // Reaction aux changements
    this.handleCompaniesValueChanges(registry);
    // Initialisation
    this.userInfoFields().forEach(fieldArray => {
      registry.runAll(fieldArray.childrenFields, {});
    });

    this.activeRoute.queryParamMap.subscribe(params => {
      const data = params.get('data');
      if (data) {
        this.employee.set(JSON.parse(decodeURIComponent(data)));
        const employee = {
          language: this.employee().language,
          email: this.employee().email,
          partnerAttribute: {
            firstname: this.employee().firstname,
            lastname: this.employee().lastname,
            phone: this.employee().phone,
            address: this.employee().address,
          },
        };
        this.partnerForm().patchValue(employee);
        this.userInfoForm().patchValue(this.employee() || {});
        let contract = {
          officialBaseSalary: this.employee().employeeContract?.officialBaseSalary,
          additionalInformation: this.employee().employeeContract?.additionalInformation,
        };
        this.employee().employeeContract?.contracts?.forEach(contractFile => {
          contract = { ...contract, [contractFile.mediaTypeCode]: contractFile.url };
        });

        this.contactForm().patchValue(contract);
        console.log(this.contactForm().getRawValue());
      }
    });
  }

  updateContractsFields() {
    if (this.medias()?.mediaTypeInfos) {
      const mediaFields = this.medias().mediaTypeInfos!.map(
        media =>
          new FileBox({
            key: media.code,
            label: media.name,
            required: true,
            classColumn: 'col-md-12',
            maxlength: media.maxFileSizeBytes,
            accept: media.allowedMimeTypes?.join(', ') ?? '',
            order: 1,
            type: 'file',
            validators: [Validators.required],
          })
      );

      this.contactFields.update(oldFields => [...oldFields, ...mediaFields]);
      this.contactForm.set(toFormGroupArray(this.formBuilder, this.contactFields()));
    }
  }

  private handleCompaniesValueChanges(registry: FieldUpdateRegistryStrategy) {
    this.userInfoForm()
      .get('companies')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((formArray: any[]) => {
        formArray.forEach(group => {
          const context: FieldUpdateContext = {
            companyId: group.company?.id,
            departmentId: group.department?.id,
          };
          this.userInfoFields().forEach(fieldArray => {
            registry.runAll(fieldArray.childrenFields, context);
          });
        });
      });
  }

  changeTab(tab: string): void {
    if (!isEmpty(this.employee().partnerId)) {
      this.activeTab = tab;
    }
  }

  onSubmit(): void {
    if (this.activeTab === 'general-info') {
      this.createPartner();
    } else if (this.activeTab === 'contact-and-pay' && this.employee().partnerId) {
      this.createContact();
    } else if (this.activeTab === 'user-info' && this.employee().partnerId) {
      this.updateUserInfo();
    }
  }

  private createPartner() {
    this.partnerService.createPartner(this.partnerForm().getRawValue() as Partner).subscribe({
      next: res => {
        this.employee.set(res);
        this.activeTab = 'user-info';
      },
      error: err => {
        console.error('Error creating employee:', err);
      },
    });
  }

  private updateUserInfo() {
    this.partnerService
      .updateEmployeeUserInfos(
        getValueOrEmpty(this.employee().partnerId),
        this.userInfoForm().getRawValue()
      )
      .subscribe({
        next: res => {
          this.employee.set(res);
          void this.router.navigate(['/human_resources/employees']);
        },
        error: err => {
          console.error('Error creating employee:', err);
        },
      });
  }

  private createContact() {
    const employeeId = this.employee().partnerId;
    const rawFiles = extractFilesAsEntries(this.contactForm().getRawValue());
    console.log('rawFiles', rawFiles);

    this.partnerService
      .updateEmployeeContract(employeeId!, this.contactForm().getRawValue() as EmployeeContract)
      .pipe(
        mergeMap(() =>
          from(rawFiles).pipe(
            mergeMap(rawFile =>
              this.partnerService.uploadContractFile(employeeId!, rawFile.file, rawFile.key)
            )
          )
        )
      )
      .subscribe({
        next: () => {
          void this.router.navigate(['/human_resources/employees']);
        },
        error: err => {
          console.error('❌ Erreur inattendue dans createContact() :', err);
        },
      });
  }

  cancelAction(): void {
    void this.router.navigate(['/human_resources/employees']);
  }
}
