import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { RESET_PWD_FIELDS } from '../../../../shared/components/templates/password.reset';
import { toFormGroupArray } from '../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';

@Component({
  selector: 'app-password-reset',
  imports: [RouterLink, AlertComponent, ReactiveFormsModule, DynamicFormComponent],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
})
export class PasswordResetComponent implements OnInit {
  form = signal(new FormGroup({}));
  submitted: any = false;
  error: any = '';
  success: any = '';
  loading: any = false;
  fields = signal(RESET_PWD_FIELDS);

  // set the currenr year
  year: number = new Date().getFullYear();

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit() {
    this.form.set(toFormGroupArray(this.formBuilder, this.fields()));
  }

  // convenience getter for easy access to form fields

  /**
   * On submit form
   */
  onSubmit() {
    this.success = '';
    this.submitted = true;

    // stop here if form is invalid
    if (this.form().invalid) {
      return;
    }
  }
}
