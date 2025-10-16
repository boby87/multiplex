import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { PasswordResetComponent } from './component/password-reset/password-reset.component';
import { OtpVerificationComponent } from './component/otp-verification/otp-verification.component';
import { ChanelOtpComponent } from './component/chanel-otp/chanel-otp.component';
import { authGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'chanel-otp',
    canActivate: [authGuard],
    component: ChanelOtpComponent,
  },
  {
    path: 'otp-verification/:chanel',
    canActivate: [authGuard],
    component: OtpVerificationComponent,
  },
  {
    path: 'signup',
    component: RegisterComponent,
  },
  {
    path: 'reset-password',
    component: PasswordResetComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
