import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'validatorErrorMessage',
})
export class ValidatorErrorMessagePipe implements PipeTransform {
  transform(errors: ValidationErrors | null | undefined): string {

    if (!errors) return '';
    const errorKey = Object.keys(errors)[0];
    switch (errorKey) {
      case 'required':
        return 'This field is required.';
      case 'minlength':
        return `Minimum length is ${errors['minlength'].requiredLength}`;
      case 'maxlength':
        return `Maximum length is ${errors['maxlength'].requiredLength}`;
      case 'pattern':
        return 'Invalid format.';
      case 'mustMatch':
        return 'Values must match.';
      case 'min':
        return `Minimum value is ${errors['min'].min}`;
      case 'max':
        return `Maximum value is ${errors['max'].max}`;
      case 'email':
        return `Email must be a valid email address`;
      case 'emailOrPhone':
        return `Format invalide : entrez un email ou un numéro de 9 chiffres qui commence par 6.`;
        case 'phoneE164':
        return `Format invalide. Exemple: 691425676`;
        case 'lowercaseUsername':
        return `Doit contenir uniquement des minuscules et chiffres, sans espace ni caractère spécial.`;
      default:
        return 'Invalid field.';
    }
  }
}
