import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { ProfileComponent } from './profile/profile.component';
import { profileResolver } from './profile/profile.resolver';

const routes: Routes = [
  { path: 'dashboard', component: DashboardsComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    resolve: { profile: profileResolver },
  },

  {
    path: 'human_resources',
    loadChildren: () =>
      import('./human-resources/human-resources.module').then(m => m.HumanResourcesModule),
  },
  {
    path: 'crm',
    loadChildren: () =>
      import('./crm-marketing/crm-marketing.module').then(m => m.CrmMarketingModule),
  },

  {
    path: 'configuration',
    loadChildren: () =>
      import('./configuration/configuration.module').then(m => m.ConfigurationModule),
  },

  {
    path: 'general_settings',
    loadChildren: () =>
      import('./general-sitting/general-sitting.module').then(m => m.GeneralSittingModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
