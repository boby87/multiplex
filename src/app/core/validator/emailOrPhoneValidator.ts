import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailOrPhoneValidator(): ValidatorFn {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^6\d{8}$/;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').toString().trim();
    if (!value) return null;
    return emailPattern.test(value) || phonePattern.test(value) ? null : { emailOrPhone: true };
  };
}
