import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat',
  imports: [],
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.scss',
})
export class StatComponent {
  title = input.required<string>();
  value = input.required<string>();
  icon = input.required<string>();
}
