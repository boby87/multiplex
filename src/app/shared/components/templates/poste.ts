import { Validators } from '@angular/forms';
import { Textbox } from '../input_type/textbox';
import { Textarea } from '../input_type/textarea';
import { Select } from '../input_type/select';
import { FormGroupBox } from '../input_type/form.group.box';

export const POSTE_FIELDS = [
  new Textbox({
    key: 'name',
    label: 'POSTE.NAME.LABEL',
    required: true,
    classColumn: 'col-md-12',
    order: 1,
    type: 'text',
    placeholder: 'Saisir le titre du poste',
    validators: [Validators.required],
  }),
  new FormGroupBox({
    key: 'company',
    classColumn: 'col-md-12',
    groupFields: [
      new Select({
        key: 'id',
        label: 'POSTE.COMPANY.LABEL',
        required: true,
        order: 3,
        classColumn: 'col-md-12',
        className: 'form-select',
        options: [],
        validators: [Validators.required],
      }),
    ],
  }),
  new FormGroupBox({
    key: 'department',
    classColumn: 'col-md-12',
    groupFields: [
      new Select({
        key: 'id',
        label: 'POSTE.DEPARTMENT.LABEL',
        required: true,
        order: 2,
        classColumn: 'col-md-12',
        className: 'form-select',
        options: [],
      }),
    ],
  }),
  new Textarea({
    key: 'description',
    label: 'POSTE.DESCRIPTION.LABEL',
    required: true,
    classColumn: 'col-md-12',
    order: 4,
    type: 'text',
    placeholder: 'Saisir la description du poste',
  }),
];
