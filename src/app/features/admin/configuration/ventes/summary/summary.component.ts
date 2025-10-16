import { Component, computed } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { Process, Product, QuoteOperation } from '../../../../../shared/model/quote-template.model';

@Component({
  selector: 'app-summary',
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  constructor(public service: TemplateService) {}

  // ⚡ Récupère toutes les opérations (récursif)
  private collectOperations(ops: QuoteOperation[]): QuoteOperation[] {
    return ops.flatMap(op => [op, ...this.collectOperations(op.childOperations)]);
  }

  totalOperations = computed(() =>
    this.collectOperations(this.service.template().quoteOperations).length
  );

  totalProcedes = computed(() =>
    this.collectOperations(this.service.template().quoteOperations)
      .reduce((acc, op) => acc + op.procedes.length, 0)
  );

  totalProduits = computed(() => {
    const produits: Product[] = [];
    this.collectOperations(this.service.template().quoteOperations).forEach(op => {
      op.procedes.forEach((p: Process) => {
        produits.push(p.main, ...p.products);
      });
    });
    // distinct par id
    const distinct = new Map(produits.map(p => [p.id, p]));
    return distinct.size;
  });
}
