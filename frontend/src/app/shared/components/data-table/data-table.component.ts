import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DataTableColumn } from '../../../interfaces/data-table.interfaces';
import { TranslateAssetPipe } from '../../pipes/translate-asset.pipe';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule],
  providers: [TranslateAssetPipe],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() columns: DataTableColumn[] = [];
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() total = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() emptyMessage: string = '';
  @Input() showAdd: boolean = true;
  @Input() showEdit: boolean = false;
  @Input() pagination: boolean = true;
  @Input() addText: string = '';

  @Output() pageChange = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
  @Output() rowClick = new EventEmitter<any>();

  constructor(private translateAsset: TranslateAssetPipe) {}

  getValue(obj: any, column: DataTableColumn) {
    const rawValue = column.key.split('.').reduce((acc, part) => acc && acc[part], obj);
    if (!column.pipe) return rawValue;

    switch (column.pipe) {
      case 'translateAssetType':
        return this.translateAsset.transform(rawValue, 'type');
      case 'translateAssetStatus':
        return this.translateAsset.transform(rawValue, 'status');
      default:
        return rawValue;
    }
  }
}
