import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { companyResolver } from './companies/company.resolver';
import { departmentResolver } from './departement/department.resolver';
import { jobResolver } from './job/job.resolver';

const routes: Routes = [
  {
    path: 'companies',
    loadComponent: () => import('./companies/companies.component').then(m => m.CompaniesComponent),
    resolve: {
      companies: companyResolver,
    },
  },
  {
    path: 'add-company',
    loadComponent: () =>
      import('./companies/add-company/add-company.component').then(m => m.AddCompanyComponent),
  },
  {
    path: 'departements',
    loadComponent: () =>
      import('./departement/departement.component').then(m => m.DepartementComponent),
    resolve: { departments: departmentResolver },
  },
  {
    path: 'add-departement',
    loadComponent: () =>
      import('./departement/add-departement/add-departement.component').then(
        m => m.AddDepartementComponent
      ),
    resolve: {
      companies: companyResolver,
    },
  },
  {
    path: 'jobs',
    loadComponent: () => import('./job/job.component').then(m => m.JobComponent),
    resolve: { jobs: jobResolver },
  },
  {
    path: 'add-job',
    loadComponent: () => import('./job/add-job/add-job.component').then(m => m.AddJobComponent),
    resolve: { companies: companyResolver, departments: departmentResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StrutureSocieteRoutingModule {}
