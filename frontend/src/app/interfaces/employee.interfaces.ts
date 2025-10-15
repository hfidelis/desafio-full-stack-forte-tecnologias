import { Company } from "./company.interfaces";

export interface Employee {
  id: number;
  name: string;
  email: string;
  cpf: string;
  companyId: number;
  company?: Company;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeeDto {
  name: string;
  email: string;
  cpf: string;
  companyId: number;
}

export interface UpdateEmployeeDto {
  name?: string;
  email?: string;
  cpf?: string;
  companyId?: number;
}

export interface PaginatedEmployees {
  page: number;
  page_size: number;
  count: number;
  results: Employee[];
}
