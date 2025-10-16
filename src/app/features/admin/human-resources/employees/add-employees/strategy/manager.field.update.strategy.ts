import { FieldUpdateStrategy } from './field.update.strategy';
import { BaseDynamicForm } from '../../../../../../shared/components/input_type/dynamic.form';
import { updateNestedSelectFields } from '../../../../../../shared/utility/fonction';

export class ManagerFieldUpdateStrategy implements FieldUpdateStrategy {
  constructor(private getEmployees: () => any[]) {}

  supports(): boolean {
    return true; // Toujours applicable à l'init
  }

  update(fields: BaseDynamicForm[]): void {
    updateNestedSelectFields(fields, [
      {
        parentKey: 'manager',
        nestedKey: 'id',
        getOptions: () =>
          this.getEmployees().map(emp => ({
            key: emp.partnerId,
            value: `${emp.firstname} ${emp.lastname}`,
          })),
      },
    ]);
  }
}
