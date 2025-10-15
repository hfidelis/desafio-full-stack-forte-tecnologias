import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedCompanies, Company, CreateCompanyDto, UpdateCompanyDto } from '../../interfaces/company.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private baseUrl = 'http://localhost:3000/api/companies';

  constructor(private http: HttpClient) {}

  getCompanies(page: number = 1, page_size: number = 10): Observable<PaginatedCompanies> {
    return this.http.get<PaginatedCompanies>(`${this.baseUrl}?page=${page}&page_size=${page_size}`);
  }

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/${id}`);
  }

  createCompany(dto: CreateCompanyDto): Observable<Company> {
    return this.http.post<Company>(this.baseUrl, dto);
  }

  updateCompany(id: number, dto: UpdateCompanyDto): Observable<Company> {
    return this.http.patch<Company>(`${this.baseUrl}/${id}`, dto);
  }

  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
