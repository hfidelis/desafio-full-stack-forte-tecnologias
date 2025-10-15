import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent),
  },
  {
    path: 'companies',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/companies/companies.component').then(m => m.CompaniesComponent),
  },
  {
    path: 'companies/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/company-details/company-details.component').then(m => m.CompanyDetailsComponent),
  },
  {
    path: 'employees/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/employee-details/employee-details.component').then(m => m.EmployeeDetailsComponent),
  },
  {
    path: 'assets',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/assets/assets.component').then(m => m.AssetsComponent),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
