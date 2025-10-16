import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TechnicienService } from '../../services/technicien.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { USER_ADDRESS_FIELDS } from '../../../../../shared/components/templates/utilisateur';
import { BaseDynamicForm } from '../../../../../shared/components/input_type/dynamic.form';
import { Partner, PartnerAttribute, TabItem } from '../../../../../shared/model/user';
import { Skill } from '../../../../../shared/model/skill';
import { Company, Department, Job } from '../../../../../shared/model/company';
import { Role } from '../../../../../shared/model/roles';

import {
  DynamicFormArryComponent,
  toFormGroupArray,
} from '../../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';
import { CameroonLocation } from '../../../../../shared/utility/cameroon.location';
import { RouterNavigation } from '../../../../../shared/utility/router.navigation';
import {
  BUSINESS_MANAGER_TECHNICIAN,
  BUSINESS_TECHNICIAN_FIELDS,
} from '../../../../../shared/components/templates/technicien.business';
import { FieldUpdateRegistryStrategy } from '../../../human-resources/employees/add-employees/strategy/field.update.registry.strategy';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FieldUpdateContext } from '../../../human-resources/employees/add-employees/strategy/field.update.strategy';
import { isEmpty, isNull } from 'lodash';
import { CompanyFieldUpdateStrategy } from '../../../human-resources/employees/add-employees/strategy/company.field.update.strategy';
import { ManagerFieldUpdateStrategy } from '../../../human-resources/employees/add-employees/strategy/manager.field.update.strategy';
import { DepartmentFieldUpdateStrategy } from '../../../human-resources/employees/add-employees/strategy/department.field.update.strategy';
import { RolesFieldUpdateStrategy } from '../../../human-resources/employees/add-employees/strategy/roles.field.update.strategy';
import { JobFieldUpdateStrategy } from '../../../human-resources/employees/add-employees/strategy/job.field.update.strategy';
import { FileBox } from '../../../../../shared/components/input_type/file.box';
import { MultiSelectValue } from '../../../../../shared/components/multi-select/multi-select.component';
import { forkJoin, from, mergeMap } from 'rxjs';
import { getValueOrEmpty } from '../../../../../shared/utility/fonction';
import { TranslatePipe } from '@ngx-translate/core';
import { PageTitleComponent } from '../../../../../shared/ui/page-title/page-title.component';
import { TabsComponent } from '../../../../../shared/components/tabs/tabs.component';
import {FieldUpdateRegistry} from "../../strategy/field.update.registry";
import {
  SimpleListOptionProvider,
  SkillsOptionProvider,
} from '../../strategy/skills.option.provider';

@Component({
  selector: 'app-add-business',
  imports: [
    DynamicFormArryComponent,
    ReactiveFormsModule,
    TranslatePipe,
    PageTitleComponent,
    TabsComponent,
  ],
  templateUrl: './add-business.component.html',
  styleUrl: './add-business.component.scss',
})
export class AddBusinessComponent implements OnInit {
  // ==== Injections regroupées ====
  private readonly technicianService = inject(TechnicienService);
  private readonly activeRoute = inject(ActivatedRoute);
  private location = inject(Location);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  // ==== Signaux ====
  generalInfoForm = signal(new FormGroup({}));
  userInfoForm = signal(new FormGroup({}));
  userAddressForm = signal(new FormGroup({}));
  uploadDocForm = signal(new FormGroup({}));

  title = signal('technician.titleCreateBusiness');
  generalInfoFields = signal(BUSINESS_TECHNICIAN_FIELDS);
  managerInfoFields = signal(BUSINESS_MANAGER_TECHNICIAN);
  userAddressFields = signal(USER_ADDRESS_FIELDS);
  uploadDocFields = signal<BaseDynamicForm[]>([]);

  breadCrumbItems: TabItem[] = [
    { label: 'technician.breadcrumb.businessList', link: RouterNavigation.TECHNICIAN_BUSINESS },
    { label: 'technician.breadcrumb.createBusiness', active: true },
  ];

  private skills = signal<Skill[]>([]);
  private partner = signal<Partner>({});
  private employees = signal<Partner[]>([]);
  private companies = signal<Company[]>([]);
  private roles = signal<Role[]>([]);
  private jobs = signal<Job[]>([]);
  private departments = signal<Department[]>([]);

