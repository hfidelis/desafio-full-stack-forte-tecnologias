import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../../core/services/employee.service';
import { AssetsService } from '../../core/services/assets.service';
import { Employee } from '../../interfaces/employee.interfaces';
import { DataTableColumn } from '../../interfaces/data-table.interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { Asset } from '../../interfaces/assets.interfaces';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AssociateAssetsDialog } from '../../components/asset/associate-dialog/associate-asset-dialog.component';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
  standalone: true,
  imports: [DataTableComponent, CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, DatePipe],
})
export class EmployeeDetailsComponent implements OnInit {
  employeeId!: number;
  employee?: Employee;

  assets: Asset[] = [];
  availableAssets: Asset[] = [];

  assetColumns: DataTableColumn[] = [
    { label: 'ID', key: 'id' },
    { label: 'Nome', key: 'name' },
    { label: 'Tipo', key: 'type.name', pipe: 'translateAssetType' },
    { label: 'Status', key: 'status.name', pipe: 'translateAssetStatus' },
  ];
  displayedAssetColumns = [...this.assetColumns.map(c => c.key), 'actions'];

  constructor(
    private route: ActivatedRoute,
    private employeesService: EmployeesService,
    private assetsService: AssetsService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEmployee();
    this.loadAssets();
    this.loadAvailableAssets();
  }

  loadEmployee() {
    this.employeesService.getEmployeeById(this.employeeId).subscribe({
      next: (res) => (this.employee = res),
      error: () => this.snack.open('Erro ao carregar funcionário', 'Fechar', { duration: 3000 }),
    });
  }

  loadAssets() {
    this.assetsService.getAssetsByEmployee(this.employeeId).subscribe({
      next: (res) => (this.assets = res),
      error: () => this.snack.open('Erro ao carregar ativos', 'Fechar', { duration: 3000 }),
    });
  }

  loadAvailableAssets() {
    this.assetsService.getAssets(1, 1000).subscribe({
      next: (res) => {
        this.availableAssets = res.results.filter(a => a.status.name === 'available');
      },
      error: () => this.snack.open('Erro ao carregar ativos disponíveis', 'Fechar', { duration: 3000 }),
    });
  }

  unassociateAsset(asset: Asset) {
    this.assetsService.unassignAsset(asset.id).subscribe({
      next: () => {
        this.snack.open(`Ativo "${asset.name}" desassociado!`, 'Fechar', { duration: 2000 });
        this.loadAssets();
        this.loadAvailableAssets();
      },
      error: () => this.snack.open('Erro ao desassociar ativo', 'Fechar', { duration: 3000 }),
    });
  }

  onAssociateAsset() {
    const dialogRef = this.dialog.open(AssociateAssetsDialog, {
      width: '400px',
      data: { availableAssets: this.availableAssets },
    });

    dialogRef.afterClosed().subscribe((selectedAssets: Asset[] | undefined) => {
      if (selectedAssets && selectedAssets.length) {
        selectedAssets.forEach(asset => {
          this.assetsService.assignAssetToEmployee(asset.id, this.employeeId).subscribe({
            next: () => {
              this.snack.open(`Ativo "${asset.name}" associado!`, 'Fechar', { duration: 2000 });
              this.loadAssets();
              this.loadAvailableAssets();
            },
            error: (error) => {
              this.snack.open(error.error?.message || `Erro ao associar ativo "${asset.name}"`, 'Fechar', { duration: 3000 });
            }
          });
        });
      }
    });
  }
}
