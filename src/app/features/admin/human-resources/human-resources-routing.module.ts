import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { employeesResolver } from './employees/employees.resolver';
import { companyResolver } from '../configuration/struture-societe/companies/company.resolver';
import { departmentResolver } from '../configuration/struture-societe/departement/department.resolver';
import { jobResolver } from '../configuration/struture-societe/job/job.resolver';
import { rolesResolver } from '../configuration/users-and-roles/roles/roles.resolver';

const routes: Routes = [
  {
    path: 'employees',
    loadComponent: () => import('./employees/employees.component').then(m => m.EmployeesComponent),
    resolve: { employees: employeesResolver },
  },
  {
    path: 'add-employees',
    loadComponent: () =>
      import('./employees/add-employees/add-employees.component').then(
        m => m.AddEmployeesComponent
      ),
    resolve: {
      companies: companyResolver,
      departments: departmentResolver,
      jobs: jobResolver,
      employees: employeesResolver,
      roles: rolesResolver
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HumanResourcesRoutingModule {}
