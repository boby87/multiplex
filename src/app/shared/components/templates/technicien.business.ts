import { Checkbox } from '../input_type/checkbox';
import { Select } from '../input_type/select';
import { Textbox } from '../input_type/textbox';
import { Validators } from '@angular/forms';
import { FormArrayGroup } from '../input_type/form.array.group';
import { phoneValidator } from '../../../core/validator/phone.validator';
import { Textarea } from '../input_type/textarea';
import { BaseDynamicForm } from '../input_type/dynamic.form';
import { Multiselect } from '../input_type/multiselect';

export const BUSINESS_TECHNICIAN_FIELDS: BaseDynamicForm[] = [
  new Textbox({
    key: 'name',
    label: 'BUSINESS_TECHNICIAN.NAME',
    placeholder: 'BUSINESS_TECHNICIAN.NAME',
    classColumn: 'col-md-6',
    required: true,
    validators: [Validators.required]
  }),
  new Textbox({
    key: 'email',
    label: 'BUSINESS_TECHNICIAN.EMAIL',
    placeholder: 'BUSINESS_TECHNICIAN.EMAIL',
    classColumn: 'col-md-6',
    required: true,
    validators: [Validators.required, Validators.email]
  }),
  new Select({
    key: 'technicianGrade',
    label: 'BUSINESS_TECHNICIAN.GRADE',
    placeholder: 'BUSINESS_TECHNICIAN.GRADE',
    classColumn: 'col-md-6',
    validators: [Validators.required],
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
  new Textbox({
    key: 'legalStatus',
    label: 'BUSINESS_TECHNICIAN.LEGAL_STATUS',
    placeholder: 'BUSINESS_TECHNICIAN.LEGAL_STATUS',
    classColumn: 'col-md-6',
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'acronym',
    label: 'BUSINESS_TECHNICIAN.ACRONYM',
    placeholder: 'BUSINESS_TECHNICIAN.ACRONYM',
    classColumn: 'col-md-6',
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'slogan',
    label: 'BUSINESS_TECHNICIAN.SLOGAN',
    placeholder: 'BUSINESS_TECHNICIAN.SLOGAN',
    classColumn: 'col-md-6',
    validators: [Validators.required],
  }),

  new Textbox({
    key: 'commercialRegisterNumber',
    label: 'BUSINESS_TECHNICIAN.REGISTER_NUMBER',
    placeholder: 'BUSINESS_TECHNICIAN.REGISTER_NUMBER',
    classColumn: 'col-md-6',
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'taxPayerNumber',
    label: 'BUSINESS_TECHNICIAN.TAX_NUMBER',
    placeholder: 'BUSINESS_TECHNICIAN.TAX_NUMBER',
    classColumn: 'col-md-6',
    validators: [Validators.required],
  }),
  new Select({
    key: 'taxRegime',
    label: 'BUSINESS_TECHNICIAN.TAX_REGIME',
    placeholder: 'BUSINESS_TECHNICIAN.TAX_REGIME',
    classColumn: 'col-md-6',
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'applicableTaxesAndDuties',
    label: 'BUSINESS_TECHNICIAN.TAXES',
    placeholder: 'BUSINESS_TECHNICIAN.TAXES',
    classColumn: 'col-md-12',
  }),
  new Textbox({
    key: 'website',
    label: 'BUSINESS_TECHNICIAN.WEBSITE',
    placeholder: 'BUSINESS_TECHNICIAN.WEBSITE',
    classColumn: 'col-md-12',
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
        value: true,
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
    placeholder: 'TECHNICIAN.DOMAIN',
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
    classColumn: 'col-md-12',
  }),
];

export const BUSINESS_MANAGER_TECHNICIAN: BaseDynamicForm[] = [
  new Select({
    key: 'title',
    label: 'TECHNICIAN.TITLE',
    placeholder: 'TECHNICIAN.TITLE',
    classColumn: 'col-md-6',
    required: true,
    value: 'Mr',
    options:[
      {key: 'Mr', value: 'Mr'}
    ],
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'function',
    label: 'TECHNICIAN.FUNCTION',
    placeholder: 'TECHNICIAN.FUNCTION',
    classColumn: 'col-md-6',
    required: true,
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'firstname',
    label: 'TECHNICIAN.FIRSTNAME',
    placeholder: 'TECHNICIAN.FIRSTNAME',
    classColumn: 'col-md-6',
    required: true,
  }),
  new Textbox({
    key: 'lastname',
    label: 'TECHNICIAN.LASTNAME',
    placeholder: 'TECHNICIAN.LASTNAME',
    classColumn: 'col-md-6',
    required: true,
  }),
  new Textbox({
    key: 'email',
    label: 'TECHNICIAN.EMAIL',
    placeholder: 'TECHNICIAN.EMAIL',
    required: true,
    type: 'email',
    classColumn: 'col-md-6',
    validators: [Validators.required, Validators.email],
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
]
