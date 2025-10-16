import { Component, Input } from '@angular/core';
import { TabItem } from '../../model/user';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-page-title',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.scss',
})
export class PageTitleComponent {
  @Input() breadcrumbItems: TabItem[] = [];
  @Input() title!: string;
}
