import { USER_CONTACT_FIELDS } from '../../../../../../../shared/components/templates/utilisateur';
import { IUserUpdateStrategy } from './i.user.update.strategy';
import { ParamMap } from '@angular/router';

export class ContactsUpdateStrategy implements IUserUpdateStrategy {
  titleKey = 'user.titleUpdateContact';
  fields = USER_CONTACT_FIELDS;

  patchData(queryParams: ParamMap) {
    const data = queryParams.get('data');
    return data ? JSON.parse(decodeURIComponent(data)) : null;
  }
}
