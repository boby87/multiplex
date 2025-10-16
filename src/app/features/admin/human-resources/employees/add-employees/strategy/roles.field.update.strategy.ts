import { FieldUpdateContext, FieldUpdateStrategy } from './field.update.strategy';
import { BaseDynamicForm } from '../../../../../../shared/components/input_type/dynamic.form';

export class RolesFieldUpdateStrategy implements FieldUpdateStrategy {
  constructor(private getRoles: () => any[]) {}

  supports(context: FieldUpdateContext): boolean {
    return !!context.companyId;
  }

  update(fields: BaseDynamicForm[], context: FieldUpdateContext): void {
    const rolesField = fields.find(f => f.key === 'roles');
    if (rolesField) {
      rolesField.options = this.getRoles()
        .filter(role => role.companies?.includes(context.companyId))
        .map(role => ({
          key: role.name!,
          value: role.name!,
        }));
    }
  }
}
