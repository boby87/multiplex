import { FieldUpdateStrategy } from './field.update.strategy';
import { BaseDynamicForm } from '../../../../../../shared/components/input_type/dynamic.form';
import { updateNestedSelectFields } from '../../../../../../shared/utility/fonction';

export class CompanyFieldUpdateStrategy implements FieldUpdateStrategy {
  constructor(private getCompanies: () => any[]) {}

  supports(): boolean {
    return true; // Toujours applicable à l'init
  }

  update(fields: BaseDynamicForm[]): void {
    updateNestedSelectFields(fields, [
      {
        parentKey: 'company',
        nestedKey: 'id',
        getOptions: () =>
          this.getCompanies().map(company => ({
            key: company.companyId!,
            value: company.code!,
          })),
      },
    ]);
  }
}
