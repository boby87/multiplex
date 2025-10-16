import { BaseDynamicForm } from '../input_type/dynamic.form';
import { Textbox } from '../input_type/textbox';
import { Textarea } from '../input_type/textarea';
import { Select } from '../input_type/select';

export const ROLE_FIELDS: BaseDynamicForm<any>[] = [
  new Textbox({
    key: 'name',
    label: 'ROLE.NAME.LABEL',
    placeholder: 'Dev',
    required: true,
    classColumn: 'col-md-12',
  }),
  new Select({
    key: 'companies',
    label: 'ROLE.COMPANIES.LABEL',
    classColumn: 'col-md-12',
    value: '',
    options: [],
    required: true,
  }),
  new Textarea({
    key: 'description',
    label: 'ROLE.DESCRIPTION.LABEL',
    placeholder: 'Role Dev',
    required: false,
    classColumn: 'col-md-12',
  }),
];
