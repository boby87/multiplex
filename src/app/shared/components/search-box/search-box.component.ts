import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface SelectField {
  key: string;
  label: string;
  type?: string;
  multiple?: boolean;
  options: string[];
  action?: (key: string, value: string) => void;
}

@Component({
  selector: 'app-search-box',
  imports: [ReactiveFormsModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss',
})
export class SearchBoxComponent implements OnInit {
  placeholder = input('Search...');
  valueChange = output<string>();
  filterChange = output<string>();
  selectedFilters = input<SelectField[]>([]);
  filterForm = new FormGroup({});

  ngOnInit() {
    for (const filter of this.selectedFilters()) {
      this.filterForm.addControl(filter.key, new FormControl([])); // tableau vide pour multiselect
    }

    this.filterForm.valueChanges.subscribe(value => {

    });
  }

  onFilterChange(key: string, event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedFilters()
      .find(value1 => value1.key === key)
      ?.action?.(key,value);
  }

  onInput(event: any) {
    const inputEl = event.target as HTMLInputElement;
    this.valueChange.emit(inputEl.value);
  }
}
