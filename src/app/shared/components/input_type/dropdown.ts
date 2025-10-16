import { BaseDynamicForm } from './dynamic.form';

export class Dropdown extends BaseDynamicForm<string> {
  override controlType = 'dropdown';
}
