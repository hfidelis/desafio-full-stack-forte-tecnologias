export interface Company {
  id: number;
  name: string;
  cnpj: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCompanyDto {
  name: string;
  cnpj: string;
}

export interface UpdateCompanyDto {
  name?: string;
  cnpj?: string;
}

export interface PaginatedCompanies {
  results: Company[];
  count: number;
  page: number;
  page_size: number;
}
