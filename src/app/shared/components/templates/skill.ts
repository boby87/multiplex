import { Textbox } from '../input_type/textbox';
import { Select } from '../input_type/select';
import { BaseDynamicForm } from '../input_type/dynamic.form';
import { Validators } from '@angular/forms';

export const SKILL_FIELDS: BaseDynamicForm<any>[] = [
  new Textbox({
    key: 'name',
    label: 'SKILLS.SKILL_NAME', // i18n
    required: true,
    classColumn: 'col-md-12',
    validators: [Validators.required],
  }),
  new Select({
    key: 'status',
    label: 'SKILLS.STATUS',
    required: true,
    value: '',
    options: [
      { key: 'ACTIVE', value: 'SKILLS.STATUS_ACTIVE' },
      { key: 'PENDING', value: 'SKILLS.STATUS_PENDING' },
    ],
    classColumn: 'col-md-12',
    validators: [Validators.required],
  }),
];
