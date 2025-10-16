import { USER_ADDRESS_FIELDS } from '../../../../../../../shared/components/templates/utilisateur';
import { ParamMap } from '@angular/router';
import { IUserUpdateStrategy } from './i.user.update.strategy';

export class AddressesUpdateStrategy implements IUserUpdateStrategy {
  titleKey = 'user.titleUpdateAddress';
  fields = USER_ADDRESS_FIELDS;

  patchData(queryParams: ParamMap) {
    const data = queryParams.get('data');
    return data ? JSON.parse(decodeURIComponent(data)) : null;
  }
}
