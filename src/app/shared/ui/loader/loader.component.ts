import { Component, inject } from '@angular/core';
import { LoaderService } from '../../../core/service/loader.service';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent {
  loaderService = inject(LoaderService);
  loading = this.loaderService.isLoading;
}
