import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-add-button',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './add-button.component.html',
  styleUrl: './add-button.component.scss',
})
export class AddButtonComponent {
  link = input('/');
  label = input('Add New');
  isRouter = input(true);
}
