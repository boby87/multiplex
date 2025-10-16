// field-update-strategy.interface.ts
import { BaseDynamicForm } from '../../../../../../shared/components/input_type/dynamic.form';

export interface FieldUpdateStrategy {
  supports(context: FieldUpdateContext): boolean;
  update(fields: BaseDynamicForm[], context: FieldUpdateContext): void;
}

export interface FieldUpdateContext {
  companyId?: string ;
  departmentId?: string | null;
}
