import { BaseDynamicForm } from './dynamic.form';

export class FileBox extends BaseDynamicForm<string> {
  override controlType = 'file';
}
