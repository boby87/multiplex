import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'quote-templates',
    loadComponent: () =>
      import('./quote-template/quote-template.component').then(
        m => m.QuoteTemplateComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentesRoutingModule { }
