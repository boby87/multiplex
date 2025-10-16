import { Injectable, signal } from '@angular/core';
import {QuoteOperation, QuoteTemplate} from '../../../../../shared/model/quote-template.model';

@Injectable({ providedIn: 'root' })
export class TemplateService {
  template = signal<QuoteTemplate>({
    templateName: 'Nouveau modèle',
    templateDescription: '',
    templateType: 'Standard',
    quoteOperations: []
  });

  selectedOperation = signal<QuoteOperation>({ id: '', name: '', sequence: 0, mandatory: false, procedes: [], childOperations: [] });
  procedesModalOpen = signal(false);

  addRootOperation() {
    const ops = this.template().quoteOperations;
    ops.push(this.createOperation(`Opération Racine ${ops.length + 1}`));
    this.template.update(t => ({ ...t, quoteOperations: [...ops] }));
  }

  addChildOperation(parent: QuoteOperation) {
    parent.childOperations.push(this.createOperation(`Sous-opération ${parent.childOperations.length + 1}`));
    this.template.update(t => ({ ...t }));
  }

  removeOperation(op: QuoteOperation) {
    const recurse = (ops: QuoteOperation[]) =>
      ops.filter(o => {
        if (o.id === op.id) return false;
        o.childOperations = recurse(o.childOperations);
        return true;
      });
    this.template.update(t => ({
      ...t,
      quoteOperations: recurse(t.quoteOperations)
    }));
  }

  openProcedesModal(op: QuoteOperation) {
    this.selectedOperation.set(op);
    this.procedesModalOpen.set(true);
  }

  private createOperation(name: string): QuoteOperation {
    return {
      id: crypto.randomUUID(),
      name,
      sequence: 1,
      mandatory: false,
      procedes: [],
      childOperations: []
    };
  }
}