  tabs = [
    {
      id: 'general-info',
      form: () => this.generalInfoForm(),
      fields: () => this.generalInfoFields(),
      label: 'technician.tabs.generalInfo',
    },
    {
      id: 'user-address',
      form: () => this.userAddressForm(),
      fields: () => this.userAddressFields(),
      label: 'technician.tabs.userAddress',
    },
    {
      id: 'upload-documents',
      form: () => this.uploadDocForm(),
      fields: () => this.uploadDocFields(),
      label: 'technician.tabs.uploadDocuments',
    },
    {
      id: 'user-infos',
      form: () => this.userInfoForm(),
      fields: () => this.managerInfoFields(),
      label: 'technician.tabs.userInfos',
    },
  ];

  activeTab = 'general-info';

  ngOnInit() {
    this.employees.set(this.activeRoute.snapshot.data['employees']['partners']['content']);
    this.roles.set(this.activeRoute.snapshot.data['roles']['content']);
    this.companies.set(this.activeRoute.snapshot.data['companies']['content']);
    this.jobs.set(this.activeRoute.snapshot.data['jobs']['content']);
    this.departments.set(this.activeRoute.snapshot.data['departments']['content']);

    this.loadRouteData();
    this.initForms();
    this.prefillFormsFromQuery();
  }

  // ==== Init ====
  private loadRouteData() {
    const data = this.activeRoute.snapshot.data['skills'];
    this.skills.set(data['skills']['items']);

    const registry = new FieldUpdateRegistry();
    registry.register('skills', new SkillsOptionProvider(this.skills()));
    registry.register('technicianType', new SimpleListOptionProvider(data['typeTechnician']));
    registry.register('technicianGrade', new SimpleListOptionProvider(data['gradeTechnician']));
    registry.register(
      'technicianCategory',
      new SimpleListOptionProvider(data['categoryTechnician'])
    );
    registry.register('taxRegime', new SimpleListOptionProvider(data['taxRegime']));
    registry.apply(this.generalInfoFields());
  }

  private initForms() {
    this.generalInfoForm.set(toFormGroupArray(this.fb, this.generalInfoFields()));
    this.userInfoForm.set(toFormGroupArray(this.fb, this.managerInfoFields()));
  }

  private prefillFormsFromQuery() {
    this.activeRoute.queryParamMap.subscribe(params => {
      const data = params.get('data');
      if (data) {
        this.partner.set(JSON.parse(decodeURIComponent(data)));
        const partner = {
          language: this.partner().language,
          email: this.partner().email,
          firstname: this.partner().firstname,
          lastname: this.partner().lastname,
          contacts: this.partner().contacts,
          technicianType: this.partner().technicianType,
          technicianCategory: this.partner().technicianCategory,
          technicianGrade: this.partner().technicianGrade,
          address: this.partner().address,
        };
        this.generalInfoForm().patchValue(partner);
      }
    });
  }

