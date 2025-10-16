import { Routes } from '@angular/router';
import { LayoutsComponent } from './layouts/layouts.component';
import { Page404Component } from './shared/page404/page404.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule),
  },

  {
    path: '',
    canActivate: [authGuard],
    component: LayoutsComponent,
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
  },

  { path: '**', component: Page404Component },
];
