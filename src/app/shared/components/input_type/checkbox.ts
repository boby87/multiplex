import { BaseDynamicForm } from './dynamic.form';

export class Checkbox extends BaseDynamicForm<boolean> {
  override controlType = 'checkbox';
}