  addOptionRegion() {
    this.userAddressFields().forEach(userAddress => {
      if (userAddress.key === 'addresses') {
        userAddress.childrenFields.forEach(child => {
          if (child.key === 'region') {
            child.options = CameroonLocation.getAllRegions().map(region => ({
              key: region.name,
              value: region.name,
            }));
          }
        });
      }
    });
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
          this.managerInfoFields().forEach(fieldArray =>
            registry.runAll(fieldArray.childrenFields, context)
          );
        });
      });
  }
  private handleCamerounRegionValueChanges() {
    this.userAddressForm.set(toFormGroupArray(this.fb, this.userAddressFields()));
    this.addOptionRegion();
    this.userAddressForm().patchValue(this.partner());

    const addressesArray = this.userAddressForm()?.get('addresses') as unknown as FormArray;

    addressesArray.controls.forEach((addressGroup, index) => {
      addressGroup.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(region => {
        // Récupère les fields de l'adresse correspondante
        const addressFields = this.userAddressFields()[index];

        addressFields.childrenFields.forEach(child => {
          if (child.key === 'city' && region.region) {
            child.options = CameroonLocation.getCitiesByRegion(region.region!).map(city => ({
              key: city,
              value: city,
            }));
          }

          if (child.key === 'quarter' && region.city) {
            child.options = CameroonLocation.getDistrictsByCity(region.city!).map(district => ({
              key: district,
              value: district,
            }));
          }
        });
      });
    });
  }

  changeTab(tab: string): void {
    if (!isEmpty(this.partner().partnerId)) {
      if (tab === 'user-info') {
        this.loadUserInfoDependencies();
      } else if (tab === 'upload-documents') {
        this.updateMediaTypeForm();
      }
      this.activeTab = tab;
    }
  }

  private loadUserInfoDependencies() {
    const registryStrategy = new FieldUpdateRegistryStrategy([
      new CompanyFieldUpdateStrategy(() => this.companies()),
      new ManagerFieldUpdateStrategy(() => this.employees()),
      new DepartmentFieldUpdateStrategy(() => this.departments()),
      new RolesFieldUpdateStrategy(() => this.roles()),
      new JobFieldUpdateStrategy(() => this.jobs()),
    ]);
    this.handleCompaniesValueChanges(registryStrategy);
    this.managerInfoFields().forEach(fieldArray =>
      registryStrategy.runAll(fieldArray.childrenFields, {})
    );

    this.userInfoForm().patchValue(this.partner() || {});
  }

  private updateMediaTypeForm() {
    this.technicianService.getMediaConfig('BUSINESS').subscribe({
      next: mediaConfig => {
        if (!mediaConfig?.length) return;
        const mediaFields = mediaConfig[0].mediaTypeInfos?.map(
          media =>
            new FileBox({
              key: media.code,
              label: media.name,
              required: true,
              classColumn: 'col-md-6',
              maxlength: media.maxFileSizeBytes,
              accept: media.allowedMimeTypes?.join(', ') ?? '',
              order: 1,
              type: 'file',
              validators: [Validators.required],
            })
        );
        this.uploadDocFields.set(mediaFields || []);
        this.uploadDocForm.set(toFormGroupArray(this.fb, this.uploadDocFields()));

        this.partner().documents?.forEach(mediaFile => {
          this.uploadDocForm().patchValue({ [mediaFile.mediaTypeCode]: mediaFile.url });
        });
      },
      error: err => console.error('Erreur upload fichier:', err),
    });
  }
  // ==== Actions ====
  onSubmit(): void {
    if (this.activeTab === 'general-info') {
      this.handleCamerounRegionValueChanges();
      this.activeTab = 'user-address';
    } else if (this.activeTab === 'user-address') {
      this.activeTab = 'upload-documents';
      this.updateMediaTypeForm();
    } else if (this.activeTab === 'upload-documents') {
      this.createTechnician();
    }
  }

  private createTechnician(): void {
    const partnerFormValue: Partner = this.generalInfoForm().getRawValue();
    const skillsMulti = this.generalInfoForm().get('skills')?.getRawValue() as MultiSelectValue;

    const skills: Skill[] =
      skillsMulti?.selected?.map(value => ({
        name: value,
        main: value === skillsMulti.primary,
        status: 'ACTIVE',
      })) ?? [];

    const partnerAttribute: PartnerAttribute = {
      firstname: partnerFormValue.firstname,
      lastname: partnerFormValue.lastname,
      type: 'BUSINESS_TECHNICIAN',
      technicianCategory: 'BUSINESS',
      technicianType: partnerFormValue.technicianType,
      contacts: partnerFormValue.contacts ?? [],
      skills,
    };

    const partner: Partner = {
      ...partnerFormValue,
      partnerType: 'TECHNICIAN',
      partnerAttribute,
      name: `${partnerFormValue.firstname} ${partnerFormValue.lastname}`,
    };

    const partnerId = this.partner()?.partnerId;

    const request$ = partnerId
      ? this.technicianService.updatePhysicalDetails(partnerId, partnerAttribute)
      : this.technicianService.createTechnician(partner);

    request$
      .pipe(
        mergeMap(() =>
          forkJoin({
            document: this.uploadDocuments(),
            addresses: this.updateUserAddresses(),
          })
        )
      )
      .subscribe({
        next: ({ addresses }) => {
          this.partner.set(addresses);
          this.location.back();
        },
        error: err => console.error('Erreur lors de la création du technicien :', err),
      });
  }

  private updateUserInfo() {
    this.technicianService
      .updateTechnicianUserInfos(
        getValueOrEmpty(this.partner().partnerId),
        this.userInfoForm().getRawValue()
      )
      .subscribe({
        next: res => this.partner.set(res),
        error: err => console.error('Error creating employee:', err),
      });
  }

  private updateUserAddresses() {
    return this.technicianService.updateTechnicianAddresses(
      getValueOrEmpty(this.partner().partnerId),
      this.userAddressForm().get('addresses')?.getRawValue() as any[]
    );
  }

  private uploadDocuments() {
    const keyValueArray = Object.entries(this.uploadDocForm().getRawValue())
      .map(([key, value]) => ({ key, value }))
      .filter(value => !isNull(value.value));

    return from(keyValueArray).pipe(
      mergeMap(({ key, value }) =>
        this.technicianService.uploadFile(
          getValueOrEmpty(this.partner().partnerId),
          'BUSINESS',
          key,
          value as File
        )
      )
    );
  }

  previousAction() {
    if (this.activeTab === 'general-info') {
      this.location.back();
    } else if (this.activeTab === 'user-address') {
      this.activeTab = 'general-info';
    } else if (this.activeTab === 'upload-documents') {
      this.activeTab = 'user-address';
    }
  }
}
