import { BaseDynamicForm } from './dynamic.form';

export class Textarea extends BaseDynamicForm<string> {
  override controlType = 'textarea';
}
