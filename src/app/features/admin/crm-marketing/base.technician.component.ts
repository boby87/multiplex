// components/base-technician.component.ts
import { Directive, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { isNull } from 'lodash';
import { TechnicienService } from './services/technicien.service';
import { BaseDynamicForm } from '../../../shared/components/input_type/dynamic.form';
import { Skill } from '../../../shared/model/skill';
import { Address, Partner, TabItem } from '../../../shared/model/user';
import { toFormGroupArray } from '../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';
import { FieldUpdateRegistry } from './strategy/field.update.registry';
import { SimpleListOptionProvider, SkillsOptionProvider } from './strategy/skills.option.provider';
import { from, mergeMap } from 'rxjs';
import { TechnicianFormHelper } from './technician.form.helper';
import { PartnerMapper } from './partner.mapper';

@Directive()
export abstract class BaseTechnicianComponent implements OnInit {
  protected readonly technicianService = inject(TechnicienService);
  protected readonly route = inject(ActivatedRoute);
  protected readonly location = inject(Location);
  protected readonly fb = inject(FormBuilder);
  /** Chaque composant enfant fournit son titre */

  /** Chaque composant enfant fournit son fil d’ariane */
  abstract breadCrumbItems: TabItem[];

  abstract technicianType: 'BUSINESS' | 'PHYSICAL';
  abstract generalInfoFields: ReturnType<typeof signal<BaseDynamicForm[]>>;
  abstract userAddressFields: ReturnType<typeof signal<BaseDynamicForm[]>>;
  abstract uploadDocFields: ReturnType<typeof signal<BaseDynamicForm[]>>;

  generalInfoForm = signal(new FormGroup({}));
  userAddressForm = signal(new FormGroup({}));
  uploadDocForm = signal(new FormGroup({}));

  skills = signal<Skill[]>([]);
  partner = signal<Partner>({});
  activeTab = 'general-info';


  ngOnInit(): void {
    this.setFromRoute(this.employees.set, ['employees', 'partners', 'content']);
    this.setFromRoute(this.roles.set, ['roles', 'content']);
    this.setFromRoute(this.companies.set, ['companies', 'content']);
    this.setFromRoute(this.jobs.set, ['jobs', 'content']);
    this.setFromRoute(this.departments.set, ['departments', 'content']);
    this.loadRouteData();
    this.generalInfoForm.set(toFormGroupArray(this.fb, this.generalInfoFields()));
    this.prefillFormsFromQuery();
    TechnicianFormHelper.addRegionOptions(this.userAddressFields());
  }

  private loadRouteData() {
    const data = this.route.snapshot.data['skills'];
    this.skills.set(data['skills']['items']);

    const registry = new FieldUpdateRegistry();
    registry.register('skills', new SkillsOptionProvider(this.skills()));
    registry.register('technicianType', new SimpleListOptionProvider(data['typeTechnician']));
    registry.apply(this.generalInfoFields());
  }

  private prefillFormsFromQuery() {
    this.route.queryParamMap.subscribe(params => {
      const data = params.get('data');
      if (data) {
        this.partner.set(JSON.parse(decodeURIComponent(data)));
        this.generalInfoForm().patchValue(PartnerMapper.toGeneralInfoForm(this.partner()));
      }
    });
  }
  private setFromRoute<T>(signal: (v: T) => void, path: string[]): void {
    let data: any = this.activeRoute.snapshot.data;
    for (const key of path) {
      data = data?.[key];
    }
    signal(data ?? []);
  }

  protected updateMediaTypeForm() {
    this.technicianService.getMediaConfig(this.technicianType).subscribe({
      next: mediaConfig => {
        if (!mediaConfig?.length) return;
        this.uploadDocFields.set(TechnicianFormHelper.buildUploadFields(mediaConfig));
        this.uploadDocForm.set(toFormGroupArray(this.fb, this.uploadDocFields()));
        this.partner().documents?.forEach(mediaFile => {
          this.uploadDocForm().patchValue({ [mediaFile.mediaTypeCode]: mediaFile.url });
        });
      },
    });
  }


  protected updateUserAddresses() {
    return this.technicianService.updateTechnicianAddresses(
      this.partner().partnerId!,
      this.userAddressForm().get('addresses')?.getRawValue() as Address[]
    );
  }

  protected uploadDocuments() {
    const keyValueArray = Object.entries(this.uploadDocForm().getRawValue())
      .map(([key, value]) => ({ key, value }))
      .filter(value => !isNull(value.value));

    return from(keyValueArray).pipe(
      mergeMap(({ key, value }) =>
        this.technicianService.uploadFile(
          this.partner().partnerId!,
          this.technicianType,
          key,
          value as File
        )
      )
    );
  }
  onSubmit(): void {
    switch (this.activeTab) {
      case 'general-info':
        this.handleGeneralInfoSubmit();
        break;
      case 'user-address':
        this.handleAddressSubmit();
        break;
      case 'upload-documents':
        this.handleDocumentsSubmit();
        break;
      case 'manager-infos':
        this.handleManagerSubmit?.(); // optionnel
        break;
      case 'user-info':
        this.handleUserInfoSubmit?.(); // optionnel
        break;
    }
  }
  protected handleGeneralInfoSubmit(): void {
    this.createTechnician?.()
  }

  protected handleAddressSubmit(): void {
    this.activeTab = 'upload-documents';
    this.updateMediaTypeForm();
  }

  protected handleDocumentsSubmit(): void {
    this.uploadDocuments().subscribe({
      next: () => (this.activeTab = 'user-info'),
    });
  }

  protected handleManagerSubmit?(): void;
  protected handleUserInfoSubmit?(): void;
  protected createTechnician?(): void;

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
