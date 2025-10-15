import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssetsService } from '../../core/services/assets.service';
import { AssetDialogComponent } from '../../components/asset/asset-dialog/asset-dialog.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { Asset, CreateAssetDto, UpdateAssetDto } from '../../interfaces/assets.interfaces';
import { DataTableColumn } from '../../interfaces/data-table.interfaces';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  standalone: true,
  imports: [DataTableComponent],
})
export class AssetsComponent implements OnInit {
  assets: Asset[] = [];
  total = 0;
  page = 1;
  pageSize = 10;

  columns: DataTableColumn[] = [
    { label: 'ID', key: 'id' },
    { label: 'Nome', key: 'name' },
    { label: 'Tipo', key: 'type.name', pipe: 'translateAssetType' },
    { label: 'Status', key: 'status.name', pipe: 'translateAssetStatus' },
  ];
  displayedColumns = [...this.columns.map(c => c.key), 'actions'];

  constructor(
    private assetsService: AssetsService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadAssets();
  }

  loadAssets() {
    this.assetsService.getAssets(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.assets = res.results || [];
        this.total = res.count || 0;
      },
      error: () => {
        this.snack.open('Erro ao carregar ativos', 'Fechar', { duration: 3000 });
      },
    });
  }

  onAddAsset() {
    const dialogRef = this.dialog.open(AssetDialogComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe((result: CreateAssetDto) => {
      if (result) {
        this.assetsService.createAsset(result).subscribe({
          next: () => {
            this.snack.open('Ativo criado com sucesso!', 'Fechar', { duration: 2000 });
            this.loadAssets();
          },
          error: (err) => {
            this.snack.open(err.error?.message || 'Erro ao criar ativo', 'Fechar', { duration: 3000 });
          },
        });
      }
    });
  }

  onEditAsset(asset: Asset) {
    const dialogRef = this.dialog.open(AssetDialogComponent, {
      width: '400px',
      data: asset,
    });

    dialogRef.afterClosed().subscribe((result: UpdateAssetDto) => {
      if (result) {
        this.assetsService.updateAsset(asset.id, result).subscribe({
          next: () => {
            this.snack.open('Ativo atualizado com sucesso!', 'Fechar', { duration: 2000 });
            this.loadAssets();
          },
          error: (err) => {
            this.snack.open(err.error?.message || 'Erro ao atualizar ativo', 'Fechar', { duration: 3000 });
          },
        });
      }
    });
  }

  onDeleteAsset(asset: Asset) {
    const confirmDelete = window.confirm('Tem certeza que deseja remover este ativo?');
    if (confirmDelete) {
      this.assetsService.deleteAsset(asset.id).subscribe({
        next: () => {
          this.snack.open('Ativo removido!', 'Fechar', { duration: 2000 });
          this.loadAssets();
        },
        error: () => {
          this.snack.open('Erro ao remover ativo', 'Fechar', { duration: 3000 });
        },
      });
    }
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadAssets();
  }
}
