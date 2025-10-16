import { BaseDynamicForm } from './dynamic.form';

export class Multiselect extends BaseDynamicForm<string[]> {
  override controlType = 'multiselect';
}
