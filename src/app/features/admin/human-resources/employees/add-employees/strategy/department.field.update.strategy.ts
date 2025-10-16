import { FieldUpdateContext, FieldUpdateStrategy } from './field.update.strategy';
import { BaseDynamicForm } from '../../../../../../shared/components/input_type/dynamic.form';
import { updateNestedSelectFields } from '../../../../../../shared/utility/fonction';
export class DepartmentFieldUpdateStrategy implements FieldUpdateStrategy {
  constructor(private getDepartments: () => any[]) {}

  supports(context: FieldUpdateContext): boolean {
    return !!context.companyId;
  }

  update(fields: BaseDynamicForm[], context: FieldUpdateContext): void {
    updateNestedSelectFields(fields, [
      {
        parentKey: 'department',
        nestedKey: 'id',
        getOptions: () =>
          this.getDepartments()
            .filter(dept => dept.companyId === context.companyId)
            .map(dept => ({
              key: dept.departmentId,
              value: dept.name,
            })),
      },
    ]);
  }
}
