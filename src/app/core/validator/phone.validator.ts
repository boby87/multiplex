// phone-e164.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneValidator(): ValidatorFn {
  // ^\+[0-9]\d{5,14}$  -> + suivi de 6 à 15 chiffres au total
  const pattern = /^6[0-9]{8}$/;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').toString().trim();
    if (value === '') return null; // laisse 'required' gérer le vide
    return pattern.test(value) ? null : { phoneE164: true };
  };
}
