import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { interval, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/service/auth.service';
import { NgOptimizedImage } from '@angular/common';
import { EduMessagesComponent } from '../../../../shared/components/edu-messages/edu-messages.component';
import { VERIFICATION_OTP_FIELDS } from '../../../../shared/components/templates/chanel-otp';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { ChanelOtpService } from '../services/chanel.otp.service';
import { getValueOrEmpty } from '../../../../shared/utility/fonction';
import { toFormGroupArray } from '../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';

@Component({
  selector: 'app-otp-verification',
  imports: [
    EduMessagesComponent,
    ReactiveFormsModule,
    DynamicFormComponent,
    NgOptimizedImage,
    RouterLink,
  ],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss',
})
export class OtpVerificationComponent implements OnInit, OnDestroy {
  // Form setup
  form = signal(new FormGroup({}));
  fields = signal(VERIFICATION_OTP_FIELDS);
  private formBuilder = inject(FormBuilder);

  // User information
  chanelDetails = signal<string>('example@abc.com'); // Will be dynamically replaced with actual user email or masked phone
  otpChannel = signal<'whatsapp' | 'sms' | 'email'>('email'); // Default channel

  // Countdown timer
  timeRemaining = signal<number>(300); // 5 minutes in seconds
  formattedTime = signal<string>('05:00');
  isExpired = signal<boolean>(false);

  canResend = signal<boolean>(false);
  resendCountdown = signal<number>(60); // 60 seconds wait before resend is enabled

  // Error handling
  errorMessage = signal<string | null>(null);

  // Utilities
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private chanelOtpService = inject(ChanelOtpService);

  ngOnInit(): void {
    this.form.set(toFormGroupArray(this.formBuilder, this.fields()));
    this.activatedRoute.params.subscribe({
      next: params => {
        this.otpChannel.set(params['chanel']);
        this.chanelDetails.set(this.otpChannel() === 'email'? this.authService.userContext.email!: this.authService.userContext.phone!)
      },
    });

    this.startCountdown();

    this.startResendCooldown();

    // Setup auto-focus to next input
    this.setupFormEventListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Setup listeners to auto-focus next input after digit entry
  setupFormEventListeners(): void {
    this.fields().forEach((field, index) => {
      this.form()
        .get(field.key)
        ?.valueChanges.subscribe(value => {
          if (value && index < this.fields().length - 1) {
            const previousField = this.fields()[index + 1];
            const nextInput = document.getElementById(previousField.key);
            nextInput?.focus();
          }
        });
    });
  }

  startCountdown(): void {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const currentTime = this.timeRemaining();

        if (currentTime <= 0) {
          this.isExpired.set(true);
          this.formattedTime.set('00:00');
          return;
        }

        const newTime = currentTime - 1;
        this.timeRemaining.set(newTime);

        // Format time as MM:SS
        const minutes = Math.floor(newTime / 60);
        const seconds = newTime % 60;
        this.formattedTime.set(
          `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      });
  }

  startResendCooldown(): void {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const currentCooldown = this.resendCountdown();

        if (currentCooldown <= 0) {
          this.canResend.set(true);
          return;
        }

        this.resendCountdown.set(currentCooldown - 1);
      });
  }

  resetCountdown(): void {
    this.timeRemaining.set(300); // 5 minutes
    this.formattedTime.set('05:00');
    this.isExpired.set(false);
  }

  resendOtp(): void {
    if (!this.canResend()) return;

    this.chanelOtpService
      .otpRequest(
        getValueOrEmpty(this.authService.userContext.userId),
        getValueOrEmpty(
          this.otpChannel() !== 'email'
            ? this.authService.userContext.phone
            : this.authService.userContext.email
        ),
        this.otpChannel()
      )
      .subscribe({
        next: res => {
          console.log(res);
        },
      });
    // Reset resend state
    this.canResend.set(false);
    this.resendCountdown.set(60);
    this.startResendCooldown();
    this.resetCountdown();

    this.form().reset();

    this.errorMessage.set(null);
  }

  verifyOtp(): void {
    if (this.form().invalid) return;
    this.chanelOtpService
      .otpVerify(
        getValueOrEmpty(this.authService.userContext.userId),
        this.authService.userContext.phone!,
        Object.values(this.form().value).join(''),

      )
      .subscribe({
        next: result => {
        if (result['valid']===false){
          if (result['remainingAttempts'] === 0){
            this.errorMessage.set('Le code saisi est invalide et vous avez épuisé toutes vos tentatives. Veuillez redemander un nouveau code.');
            const lockExpirationTime = result['lockExpirationTime'] ;
            const diffSeconds = Math.floor((lockExpirationTime - Date.now()) / 1000);
            this.timeRemaining.set(diffSeconds);
            this.resendCountdown.set(diffSeconds);
            this.form().disable();
            return;
          }
            this.errorMessage.set('Le code saisi est invalide et vous reste '+result['remainingAttempts']+' tentative(s). Veuillez réessayer. ');
            return;
          }
          this.errorMessage.set(null);
          void this.router.navigateByUrl('dashboard');
        },
      });
  }
}
