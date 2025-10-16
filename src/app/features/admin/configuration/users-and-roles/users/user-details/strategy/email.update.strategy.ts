import { USER_EMAIL_FIELDS } from '../../../../../../../shared/components/templates/utilisateur';
import { IUserUpdateStrategy } from './i.user.update.strategy';

export class EmailUpdateStrategy implements IUserUpdateStrategy {
  titleKey = 'user.titleUpdateEmail';
  fields = USER_EMAIL_FIELDS;
}
