import { Validators } from '@angular/forms';
import { Textbox } from '../input_type/textbox';

export const RESET_PWD_FIELDS = [
  new Textbox({
    key: 'email',
    label: 'Email',
    required: true,
    order: 1,
    type: 'text',
    placeholder: 'Enter email',
    validators: [Validators.required, Validators.email],
  }),
];
