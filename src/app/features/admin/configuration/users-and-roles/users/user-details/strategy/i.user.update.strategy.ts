import { ParamMap } from '@angular/router';
import { BaseDynamicForm } from '../../../../../../../shared/components/input_type/dynamic.form';
import { PasswordUpdateStrategy } from './password.update.strategy';
import { EmailUpdateStrategy } from './email.update.strategy';
import { AddressesUpdateStrategy } from './addresses.update.strategy';
import { ContactsUpdateStrategy } from './contacts.update.strategy';
import { AdminPasswordUpdateStrategy } from './admin.password.update.strategy';

export interface IUserUpdateStrategy {
  titleKey: string;
  fields: BaseDynamicForm<any>[];
  patchData?: (queryParams: ParamMap) => any;
}
export function getStrategy(updateType: string): IUserUpdateStrategy | null {
  switch (updateType) {
    case 'password': return new PasswordUpdateStrategy();
    case 'adminPassword': return new AdminPasswordUpdateStrategy();
    case 'email': return new EmailUpdateStrategy();
    case 'addresses': return new AddressesUpdateStrategy();
    case 'contacts': return new ContactsUpdateStrategy();
    default: return null;
  }
}
