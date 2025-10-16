import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuoteOperation } from '../../model/quote-template.model';


@Component({
  selector: 'app-quote-form',
  imports: [],
  templateUrl: './quote-form.component.html',
  styleUrl: './quote-form.component.scss',
})
export class QuoteFormComponent {
  @Input() operation!: QuoteOperation;
  @Output() operationChange = new EventEmitter<QuoteOperation>();
  @Output() delete = new EventEmitter<void>();

  toggleMandatory() {
    this.operation.mandatory = !this.operation.mandatory;
    this.operationChange.emit(this.operation);
  }

  updateName(newName: string) {
    this.operation.name = newName;
    this.operation.id = newName.toUpperCase().replace(/\s+/g, '-');
    this.operationChange.emit(this.operation);
  }

  addChild() {
    const newOp: QuoteOperation = {
      id: crypto.randomUUID(),
      name: 'Nouvelle tâche',
      mandatory: true,
      isProcess: true,
      sequence: (this.operation.childOperations?.length ?? 0) + 1,
      childOperations: [],
      procedes: [],
    };
    this.operation.childOperations?.push(newOp);
    this.operationChange.emit(this.operation);
  }

  toggleType() {
    this.operation.isProcess = !this.operation.isProcess;
    if (this.operation.isProcess) {
      this.operation.procedes = [];
    } else {
      this.operation.childOperations = [];
    }
    this.operationChange.emit(this.operation);
  }
  pocede(): number{
    return this.operation?.procedes?.length
  }
  remove() {
    this.delete.emit();
  }
}
