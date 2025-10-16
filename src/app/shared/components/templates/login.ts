import { Validators } from '@angular/forms';
import { Textbox } from '../input_type/textbox';
import { Password } from '../input_type/password';
import { emailOrPhoneValidator } from '../../../core/validator/emailOrPhoneValidator';

export const LOGIN_FIELDS = [
  new Textbox({
    value: '',
    key: 'username',
    label: 'Email ou Téléphone',
    required: true,
    order: 1,
    type: 'text',
    className: 'custom-input',
    placeholder: 'Email ou Téléphone',
    icon: 'bx bx-envelope input-icon',
    validators: [Validators.required,emailOrPhoneValidator()],
  }),
  new Password({
    value: '',
    key: 'password',
    label: 'Mot de passe',
    required: true,
    order: 6,
    type: 'password',
    className: 'custom-input',
    icon: 'bx bx-lock-alt input-icon',
    placeholder: 'Entre votre mot de passe',
    validators: [Validators.required],
  }),
];
