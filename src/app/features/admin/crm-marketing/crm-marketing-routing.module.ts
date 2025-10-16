import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { technicianResolver } from './technicianResolver';
import { skillResolver } from '../general-sitting/values-listing/skills/skill.resolver';
import { rolesResolver } from '../configuration/users-and-roles/roles/roles.resolver';
import { employeesResolver } from '../human-resources/employees/employees.resolver';
import { companyResolver } from '../configuration/struture-societe/companies/company.resolver';
import { departmentResolver } from '../configuration/struture-societe/departement/department.resolver';
import { jobResolver } from '../configuration/struture-societe/job/job.resolver';

const routes: Routes = [
  {
    path: 'technician-physical',
    loadComponent: () =>
      import('./techniciens/techniciens.component').then(m => m.TechniciensComponent),
    resolve: { technicians: technicianResolver },
  },

  {
    path: 'add_physical',
    loadComponent: () =>
      import('./techniciens/add-physical/add-physical.component').then(
        m => m.AddPhysicalComponent
      ),
    resolve: {
      skills: skillResolver
    },
  },

  {
    path: 'technician-business',
    loadComponent: () =>
      import('./technicien-business/technicien-business.component').then(
        m => m.TechnicienBusinessComponent
      ),
    resolve: { technicians: technicianResolver },
  },
  {
    path: 'add_business',
    loadComponent: () =>
      import('./technicien-business/add-business/add-business.component').then(
        m => m.AddBusinessComponent
      ),
    resolve: {
      skills: skillResolver,
      companies: companyResolver,
      departments: departmentResolver,
      jobs: jobResolver,
      technicians: technicianResolver,
      employees: employeesResolver,
      roles: rolesResolver

    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrmMarketingRoutingModule {}
