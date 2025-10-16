import { Component, inject, OnInit, signal } from '@angular/core';
import { TechnicienService } from '../../services/technicien.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PHYSICAL_TECHNICIAN_FIELDS } from '../../../../../shared/components/templates/technicien';
import { USER_ADDRESS_FIELDS } from '../../../../../shared/components/templates/utilisateur';
import { BaseDynamicForm } from '../../../../../shared/components/input_type/dynamic.form';
import { Address, Partner, PartnerAttribute, TabItem } from '../../../../../shared/model/user';
import { Skill } from '../../../../../shared/model/skill';

import {
  DynamicFormArryComponent,
  toFormGroupArray,
} from '../../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';
import { RouterNavigation } from '../../../../../shared/utility/router.navigation';
import { isNull } from 'lodash';
import { FileBox } from '../../../../../shared/components/input_type/file.box';
import { MultiSelectValue } from '../../../../../shared/components/multi-select/multi-select.component';
import { forkJoin, from, mergeMap } from 'rxjs';
import { getValueOrEmpty } from '../../../../../shared/utility/fonction';
import { TranslatePipe } from '@ngx-translate/core';
import { TabsComponent } from '../../../../../shared/components/tabs/tabs.component';
import { PageTitleComponent } from '../../../../../shared/ui/page-title/page-title.component';
import { CameroonLocation } from '../../../../../shared/utility/cameroon.location';
import {FieldUpdateRegistry} from '../../strategy/field.update.registry';
import {
  SimpleListOptionProvider,
  SkillsOptionProvider,
} from '../../strategy/skills.option.provider';

@Component({
  selector: 'app-add-physical',
  imports: [
    TranslatePipe,
    DynamicFormArryComponent,
    ReactiveFormsModule,
    TabsComponent,
    PageTitleComponent,
  ],
  templateUrl: './add-physical.component.html',
  styleUrl: './add-physical.component.scss',
})
export class AddPhysicalComponent implements OnInit {
  // ==== Injections regroupées ====
  private readonly technicianService = inject(TechnicienService);
  private readonly activeRoute = inject(ActivatedRoute);
  private location = inject(Location);
  private readonly fb = inject(FormBuilder);

  // ==== Signaux ====
  generalInfoForm = signal(new FormGroup({}));
  userAddressForm = signal(new FormGroup({}));
  uploadDocForm = signal(new FormGroup({}));

  title = signal('technician.titleCreatePhysical');
  generalInfoFields = signal(PHYSICAL_TECHNICIAN_FIELDS);
  userAddressFields = signal(USER_ADDRESS_FIELDS);
  uploadDocFields = signal<BaseDynamicForm[]>([]);

  breadCrumbItems: TabItem[] = [
    { label: 'technician.breadcrumb.physicalList', link: RouterNavigation.TECHNICIAN_PHYSICAL },
    { label: 'technician.breadcrumb.createPhysical', active: true },
  ];

  private skills = signal<Skill[]>([]);
  private partner = signal<Partner>({});

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
  ];

  activeTab = 'general-info';

  ngOnInit() {
    this.loadRouteData();
    this.initForms();
    this.prefillFormsFromQuery();
    this.addOptionRegion();
  }

  // ==== Init ====
  private loadRouteData() {
    const data = this.activeRoute.snapshot.data['skills'];
    this.skills.set(data['skills']['items']);

    const registry = new FieldUpdateRegistry();
    registry.register('skills', new SkillsOptionProvider(this.skills()));
    registry.register('technicianType', new SimpleListOptionProvider(data['typeTechnician']));
    registry.apply(this.generalInfoFields());
  }

  private initForms() {
    this.generalInfoForm.set(toFormGroupArray(this.fb, this.generalInfoFields()));
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

  private updateMediaTypeForm() {
    this.technicianService.getMediaConfig('PHYSICAL').subscribe({
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
      this.activeTab = 'user-address';
      this.userAddressForm.set(toFormGroupArray(this.fb, this.userAddressFields()));
      this.userAddressForm().patchValue(this.partner());
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
      type: 'PHYSICAL_TECHNICIAN',
      technicianCategory: 'PHYSICAL',
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

  private updateUserAddresses() {
    return this.technicianService.updateTechnicianAddresses(
      getValueOrEmpty(this.partner().partnerId),
      this.userAddressForm().get('addresses')?.getRawValue() as Address[]
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
          'PHYSICAL',
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
