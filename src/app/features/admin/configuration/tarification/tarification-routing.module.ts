import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { departmentResolver } from '../struture-societe/departement/department.resolver';
import { pricesResolver } from './prices/prices.resolver';

const routes: Routes = [
  {
    path: 'prices-lists',
    loadComponent: () => import('./prices/prices.component').then(m => m.PricesComponent),
    resolve: { prices: pricesResolver },
  },
  {
    path: 'add-price',
    loadComponent: () =>
      import('./prices/add-price/add-price.component').then(m => m.AddPriceComponent)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TarificationRoutingModule {}
