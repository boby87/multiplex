import { Component, input, OnInit } from '@angular/core';
import { BaseDynamicForm } from '../input_type/dynamic.form';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dynamic-form-accordion',
  imports: [DynamicFieldComponent, ReactiveFormsModule, TranslatePipe],
  templateUrl: './dynamic-form-accordion.component.html',
  styleUrl: './dynamic-form-accordion.component.scss',
})
export class DynamicFormAccordionComponent implements OnInit {
  // Entrées du composant : la liste des champs et le formulaire principal
  fields = input.required<BaseDynamicForm<any>[]>();
  form = input.required<FormGroup>();
  // Propriété pour suivre l'élément actif de l'accordéon. `null` signifie qu'aucun n'est ouvert.
  activeAccordionKey: string | null = null;

  ngOnInit(): void {
    // Optionnel : Ouvre la première section de type "groupe" par défaut au chargement de la page.
    // Cela guide l'utilisateur vers la première action à effectuer.
    const firstGroupField = this.fields().find(f => f.controlType === 'formGroup');
    if (firstGroupField) {
      this.activeAccordionKey = firstGroupField.key;
    }
  }

  /**
   * Affiche ou cache une section de l'accordéon en fonction de sa clé.
   * @param key La clé unique de la section sur laquelle l'utilisateur a cliqué.
   */
  toggleAccordion(key: string): void {
    // Si l'utilisateur clique sur la section déjà ouverte, on la ferme (en mettant la clé active à `null`).
    if (this.activeAccordionKey === key) {
      this.activeAccordionKey = null;
    } else {
      // Sinon, on définit la section cliquée comme la nouvelle section active.
      this.activeAccordionKey = key;
    }
  }

  /**
   * Récupère une référence à un `FormGroup` imbriqué dans le formulaire principal.
   * Nécessaire pour passer le bon groupe de contrôles au composant enfant `app-dynamic-field`.
   * @param key La clé du FormGroup à récupérer.
   * @returns Le FormGroup correspondant à la clé.
   */
  getFormGroup(key: string): FormGroup {
    return this.form().get(key) as FormGroup;
  }
}
