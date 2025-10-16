import { BaseDynamicForm } from './dynamic.form';

export class FormGroupBox extends BaseDynamicForm<string> {
  override controlType = 'formGroup';
}
