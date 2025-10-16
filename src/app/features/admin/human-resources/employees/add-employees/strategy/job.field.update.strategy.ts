import { FieldUpdateContext, FieldUpdateStrategy } from './field.update.strategy';
import { BaseDynamicForm } from '../../../../../../shared/components/input_type/dynamic.form';
import { updateNestedSelectFields } from '../../../../../../shared/utility/fonction';

export class JobFieldUpdateStrategy implements FieldUpdateStrategy {
  constructor(private getJobs: () => any[]) {}

  supports(context: FieldUpdateContext): boolean {
    return !!context.departmentId;
  }

  update(fields: BaseDynamicForm[], context: FieldUpdateContext): void {
    updateNestedSelectFields(fields, [
      {
        parentKey: 'job',
        nestedKey: 'id',
        getOptions: () =>
          this.getJobs()
            .filter(job => job.departmentId === context.departmentId)
            .map(job => ({
              key: job.jobId,
              value: job.name,
            })),
      },
    ]);
  }
}
