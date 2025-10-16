import { Component } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { Process, Product, QuoteOperation } from '../../../../../shared/model/quote-template.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-process-modal',
  imports: [FormsModule],
  templateUrl: './process-modal.component.html',
  styleUrl: './process-modal.component.scss',
})
export class ProcessModalComponent {
  constructor(public service: TemplateService) {}

  close() {
    this.service.procedesModalOpen.set(false);
    this.service.selectedOperation.set({} as QuoteOperation);
  }

  addProcede(op: QuoteOperation) {
    op.procedes.push({
      id: crypto.randomUUID(),
      main: { id: crypto.randomUUID(), name: 'Produit principal', unit: 'u' },
      products: [],
    });
    this.service.template.update(t => ({ ...t }));
  }

  removeProcede(op: QuoteOperation, p: Process) {
    op.procedes = op.procedes.filter(pr => pr.id !== p.id);
    this.service.template.update(t => ({ ...t }));
  }

  addProduct(p: Process) {
    p.products.push({
      id: crypto.randomUUID(),
      name: `Produit ${p.products.length + 1}`,
      unit: 'u',
    });
    this.service.template.update(t => ({ ...t }));
  }

  removeProduct(p: Process, prod: Product) {
    p.products = p.products.filter(pr => pr.id !== prod.id);
    this.service.template.update(t => ({ ...t }));
  }
}
