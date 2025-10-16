import { Component, Input, OnInit, signal } from '@angular/core';
import { QuoteOperation } from '../../../../../shared/model/quote-template.model';

@Component({
  selector: 'app-tree',
  imports: [],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss',
})
export class TreeComponent implements OnInit {
  @Input({ required: true }) operation!: QuoteOperation;
  @Input() parentOperation?: QuoteOperation;

  operationSignal = signal<QuoteOperation>({
    id: '',
    name: '',
    sequence: 0,
    mandatory: false,
    procedes: [],
    childOperations: [],
    isProcess: false,
  });

  parentSignal = signal<QuoteOperation>({
    id: '',
    name: '',
    sequence: 0,
    mandatory: false,
    procedes: [],
    childOperations: [],
    isProcess: false,
  });

  ngOnInit() {
    this.operationSignal.set({ ...this.operation });
    if (this.parentOperation) {
      this.parentSignal.set({ ...this.parentOperation });
    }
  }

  toggleMandatory() {
    this.operationSignal.update(op => ({ ...op, mandatory: !op.mandatory }));
  }

  updateName(name: string) {
    this.operationSignal.update(op => ({ ...op, name }));
  }

  addChild() {
    const newChild: QuoteOperation = {
      id: crypto.randomUUID(),
      name: 'Nouvelle tâche',
      sequence: this.operationSignal().childOperations.length + 1,
      mandatory: false,
      procedes: [],
      childOperations: [],
      isProcess: false,
    };
    this.operationSignal.update(op => ({
      ...op,
      childOperations: [...op.childOperations, newChild],
    }));
    console.log('Nouvelle tâche ajoutée:', this.operationSignal());
  }

  toggleType() {
    this.operationSignal.update(op => ({ ...op, isProcess: !op.isProcess }));
  }

  pocede() {
    return this.operationSignal().procedes.length;
  }

  remove() {
    if (this.parentSignal()) {
      this.parentSignal.update(parent => ({
        ...parent,
        childOperations: parent.childOperations.filter(
          child => child.id !== this.operationSignal().id
        ),
      }));
      console.log('Parent après suppression:', this.parentSignal());
    } else {
      console.warn('Impossible de supprimer, parentSignal non défini');
    }
  }

  openProcedesModal() {
    console.log('Ouvrir modal pour:', this.operationSignal().name);
    // Logique Bootstrap modal ici
  }
}
