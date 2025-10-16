import {
  Component,
  computed,
  forwardRef,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dual-listbox',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './dual-listbox.component.html',
  styleUrls: ['./dual-listbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DualListboxComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class DualListboxComponent implements ControlValueAccessor {
  options = input.required<{ key: string; value: string }[]>();
  label = input<string>('Sélectionnez des éléments');
  name = input<string>('dual-listbox');

  addAllLabel = input<string>('>>');
  removeAllLabel = input<string>('<<');

  private selectedInternal = signal<string[]>([]); // vide par défaut
  searchLeft = signal('');
  searchRight = signal('');
  private isDisabled = signal(false);

  private readonly uid = Math.random().toString(36).slice(2, 9);
  readonly availableListId = `dual-available-${this.uid}`;
  readonly selectedListId = `dual-selected-${this.uid}`;

  get selectedValues(): string[] {
    return this.selectedInternal();
  }
  get disabled(): boolean {
    return this.isDisabled();
  }

  readonly filteredAvailable = computed(() =>
      this.options().filter(
          o =>
              !this.selectedValues.includes(o.key) &&
              o.value.toLowerCase().includes(this.searchLeft().toLowerCase())
      )
  );

  readonly filteredSelected = computed(() =>
      this.options()
          .filter(o => this.selectedValues.includes(o.key))
          .filter(o => o.value.toLowerCase().includes(this.searchRight().toLowerCase()))
  );

  private onChange: (val: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(values: string[] | null | undefined): void {
    // Si values est fourni, on initialise avec, sinon rien à droite
    this.selectedInternal.set(values ? [...values] : []);
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

  add(key: string): void {
    if (!this.selectedValues.includes(key)) {
      const updated = [...this.selectedValues, key];
      this.selectedInternal.set(updated);
      this.onChange(updated);
    }
  }

  remove(key: string): void {
    const updated = this.selectedValues.filter(v => v !== key);
    this.selectedInternal.set(updated);
    this.onChange(updated);
  }

  addAll(): void {
    const toAdd = this.filteredAvailable().map(o => o.key);
    const updated = Array.from(new Set([...this.selectedValues, ...toAdd]));
    this.selectedInternal.set(updated);
    this.onChange(updated);
  }

  removeAll(): void {
    if (this.selectedValues.length > 0) {
      this.selectedInternal.set([]);
      this.onChange([]);
    }
  }

  onDrop(event: CdkDragDrop<any>): void {
    if (this.disabled) return;

    const item: { key: string; value: string } | undefined = event.item?.data;
    if (!item) return;

    if (event.container.id === this.selectedListId) {
      this.add(item.key);
    } else if (event.container.id === this.availableListId) {
      this.remove(item.key);
    }
  }
}
