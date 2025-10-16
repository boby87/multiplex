import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TabItem } from '../../../../../shared/model/user';
import {
  DynamicTableComponent,
  TableActionButton,
} from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { filterDataByTerm, getValueOrEmpty } from '../../../../../shared/utility/fonction';
import { DialogCompanyComponent } from '../../struture-societe/companies/dialog-company/dialog-company.component';
import { PartnerProfile, UserProfileService, UserSummary } from '../services/users.profile.service';
import { AddButtonComponent } from '../../../../../shared/components/add-button/add-button.component';
import { SearchBoxComponent } from '../../../../../shared/components/search-box/search-box.component';
import { PageTitleComponent } from '../../../../../shared/ui/page-title/page-title.component';

@Component({
  selector: 'app-users',
  imports: [AddButtonComponent, DynamicTableComponent, SearchBoxComponent, PageTitleComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  userSummaries = signal<UserSummary[]>([]);
  title = signal<string>('user.titleList');
  labelButton = signal<string>('user.addButton');
  breadCrumbItems: TabItem[] = [
    { label: 'user.breadcrumb.configuration' },
    { label: 'user.breadcrumb.user-roles' },
    { label: 'user.breadcrumb.users', active: true },
  ];
  actions: TableActionButton[] = [
    {
      label: 'user.actions.edit',
      icon: 'fas fa-pencil-alt text-success',
      doAction: (item: UserSummary) => this.edit(item),
    },
    {
      label: 'user.actions.details',
      icon: 'fas fa-eye text-primary',
      doAction: (item: UserSummary) => this.showDetails(item),
    },
    {
      label: 'user.actions.changePassword',
      icon: 'fas fa-key text-secondary',
      doAction: (item: UserSummary) => this.changePassword(item),
    },
    {
      label: 'user.actions.delete',
      icon: 'fas fa-trash text-danger',
      doAction: (item: UserSummary) => this.delect(item),
    },
  ];

  columns = signal<(keyof UserSummary)[]>(['username', 'fullName', 'email', 'phone']);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private userProfileService = inject(UserProfileService);
  private readonly dialog = inject(MatDialog);
  searchTerm = signal<string>('');

  ngOnInit(): void {
    this.userSummaries.set(this.activeRoute.snapshot.data['userSummaries']['content']);
  }

  filteredData = computed(() =>
    filterDataByTerm(this.userSummaries(), this.searchTerm(), this.columns())
  );

  edit(userSummary: UserSummary) {
    void this.router.navigate([
      `/profile`,
      {
        userId: userSummary.id,
      },
    ]);
  }

  delect(userSummary: UserSummary) {
    console.log('Delete action not implemented for userSummary:', userSummary);
  }

  private showDetails(item: UserSummary) {
    this.userProfileService.getSelfPartnerProfile(getValueOrEmpty(item.username)).subscribe({
      next: (partnerProfile: PartnerProfile) => {
        this.dialog.open(DialogCompanyComponent, {
          width: '90vw',
          height: '80%',
          maxWidth: '650px',
          data: partnerProfile,
        });
      },
      error: error => console.error('Error fetching company details:', error),
    });
  }

  private changePassword(item: UserSummary) {
    void this.router.navigate([
      `/configuration/users_roles/details_user/${item.username}/adminPassword`,
    ]);
  }
}
