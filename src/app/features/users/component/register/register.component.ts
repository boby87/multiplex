import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-register',
  imports: [NgClass, ReactiveFormsModule, AlertComponent, RouterLink, SlickCarouselModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  signupForm!: UntypedFormGroup;
  submitted: any = false;
  error: any = '';
  successmsg: any = false;

  constructor(private formBuilder: UntypedFormBuilder) {}

  // set the currenr year
  year: number = new Date().getFullYear();

  ngOnInit(): void {
    document.body.classList.add('auth-body-bg');

    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.signupForm.controls;
  }

  // swiper config
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
  };

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;
  }
}
