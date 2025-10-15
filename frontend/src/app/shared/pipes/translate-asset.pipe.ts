import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateAsset',
  standalone: true,
})
@Injectable({ providedIn: 'root' })
export class TranslateAssetPipe implements PipeTransform {
  private typeMap: Record<string, string> = {
    notebook: 'Notebook',
    monitor: 'Monitor',
    smartphone: 'Smartphone',
    tablet: 'Tablet',
    desktop: 'Desktop',
    printer: 'Impressora',
    other: 'Outro',
  };

  private statusMap: Record<string, string> = {
    available: 'Disponível',
    allocated: 'Em uso',
    maintenance: 'Em manutenção',
  };

  transform(value: string, kind: 'type' | 'status'): string {
    if (!value) return '';
    if (kind === 'type') return this.typeMap[value] || value;
    if (kind === 'status') return this.statusMap[value] || value;
    return value;
  }
}
