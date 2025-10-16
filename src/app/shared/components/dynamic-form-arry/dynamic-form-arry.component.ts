import { Component, ElementRef, inject, input, QueryList, ViewChildren } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component';
import { FormArrayGroup } from '../input_type/form.array.group';
import { DynamicFormGroupComponent } from '../dynamic-form-group/dynamic-form-group.component';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseDynamicForm } from '../input_type/dynamic.form';

export const toFormGroupArray = (
  formBuilder: FormBuilder,
  fields: BaseDynamicForm<any>[]
): FormGroup => {
  const group: Record<string, any> = {};

  fields
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .forEach(field => {
      const key = field.key;
      if (!key) return;

      // Gestion des FormArray
      if (field.controlType === 'formArray' && field.childrenFields) {
        const count = field.initialAddCount ?? 1;
        const formArray = formBuilder.array(
          Array.from({ length: count }, () => toFormGroupArray(formBuilder, field.childrenFields!))
        );
        group[key] = formArray;
        return;
      }

      // Gestion des FormGroup imbriqués
      if (field.controlType === 'formGroup' && field.groupFields) {
        group[key] = toFormGroupArray(formBuilder, field.groupFields);
        return;
      }

      // Gestion des champs simples
      const controlValue = field.value ?? null;
      const disabled = field.disabled ?? false;
      const validators = field.validators ?? [];

      group[key] = formBuilder.control({ value: controlValue, disabled }, validators);
    });

  return formBuilder.group(group);
};

@Component({
  selector: 'app-dynamic-form-arry',
  imports: [ReactiveFormsModule, DynamicFieldComponent, DynamicFormGroupComponent, TranslatePipe],
  templateUrl: './dynamic-form-arry.component.html',
  styleUrl: './dynamic-form-arry.component.scss',
})
export class DynamicFormArryComponent {
  @ViewChildren('logoInput') logoInputs!: QueryList<ElementRef>;
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>;

  fields = input.required<BaseDynamicForm<any>[]>();
  form = input.required<FormGroup>();
  fb = inject(FormBuilder);

  getNestedFormGroup(fieldKey: string, i: number, childKey: string): FormGroup {
    return (this.form().get(fieldKey) as FormArray).at(i).get(childKey) as FormGroup;
  }

  getNestedFormArray(fieldKey: string, i: number, childKey: string): FormArray {
    return (this.form().get(fieldKey) as FormArray).at(i).get(childKey) as FormArray;
  }

  getNestedFormGroupFromArray(fieldKey: string, i: number, childKey: string, j: number): FormGroup {
    return this.getNestedFormArray(fieldKey, i, childKey).at(j) as FormGroup;
  }

  getFormGroup(key: string): FormGroup {
    const group = this.form().get(key);
    if (!group || !(group instanceof FormGroup)) {
      throw new Error(`Le champ '${key}' n'est pas un FormGroup valide.`);
    }
    return group;
  }

  getFormGroupFromArray(fieldKey: string, index: number): FormGroup {
    const array = this.getFormArray(fieldKey);
    const control = array.at(index);
    if (!(control instanceof FormGroup)) {
      throw new Error(`Item at index ${index} is not a FormGroup`);
    }
    return control;
  }

  getFormArray(key: string): FormArray {
    const control = this.form().get(key);
    if (!control || !(control instanceof FormArray)) {
      throw new Error(`Le champ '${key}' n'est pas un FormArray valide`);
    }
    return control;
  }

  createChildFormGroup(fields: BaseDynamicForm<any>[]): FormGroup {
    const group: Record<string, any> = {};

    for (const field of fields) {
      if (field.controlType === 'formGroup' && field.groupFields) {
        group[field.key] = this.createChildFormGroup(field.groupFields);
      } else if (field.controlType === 'formArray' && field.childrenFields) {
        group[field.key] = new FormArray([]);
      } else {
        group[field.key] = new FormControl(field.value ?? null);
      }
    }

    return new FormGroup(group);
  }

  addFormArrayItem(formArrayKey: string, childrenFields?: BaseDynamicForm<any>[]): void {
    try {
      const form = this.form(); // ou le FormGroup parent que tu utilises
      const existing = form.get(formArrayKey);

      let formArray: FormArray;

      if (!existing) {
        // FormArray n'existe pas encore, on le crée
        formArray = new FormArray<any>([]);
        form.addControl(formArrayKey, formArray);
      } else if (existing instanceof FormArray) {
        formArray = existing;
      } else {
        throw new Error(`La clé '${formArrayKey}' existe déjà mais n'est pas un FormArray`);
      }

      // Ajoute un nouveau groupe d'enfants au FormArray
      formArray.push(this.createChildFormGroup(childrenFields || []));
    } catch (err) {
      console.error(`Erreur lors de l'ajout à FormArray '${formArrayKey}'`, err);
    }
  }

  removeFormArrayItem(formArrayKey: string, index: number): void {
    try {
      const formArray = this.getFormArray(formArrayKey);
      if (formArray.length > 1) {
        formArray.removeAt(index);
      }
    } catch (err) {
      console.error(`Erreur lors de la suppression dans FormArray '${formArrayKey}'`, err);
    }
  }

  removeNestedFormArrayItem(
    parentArrayKey: string,
    parentIndex: number,
    nestedArrayKey: string,
    nestedIndex: number
  ): void {
    try {
      const parentArray = this.form().get(parentArrayKey);

      if (!(parentArray instanceof FormArray)) {
        throw new Error(`'${parentArrayKey}' n'est pas un FormArray`);
      }

      const parentGroup = parentArray.at(parentIndex);
      if (!(parentGroup instanceof FormGroup)) {
        throw new Error(
          `Élément à l'index ${parentIndex} dans '${parentArrayKey}' n'est pas un FormGroup`
        );
      }

      const nestedArray = parentGroup.get(nestedArrayKey);
      if (!(nestedArray instanceof FormArray)) {
        throw new Error(
          `'${nestedArrayKey}' n'est pas un FormArray dans '${parentArrayKey}[${parentIndex}]'`
        );
      }

      if (nestedArray.length > 1) {
        nestedArray.removeAt(nestedIndex);
      } else {
        console.warn(
          `Impossible de supprimer : il doit rester au moins un élément dans '${nestedArrayKey}'`
        );
      }
    } catch (error) {
      console.error(
        `Erreur lors de la suppression dans le FormArray imbriqué '${nestedArrayKey}'`,
        error
      );
    }
  }

  addNestedFormArrayItem(parentKey: string, parentIndex: number, field: FormArrayGroup) {
    const parentFormArray = this.form().get(parentKey) as FormArray;
    const parentGroup = parentFormArray.at(parentIndex) as FormGroup;

    const nestedArray = parentGroup.get(field.key) as FormArray;
    if (!nestedArray) return;

    const newGroup = this.buildFormGroup(field.childrenFields);
    nestedArray.push(newGroup);
  }
  private buildFormGroup(fields: BaseDynamicForm<any>[]): FormGroup {
    const group: Record<string, any> = {};

    for (const field of fields) {
      if (field.controlType === 'formGroup' && field.groupFields) {
        group[field.key] = this.buildFormGroup(field.groupFields);
      } else if (field.controlType === 'formArray' && field.childrenFields) {
        const initial = new FormArray([]);
        group[field.key] = initial;
      } else {
        group[field.key] = new FormControl(field.value ?? null, field.validators ?? []);
      }
    }
    console.log(`Création du FormGroup avec les champs`, group);
    return new FormGroup(group);
  }
}
