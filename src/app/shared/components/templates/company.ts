import { Validators } from '@angular/forms';
import { Textbox } from '../input_type/textbox';
import { Checkbox } from '../input_type/checkbox';
import { Select } from '../input_type/select';
import { FileBox } from '../input_type/file.box';
import { FormArrayGroup } from '../input_type/form.array.group';
import { FormGroupBox } from '../input_type/form.group.box';
import { phoneValidator } from '../../../core/validator/phone.validator';

export const GENERAL_INFO_FIELDS = [
  new Textbox({
    value: '',
    key: 'name',
    label: 'COMPANIE.GENERAL_INFO.NAME.LABEL',
    required: true,
    classColumn: 'col-md-6',
    order: 1,
    type: 'text',
    placeholder: 'COMPANIE.GENERAL_INFO.NAME.PLACEHOLDER',
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'legalName',
    label: 'COMPANIE.GENERAL_INFO.LEGAL_NAME.LABEL',
    required: true,
    order: 2,
    classColumn: 'col-md-6',
    type: 'text',
    placeholder: 'COMPANIE.GENERAL_INFO.LEGAL_NAME.PLACEHOLDER',
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'code',
    label: 'COMPANIE.GENERAL_INFO.CODE.LABEL',
    required: true,
    order: 2,
    classColumn: 'col-md-6',
    type: 'text',
    placeholder: 'COMPANIE.GENERAL_INFO.CODE.PLACEHOLDER',
    validators: [Validators.required],
  }),
  new FormGroupBox({
    key: 'parent',
    classColumn: 'col-md-6',
    groupFields: [
      new Select({
        key: 'id',
        label: 'COMPANIE.GENERAL_INFO.PARENT.LABEL',
        value: '',
        classColumn: 'col-md-12',
        placeholder: 'COMPANIE.GENERAL_INFO.PARENT.PLACEHOLDER',
        required: true,
        options: [],
        validators: [Validators.required],
      }),
    ],
  }),
  new Select({
    key: 'currencyId',
    label: 'COMPANIE.GENERAL_INFO.CURRENCY.LABEL',
    required: true,
    order: 2,
    className: 'form-select',
    classColumn: 'col-md-6',
    value: 'XAF',
    options: [],
    disabled: true,
    validators: [Validators.required],
  }),
];

