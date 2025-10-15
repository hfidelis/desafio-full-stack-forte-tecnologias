export interface DataTableColumn {
  label: string;
  key: string;
  pipe?: 'translateAssetType' | 'translateAssetStatus';
}
