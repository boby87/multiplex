import { BaseDynamicForm } from './dynamic.form';

export class FormArrayGroup extends BaseDynamicForm<string> {
  override controlType = 'formArray';
}
