import { USER_ADMIN_PASSWORD_FIELDS } from '../../../../../../../shared/components/templates/utilisateur';
import { IUserUpdateStrategy } from './i.user.update.strategy';

export class AdminPasswordUpdateStrategy implements IUserUpdateStrategy {
  titleKey = 'user.titleUpdatePasswordByAdmin';
  fields = USER_ADMIN_PASSWORD_FIELDS;
}
