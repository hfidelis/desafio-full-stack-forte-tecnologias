import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../../core/services/employee.service';
import { CompaniesService } from '../../core/services/company.service';
import { Employee } from '../../interfaces/employee.interfaces';
import { DataTableColumn } from '../../interfaces/data-table.interfaces';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDialogComponent } from '../../components/employee/employee-dialog/employee-dialog.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { Company } from '../../interfaces/company.interfaces';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'],
  standalone: true,
  imports: [ DataTableComponent , DatePipe ],
})
export class CompanyDetailsComponent implements OnInit {
  companyId!: number;
  company?: Company;

  employees: Employee[] = [];

  columns: DataTableColumn[] = [
    { label: 'ID', key: 'id' },
    { label: 'Nome', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'CPF', key: 'cpf' },
  ];
  displayedColumns = [...this.columns.map(c => c.key), 'actions'];

  constructor(
    private route: ActivatedRoute,
    private employeesService: EmployeesService,
    private companiesService: CompaniesService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCompany();
    this.loadEmployees();
  }

  loadCompany() {
    this.companiesService.getCompanyById(this.companyId).subscribe({
      next: (res) => {
        this.company = res;
      },
      error: () => {
        this.snack.open('Erro ao carregar dados da empresa', 'Fechar', { duration: 3000 });
      },
    });
  }

  loadEmployees() {
    this.employeesService.getEmployeesByCompany(this.companyId).subscribe({
      next: (res) => {
        this.employees = res;
      },
      error: () => {
        this.snack.open('Erro ao carregar funcionários', 'Fechar', { duration: 3000 });
      },
    });
  }

  onAddEmployee() {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeesService.createEmployee({ ...result, companyId: this.companyId }).subscribe({
          next: () => {
            this.snack.open('Funcionário criado com sucesso!', 'Fechar', { duration: 2000 });
            this.loadEmployees();
          },
          error: (err) => {
            this.snack.open(err.error?.message || 'Erro ao criar funcionário', 'Fechar', { duration: 3000 });
          },
        });
      }
    });
  }

  onEditEmployee(employee: Employee) {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '400px',
      data: employee,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeesService.updateEmployee(employee.id, result).subscribe({
          next: () => {
            this.snack.open('Funcionário atualizado com sucesso!', 'Fechar', { duration: 2000 });
            this.loadEmployees();
          },
          error: (err) => {
            this.snack.open(err.error?.message || 'Erro ao atualizar funcionário', 'Fechar', { duration: 3000 });
          },
        });
      }
    });
  }

  onDelete(employee: Employee) {
    const confirmDelete = window.confirm('Tem certeza que deseja remover este funcionário?');
    if (confirmDelete) {
      this.employeesService.deleteEmployee(employee.id).subscribe({
        next: () => {
          this.snack.open('Funcionário removido!', 'Fechar', { duration: 2000 });
          this.loadEmployees();
        },
        error: () => {
          this.snack.open('Erro ao remover funcionário', 'Fechar', { duration: 3000 });
        },
      });
    }
  }

  onRowClick(employee: Employee) {
    this.router.navigate(['/employees', employee.id]);
  }
}
