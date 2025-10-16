import { Component, inject, OnInit, signal, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { LOGIN_FIELDS } from '../../../../shared/components/templates/login';
import { AuthService } from '../../../../core/service/auth.service';
import { UserLogin } from '../../../../shared/model/user';
import { EduMessagesComponent } from '../../../../shared/components/edu-messages/edu-messages.component';
import { toFormGroupArray } from '../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    DynamicFormComponent,
    EduMessagesComponent,
    NgOptimizedImage,
  ],
  providers: [BsModalService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form = signal(new FormGroup({}));
  fields = signal(LOGIN_FIELDS);
  modalRef?: BsModalRef;
  private modalService = inject(BsModalService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    this.form.set(toFormGroupArray(this.formBuilder, this.fields()));
  }
  openModal(content: TemplateRef<any>) {
    this.modalRef = this.modalService.show(content);
  }
  errorMessage = signal<string | null>(null);

  onSubmit() {
    if (this.form().invalid) return;
    this.errorMessage.set(null);
    this.authService
      .login({
        ...this.form().value,
        deviceToken: 'web',
      } as UserLogin)
      .subscribe({
        next: () => {
          const url = //this.authService.requiresOtp ? 'chanel-otp' : 'dashboard';
          this.router.navigateByUrl('dashboard').then();
        },
        error: () => {
          this.errorMessage.set('Identifiants invalides. Veuillez réessayer.');
        },
      });
  }
}
