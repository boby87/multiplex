import { Validators } from '@angular/forms';
import { Password } from '../input_type/password';
import { Textbox } from '../input_type/textbox';
import { Checkbox } from '../input_type/checkbox';
import { Select } from '../input_type/select';
import { FormArrayGroup } from '../input_type/form.array.group';
import { BaseDynamicForm } from '../input_type/dynamic.form';
import { phoneValidator } from '../../../core/validator/phone.validator';

export const USER_PASSWORD_FIELDS = [
  new Password({
    value: '',
    key: 'oldPassword',
    label: 'oldPassword',
    required: true,
    order: 6,
    type: 'password',
    className: 'custom-input',
    placeholder: 'Enter password',
    validators: [Validators.required],
  }),
  new Password({
    value: '',
    key: 'newPassword',
    label: 'newPassword',
    required: true,
    order: 6,
    type: 'password',
    className: 'custom-input',
    placeholder: 'Enter password',
    validators: [Validators.required],
  }),
  new Password({
    value: '',
    key: 'confirmPassword',
    label: 'confirmPassword',
    required: true,
    order: 6,
    type: 'password',
    className: 'custom-input',
    placeholder: 'Enter password',
    validators: [Validators.required],
  }),
];

export const USER_ADMIN_PASSWORD_FIELDS = [
  new Password({
    value: '',
    key: 'newPassword',
    label: 'newPassword',
    required: true,
    order: 6,
    type: 'password',
    className: 'custom-input',
    placeholder: 'Enter password',
    validators: [Validators.required],
  }),
  new Password({
    value: '',
    key: 'confirmPassword',
    label: 'confirmPassword',
    required: true,
    order: 6,
    type: 'password',
    className: 'custom-input',
    placeholder: 'Enter password',
    validators: [Validators.required],
  }),
];

export const USER_EMAIL_FIELDS = [
  new Textbox({
    key: 'email',
    label: 'email',
    required: true,
    classColumn: 'col-md-12',
    placeholder: 'Entrer email',
    validators: [Validators.required],
  }),
];

export const USER_ADDRESS_FIELDS = [
  new FormArrayGroup({
    key: 'addresses',
    label: 'addresses',
    classColumn: 'col-md-12',
    initialAddCount: 1,
    childrenFields: [
      new Select({
        key: 'addressType',
        label: 'addressType',
        value: 'Autres',
        classColumn: 'col-md-6',
        validators: [Validators.required],
        options: [
          { key: 'OTHERS', value: 'Autres' },
        ],
      }),
      new Textbox({
        key: 'country',
        label: 'country',
        value: 'CAMEROON',
        disabled: true,
        classColumn: 'col-md-6',
        validators: [Validators.required],
      }),
      new Select({
        key: 'region',
        label: 'region',
        value: '',
        options:[],
        classColumn: 'col-md-6',
        validators: [Validators.required],
      }),
      new Textbox({
        key: 'city',
        label: 'city',
        value: '',
        classColumn: 'col-md-6',
        validators: [Validators.required],
      }),
      new Textbox({
        key: 'quarter',
        label: 'quarter',
        value: '',
        classColumn: 'col-md-6',
      }),
      new Textbox({
        key: 'street',
        label: 'street',
        value: '',
        classColumn: 'col-md-6',
      }),
      new Textbox({
        key: 'complement',
        label: 'Complément',
        value: '',
        classColumn: 'col-md-6',
      }),
      new Textbox({
        key: 'postalCode',
        label: 'postalCode',
        value: '',
        classColumn: 'col-md-6',
      }),
      new Textbox({
        key: 'countryCode',
        label: 'countryCode',
        value: 'CM',
        disabled: true,
        classColumn: 'col-md-6',
      }),
      new Checkbox({
        key: 'defaultAddress',
        label: 'defaultAddress',
        value: false,
        classColumn: 'col-md-12',
      }),
    ],
  }),
];

export const USER_CONTACT_FIELDS: BaseDynamicForm[] = [
  new FormArrayGroup({
    key: 'contacts',
    label: 'contacts',
    classColumn: 'col-md-12',
    initialAddCount: 1,
    childrenFields: [
      new Textbox({
        key: 'phone',
        label: 'phone',
        type: 'tel',
        placeholder: '698765432',
        classColumn: 'col-md-6',
        validators: [Validators.required, phoneValidator()],
      }),
      new Checkbox({
        key: 'defaultContact',
        label: 'defaultContact',
        value: false,
        classColumn: 'col-md-3',
      }),
      new Checkbox({
        key: 'whatsapp',
        label: 'whatsapp',
        value: false,
        classColumn: 'col-md-3',
      }),
    ],
  }),
];
