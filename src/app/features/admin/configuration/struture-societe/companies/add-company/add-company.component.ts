import { Component, inject, OnInit, signal } from '@angular/core';
import { Company, LegalInfo } from '../../../../../../shared/model/company';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ADDRESS_CONTACT_FIELDS,
  CONFIGURATION_FIELDS,
  FISCAL_INFO_FIELDS,
  GENERAL_INFO_FIELDS,
} from '../../../../../../shared/components/templates/company';
import { TabItem } from '../../../../../../shared/model/user';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DynamicFormArryComponent,
  toFormGroupArray,
} from '../../../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';
import { PageTitleComponent } from '../../../../../../shared/ui/page-title/page-title.component';
import { CompanyService } from '../../services/company.service';
import { TabsComponent } from '../../../../../../shared/components/tabs/tabs.component';
import { getValueOrEmpty } from '../../../../../../shared/utility/fonction';
import { forkJoin } from 'rxjs';
import { MultiflexStaticService } from '../../../../../../core/service/stactic.core.service';
import { Select } from '../../../../../../shared/components/input_type/select';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-add-company',
  imports: [
    DynamicFormArryComponent,
    ReactiveFormsModule,
    PageTitleComponent,
    TabsComponent,
    TranslatePipe,
  ],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.scss',
})
export class AddCompanyComponent implements OnInit {
  tabs = [
    {
      id: 'tab1',
      form: () => this.generalInfoForm(),
      fields: () => this.fields(),
      label: 'companie.tabs.generalInfo',
    },
    {
      id: 'tab2',
      form: () => this.addressContactForm(),
      fields: () => this.fieldsAddress(),
      label: 'companie.tabs.addressContact',
    },
    {
      id: 'tab3',
      form: () => this.fiscalInfoForm(),
      fields: () => this.fieldsFiscalInfo(),
      label: 'companie.tabs.fiscalInfo',
    },
    {
      id: 'tab4',
      form: () => this.configForm(),
      fields: () => this.configInfo(),
      label: 'companie.tabs.configuration',
    },
  ];

  company = signal<Company>({ name: '', code: '', legalName: '', currencyId: '', companyId: '' });
  generalInfoForm = signal(new FormGroup({}));
  addressContactForm = signal(new FormGroup({}));
  configForm = signal(new FormGroup({}));
  fiscalInfoForm = signal(new FormGroup({}));
  fields = signal(GENERAL_INFO_FIELDS);
  fieldsAddress = signal(ADDRESS_CONTACT_FIELDS);
  fieldsFiscalInfo = signal(FISCAL_INFO_FIELDS);
  configInfo = signal(CONFIGURATION_FIELDS);
  title = signal('companie.titleNew');
  activeTab = signal('tab1');
  breadCrumbItems: TabItem[] = [
    { label: 'companie.breadcrumb.configuration' },
    { label: 'companie.breadcrumb.structure' },
    { label: 'companie.breadcrumb.companies', link: '/structure_societe/companies' },
    { label: 'companie.breadcrumb.new', active: true },
  ];
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private companyService = inject(CompanyService);
  private activeRoute = inject(ActivatedRoute);
  private staticService = inject(MultiflexStaticService);

