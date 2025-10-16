import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'catalog',
    loadChildren: () => import('./catalogue/catalogue.module').then(m => m.CatalogueModule),
  },
  {
    path: 'structure_societe',
    loadChildren: () =>
      import('./struture-societe/struture-societe.module').then(m => m.StrutureSocieteModule),
  },

  {
    path: 'price',
    loadChildren: () =>
      import('./tarification/tarification.module').then(m => m.TarificationModule),
  },
  {
    path: 'ventes',
    loadChildren: () => import('./ventes/ventes.module').then(m => m.VentesModule),
  },
  {
    path: 'users_roles',
    loadChildren: () =>
      import('./users-and-roles/users-and-roles.module').then(m => m.UsersAndRolesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationRoutingModule {}
