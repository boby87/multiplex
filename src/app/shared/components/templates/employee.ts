import { Textbox } from '../input_type/textbox';
import { phoneValidator } from '../../../core/validator/phone.validator';
import { Validators } from '@angular/forms';
import { FormGroupBox } from '../input_type/form.group.box';
import { Select } from '../input_type/select';
import { Textarea } from '../input_type/textarea';
import { Multiselect } from '../input_type/multiselect';
import { Checkbox } from '../input_type/checkbox';
import { FormArrayGroup } from '../input_type/form.array.group';
import { lowercaseUsernameValidator } from '../../../core/validator/lowercase.username.validator';

export const PARTNER_FIELDS = [

  new Textbox({
    key: 'contactPersonName',
    label: 'PARTNER.CONTACT_PERSON',
    placeholder: 'PARTNER.CONTACT_PERSON_PLACEHOLDER',
    required: true,
    classColumn: 'col-md-6',
    validators: [Validators.required],
  }),
  new Select({
    key: 'language',
    label: 'PARTNER.LANGUAGE',
    value: 'EN',
    required: true,
    classColumn: 'col-md-6',
    options: [
      { key: 'EN', value: 'PARTNER.LANG_EN' },
      { key: 'FR', value: 'PARTNER.LANG_FR' },
    ],
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'email',
    label: 'PARTNER.EMAIL',
    placeholder: 'PARTNER.EMAIL_PLACEHOLDER',
    required: true,
    classColumn: 'col-md-6',
    validators: [Validators.required, Validators.email],
  }),
  new Textarea({
    key: 'notes',
    label: 'PARTNER.NOTES',
    placeholder: 'PARTNER.NOTES_PLACEHOLDER',
    classColumn: 'col-md-12',
  }),
  new FormGroupBox({
    key: 'partnerAttribute',
    label: 'PARTNER.INFO',
    classColumn: 'col-md-12',
    groupFields: [
      new Textbox({
        key: 'firstname',
        label: 'PARTNER.FIRSTNAME',
        placeholder: 'PARTNER.FIRSTNAME_PLACEHOLDER',
        required: true,
        classColumn: 'col-md-6',
      }),
      new Textbox({
        key: 'lastname',
        label: 'PARTNER.LASTNAME',
        placeholder: 'PARTNER.LASTNAME_PLACEHOLDER',
        required: true,
        classColumn: 'col-md-6',
      }),
      new Textbox({
        key: 'phone',
        label: 'PARTNER.PHONE',
        placeholder: 'PARTNER.PHONE_PLACEHOLDER',
        required: true,
        classColumn: 'col-md-6',
        validators: [Validators.required, phoneValidator()],
      }),
      new Textbox({
        key: 'address',
        label: 'PARTNER.ADDRESS',
        placeholder: 'PARTNER.ADDRESS_PLACEHOLDER',
        required: true,
        classColumn: 'col-md-6',
        validators: [Validators.required],
      }),
    ],
  }),
];
export const EMPLOYEE_CONTRACT_FIELDS = [
  new Textbox({
    key: 'officialBaseSalary',
    label: 'EMPLOYEE.SALARY',
    type: 'number',
    required: true,
    classColumn: 'col-md-12',
    placeholder: 'EMPLOYEE.SALARY_PLACEHOLDER',
    validators: [Validators.required],
  }),
  new Textarea({
    key: 'additionalInformation',
    label: 'EMPLOYEE.ADDITIONAL_INFO',
    required: false,
    classColumn: 'col-md-12',
    placeholder: 'EMPLOYEE.ADDITIONAL_INFO_PLACEHOLDER',
  }),
];
export const USER_INFOS_FIELDS = [
  new Textbox({
    key: 'username',
    label: 'USER.USERNAME',
    required: true,
    classColumn: 'col-md-12',
    placeholder: 'USER.USERNAME_PLACEHOLDER',
    validators: [Validators.required, lowercaseUsernameValidator()],
  }),
  new FormArrayGroup({
    key: 'companies',
    label: 'USER.COMPANIES',
    classColumn: 'col-md-12',
    initialAddCount: 1,
    childrenFields: [
      new FormGroupBox({
        key: 'company',
        classColumn: 'col-md-6',
        groupFields: [
          new Select({
            key: 'id',
            label: 'USER.COMPANY',
            required: true,
            classColumn: 'col-md-12',
            options: [],
            validators: [Validators.required],
          }),
        ],
      }),
      new FormGroupBox({
        key: 'department',
        classColumn: 'col-md-6',
        groupFields: [
          new Select({
            key: 'id',
            label: 'USER.DEPARTMENT',
            required: true,
            classColumn: 'col-md-12',
            options: [],
          }),
        ],
      }),
      new FormGroupBox({
        key: 'job',
        classColumn: 'col-md-6',
        groupFields: [
          new Select({
            key: 'id',
            label: 'USER.JOB',
            required: true,
            classColumn: 'col-md-12',
            options: [],
          }),
        ],
      }),
      new FormGroupBox({
        key: 'manager',
        classColumn: 'col-md-6',
        groupFields: [
          new Select({
            key: 'id',
            label: 'USER.MANAGER',
            required: true,
            classColumn: 'col-md-12',
            options: [],
          }),
        ],
      }),
      new Multiselect({
        key: 'roles',
        label: 'USER.ROLES',
        required: true,
        classColumn: 'col-md-6',
        options: [],
        validators: [Validators.required],
      }),
      new Checkbox({
        key: 'defaultCompany',
        label: 'USER.DEFAULT_COMPANY',
        value: false,
        required: false,
        classColumn: 'col-md-6',
      }),
    ],
  }),
];
