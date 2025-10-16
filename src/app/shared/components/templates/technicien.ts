import { Checkbox } from '../input_type/checkbox';
import { Textbox } from '../input_type/textbox';
import { FormArrayGroup } from '../input_type/form.array.group';
import { Select } from '../input_type/select';
import { Validators } from '@angular/forms';
import { phoneValidator } from '../../../core/validator/phone.validator';
import { BaseDynamicForm } from '../input_type/dynamic.form';
import { Multiselect } from '../input_type/multiselect';
import { Textarea } from '../input_type/textarea';

export const PHYSICAL_TECHNICIAN_FIELDS: BaseDynamicForm[] = [
  new Textbox({
    key: 'firstname',
    label: 'TECHNICIAN.FIRSTNAME',
    classColumn: 'col-md-6',
    required: true,
  }),
  new Textbox({
    key: 'lastname',
    label: 'TECHNICIAN.LASTNAME',
    placeholder: 'TECHNICIAN.LASTNAME_PLACEHOLDER',
    classColumn: 'col-md-6',
    required: true,
  }),
  new Textbox({
    key: 'email',
    label: 'TECHNICIAN.EMAIL',
    required: true,
    placeholder: 'TECHNICIAN.EMAIL_PLACEHOLDER',
    type: 'email',
    classColumn: 'col-md-6',
    validators: [Validators.required, Validators.email],
  }),
  new Select({
    key: 'language',
    label: 'TECHNICIAN.LANGUAGE',
    classColumn: 'col-md-6',
    value: 'EN',
    options: [
      { key: 'EN', value: 'TECHNICIAN.LANG_EN' },
      { key: 'FR', value: 'TECHNICIAN.LANG_FR' },
    ],
    required: true,
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'contactPersonName',
    label: 'TECHNICIAN.CONTACT_NAME',
    placeholder: 'TECHNICIAN.CONTACT_NAME_PLACEHOLDER',
    classColumn: 'col-md-6',
  }),
  new Select({
    key: 'technicianType',
    label: 'TECHNICIAN.TYPE',
    classColumn: 'col-md-6',
    value: '',
    options: [],
    required: true,
    validators: [Validators.required],
  }),

  new FormArrayGroup({
    key: 'contacts',
    classColumn: 'col-md-12',
    initialAddCount: 1,
    childrenFields: [
      new Textbox({
        key: 'phone',
        label: 'TECHNICIAN.PHONE',
        classColumn: 'col-md-4',
        required: true,
        placeholder: 'TECHNICIAN.PHONE_PLACEHOLDER',
        validators: [Validators.required, phoneValidator()],
      }),
      new Checkbox({
        key: 'defaultContact',
        label: 'TECHNICIAN.DEFAULT_CONTACT',
        classColumn: 'col-md-4',
        value: false,
      }),
      new Checkbox({
        key: 'whatsapp',
        icon: 'fab fa-whatsapp text-whatsapp',
        label: 'TECHNICIAN.WHATSAPP',
        classColumn: 'col-md-4',
        value: false,
      }),
    ],
  }),
  new Multiselect({
    key: 'skills',
    label: 'TECHNICIAN.DOMAIN',
    classColumn: 'col-md-12',
    required: true,
    withPrincipalValue: true,
    value: [],
    options: [],
    validators: [Validators.required],
  }),
  new Textarea({
    key: 'notes',
    label: 'Remarques',
    placeholder: 'Senior field technician',
    classColumn: 'col-md-12'
  }),
];
