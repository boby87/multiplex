import { Validators } from '@angular/forms';
import { Textbox } from '../input_type/textbox';
import { Select } from '../input_type/select';
import { FormGroupBox } from '../input_type/form.group.box';

export const DEPARTEMENT_FIELDS = [
  new Textbox({
    value: '',
    key: 'name',
    label: 'DEPARTEMENT.NAME.LABEL',
    required: true,
    classColumn: 'col-md-12',
    order: 1,
    type: 'text',
    placeholder: 'Saisir le nom du département',
    validators: [Validators.required],
  }),

  new FormGroupBox({
    key: 'parent',
    classColumn: 'col-md-12',
    groupFields: [
      new Select({
        key: 'id',
        label: 'DEPARTEMENT.PARENT.LABEL',
        required: true,
        order: 2,
        classColumn: 'col-md-12',
        className: 'form-select',
        options: [],
        placeholder: 'Ex: BES'
      }),
    ],
  }),

  new FormGroupBox({
    key: 'company',
    classColumn: 'col-md-12',
    groupFields: [
      new Select({
        key: 'id',
        label: 'DEPARTEMENT.COMPANY.LABEL',
        required: true,
        order: 3,
        classColumn: 'col-md-12',
        className: 'form-select',
        options: [],
        validators: [Validators.required],
      }),
    ],
  }),
];
