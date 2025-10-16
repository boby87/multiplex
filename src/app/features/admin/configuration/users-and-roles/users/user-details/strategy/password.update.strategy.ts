import { USER_PASSWORD_FIELDS } from '../../../../../../../shared/components/templates/utilisateur';
import { IUserUpdateStrategy } from './i.user.update.strategy';

export class PasswordUpdateStrategy implements IUserUpdateStrategy {
  titleKey = 'user.titleUpdatePassword';
  fields = USER_PASSWORD_FIELDS;
}
