import { Textbox } from '../input_type/textbox';
import { Textarea } from '../input_type/textarea';
import { Checkbox } from '../input_type/checkbox';
import { BaseDynamicForm } from '../input_type/dynamic.form';
import { Validators } from '@angular/forms';

export const CATEGORY_FIELDS: BaseDynamicForm[] = [
  new Textbox({
    key: 'name',
    label: 'Nom de la Catégorie',
    value: '',
    classColumn: 'col-md-12',
    required: true,
    validators: [Validators.required],
  }),

  new Textbox({
    key: 'code',
    label: 'Code',
    value: '',
    classColumn: 'col-md-12',
    required: true,
    placeholder: 'Ex: CODE_TECHNIQUE',
    validators: [Validators.required],
  }),

  new Textarea({
    key: 'description',
    label: 'Description',
    value: '',
    classColumn: 'col-md-12',
  })
];
