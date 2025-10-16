import { FieldUpdateContext, FieldUpdateStrategy } from './field.update.strategy';
import { BaseDynamicForm } from '../../../../../../shared/components/input_type/dynamic.form';


export class FieldUpdateRegistryStrategy {
  constructor(private strategies: FieldUpdateStrategy[]) {}

  runAll(fields: BaseDynamicForm[], context: FieldUpdateContext): void {
    this.strategies
      .filter(strategy => strategy.supports(context))
      .forEach(strategy => strategy.update(fields, context));
  }
}
