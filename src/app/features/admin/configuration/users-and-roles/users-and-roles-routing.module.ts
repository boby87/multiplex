import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { rolesResolver } from './roles/roles.resolver';
import { companyResolver } from '../struture-societe/companies/company.resolver';
import { userProfileResolver } from './users/user.profile.resolver';

const routes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
    resolve: { userSummaries: userProfileResolver },

  },
  {
    path: 'details_user/:username/:updateType',
    loadComponent: () =>
      import('./users/user-details/user-details.component').then(m => m.UserDetailsComponent),
  },
  {
    path: 'roles',
    loadComponent: () => import('./roles/roles.component').then(m => m.RolesComponent),
    resolve: { roles: rolesResolver },
  },
  {
    path: 'add_role',
    loadComponent: () =>
      import('./roles/add-role/add-role.component').then(m => m.AddRoleComponent),
    resolve: { companies: companyResolver },
  },
  {
    path: 'acls',
    loadComponent: () =>
      import('./acl/acl.component').then(m => m.AclComponent),
    resolve: { companies: companyResolver },
  },
  {
    path: 'add-acl',
    loadComponent: () =>
      import('./acl/add-acl/add-acl.component').then(m => m.AddAclComponent),
    resolve: { companies: companyResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersAndRolesRoutingModule {}
