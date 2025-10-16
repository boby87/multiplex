import { Textbox } from '../input_type/textbox';
import { BaseDynamicForm } from '../input_type/dynamic.form';
import { Validators } from '@angular/forms';

export const PRODUCT_UOM_FIELDS: BaseDynamicForm[] = [
  new Textbox({
    key: 'name',
    label: 'Nom de l’unité',
    value: '',
    classColumn: 'col-md-6',
    required: true,
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'code',
    label: 'Code',
    value: '',
    classColumn: 'col-md-6',
    required: true,
    placeholder: 'Ex: pot_25kg',
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'description',
    label: 'Description',
    value: '',
    classColumn: 'col-md-12',
  }),
];
