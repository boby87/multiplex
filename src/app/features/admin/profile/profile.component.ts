import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PageTitleComponent } from '../../../shared/ui/page-title/page-title.component';
import { Address, Contact, Partner, TabItem } from '../../../shared/model/user';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DynamicTableComponent,
  TableActionButton,
} from '../../../shared/components/dynamic-table/dynamic-table.component';
import { filterDataByTerm, getValueOrEmpty } from '../../../shared/utility/fonction';
import { AddButtonComponent } from '../../../shared/components/add-button/add-button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { CurrencyPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { Skill } from '../../../shared/model/skill';
import { AuthService } from '../../../core/service/auth.service';
import { PartnerService } from '../human-resources/service/partner.service';
import { result } from 'lodash';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    SlickCarouselModule,
    PageTitleComponent,
    DynamicTableComponent,
    AddButtonComponent,
    TranslatePipe,
    CurrencyPipe,
    NgClass,
    NgOptimizedImage,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  breadCrumbItems: TabItem[] = [{ label: 'profile.breadcrumb.profile', active: true }];
  actions: TableActionButton[] = [];
  labelButtonContact = signal<string>('profile.updateContact');
  labelButtonAddress = signal<string>('profile.updateAddress');
  allowedCompanies = signal<
    {
      companyName: string;
      departmentName: string;
      jobName: string;
      roles: string;
      defaultCompany: boolean;
    }[]
  >([]);
  address = signal<Address[]>([]);
  skills = signal<Skill[]>([]);
  contacts = signal<Contact[]>([]);
  columnsCompany = signal<
    (keyof {
      companyName: string;
      jobName: string;
      departmentName: string;
      roles: string;
      defaultCompany: boolean;
    })[]
  >(['companyName', 'departmentName', 'jobName', 'roles', 'defaultCompany']);

  columnsAddress = signal<(keyof Address)[]>([
    'country',
    'region',
    'city',
    'street',
    'quarter',
    'postalCode',
    'defaultAddress',
  ]);
  columnsContact = signal<(keyof Contact)[]>(['phone', 'whatsapp', 'defaultContact']);
  columnsSkill = signal<(keyof Skill)[]>(['name', 'status', 'main']);
  profile = signal<Partner>({});
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private partnerService = inject(PartnerService);
  searchTerm = signal<string>('');

  ngOnInit(): void {
    this.profile.set(this.activeRoute.snapshot.data['profile']);
    this.profile().companies?.forEach(allowedCompany => {
      this.allowedCompanies.update(companies => [
        ...companies,
        {
          companyName: allowedCompany.company.name,
          departmentName: getValueOrEmpty(allowedCompany.department?.name),
          jobName: getValueOrEmpty(allowedCompany.job?.name),
          roles: allowedCompany.roles.join(', '),
          defaultCompany: allowedCompany.defaultCompany,
        },
      ]);
    });
    this.address.set(this.profile().addresses || []);
    this.skills.set(this.profile().skills || []);
    this.contacts.set(this.profile().contacts || []);
    this.profile.update(old => {
      return {
        ...old,
        currentCompanyId: this.authService.userContext.currentCompanyId,
        defaultCompanyId: this.authService.userContext.defaultCompanyId,
      }
    })
  }

  filteredData = computed(() =>
    filterDataByTerm(this.allowedCompanies(), this.searchTerm(), this.columnsCompany())
  );

  filteredDataAddress = computed(() =>
    filterDataByTerm(this.address(), this.searchTerm(), this.columnsAddress())
  );
  filteredDataContact = computed(() =>
    filterDataByTerm(this.contacts(), this.searchTerm(), this.columnsContact())
  );

  filteredDataSkills = computed(() =>
    filterDataByTerm(this.skills(), this.searchTerm(), this.columnsSkill())
  );

  changeEmail() {
    void this.router.navigate([
      `/configuration/users_roles/details_user/${this.profile().username}/email`,
    ]);
  }

  changePassword() {
    void this.router.navigate([
      `/configuration/users_roles/details_user/${this.profile().username}/password`,
    ]);
  }

  changeContact() {
    const serialized = encodeURIComponent(JSON.stringify(this.profile()));
    void this.router.navigate(
      [`/configuration/users_roles/details_user/${this.profile().username}/contacts`],
      {
        queryParams: { data: serialized },
      }
    );
  }

  changeAddress() {
    const serialized = encodeURIComponent(JSON.stringify(this.profile()));
    void this.router.navigate(
      [`/configuration/users_roles/details_user/${this.profile().username}/addresses`],
      {
        queryParams: { data: serialized },
      }
    );
  }

  changeDefaultCompany(id: any) {
    this.partnerService.changeDefaultCompany(this.authService.userContext.username!, this.authService.userContext.userId!, id).subscribe({
      next: () => {
        this.reloadComponent()
      }
    })
  }
  switchCompany(id: any) {
    console.log(id.value);
    this.partnerService.switchCompany(this.authService.userContext.username!, this.authService.userContext.userId!, id).subscribe({
      next: () => {
        this.reloadComponent()
      }
    })
  }


  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
     void this.router.navigate([currentUrl]);
    });
  }
}
