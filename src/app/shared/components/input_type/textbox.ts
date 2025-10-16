import { BaseDynamicForm } from './dynamic.form';

export class Textbox extends BaseDynamicForm<string> {
  override controlType = 'textbox';
}
