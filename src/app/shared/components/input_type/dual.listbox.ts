import { BaseDynamicForm } from './dynamic.form';

export class DualListbox extends BaseDynamicForm<string[]> {
  override controlType = 'dual-listbox';
}
