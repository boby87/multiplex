import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateArrayToString',
})
export class DateArrayToStringPipe implements PipeTransform {
  transform(
    value: number[] | null | undefined,
    locale = 'default',
    options?: Intl.DateTimeFormatOptions
  ): string {
    if (!value || value.length < 7) {
      return '';
    }

    const [year, month, day, hour, minute, second, nanosecond] = value;

    // Convertir nanosecondes en millisecondes
    const millisecond = Math.floor(nanosecond / 1_000_000);

    // JS Date: mois 0-based donc -1
    const date = new Date(year, month - 1, day, hour, minute, second, millisecond);

    // Formatter la date selon locale et options, par défaut date + time complet
    return date.toLocaleString(locale, options);
  }
}
