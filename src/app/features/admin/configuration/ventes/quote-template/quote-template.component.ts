import {Component, signal, WritableSignal} from '@angular/core';
import {TreeComponent} from "../tree/tree.component";
import {SummaryComponent} from "../summary/summary.component";
import {TemplateService} from "../services/template.service";
import {ProcessModalComponent} from "../process-modal/process-modal.component";
import {QuoteOperation, QuoteTemplate} from "../../../../../shared/model/quote-template.model";

@Component({
  selector: 'app-quote-template',
  imports: [TreeComponent, SummaryComponent, ProcessModalComponent],
  templateUrl: './quote-template.component.html',
  styleUrl: './quote-template.component.scss',
})
export class QuoteTemplateComponent {

  // Exemple initial
  templateSignal: WritableSignal<QuoteTemplate> = signal({
    templateName: 'Exemple de devis',
    templateDescription: 'Description du template',
    templateType: 'Standard',
    quoteOperations: [
      {
        id: crypto.randomUUID(),
        name: 'Opération principale',
        sequence: 1,
        mandatory: true,
        isProcess: true,
        procedes: [],
        childOperations: []
      }
    ]
  });

  // Ajouter une opération racine
  addRootOperation() {
    const newOp: QuoteOperation = {
      id: crypto.randomUUID(),
      name: 'Nouvelle opération',
      sequence: this.templateSignal().quoteOperations.length + 1,
      mandatory: false,
      procedes: [],
      childOperations: [],
      isProcess: false
    };
    this.templateSignal.update(t => ({
      ...t,
      quoteOperations: [...t.quoteOperations, newOp]
    }));
  }}