export const ADDRESS_CONTACT_FIELDS = [
  new FormArrayGroup({
    key: 'companyDetails',
    label: 'COMPANIE.ADDRESS_CONTACT.ADD_ADDRESS',
    classColumn: 'col-md-12',
    initialAddCount: 1,
    childrenFields: [
      new FormGroupBox({
        key: 'address',
        label: 'COMPANIE.ADDRESS_CONTACT.ADDRESS.LABEL',
        classColumn: 'col-md-12',
        groupFields: [
          new Select({
            key: 'addressType',
            label: 'COMPANIE.ADDRESS_CONTACT.ADDRESS_TYPE.LABEL',
            value: '',
            classColumn: 'col-md-6',
            options: [
              { key: 'OTHERS', value: 'OTHERS' }
            ],
            validators: [Validators.required],
          }),
          new Textbox({
            key: 'street',
            label: 'COMPANIE.ADDRESS_CONTACT.STREET.LABEL',
            classColumn: 'col-md-6',
            placeholder: 'COMPANIE.ADDRESS_CONTACT.STREET.PLACEHOLDER',
            validators: [Validators.required],
          }),
          new Textbox({
            key: 'complement',
            label: 'COMPANIE.ADDRESS_CONTACT.COMPLEMENT.LABEL',
            classColumn: 'col-md-6',
            placeholder: 'COMPANIE.ADDRESS_CONTACT.COMPLEMENT.PLACEHOLDER',
          }),
          new Textbox({
            key: 'postalCode',
            label: 'COMPANIE.ADDRESS_CONTACT.POSTAL_CODE.LABEL',
            classColumn: 'col-md-6',
            placeholder: 'COMPANIE.ADDRESS_CONTACT.POSTAL_CODE.PLACEHOLDER',
          }),
          new Textbox({
            key: 'quarter',
            label: 'COMPANIE.ADDRESS_CONTACT.QUARTER.LABEL',
            classColumn: 'col-md-6',
            placeholder: 'COMPANIE.ADDRESS_CONTACT.QUARTER.PLACEHOLDER',
            validators: [Validators.required],
          }),
          new Textbox({
            key: 'city',
            label: 'COMPANIE.ADDRESS_CONTACT.CITY.LABEL',
            classColumn: 'col-md-6',
            placeholder: 'COMPANIE.ADDRESS_CONTACT.CITY.PLACEHOLDER',
            validators: [Validators.required],
          }),
          new Textbox({
            key: 'region',
            label: 'COMPANIE.ADDRESS_CONTACT.REGION.LABEL',
            classColumn: 'col-md-6',
            placeholder: 'COMPANIE.ADDRESS_CONTACT.REGION.PLACEHOLDER',
            validators: [Validators.required],
          }),
          new Textbox({
            key: 'country',
            label: 'COMPANIE.ADDRESS_CONTACT.COUNTRY.LABEL',
            classColumn: 'col-md-6',
            disabled: true,
            value: 'CAMEROON',
            validators: [Validators.required],
          }),
          new Textbox({
            key: 'countryCode',
            label: 'COMPANIE.ADDRESS_CONTACT.COUNTRY_CODE.LABEL',
            classColumn: 'col-md-6',
            disabled: true,
            value: 'CM',
            validators: [Validators.required],
          }),
          new Checkbox({
            key: 'defaultAddress',
            label: 'COMPANIE.ADDRESS_CONTACT.DEFAULT_ADDRESS.LABEL',
            classColumn: 'col-md-6',
            value: false,
          }),
        ],
      }),
      new Textbox({
        key: 'email',
        label: 'COMPANIE.ADDRESS_CONTACT.EMAIL.LABEL',
        classColumn: 'col-md-6',
        type: 'email',
        placeholder: 'COMPANIE.ADDRESS_CONTACT.EMAIL.PLACEHOLDER',
        validators: [Validators.required, Validators.email],
      }),
      new Textbox({
        key: 'website',
        label: 'COMPANIE.ADDRESS_CONTACT.WEBSITE.LABEL',
        classColumn: 'col-md-6',
        type: 'url',
        placeholder: 'COMPANIE.ADDRESS_CONTACT.WEBSITE.PLACEHOLDER',
      }),
      new FormArrayGroup({
        key: 'contacts',
        label: 'COMPANIE.ADDRESS_CONTACT.CONTACTS.ADD_CONTACT',
        classColumn: 'col-md-12',
        initialAddCount: 1,
        childrenFields: [
          new Textbox({
            key: 'phone',
            label: 'COMPANIE.ADDRESS_CONTACT.CONTACTS.PHONE.LABEL',
            classColumn: 'col-md-4',
            type: 'tel',
            value: '',
            validators: [Validators.required, phoneValidator()],
          }),
          new Checkbox({
            key: 'defaultContact',
            label: 'COMPANIE.ADDRESS_CONTACT.CONTACTS.DEFAULT_CONTACT.LABEL',
            classColumn: 'col-md-4',
            value: false,
          }),
          new Checkbox({
            key: 'whatsapp',
            label: 'COMPANIE.ADDRESS_CONTACT.CONTACTS.WHATSAPP.LABEL',
            classColumn: 'col-md-4',
            value: false,
          }),
        ],
      }),
    ],
  }),
];

export const FISCAL_INFO_FIELDS = [
  new Textbox({
    key: 'taxPayerNumber',
    label: 'COMPANIE.FISCAL_INFO.NIF.LABEL',
    required: true,
    classColumn: 'col-md-6',
    order: 1,
    type: 'text',
    placeholder: 'COMPANIE.FISCAL_INFO.NIF.PLACEHOLDER',
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'tradeRegisterNumber',
    label: 'COMPANIE.FISCAL_INFO.RCCM.LABEL',
    required: true,
    order: 2,
    classColumn: 'col-md-6',
    type: 'text',
    placeholder: 'COMPANIE.FISCAL_INFO.RCCM.PLACEHOLDER',
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'shareCapital',
    label: 'COMPANIE.FISCAL_INFO.CAPITAL.LABEL',
    required: true,
    order: 2,
    classColumn: 'col-md-6',
    type: 'number',
    placeholder: 'COMPANIE.FISCAL_INFO.CAPITAL.PLACEHOLDER',
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'taxAttachmentCenter',
    label: 'COMPANIE.FISCAL_INFO.CENTER.LABEL',
    required: true,
    order: 2,
    classColumn: 'col-md-6',
    type: 'text',
    placeholder: 'COMPANIE.FISCAL_INFO.CENTER.PLACEHOLDER',
    validators: [Validators.required],
  }),
  new Select({
    key: 'taxRegime',
    label: 'COMPANIE.FISCAL_INFO.REGIME.LABEL',
    required: true,
    order: 2,
    classColumn: 'col-md-6',
    options: [],
    placeholder: 'COMPANIE.FISCAL_INFO.REGIME.PLACEHOLDER',
    validators: [Validators.required],
  }),
];

export const CONFIGURATION_FIELDS = [
  new FileBox({
    key: 'logo',
    label: 'COMPANIE.CONFIGURATION.LOGO.LABEL',
    required: true,
    classColumn: 'col-md-12',
    maxlength: 10000000,
    accept: 'image/*',
    order: 1,
    type: 'file',
    validators: [Validators.required],
  }),
];
