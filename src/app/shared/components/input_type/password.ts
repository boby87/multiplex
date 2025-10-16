import { BaseDynamicForm } from './dynamic.form';

export class Password extends BaseDynamicForm<string> {
  override controlType = 'password';

  override toggleType(): void {
    this.type = this.type === 'password' ? 'text' : 'password';
  }
}
