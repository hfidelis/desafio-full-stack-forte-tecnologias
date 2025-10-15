import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PaginatedEmployees,
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto
} from '../../interfaces/employee.interfaces';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private baseUrl = 'http://localhost:3000/api/employees';

  constructor(private http: HttpClient) {}

  getEmployees(page: number = 1, page_size: number = 10): Observable<PaginatedEmployees> {
    return this.http.get<PaginatedEmployees>(`${this.baseUrl}?page=${page}&page_size=${page_size}`);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  getEmployeesByCompany(companyId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/company/${companyId}`);
  }

  createEmployee(dto: CreateEmployeeDto): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, dto);
  }

  updateEmployee(id: number, dto: UpdateEmployeeDto): Observable<Employee> {
    return this.http.patch<Employee>(`${this.baseUrl}/${id}`, dto);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
