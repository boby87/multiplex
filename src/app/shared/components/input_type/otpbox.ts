import { BaseDynamicForm } from './dynamic.form';

export class Otpbox extends BaseDynamicForm<string> {
  override controlType = 'otp';
}
