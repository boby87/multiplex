import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loadingCount = signal(0);
  isLoading = signal(false);

  show(): void {
    this.loadingCount.update(v => v + 1);
    this.isLoading.set(true);
  }

  hide(): void {
    this.loadingCount.update(v => Math.max(0, v - 1));
    if (this.loadingCount() === 0) {
      this.isLoading.set(false);
    }
  }
}
