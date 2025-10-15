import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../core/services/users.service';
import { UserDialogComponent } from '../../components/users/user-dialog/user-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { AuthService } from '../../core/services/auth.service';
import { DataTableColumn } from '../../interfaces/data-table.interfaces';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [
    DataTableComponent,
  ],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  columns: DataTableColumn[] = [
    { label: 'ID', key: 'id' },
    { label: 'Email', key: 'email' },
    { label: 'Perfil', key: 'role' },
  ];
  displayedColumns: string[] = ['email', 'role', 'actions'];

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getUsers(this.page, this.pageSize).subscribe(res => {
      this.users = res.results;
      this.total = res.count;
    });
  }

  onAddUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.createUser(result).subscribe({
          next: () => {
            this.snack.open('Usuário criado com sucesso!', 'Fechar', { duration: 2000 });
            this.loadUsers();
          },
          error: (err) => {
            this.snack.open(err.error?.message || 'Erro ao criar usuário', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  onDelete(user: any) {
    const confirm = window.confirm('Tem certeza que deseja remover este usuário?');
    if (confirm) {
      this.usersService.deleteUser(user.id).subscribe({
        next: () => {
          this.snack.open('Usuário removido!', 'Fechar', { duration: 2000 });
          this.loadUsers();
        },
        error: () => {
          this.snack.open('Erro ao remover usuário', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }
}
