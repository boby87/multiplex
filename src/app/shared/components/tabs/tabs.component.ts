import { Component, input, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

export interface TabConfig {
  id: string;
  form: () => FormGroup;
  fields: () => any; // Remplacez `any` par le type réel si disponible
  label: string;
}
@Component({
  selector: 'app-tabs',
  imports: [TranslatePipe],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  tabs = input.required<TabConfig[]>();
  activeTabClick = output<string>();
  activeTab = input<string>('');
  changeTab(id: string): void {
    this.activeTabClick.emit(id);
  }
}
