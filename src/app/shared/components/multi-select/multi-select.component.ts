import {
  Component,
  ElementRef,
  HostListener,
  forwardRef,
  ViewEncapsulation,
  signal,
  computed,
  input,
  inject,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface MultiSelectValue {
  selected: string[];
  primary: string | null;
}
// Structure des options passées au composant
export interface MultiSelectOption {
  key: string;
  value: string;
}
@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MultiSelectComponent implements ControlValueAccessor {
  // === Inputs Angular Signals
  options = input.required<MultiSelectOption[]>();
  withPrincipalElement = input<boolean>(false);
  label = input<string>('Sélectionner des éléments');
  placeholder = input<string>('Rechercher...');
  name = input<string>('multiSelect');

  // === UI State
  searchTerm = signal('');
  isDropdownOpen = signal(false);
  private selectedInternal = signal<string[]>([]);
  private primaryInternal = signal<string>('');
  private isDisabled = signal(false);
  private elementRef = inject(ElementRef);

  // === Getters pour le template
  get selectedValues(): string[] {
    return this.selectedInternal();
  }
  get primaryValue(): string  {
    return this.primaryInternal();
  }
  get disabled(): boolean {
    return this.isDisabled();
  }

  // === Options filtrées pour la recherche
  readonly filteredOptions = computed(() =>
    this.options().filter((opt) =>
      opt.value.toLowerCase().includes(this.searchTerm().toLowerCase())
    )
  );

  // === Control Value Accessor (CVA) Implementation
  private onChange: (val: MultiSelectValue) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: MultiSelectValue | null): void {
    if (value && typeof value === 'object') {
      this.selectedInternal.set(value.selected ?? []);
      this.primaryInternal.set(value.primary ?? '');
    } else {
      this.selectedInternal.set([]);
      this.primaryInternal.set('');
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // === Actions déclenchées par le template
  toggleDropdown(): void {
    if(this.disabled) return;
    this.isDropdownOpen.update((o) => !o);
  }

  toggleSelection(option: MultiSelectOption): void {
    const exists = this.selectedValues.includes(option.key);
    const updated = exists
      ? this.selectedValues.filter((v) => v !== option.key)
      : [...this.selectedValues, option.key];

    this.selectedInternal.set(updated);

    // Si on désélectionne la valeur principale, on la réinitialise
    if (this.primaryValue && !updated.includes(this.primaryValue)) {
      this.primaryInternal.set('');
    }

    this.propagateChange();
  }

  setPrimary(key: string): void {
    if (!this.selectedValues.includes(key) || this.disabled) return;
    this.primaryInternal.set(key);
    this.propagateChange();
  }

  removeSelected(key: string): void {
    if(this.disabled) return;
    const updated = this.selectedValues.filter((v) => v !== key);
    this.selectedInternal.set(updated);
    if (this.primaryValue === key) {
      this.primaryInternal.set('');
    }
    this.propagateChange();
  }

  getLabelForValue(key: string): string {
    return this.options().find((o) => o.key === key)?.value ?? key;
  }

  private propagateChange(): void {
    this.onTouched();
    this.onChange({
      selected: this.selectedValues,
      primary: this.primaryValue,
    });
  }

  // === Ferme le dropdown en cliquant à l'extérieur
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen.set(false);
    }
  }
}
