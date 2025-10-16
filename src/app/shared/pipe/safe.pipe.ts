// src/app/shared/pipes/safe.pipe.ts

import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safe'})
export class SafePipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer)
  transform(url: string | null | undefined): SafeResourceUrl | null {
    if (!url) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