  ngOnInit(): void {
    this.generalInfoForm.set(toFormGroupArray(this.formBuilder, this.fields()));
    this.addressContactForm.set(toFormGroupArray(this.formBuilder, this.fieldsAddress()));
    this.fiscalInfoForm.set(toFormGroupArray(this.formBuilder, this.fieldsFiscalInfo()));
    this.configForm.set(toFormGroupArray(this.formBuilder, this.configInfo()));
    this.activeRoute.queryParamMap.subscribe(params => {
      const data = params.get('data');
      if (data) {
        this.company.set(JSON.parse(decodeURIComponent(data)));
        this.generalInfoForm().patchValue(this.company());
        this.generalInfoForm().get('code')?.disable();
        const companyDetails = {companyDetails: this.company().addresses}
        this.addressContactForm().patchValue(companyDetails || {});
        this.fiscalInfoForm().patchValue(this.company().legals || {});
        const logo = {logo: this.company().logo?.url || ''}
        this.configForm().patchValue(logo || {});
      }
    });
    forkJoin({
      currencies: this.staticService.getCurrencies(),
      taxRegime: this.staticService.getTaxRegime(),
      addressType: this.staticService.getAddress(),
      parentCompanies: this.companyService.filterCompany(),
    }).subscribe({
      next: ({ currencies, parentCompanies, taxRegime, addressType }) => {
        this.fieldsFiscalInfo().forEach(field => {
          if (field.key === 'taxRegime' && field.controlType === 'select') {
            (field as Select).options = taxRegime.map(cur => ({ key: cur.key, value: cur.key }));
          }
        })

        this.fieldsFiscalInfo().forEach(field => {
          if (field.key === 'taxRegime' && field.controlType === 'select') {
            (field as Select).options = taxRegime.map(cur => ({ key: cur.key, value: cur.key }));
          }
        })
        this.fieldsAddress().forEach(field => {
          if (field.key === 'companyDetails') {
            field.childrenFields?.forEach(childField => {
              if (childField.key === 'address' && childField.controlType === 'formGroup') {
                childField.groupFields?.forEach(nestedField => {
                  if (nestedField.key === 'addressType' && nestedField.controlType === 'select') {
                    (nestedField as Select).options = addressType.map(addr => ({
                      key: addr.key,
                      value: addr.key,
                    }));
                  }
                });
              }
            });
          }
        });

        this.fields().forEach(field => {
          if (field.key === 'currencyId' && field.controlType === 'select') {
            (field as Select).options = currencies.map(cur => ({ key: cur.key, value: cur.key }));
          }


          else if (field.key === 'parent' && field.controlType === 'formGroup') {
            // On cible le Select enfant dans le FormGroupBox
            field.groupFields?.forEach(nestedField => {
              if (nestedField.key === 'id' && nestedField.controlType === 'select') {
                (nestedField as Select).options = parentCompanies.content.map(company => ({
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

  changeTab(id: string): void {
    if (this.company().companyId) {
      this.activeTab.set(id);
    }
  }

  onSubmit(): void {
    if (this.activeTab() === 'tab1') {
      if (this.generalInfoForm().invalid){
        return
      }
      const companySubscribe = this.company().companyId
        ? this.companyService.updateCompany(
            getValueOrEmpty(this.company().companyId),
            this.generalInfoForm().getRawValue() as Company
          )
        : this.companyService.createCompany(this.generalInfoForm().getRawValue() as Company);

      companySubscribe.subscribe({
        next: res => {
          this.activeTab.set('tab2')

          this.company.set(res);
        },
      });
    } else if (this.activeTab() === 'tab2' && this.company().companyId) {
      if (this.addressContactForm().invalid){
        return
      }
      const address = this.addressContactForm().get('companyDetails');
      this.companyService
        .createAddresses(getValueOrEmpty(this.company().companyId), address?.getRawValue())
        .subscribe({
          next: () => {
            this.activeTab.set('tab3')
          },
          error: () => {
            console.log('error');
          },
        });
    } else if (this.activeTab() === 'tab3' && this.company().companyId) {
      if (this.fiscalInfoForm().invalid){
        return
      }
      this.companyService
        .createLegals(
          getValueOrEmpty(this.company().companyId),
          this.fiscalInfoForm().getRawValue() as LegalInfo
        )
        .subscribe({
          next: () => {
            this.activeTab.set('tab1')
          },
          error: () => {
            console.log('error');
          },
        });
    } else if (this.activeTab() === 'tab4' && this.company().companyId) {
      if (this.configForm().invalid){
        return
      }
      const fileControl = this.configForm().get('logo');
      if (fileControl && fileControl.value) {
        this.companyService
          .uploadCompanyLogo(getValueOrEmpty(this.company().companyId), fileControl.value)
          .subscribe({
            next: () => {
              void this.router.navigate(['/configuration/structure_societe/companies']);
            },
            error: err => {
              console.error('Error uploading logo:', err);
            },
          });
      }
    }
  }

  cancelAction(): void {
    void this.router.navigate(['/configuration/structure_societe/companies']);
  }
}
