import { FieldOptionProvider } from './skills.option.provider';
import { BaseDynamicForm } from '../../../../shared/components/input_type/dynamic.form';
import { Select } from '../../../../shared/components/input_type/select';
import { MultiSelectValue } from '../../../../shared/components/multi-select/multi-select.component';
import { Multiselect } from '../../../../shared/components/input_type/multiselect';

export class FieldUpdateRegistry {
  private providers = new Map<string, FieldOptionProvider>();

  register(fieldKey: string, provider: FieldOptionProvider) {
    this.providers.set(fieldKey, provider);
  }

  apply(fields: BaseDynamicForm[]) {
    fields.forEach(field => {
      const provider = this.providers.get(field.key);

      if (field.key == 'skills' && provider && field.controlType === 'multiselect') {
        (field as Multiselect).options = provider.getOptions({});
      } else if (field.key == 'technicianType' && provider && field.controlType === 'select') {
        (field as Select).options = provider.getOptions({});
      } else if (provider && field.controlType === 'select') {
        (field as Select).options = provider.getOptions({});
      }
    });
  }
}
