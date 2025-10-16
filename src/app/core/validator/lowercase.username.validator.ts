// username.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function lowercaseUsernameValidator(): ValidatorFn {
  const pattern = /^[a-z0-9]+$/; // a-z et chiffres seulement

  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').toString().trim();
    if (value === '') return null;
    return pattern.test(value) ? null : { lowercaseUsername: true };
  };
}
