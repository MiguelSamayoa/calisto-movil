import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '@services/currency.service';

@Pipe({ name: 'gtq', standalone: true, pure: true })
export class GtqCurrencyPipe implements PipeTransform {
  constructor(private cs: CurrencyService) {}

  transform(value: number | null | undefined, compact = false): string {
    return compact ? this.cs.formatCompact(value) : this.cs.format(value);
  }
}
