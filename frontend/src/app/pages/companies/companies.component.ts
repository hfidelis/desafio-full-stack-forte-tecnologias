import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompaniesService } from '../../core/services/company.service';
import { CompanyDialogComponent } from '../../components/company/company-dialog/company-dialog.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { Company } from '../../interfaces/company.interfaces';
import { DataTableColumn } from '../../interfaces/data-table.interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  standalone: true,
  imports: [DataTableComponent],
})
export class CompaniesComponent implements OnInit {
  companies: any[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  columns: DataTableColumn[] = [
    { label: 'ID', key: 'id' },
    { label: 'Nome', key: 'name' },
    { label: 'CNPJ', key: 'cnpj' },
  ];
  displayedColumns = [...this.columns.map(c => c.key), 'actions'];

  constructor(
    private companiesService: CompaniesService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.companiesService.getCompanies(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.companies = res.results || [];
        this.total = res.count || 0;
      },
      error: () => {
        this.snack.open('Erro ao carregar empresas', 'Fechar', { duration: 3000 });
      },
    });
  }

  onAddCompany() {
    const dialogRef = this.dialog.open(CompanyDialogComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.companiesService.createCompany(result).subscribe({
          next: () => {
            this.snack.open('Empresa criada com sucesso!', 'Fechar', { duration: 2000 });
            this.loadCompanies();
          },
          error: (err) => {
            this.snack.open(err.error?.message || 'Erro ao criar empresa', 'Fechar', { duration: 3000 });
          },
        });
      }
    });
  }

  onEditCompany(company: Company) {
    const dialogRef = this.dialog.open(CompanyDialogComponent, {
      width: '400px',
      data: company,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.companiesService.updateCompany(company.id, result).subscribe({
          next: () => {
            this.snack.open('Empresa atualizada com sucesso!', 'Fechar', { duration: 2000 });
            this.loadCompanies();
          },
          error: (err) => {
            this.snack.open(err.error?.message || 'Erro ao atualizar empresa', 'Fechar', { duration: 3000 });
          },
        });
      }
    });
  }

  onDelete(company: Company) {
    const confirmDelete = window.confirm('Tem certeza que deseja remover esta empresa?');
    if (confirmDelete) {
      this.companiesService.deleteCompany(company.id).subscribe({
        next: () => {
          this.snack.open('Empresa removida!', 'Fechar', { duration: 2000 });
          this.loadCompanies();
        },
        error: () => {
          this.snack.open('Erro ao remover empresa', 'Fechar', { duration: 3000 });
        },
      });
    }
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadCompanies();
  }

  onRowClick(company: Company) {
    this.router.navigate(['/companies', company.id]);
  }
}
