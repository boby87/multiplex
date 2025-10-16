import { BaseDynamicForm } from './dynamic.form';

export class Select extends BaseDynamicForm<string> {
  override controlType = 'select';
}
